import { writeFile } from "node:fs/promises";
import { createApp } from "../bootstrap.js";
import { loadConfig } from "../config/env.js";
import { OPENAPI_PATH } from "../paths.js";
import { createOpenApiDocument, serializeOpenApi } from "./document.js";

/**
 * Derlenmiş uygulamadan `apps/api/openapi.json` üretir (`pnpm --filter api openapi:export`).
 * Çevreden bağımsızdır: ortam değişkenleri yok sayılır, PGlite bellek, tohum/migrasyon kapalı;
 * böylece çıktı her makinede ve her seferinde bayt bayt aynıdır.
 */
async function main(): Promise<void> {
  const config = {
    ...loadConfig({ NODE_ENV: "test", PGLITE_DIR: "memory://" }),
    migrateOnBoot: false,
    seedOnBoot: false,
    httpLog: false,
  };
  const app = await createApp({ config, logger: false });
  try {
    await writeFile(OPENAPI_PATH, serializeOpenApi(createOpenApiDocument(app)), "utf8");
  } finally {
    await app.close();
  }
  console.log(`OpenAPI yazıldı: ${OPENAPI_PATH}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
