/**
 * Oyun API hatalarının sınıflandırılması ve Türkçe mesajları. Saf modül.
 * Hata gövdesi her yerde `{ statusCode, code, message }` (sözleşme, bölüm 5); `ApiError` bu alanları taşır.
 * İstemci `message` yerine `code`a göre dallanır; API mesajları çoğul ("başlatın") olduğundan
 * uygulama dilinde ("sen") kendi metinlerimizi gösteririz, bilinmeyen kodda API mesajına düşeriz.
 */

import { DEFAULT_ERROR_MESSAGE, getErrorCode, getErrorMessage, getErrorStatus, isNetworkError } from "../../../api/errors";

export type GameErrorKind =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "sessionExpired"
  | "sessionNotActive"
  | "sessionNotFound"
  | "roundConflict"
  | "notFinished"
  | "scoreRemoved"
  | "poolTooSmall"
  | "rateLimited"
  | "validation"
  | "server"
  | "unknown";

/** Oturumun artık sürdürülemeyeceğini söyleyen sonlar. */
export type EndReason = "expired" | "notActive" | "notFound" | "scoreRemoved";

const ROUND_CONFLICT_CODES: ReadonlySet<string> = new Set([
  "GAME_ROUND_ALREADY_ANSWERED",
  "GAME_ROUND_OUT_OF_ORDER",
  "GAME_NO_ROUND_LEFT",
]);

export function classifyGameError(error: unknown): GameErrorKind {
  if (isNetworkError(error)) return "network";
  const status = getErrorStatus(error);
  const code = getErrorCode(error);

  if (code === "GAME_SESSION_EXPIRED") return "sessionExpired";
  if (code === "GAME_SESSION_NOT_ACTIVE") return "sessionNotActive";
  if (code !== undefined && ROUND_CONFLICT_CODES.has(code)) return "roundConflict";
  if (code === "GAME_NOT_FINISHED") return "notFinished";
  if (code === "GAME_SCORE_REMOVED") return "scoreRemoved";
  if (code === "GAME_POOL_TOO_SMALL") return "poolTooSmall";
  if (code === "RATE_LIMITED" || status === 429) return "rateLimited";
  if (code === "AUTH_REQUIRED" || code === "AUTH_TOKEN_INVALID" || code === "AUTH_ACCOUNT_DISABLED" || status === 401) {
    return "unauthorized";
  }
  if (code === "FORBIDDEN" || status === 403) return "forbidden";
  if (code === "NOT_FOUND" || status === 404) return "sessionNotFound";
  if (code === "VALIDATION_FAILED" || code === "BAD_REQUEST" || status === 400) return "validation";
  if (code === "INTERNAL_ERROR" || code === "SERVICE_UNAVAILABLE" || (status !== undefined && status >= 500)) return "server";
  return "unknown";
}

const MESSAGES: Record<Exclude<GameErrorKind, "unknown">, string> = {
  network: "Sunucuya ulaşılamadı. İnternet bağlantını kontrol edip tekrar dene.",
  unauthorized: "Oturumun sona erdi. Devam etmek için yeniden giriş yap.",
  forbidden: "Bu işlem için yetkin yok.",
  sessionExpired: "Oyun oturumunun süresi doldu. Yeni bir oyun başlatabilirsin.",
  sessionNotActive: "Bu oyun artık etkin değil. Yeni bir oyun başlatabilirsin.",
  sessionNotFound: "Oyun oturumu bulunamadı. Yeni bir oyun başlatabilirsin.",
  roundConflict: "Bu tur sunucuda zaten kayıtlıydı; oyun kaldığın yerden devam ediyor.",
  notFinished: "Oyunu bitirmek için önce tüm turları cevaplamalısın.",
  scoreRemoved: "Bu oyunun puanı kaldırıldı.",
  poolTooSmall: "Bu oyun için şu an yeterli veri yok. Biraz sonra tekrar dene.",
  rateLimited: "Çok hızlı istek gönderdin. Birkaç saniye bekleyip tekrar dene.",
  validation: "Cevabın kabul edilmedi. Lütfen tekrar dene.",
  server: "Sunucuda geçici bir sorun var. Biraz sonra tekrar dene.",
};

