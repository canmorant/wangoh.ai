import { readFileSync } from "node:fs";
import { join } from "node:path";
import { plainToInstance } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import { sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadContentSeed } from "../src/content/content.seed.js";
import { slugify } from "../src/content/slug.js";
import { CityFieldsDto } from "../src/content/dto/city.dto.js";
import { CountryFieldsPatchDto, TravelFieldsPatchDto } from "../src/content/dto/country.dto.js";
import { GuideBodyInputDto } from "../src/content/dto/guide.dto.js";
import { flattenValidationErrors } from "../src/common/validation.js";
import { rowsOf } from "../src/db/client.js";
import { cities, cityGuides, countries, countryTravel, imageCredits } from "../src/db/schema/index.js";
import { SEED_DIR } from "../src/paths.js";
import { bearer, createAdmin, createTestApp, type TestApp } from "./helpers/index.js";

/**
 * GERÇEK tohum (apps/api/seed, web verisinden üretilir): yalnız sayıları, bütünlüğü ve veri/DTO uyumunu doğrular.
 * Fixture ile yazılan davranış testleri `content*.e2e-spec.ts` dosyalarındadır. Bu dosya varsayılan test
 * akışında çalışır ve tüm tohumu PGlite'a yükler. Duvar saati sınırı YOKTUR: süre makine yüküne bağlıdır (sakin makinede
 * birkaç saniye, yüklü ya da paylaşımlı çalıştırıcıda katları); takılmaya karşı koruma vitest'in test zaman aşımıdır.
 */
