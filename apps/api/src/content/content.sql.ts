import { type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { isLang, type Lang } from "../common/lang.js";

/**
 * `translations -> '<dil>'` (nesne) ya da `translations -> '<dil>' ->> '<anahtar>'` (metin). Dil ve anahtar kod
 * sabitleridir (kullanıcı girdisi değil); yine de dil `LANGS`ta olmalı, anahtar yalnız harf içermeli.
 */
export function jsonAt(column: PgColumn, lang: Lang, key?: string): SQL {
  if (!isLang(lang)) throw new Error(`Geçersiz dil: ${String(lang)}`);
  const base = sql`${column} -> ${sql.raw(`'${lang}'`)}`;
  if (key === undefined) return base;
  if (!/^[A-Za-z]+$/.test(key)) throw new Error(`Geçersiz çeviri anahtarı: ${key}`);
  return sql`${base} ->> ${sql.raw(`'${key}'`)}`;
}

/** Türkçe değilse o dilin nesnesi, Türkçeyse `null` (ayrıca yüklemeye gerek yok). */
export function localizedObject(column: PgColumn, lang: Lang): SQL<unknown> {
  return lang === "tr" ? sql`null` : jsonAt(column, lang);
}
