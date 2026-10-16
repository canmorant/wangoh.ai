import { afterAll, describe, expect, it } from "vitest";
import { bearer, createTestApp, registerUser, type TestApp } from "./helpers/index.js";

const login = (t: TestApp, email = "yok@example.test", extra: Record<string, string> = {}) =>
  t.http.post("/v1/auth/login").set(extra).send({ email, password: "yanlis-parola-1" });

describe("hız sınırı", () => {
  const apps: TestApp[] = [];
  afterAll(async () => {
    await Promise.all(apps.map((a) => a.close()));
  });
  const make = async (opts: Parameters<typeof createTestApp>[0]) => {
    const a = await createTestApp(opts);
    apps.push(a);
    return a;
  };

  it("varsayılan olarak testlerde kapalıdır", async () => {
    const t = await make({});
    const results = await Promise.all(Array.from({ length: 30 }, () => login(t)));
    expect(results.every((r) => r.status === 401)).toBe(true);
  });

  it("kimlik uçları IP başına dakikada 10: 11. istek 429 RATE_LIMITED, kova uçlar arasında ortak", async () => {
    const t = await make({ rateLimit: true });
    for (let i = 0; i < 10; i++) expect((await login(t)).status).toBe(401);
    const blocked = await login(t);
    expect(blocked.status).toBe(429);
    expect(blocked.body).toEqual({
      statusCode: 429,
      code: "RATE_LIMITED",
      message: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
    });
    expect(Number(blocked.headers["retry-after"])).toBeGreaterThan(0);

    // Aynı kimlik kovasındaki diğer uçlar da kapanır...
    expect((await t.http.post("/v1/auth/register").send({ email: "x@example.test", password: "Parola-12345", displayName: "Ad Soyad" })).status).toBe(429);
    expect((await t.http.post("/v1/auth/refresh").send({ refreshToken: "A".repeat(43) })).status).toBe(429);
    // ...kimlik dışı uçlar etkilenmez.
    expect((await t.http.get("/v1/health")).status).toBe(200);
  });

  it("kimlik sınırı kimlik dışı uçları yavaşlatmaz; genel sınır ayrı sayılır", async () => {
    const t = await make({ rateLimit: { defaultLimit: 5, authLimit: 3 } });
    for (let i = 0; i < 5; i++) expect((await t.http.get("/v1/health")).status).toBe(200);
    const blocked = await t.http.get("/v1/health");
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe("RATE_LIMITED");
  });

  it("genel sınır varsayılanı 120/dk", async () => {
    const t = await make({ rateLimit: true });
    expect(t.config.rateLimit).toMatchObject({ enabled: true, defaultLimit: 120, authLimit: 10, ttlMs: 60_000 });
  });

  it("parola değişimi ve hesap silme de kimlik kovasına girer (parola tahmini)", async () => {
    const t = await make({ rateLimit: { authLimit: 3, defaultLimit: 1000 } });
    const u = await registerUser(t.http); // 1
    for (let i = 0; i < 2; i++) {
      const res = await t.http.post("/v1/users/me/password").set(bearer(u.accessToken)).send({ currentPassword: "yanlis-parola-1", newPassword: "YeniParola-123" });
      expect(res.status).toBe(403); // 2, 3
    }
    const blocked = await t.http.delete("/v1/users/me").set(bearer(u.accessToken)).send({ password: "yanlis-parola-1" });
    expect(blocked.status).toBe(429);
    // Genel uçlar (örn. /auth/me) hâlâ çalışır.
    expect((await t.http.get("/v1/auth/me").set(bearer(u.accessToken))).status).toBe(200);
  });

  it("TRUST_PROXY kapalıyken X-Forwarded-For yok sayılır (sınır atlatılamaz)", async () => {
    const t = await make({ rateLimit: { authLimit: 2, defaultLimit: 1000 } });
    await login(t, undefined, { "X-Forwarded-For": "10.0.0.1" });
    await login(t, undefined, { "X-Forwarded-For": "10.0.0.2" });
    const third = await login(t, undefined, { "X-Forwarded-For": "10.0.0.3" });
    expect(third.status).toBe(429);
  });

  it("TRUST_PROXY açıkken istemci IP'si X-Forwarded-For'dan gelir (IP başına ayrı kova)", async () => {
    const t = await make({ rateLimit: { authLimit: 2, defaultLimit: 1000 }, config: { trustProxy: 1 } });
    for (const ip of ["10.0.0.1", "10.0.0.1"]) expect((await login(t, undefined, { "X-Forwarded-For": ip })).status).toBe(401);
    expect((await login(t, undefined, { "X-Forwarded-For": "10.0.0.1" })).status).toBe(429);
    // Başka istemci etkilenmez.
    expect((await login(t, undefined, { "X-Forwarded-For": "10.0.0.2" })).status).toBe(401);
  });
});
