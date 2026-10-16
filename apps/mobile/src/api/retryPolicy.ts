import { getErrorStatus } from "./errors";

/** İlk istek dışında en çok bu kadar yeniden deneme. */
export const MAX_QUERY_RETRIES = 2;

/**
 * Yalnız geçici hatalar yeniden denenir: sunucuya ulaşılamadı (status 0) ve 5xx.
 * 4xx istemci hatasıdır (yanlış istek, yetki, bulunamadı), tekrar denemek sonucu değiştirmez.
 * Durum kodu olmayan hata (kod hatası, ayrıştırma) da denenmez: gizlenmesin, hemen görünsün.
 */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRIES) return false;
  const status = getErrorStatus(error);
  if (status === undefined) return false;
  return status === 0 || status >= 500;
}

/** Üstel geri çekilme: 1 sn, 2 sn, ... en çok 8 sn. */
export function retryDelay(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, 8000);
}
