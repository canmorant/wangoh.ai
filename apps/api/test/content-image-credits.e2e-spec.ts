import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { eq, sql } from "drizzle-orm";
import { Logger } from "@nestjs/common";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { OperationalError } from "../src/common/startup-error.js";
import { loadContentSeed } from "../src/content/content.seed.js";
import { ContentModule } from "../src/content/content.module.js";
import { createDatabase, rowsOf } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import { cities, continents, countries, imageCredits } from "../src/db/schema/index.js";
import { DRIZZLE_DIR } from "../src/paths.js";
import { bearer, createAdmin, createTestApp, type TestApp, type TestSession } from "./helpers/index.js";
import { FIXTURE_SEED_DIR, loadFixtureSeed } from "./helpers/content-fixture.js";

/**
 * Görsel atıfları: CC BY / CC BY-SA lisansı yazar, lisans ve kaynak bağlantısının gösterilmesini şart koşar. Web bunu rehber
 * sayfalarının sonunda gösterir; API aynı bilgiyi ülke ve şehir ayrıntısında `imageCredits` olarak taşır (liste uçlarında yok).
 * Fixture (test/fixtures/seed/image-credits.json):
 *   FR ülke görseli fixture-france (atıf gerekli) · Paris fixture-paris (atıf gerekli, çok satırlı yazar, http lisans bağlantısı)
 *   Nice harici https görsel (atıf kaydı yok) · TR ülke görseli fixture-turkiye (kayıt yok) · İstanbul fixture-istanbul (CC0, gerekmez)
 *   İzmir görselsiz · fixture-orphan hiçbir sayfada kullanılmaz (yazar/lisans boş).
 */

const FRANCE = "/images/fixture-france-1a2b3c4d.avif";
const PARIS = "/images/fixture-paris-11223344.avif";
const ORPHAN = "/images/fixture-orphan-99aabbcc.avif";

const CREDIT_KEYS = ["author", "imageUrl", "licenseName", "licenseUrl", "sourceUrl"];
const franceCredit = {
  imageUrl: "https://wangoh.com/og/fixture-france-1a2b3c4d.jpg",
  author: "Test Photographer One",
  licenseName: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_France.jpg",
};
const parisCredit = {
  imageUrl: "https://wangoh.com/og/fixture-paris-11223344.jpg",
  author: "Test Photographer Two\nsecond line",
  licenseName: "CC BY-SA 3.0",
  licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_Paris.jpg",
};
const orphanCredit = {
  imageUrl: "https://wangoh.com/og/fixture-orphan-99aabbcc.jpg",
  author: null,
  licenseName: null,
  licenseUrl: null,
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_Orphan.jpg",
};

