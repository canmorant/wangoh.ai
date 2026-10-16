import { existsSync } from "node:fs";
import { ENV_FILE } from "../paths.js";

/**
 * `apps/api/.env` varsa okur ve dosyanın yüklenip yüklenmediğini döner. Gerçek ortam değişkenleri her
 * zaman önceliklidir (`process.loadEnvFile` var olan değişkeni ezmez). Sunucu (`main.ts`) ve `db:seed`
 * CLI'si aynı kuralı paylaşır; biri okuyup öbürü okumazsa ikisi farklı veritabanına bağlanırdı.
 */
export function loadDotEnv(file: string = ENV_FILE): boolean {
  if (!existsSync(file) || typeof process.loadEnvFile !== "function") return false;
  process.loadEnvFile(file);
  return true;
}
