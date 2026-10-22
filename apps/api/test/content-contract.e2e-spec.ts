import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createOpenApiDocument } from "../src/openapi/document.js";
import { createTestApp, type TestApp } from "./helpers/index.js";

type Operation = { operationId: string; security?: unknown[]; parameters?: Array<{ name: string; in: string; required?: boolean }>; responses: Record<string, any>; requestBody?: any; tags?: string[] };

/**
 * İçerik uçlarının OpenAPI sözleşmesi (openapi.json'u orkestratör üretir; burada yalnız bu modülün
 * ürettiği belge denetlenir): operationId'ler, yetki işaretleri, parametreler, şema bütünlüğü.
 */
describe("içerik OpenAPI sözleşmesi", () => {
  let t: TestApp;
  let doc: ReturnType<typeof createOpenApiDocument>;
  beforeAll(async () => {
    t = await createTestApp();
    doc = createOpenApiDocument(t.app);
  });
  afterAll(() => t.close());

  const ops = (): Map<string, { method: string; path: string; op: Operation }> => {
    const map = new Map<string, { method: string; path: string; op: Operation }>();
    for (const [path, item] of Object.entries(doc.paths)) {
      for (const [method, op] of Object.entries(item as Record<string, Operation>)) {
        if (["get", "post", "put", "patch", "delete"].includes(method)) map.set(op.operationId, { method, path, op });
      }
    }
    return map;
  };

  const EXPECTED: Array<[operationId: string, method: string, path: string, admin: boolean]> = [
    ["contentListContinents", "get", "/v1/continents", false],
    ["contentGetContinent", "get", "/v1/continents/{slug}", false],
    ["contentListCountries", "get", "/v1/countries", false],
    ["contentGetCountry", "get", "/v1/countries/{code}", false],
    ["contentListCountryCities", "get", "/v1/countries/{code}/cities", false],
    ["contentGetCity", "get", "/v1/countries/{code}/cities/{slug}", false],
    ["contentUpdateCountry", "patch", "/v1/countries/{code}", true],
    ["contentCreateCity", "post", "/v1/countries/{code}/cities", true],
    ["contentUpdateCity", "patch", "/v1/countries/{code}/cities/{slug}", true],
    ["contentDeleteCity", "delete", "/v1/countries/{code}/cities/{slug}", true],
  ];

  it("belgedeki on operationId, yöntem ve yollar", () => {
    const all = ops();
    for (const [id, method, path] of EXPECTED) {
      expect(all.get(id), id).toBeDefined();
      expect(all.get(id)).toMatchObject({ method, path });
    }
    const contentIds = [...all.keys()].filter((id) => id.startsWith("content"));
    expect(contentIds.sort()).toEqual(EXPECTED.map(([id]) => id).sort());
  });

  it("okuma uçları herkese açık (güvenlik yok), yazma uçları Bearer ister; hata yanıtları belgeli", () => {
    const all = ops();
    for (const [id, , , admin] of EXPECTED) {
      const { op } = all.get(id)!;
      const secured = Array.isArray(op.security) && op.security.length > 0;
      expect(secured, id).toBe(admin);
      expect(op.tags, id).toEqual(["content"]);
      const statuses = Object.keys(op.responses);
      expect(statuses.some((s) => s.startsWith("2")), id).toBe(true);
      expect(statuses, id).toContain("400");
      if (admin) expect(statuses, id).toEqual(expect.arrayContaining(["401", "403"]));
      if (id !== "contentListContinents" && id !== "contentListCountries") expect(statuses, id).toContain("404");
    }
    expect(all.get("contentDeleteCity")!.op.responses).toHaveProperty("204");
    expect(all.get("contentCreateCity")!.op.responses).toHaveProperty("201");
    expect(all.get("contentCreateCity")!.op.responses).toHaveProperty("409");
  });

  it("parametreler: lang, sayfalama, continent, q, hasTravel; yol parametreleri zorunlu", () => {
    const all = ops();
    const params = (id: string) => Object.fromEntries((all.get(id)!.op.parameters ?? []).map((p) => [`${p.in}:${p.name}`, p]));
    expect(Object.keys(params("contentListCountries")).sort()).toEqual(["query:continent", "query:hasTravel", "query:lang", "query:page", "query:pageSize", "query:q"]);
    expect(Object.keys(params("contentListCountryCities")).sort()).toEqual(["path:code", "query:lang", "query:page", "query:pageSize", "query:q"]);
    expect(Object.keys(params("contentGetCity")).sort()).toEqual(["path:code", "path:slug", "query:lang"]);
    expect(Object.keys(params("contentListContinents"))).toEqual(["query:lang"]);
    expect(params("contentGetCity")["path:code"]!.required).toBe(true);
    for (const id of ["contentUpdateCountry", "contentCreateCity", "contentUpdateCity"]) expect(all.get(id)!.op.requestBody, id).toBeDefined();
  });

  it("şemalar: sayfa zarfları, rehber ve ülke ayrıntı alanları; tüm $ref'ler çözülür", () => {
    const schemas = doc.components!.schemas as Record<string, { properties?: Record<string, unknown>; required?: string[] }>;
    for (const name of [
      "ContinentDto", "CountrySummaryDto", "CountryDetailDto", "CountryPageDto", "CountryTravelDto", "CountryHubDto", "CitySummaryDto", "CityPageDto",
      "CityDetailDto", "CityGuideDto", "UpdateCountryDto", "CreateCityDto", "UpdateCityDto", "GuideBodyInputDto", "DietaryGuideDto",
    ]) expect(schemas[name], name).toBeDefined();
    expect(Object.keys(schemas.CountryPageDto!.properties!).sort()).toEqual(["items", "page", "pageSize", "total"]);
    expect(Object.keys(schemas.CityGuideDto!.properties!)).toEqual(expect.arrayContaining(["lang", "complete", "reviewed", "seoTitle", "h1", "sections", "places", "itinerary", "faqs", "relatedGuides", "sources", "dietary", "reviewedAt"]));
    expect(schemas.CountrySummaryDto!.required).toEqual(expect.arrayContaining(["code", "name", "flagUrl", "imageUrl", "lang", "complete", "hasTravel"]));
    expect(schemas.CountryDetailDto!.properties).toHaveProperty("travel");
    expect(schemas.CountryDetailDto!.properties).toHaveProperty("cities");
    // Yanıt şemalarına iç alanlar sızmaz (yazma gövdeleri `translations`/`completeLangs` taşır: onlar bilerek hariç).
    for (const name of ["ContinentDto", "CountrySummaryDto", "CountryDetailDto", "CountryPageDto", "CountryTravelDto", "CountryHubDto", "CitySummaryDto", "CityPageDto", "CityDetailDto", "CityGuideDto"]) {
      expect(JSON.stringify(schemas[name]), name).not.toMatch(/"aliases"|"translations"|"completeLangs"/);
    }

    const refs = new Set<string>();
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) node.forEach(walk);
      else if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) {
          if (k === "$ref" && typeof v === "string") refs.add(v);
          else walk(v);
        }
      }
    };
    walk(doc);
    for (const ref of refs) expect(schemas[ref.replace("#/components/schemas/", "")], ref).toBeDefined();
  });

  it("yazma gövdesi şemaları: zorunlu alanlar ve sınırlar belgelenmiş", () => {
    const schemas = doc.components!.schemas as Record<string, any>;
    expect(schemas.CreateCityDto.required).toEqual(["translations"]);
    expect(schemas.CreateCityDto.properties.slug).toMatchObject({ maxLength: 80 });
    expect(schemas.CityFieldsDto.properties.name).toMatchObject({ minLength: 1, maxLength: 120 });
    expect(schemas.GuideSourceDto.properties.url).toMatchObject({ format: "uri", maxLength: 2048 });
    expect(schemas.UpdateCityDto.properties.position).toMatchObject({ minimum: 0, maximum: 10000 });
  });
});