describe("görsel atıfları: tohum", () => {
  let t: TestApp;
  const temp: string[] = [];
  beforeAll(async () => {
    t = await createTestApp();
  });
  beforeEach(async () => {
    await t.db.delete(imageCredits);
  });
  afterAll(async () => {
    await t.close();
    for (const dir of temp) rmSync(dir, { recursive: true, force: true });
  });
  const tempDir = (): string => {
    const dir = mkdtempSync(join(tmpdir(), "wangoh-credits-"));
    temp.push(dir);
    return dir;
  };
  const credit = (n: number, over: Record<string, unknown> = {}) => ({
    image: `/images/kredi-${String(n).padStart(4, "0")}.avif`,
    author: `Yazar ${n}`,
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: `https://commons.wikimedia.org/wiki/File:Kredi_${n}.jpg`,
    attributionRequired: true,
    ...over,
  });
  const seedWith = (rows: unknown): string => {
    const dir = tempDir();
    writeFileSync(join(dir, "image-credits.json"), typeof rows === "string" ? rows : JSON.stringify(rows));
    return dir;
  };

  it("fixture tohumu kayıtları kaynaktaki haliyle yazar: satır sonu, http lisans bağlantısı, boş alanlar ve atıf bayrağı korunur", async () => {
    const stats = await loadFixtureSeed(t);
    expect(stats!.imageCredits).toBe(4);
    const rows = await t.db.select().from(imageCredits).orderBy(imageCredits.image);
    expect(rows).toEqual([
      { image: "/images/fixture-france-1a2b3c4d.avif", author: "Test Photographer One", licenseName: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_France.jpg", attributionRequired: true },
      { image: "/images/fixture-istanbul-55667788.avif", author: "Test Photographer Three", licenseName: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_Istanbul.jpg", attributionRequired: false },
      { image: ORPHAN, author: null, licenseName: null, licenseUrl: null, sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_Orphan.jpg", attributionRequired: true },
      { image: PARIS, author: "Test Photographer Two\nsecond line", licenseName: "CC BY-SA 3.0", licenseUrl: "http://creativecommons.org/licenses/by-sa/3.0/", sourceUrl: "https://commons.wikimedia.org/wiki/File:Fixture_Paris.jpg", attributionRequired: true },
    ]);
  });

  it("idempotent: yeniden çalıştırma satır eklemez; yönetici düzenlemesi ezilmez, force tohuma döndürür; silinen kayıt geri eklenir", async () => {
    await loadFixtureSeed(t);
    expect(await loadFixtureSeed(t)).toMatchObject({ imageCredits: 0 });
    expect(await t.db.select().from(imageCredits)).toHaveLength(4);

    await t.db.update(imageCredits).set({ author: "Düzenlenmiş Yazar", attributionRequired: false }).where(eq(imageCredits.image, PARIS));
    await t.db.delete(imageCredits).where(eq(imageCredits.image, ORPHAN));
    expect(await loadFixtureSeed(t)).toMatchObject({ imageCredits: 1 }); // yalnız eksik olan eklenir
    const edited = (await t.db.select().from(imageCredits).where(eq(imageCredits.image, PARIS)))[0]!;
    expect(edited).toMatchObject({ author: "Düzenlenmiş Yazar", attributionRequired: false });

    expect(await loadFixtureSeed(t, true)).toMatchObject({ imageCredits: 4 }); // force: dördü de yazılır
    const restored = (await t.db.select().from(imageCredits).where(eq(imageCredits.image, PARIS)))[0]!;
    expect(restored).toMatchObject({ author: "Test Photographer Two\nsecond line", attributionRequired: true });
    expect(await t.db.select().from(imageCredits)).toHaveLength(4);
  });

  it("100'den fazla kayıt parçalara bölünerek eklenir; ikinci çalıştırma ve force çift kayıt üretmez", async () => {
    const dir = seedWith(Array.from({ length: 250 }, (_, i) => credit(i)));
    expect((await loadContentSeed(t.db, { dir }))!.imageCredits).toBe(250);
    expect((await loadContentSeed(t.db, { dir }))!.imageCredits).toBe(0);
    expect((await loadContentSeed(t.db, { dir, force: true }))!.imageCredits).toBe(250);
    expect(await t.db.select().from(imageCredits)).toHaveLength(250);
  });

  it("dosya yoksa atlanır (kayıt eklenmez); boş dizi geçerlidir", async () => {
    expect((await loadContentSeed(t.db, { dir: tempDir() }))!.imageCredits).toBe(0);
    expect((await loadContentSeed(t.db, { dir: seedWith([]) }))!.imageCredits).toBe(0);
    expect(await t.db.select().from(imageCredits)).toHaveLength(0);
  });

  it("bozuk atıf dosyası Türkçe, dosya ve alan adıyla bildirilir; hiçbir şey yazılmaz", async () => {
    const cases: Array<[label: string, rows: unknown, message: RegExp]> = [
      ["kök dizi değil", {}, /image-credits\.json kök: dizi bekleniyordu/],
      ["görsel yolu web yolu değil", [credit(1, { image: "https://example.com/a.avif" })], /image-credits\.json \[0\]\.image: .*web görsel yolu/],
      ["görsel yolu .jpg", [credit(1, { image: "/images/a.jpg" })], /\[0\]\.image: .*web görsel yolu/],
      ["görsel yok", [{ ...credit(1), image: undefined }], /\[0\]\.image: boş olmayan metin/],
      ["yinelenen görsel", [credit(1), credit(2), credit(1)], /\[2\]\.image: yinelenen görsel: \/images\/kredi-0001\.avif/],
      ["kaynak adresi javascript:", [credit(1, { sourceUrl: "javascript:alert(1)" })], /\[0\]\.sourceUrl: http\(s\) adresi/],
      ["kaynak adresi yok", [credit(1, { sourceUrl: undefined })], /\[0\]\.sourceUrl: boş olmayan metin/],
      ["lisans adresi ftp", [credit(1, { licenseUrl: "ftp://x.org/l" })], /\[0\]\.licenseUrl: http\(s\) adresi/],
      ["lisans adresinde boşluk", [credit(1, { licenseUrl: "https://x.org/a b" })], /\[0\]\.licenseUrl: http\(s\) adresi/],
      ["yazar sayı", [credit(1, { author: 5 })], /\[0\]\.author: boş olmayan metin/],
      ["atıf bayrağı yok", [credit(1, { attributionRequired: undefined })], /\[0\]\.attributionRequired: true\/false/],
      ["atıf bayrağı metin", [credit(1, { attributionRequired: "true" })], /\[0\]\.attributionRequired: true\/false/],
    ];
    for (const [label, rows, message] of cases) {
      const dir = seedWith(rows);
      await expect(loadContentSeed(t.db, { dir }), label).rejects.toThrow(OperationalError);
      await expect(loadContentSeed(t.db, { dir }), label).rejects.toThrow(message);
      expect(await t.db.select().from(imageCredits), label).toHaveLength(0);
    }
    await expect(loadContentSeed(t.db, { dir: seedWith("{ bozuk json") })).rejects.toThrow(/okunamadı: image-credits\.json/);
  });

  it("işlem bütünlüğü: atıf dosyası geçerli olsa da ortada hata olursa atıflar da yazılmaz", async () => {
    const dir = seedWith([credit(1)]);
    writeFileSync(join(dir, "continents.json"), JSON.stringify([{ slug: "rollback-testi", position: 9, translations: { tr: { name: "Geri alınmalı" } } }]));
    // Ülkenin kıtası yok: yabancı anahtar ihlali işlemi geri alır.
    writeFileSync(
      join(dir, "countries.json"),
      JSON.stringify([{ code: "XX", iso3: "XXX", continentSlug: "atlantis", subregion: null, flag: null, latitude: null, longitude: null, landlocked: false, borders: [], aliases: [], capital: [], translations: { tr: { name: "X" } }, hasTravel: false }]),
    );
    await expect(loadContentSeed(t.db, { dir })).rejects.toThrow();
    expect(await t.db.select().from(imageCredits)).toHaveLength(0);
    expect(await t.db.select().from(continents).where(eq(continents.slug, "rollback-testi"))).toHaveLength(0);
  });
});

describe("görsel atıfları: ülke ve şehir ayrıntısı", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
  });
  // Her test fixture'ın tohum durumundan başlar (önceki testin düzenlemeleri ve eklediği şehir geri alınır).
  beforeEach(async () => {
    await t.db.delete(cities).where(eq(cities.slug, "lyon"));
    await loadFixtureSeed(t, true);
  });
  afterEach(async () => {
    await t.db.delete(cities).where(eq(cities.slug, "lyon"));
  });
  afterAll(() => t.close());

  const get = (url: string) => t.http.get(url);
  const asAdmin = () => bearer(admin.accessToken);

  describe("GET /v1/countries/:code", () => {
    it("ülke görseli ve şehir kartı görsellerinin atfı: web ülke sayfasıyla aynı sırada; harici ve atıf kaydı olmayan görseller yok", async () => {
      const res = await get("/v1/countries/FR");
      expect(res.status).toBe(200);
      expect(res.body.imageCredits).toEqual([franceCredit, parisCredit]);
      for (const item of res.body.imageCredits) expect(Object.keys(item).sort()).toEqual(CREDIT_KEYS);
      // Eşleştirme anahtarı: atfın imageUrl'ı yanıttaki görsel adreslerinden biriyle birebir aynıdır.
      const shown = [res.body.imageUrl, ...res.body.cities.map((c: { imageUrl: string | null }) => c.imageUrl)];
      for (const item of res.body.imageCredits) expect(shown).toContain(item.imageUrl);
      expect(res.body.cities.find((c: { slug: string }) => c.slug === "nice").imageUrl).toBe("https://example.com/nice.jpg"); // harici: atıf yok
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
    });

    it("dilden bağımsız: lang=en ve es aynı atıfları verir", async () => {
      const tr = (await get("/v1/countries/FR")).body.imageCredits;
      for (const lang of ["en", "es"]) expect((await get(`/v1/countries/FR?lang=${lang}`)).body.imageCredits, lang).toEqual(tr);
    });

    it("atfı olmayan görsel: kayıt yoksa, CC0/kamu malıysa ya da görsel yoksa boş dizi", async () => {
      // TR: ülke görselinin kaydı yok, İstanbul CC0 (atıf gerekmiyor), İzmir görselsiz.
      const tr = await get("/v1/countries/TR");
      expect(tr.body.imageUrl).not.toBeNull();
      expect(tr.body.imageCredits).toEqual([]);
      // Seyahat bilgisi (görsel ve şehir) olmayan ülke.
      const de = await get("/v1/countries/DE");
      expect(de.body).toMatchObject({ hasTravel: false, imageUrl: null, cities: [] });
      expect(de.body.imageCredits).toEqual([]);
    });

    it("atıf gerekli bayrağı kapatılırsa kayıt yanıttan düşer; açılırsa geri gelir", async () => {
      await t.db.update(imageCredits).set({ attributionRequired: false }).where(eq(imageCredits.image, FRANCE));
      expect((await get("/v1/countries/FR")).body.imageCredits).toEqual([parisCredit]);
      await t.db.update(imageCredits).set({ attributionRequired: true }).where(eq(imageCredits.image, FRANCE));
      expect((await get("/v1/countries/FR")).body.imageCredits).toEqual([franceCredit, parisCredit]);
    });

    it("aynı görsel birden çok yerde geçerse tek kez; sıra ülke görseli, sonra şehir sırası", async () => {
      // Paris, ülkeyle aynı görseli kullanır: tek kayıt.
      await t.db.update(cities).set({ image: FRANCE }).where(eq(cities.slug, "paris"));
      expect((await get("/v1/countries/FR")).body.imageCredits).toEqual([franceCredit]);

      // Yeni şehir (en başta): sıra = ülke görseli, şehirler position sırasıyla.
      await t.db.update(cities).set({ image: PARIS, position: 5 }).where(eq(cities.slug, "paris"));
      await t.db.insert(cities).values({ countryCode: "FR", slug: "lyon", position: 0, image: ORPHAN, translations: { tr: { name: "Lyon", description: "Test" } } });
      const res = await get("/v1/countries/FR");
      expect(res.body.cities.map((c: { slug: string }) => c.slug)).toEqual(["lyon", "nice", "paris"]);
      expect(res.body.imageCredits).toEqual([franceCredit, orphanCredit, parisCredit]);
    });

    it("yönetici görseli değiştirince atıf yeni görseli izler; yazma yanıtı da imageCredits taşır", async () => {
      const patched = await t.http.patch("/v1/countries/FR").set(asAdmin()).send({ travel: { image: ORPHAN } });
      expect(patched.status, JSON.stringify(patched.body)).toBe(200);
      expect(patched.body.imageCredits).toEqual([orphanCredit, parisCredit]);
      expect((await get("/v1/countries/FR")).body.imageCredits).toEqual([orphanCredit, parisCredit]);
      // Harici (https) görsele geçilince o görselin atfı olmaz.
      const external = await t.http.patch("/v1/countries/FR").set(asAdmin()).send({ travel: { image: "https://example.com/fr.jpg" } });
      expect(external.body.imageCredits).toEqual([parisCredit]);
    });

    it("liste uçları atıf taşımaz (yalnız ayrıntı)", async () => {
      const countriesList = await get("/v1/countries?hasTravel=true");
      expect(countriesList.body.items.length).toBeGreaterThan(0);
      for (const item of countriesList.body.items) expect(item).not.toHaveProperty("imageCredits");
      const cityList = await get("/v1/countries/FR/cities");
      expect(cityList.body.items.length).toBeGreaterThan(0);
      for (const item of cityList.body.items) expect(item).not.toHaveProperty("imageCredits");
      // Ülke ayrıntısındaki şehir özetleri de atıf taşımaz; atıflar ülkenin kendi alanındadır.
      for (const item of (await get("/v1/countries/FR")).body.cities) expect(item).not.toHaveProperty("imageCredits");
    });
  });

  describe("GET /v1/countries/:code/cities/:slug", () => {
    it("yalnız şehrin kendi görselinin atfı (web şehir sayfası kuralı); ülke ve kardeş şehir atıfları gelmez", async () => {
      const res = await get("/v1/countries/FR/cities/paris");
      expect(res.status).toBe(200);
      expect(res.body.imageCredits).toEqual([parisCredit]);
      expect(res.body.imageCredits[0].imageUrl).toBe(res.body.imageUrl);
      expect(Object.keys(res.body.imageCredits[0]).sort()).toEqual(CREDIT_KEYS);
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
    });

    it("atfı olmayan görsel: harici görsel, CC0 görsel, kaydı olmayan ve görselsiz şehir boş dizi verir", async () => {
      for (const [code, slug] of [["FR", "nice"], ["TR", "istanbul"], ["TR", "izmir"]] as const) {
        const res = await get(`/v1/countries/${code}/cities/${slug}`);
        expect(res.status, slug).toBe(200);
        expect(res.body.imageCredits, slug).toEqual([]);
      }
      expect((await get("/v1/countries/FR/cities/nice")).body.imageUrl).toBe("https://example.com/nice.jpg");
      expect((await get("/v1/countries/TR/cities/izmir")).body.imageUrl).toBeNull();
    });

    it("dilden bağımsız; rehberi olan ve olmayan şehirde aynı biçim", async () => {
      for (const lang of ["tr", "en", "es"]) expect((await get(`/v1/countries/FR/cities/paris?lang=${lang}`)).body.imageCredits, lang).toEqual([parisCredit]);
      const noGuide = await get("/v1/countries/FR/cities/nice");
      expect(noGuide.body.guide).toBeNull();
      expect(noGuide.body).toHaveProperty("imageCredits");
    });

    it("yönetici şehir görselini değiştirince atıf yeni görseli izler (yazma yanıtı dahil); görsel kaldırılınca boşalır", async () => {
      const set = await t.http.patch("/v1/countries/FR/cities/nice").set(asAdmin()).send({ image: ORPHAN });
      expect(set.status, JSON.stringify(set.body)).toBe(200);
      expect(set.body.imageCredits).toEqual([orphanCredit]);
      expect((await get("/v1/countries/FR/cities/nice")).body.imageCredits).toEqual([orphanCredit]);
      const cleared = await t.http.patch("/v1/countries/FR/cities/nice").set(asAdmin()).send({ image: null });
      expect(cleared.body.imageCredits).toEqual([]);
    });

    it("var olmayan şehir ve ülke yine 404; biçimi bozuk adres 400", async () => {
      expect((await get("/v1/countries/FR/cities/yok")).status).toBe(404);
      expect((await get("/v1/countries/ZZ/cities/paris")).status).toBe(404);
      expect((await get("/v1/countries/FR/cities/Paris%20Merkez")).status).toBe(400);
    });
  });
});

