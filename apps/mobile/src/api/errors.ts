/**
 * Hata yardımcıları. `@wangoh/api-client` içindeki `ApiError` yapısı (status, code, message) ile
 * çalışır ama onu içe aktarmaz: böylece saf kalır, her hata türü için güvenle çağrılır.
 */

export const DEFAULT_ERROR_MESSAGE = "Bir şeyler ters gitti. Lütfen tekrar dene.";

function asRecord(error: unknown): Record<string, unknown> | null {
  return typeof error === "object" && error !== null ? (error as Record<string, unknown>) : null;
}

/** HTTP durum kodu; sunucuya ulaşılamadıysa 0; API hatası değilse undefined. */
export function getErrorStatus(error: unknown): number | undefined {
  const status = asRecord(error)?.status;
  return typeof status === "number" ? status : undefined;
}

export function getErrorCode(error: unknown): string | undefined {
  const code = asRecord(error)?.code;
  return typeof code === "string" ? code : undefined;
}

/** Sunucuya hiç ulaşılamadı (çevrimdışı, DNS, bağlantı reddi...). */
export function isNetworkError(error: unknown): boolean {
  return getErrorStatus(error) === 0 || getErrorCode(error) === "NETWORK_ERROR";
}

/** Kullanıcıya gösterilebilir Türkçe mesaj. API mesajları zaten Türkçe ve gösterilebilirdir (sözleşme, bölüm 5). */
export function getErrorMessage(error: unknown, fallback: string = DEFAULT_ERROR_MESSAGE): string {
  const message = asRecord(error)?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}
