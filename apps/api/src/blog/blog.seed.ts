import type { Database } from "../db/client.js";

/**
 * Blog yazıları için tohum yükleyici (idempotent upsert). Mevcut sitedeki ülke sayfası metinlerinden
 * türetilir. Blog görevi tarafından doldurulur; imza sabittir.
 */
export async function seedBlog(_db: Database, _opts: { dir: string }): Promise<void> {
  // Blog görevi dolduracak.
}