describe("görsel atıfları: açılış uyarısı", () => {
  const temp: string[] = [];
  afterEach(() => vi.restoreAllMocks());
  afterAll(() => {
    for (const dir of temp) rmSync(dir, { recursive: true, force: true });
  });

  /** Açılış denetimini çalıştırır ve yazılan uyarıları döner. */
  const warnings = async (t: TestApp): Promise<string[]> => {
    const warn = vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    try {
      await t.app.get(ContentModule).onApplicationBootstrap();
      return warn.mock.calls.map((call) => String(call[0]));
    } finally {
      warn.mockRestore();
    }
  };

  it("içerik varken atıf tablosu boşsa açılışta uyarır (tohum çalıştırılmamış yükseltme); içerik yoksa ya da atıflar yüklüyse susar", async () => {
    const t = await createTestApp();
    try {
      expect(await warnings(t)).toEqual([]); // boş veritabanı: uyarılacak içerik yok
      await loadFixtureSeed(t);
      await t.db.delete(imageCredits);
      const messages = await warnings(t);
      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain("image_credits");
      expect(messages[0]).toContain("db:seed");
      await loadFixtureSeed(t);
      expect(await warnings(t)).toEqual([]);
    } finally {
      await t.close();
    }
  });

  it("SEED_ON_BOOT açıkken uyarmaz (tohum atıfları açılışta yükler); tablo yoksa (MIGRATE_ON_BOOT=false) açılışı bozmaz", async () => {
    const seedDir = mkdtempSync(join(tmpdir(), "wangoh-credits-boot-"));
    temp.push(seedDir);
    const seeding = await createTestApp({ config: { seedOnBoot: true, seedDir } });
    try {
      await loadFixtureSeed(seeding);
      await seeding.db.delete(imageCredits);
      expect(await warnings(seeding)).toEqual([]);
    } finally {
      await seeding.close();
    }

    const noTables = await createTestApp({ config: { migrateOnBoot: false } });
    try {
      expect(await warnings(noTables)).toEqual([]);
    } finally {
      await noTables.close();
    }
  });
});

