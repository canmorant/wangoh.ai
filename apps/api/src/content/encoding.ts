import { sql } from "drizzle-orm";
import { type Database, rowsOf } from "../db/client.js";

/**
 * Türkçe arama ve ad sıralaması (`search.ts`: `translate(...)` ile katlama) veritabanı kodlamasının UTF8 olmasını
 * varsayar. `SQL_ASCII` kümede (ör. `initdb --locale=C` varsayılanı) çok baytlı harfler bayt bayt işlenir: `q=türkiye`
 * hiçbir şey bulmaz ve sıralama bozulur, ama hiçbir hata çıkmaz. Sorun yoksa `null`, varsa kodlama adı döner.
 */
export async function unsupportedServerEncoding(db: Database): Promise<string | null> {
  const rows = rowsOf<{ encoding: string }>(await db.execute(sql`select current_setting('server_encoding') as encoding`));
  const encoding = rows[0]?.encoding;
  return encoding === undefined || encoding.toUpperCase() === "UTF8" ? null : encoding;
}
