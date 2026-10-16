import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestApp, type TestApp } from "./helpers/index.js";

describe("HTTP güvenliği: CORS ve başlıklar", () => {
  describe("geliştirme/test (localhost serbest)", () => {
    let t: TestApp;
    beforeAll(async () => {
      t = await createTestApp({ config: { cors: { origins: ["https://wangoh.com"], allowLocalhost: true } } });
    });
    afterAll(() => t.close());

    it("localhost kaynakları ve beyaz listedeki kaynak kabul edilir", async () => {
      for (const origin of ["http://localhost:8081", "http://localhost:3200", "http://127.0.0.1:3000", "https://wangoh.com"]) {
        const res = await t.http.options("/v1/auth/login").set("Origin", origin).set("Access-Control-Request-Method", "POST");
        expect(res.headers["access-control-allow-origin"], origin).toBe(origin);
        expect(res.headers["access-control-allow-headers"]).toMatch(/Authorization/i);
      }
    });

    it("listede olmayan kaynak CORS başlığı almaz; benzer görünen alan adları reddedilir", async () => {
      for (const origin of ["https://evil.example", "https://wangoh.com.evil.example", "http://localhost.evil.example", "https://www.wangoh.com", "null"]) {
        const res = await t.http.options("/v1/auth/login").set("Origin", origin).set("Access-Control-Request-Method", "POST");
        expect(res.headers["access-control-allow-origin"], origin).toBeUndefined();
      }
    });

    it("kimlik bilgisi (çerez) paylaşımı açık değil", async () => {
      const res = await t.http.get("/v1/health").set("Origin", "https://wangoh.com");
      expect(res.headers["access-control-allow-credentials"]).toBeUndefined();
    });
  });

  describe("production (localhost kapalı)", () => {
    let t: TestApp;
    beforeAll(async () => {
      t = await createTestApp({ config: { nodeEnv: "production", isProduction: true, cors: { origins: ["https://wangoh.com"], allowLocalhost: false } } });
    });
    afterAll(() => t.close());

    it("yalnız yapılandırılan kaynaklar", async () => {
      const ok = await t.http.options("/v1/auth/login").set("Origin", "https://wangoh.com").set("Access-Control-Request-Method", "POST");
      expect(ok.headers["access-control-allow-origin"]).toBe("https://wangoh.com");
      const local = await t.http.options("/v1/auth/login").set("Origin", "http://localhost:3000").set("Access-Control-Request-Method", "POST");
      expect(local.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });

  describe("güvenlik başlıkları (helmet)", () => {
    let t: TestApp;
    beforeAll(async () => {
      t = await createTestApp();
    });
    afterAll(() => t.close());

    it("API yanıtlarında sıkı başlıklar", async () => {
      const res = await t.http.get("/v1/health");
      expect(res.headers["x-content-type-options"]).toBe("nosniff");
      expect(res.headers["content-security-policy"]).toContain("default-src 'none'");
      expect(res.headers["strict-transport-security"]).toBeDefined();
      expect(res.headers["x-frame-options"]).toBeDefined();
      expect(res.headers["x-powered-by"]).toBeUndefined();
    });

    it("belirteç/kişisel veri dönen uçlar önbelleğe alınmaz", async () => {
      for (const url of ["/v1/auth/me", "/v1/users"]) {
        const res = await t.http.get(url);
        expect(res.headers["cache-control"], url).toBe("no-store");
      }
      const login = await t.http.post("/v1/auth/login").send({ email: "a@b.co", password: "x" });
      expect(login.headers["cache-control"]).toBe("no-store");
    });

    it("hata yanıtlarında da", async () => {
      const res = await t.http.get("/v1/yok");
      expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("/docs Swagger arayüzü için gevşetilmiş ama sınırlı CSP kullanır", async () => {
      const res = await t.http.get("/docs");
      const csp = res.headers["content-security-policy"] as string;
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).not.toContain("default-src 'none'");
    });
  });

  describe("SWAGGER_ENABLED=false", () => {
    it("/docs ve /docs-json kapalıdır", async () => {
      const t = await createTestApp({ config: { swaggerEnabled: false } });
      try {
        expect((await t.http.get("/docs")).status).toBe(404);
        expect((await t.http.get("/docs-json")).status).toBe(404);
      } finally {
        await t.close();
      }
    });
  });
});
