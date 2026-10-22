import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { cities, cityGuides, countries, countryTravel } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";
import { loadFixtureSeed } from "./helpers/content-fixture.js";

type Json = Record<string, any>;

/** Yönetici yazma uçları: yetki, birleştirerek güncelleme, doğrulama reddi, şehir ekle/sil. */
describe("içerik yazma uçları (yönetici)", () => {
  let t: TestApp;
  let admin: TestSession;
  let user: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
    user = await registerUser(t.http);
  });
  afterAll(() => t.close());
  // Her test taze tohumla başlar: şehirler (rehberleriyle) silinir, tohum yeniden yüklenir, ülke düzenlemeleri tohuma döner.
  beforeEach(async () => {
    await t.db.delete(cities);
    await loadFixtureSeed(t, true);
  });

  const auth = () => bearer(admin.accessToken);
  const patchCountry = (code: string, body: unknown, query = "") => t.http.patch(`/v1/countries/${code}${query}`).set(auth()).send(body as object);
  const patchCity = (code: string, slug: string, body: unknown, query = "") => t.http.patch(`/v1/countries/${code}/cities/${slug}${query}`).set(auth()).send(body as object);
  const postCity = (code: string, body: unknown, query = "") => t.http.post(`/v1/countries/${code}/cities${query}`).set(auth()).send(body as object);
  const deleteCity = (code: string, slug: string) => t.http.delete(`/v1/countries/${code}/cities/${slug}`).set(auth());
  const getCity = (code: string, slug: string, lang = "tr") => t.http.get(`/v1/countries/${code}/cities/${slug}?lang=${lang}`);
  const getCountry = (code: string, lang = "tr") => t.http.get(`/v1/countries/${code}?lang=${lang}`);
  const fieldsOf = (res: { body: Json }): string[] => (res.body.details as Array<{ field: string }>).map((d) => d.field);

  const dbCity = async (slug: string, code = "FR") => (await t.db.select().from(cities).where(and(eq(cities.countryCode, code), eq(cities.slug, slug))))[0];
  const dbGuide = async (cityId: string) => (await t.db.select().from(cityGuides).where(eq(cityGuides.cityId, cityId)))[0];

  /** Geçerli, eksiksiz bir Türkçe rehber gövdesi (fixture'dan). */
  const fullGuide = async () => {
    const guide = (await getCity("FR", "paris")).body.guide as Json;
    const { lang: _lang, complete: _complete, reviewed: _reviewed, ...body } = guide;
    return body;
  };

  describe("yetki", () => {
    const calls: Array<[string, string, (a: ReturnType<typeof bearer> | undefined) => any, number]> = [
      ["PATCH /countries/:code", "patch", (a) => withAuth(t.http.patch("/v1/countries/FR").send({}), a), 200],
      ["POST /countries/:code/cities", "post", (a) => withAuth(t.http.post("/v1/countries/FR/cities").send({ translations: { tr: { name: "Auth Test", description: "Açıklama" } } }), a), 201],
      ["PATCH /countries/:code/cities/:slug", "patch", (a) => withAuth(t.http.patch("/v1/countries/FR/cities/nice").send({ position: 5 }), a), 200],
      ["DELETE /countries/:code/cities/:slug", "delete", (a) => withAuth(t.http.delete("/v1/countries/FR/cities/nice"), a), 204],
    ];
    const withAuth = <R extends { set(h: Record<string, string>): R }>(req: R, a: ReturnType<typeof bearer> | undefined): R => (a ? req.set(a) : req);

    it("anonim 401, kullanıcı 403 (veri değişmez), yönetici başarılı", async () => {
      const snapshot = async () =>
        JSON.stringify([await t.db.select().from(cities).orderBy(cities.countryCode, cities.slug), await t.db.select().from(countries).orderBy(countries.code), await t.db.select().from(countryTravel)]);
      for (const [label, , call, ok] of calls) {
        await t.db.delete(cities);
        await loadFixtureSeed(t, true);
        const before = await snapshot();
        const anon = await call(undefined);
        expect(anon.status, `${label} anonim`).toBe(401);
        expect(anon.body.code).toBe("AUTH_REQUIRED");
        const forbidden = await call(bearer(user.accessToken));
        expect(forbidden.status, `${label} kullanıcı`).toBe(403);
        expect(forbidden.body.code).toBe("FORBIDDEN");
        expect(await snapshot(), `${label}: reddedilen istek veriyi değiştirdi`).toBe(before);
        const done = await call(auth());
        expect(done.status, `${label} yönetici`).toBe(ok);
      }
    });
  });

  describe("bozuk gövdeler", () => {
    const weird: unknown[] = [
      null, 0, 1, true, "metin", [], [null], [1, 2], {}, { translations: null }, { translations: [] }, { translations: "x" }, { translations: { tr: null } },
      { translations: { tr: "x" } }, { translations: { tr: [] } }, { translations: { en: [] } }, { translations: { en: 5 } }, { translations: { tr: { name: ["a"] } } },
      { translations: { tr: { name: { a: 1 } } } }, { translations: { tr: { name: 1 } } }, { translations: { tr: {} } }, { travel: null }, { travel: [] }, { travel: "x" },
      { travel: { translations: null } }, { travel: { translations: { tr: { hub: null } } } }, { travel: { translations: { tr: { hub: [] } } } }, { travel: { translations: { tr: { hub: "x" } } } },
      { travel: { translations: { tr: { hub: { routeIdeas: [null] } } } } }, { travel: { translations: { tr: { hub: { routeIdeas: "x" } } } } }, { travel: { completeLangs: null } },
      { travel: { completeLangs: "en" } }, { travel: { completeLangs: [null] } }, { travel: { completeLangs: [["en"]] } }, { guide: null }, { guide: [] }, { guide: { translations: null } },
      { guide: { translations: { tr: null } } }, { guide: { translations: { tr: { sections: [null] } } } }, { guide: { translations: { tr: { sections: {} } } } },
      { guide: { translations: { tr: { sections: [{ heading: "x", id: "x", body: [null] }] } } } }, { guide: { translations: { tr: { dietary: null } } } },
      { guide: { translations: { tr: { dietary: { vegan: [null], halal: [] } } } } }, { guide: { completeLangs: [1] } }, { guide: { reviewed: "evet" } },
      { position: null }, { position: 1.5 }, { position: "5" }, { position: {} }, { image: 5 }, { image: {} }, { image: [] }, { completeLangs: {} },
      { translations: { tr: { name: "x", description: "y" }, en: [] } }, { translations: { tr: { name: "x", description: "y" }, en: null } }, { translations: { tr: { name: "x", description: null } } },
      { __proto__: { polluted: true } }, JSON.parse('{"__proto__": {"polluted": true}, "translations": {"tr": {"name": "a", "description": "b"}}}'),
      JSON.parse('{"translations": {"__proto__": {"name": "x"}, "tr": {"name": "a", "description": "b"}}}'), JSON.parse('{"constructor": {"prototype": {"x": 1}}}'),
    ];

    /** Geçerli bir gövdenin içine yerleştirilmiş iç içe diziler: yalnız şekil bozukluğu yüzünden reddedilmeli. */
    const nestedArrays = async (): Promise<unknown[]> => {
      const hub = ((await getCountry("FR")).body.travel as Json).hub;
      const guide = await fullGuide();
      return [
        { travel: { translations: { tr: { hub: { ...hub, routeIdeas: [[]] } } } } },
        { travel: { translations: { tr: { hub: { ...hub, routeIdeas: [[hub.routeIdeas[0]]] } } } } },
        { travel: { translations: { tr: { hub: { ...hub, essentials: [[]] } } } } },
        { guide: { translations: { tr: { sections: [[]] } } } },
        { guide: { translations: { tr: { sections: [guide.sections] } } } },
        { guide: { translations: { tr: { faqs: [[]] } } } },
        { guide: { translations: { tr: { relatedGuides: [[]] } } } },
        { guide: { translations: { tr: { relatedGuides: [guide.relatedGuides] } } } },
        { guide: { translations: { tr: { dietary: { ...guide.dietary, vegan: [[]] } } } } },
      ];
    };

    it("hiçbir uçta 500 üretmez ve sonraki okumalar bozulmaz: PATCH ülke, PATCH şehir, POST şehir", async () => {
      const bodies = [...weird, ...(await nestedArrays())];
      for (const body of bodies) {
        const raw = JSON.stringify(body);
        for (const [label, res] of [
          ["PATCH country", await t.http.patch("/v1/countries/FR").set(auth()).set("Content-Type", "application/json").send(raw)],
          ["PATCH city", await t.http.patch("/v1/countries/FR/cities/paris").set(auth()).set("Content-Type", "application/json").send(raw)],
          ["POST city", await t.http.post("/v1/countries/FR/cities").set(auth()).set("Content-Type", "application/json").send(raw)],
        ] as const) {
          expect(res.status, `${label} ${raw}: ${JSON.stringify(res.body)}`).toBeLessThan(500);
          if (res.status >= 400) expect(res.body.code, `${label} ${raw}`).toBeTypeOf("string");
        }
        // Kabul edilen bir gövde sonraki okumayı bozmuş olabilir (kalıcı 500 / şemaya aykırı veri): her istekten sonra oku.
        for (const lang of ["tr", "en", "es"]) {
          expect((await getCountry("FR", lang)).status, `${raw} → GET ülke ${lang}`).toBe(200);
          const city = await getCity("FR", "paris", lang);
          expect(city.status, `${raw} → GET şehir ${lang}`).toBe(200);
          for (const field of ["quickFacts", "sections", "places", "itinerary", "faqs"]) {
            for (const item of city.body.guide[field] as unknown[]) expect(Array.isArray(item), `${raw} → ${field} öğesi dizi`).toBe(false);
          }
        }
      }
      expect(({} as Json).polluted).toBeUndefined();
    });
  });

  describe("PATCH /v1/countries/:code", () => {
    it("çevirileri dil başına BİRLEŞTİRİR: gönderilmeyen alan ve diller korunur", async () => {
      const res = await patchCountry("FR", { translations: { en: { officialName: "Republic of France" } } }, "?lang=en");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "France", officialName: "Republic of France", subregion: "Western Europe", lang: "en", complete: true });
      const tr = (await getCountry("FR")).body;
      expect(tr).toMatchObject({ name: "Fransa", officialName: "Fransa Cumhuriyeti", subregion: "Batı Avrupa" });
      expect((await getCountry("FR", "es")).body).toMatchObject({ name: "Francia", officialName: "República Francesa" });
    });

    it("yeni bir dil ekler ve dili siler (null)", async () => {
      expect((await getCountry("DE", "es")).body).toMatchObject({ name: "Almanya", lang: "tr", complete: false });
      const added = await patchCountry("DE", { translations: { es: { name: "Alemania" } } }, "?lang=es");
      expect(added.body).toMatchObject({ name: "Alemania", lang: "es", complete: true });
      const removed = await patchCountry("FR", { translations: { en: null } }, "?lang=en");
      expect(removed.status).toBe(200);
      expect(removed.body).toMatchObject({ name: "Fransa", lang: "tr", complete: false });
      expect((await t.db.select().from(countries).where(eq(countries.code, "FR")))[0]!.translations).not.toHaveProperty("en");
    });

    it("Türkçe silinemez; yeni dil adsız olamaz", async () => {
      const noTr = await patchCountry("FR", { translations: { tr: null } });
      expect(noTr.status).toBe(400);
      expect(noTr.body.code).toBe("VALIDATION_FAILED");
      const noName = await patchCountry("DE", { translations: { es: { officialName: "República Federal de Alemania" } } });
      expect(noName.status).toBe(400);
      expect(fieldsOf(noName)).toContain("translations.es");
      expect((await getCountry("DE", "es")).body.lang).toBe("tr");
    });

    it("bilinmeyen alan her düzeyde reddedilir (400, alan yolu ile)", async () => {
      for (const body of [
        { foo: 1 },
        { translations: { en: { foo: "x" } } },
        { translations: { de: { name: "x" } } },
        { travel: { foo: 1 } },
        { travel: { translations: { en: { foo: "x" } } } },
        { translations: { en: { name: "Fr", aliases: ["x"] } } },
        { hasTravel: false },
      ]) {
        const res = await patchCountry("FR", body);
        expect(res.status, JSON.stringify(body)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
        expect(res.body.details.some((d: { code: string }) => d.code === "whitelistValidation"), JSON.stringify(res.body.details)).toBe(true);
      }
    });

    it("uzunluk sınırı, boş metin ve NUL karakteri reddedilir", async () => {
      for (const name of ["x".repeat(121), "", "   ", "Fra\u0000nce", 42, null]) {
        const res = await patchCountry("FR", { translations: { en: { name } } });
        expect(res.status, JSON.stringify(name)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
      expect((await patchCountry("FR", { translations: { en: { name: "x".repeat(120) } } })).status).toBe(200);
    });

    it("boş gövde değişiklik yapmaz", async () => {
      const before = (await getCountry("FR")).body;
      const res = await patchCountry("FR", {});
      expect(res.status).toBe(200);
      expect(res.body).toEqual(before);
    });

    it("olmayan ülke 404, biçimi bozuk kod 400", async () => {
      const missing = await patchCountry("XX", {});
      expect(missing.status).toBe(404);
      expect(missing.body.message).toBe("Ülke bulunamadı.");
      expect((await patchCountry("FRA", {})).status).toBe(400);
    });

    describe("seyahat bilgisi", () => {
      it("skaler alanlar: görsel, vurgu rengi, bütçe, IATA", async () => {
        const res = await patchCountry("FR", { travel: { image: "/images/yeni-gorsel-aabbccdd.avif", accent: "#112233", budget: "high", iata: "ORY" } });
        expect(res.status).toBe(200);
        expect(res.body.travel).toMatchObject({ imageUrl: "https://wangoh.com/og/yeni-gorsel-aabbccdd.jpg", accent: "#112233", budget: "high", iata: "ORY", description: "Test Fransa açıklaması." });
        expect(res.body.imageUrl).toBe("https://wangoh.com/og/yeni-gorsel-aabbccdd.jpg");
        const https = await patchCountry("FR", { travel: { image: "https://example.com/gorsel.jpg" } });
        expect(https.body.travel.imageUrl).toBe("https://example.com/gorsel.jpg");
      });

      it("geçersiz değerler reddedilir: görsel adresi yalnız AVIF yolu/https, renk, IATA, bütçe", async () => {
        for (const travel of [
          { image: "http://example.com/a.jpg" },
          { image: "javascript:alert(1)" },
          { image: "data:image/png;base64,AAAA" },
          { image: "/images/a.png" },
          { image: "//example.com/a.jpg" },
          { image: "https://user:pw@example.com/a.jpg" },
          { image: null },
          { accent: "red" },
          { accent: "#12345" },
          { iata: "cdg" },
          { iata: "CDGX" },
          { budget: "cheap" },
        ]) {
          const res = await patchCountry("FR", { travel });
          expect(res.status, JSON.stringify(travel)).toBe(400);
          expect(res.body.code).toBe("VALIDATION_FAILED");
        }
        expect((await getCountry("FR")).body.travel).toMatchObject({ accent: "#d4795a", iata: "CDG", budget: "moderate" });
      });

      it("seyahat metinleri dil başına birleşir; tam dil tam kalır", async () => {
        const res = await patchCountry("FR", { travel: { translations: { en: { description: "New France description." } } } }, "?lang=en");
        expect(res.status).toBe(200);
        expect(res.body.travel).toMatchObject({ lang: "en", complete: true, description: "New France description.", signature: "Test France sentence.", flightTime: "3h 30m" });
        expect(res.body.travel.hub.seoTitle).toBe("France title");
        expect((await getCountry("FR")).body.travel.description).toBe("Test Fransa açıklaması.");
      });

      it("yeni dil tamamlanabilir: eksik alan varken completeLangs reddedilir", async () => {
        const partial = await patchCountry("FR", {
          travel: { translations: { es: { description: "Descripción de prueba." } }, completeLangs: ["en", "es"] },
        });
        expect(partial.status).toBe(400);
        expect(partial.body.details[0]).toMatchObject({ field: "travel.translations.es", code: "incompleteTranslation" });
        expect(partial.body.details[0].message).toContain("signature");
        expect((await getCountry("FR", "es")).body.travel).toMatchObject({ lang: "tr", complete: false });

        const hub = ((await getCountry("FR")).body.travel as Json).hub;
        const full = await patchCountry(
          "FR",
          {
            travel: {
              translations: {
                es: { description: "Descripción.", signature: "Frase.", gateway: "París", capital: "París", bestSeason: "abril–junio", flightTime: "3 h 30 min", budget: "Medio", hub },
              },
              completeLangs: ["en", "es"],
            },
          },
          "?lang=es",
        );
        expect(full.status, JSON.stringify(full.body)).toBe(200);
        expect(full.body.travel).toMatchObject({ lang: "es", complete: true, description: "Descripción.", budgetLabel: "Medio" });
        // Türkçede hub olduğundan tam sayılan dilde hub'sız çeviri kabul edilmez.
        const noHub = await patchCountry("TR", {
          travel: { translations: { es: { description: "d", signature: "s", gateway: "g", capital: "c", bestSeason: "b", flightTime: "f", budget: "m" } }, completeLangs: ["es"] },
        });
        expect(noHub.status).toBe(400);
        expect(noHub.body.details[0].message).toContain("hub");
      });

      it("çevirisi olmayan dil tam işaretlenemez; çevirisi silinen dil listeden düşer", async () => {
        const res = await patchCountry("FR", { travel: { completeLangs: ["es"] } });
        expect(res.status).toBe(400);
        expect(fieldsOf(res)).toEqual(["travel.completeLangs"]);
        const removed = await patchCountry("FR", { travel: { translations: { en: null } } }, "?lang=en");
        expect(removed.body.travel).toMatchObject({ lang: "tr", complete: false });
        expect((await t.db.select().from(countryTravel).where(eq(countryTravel.countryCode, "FR")))[0]!.completeLangs).toEqual([]);
        expect((await patchCountry("FR", { travel: { completeLangs: ["fr"] } })).status).toBe(400);
        // Tekrar reddi (çevirisi VAR olan dil iki kez) `content-integrity` testinde ayrıca sınanır: burada en çevirisi silinmişti.
      });

      it("hub: ayrıntıdan alınan hub olduğu gibi geri yazılabilir (cityLinks yok sayılıp atılır)", async () => {
        const hub = ((await getCountry("FR")).body.travel as Json).hub;
        expect(hub.routeIdeas[0].cityLinks).toHaveLength(2);
        const res = await patchCountry("FR", { travel: { translations: { tr: { hub: { ...hub, planningHeading: "Yeni planlama başlığı" } } } } });
        expect(res.status, JSON.stringify(res.body)).toBe(200);
        expect(res.body.travel.hub.planningHeading).toBe("Yeni planlama başlığı");
        expect(res.body.travel.hub.routeIdeas[0].cityLinks).toHaveLength(2); // yanıtta yeniden türetilir
        const stored = (await t.db.select().from(countryTravel).where(eq(countryTravel.countryCode, "FR")))[0]!.translations as Json;
        expect(stored.tr.hub.routeIdeas[0]).not.toHaveProperty("cityLinks");
        expect(stored.tr.hub.routeIdeas[0].cities).toEqual(["Paris", "Nice"]);
      });

      it("hub doğrulaması: zorunlu alan, uzunluk ve bilinmeyen alan", async () => {
        const hub = ((await getCountry("FR")).body.travel as Json).hub;
        const { intro: _intro, ...noIntro } = hub;
        for (const bad of [noIntro, { ...hub, seoTitle: "x".repeat(201) }, { ...hub, foo: 1 }, { ...hub, routeIdeas: [{ ...hub.routeIdeas[0], cities: Array(13).fill("Paris") }] }, { ...hub, intro: [] }]) {
          const res = await patchCountry("FR", { travel: { translations: { tr: { hub: bad } } } });
          expect(res.status, JSON.stringify(res.body.details)).toBe(400);
        }
      });

      it("seyahat bilgisi olmayan ülkede 404 ve aynı istekteki ad değişikliği geri alınır", async () => {
        const res = await patchCountry("DE", { translations: { en: { name: "Germany" } }, travel: { accent: "#112233" } });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Bu ülke için seyahat bilgisi tanımlı değil.");
        expect((await getCountry("DE", "en")).body).toMatchObject({ name: "Almanya", lang: "tr", complete: false });
      });
    });
  });

  describe("POST /v1/countries/:code/cities", () => {
    const body = (extra: Json = {}) => ({ translations: { tr: { name: "Yeni Şehir", description: "Yeni şehir açıklaması." } }, ...extra });

    it("201: slug Türkçe addan web kuralıyla türetilir, sıra sona eklenir, rehber yok", async () => {
      const res = await postCity("FR", body());
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        slug: "yeni-sehir",
        countryCode: "FR",
        position: 2,
        name: "Yeni Şehir",
        description: "Yeni şehir açıklaması.",
        imageUrl: null,
        hasGuide: false,
        guide: null,
        lang: "tr",
        complete: true,
        country: { code: "FR", name: "Fransa" },
      });
      expect((await getCity("FR", "yeni-sehir")).status).toBe(200);
      const list = await t.http.get("/v1/countries/FR/cities");
      expect(list.body.items.map((i: { slug: string }) => i.slug)).toEqual(["paris", "nice", "yeni-sehir"]);
      expect((await getCountry("FR")).body.cities.map((c: { slug: string }) => c.slug)).toContain("yeni-sehir");
    });

    it("açık slug, sıra, görsel ve yabancı dil: gönderilen dil tam sayılır; lang yanıtı belirler", async () => {
      const res = await postCity(
        "TR",
        body({ slug: "ankara-test", position: 7, image: "https://example.com/ankara.jpg", translations: { tr: { name: "Ankara", description: "Başkent." }, en: { name: "Ankara", description: "The capital." } } }),
        "?lang=en",
      );
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ slug: "ankara-test", position: 7, imageUrl: "https://example.com/ankara.jpg", name: "Ankara", description: "The capital.", lang: "en", complete: true });
      const row = await dbCity("ankara-test", "TR");
      expect(row!.completeLangs).toEqual(["en"]);
      // completeLangs ile daraltılabilir.
      const partial = await postCity("TR", body({ slug: "bursa-test", translations: { tr: { name: "Bursa", description: "Yeşil." }, en: { name: "Bursa", description: "Green." } }, completeLangs: [] }), "?lang=en");
      expect(partial.body).toMatchObject({ lang: "tr", complete: false });
    });

    it("aynı ülkede aynı slug 409 SLUG_TAKEN; başka ülkede serbest; eşzamanlı ikiz istek tek kazanan", async () => {
      expect((await postCity("FR", body({ slug: "tekrar" }))).status).toBe(201);
      const dup = await postCity("FR", body({ slug: "tekrar" }));
      expect(dup.status).toBe(409);
      expect(dup.body).toMatchObject({ statusCode: 409, code: "SLUG_TAKEN" });
      expect((await postCity("TR", body({ slug: "tekrar" }))).status).toBe(201);
      // Mevcut tohum şehrinin adresi de çakışır.
      expect((await postCity("FR", body({ slug: "paris" }))).status).toBe(409);
      const twin = body({ slug: "yaris", translations: { tr: { name: "Yarış", description: "Aynı adreste ikiz istek." } } });
      const [a, b] = await Promise.all([postCity("FR", twin), postCity("FR", twin)]);
      expect([a.status, b.status].sort()).toEqual([201, 409]);
      const rows = await t.db.select().from(cities).where(and(eq(cities.countryCode, "FR"), eq(cities.slug, "yaris")));
      expect(rows).toHaveLength(1);
    });

    it("rehberle birlikte eklenir (Türkçe gövde zorunlu alanları dolu olmalı)", async () => {
      const guide = await fullGuide();
      const named = (name: string) => ({ translations: { tr: { name, description: "Açıklama." } } });
      const ok = await postCity("FR", body({ slug: "rehberli", ...named("Rehberli"), guide: { translations: { tr: guide } } }));
      expect(ok.status, JSON.stringify(ok.body)).toBe(201);
      expect(ok.body).toMatchObject({ hasGuide: true });
      expect(ok.body.guide).toMatchObject({ lang: "tr", complete: true, reviewed: false, h1: "Paris Rehberi" });
      const row = await dbCity("rehberli");
      expect(await dbGuide(row!.id)).toBeDefined();

      const { seoTitle: _seoTitle, ...incomplete } = guide;
      const bad = await postCity("FR", body({ slug: "eksik-rehber", ...named("Eksik Rehber"), guide: { translations: { tr: incomplete } } }));
      expect(bad.status).toBe(400);
      expect(bad.body.details[0]).toMatchObject({ field: "guide.translations.tr", code: "incompleteTranslation" });
      expect(await dbCity("eksik-rehber")).toBeUndefined(); // işlem geri alındı
      const noTr = await postCity("FR", body({ slug: "tr-yok", ...named("Tr Yok"), guide: { reviewed: true } }));
      expect(noTr.status).toBe(400);
      expect(await dbCity("tr-yok")).toBeUndefined();
    });

    it("olmayan ülke 404, biçimi bozuk kod 400", async () => {
      const res = await postCity("XX", body());
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ülke bulunamadı.");
      expect((await postCity("FRA", body())).status).toBe(400);
    });

    it("doğrulama reddi: eksik/bozuk gövde, bilinmeyen alan, uzunluk, slug biçimi, görsel", async () => {
      const cases: Array<[string, unknown]> = [
        ["gövde yok", {}],
        ["tr yok", { translations: {} }],
        ["ad yok", { translations: { tr: { description: "x" } } }],
        ["açıklama yok", { translations: { tr: { name: "x" } } }],
        ["ad boş", { translations: { tr: { name: "  ", description: "x" } } }],
        ["ad uzun", { translations: { tr: { name: "x".repeat(121), description: "x" } } }],
        ["açıklama uzun", { translations: { tr: { name: "x", description: "x".repeat(801) } } }],
        ["NUL", { translations: { tr: { name: "x\u0000", description: "x" } } }],
        ["bilinmeyen alan", { ...body(), foo: 1 }],
        ["bilinmeyen çeviri alanı", { translations: { tr: { name: "x", description: "x", foo: 1 } } }],
        ["en eksik alan", { translations: { tr: { name: "x", description: "x" }, en: { name: "x" } } }],
        ["slug büyük harf", body({ slug: "Büyük" })],
        ["slug çift tire", body({ slug: "a--b" })],
        ["slug tire ile başlar", body({ slug: "-ab" })],
        ["slug uzun", body({ slug: "a".repeat(81) })],
        ["slug türetilemez", { translations: { tr: { name: "!!!", description: "x" } } }],
        ["görsel http", body({ image: "http://example.com/a.jpg" })],
        ["görsel javascript", body({ image: "javascript:alert(1)" })],
        ["sıra eksi", body({ position: -1 })],
        ["sıra metin", body({ position: "1" })],
        ["completeLangs yanlış dil", body({ completeLangs: ["de"] })],
        ["completeLangs çevirisiz dil", body({ completeLangs: ["es"] })],
      ];
      const total = async () => (await t.http.get("/v1/countries/FR/cities")).body.total;
      const baseline = await total();
      for (const [label, payload] of cases) {
        const res = await postCity("FR", payload);
        expect(res.status, `${label}: ${JSON.stringify(res.body)}`).toBe(400);
        expect(res.body.code, label).toBe("VALIDATION_FAILED");
      }
      expect(await total()).toBe(baseline); // hiçbiri şehir eklemedi
    });
  });

  describe("PATCH /v1/countries/:code/cities/:slug", () => {
    it("çevirileri birleştirir; ad korunur, açıklama değişir; konum ve görsel güncellenir/temizlenir", async () => {
      const res = await patchCity("FR", "paris", { translations: { tr: { description: "Yeni Paris açıklaması." } }, position: 5 });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Paris", description: "Yeni Paris açıklaması.", position: 5, hasGuide: true });
      const en = await getCity("FR", "paris", "en");
      expect(en.body).toMatchObject({ description: "Test Paris description.", lang: "en", complete: true });

      const cleared = await patchCity("FR", "paris", { image: null });
      expect(cleared.body.imageUrl).toBeNull();
      const set = await patchCity("FR", "paris", { image: "/images/paris-yeni-0a1b2c3d.avif" });
      expect(set.body.imageUrl).toBe("https://wangoh.com/og/paris-yeni-0a1b2c3d.jpg");
      for (const image of ["http://example.com/a.jpg", "/images/a.png", "javascript:alert(1)", ""]) {
        expect((await patchCity("FR", "paris", { image })).status, image).toBe(400);
      }
    });

    it("dil ekler/siler; tam sayılmak için ad+açıklama gerekir", async () => {
      const nameOnly = await patchCity("FR", "nice", { translations: { en: { name: "Nice" } } });
      expect(nameOnly.status).toBe(200); // kısmi taslak: tam değil
      expect((await getCity("FR", "nice", "en")).body).toMatchObject({ lang: "tr", complete: false });

      const completeTooSoon = await patchCity("FR", "nice", { completeLangs: ["en"] });
      expect(completeTooSoon.status).toBe(400);
      expect(completeTooSoon.body.details[0]).toMatchObject({ field: "translations.en", code: "incompleteTranslation" });

      const done = await patchCity("FR", "nice", { translations: { en: { description: "The Riviera." } }, completeLangs: ["en"] }, "?lang=en");
      expect(done.body).toMatchObject({ name: "Nice", description: "The Riviera.", lang: "en", complete: true });

      const removed = await patchCity("FR", "nice", { translations: { en: null } }, "?lang=en");
      expect(removed.body).toMatchObject({ lang: "tr", complete: false });
      expect((await dbCity("nice"))!.completeLangs).toEqual([]);
      expect((await patchCity("FR", "nice", { translations: { tr: null } })).status).toBe(400);
      expect((await patchCity("FR", "nice", { translations: { en: { name: "" } } })).status).toBe(400);
    });

    it("rehber alanları birleşir: yalnız gönderilen alan değişir, diğer diller dokunulmaz", async () => {
      const before = (await getCity("FR", "paris")).body.guide as Json;
      const res = await patchCity("FR", "paris", { guide: { translations: { tr: { h1: "Yeni Paris Başlığı" } } } });
      expect(res.status).toBe(200);
      expect(res.body.guide).toMatchObject({ h1: "Yeni Paris Başlığı", lede: before.lede, sections: before.sections });
      expect((await getCity("FR", "paris", "en")).body.guide.h1).toBe("Paris Guide");

      const sections = [{ heading: "Tek bölüm", id: "tek", body: ["Yalnız bu."] }];
      const replaced = await patchCity("FR", "paris", { guide: { translations: { tr: { sections } } } });
      expect(replaced.body.guide.sections).toEqual([{ heading: "Tek bölüm", id: "tek", body: ["Yalnız bu."] }]); // diziler tümüyle değişir
      expect(replaced.body.guide.h1).toBe("Yeni Paris Başlığı");
    });

    it("rehber verisi geri yazılabilir (yanıta özgü slug atılır) ve reviewed/completeLangs güncellenir", async () => {
      const body = await fullGuide();
      expect(body.relatedGuides[0].slug).toBe("nice");
      const res = await patchCity("FR", "paris", { guide: { translations: { tr: body }, reviewed: false } });
      expect(res.status, JSON.stringify(res.body)).toBe(200);
      expect(res.body.guide).toMatchObject({ reviewed: false, complete: true });
      expect(res.body.guide.relatedGuides[0].slug).toBe("nice"); // yanıtta yeniden türetilir
      const row = await dbCity("paris");
      const stored = (await dbGuide(row!.id))!;
      expect((stored.translations as Json).tr.relatedGuides[0]).toEqual({ city: "Nice", anchor: "Nice'e geçin", description: "Test ilgili rehber." });
      expect(stored.reviewed).toBe(false);
      expect(stored.completeLangs).toEqual(["en"]);

      const dropped = await patchCity("FR", "paris", { guide: { translations: { en: null } } }, "?lang=en");
      expect(dropped.body.guide).toMatchObject({ lang: "tr", complete: false });
      expect((await dbGuide(row!.id))!.completeLangs).toEqual([]);
      const bad = await patchCity("FR", "paris", { guide: { completeLangs: ["es"] } });
      expect(bad.status).toBe(400);
      expect(fieldsOf(bad)).toEqual(["guide.completeLangs"]);
    });

    it("rehberi olmayan şehre rehber eklenir; eksik Türkçe gövde ve gövdesiz istek reddedilir", async () => {
      const body = await fullGuide();
      const missing = await patchCity("FR", "nice", { guide: { translations: { tr: { h1: "Sadece başlık" } } } });
      expect(missing.status).toBe(400);
      expect(missing.body.details[0].message).toContain("seoTitle");
      expect((await patchCity("FR", "nice", { guide: { reviewed: true } })).status).toBe(400);
      expect((await getCity("FR", "nice")).body.guide).toBeNull();

      const ok = await patchCity("FR", "nice", { guide: { translations: { tr: body }, reviewed: true } });
      expect(ok.status).toBe(200);
      expect(ok.body).toMatchObject({ hasGuide: true });
      expect(ok.body.guide).toMatchObject({ reviewed: true, h1: "Paris Rehberi" });
    });

    it("rehber doğrulaması: https dışı adres, bilinmeyen alan, değer kümesi, uzunluk, yığın boyutu", async () => {
      const guide = await fullGuide();
      const bad: Array<[string, Json]> = [
        ["kaynak http", { sources: [{ name: "x", url: "http://example.com" }] }],
        ["kaynak javascript", { sources: [{ name: "x", url: "javascript:alert(1)" }] }],
        ["kaynak data", { sources: [{ name: "x", url: "data:text/html,<script>alert(1)</script>" }] }],
        ["kaynak kimlik bilgisi", { sources: [{ name: "x", url: "https://user:pw@example.com/" }] }],
        ["kaynak göreli", { sources: [{ name: "x", url: "/kaynak" }] }],
        ["kaynak adres yok", { sources: [{ name: "x" }] }],
        ["kaynak bilinmeyen alan", { sources: [{ name: "x", url: "https://example.com", foo: 1 }] }],
        ["fiyat değeri", { places: [{ ...guide.places[0], price: "Ucuz" }] }],
        ["mekân alanı eksik", { places: [{ name: "x" }] }],
        ["bölüm kimliği", { sections: [{ heading: "x", id: "Büyük Harf", body: ["x"] }] }],
        ["çok bölüm", { sections: Array.from({ length: 41 }, (_, i) => ({ heading: "x", id: `b${i}`, body: ["x"] })) }],
        ["çok uzun paragraf", { sections: [{ heading: "x", id: "x", body: ["x".repeat(4001)] }] }],
        ["çok uzun başlık", { h1: "x".repeat(301) }],
        ["boş başlık", { h1: "" }],
        ["null alan", { lede: null }],
        ["dizi yerine metin", { faqs: "x" }],
        ["bilinmeyen gövde alanı", { foo: "x" }],
        ["placesKind", { placesKind: "all" }],
        ["tarih biçimi", { reviewedAt: "31.01.2026" }],
        ["countryInfoOnHub metin", { countryInfoOnHub: "evet" }],
        ["beslenme kaynak adresi", { dietary: { ...guide.dietary, vegan: [{ ...guide.dietary.vegan[0], verification: { ...guide.dietary.vegan[0].verification, sourceUrl: "http://example.com" } }] } }],
        ["beslenme durumu", { dietary: { ...guide.dietary, vegan: [{ ...guide.dietary.vegan[0], verification: { ...guide.dietary.vegan[0].verification, status: "belki" } }] } }],
        ["beslenme resmî adres", { dietary: { ...guide.dietary, vegan: [{ ...guide.dietary.vegan[0], officialUrl: "ftp://example.com" }] } }],
      ];
      for (const [label, patch] of bad) {
        const res = await patchCity("FR", "paris", { guide: { translations: { tr: patch } } });
        expect(res.status, `${label}: ${JSON.stringify(res.body).slice(0, 300)}`).toBe(400);
        expect(res.body.code, label).toBe("VALIDATION_FAILED");
      }
      expect((await getCity("FR", "paris")).body.guide.h1).toBe("Paris Rehberi"); // hiçbiri uygulanmadı
    });

    it("slug değiştirilemez; bilinmeyen alan; olmayan şehir/ülke 404", async () => {
      expect((await patchCity("FR", "paris", { slug: "baska" })).status).toBe(400);
      expect((await patchCity("FR", "paris", { foo: 1 })).status).toBe(400);
      expect((await patchCity("FR", "paris", { position: -1 })).status).toBe(400);
      expect((await patchCity("FR", "paris", { position: 10_001 })).status).toBe(400);
      const missing = await patchCity("FR", "lyon", {});
      expect(missing.status).toBe(404);
      expect(missing.body.message).toBe("Şehir bulunamadı.");
      expect((await patchCity("XX", "paris", {})).body.message).toBe("Ülke bulunamadı.");
      expect((await patchCity("TR", "paris", {})).status).toBe(404); // başka ülkenin şehri
      expect((await patchCity("FR", "Büyük", {})).status).toBe(400);
    });
  });

  describe("DELETE /v1/countries/:code/cities/:slug", () => {
    it("204: şehir ve rehberi silinir; sonraki okuma 404; ülke ayrıntısından düşer", async () => {
      const paris = (await dbCity("paris"))!;
      expect(await dbGuide(paris.id)).toBeDefined();
      const res = await deleteCity("FR", "paris");
      expect(res.status).toBe(204);
      expect(res.text).toBe("");
      expect(await dbCity("paris")).toBeUndefined();
      expect(await dbGuide(paris.id)).toBeUndefined(); // rehber de gitti
      expect((await getCity("FR", "paris")).status).toBe(404);
      expect((await getCountry("FR")).body.cities.map((c: { slug: string }) => c.slug)).not.toContain("paris");
      expect((await t.http.get("/v1/countries/FR/cities")).body.items.map((c: { slug: string }) => c.slug)).not.toContain("paris");
      // Diğer şehirler ve başka ülkenin rehberi etkilenmedi.
      expect(await dbCity("nice")).toBeDefined();
      expect(await dbGuide((await dbCity("istanbul", "TR"))!.id)).toBeDefined();
    });

    it("rehbersiz şehir de silinir; ikinci silme 404; olmayan ülke/şehir 404", async () => {
      expect((await deleteCity("FR", "nice")).status).toBe(204);
      const again = await deleteCity("FR", "nice");
      expect(again.status).toBe(404);
      expect(again.body.message).toBe("Şehir bulunamadı.");
      expect((await deleteCity("XX", "nice")).body.message).toBe("Ülke bulunamadı.");
      expect((await deleteCity("TR", "nice")).status).toBe(404);
      expect((await deleteCity("FRA", "nice")).status).toBe(400);
      expect((await deleteCity("FR", "Büyük Harf")).status).toBe(400);
    });

    it("silinen şehrin slug'ı yeniden kullanılabilir (yeni kimlik, rehbersiz)", async () => {
      const oldId = (await dbCity("nice"))!.id;
      await deleteCity("FR", "nice");
      const res = await postCity("FR", { slug: "nice", translations: { tr: { name: "Nice", description: "Yeniden." } } });
      expect(res.status).toBe(201);
      expect((await dbCity("nice"))!.id).not.toBe(oldId);
    });
  });
});
