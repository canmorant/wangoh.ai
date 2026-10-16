import { Logger } from "@nestjs/common";
import { createApp } from "./bootstrap.js";
import { formatStartupError } from "./common/startup-error.js";
import { loadConfig } from "./config/env.js";
import { loadDotEnv } from "./config/dotenv.js";

/** Yalnız dinler; tüm kurulum `createApp()` içindedir. */
async function main(): Promise<void> {
  // Geliştirme kolaylığı: apps/api/.env varsa okunur (`db:seed` CLI'si de aynısını yapar). Gerçek ortam
  // değişkenleri her zaman önceliklidir; üretimde değişkenler platformdan gelir, dosya olmaz.
  loadDotEnv();

  const config = loadConfig();
  const app = await createApp({ config });
  app.enableShutdownHooks();
  await app.listen(config.port);
  const logger = new Logger("Bootstrap");
  logger.log(`API hazır: http://localhost:${config.port}/v1${config.swaggerEnabled ? ` (Swagger: http://localhost:${config.port}/docs)` : ""}`);
}

main().catch((err: unknown) => {
  // Yapılandırma hatası: yığın değil, okunur bir liste. Diğer hatalarda SQL parametreleri (ADMIN_EMAIL,
  // parola özeti) ham nesneyle günlüğe düşmesin diye yalnız temizlenmiş özet yazılır.
  console.error(formatStartupError(err));
  process.exit(1);
});
