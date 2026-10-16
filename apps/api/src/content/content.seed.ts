import type { Database } from "../db/client.js";

/**
 * Kıtalar, ülkeler, seyahat bilgileri, şehirler ve rehberler için tohum yükleyici (idempotent upsert).
 * İçerik görevi tarafından doldurulur; imza sabittir.
 */
export async function seedContent(_db: Database, _opts: { dir: string }): Promise<void> {
  // İçerik görevi dolduracak.
}
