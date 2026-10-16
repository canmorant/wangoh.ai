import { type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/** LIKE/ILIKE joker karakterlerini (`%`, `_`) ve kaçış karakterini (`\`) etkisizleştirir. */
export function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

/** Büyük/küçük harf duyarsız "içerir" araması; kullanıcı girdisindeki jokerler kaçırılır. */
export function containsIlike(column: PgColumn | SQL, term: string): SQL {
  return sql`${column} ilike ${`%${escapeLike(term)}%`} escape '\\'`;
}
