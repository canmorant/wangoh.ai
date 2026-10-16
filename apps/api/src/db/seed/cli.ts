import { Logger } from "@nestjs/common";
import { formatStartupError } from "../../common/startup-error.js";
import { loadDotEnv } from "../../config/dotenv.js";
import { loadConfig } from "../../config/env.js";
import { createDatabase } from "../client.js";
import { runMigrations } from "../migrate.js";
import { runSeed } from "./index.js";

/**
 * `pnpm --filter api build && pnpm --filter api db:seed`: migrasyonları uygular ve tohumu yükler
 * (DATABASE_URL varsa o veritabanına, yoksa PGlite dosyasına). Üretimde `SEED_ON_BOOT=false`
 * olduğundan tohum yalnız bu komutla yüklenir. Sunucu gibi `apps/api/.env` dosyasını okur (yoksa
 * sessizce yanlış veritabanına yazardı) ve belirteç imzalamadığı için `JWT_ACCESS_SECRET` istemez.
 */
async function main(): Promise<void> {
  loadDotEnv();
  const logger = new Logger("Seed");
  const config = loadConfig(process.env, { requireJwtSecret: false });
  const handle = await createDatabase(config);
  try {
    await runMigrations(handle);
    await runSeed(handle.db, { dir: config.seedDir });
    logger.log("Tohum yüklendi.");
  } finally {
    await handle.close();
  }
}

main().catch((err: unknown) => {
  console.error(formatStartupError(err));
  process.exitCode = 1;
});
