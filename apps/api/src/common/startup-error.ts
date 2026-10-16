import { ConfigError } from "../config/env.js";
import { summarizeError } from "./filters/all-exceptions.filter.js";

/**
 * Operatöre doğrudan gösterilebilecek, açık Türkçe mesajı olan çalışma zamanı hatası (ör. PGlite
 * klasörü başka süreçte açık). Açılışta yığın değil yalnız mesaj yazılır.
 */
export class OperationalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperationalError";
  }
}

/**
 * Açılış (ve `db:seed`) hatasını stderr'e yazılacak metne çevirir. Ham `console.error(err)` kullanma:
 * Drizzle sorgu hataları `query`, `params` ve `cause` alanlarında bağlı tüm değerleri taşır; açılışta çalışan
 * admin oluşturma sorgusu `ADMIN_EMAIL` ve parola özetini (scrypt) günlüğe sızdırırdı. İstek sırasındaki
 * 500'lerde olduğu gibi yalnız temizlenmiş özet ve yığın çerçeveleri yazılır.
 */
export function formatStartupError(err: unknown): string {
  if (err instanceof ConfigError || err instanceof OperationalError) return err.message;
  return `Açılış hatası: ${summarizeError(err, true)}`;
}
