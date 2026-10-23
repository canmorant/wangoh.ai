/**
 * Açılışta kayıtlı oturumu geri yükler (saf orkestrasyon: depo ve ağ dışarıdan verilir, Node altında
 * sahte bağımlılıklarla test edilir; bkz. restoreSession.test.ts).
 *
 * KARAR (çevrimdışı/yavaş ağ): belirteç varsa kullanıcı AĞI BEKLEMEDEN, yerel kopyayla oturumlu
 * gösterilir ve `GET /v1/auth/me` arka planda doğrular.
 *   - doğrulandı        -> güncel kullanıcı işlenir ve kopya yenilenir.
 *   - sunucu reddetti   -> belirteç + kopya silinir, oturum kapanır (hesap silinmiş/devre dışı/iptal).
 *   - ulaşılamadı / yavaş / 5xx / 429 -> oturum DÜŞMEZ: kopya varsa oturumlu kalınır, "unverified" döner
 *     ve uygulama öne her dönüşünde doğrulama yeniden denenir. Gerçekten geçersiz bir oturumda ilk
 *     yetkili istek zaten 401 -> yenileme reddi -> `onAuthFailure` ile kapanır.
 *   - kopya yoksa (ilk sürüm, silinmiş kopya) kullanıcı bilinmeden oturumlu gösterilemez: bekler
 *     (en çok `verifyTimeoutMs`), sonra oturumsuz görünür ama BELİRTEÇ KORUNUR; ağ gelince tekrar denenir.
 */
import type { AuthUser } from "./AuthContext";
import type { AuthAction } from "./authState";
import type { AuthTokens } from "./tokenStorageCore";

export interface RestoreDeps {
  readTokens(): Promise<AuthTokens | null>;
  readCachedUser(): Promise<AuthUser | null>;
  /** `GET /v1/auth/me` (gerekirse api-client 401'de belirteci yeniler). Hata fırlatır. */
  fetchMe(): Promise<AuthUser>;
  saveUser(user: AuthUser): Promise<void>;
  /** Belirteçleri ve kullanıcı kopyasını siler. */
  clearSession(): Promise<void>;
  emit(action: AuthAction): void;
  /** Oturum bu arada değiştiyse (giriş, çıkış, hesap reddi) eski sonuç uygulanmaz. */
  isStale(): boolean;
  /** Doğrulama isteği için en uzun bekleme (ms). */
  verifyTimeoutMs: number;
}

export type RestoreOutcome =
  /** Kayıtlı belirteç yoktu. */
  | "none"
  /** Sunucu kullanıcıyı doğruladı. */
  | "verified"
  /** Sunucu oturumu reddetti; yerel oturum silindi. */
  | "rejected"
  /** Doğrulanamadı (ağ/zaman aşımı/sunucu hatası); belirteç korundu, sonra yeniden denenmeli. */
  | "unverified"
  /** Oturum bu arada başka bir yolla değişti; hiçbir şey uygulanmadı. */
  | "stale";

/**
 * Hata, sunucunun oturumu reddetmesi mi (true) yoksa geçici bir ulaşım sorunu mu (false)?
 * Durum kodu olmayan hata (kod hatası, ayrıştırma) oturumu SİLMEZ: yanlış alarm kullanıcıyı çıkarmasın.
 */
export function isSessionRejected(error: unknown): boolean {
  const status = typeof error === "object" && error !== null ? (error as { status?: unknown }).status : undefined;
  if (typeof status !== "number") return false;
  if (status === 0 || status === 408 || status === 429 || status >= 500) return false;
  return status >= 400;
}

type Settled = { kind: "ok"; user: AuthUser } | { kind: "error"; error: unknown } | { kind: "timeout" };

export async function restoreSession(deps: RestoreDeps): Promise<RestoreOutcome> {
  const tokens = await deps.readTokens();
  if (deps.isStale()) return "stale";
  if (!tokens) {
    await deps.clearSession(); // belirteçsiz kullanıcı kopyası anlamsız
    if (deps.isStale()) return "stale";
    deps.emit({ type: "signedOut" });
    return "none";
  }

  const cached = await deps.readCachedUser();
  if (deps.isStale()) return "stale";
  if (cached) deps.emit({ type: "signedIn", user: cached });

  const pending = deps.fetchMe();
  const settled = await settleWithin(pending, deps.verifyTimeoutMs);
  if (deps.isStale()) return "stale";

  if (settled.kind === "ok") {
    await applyVerified(deps, settled.user);
    return "verified";
  }

  if (settled.kind === "error" && isSessionRejected(settled.error)) {
    await deps.clearSession();
    if (deps.isStale()) return "stale";
    deps.emit({ type: "signedOut" });
    return "rejected";
  }

  // Geçici sorun: oturum düşmez. Kopya yoksa kullanıcı bilinmediği için oturumsuz görünür (belirteç durur).
  if (!cached) deps.emit({ type: "signedOut" });
  if (settled.kind === "timeout") {
    // İstek sürüyor: sonradan başarılı olursa yine de oturum açılır; reddedilirse kapanır.
    void pending.then(
      (user) => {
        if (!deps.isStale()) void applyVerified(deps, user);
      },
      async (error: unknown) => {
        if (deps.isStale() || !isSessionRejected(error)) return;
        await deps.clearSession();
        if (!deps.isStale()) deps.emit({ type: "signedOut" });
      },
    );
  }
  return "unverified";
}

async function applyVerified(deps: RestoreDeps, user: AuthUser): Promise<void> {
  await deps.saveUser(user);
  if (deps.isStale()) return;
  deps.emit({ type: "signedIn", user });
}

/** `promise`i en çok `ms` bekler; zaman aşımında söz iptal edilmez, çağıran sonucunu ayrıca izleyebilir. */
function settleWithin(promise: Promise<AuthUser>, ms: number): Promise<Settled> {
  return new Promise<Settled>((resolve) => {
    const timer = setTimeout(() => resolve({ kind: "timeout" }), ms);
    promise.then(
      (user) => {
        clearTimeout(timer);
        resolve({ kind: "ok", user });
      },
      (error: unknown) => {
        clearTimeout(timer);
        resolve({ kind: "error", error });
      },
    );
  });
}
