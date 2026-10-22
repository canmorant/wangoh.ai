import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { and, eq } from "drizzle-orm";
import { Logger } from "@nestjs/common";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { loadContentSeed, seedContent } from "../src/content/content.seed.js";
import { cities, cityGuides, continents, countries, countryTravel } from "../src/db/schema/index.js";
import { runSeed } from "../src/db/seed/index.js";
import { OperationalError } from "../src/common/startup-error.js";
import { bearer, createAdmin, createTestApp, type TestApp, type TestSession } from "./helpers/index.js";
import { FIXTURE_SEED_DIR, loadFixtureSeed } from "./helpers/content-fixture.js";

const counts = async (t: TestApp) => ({
  continents: (await t.db.select().from(continents)).length,
  countries: (await t.db.select().from(countries)).length,
  countryTravel: (await t.db.select().from(countryTravel)).length,
  cities: (await t.db.select().from(cities)).length,
  cityGuides: (await t.db.select().from(cityGuides)).length,
});
const FIXTURE_COUNTS = { continents: 3, countries: 6, countryTravel: 2, cities: 4, cityGuides: 2 };

describe("içerik tohumu (seedContent)", () => {
  let t: TestApp | undefined;
  let admin: TestSession | undefined;
  const temp: string[] = [];
  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
  });
  // Her test içerik tablolarını boşaltarak başlar (yabancı anahtar sırasıyla).
  beforeEach(async () => {
    await t!.db.delete(cityGuides);
    await t!.db.delete(cities);
    await t!.db.delete(countryTravel);
    await t!.db.delete(countries);
    await t!.db.delete(continents);
  });
  afterAll(async () => {
    await t?.close();
    for (const dir of temp) rmSync(dir, { recursive: true, force: true });
  });

  const app = (): TestApp => t!;
  const tempDir = (): string => {
    const dir = mkdtempSync(join(tmpdir(), "wangoh-seed-"));
    temp.push(dir);
    return dir;
  };

  it("boş veritabanına sırayla yükler ve eklenen satır sayılarını döner", async () => {
    const stats = await loadFixtureSeed(app());
    expect(stats).toEqual(FIXTURE_COUNTS);
    expect(await counts(app())).toEqual(FIXTURE_COUNTS);
    // Yabancı anahtarlar sağlam: rehberler şehirlere, şehirler ülkelere bağlı.
    const joined = await app().http.get("/v1/countries/FR/cities/paris");
    expect(joined.body.guide.h1).toBe("Paris Rehberi");
  });

  it("idempotent: ikinci ve üçüncü çalıştırma hiçbir şey eklemez, çift kayıt oluşmaz, kimlikler değişmez", async () => {
    await loadFixtureSeed(app());
    const ids = (await app().db.select({ id: cities.id }).from(cities).orderBy(cities.slug)).map((r) => r.id);
    expect(await loadFixtureSeed(app())).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0 });
    await seedContent(app().db, { dir: FIXTURE_SEED_DIR });
    expect(await counts(app())).toEqual(FIXTURE_COUNTS);
    expect((await app().db.select({ id: cities.id }).from(cities).orderBy(cities.slug)).map((r) => r.id)).toEqual(ids);
  });

  it("yöneticinin düzenlemeleri yeniden çalıştırmada EZİLMEZ; eksik satırlar tamamlanır", async () => {
    await loadFixtureSeed(app());
    const auth = bearer(admin!.accessToken);
    await app().http.patch("/v1/countries/FR").set(auth).send({ translations: { tr: { name: "Fransa (düzenlendi)" } }, travel: { accent: "#000000", translations: { tr: { description: "Düzenlenmiş açıklama." } } } }).expect(200);
    await app().http.patch("/v1/countries/FR/cities/paris").set(auth).send({ translations: { tr: { description: "Düzenlenmiş şehir." } }, guide: { translations: { tr: { h1: "Düzenlenmiş başlık" } }, reviewed: false } }).expect(200);
    const added = await app().http.post("/v1/countries/FR/cities").set(auth).send({ slug: "eklenen", translations: { tr: { name: "Eklenen", description: "Yönetici ekledi." } } });
    expect(added.status).toBe(201);

    expect(await loadFixtureSeed(app())).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0 });
    await runSeed(app().db, { dir: FIXTURE_SEED_DIR });

    const fr = (await app().http.get("/v1/countries/FR")).body;
    expect(fr.name).toBe("Fransa (düzenlendi)");
    expect(fr.travel).toMatchObject({ accent: "#000000", description: "Düzenlenmiş açıklama." });
    const paris = (await app().http.get("/v1/countries/FR/cities/paris")).body;
    expect(paris.description).toBe("Düzenlenmiş şehir.");
    expect(paris.guide).toMatchObject({ h1: "Düzenlenmiş başlık", reviewed: false });
    expect((await app().http.get("/v1/countries/FR/cities/eklenen")).status).toBe(200); // yöneticinin şehri silinmez

    // Tohumdaki bir şehir silinirse yeniden eklenir (silme kalıcı değildir; bkz. README); düzenlemeler yine korunur.
    await app().http.delete("/v1/countries/FR/cities/nice").set(auth).expect(204);
    expect(await loadFixtureSeed(app())).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 1, cityGuides: 0 });
    expect((await app().http.get("/v1/countries/FR/cities/nice")).status).toBe(200);
    expect((await app().http.get("/v1/countries/FR")).body.name).toBe("Fransa (düzenlendi)");
  });

  it("force: mevcut satırlar tohumdaki değerlere döner, kimlikler ve yönetici şehirleri korunur", async () => {
    await loadFixtureSeed(app());
    const auth = bearer(admin!.accessToken);
    await app().http.patch("/v1/countries/FR").set(auth).send({ translations: { en: null, tr: { name: "Bozuk Ad" } }, travel: { accent: "#000000", iata: "ORY" } }).expect(200);
    await app().http.patch("/v1/countries/FR/cities/paris").set(auth).send({ position: 9, image: null, guide: { translations: { tr: { h1: "Bozuk" } } } }).expect(200);
    await app().http.post("/v1/countries/FR/cities").set(auth).send({ slug: "eklenen", translations: { tr: { name: "Eklenen", description: "x" } } }).expect(201);
    const idsBefore = Object.fromEntries((await app().db.select().from(cities)).map((c) => [`${c.countryCode}:${c.slug}`, c.id]));

    const stats = await loadFixtureSeed(app(), true);
    expect(stats).toEqual(FIXTURE_COUNTS); // force: tüm tohum satırları yazılır (eklenen ya da güncellenen)

    const fr = (await app().http.get("/v1/countries/FR?lang=en")).body;
    expect(fr).toMatchObject({ name: "France", lang: "en", complete: true });
    expect(fr.travel).toMatchObject({ accent: "#d4795a", iata: "CDG", lang: "en", complete: true });
    const paris = (await app().http.get("/v1/countries/FR/cities/paris")).body;
    expect(paris).toMatchObject({ position: 0, imageUrl: "https://wangoh.com/og/fixture-paris-11223344.jpg" });
    expect(paris.guide.h1).toBe("Paris Rehberi");
    const idsAfter = Object.fromEntries((await app().db.select().from(cities)).map((c) => [`${c.countryCode}:${c.slug}`, c.id]));
    expect(idsAfter).toEqual(idsBefore); // upsert kimliği korur
    expect(idsAfter["FR:eklenen"]).toBeDefined(); // tohumda olmayan şehre dokunulmaz
    expect(await counts(app())).toEqual({ ...FIXTURE_COUNTS, cities: 5 });
  });

  it("runSeed({ force }) içerik tohumuna iletilir", async () => {
    await loadFixtureSeed(app());
    await app().db.update(countries).set({ hasTravel: false }).where(eq(countries.code, "FR"));
    await runSeed(app().db, { dir: FIXTURE_SEED_DIR });
    expect((await app().db.select().from(countries).where(eq(countries.code, "FR")))[0]!.hasTravel).toBe(false); // varsayılan: ezmez
    await runSeed(app().db, { dir: FIXTURE_SEED_DIR, force: true });
    expect((await app().db.select().from(countries).where(eq(countries.code, "FR")))[0]!.hasTravel).toBe(true);
  });

  it("klasör yoksa hata vermeden atlar ama uyarı yazar; dosyalar tek tek isteğe bağlıdır", async () => {
    const missing = join(tempDir(), "yok");
    expect(await loadContentSeed(app().db, { dir: missing })).toBeNull();
    const warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    try {
      await expect(seedContent(app().db, { dir: missing })).resolves.toBeUndefined();
      // Sessiz atlanırsa `db:seed` başarılı görünür, API 0 ülke/0 şehirle ayağa kalkar.
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]![0]).toContain(missing);
      expect(warn.mock.calls[0]![0]).toContain("YÜKLENMEDİ");
      warn.mockClear();
      await seedContent(app().db, { dir: tempDir() }); // klasör var (boş): uyarı yok
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
    expect(await counts(app())).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0 });

    const partial = tempDir();
    writeFileSync(join(partial, "continents.json"), JSON.stringify([{ slug: "asia", position: 0, translations: { tr: { name: "Asya" } } }]));
    expect(await loadContentSeed(app().db, { dir: partial })).toEqual({ continents: 1, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0 });
    const empty = tempDir();
    expect(await loadContentSeed(app().db, { dir: empty })).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0 });
  });

  it("bozuk tohum dosyası Türkçe, dosya ve alan adıyla bildirilir; hiçbir şey yazılmaz", async () => {
    const dir = tempDir();
    writeFileSync(join(dir, "continents.json"), JSON.stringify([{ slug: "asia", position: 0, translations: { tr: { name: "Asya" } } }]));
    writeFileSync(join(dir, "countries.json"), JSON.stringify([{ code: "xx", iso3: "XXX" }]));
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(OperationalError);
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(/countries\.json \[0\]\.code: ISO2 kodu/);
    expect((await counts(app())).continents).toBe(0); // okuma/doğrulama işlemden önce: yarım tohum yok

    writeFileSync(join(dir, "countries.json"), "{ bozuk json");
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(/okunamadı: countries\.json/);
    writeFileSync(join(dir, "countries.json"), "[]");
    writeFileSync(join(dir, "continents.json"), JSON.stringify([{ slug: "asia", position: 0, translations: { en: { name: "Asia" } } }]));
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(/translations\.tr: Türkçe çeviri zorunlu/);
    writeFileSync(join(dir, "continents.json"), JSON.stringify([{ slug: "asia", position: 0, translations: { tr: { name: "Asya" }, de: { name: "Asien" } } }]));
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(/translations\.de: bilinmeyen dil/);
    writeFileSync(join(dir, "continents.json"), "{}");
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(/continents\.json kök: dizi bekleniyordu/);
  });

  it("işlem bütünlüğü: ortada hata olursa yazılan hiçbir tablo kalmaz", async () => {
    const dir = tempDir();
    writeFileSync(join(dir, "continents.json"), JSON.stringify([{ slug: "asia", position: 0, translations: { tr: { name: "Asya" } } }]));
    // Ülkenin kıtası yok: yabancı anahtar ihlali tabloyu yazarken patlar.
    writeFileSync(
      join(dir, "countries.json"),
      JSON.stringify([{ code: "XX", iso3: "XXX", continentSlug: "atlantis", subregion: null, flag: null, latitude: null, longitude: null, landlocked: false, borders: [], aliases: [], capital: [], translations: { tr: { name: "X" } }, hasTravel: false }]),
    );
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow();
    expect(await counts(app())).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0 });
  });

  it("rehber dosyasındaki şehir cities.json'da yoksa bildirilir", async () => {
    const dir = tempDir();
    mkdirSync(join(dir, "city-guides"));
    writeFileSync(join(dir, "city-guides", "FR.json"), JSON.stringify({ countryCode: "FR", guides: [{ citySlug: "yok", reviewed: true, completeLangs: [], translations: { tr: { h1: "x" } } }] }));
    await expect(loadContentSeed(app().db, { dir })).rejects.toThrow(/city-guides\/FR\.json rehberinin şehri yok: yok/);
  });

  it("büyük tohum parçalara bölünerek eklenir (100'den fazla satır)", async () => {
    const dir = tempDir();
    writeFileSync(join(dir, "continents.json"), JSON.stringify([{ slug: "asia", position: 0, translations: { tr: { name: "Asya" } } }]));
    const rows = Array.from({ length: 250 }, (_, i) => {
      const a = String.fromCharCode(65 + Math.floor(i / 26));
      const b = String.fromCharCode(65 + (i % 26));
      return { code: `${a}${b}`, iso3: `${a}${b}X`, continentSlug: "asia", subregion: null, flag: null, latitude: null, longitude: null, landlocked: false, borders: [], aliases: [], capital: [], translations: { tr: { name: `Ülke ${a}${b}` } }, hasTravel: false };
    });
    writeFileSync(join(dir, "countries.json"), JSON.stringify(rows));
    expect((await loadContentSeed(app().db, { dir }))!.countries).toBe(250);
    expect((await loadContentSeed(app().db, { dir }))!.countries).toBe(0);
    expect((await app().db.select().from(countries).where(and(eq(countries.continentSlug, "asia")))).length).toBe(250);
  });
});
