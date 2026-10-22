import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestApp, type TestApp } from "./helpers/index.js";
import { loadFixtureSeed } from "./helpers/content-fixture.js";

/**
 * İçerik okuma uçları (kıtalar, ülkeler, şehirler, rehber): gerçek PGlite + fixture tohumu
 * (test/fixtures/seed: 3 kıta, 6 ülke, 2 öne çıkan, 4 şehir, 2 rehber; en/es kısmen tam).
 */
describe("içerik okuma uçları", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
    await loadFixtureSeed(t);
  });
  afterAll(() => t.close());

  const get = (url: string) => t.http.get(url);
  const names = (res: { body: { items: Array<{ name: string }> } }) => res.body.items.map((i) => i.name);

  describe("GET /v1/continents", () => {
    it("kıtaları sırayla, ülke sayılarıyla döner; herkese açık ve önbelleklenebilir", async () => {
      const res = await get("/v1/continents");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
      expect(res.body).toEqual([
        { slug: "europe", position: 0, name: "Avrupa", lang: "tr", complete: true, countryCount: 3, travelCountryCount: 1 },
        { slug: "asia", position: 1, name: "Asya", lang: "tr", complete: true, countryCount: 3, travelCountryCount: 1 },
        { slug: "oceania", position: 2, name: "Okyanusya", lang: "tr", complete: true, countryCount: 0, travelCountryCount: 0 },
      ]);
    });

    it("lang=en/es: çeviri varsa o dil, yoksa Türkçeye düşer ve complete=false", async () => {
      const en = await get("/v1/continents?lang=en");
      expect(en.body.map((c: { name: string; lang: string; complete: boolean }) => [c.name, c.lang, c.complete])).toEqual([
        ["Europe", "en", true],
        ["Asia", "en", true],
        ["Okyanusya", "tr", false],
      ]);
      const es = await get("/v1/continents?lang=es");
      expect(es.body.map((c: { name: string }) => c.name)).toEqual(["Europa", "Asia", "Okyanusya"]);
    });

    it("geçersiz lang 400 VALIDATION_FAILED", async () => {
      for (const lang of ["de", "", "EN", "tr,en"]) {
        const res = await get(`/v1/continents?lang=${lang}`);
        expect(res.status, lang).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
    });
  });

  describe("GET /v1/continents/:slug", () => {
    it("ayrıntı; büyük harfli slug küçültülür", async () => {
      const res = await get("/v1/continents/europe?lang=es");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ slug: "europe", name: "Europa", lang: "es", complete: true });
      expect((await get("/v1/continents/EUROPE")).body.slug).toBe("europe");
    });

    it("olmayan kıta 404, biçimi bozuk slug 400; hata önbelleğe alınmaz", async () => {
      const missing = await get("/v1/continents/atlantis");
      expect(missing.status).toBe(404);
      expect(missing.body).toEqual({ statusCode: 404, code: "NOT_FOUND", message: "Kıta bulunamadı." });
      expect(missing.headers["cache-control"]).toBeUndefined();
      const bad = await get("/v1/continents/avrupa%20kitasi");
      expect(bad.status).toBe(400);
      expect(bad.body.code).toBe("VALIDATION_FAILED");
    });
  });

  describe("GET /v1/countries", () => {
    it("sayfalı zarf; ada göre katlanmış sıra (Türkçe harfler: Irak < İran < İtalya < Türkiye)", async () => {
      const res = await get("/v1/countries");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
      expect(res.body).toMatchObject({ page: 1, pageSize: 20, total: 6 });
      expect(names(res)).toEqual(["Almanya", "Fransa", "Irak", "İran", "İtalya", "Türkiye"]);
    });

    it("öğe biçimi: mutlak bayrak/görsel adresi, hassas ya da büyük alan yok", async () => {
      const res = await get("/v1/countries?q=fransa");
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0]).toEqual({
        code: "FR",
        iso3: "FRA",
        continent: "europe",
        subregion: "Batı Avrupa",
        flag: "🇫🇷",
        flagUrl: "https://wangoh.com/flags/fr.svg",
        latitude: 46,
        longitude: 2,
        landlocked: false,
        capital: ["Paris"],
        hasTravel: true,
        imageUrl: "https://wangoh.com/og/fixture-france-1a2b3c4d.jpg",
        name: "Fransa",
        officialName: "Fransa Cumhuriyeti",
        lang: "tr",
        complete: true,
      });
      const text = JSON.stringify(res.body);
      expect(text).not.toMatch(/aliases|translations|completeLangs|hub|borders/);
    });

    it("sayfalama sınırları", async () => {
      const first = await get("/v1/countries?pageSize=4");
      expect(first.body).toMatchObject({ page: 1, pageSize: 4, total: 6 });
      expect(names(first)).toEqual(["Almanya", "Fransa", "Irak", "İran"]);
      const second = await get("/v1/countries?pageSize=4&page=2");
      expect(names(second)).toEqual(["İtalya", "Türkiye"]);
      const beyond = await get("/v1/countries?pageSize=4&page=9");
      expect(beyond.status).toBe(200);
      expect(beyond.body).toMatchObject({ items: [], total: 6, page: 9 });
      expect((await get("/v1/countries?pageSize=100")).status).toBe(200);
      for (const query of ["pageSize=101", "pageSize=0", "page=0", "page=-1", "page=abc", "pageSize=1.5", "page=100001"]) {
        const res = await get(`/v1/countries?${query}`);
        expect(res.status, query).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
    });

    it("continent filtresi; bilinmeyen kıta 400", async () => {
      expect(names(await get("/v1/countries?continent=europe"))).toEqual(["Almanya", "Fransa", "İtalya"]);
      expect(names(await get("/v1/countries?continent=asia"))).toEqual(["Irak", "İran", "Türkiye"]);
      const none = await get("/v1/countries?continent=oceania");
      expect(none.body).toMatchObject({ items: [], total: 0 });
      expect((await get("/v1/countries?continent=atlantis")).status).toBe(400);
    });

    it("hasTravel filtresi: true destinasyon sırasıyla, false ada göre; geçersiz değer 400", async () => {
      expect(names(await get("/v1/countries?hasTravel=true"))).toEqual(["Fransa", "Türkiye"]);
      expect(names(await get("/v1/countries?hasTravel=false"))).toEqual(["Almanya", "Irak", "İran", "İtalya"]);
      expect((await get("/v1/countries?hasTravel=1")).body.total).toBe(2);
      expect(names(await get("/v1/countries?hasTravel=true&continent=asia"))).toEqual(["Türkiye"]);
      const bad = await get("/v1/countries?hasTravel=belki");
      expect(bad.status).toBe(400);
      expect(bad.body.code).toBe("VALIDATION_FAILED");
    });

    it("lang=en: adlar İngilizce ve ona göre sıralı; çevirisi olmayan ülke Türkçeye düşer", async () => {
      const res = await get("/v1/countries?lang=en");
      expect(names(res)).toEqual(["Almanya", "France", "Iran", "Iraq", "Italy", "Türkiye"]);
      const byCode = Object.fromEntries(res.body.items.map((i: { code: string; lang: string; complete: boolean }) => [i.code, [i.lang, i.complete]]));
      expect(byCode).toMatchObject({ FR: ["en", true], DE: ["tr", false], IT: ["en", true] });
      const es = await get("/v1/countries?lang=es");
      const esBy = Object.fromEntries(es.body.items.map((i: { code: string; name: string; lang: string }) => [i.code, [i.name, i.lang]]));
      expect(esBy.FR).toEqual(["Francia", "es"]);
      expect(esBy.IT).toEqual(["İtalya", "tr"]); // es çevirisi yok → Türkçe
    });

    describe("arama (q)", () => {
      it("büyük/küçük harf ve aksan duyarsız; tr/en/es adı, resmî ad ve başkentte", async () => {
        expect(names(await get("/v1/countries?q=FRANSA"))).toEqual(["Fransa"]);
        expect(names(await get("/v1/countries?q=france"))).toEqual(["Fransa"]); // İngilizce ad
        expect(names(await get("/v1/countries?q=Francia"))).toEqual(["Fransa"]); // İspanyolca ad
        expect(names(await get("/v1/countries?q=french republic"))).toEqual(["Fransa"]); // resmî ad (en)
        expect(names(await get("/v1/countries?q=berlin"))).toEqual(["Almanya"]); // başkent
        expect(names(await get("/v1/countries?q=turkiye"))).toEqual(["Türkiye"]);
        expect(names(await get(`/v1/countries?q=${encodeURIComponent("TÜRKİYE")}`))).toEqual(["Türkiye"]);
        expect(names(await get("/v1/countries?q=cumhuriyeti&pageSize=2"))).toHaveLength(2);
      });

      it("Türkçe İ/ı: i, ı, İ, I birbirini bulur (ILIKE'ın kaçırdığı eşleşmeler)", async () => {
        const iran = ["İran"];
        for (const q of ["iran", "IRAN", "İRAN", "İran", "ıran", "Iran"]) {
          expect(names(await get(`/v1/countries?q=${encodeURIComponent(q)}`)), q).toEqual(iran);
        }
        for (const q of ["irak", "IRAK", "Irak", "ırak", "İRAK"]) {
          expect(names(await get(`/v1/countries?q=${encodeURIComponent(q)}`)), q).toEqual(["Irak"]);
        }
        for (const q of ["italya", "ITALYA", "ıtalya", "İTALYA"]) {
          expect(names(await get(`/v1/countries?q=${encodeURIComponent(q)}`)), q).toEqual(["İtalya"]);
        }
        // "ir" hem İran hem Irak (ve Irak/Iran'ın en adları) içinde geçer
        expect((await get("/v1/countries?q=IR")).body.total).toBeGreaterThanOrEqual(2);
      });

      it("LIKE jokerleri kaçırılır: %, _ ve \\ düz karakterdir", async () => {
        for (const q of ["%", "_", "\\", "%%", "a%a", "_ran", "Fr_nsa", "F%a"]) {
          const res = await get(`/v1/countries?q=${encodeURIComponent(q)}`);
          expect(res.status, q).toBe(200);
          expect(res.body.total, q).toBe(0);
        }
      });

      it("boş ya da yalnız boşluk terimi süzgeç sayılmaz; çok uzun terim 400", async () => {
        expect((await get("/v1/countries?q=")).body.total).toBe(6);
        expect((await get("/v1/countries?q=%20%20")).body.total).toBe(6);
        expect((await get(`/v1/countries?q=${"a".repeat(100)}`)).status).toBe(200);
        const long = await get(`/v1/countries?q=${"a".repeat(101)}`);
        expect(long.status).toBe(400);
        expect(long.body.code).toBe("VALIDATION_FAILED");
        expect((await get("/v1/countries?q=a%00b")).status).toBe(400);
      });

      it("süzgeçler birlikte çalışır", async () => {
        expect(names(await get("/v1/countries?q=a&continent=asia&hasTravel=false"))).toEqual(["Irak", "İran"]);
        expect((await get("/v1/countries?q=almanya&continent=asia")).body.total).toBe(0);
      });
    });
  });

  describe("GET /v1/countries/:code", () => {
    it("ayrıntı: ülke + seyahat (hub, rota şehir bağlantıları) + şehir özetleri", async () => {
      const res = await get("/v1/countries/FR");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
      expect(res.body).toMatchObject({
        code: "FR",
        name: "Fransa",
        borders: ["DEU", "ITA"],
        hasTravel: true,
        travel: {
          lang: "tr",
          complete: true,
          position: 0,
          imageUrl: "https://wangoh.com/og/fixture-france-1a2b3c4d.jpg",
          accent: "#d4795a",
          budget: "moderate",
          budgetLabel: "Orta",
          iata: "CDG",
          gateway: "Paris",
          flightTime: "3sa 30dk",
        },
      });
      expect(res.body.travel.hub.routeIdeas[0]).toEqual({
        title: "Rota",
        duration: "3 gün",
        cities: ["Paris", "Nice"],
        description: "Açıklama",
        cityLinks: [
          { slug: "paris", name: "Paris" },
          { slug: "nice", name: "Nice" },
        ],
      });
      expect(res.body.cities.map((c: { slug: string; hasGuide: boolean }) => [c.slug, c.hasGuide])).toEqual([
        ["paris", true],
        ["nice", false],
      ]);
      expect(JSON.stringify(res.body)).not.toMatch(/aliases|translations|completeLangs/);
    });

    it("kod küçük harfle de çalışır; seyahat bilgisi olmayan ülkede travel=null, cities=[]", async () => {
      expect((await get("/v1/countries/fr")).body.code).toBe("FR");
      const de = await get("/v1/countries/DE");
      expect(de.status).toBe(200);
      expect(de.body).toMatchObject({ code: "DE", hasTravel: false, travel: null, cities: [], imageUrl: null, borders: ["FRA"] });
    });

    it("lang=en: tam çevrilmiş seyahat metni (budgetLabel, flightTime, hub) o dilde", async () => {
      const res = await get("/v1/countries/FR?lang=en");
      expect(res.body).toMatchObject({ name: "France", subregion: "Western Europe", lang: "en", complete: true });
      expect(res.body.travel).toMatchObject({ lang: "en", complete: true, budgetLabel: "Moderate", flightTime: "3h 30m", description: "Test France description." });
      expect(res.body.travel.hub.seoTitle).toBe("France title");
      expect(res.body.cities[0]).toMatchObject({ slug: "paris", lang: "en", complete: true, description: "Test Paris description." });
      expect(res.body.cities[1]).toMatchObject({ slug: "nice", lang: "tr", complete: false });
    });

    it("dil geri düşüşü: es çevirisi yok → Türkçe + complete=false; kısmi çeviri 'tam' sayılmaz", async () => {
      const fr = await get("/v1/countries/FR?lang=es");
      expect(fr.body).toMatchObject({ name: "Francia", lang: "es", complete: true });
      expect(fr.body.travel).toMatchObject({ lang: "tr", complete: false, description: "Test Fransa açıklaması." }); // seyahatte es yok
      const tr = await get("/v1/countries/TR?lang=es");
      expect(tr.body).toMatchObject({ name: "Türkiye", lang: "tr", complete: false });
      // TR'de es "description" var ama completeLangs'ta değil: kısmi çeviri sunulmaz, Türkçe döner.
      expect(tr.body.travel).toMatchObject({ lang: "tr", complete: false, description: "Test Türkiye açıklaması." });
      const de = await get("/v1/countries/DE?lang=en");
      expect(de.body).toMatchObject({ name: "Almanya", lang: "tr", complete: false });
    });

    it("olmayan ülke 404; biçimi bozuk kod 400", async () => {
      const missing = await get("/v1/countries/XX");
      expect(missing.status).toBe(404);
      expect(missing.body).toEqual({ statusCode: 404, code: "NOT_FOUND", message: "Ülke bulunamadı." });
      for (const code of ["FRA", "F", "12", "F1", "%20%20"]) {
        const res = await get(`/v1/countries/${code}`);
        expect(res.status, code).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
    });
  });

  describe("GET /v1/countries/:code/cities", () => {
    it("şehir özetleri position sırasıyla, sayfalı; rehber gövdesi yok", async () => {
      const res = await get("/v1/countries/FR/cities");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
      expect(res.body).toMatchObject({ page: 1, pageSize: 20, total: 2 });
      expect(res.body.items[0]).toEqual({
        slug: "paris",
        countryCode: "FR",
        position: 0,
        name: "Paris",
        description: "Test Paris açıklaması.",
        imageUrl: "https://wangoh.com/og/fixture-paris-11223344.jpg",
        hasGuide: true,
        lang: "tr",
        complete: true,
      });
      // Harici https görsel olduğu gibi döner; görseli olmayan şehirde null.
      expect(res.body.items[1].imageUrl).toBe("https://example.com/nice.jpg");
      expect((await get("/v1/countries/TR/cities")).body.items[1].imageUrl).toBeNull();
      expect(JSON.stringify(res.body)).not.toMatch(/sections|faqs|guide"/);
    });

    it("sayfalama, arama (ad ve slug; İ/ı duyarlı), lang", async () => {
      const page = await get("/v1/countries/FR/cities?pageSize=1&page=2");
      expect(page.body).toMatchObject({ page: 2, pageSize: 1, total: 2 });
      expect(page.body.items.map((i: { slug: string }) => i.slug)).toEqual(["nice"]);
      expect((await get("/v1/countries/FR/cities?pageSize=1&page=5")).body.items).toEqual([]);
      expect((await get("/v1/countries/FR/cities?pageSize=101")).status).toBe(400);

      const byName = async (q: string, code = "TR") => (await get(`/v1/countries/${code}/cities?q=${encodeURIComponent(q)}`)).body.items.map((i: { slug: string }) => i.slug);
      expect(await byName("istanbul")).toEqual(["istanbul"]);
      expect(await byName("ISTANBUL")).toEqual(["istanbul"]);
      expect(await byName("İSTANBUL")).toEqual(["istanbul"]);
      expect(await byName("ızmir")).toEqual(["izmir"]);
      expect(await byName("IZMIR")).toEqual(["izmir"]);
      expect(await byName("Istanbul")).toEqual(["istanbul"]); // en adı
      expect(await byName("pa", "FR")).toEqual(["paris"]);
      expect(await byName("%")).toEqual([]);
      expect(await byName("_")).toEqual([]);

      const en = await get("/v1/countries/TR/cities?lang=en");
      expect(en.body.items.map((i: { name: string; lang: string }) => [i.name, i.lang])).toEqual([
        ["Istanbul", "en"],
        ["İzmir", "tr"],
      ]);
    });

    it("olmayan ülke 404, biçimi bozuk kod 400", async () => {
      expect((await get("/v1/countries/XX/cities")).status).toBe(404);
      expect((await get("/v1/countries/FRA/cities")).status).toBe(400);
    });
  });

  describe("GET /v1/countries/:code/cities/:slug", () => {
    it("şehir + rehber (Türkçe); ilgili rehberlere slug eklenir", async () => {
      const res = await get("/v1/countries/FR/cities/paris");
      expect(res.status).toBe(200);
      expect(res.headers["cache-control"]).toBe("public, max-age=300");
      expect(res.body).toMatchObject({
        slug: "paris",
        countryCode: "FR",
        name: "Paris",
        hasGuide: true,
        lang: "tr",
        complete: true,
        country: { code: "FR", name: "Fransa", flag: "🇫🇷", flagUrl: "https://wangoh.com/flags/fr.svg" },
      });
      const guide = res.body.guide;
      expect(guide).toMatchObject({ lang: "tr", complete: true, reviewed: true, h1: "Paris Rehberi", reviewedAt: "2026-01-31", placesKind: "sights", countryInfoOnHub: true });
      expect(guide.sections).toHaveLength(2);
      expect(guide.sections[0].subsections).toHaveLength(1);
      expect(guide.relatedGuides).toEqual([{ city: "Nice", anchor: "Nice'e geçin", description: "Test ilgili rehber.", slug: "nice" }]);
      expect(guide.sources).toEqual([{ name: "Test kaynak", url: "https://example.com/kaynak" }]);
      expect(guide.dietary.vegan[0]).toMatchObject({ name: "Test Restoranı", category: "vegan", verification: { status: "vegan-options" } });
      expect(guide.dietary.halal).toEqual([]);
    });

    it("lang=en: şehir ve rehber İngilizce ve tam", async () => {
      const res = await get("/v1/countries/FR/cities/paris?lang=en");
      expect(res.body).toMatchObject({ name: "Paris", lang: "en", complete: true, country: { name: "France" } });
      expect(res.body.guide).toMatchObject({ lang: "en", complete: true, h1: "Paris Guide", seoTitle: "Paris Travel Guide" });
      expect(res.body.guide.relatedGuides[0]).toMatchObject({ city: "Nice", anchor: "Go to Nice", slug: "nice" });
    });

    it("rehber ve şehir kartının dili ayrı ayrı geri düşer", async () => {
      // İstanbul: kart en tam, rehber yalnız Türkçe.
      const istanbul = await get("/v1/countries/TR/cities/istanbul?lang=en");
      expect(istanbul.body).toMatchObject({ name: "Istanbul", lang: "en", complete: true });
      expect(istanbul.body.guide).toMatchObject({ lang: "tr", complete: false, reviewed: false, h1: "İstanbul Rehberi" });
      expect(istanbul.body.guide).not.toHaveProperty("dietary");
      // Paris es: ne kart ne rehber es çevirisine sahip.
      const parisEs = await get("/v1/countries/FR/cities/paris?lang=es");
      expect(parisEs.body).toMatchObject({ lang: "tr", complete: false, country: { name: "Francia" } });
      expect(parisEs.body.guide).toMatchObject({ lang: "tr", complete: false });
    });

    it("rehberi olmayan şehirde guide=null, hasGuide=false", async () => {
      const nice = await get("/v1/countries/FR/cities/nice");
      expect(nice.status).toBe(200);
      expect(nice.body).toMatchObject({ slug: "nice", hasGuide: false, guide: null, imageUrl: "https://example.com/nice.jpg" });
    });

    it("slug büyük harfle de çalışır; Türkçe harfli adres 400; olmayan şehir/ülke 404", async () => {
      expect((await get("/v1/countries/fr/cities/PARIS")).body.slug).toBe("paris");
      const bad = await get(`/v1/countries/FR/cities/${encodeURIComponent("İstanbul")}`);
      expect(bad.status).toBe(400);
      const missing = await get("/v1/countries/FR/cities/lyon");
      expect(missing.status).toBe(404);
      expect(missing.body).toEqual({ statusCode: 404, code: "NOT_FOUND", message: "Şehir bulunamadı." });
      expect(missing.headers["cache-control"]).toBeUndefined();
      expect((await get("/v1/countries/XX/cities/paris")).body.message).toBe("Ülke bulunamadı.");
      // Şehir başka ülkeye aittir
      expect((await get("/v1/countries/TR/cities/paris")).status).toBe(404);
      expect((await get(`/v1/countries/FR/cities/${"a".repeat(81)}`)).status).toBe(400);
    });
  });

  describe("herkese açık okuma", () => {
    it("kimliksiz çalışır; bozuk belirteç yok sayılır (@Public)", async () => {
      expect((await get("/v1/countries/FR")).status).toBe(200);
      expect((await get("/v1/countries/FR").set("Authorization", "Bearer bozuk")).status).toBe(200);
    });

    it("yalnız GET: başka yöntemler yönetici ister", async () => {
      expect((await t.http.patch("/v1/countries/FR").send({})).status).toBe(401);
      expect((await t.http.post("/v1/countries/FR/cities").send({})).status).toBe(401);
      expect((await t.http.delete("/v1/countries/FR/cities/paris")).status).toBe(401);
    });
  });
});