describe("gerçek içerik tohumu", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  }, 60_000);
  afterAll(() => t.close());

  const get = (url: string) => t.http.get(url);
  const errorsOf = (errors: ValidationError[]): string => JSON.stringify(flattenValidationErrors(errors, "", 5));

  it("tüm tohum PGlite'a yüklenir; sayılar sözleşmedeki gibi; ikinci çalıştırma hiçbir şey eklemez", async () => {
    const stats = await loadContentSeed(t.db, { dir: SEED_DIR });
    expect(stats).toEqual({ continents: 5, countries: 196, countryTravel: 45, cities: 360, cityGuides: 358, imageCredits: 371 });

    const again = await loadContentSeed(t.db, { dir: SEED_DIR });
    expect(again).toEqual({ continents: 0, countries: 0, countryTravel: 0, cities: 0, cityGuides: 0, imageCredits: 0 });
  }, 180_000);

  it("bütünlük: slug = slugify(Türkçe ad), (ülke, slug) benzersiz, her şehir seyahat ülkesinde, completeLangs ↔ çeviri anahtarları", async () => {
    const cityRows = await t.db.select({ countryCode: cities.countryCode, slug: cities.slug, translations: cities.translations, completeLangs: cities.completeLangs }).from(cities);
    expect(cityRows).toHaveLength(360);
    expect(new Set(cityRows.map((c) => `${c.countryCode}:${c.slug}`)).size).toBe(360);
    for (const c of cityRows) expect(c.slug, `${c.countryCode}/${c.translations.tr.name}`).toBe(slugify(c.translations.tr.name));

    const travelCodes = new Set((await t.db.select({ code: countryTravel.countryCode }).from(countryTravel)).map((r) => r.code));
    expect(travelCodes.size).toBe(45);
    expect(cityRows.every((c) => travelCodes.has(c.countryCode))).toBe(true);
    expect((await t.db.select({ code: countries.code }).from(countries).where(sql`${countries.hasTravel}`)).length).toBe(45);

    // complete_langs, translations anahtarlarının (tr hariç) tam olarak kendisi.
    for (const table of ["cities", "country_travel", "city_guides"]) {
      const rows = rowsOf<{ complete: string[]; keys: string[] }>(
        await t.db.execute(sql.raw(`select complete_langs as complete, array(select jsonb_object_keys(translations)) as keys from ${table}`)),
      );
      expect(rows.length, table).toBeGreaterThan(0);
      for (const row of rows) {
        expect([...row.complete].sort(), table).toEqual(row.keys.filter((k) => k !== "tr").sort());
        expect(row.keys, table).toContain("tr");
      }
    }
    // 2 şehrin (Svalbard: Pyramiden, Barentsburg) rehberi yok.
    const withoutGuide = rowsOf<{ slug: string }>(await t.db.execute(sql`select c.slug from cities c left join city_guides g on g.city_id = c.id where g.city_id is null order by c.slug`));
    expect(withoutGuide.map((r) => r.slug)).toEqual(["barentsburg", "pyramiden"]);
    expect((await t.db.select({ id: cityGuides.cityId }).from(cityGuides)).length).toBe(358);
  });

  it("gerçek veri yönetici şemasından geçer: ülke/şehir/seyahat/rehber çevirileri DTO doğrulamasıyla (whitelist) uyumlu", async () => {
    const options = { whitelist: true, forbidNonWhitelisted: true } as const;
    const check = async <T extends object>(cls: new () => T, plain: unknown, label: string) => {
      const errors = await validate(plainToInstance(cls, plain as object), options);
      expect(errors.length, `${label}: ${errorsOf(errors)}`).toBe(0);
    };

    for (const c of await t.db.select({ code: countries.code, translations: countries.translations }).from(countries)) {
      for (const [lang, body] of Object.entries(c.translations)) await check(CountryFieldsPatchDto, body, `ülke ${c.code}/${lang}`);
    }
    for (const row of await t.db.select({ code: countryTravel.countryCode, translations: countryTravel.translations }).from(countryTravel)) {
      for (const [lang, body] of Object.entries(row.translations)) await check(TravelFieldsPatchDto, body, `seyahat ${row.code}/${lang}`);
    }
    for (const c of await t.db.select({ code: cities.countryCode, slug: cities.slug, translations: cities.translations }).from(cities)) {
      for (const [lang, body] of Object.entries(c.translations)) await check(CityFieldsDto, body, `şehir ${c.code}/${c.slug}/${lang}`);
    }
    const guides = rowsOf<{ label: string; lang: string; body: unknown }>(
      await t.db.execute(sql`select c.country_code || '/' || c.slug as label, e.key as lang, e.value as body from city_guides g join cities c on c.id = g.city_id, jsonb_each(g.translations) e`),
    );
    expect(guides.length).toBe(358 * 3);
    for (const g of guides) await check(GuideBodyInputDto, g.body, `rehber ${g.label}/${g.lang}`);
  }, 60_000);

  it("kıtalar ve ülkeler: sayılar, sıralama, süzgeçler", async () => {
    const continents = (await get("/v1/continents")).body as Array<{ slug: string; countryCount: number; travelCountryCount: number; name: string }>;
    expect(continents.map((c) => c.slug)).toEqual(["europe", "asia", "americas", "africa", "oceania"]);
    expect(continents.reduce((n, c) => n + c.countryCount, 0)).toBe(196);
    expect(continents.reduce((n, c) => n + c.travelCountryCount, 0)).toBe(45);
    expect(continents.map((c) => c.name)).toEqual(["Avrupa", "Asya", "Amerika", "Afrika", "Okyanusya"]);

    const page1 = await get("/v1/countries?pageSize=100");
    const page2 = await get("/v1/countries?pageSize=100&page=2");
    expect(page1.body.total).toBe(196);
    expect(page1.body.items).toHaveLength(100);
    expect(page2.body.items).toHaveLength(96);
    const all = [...page1.body.items, ...page2.body.items] as Array<{ code: string; name: string }>;
    expect(new Set(all.map((c) => c.code)).size).toBe(196);

    const featured = await get("/v1/countries?hasTravel=true&pageSize=100");
    expect(featured.body.total).toBe(45);
    expect(featured.body.items[0]).toMatchObject({ code: "JP", name: "Japonya", hasTravel: true });
    expect(featured.body.items.at(-1).code).toBe("SJ"); // gizli rota (Svalbard) son sırada
    expect((await get("/v1/countries?hasTravel=false&pageSize=100")).body.total).toBe(151);
    expect((await get("/v1/countries?continent=oceania&pageSize=100")).body.total).toBe(continents[4]!.countryCount);

    // Yük boyutu: liste uçları büyük jsonb taşımaz.
    expect(JSON.stringify(page1.body).length).toBeLessThan(60_000);
    expect(JSON.stringify((await get("/v1/countries/JP/cities")).body).length).toBeLessThan(8_000);
  });

  it("Türkçe arama gerçek adlarda: İ/ı, aksan ve büyük/küçük harf duyarsız", async () => {
    const codes = async (q: string) => ((await get(`/v1/countries?q=${encodeURIComponent(q)}&pageSize=100`)).body.items as Array<{ code: string }>).map((c) => c.code);
    for (const q of ["Çekya", "CEKYA", "çekya", "ÇEKYA"]) expect(await codes(q), q).toContain("CZ");
    for (const q of ["Türkiye", "TURKIYE", "türkiye", "TÜRKİYE", "turkiye"]) expect(await codes(q), q).toContain("TR");
    for (const q of ["İran", "iran", "IRAN", "ıran"]) expect(await codes(q), q).toContain("IR");
    for (const q of ["Irak", "irak", "IRAK", "ırak", "İRAK"]) expect(await codes(q), q).toContain("IQ");
    expect(await codes("japonya")).toEqual(["JP"]);
    expect(await codes("JAPAN")).toContain("JP"); // İngilizce ad
    expect(await codes("Svalbard")).toContain("SJ");
    expect(await codes("%")).toEqual([]);

    const cityCodes = async (code: string, q: string) => ((await get(`/v1/countries/${code}/cities?q=${encodeURIComponent(q)}`)).body.items as Array<{ slug: string }>).map((c) => c.slug);
    for (const q of ["Şanlıurfa", "SANLIURFA", "sanliurfa", "ŞANLIURFA"]) expect(await cityCodes("TR", q), q).toContain("sanliurfa");
    for (const q of ["Izmir", "izmir", "İZMİR", "ızmır"]) expect(await cityCodes("TR", q), q).toContain("izmir");
  });

  it("her ülke ve her şehir ayrıntısı üç dilde çözülür: rehberler tam, ilgili rehber/rota bağlantıları çözümlü, görseller mutlak", async () => {
    const countryList = (await get("/v1/countries?hasTravel=true&pageSize=100")).body.items as Array<{ code: string }>;
    let guideCount = 0;
    let cityCount = 0;
    for (const { code } of countryList) {
      for (const lang of ["tr", "en", "es"] as const) {
        const res = await get(`/v1/countries/${code}?lang=${lang}`);
        expect(res.status, `${code}/${lang}`).toBe(200);
        const body = res.body;
        expect(body.travel, `${code}/${lang}`).toMatchObject({ lang, complete: true });
        expect(body.travel.imageUrl, code).toMatch(/^https:\/\/wangoh\.com\/og\/[a-z0-9-]+\.jpg$/); // ülke görselleri hep web /og JPEG'i
        expect(body.flagUrl).toBe(`https://wangoh.com/flags/${code.toLowerCase()}.svg`);
        for (const route of body.travel.hub.routeIdeas) {
          expect(route.cityLinks.length, `${code} ${route.title}`).toBe(route.cities.length); // her rota şehri slug'a çözüldü
        }
        expect(body.cities.every((c: { lang: string; complete: boolean }) => c.lang === lang && c.complete)).toBe(true);
      }
      const tr = (await get(`/v1/countries/${code}`)).body;
      for (const city of tr.cities as Array<{ slug: string; hasGuide: boolean }>) {
        cityCount++;
        const res = await get(`/v1/countries/${code}/cities/${city.slug}`);
        expect(res.status, `${code}/${city.slug}`).toBe(200);
        expect(res.body.hasGuide).toBe(city.hasGuide);
        if (!city.hasGuide) {
          expect(res.body.guide).toBeNull();
          continue;
        }
        guideCount++;
        const guide = res.body.guide;
        expect(guide, `${code}/${city.slug}`).toMatchObject({ lang: "tr", complete: true, reviewed: true });
        expect(guide.sections.length).toBeGreaterThan(0);
        for (const related of guide.relatedGuides ?? []) expect(related.slug, `${code}/${city.slug} → ${related.city}`).toBeTypeOf("string");
        if (res.body.imageUrl) expect(res.body.imageUrl).toMatch(/^https:\/\//);
      }
    }
    expect(cityCount).toBe(360);
    expect(guideCount).toBe(358);
  }, 60_000);

  it("örnek gerçek şehir: Tokyo (tr/en/es), Paris, rehberin her bölümü dolu", async () => {
    const tr = (await get("/v1/countries/JP/cities/tokyo")).body;
    expect(tr).toMatchObject({ slug: "tokyo", name: "Tokyo", country: { code: "JP", name: "Japonya" }, imageUrl: "https://wangoh.com/og/photo-1540959733332-eab4deabeeaf-a87af73a.jpg" });
    expect(tr.guide).toMatchObject({ lang: "tr", complete: true });
    const en = (await get("/v1/countries/JP/cities/tokyo?lang=en")).body;
    expect(en).toMatchObject({ lang: "en", complete: true, country: { name: "Japan" } });
    expect(en.guide).toMatchObject({ lang: "en", complete: true });
    expect(en.guide.h1).not.toBe(tr.guide.h1);
    const es = (await get("/v1/countries/JP/cities/tokyo?lang=es")).body;
    expect(es).toMatchObject({ lang: "es", complete: true, country: { name: "Japón" } });
    expect(es.guide.lang).toBe("es");
    // Harici (https) görselli şehir olduğu gibi döner.
    const external = rowsOf<{ slug: string; country_code: string; image: string }>(await t.db.execute(sql`select slug, country_code, image from cities where image like 'https://%' order by slug`));
    expect(external.length).toBeGreaterThan(0);
    for (const row of external) expect((await get(`/v1/countries/${row.country_code}/cities/${row.slug}`)).body.imageUrl).toBe(row.image);
  });

  it("görsel atıfları: 371 kayıt tohumdaki gibi; her ülke ve şehir ayrıntısı atfı web ImageCredits kuralıyla verir (tekilleştir, yalnız atıf gerektirenler)", async () => {
    type SeedCredit = { image: string; author: string | null; licenseName: string | null; licenseUrl: string | null; sourceUrl: string; attributionRequired: boolean };
    const read = <T,>(name: string): T => JSON.parse(readFileSync(join(SEED_DIR, name), "utf8")) as T;
    const seedCredits = read<SeedCredit[]>("image-credits.json");
    const seedCities = read<Array<{ countryCode: string; slug: string; position: number; image: string | null }>>("cities.json");
    const seedTravel = read<Array<{ countryCode: string; image: string | null }>>("country-travel.json");
    const byImage = new Map(seedCredits.map((c) => [c.image, c]));
    expect(seedCredits).toHaveLength(371);
    expect(seedCredits.filter((c) => c.attributionRequired)).toHaveLength(299);

    // Veritabanındaki tablo tohumla aynı (alan alan).
    const rows = await t.db.select().from(imageCredits);
    expect(rows).toHaveLength(371);
    const dbByImage = new Map(rows.map((r) => [r.image, r]));
    for (const c of seedCredits) expect(dbByImage.get(c.image), c.image).toEqual(c);

    // Web kuralı: yolları tekilleştir (ilk geçiş sırası), kaydı olan ve atıf gerektirenleri sırayla göster.
    const og = (image: string) => `https://wangoh.com/og/${/^\/images\/(.+)\.avif$/.exec(image)![1]}.jpg`;
    const expectedFor = (images: Array<string | null>) =>
      [...new Set(images.filter((i): i is string => i !== null))].flatMap((image) => {
        const c = byImage.get(image);
        return c && c.attributionRequired ? [{ imageUrl: og(image), author: c.author, licenseName: c.licenseName, licenseUrl: c.licenseUrl, sourceUrl: c.sourceUrl }] : [];
      });
    const citiesOf = (code: string) => seedCities.filter((c) => c.countryCode === code).sort((a, b) => a.position - b.position || (a.slug < b.slug ? -1 : 1));

    let countriesWithCredits = 0;
    let citiesWithCredits = 0;
    let citiesWithoutCredits = 0;
    for (const { countryCode, image } of seedTravel) {
      const country = await get(`/v1/countries/${countryCode}`);
      expect(country.status, countryCode).toBe(200);
      const expected = expectedFor([image, ...citiesOf(countryCode).map((c) => c.image)]);
      expect(country.body.imageCredits, countryCode).toEqual(expected);
      if (expected.length > 0) countriesWithCredits++;
      // Atfın imageUrl'ı sayfadaki görsel adreslerinden biridir (eşleştirme anahtarı).
      const shown = new Set([country.body.imageUrl, ...country.body.cities.map((c: { imageUrl: string | null }) => c.imageUrl)]);
      for (const credit of country.body.imageCredits) expect(shown.has(credit.imageUrl), `${countryCode} ${credit.imageUrl}`).toBe(true);

      for (const city of citiesOf(countryCode)) {
        const res = await get(`/v1/countries/${countryCode}/cities/${city.slug}`);
        expect(res.status, `${countryCode}/${city.slug}`).toBe(200);
        const cityExpected = expectedFor([city.image]);
        expect(res.body.imageCredits, `${countryCode}/${city.slug}`).toEqual(cityExpected);
        if (cityExpected.length > 0) {
          citiesWithCredits++;
          expect(res.body.imageCredits[0].imageUrl).toBe(res.body.imageUrl);
        } else citiesWithoutCredits++;
      }
    }
    expect(countriesWithCredits).toBeGreaterThan(30);
    expect(citiesWithCredits + citiesWithoutCredits).toBe(360);
    expect(citiesWithCredits).toBeGreaterThan(250);

    // Gerçek bir örnek: Zagreb (Wikimedia Commons, CC BY-SA 2.0), kaynak web verisiyle birebir.
    const zagreb = (await get("/v1/countries/HR/cities/zagreb")).body;
    expect(zagreb.imageCredits).toEqual([
      {
        imageUrl: "https://wangoh.com/og/zagreb-29255640143-297b40ff.jpg",
        author: "Nick Savchenko from Kiev, Ukraine",
        licenseName: "CC BY-SA 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Zagreb_(29255640143).jpg",
      },
    ]);
    // Unsplash görselli Tokyo ve ülke sayfası (hepsi Unsplash): atıf gerekmez. Harici (https) görselli Jeju: kayıt yok.
    expect((await get("/v1/countries/JP/cities/tokyo")).body.imageCredits).toEqual([]);
    expect((await get("/v1/countries/JP")).body.imageCredits).toEqual([]);
    const jeju = (await get("/v1/countries/KR/cities/jeju-adasi")).body;
    expect(jeju.imageUrl).toMatch(/^https:\/\/(?!wangoh\.com)/);
    expect(jeju.imageCredits).toEqual([]);
    // Seyahat içeriği olmayan ülke ve liste uçları.
    const [plain] = (await get("/v1/countries?hasTravel=false&pageSize=1")).body.items as Array<{ code: string }>;
    const plainDetail = (await get(`/v1/countries/${plain!.code}`)).body;
    expect(plainDetail).toMatchObject({ hasTravel: false, imageUrl: null, cities: [] });
    expect(plainDetail.imageCredits).toEqual([]);
    expect(JSON.stringify((await get("/v1/countries?pageSize=100")).body)).not.toContain("imageCredits");
  }, 120_000);

  it("yönetici gerçek bir rehberi kendi çıktısıyla geri yazabilir (yanıt alanları yazma şemasından geçer)", async () => {
    const admin = await createAdmin(t);
    const res = await get("/v1/countries/FR/cities/paris");
    const { lang: _l, complete: _c, reviewed, ...body } = res.body.guide;
    const patched = await t.http.patch("/v1/countries/FR/cities/paris").set(bearer(admin.accessToken)).send({ guide: { translations: { tr: body }, reviewed } });
    expect(patched.status, JSON.stringify(patched.body).slice(0, 400)).toBe(200);
    const after = (await get("/v1/countries/FR/cities/paris")).body.guide;
    expect(after).toEqual(res.body.guide);

    const country = (await get("/v1/countries/FR")).body;
    const hub = country.travel.hub;
    const patchedCountry = await t.http.patch("/v1/countries/FR").set(bearer(admin.accessToken)).send({ travel: { translations: { tr: { hub } } } });
    expect(patchedCountry.status, JSON.stringify(patchedCountry.body).slice(0, 400)).toBe(200);
    expect((await get("/v1/countries/FR")).body).toEqual(country);
  });
});
