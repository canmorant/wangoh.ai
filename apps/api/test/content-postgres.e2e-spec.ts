import { randomUUID } from "node:crypto";
import { Logger } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { unsupportedServerEncoding } from "../src/content/encoding.js";
import { cities, cityGuides } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, TEST_DATABASE_URL, type TestApp, type TestSession } from "./helpers/index.js";
import { loadFixtureSeed } from "./helpers/content-fixture.js";

type Json = Record<string, any>;

/**
 * Yalnız gerçek PostgreSQL'e karşı çalışır (`TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres`). PGlite tek bağlantıdır
 * ve işlemleri sıraya dizer; içerik yazmalarındaki satır kilitleri (şehir, ülke, rehber) ancak gerçek paralel bağlantılarda sınanır.
 * Şehir güncellemesi önce ülke satırını (`FOR NO KEY UPDATE`), sonra şehir satırını kilitler; ikisi de kaldırılınca bu dosya kırılır
 * (biri tek başına kalkarsa diğeri yarışı yine kapatır: kilitler birlikte sınanır).
 */
describe.skipIf(!TEST_DATABASE_URL)("gerçek PostgreSQL: içerik yazmalarında eşzamanlılık", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
  }, 60_000);
  afterAll(() => t.close());
  beforeEach(async () => {
    await t.db.delete(cities);
    await loadFixtureSeed(t, true);
  });

  const auth = () => bearer(admin.accessToken);
  const patchCity = (code: string, slug: string, body: unknown) => t.http.patch(`/v1/countries/${code}/cities/${slug}`).set(auth()).send(body as object);
  const postCity = (code: string, body: unknown) => t.http.post(`/v1/countries/${code}/cities`).set(auth()).send(body as object);
  const fullGuide = async (): Promise<Json> => {
    const { lang: _lang, complete: _complete, reviewed: _reviewed, ...body } = (await t.http.get("/v1/countries/FR/cities/paris")).body.guide as Json;
    return body;
  };
  const noServerError = (results: Array<{ status: number; body: unknown }>) => {
    for (const r of results) expect(r.status, JSON.stringify(r.body)).toBeLessThan(500);
  };

  it("rehberi olmayan şehre eşzamanlı 8 rehber yazımı: şehir ve ülke satırı kilitleri sayesinde tümü 200 (city_guides birincil anahtar ihlali yok)", async () => {
    const guide = await fullGuide();
    for (let round = 0; round < 3; round++) {
      await t.db.delete(cityGuides).where(eq(cityGuides.cityId, (await t.db.select().from(cities).where(and(eq(cities.countryCode, "FR"), eq(cities.slug, "nice"))))[0]!.id));
      const results = await Promise.all(Array.from({ length: 8 }, () => patchCity("FR", "nice", { guide: { translations: { tr: guide } } })));
      noServerError(results);
      expect(results.map((r) => r.status), `tur ${round}`).toEqual(Array(8).fill(200));
    }
  }, 60_000);

  it("aynı Türkçe adla eşzamanlı 12 ekleme: tek kazanan, kalanı 409 CITY_NAME_TAKEN (ülke satırı kilidi)", async () => {
    for (let round = 0; round < 3; round++) {
      const name = `Ikiz Sehir ${round}`;
      const results = await Promise.all(Array.from({ length: 12 }, (_, i) => postCity("FR", { slug: `ikiz-${round}-${i}`, translations: { tr: { name, description: "x" } } })));
      noServerError(results);
      expect(results.filter((r) => r.status === 201), `tur ${round}`).toHaveLength(1);
      expect(results.filter((r) => r.status === 409).every((r) => r.body.code === "CITY_NAME_TAKEN")).toBe(true);
      const rows = await t.db.select().from(cities).where(eq(cities.countryCode, "FR"));
      expect(rows.filter((c) => (c.translations as Json).tr.name === name)).toHaveLength(1);
    }
  }, 60_000);

  it("yeniden adlandırma, rehber yazımı, ülke yazımı, ekleme ve silme birlikte: 500 ya da kilitlenme yok; bağlantılar tutarlı", async () => {
    const guide = await fullGuide();
    for (let round = 0; round < 4; round++) {
      const results = await Promise.all([
        patchCity("FR", "nice", { translations: { tr: { name: round % 2 === 0 ? "Nis" : "Nice" } } }),
        patchCity("FR", "nice", { translations: { tr: { description: `Açıklama ${round}` } } }),
        patchCity("FR", "paris", { guide: { translations: { tr: { ...guide, h1: `Paris ${round}` } } } }),
        patchCity("FR", "paris", { translations: { tr: { description: `Paris açıklaması ${round}` } } }),
        t.http.patch("/v1/countries/FR").set(auth()).send({ travel: { accent: "#112233" } }),
        postCity("FR", { slug: `yeni-${round}`, translations: { tr: { name: `Yeni ${round}`, description: "x" } } }),
        ...(round > 0 ? [t.http.delete(`/v1/countries/FR/cities/yeni-${round - 1}`).set(auth())] : []),
      ]);
      for (const r of results) expect([200, 201, 204], `tur ${round}: ${r.status} ${JSON.stringify(r.body)}`).toContain(r.status);
    }
    // Yeniden adlandırmalar hub ve rehber başvurularıyla aynı işlemde yürüdü: her rota şehri hâlâ bir slug'a çözülür.
    const country = (await t.http.get("/v1/countries/FR")).body;
    const route = (country.travel.hub as Json).routeIdeas[0];
    expect(route.cities).toEqual(["Paris", "Nice"]);
    expect(route.cityLinks).toHaveLength(2);
    expect((await t.http.get("/v1/countries/FR/cities/paris")).body.guide.relatedGuides[0]).toMatchObject({ city: "Nice", slug: "nice" });
  }, 120_000);

  it("SQL_ASCII veritabanında açılışta uyarı yazılır (Türkçe arama bu kümede çalışmaz); UTF8 veritabanında yazılmaz", async () => {
    expect(await unsupportedServerEncoding(t.db)).toBeNull(); // test veritabanı UTF8 olmalı (create database varsayılanı)

    const { default: pg } = await import("pg");
    const name = `wangoh_ascii_${randomUUID().replace(/-/g, "")}`;
    const admin = new pg.Client({ connectionString: TEST_DATABASE_URL });
    await admin.connect();
    const warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    try {
      await admin.query(`create database ${name} encoding 'SQL_ASCII' template template0 lc_collate 'C' lc_ctype 'C'`);
      const url = new URL(TEST_DATABASE_URL!);
      url.pathname = `/${name}`;
      const ascii = await createTestApp({ config: { databaseUrl: url.toString() } });
      try {
        expect(await unsupportedServerEncoding(ascii.db)).toBe("SQL_ASCII");
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("SQL_ASCII"));
      } finally {
        await ascii.close();
      }
    } finally {
      warn.mockRestore();
      await admin.query(`drop database if exists ${name} with (force)`);
      await admin.end();
    }
  }, 60_000);
});
