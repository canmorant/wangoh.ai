import { seedBlog } from "../../blog/blog.seed.js";
import { seedContent } from "../../content/content.seed.js";
import { SEED_DIR } from "../../paths.js";
import type { Database } from "../client.js";

export interface RunSeedOptions {
  /** Tohum JSON klasörü; varsayılan `apps/api/seed`. */
  dir?: string;
  /**
   * `true`: içerik ve blog tohumu mevcut satırları tohumdaki değerlerle ezer (upsert). Varsayılan `false`: yalnız
   * eksik satırlar eklenir, yöneticinin düzenlemeleri korunur. CLI: `pnpm --filter api db:seed --force`.
   */
  force?: boolean;
}

/**
 * Tohum yükleyici orkestratörü. Önce içerik (kıtalar, ülkeler, şehirler, rehberler), sonra blog
 * (ülkelere bağlanır). Her yükleyici idempotent olmalıdır; `SEED_ON_BOOT` ve `db:seed`
 * bunu her çalıştırışta güvenle çağırır.
 */
export async function runSeed(db: Database, options: RunSeedOptions = {}): Promise<void> {
  const dir = options.dir ?? SEED_DIR;
  await seedContent(db, { dir, force: options.force });
  await seedBlog(db, { dir, force: options.force });
}