/** Kullanıcıya gösterilecek Türkçe mesaj. */
export function gameErrorMessage(error: unknown): string {
  const kind = classifyGameError(error);
  if (kind === "unknown") return getErrorMessage(error, DEFAULT_ERROR_MESSAGE);
  return MESSAGES[kind];
}

/** Yeniden denemek işe yarar mı (geçici hata)? Ağ, sunucu, hız sınırı. */
export function isRetryable(error: unknown): boolean {
  const kind = classifyGameError(error);
  return kind === "network" || kind === "server" || kind === "rateLimited" || kind === "unknown";
}

/** Oturum sunucuda yok / bitmiş / süresi dolmuş mu? (Ağ ve sunucu hatası bunu söylemez.) */
export function isSessionGone(error: unknown): boolean {
  const reason = endReasonOfKind(classifyGameError(error));
  return reason !== null && reason !== "scoreRemoved";
}

/** Cevap gönderimi başarısız olunca istemcinin yapacağı şey. */
export type FailureAction = { type: "resync" } | { type: "end"; reason: EndReason } | { type: "retry" };

function endReasonOfKind(kind: GameErrorKind): EndReason | null {
  switch (kind) {
    case "sessionExpired":
      return "expired";
    case "sessionNotActive":
      return "notActive";
    case "sessionNotFound":
      return "notFound";
    case "scoreRemoved":
      return "scoreRemoved";
    default:
      return null;
  }
}

/**
 * Cevap gönderimi (idempotent DEĞİL): tur çakışması (409) durumu sunucudan yeniden çekip eşitlemek
 * demektir; oturum bitmişse son ekran; geri kalan hatalarda aynı cevap yeniden gönderilebilir.
 */
export function answerFailureAction(error: unknown): FailureAction {
  const kind = classifyGameError(error);
  if (kind === "roundConflict") return { type: "resync" };
  const reason = endReasonOfKind(kind);
  if (reason && reason !== "scoreRemoved") return { type: "end", reason };
  return { type: "retry" };
}

/** Bitirme çağrısı (idempotent): erken bitirme sunucuyla eşitlenir, oturum sonları son ekrana gider. */
export function finishFailureAction(error: unknown): FailureAction {
  const kind = classifyGameError(error);
  if (kind === "notFinished" || kind === "roundConflict") return { type: "resync" };
  const reason = endReasonOfKind(kind);
  if (reason) return { type: "end", reason };
  return { type: "retry" };
}

/** Geri yükleme (GET oturum) başarısızlığı: 404/410 oturumun kaybolduğunu söyler, yerel kayıt temizlenir. */
export function restoreFailureAction(error: unknown): FailureAction {
  const kind = classifyGameError(error);
  const reason = endReasonOfKind(kind);
  if (reason) return { type: "end", reason };
  return { type: "retry" };
}

export interface EndCopy {
  title: string;
  message: string;
}

/** Oturumun bittiği ekranın metni. */
export function endCopy(reason: EndReason): EndCopy {
  switch (reason) {
    case "expired":
      return { title: "Oturumun süresi doldu", message: "Bir oyun oturumu 30 dakika geçerlidir. Yeni bir oyun başlatabilirsin." };
    case "notActive":
      return { title: "Bu oyun artık etkin değil", message: "Oyun bitmiş ya da terk edilmiş. Yeni bir oyun başlatabilirsin." };
    case "notFound":
      return { title: "Oyun bulunamadı", message: "Bu oyun oturumu artık yok. Yeni bir oyun başlatabilirsin." };
    case "scoreRemoved":
      return { title: "Puan kaldırıldı", message: "Bu oyunun puanı kaldırıldı. Yeni bir oyun başlatabilirsin." };
  }
}
