/**
 * Son bilinen kullanıcının yerel kopyası (saf çekirdek; platform bağlantısı: userCache.ts).
 *
 * NEDEN: Uygulama açılışında belirteç varsa kullanıcıyı ağı beklemeden (ve çevrimdışıyken de)
 * oturumlu göstermek için. Rol buradan okunur ama güvenlik kararı DEĞİLDİR: yönetici uçlarını
 * ve her isteği sunucu veritabanındaki role göre denetler; önbellek yalnız arayüzü (ör. Yönetim
 * sekmesi) hemen çizer. Sunucu hesabı reddederse kayıt silinir (restoreSession).
 */
import type { AuthUser } from "./AuthContext";
import { toAuthUser } from "./authState";
import type { KeyValueStore } from "./tokenStorageCore";

/** SecureStore anahtarları yalnız harf, rakam, ".", "-" ve "_" içerebilir. */
export const USER_CACHE_KEY = "wangoh.auth.user";

export interface UserCache {
  /** Kayıtlı kullanıcı; yok, bozuk ya da okunamıyorsa null. Hiçbir zaman fırlatmaz. */
  read(): Promise<AuthUser | null>;
  /** Hata yutulur: önbellek yalnız hızlandırıcıdır, yazılamazsa oturum yine çalışır. */
  write(user: AuthUser): Promise<void>;
  clear(): Promise<void>;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/** Depodaki ham metni kullanıcıya çevirir; bozuk ya da eksik veri null döner. */
export function parseCachedUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const record = parsed as Record<string, unknown>;
    if (!isNonEmptyString(record.id) || !isNonEmptyString(record.email) || typeof record.displayName !== "string") return null;
    return toAuthUser({
      id: record.id,
      email: record.email,
      displayName: record.displayName,
      role: typeof record.role === "string" ? record.role : "user",
    });
  } catch {
    return null;
  }
}

export function createUserCache(store: KeyValueStore | null, key: string = USER_CACHE_KEY): UserCache {
  return {
    async read() {
      if (!store) return null;
      try {
        const raw = await store.getItem(key);
        const user = parseCachedUser(raw);
        if (raw && !user) await store.removeItem(key).catch(() => undefined); // bozuk kaydı temizle
        return user;
      } catch {
        return null;
      }
    },
    async write(user) {
      if (!store) return;
      try {
        await store.setItem(key, JSON.stringify({ id: user.id, email: user.email, displayName: user.displayName, role: user.role }));
      } catch {
        // Yazılamadı: sonraki açılışta ağ doğrulaması beklenir.
      }
    },
    async clear() {
      if (!store) return;
      try {
        await store.removeItem(key);
      } catch {
        // Silinemedi: belirteç silindiği için kayıt tek başına oturum açmaz (restoreSession belirteç arar).
      }
    },
  };
}
