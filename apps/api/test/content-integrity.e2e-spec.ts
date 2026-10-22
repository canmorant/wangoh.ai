import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { cities, cityGuides, countryTravel } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, type TestApp, type TestSession } from "./helpers/index.js";
import { loadFixtureSeed } from "./helpers/content-fixture.js";

type Json = Record<string, any>;

/**
 * Yönetici yazmalarının veri bütünlüğü: kalıcı 500'e ya da bozuk veriye yol açan girdiler reddedilir, şehir adı bağlantı
 * anahtarı olarak tutarlı kalır. Davranış fixture tohumuyla sınanır (`test/fixtures/seed`).
 */
describe("içerik yazma bütünlüğü (yönetici)", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());
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
  const cityQuery = async (code: string, q: string) => ((await t.http.get(`/v1/countries/${code}/cities?q=${encodeURIComponent(q)}`)).body.items as Array<{ slug: string }>).map((c) => c.slug);

  const guideBody = async (): Promise<Json> => {
    const { lang: _lang, complete: _complete, reviewed: _reviewed, ...body } = (await getCity("FR", "paris")).body.guide as Json;
    return body;
  };
  const hubOf = async (): Promise<Json> => ((await getCountry("FR")).body.travel as Json).hub;

  /** Tüm içerik satırlarının anlık görüntüsü: reddedilen istek hiçbir şey yazmamış olmalı. */
  const snapshot = async (): Promise<string> =>
    JSON.stringify([
      await t.db.select().from(countryTravel).orderBy(countryTravel.countryCode),
      await t.db.select().from(cityGuides).orderBy(cityGuides.cityId),
      (await t.db.select().from(cities).orderBy(cities.countryCode, cities.slug)).map(({ id: _id, ...row }) => row),
    ]);

  describe("dizi içinde dizi doğrulamayı geçemez (kalıcı 500 / bozuk rehber)", () => {
    it("hub: routeIdeas, essentials, cityLinks, intro ve cities için iç içe diziler 400; okuma bozulmaz", async () => {
      const hub = await hubOf();
      const route = hub.routeIdeas[0];
      const link = route.cityLinks[0];
      const cases: Array<[string, Json]> = [
        ["routeIdeas [[]]", { ...hub, routeIdeas: [[]] }],
        ["routeIdeas [[rota]]", { ...hub, routeIdeas: [[route]] }],
        ["routeIdeas [rota, []]", { ...hub, routeIdeas: [route, []] }],
        ["essentials [[]]", { ...hub, essentials: [[]] }],
        ["essentials [[öğe]]", { ...hub, essentials: [[hub.essentials[0]]] }],
        ["cityLinks [[]]", { ...hub, routeIdeas: [{ ...route, cityLinks: [[]] }] }],
        ["cityLinks [[bağlantı]]", { ...hub, routeIdeas: [{ ...route, cityLinks: [[link]] }] }],
        ["intro [[metin]]", { ...hub, intro: [["metin"]] }],
        ["cities [[ad]]", { ...hub, routeIdeas: [{ ...route, cities: [["Paris"]] }] }],
      ];
      const before = await snapshot();
      for (const [label, bad] of cases) {
        const res = await patchCountry("FR", { travel: { translations: { tr: { hub: bad } } } });
        expect(res.status, `${label}: ${JSON.stringify(res.body).slice(0, 200)}`).toBe(400);
        expect(res.body.code, label).toBe("VALIDATION_FAILED");
      }
      expect(await snapshot()).toBe(before);
      for (const lang of ["tr", "en", "es"]) expect((await getCountry("FR", lang)).status, lang).toBe(200);
      expect((await patchCountry("FR", { travel: { accent: "#112233" } })).status).toBe(200);
    });

    it("rehber: her nesne dizisi alanında [[]] ve [[öğe]] 400; kayıtlı rehber değişmez", async () => {
      const guide = await guideBody();
      const section = guide.sections[0];
      const cases: Array<[string, Json]> = [];
      for (const field of ["quickFacts", "sections", "places", "itinerary", "practicalTips", "faqs", "relatedGuides", "sources"]) {
        cases.push([`${field} [[]]`, { [field]: [[]] }], [`${field} [[öğe]]`, { [field]: [[guide[field][0]]] }], [`${field} [öğe, []]`, { [field]: [guide[field][0], []] }]);
      }
      cases.push(
        ["sections[0].subsections [[]]", { sections: [{ ...section, subsections: [[]] }] }],
        ["sections[0].subsections [[alt]]", { sections: [{ ...section, subsections: [[section.subsections[0]]] }] }],
        ["sections[0].body [[metin]]", { sections: [{ ...section, body: [["metin"]] }] }],
        ["dietary.vegan [[]]", { dietary: { ...guide.dietary, vegan: [[]] } }],
        ["dietary.vegan [[öğe]]", { dietary: { ...guide.dietary, vegan: [[guide.dietary.vegan[0]]] } }],
        ["dietary.halal [[]]", { dietary: { ...guide.dietary, halal: [[]] } }],
      );
      const before = await snapshot();
      for (const [label, patch] of cases) {
        const res = await patchCity("FR", "paris", { guide: { translations: { tr: patch } } });
        expect(res.status, `${label}: ${JSON.stringify(res.body).slice(0, 200)}`).toBe(400);
        expect(res.body.code, label).toBe("VALIDATION_FAILED");
      }
      expect(await snapshot()).toBe(before);
      expect((await getCity("FR", "paris")).body.guide.sections[0]).toMatchObject({ heading: "Ulaşım" });
    });

    it("yeni şehir isteğinde de iç içe rehber dizisi reddedilir", async () => {
      const guide = await guideBody();
      const res = await postCity("FR", { slug: "ic-ice", translations: { tr: { name: "İç İçe", description: "x" } }, guide: { translations: { tr: { ...guide, faqs: [[]] } } } });
      expect(res.status).toBe(400);
      expect((await t.http.get("/v1/countries/FR/cities/ic-ice")).status).toBe(404);
    });
  });

  describe("tarihler takvimde var olmalı", () => {
    const impossible = ["2026-13-45", "0000-00-00", "9999-99-99", "2026-00-10", "2026-04-31", "2025-02-29", "2026-02-30", "2026-1-05"];
    const possible = ["2026-02-28", "2024-02-29", "2000-01-01", "2026-12-31"];

    it("reviewedAt: olmayan günler 400, geçerli günler (artık yıl dahil) 200", async () => {
      for (const reviewedAt of impossible) {
        const res = await patchCity("FR", "paris", { guide: { translations: { tr: { reviewedAt } } } });
        expect(res.status, reviewedAt).toBe(400);
        expect(res.body.details.map((d: { field: string }) => d.field), reviewedAt).toContain("guide.translations.tr.reviewedAt");
      }
      expect((await getCity("FR", "paris")).body.guide.reviewedAt).toBe("2026-01-31");
      for (const reviewedAt of possible) {
        const res = await patchCity("FR", "paris", { guide: { translations: { tr: { reviewedAt } } } });
        expect(res.status, reviewedAt).toBe(200);
        expect(res.body.guide.reviewedAt).toBe(reviewedAt);
      }
    });

    it("dietary lastVerified: aynı kural", async () => {
      const guide = await guideBody();
      const withDate = (lastVerified: string) => ({ dietary: { ...guide.dietary, vegan: [{ ...guide.dietary.vegan[0], lastVerified }] } });
      for (const lastVerified of impossible) expect((await patchCity("FR", "paris", { guide: { translations: { tr: withDate(lastVerified) } } })).status, lastVerified).toBe(400);
      expect((await patchCity("FR", "paris", { guide: { translations: { tr: withDate("2024-02-29") } } })).status).toBe(200);
      expect((await getCity("FR", "paris")).body.guide.dietary.vegan[0].lastVerified).toBe("2024-02-29");
    });
  });

  describe("metinler NFC'ye çevrilir (ayrışık Unicode aranabilir ve ikiz oluşturmaz)", () => {
    const nfdName = "İstanbul-Test".normalize("NFD");

    it("ayrışık (NFD) girilen şehir adı NFC saklanır ve her yazımla bulunur", async () => {
      expect(nfdName).not.toBe(nfdName.normalize("NFC")); // test verisi gerçekten ayrışık
      const res = await postCity("TR", { slug: "nfd-test", translations: { tr: { name: nfdName, description: "Açıklama" } } });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("İstanbul-Test");
      expect((((await t.db.select().from(cities).where(eq(cities.slug, "nfd-test")))[0]!.translations as Json).tr.name as string).normalize("NFC")).toBe("İstanbul-Test");
      expect(JSON.stringify((await t.db.select().from(cities).where(eq(cities.slug, "nfd-test")))[0]!.translations)).not.toContain("̇");
      for (const q of ["istanbul-test", "İstanbul-Test", "ISTANBUL-TEST", nfdName]) expect(await cityQuery("TR", q), q).toContain("nfd-test");
    });

    it("NFC ve NFD yazımı aynı ad sayılır: ikinci şehir 409", async () => {
      expect((await postCity("TR", { slug: "nfc-bir", translations: { tr: { name: "Şanlıurfa-Test", description: "x" } } })).status).toBe(201);
      const twin = await postCity("TR", { slug: "nfd-iki", translations: { tr: { name: "Şanlıurfa-Test".normalize("NFD"), description: "x" } } });
      expect(twin.status).toBe(409);
      expect(twin.body.code).toBe("CITY_NAME_TAKEN");
    });

    it("ülke adı ve metin listeleri de NFC'ye çevrilir", async () => {
      const res = await patchCountry("FR", { translations: { en: { name: "Fränce".normalize("NFD") } } }, "?lang=en");
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Fränce".normalize("NFC"));
      const hub = await hubOf();
      const patched = await patchCountry("FR", { travel: { translations: { tr: { hub: { ...hub, intro: ["Gezi: İstanbul".normalize("NFD")] } } } } });
      expect(patched.status).toBe(200);
      expect(patched.body.travel.hub.intro).toEqual(["Gezi: İstanbul".normalize("NFC")]);
    });
  });

  describe("şehrin Türkçe adı rota ve ilgili rehber bağlantı anahtarıdır", () => {
    it("ad değişince aynı ülkedeki hub ve rehber başvuruları (tüm dillerde) birlikte güncellenir; bağlantılar kopmaz", async () => {
      const res = await patchCity("FR", "nice", { translations: { tr: { name: "Nis" } } });
      expect(res.status, JSON.stringify(res.body)).toBe(200);
      expect(res.body.name).toBe("Nis");

      for (const lang of ["tr", "en"]) {
        const route = ((await getCountry("FR", lang)).body.travel.hub as Json).routeIdeas[0];
        expect(route.cities, lang).toEqual(["Paris", "Nis"]);
        expect(route.cityLinks.map((l: { slug: string }) => l.slug), lang).toEqual(["paris", "nice"]);
        const related = (await getCity("FR", "paris", lang)).body.guide.relatedGuides;
        expect(related, lang).toEqual([{ city: "Nis", anchor: expect.any(String), description: expect.any(String), slug: "nice" }]);
      }
      // Saklı veride eski ad kalmadı.
      const stored = JSON.stringify([(await t.db.select().from(countryTravel).where(eq(countryTravel.countryCode, "FR")))[0]!.translations, await t.db.select().from(cityGuides)]);
      expect(stored).not.toContain('"Nice"');
    });

    it("aynı ada geri dönmek ve değişmeyen adı yeniden göndermek sorun değildir", async () => {
      expect((await patchCity("FR", "nice", { translations: { tr: { name: "Nice", description: "Yeni açıklama." } } })).status).toBe(200);
      expect((await patchCity("FR", "nice", { translations: { tr: { name: "Nis" } } })).status).toBe(200);
      expect((await patchCity("FR", "nice", { translations: { tr: { name: "Nice" } } })).status).toBe(200);
      const route = ((await getCountry("FR")).body.travel.hub as Json).routeIdeas[0];
      expect(route.cities).toEqual(["Paris", "Nice"]);
      expect(route.cityLinks).toHaveLength(2);
    });

    it("ülkede zaten kullanılan Türkçe ad: yeniden adlandırma ve ekleme 409 CITY_NAME_TAKEN; hiçbir şey değişmez", async () => {
      const before = await snapshot();
      const rename = await patchCity("FR", "nice", { translations: { tr: { name: "Paris" } } });
      expect(rename.status).toBe(409);
      expect(rename.body.code).toBe("CITY_NAME_TAKEN");
      const dup = await postCity("FR", { slug: "paris-2", translations: { tr: { name: "Paris", description: "x" } } });
      expect(dup.status).toBe(409);
      expect(dup.body.code).toBe("CITY_NAME_TAKEN");
      expect(await snapshot()).toBe(before);
      const route = ((await getCountry("FR")).body.travel.hub as Json).routeIdeas[0];
      expect(route.cityLinks[0]).toEqual({ slug: "paris", name: "Paris" });
      // Başka ülkede aynı ad serbest; silinen şehrin adı yeniden kullanılabilir.
      expect((await postCity("TR", { slug: "paris-tr", translations: { tr: { name: "Paris", description: "x" } } })).status).toBe(201);
      expect((await deleteCity("FR", "nice")).status).toBe(204);
      expect((await postCity("FR", { slug: "nice", translations: { tr: { name: "Nice", description: "Yeniden." } } })).status).toBe(201);
    });

    it("eşzamanlı ikiz adlar: yalnız biri eklenir", async () => {
      const make = (slug: string) => postCity("FR", { slug, translations: { tr: { name: "Ikiz Sehir", description: "x" } } });
      const results = await Promise.all([make("ikiz-1"), make("ikiz-2"), make("ikiz-3")]);
      expect(results.map((r) => r.status).sort()).toEqual([201, 409, 409]);
    });

    it("çözülemeyen şehir adı bağlantı üretmez: silinen şehir cityLinks'ten düşer, relatedGuides slug'ı null olur", async () => {
      expect((await deleteCity("FR", "nice")).status).toBe(204);
      const route = ((await getCountry("FR")).body.travel.hub as Json).routeIdeas[0];
      expect(route.cities).toEqual(["Paris", "Nice"]); // metin olduğu gibi kalır
      expect(route.cityLinks).toEqual([{ slug: "paris", name: "Paris" }]); // boş slug'lı sahte bağlantı yok
      const related = (await getCity("FR", "paris")).body.guide.relatedGuides;
      expect(related).toEqual([{ city: "Nice", anchor: expect.any(String), description: expect.any(String), slug: null }]);
    });
  });

  describe("yanıt yalnız bilinen alanları taşır", () => {
    it("saklı rehber/hub içindeki fazladan alanlar yanıta sızmaz", async () => {
      const [guideRow] = await t.db.select().from(cityGuides).limit(1);
      const translations = JSON.parse(JSON.stringify(guideRow!.translations)) as Json;
      translations.tr.sizinti = "gizli";
      translations.tr.relatedGuides[0].sizinti = "gizli";
      await t.db.update(cityGuides).set({ translations: translations as never }).where(eq(cityGuides.cityId, guideRow!.cityId));
      const [travelRow] = await t.db.select().from(countryTravel).where(eq(countryTravel.countryCode, "FR"));
      const travel = JSON.parse(JSON.stringify(travelRow!.translations)) as Json;
      travel.tr.hub.sizinti = "gizli";
      travel.tr.hub.routeIdeas[0].sizinti = "gizli";
      await t.db.update(countryTravel).set({ translations: travel as never }).where(eq(countryTravel.countryCode, "FR"));

      const city = (await getCity("FR", "paris")).body;
      const country = (await getCountry("FR")).body;
      expect(JSON.stringify(city)).not.toContain("gizli");
      expect(JSON.stringify(country)).not.toContain("gizli");
      expect(Object.keys(city.guide.relatedGuides[0]).sort()).toEqual(["anchor", "city", "description", "slug"]);
    });
  });

  describe("ülke çevirisi: dil başına yalnız ad zorunlu", () => {
    it("alt bölge ve resmî ad yoksa null döner; Türkçe değer karıştırılmaz (lang her alan için geçerlidir)", async () => {
      await patchCountry("FR", { translations: { es: null } });
      const res = await patchCountry("FR", { translations: { es: { name: "Francia" } } }, "?lang=es");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "Francia", officialName: null, subregion: null, lang: "es", complete: true });
      expect((await getCountry("FR")).body).toMatchObject({ officialName: "Fransa Cumhuriyeti", subregion: "Batı Avrupa" });
    });
  });

  describe("completeLangs tekrarsız olmalı", () => {
    it("çevirisi var olan dil iki kez verilirse 400 (tekrar nedeniyle, eksik çeviri nedeniyle değil)", async () => {
      const travel = await patchCountry("FR", { travel: { completeLangs: ["en", "en"] } });
      expect(travel.status).toBe(400);
      expect(JSON.stringify(travel.body.details)).toContain("arrayUnique");
      expect(JSON.stringify(travel.body.details)).not.toContain("missingTranslation");
      const city = await patchCity("FR", "paris", { completeLangs: ["en", "en"] });
      expect(city.status).toBe(400);
      expect(JSON.stringify(city.body.details)).toContain("arrayUnique");
      const guide = await patchCity("FR", "paris", { guide: { completeLangs: ["en", "en"] } });
      expect(guide.status).toBe(400);
      expect(JSON.stringify(guide.body.details)).toContain("arrayUnique");
      expect((await patchCountry("FR", { travel: { completeLangs: ["en"] } })).status).toBe(200);
    });
  });

  it("silinen şehrin rehberi de gider ve diğer şehirler etkilenmez (cascade)", async () => {
    const [paris] = await t.db.select().from(cities).where(and(eq(cities.countryCode, "FR"), eq(cities.slug, "paris")));
    expect((await deleteCity("FR", "paris")).status).toBe(204);
    expect(await t.db.select().from(cityGuides).where(eq(cityGuides.cityId, paris!.id))).toHaveLength(0);
  });
});
