import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { rowsOf } from "../src/db/client.js";
import { unsupportedServerEncoding } from "../src/content/encoding.js";
import { FOLD_FROM, foldContains, foldSearch, foldSql } from "../src/content/search.js";
import { createTestApp, TEST_DATABASE_URL, type TestApp } from "./helpers/index.js";

/** Arama katlamasının SQL ve JS tarafları aynı sonucu vermeli; yoksa terim ile saklı metin eşleşmez. */
describe("Türkçe duyarlı arama katlaması (SQL ↔ JS)", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  const foldInDb = async (text: string): Promise<string> => {
    const rows = rowsOf<{ folded: string }>(await t.db.execute(sql`select ${foldSql(sql`${text}::text`)} as folded`));
    return rows[0]!.folded;
  };

  const samples = [
    "İstanbul", "ISTANBUL", "ıstanbul", "Isparta", "ISPARTA", "ısparta", "IŞIK", "ışık", "Şanlıurfa", "ŞANLIURFA",
    "Çanakkale", "ÇANAKKALE", "Muğla", "MUĞLA", "Ürgüp", "ÜRGÜP", "Ödemiş", "ÖDEMİŞ", "Šibenik", "ŠIBENIK", "Tromsø", "TROMSØ",
    "Łódź", "ŁÓDŹ", "Ny-Ålesund", "Gjirokastër", "Žabljak", "Zürich", "São Paulo", "Cancún", "Kraków", "Brașov", "Țară", "100% _ \\ test",
    "Pyramiden", "Hồ Chí Minh", "Reykjavík", "Þingvellir", "",
  ];

  it("arama UTF8 veritabanı ister: test veritabanı UTF8 (SQL_ASCII kümede katlama bayt bayt çalışır)", async () => {
    expect(await unsupportedServerEncoding(t.db)).toBeNull();
    expect(await foldInDb("İstanbul")).toBe("istanbul");
  });

  it("örnek adlarda SQL katlaması JS ile aynı", async () => {
    for (const text of samples) expect(await foldInDb(text), JSON.stringify(text)).toBe(foldSearch(text));
  });

  it("tablodaki her karakter için SQL ve JS aynı hedefe iner", async () => {
    const all = [...FOLD_FROM].join("");
    expect(await foldInDb(all)).toBe(foldSearch(all));
    for (const ch of FOLD_FROM) expect(await foldInDb(ch), `U+${ch.codePointAt(0)!.toString(16)}`).toBe(foldSearch(ch));
  });

  it("neden ILIKE değil: PGlite'ta Isparta ILIKE ısparta yanlış, katlanmış LIKE doğru", async () => {
    const ilike = async (a: string, b: string) => rowsOf<{ ok: boolean }>(await t.db.execute(sql`select ${a}::text ilike ${b}::text as ok`))[0]!.ok;
    const folded = async (a: string, b: string) => rowsOf<{ ok: boolean }>(await t.db.execute(sql`select ${foldSql(sql`${a}::text`)} like ${`%${foldSearch(b)}%`} as ok`))[0]!.ok;
    for (const [stored, typed] of [["Isparta", "ısparta"], ["IŞIK", "ışık"], ["ıspanak", "ISPANAK"], ["İzmir", "izmir"], ["Irak", "ırak"]] as const) {
      expect(await folded(stored, typed), `${stored} ~ ${typed}`).toBe(true);
    }
    // ILIKE'ın davranışı yerel ayara bağlıdır; yalnız PGlite (varsayılan) için belgelenir.
    if (!TEST_DATABASE_URL) {
      expect(await ilike("Isparta", "ısparta")).toBe(false);
      expect(await ilike("IŞIK", "ışık")).toBe(false);
    }
  });

  it("foldContains jokerleri kaçırır: terimdeki % _ \\ düz karakterdir", async () => {
    const matches = async (stored: string, term: string): Promise<boolean> => {
      const condition = foldContains(sql`${stored}::text`, term);
      if (!condition) return true;
      return rowsOf<{ ok: boolean }>(await t.db.execute(sql`select (${condition}) as ok`))[0]!.ok;
    };
    expect(await matches("100% pamuk", "100%")).toBe(true);
    expect(await matches("1000 pamuk", "100%")).toBe(false);
    expect(await matches("a_b", "a_b")).toBe(true);
    expect(await matches("axb", "a_b")).toBe(false);
    expect(await matches("a\\b", "a\\b")).toBe(true);
    expect(await matches("ab", "a\\b")).toBe(false);
    expect(await matches("anything", "%")).toBe(false);
    expect(await matches("anything", "   ")).toBe(true); // boş terim koşulsuz
    expect(await matches("İstanbul Boğazı", "boğazı")).toBe(true);
    expect(await matches("İstanbul Boğazı", "BOGAZI")).toBe(true);
  });
});
