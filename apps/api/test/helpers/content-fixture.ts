import { fileURLToPath } from "node:url";
import { type ContentSeedStats, loadContentSeed } from "../../src/content/content.seed.js";
import type { TestApp } from "./create-test-app.js";

/** Küçük içerik tohumu: 3 kıta, 6 ülke (2 öne çıkan), 4 şehir, 2 rehber; en/es kısmen tam. */
export const FIXTURE_SEED_DIR = fileURLToPath(new URL("../fixtures/seed", import.meta.url));

/** Fixture tohumunu test veritabanına yükler (varsayılan: yalnız eksikler; `force` ile upsert). */
export function loadFixtureSeed(t: Pick<TestApp, "db">, force = false): Promise<ContentSeedStats | null> {
  return loadContentSeed(t.db, { dir: FIXTURE_SEED_DIR, force });
}