describe("görsel atıfları: migrasyon", () => {
  const temp: string[] = [];
  afterAll(() => {
    for (const dir of temp) rmSync(dir, { recursive: true, force: true });
  });

  it("0000 uygulanmış bir veritabanına 0001 eklenir: mevcut veri korunur, image_credits oluşur ve tohum yüklenir", async () => {
    // Yalnız ilk migrasyonu içeren klasör: eski bir kurulumu taklit eder.
    const dir = mkdtempSync(join(tmpdir(), "wangoh-migrations-"));
    temp.push(dir);
    mkdirSync(join(dir, "meta"));
    const journal = JSON.parse(readFileSync(join(DRIZZLE_DIR, "meta", "_journal.json"), "utf8")) as { entries: Array<{ idx: number; tag: string }> };
    expect(journal.entries.map((e) => e.tag)).toEqual(["0000_init", "0001_image_credits"]); // 0000 değiştirilmedi, 0001 yalnız eklendi
    writeFileSync(join(dir, "meta", "_journal.json"), JSON.stringify({ ...journal, entries: journal.entries.slice(0, 1) }));
    cpSync(join(DRIZZLE_DIR, "0000_init.sql"), join(dir, "0000_init.sql"));

    const handle = await createDatabase({ databaseUrl: undefined, pgliteDir: "memory://" });
    try {
      await runMigrations(handle, dir);
      const tables = async () => rowsOf<{ table_name: string }>(await handle.db.execute(sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`)).map((r) => r.table_name);
      expect(await tables()).not.toContain("image_credits");
      await handle.db.insert(continents).values({ slug: "europe", position: 0, translations: { tr: { name: "Avrupa" } } });
      await handle.db.insert(countries).values({ code: "FR", iso3: "FRA", continentSlug: "europe", translations: { tr: { name: "Fransa" } } });

      await runMigrations(handle); // tam klasör: yalnız 0001 uygulanır
      await runMigrations(handle); // tekrar çağrı zararsız
      expect(await tables()).toContain("image_credits");
      const columns = rowsOf<{ column_name: string; data_type: string; is_nullable: string; column_default: string | null }>(
        await handle.db.execute(sql`select column_name, data_type, is_nullable, column_default from information_schema.columns where table_name = 'image_credits' order by column_name`),
      );
      expect(columns.map((c) => [c.column_name, c.data_type, c.is_nullable])).toEqual([
        ["attribution_required", "boolean", "NO"],
        ["author", "text", "YES"],
        ["image", "text", "NO"],
        ["license_name", "text", "YES"],
        ["license_url", "text", "YES"],
        ["source_url", "text", "NO"],
      ]);
      expect(columns.find((c) => c.column_name === "attribution_required")!.column_default).toBe("true");
      const primaryKey = rowsOf<{ column_name: string }>(
        await handle.db.execute(sql`select a.attname as column_name from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any(i.indkey) where i.indrelid = 'image_credits'::regclass and i.indisprimary`),
      );
      expect(primaryKey.map((r) => r.column_name)).toEqual(["image"]);

      // Mevcut veri yerinde; tohum yalnız eksikleri ekler (FR zaten var).
      expect((await handle.db.select().from(countries)).map((c) => c.code)).toEqual(["FR"]);
      const stats = await loadContentSeed(handle.db, { dir: FIXTURE_SEED_DIR });
      expect(stats).toMatchObject({ continents: 2, countries: 5, imageCredits: 4 });
      expect(await handle.db.select().from(imageCredits)).toHaveLength(4);
    } finally {
      await handle.close();
    }
  }, 60_000);
});
