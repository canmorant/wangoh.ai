import { readFileSync } from "node:fs";
import { DiscoveryService, MetadataScanner, ModulesContainer } from "@nestjs/core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { IS_OPTIONAL_AUTH_KEY, IS_PUBLIC_KEY } from "../src/common/decorators/public.decorator.js";
import { ROLES_KEY } from "../src/common/decorators/roles.decorator.js";
import { createOpenApiDocument, operationIdFactory, serializeOpenApi } from "../src/openapi/document.js";
import { OPENAPI_PATH } from "../src/paths.js";
import { createTestApp, type TestApp } from "./helpers/index.js";

type Operation = { operationId: string; security?: unknown[]; responses: Record<string, unknown>; tags?: string[] };

describe("OpenAPI sözleşmesi", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  const operations = (doc: ReturnType<typeof createOpenApiDocument>) =>
    Object.entries(doc.paths).flatMap(([path, item]) =>
      Object.entries(item as Record<string, Operation>)
        .filter(([method]) => ["get", "post", "put", "patch", "delete"].includes(method))
        .map(([method, op]) => ({ path, method, op })),
    );

  it("commit edilen openapi.json güncel: üretilen belgeyle bayt bayt aynı (güncellemek için: pnpm --filter api openapi:export)", () => {
    const generated = serializeOpenApi(createOpenApiDocument(t.app));
    const committed = readFileSync(OPENAPI_PATH, "utf8");
    expect(committed === generated, "apps/api/openapi.json eski. `pnpm --filter api openapi:export` çalıştırıp commit edin.").toBe(true);
  });

  it("üretim deterministik: aynı uygulamadan iki kez aynı çıktı", () => {
    expect(serializeOpenApi(createOpenApiDocument(t.app))).toBe(serializeOpenApi(createOpenApiDocument(t.app)));
  });

  it("/docs-json ve /docs sunulur, belge üretilenle aynı, önek dışında", async () => {
    const json = await t.http.get("/docs-json");
    expect(json.status).toBe(200);
    expect(json.body.openapi).toMatch(/^3\./);
    expect(json.body).toEqual(JSON.parse(serializeOpenApi(createOpenApiDocument(t.app))));
    const ui = await t.http.get("/docs");
    expect(ui.status).toBe(200);
    expect(ui.headers["content-type"]).toContain("text/html");
    expect((await t.http.get("/v1/docs-json")).status).toBe(404);
  });

  it("tüm yollar /v1 altında ve Bearer şeması tanımlı", () => {
    const doc = createOpenApiDocument(t.app);
    expect(Object.keys(doc.paths).every((p) => p.startsWith("/v1/"))).toBe(true);
    expect(doc.components?.securitySchemes).toMatchObject({ bearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" } });
  });

  it("operationId'ler benzersiz ve <Denetleyici><Metot> biçiminde (authLogin, usersList...)", () => {
    const ids = operations(createOpenApiDocument(t.app)).map((o) => o.op.operationId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][A-Za-z0-9]*$/);
    expect(ids).toEqual(
      expect.arrayContaining([
        "authRegister", "authLogin", "authRefresh", "authLogout", "authMe",
        "usersUpdateMe", "usersChangePassword", "usersDeleteMe", "usersList", "usersGet", "usersUpdate", "usersRemove",
        "healthCheck",
      ]),
    );
    expect(operationIdFactory("AuthController", "login")).toBe("authLogin");
  });

  it("korumalı uçlar Bearer güvenliği bildirir, herkese açık uçlar bildirmez (tüm modüller dahil)", () => {
    const doc = createOpenApiDocument(t.app);
    const byId = new Map(operations(doc).map((o) => [o.op.operationId, o.op]));
    const discovery = new DiscoveryService(t.app.get(ModulesContainer));
    const scanner = new MetadataScanner();
    let checked = 0;
    for (const wrapper of discovery.getControllers()) {
      const instance = wrapper.instance as Record<string, unknown> | null;
      if (!instance || !wrapper.metatype) continue;
      const proto = Object.getPrototypeOf(instance) as Record<string, (...a: unknown[]) => unknown>;
      for (const name of scanner.getAllMethodNames(proto)) {
        const handler = proto[name]!;
        if (Reflect.getMetadata("method", handler) === undefined) continue; // rota değil
        const op = byId.get(operationIdFactory(wrapper.metatype.name, name));
        if (!op) continue;
        const flag = (key: string) => Reflect.getMetadata(key, handler) ?? Reflect.getMetadata(key, wrapper.metatype!);
        const isPublic = flag(IS_PUBLIC_KEY) === true;
        const isOptional = flag(IS_OPTIONAL_AUTH_KEY) === true;
        const secured = Array.isArray(op.security) && op.security.length > 0;
        if (isPublic) {
          expect(secured, `${wrapper.metatype.name}.${name} herkese açık ama güvenlik bildiriyor`).toBe(false);
          expect(flag(ROLES_KEY), `${wrapper.metatype.name}.${name} hem @Public hem @Roles: rol denetimi kullanıcı bulamayıp herkesi reddeder`).toBeUndefined();
        }
        else if (!isOptional) expect(secured, `${wrapper.metatype.name}.${name} korumalı ama @ApiBearerAuth() yok`).toBe(true);
        checked++;
      }
    }
    expect(checked).toBeGreaterThanOrEqual(12);
  });

  it("her uç standart hata gövdesini belgeler ve yanıt şemalarında hassas alan yok", () => {
    const doc = createOpenApiDocument(t.app);
    const schemas = doc.components?.schemas as Record<string, { properties?: Record<string, unknown> }>;
    expect(schemas.ErrorResponseDto?.properties).toHaveProperty("code");
    const text = JSON.stringify(doc);
    expect(text).not.toMatch(/passwordHash|tokenHash|token_hash|tokenVersion/);
    expect(schemas.UserDto?.properties).toBeDefined();
    expect(Object.keys(schemas.UserDto!.properties!).sort()).toEqual(["createdAt", "disabled", "displayName", "email", "id", "role", "updatedAt"]);
    for (const { op } of operations(doc)) {
      const statuses = Object.keys(op.responses);
      expect(statuses.some((s) => s.startsWith("2")), op.operationId).toBe(true);
    }
  });
});
