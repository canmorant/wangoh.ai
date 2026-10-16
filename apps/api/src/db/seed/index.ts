import { seedBlog } from "../../blog/blog.seed.js";
import { seedContent } from "../../content/content.seed.js";
import { SEED_DIR } from "../../paths.js";
import type { Database } from "../client.js";

export interface RunSeedOptions {
  /** Tohum JSON klasörü; varsayılan `apps/api/seed`. */
  dir?: string;
}

/**
 * Tohum yükleyici orkestratörü. Önce içerik (kıtalar, ülkeler, şehirler, rehberler), sonra blog
 * (ülkelere bağlanır). Her yükleyici idempotent (upsert) olmalıdır; `SEED_ON_BOOT` ve `db:seed`
 * bunu her çalıştırışta güvenle çağırır.
 */
export async function runSeed(db: Database, options: RunSeedOptions = {}): Promise<void> {
  const dir = options.dir ?? SEED_DIR;
  await seedContent(db, { dir });
  await seedBlog(db, { dir });
}
