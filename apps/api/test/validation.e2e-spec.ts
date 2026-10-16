import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { bearer, createAdmin, createTestApp, DEFAULT_TEST_PASSWORD, registerUser, type TestApp, uniqueEmail } from "./helpers/index.js";
import { ProbeModule } from "./helpers/probe.js";

function expectErrorShape(body: Record<string, unknown>, status: number) {
  expect(Object.keys(body).every((k) => ["statusCode", "code", "message", "details"].includes(k))).toBe(true);
  expect(body.statusCode).toBe(status);
  expect(typeof body.code).toBe("string");
  expect(body.code).toMatch(/^[A-Z][A-Z0-9_]+$/);
  expect(typeof body.message).toBe("string");
  expect((body.message as string).length).toBeGreaterThan(0);
}

describe("doğrulama ve hata gövdesi", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp({ extraModules: [ProbeModule] });
  });
  afterAll(() => t.close());

  const valid = () => ({ email: uniqueEmail(), password: DEFAULT_TEST_PASSWORD, displayName: "Geçerli Ad" });
  const register = (body: unknown) => t.http.post("/v1/auth/register").send(body as object);

  describe("kayıt girdisi", () => {
    it("bilinmeyen alanlar reddedilir ve adı bildirilir", async () => {
      const res = await register({ ...valid(), isAdmin: true, foo: "x" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("VALIDATION_FAILED");
      expect(res.body.message).toBe("Girilen bilgiler geçersiz.");
      const fields = res.body.details.map((d: { field: string }) => d.field).sort();
      expect(fields).toEqual(["foo", "isAdmin"]);
      expectErrorShape(res.body, 400);
    });

    it("zorunlu alanlar eksikse hepsi tek yanıtta, Türkçe", async () => {
      const res = await register({});
      expect(res.status).toBe(400);
      const byField = Object.fromEntries(res.body.details.map((d: { field: string; message: string }) => [d.field, d.message]));
      expect(Object.keys(byField).sort()).toEqual(["displayName", "email", "password"]);
      expect(byField.email).toBe("Geçerli bir e-posta adresi girin.");
    });

    it("e-posta: geçersiz biçim ve 254 karakter üstü", async () => {
      for (const email of ["", " ", "yok", "a@b", "a b@c.de", `${"a".repeat(250)}@x.com`, 123, null, ["a@b.co"]]) {
        const res = await register({ ...valid(), email });
        expect(res.status, JSON.stringify(email)).toBe(400);
        expect(res.body.details.some((d: { field: string }) => d.field === "email")).toBe(true);
      }
    });

    it("parola: 8-128 karakter, metin olmalı", async () => {
      for (const password of ["1234567", "", "a".repeat(129), 12345678, null, ["parola123"], { a: 1 }]) {
        const res = await register({ ...valid(), password });
        expect(res.status, JSON.stringify(password)).toBe(400);
        expect(res.body.details.some((d: { field: string }) => d.field === "password")).toBe(true);
      }
      expect((await register({ ...valid(), password: "a".repeat(128) })).status).toBe(201);
      expect((await register({ ...valid(), password: "12345678" })).status).toBe(201);
    });

    it("görünen ad: boş, tek karakter, 51 karakter, yalnız boşluk, kontrol/bidi karakterleri reddedilir", async () => {
      for (const displayName of ["", "A", " A ", "   ", "a".repeat(51), "Ad\u0000Soyad", "Ad‮Soyad", "Ad\nSoyad", "Ad​Soyad", 42, null]) {
        const res = await register({ ...valid(), displayName });
        expect(res.status, JSON.stringify(displayName)).toBe(400);
        expect(res.body.details.some((d: { field: string }) => d.field === "displayName")).toBe(true);
      }
      const ok = await register({ ...valid(), displayName: "Ş".repeat(50) });
      expect(ok.status).toBe(201);
      expect((await register({ ...valid(), displayName: "  Ça  " })).body.user.displayName).toBe("Ça");
    });

    it("çok uzun girdi kabul edilmez ve 500 üretmez", async () => {
      const res = await register({ ...valid(), displayName: "x".repeat(50_000) });
      expect(res.status).toBe(400);
      expect(JSON.stringify(res.body).length).toBeLessThan(2000); // girdi yankılanmaz
    });

    it("prototip kirletme girişimi etkisizdir: anahtarlar düşer, rol yükselmez", async () => {
      // JSON.parse `__proto__`ı sıradan özellik yapar; class-transformer `__proto__`/`constructor` anahtarlarını atlar.
      const res = await t.http
        .post("/v1/auth/register")
        .set("Content-Type", "application/json")
        .send('{"email":"' + uniqueEmail() + '","password":"Parola-12345","displayName":"Ad Soyad","__proto__":{"role":"admin"},"constructor":{"prototype":{"role":"admin"}}}');
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe("user");
      expect(({} as Record<string, unknown>).role).toBeUndefined();
      expect(Object.prototype).not.toHaveProperty("role");
    });
  });

  describe("gövde ayrıştırma", () => {
    it("bozuk JSON 400 (Türkçe, tutarlı gövde)", async () => {
      const res = await t.http.post("/v1/auth/login").set("Content-Type", "application/json").send('{"email": ');
      expect(res.status).toBe(400);
      expectErrorShape(res.body, 400);
      expect(res.body.message).toMatch(/geçersiz/i);
    });

    it("gövde yok / JSON olmayan içerik türü 400 doğrulama hatası", async () => {
      const none = await t.http.post("/v1/auth/login");
      expect(none.status).toBe(400);
      expect(none.body.code).toBe("VALIDATION_FAILED");
      const text = await t.http.post("/v1/auth/login").set("Content-Type", "text/plain").send("email=a@b.co");
      expect(text.status).toBe(400);
    });

    it("JSON dizisi ya da ilkel değer gövde olarak reddedilir", async () => {
      for (const raw of ["[]", '"metin"', "123", "null"]) {
        const res = await t.http.post("/v1/auth/login").set("Content-Type", "application/json").send(raw);
        expect(res.status, raw).toBe(400);
      }
    });

    it("100 kb üstü gövde 413 PAYLOAD_TOO_LARGE", async () => {
      const res = await t.http
        .post("/v1/auth/login")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ email: "a@b.co", password: "x", pad: "y".repeat(120 * 1024) }));
      expect(res.status).toBe(413);
      expect(res.body).toEqual({ statusCode: 413, code: "PAYLOAD_TOO_LARGE", message: "İstek gövdesi çok büyük." });
    });

    it("100 kb altı ama sınıra yakın gövde ayrıştırılır (sonra doğrulamada düşer)", async () => {
      const res = await t.http
        .post("/v1/auth/login")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ email: "a@b.co", password: "x", pad: "y".repeat(90 * 1024) }));
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("VALIDATION_FAILED");
    });
  });

  describe("kimliksiz girdide 500 üretmeyen sağlamlık", () => {
    const postJson = (path: string, raw: string) => t.http.post(path).set("Content-Type", "application/json").send(raw);
    const nested = (depth: number, open = "[", close = "]") => open.repeat(depth) + close.repeat(depth);

    it("tek başına vekil (lone surrogate) içeren e-posta kayıt ve girişte 400 VALIDATION_FAILED", async () => {
      for (const email of ["a\\ud800b@example.com", "\\ud800", "a\\udc00@b.co", "\\udc00\\ud800@x.co", "ok@example.com\\ud83d"]) {
        const reg = await postJson("/v1/auth/register", `{"email":"${email}","password":"Parola-12345","displayName":"Test"}`);
        expect(reg.status, `kayıt ${email}`).toBe(400);
        expect(reg.body.code).toBe("VALIDATION_FAILED");
        expect(reg.body.details).toEqual([{ field: "email", code: "isWellFormed", message: "Geçersiz Unicode karakter içeriyor." }]);
        const login = await postJson("/v1/auth/login", `{"email":"${email}","password":"Parola-12345"}`);
        expect(login.status, `giriş ${email}`).toBe(400);
        expect(login.body.code).toBe("VALIDATION_FAILED");
      }
    });

    it("vekil karakter her alanda ve iç içe değerlerde de reddedilir; geçerli vekil çifti (emoji) kabul edilir", async () => {
      const inName = await postJson("/v1/auth/register", `{"email":"${uniqueEmail()}","password":"Parola-12345","displayName":"Ay\\ud800"}`);
      expect(inName.status).toBe(400);
      expect(inName.body.details[0]).toMatchObject({ field: "displayName", code: "isWellFormed" });
      const nestedKey = await postJson("/v1/auth/login", `{"email":"a@b.co","password":"x","a":{"b\\ud800":1}}`);
      expect(nestedKey.status).toBe(400);
      expect(nestedKey.body.details[0]).toMatchObject({ field: "a", code: "isWellFormed" });
      const pair = await postJson("/v1/auth/register", `{"email":"${uniqueEmail()}","password":"Parola-12345","displayName":"Mutlu \\ud83d\\ude00"}`);
      expect(pair.status).toBe(201);
      expect(pair.body.user.displayName).toBe("Mutlu 😀");
    });

    it("çok derin iç içe gövde 500 değil 400 VALIDATION_FAILED (100 kb altında bile)", async () => {
      for (const depth of [65, 1500, 5000, 8000]) {
        for (const raw of [
          `{"email":"a@b.co","password":"xxxxxxxx","x":${nested(depth)}}`,
          `{"email":"a@b.co","password":"xxxxxxxx","x":${nested(depth, '{"a":', "}").replace(/\{"a":\}/, "{}")}}`,
        ]) {
          const res = await postJson("/v1/auth/login", raw);
          expect(res.status, `derinlik ${depth}`).toBe(400);
          expect(res.body.code).toBe("VALIDATION_FAILED");
          expect(res.body.details).toEqual([{ field: "x", code: "maxDepth", message: "İç içe yapı çok derin." }]);
        }
      }
      // e-posta alanının kendisi derin dizi olsa da aynı
      const inEmail = await postJson("/v1/auth/login", `{"email":${nested(8000)},"password":"x"}`);
      expect(inEmail.status).toBe(400);
      for (const path of ["/v1/auth/register", "/v1/auth/refresh", "/v1/auth/logout"]) {
        expect((await postJson(path, `{"x":${nested(5000)}}`)).status, path).toBe(400);
      }
    });

    it("makul iç içe gövde etkilenmez: normal doğrulamaya (bilinmeyen alan) ulaşır", async () => {
      const res = await postJson("/v1/auth/login", `{"email":"a@b.co","password":"xxxxxxxx","x":${nested(20)}}`);
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual([expect.objectContaining({ field: "x", code: "whitelistValidation" })]);
    });

    it("çok sayıda bilinmeyen alan: ucuz ve küçük bir 400 yanıtı (yanıt gövdeyi büyütmez)", async () => {
      const body = JSON.stringify(Object.fromEntries(Array.from({ length: 9500 }, (_, i) => [`k${i}`, 1])));
      expect(body.length).toBeGreaterThan(90_000);
      const res = await postJson("/v1/auth/login", body);
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("VALIDATION_FAILED");
      expect(JSON.stringify(res.body).length).toBeLessThan(2_000);
    });

    it("doğrulama ayrıntıları en fazla 50 kayıt döner", async () => {
      const body = JSON.stringify(Object.fromEntries(Array.from({ length: 300 }, (_, i) => [`k${i}`, 1])));
      const res = await postJson("/v1/auth/login", body);
      expect(res.status).toBe(400);
      expect(res.body.details).toHaveLength(50);
      expect(JSON.stringify(res.body).length).toBeLessThan(10_000);
    });

    it("URL'de %00 (yol ya da sorgu) 400; %2500 ve normal yüzde kodları geçer", async () => {
      for (const url of ["/v1/health?x=%00", "/v1/yok%00", "/v1/%00/health"]) {
        const res = await t.http.get(url);
        expect(res.status, url).toBe(400);
        expectErrorShape(res.body, 400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
      expect((await t.http.get("/v1/health?x=%2500")).status).toBe(200);
      expect((await t.http.get("/v1/health")).status).toBe(200);
    });
  });

  describe("hata gövdesi biçimi", () => {
    it("bilinmeyen yol 404, tutarlı gövde, istek yankılanmaz", async () => {
      const res = await t.http.get("/v1/yok/<script>alert(1)</script>");
      expect(res.status).toBe(404);
      expectErrorShape(res.body, 404);
      expect(res.body.code).toBe("NOT_FOUND");
      expect(JSON.stringify(res.body)).not.toContain("script");
    });

    it("desteklenmeyen yöntem de aynı biçimde", async () => {
      const res = await t.http.put("/v1/auth/login").send({});
      expect(res.status).toBe(404);
      expectErrorShape(res.body, 404);
    });

    it("yönetici ucuna anonim ve user erişimi aynı biçimde 401/403", async () => {
      const u = await registerUser(t.http);
      const anon = await t.http.get("/v1/users");
      const asUser = await t.http.get("/v1/users").set(bearer(u.accessToken));
      expectErrorShape(anon.body, 401);
      expectErrorShape(asUser.body, 403);
    });

    it("beklenmeyen hata geliştirmede bile iç ayrıntı sızdırmaz (ayrıntı yalnız sunucu günlüğünde)", async () => {
      const res = await t.http.get("/v1/_probe/boom");
      expect(res.status).toBe(500);
      expectErrorShape(res.body, 500);
      expect(res.body).toEqual({
        statusCode: 500,
        code: "INTERNAL_ERROR",
        message: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      });
      expect(JSON.stringify(res.body)).not.toMatch(/hunter2|veritabani/);
    });

    it("yanıt başlıklarında teknoloji bilgisi sızmaz", async () => {
      const res = await t.http.get("/v1/health");
      expect(res.headers["x-powered-by"]).toBeUndefined();
      expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });
  });

  describe("yönetici sorgularında yol parametresi doğrulaması", () => {
    it("UUID olmayan kimlik 400 VALIDATION_FAILED (veritabanı hatası/500 değil)", async () => {
      const admin = await createAdmin(t);
      const res = await t.http.get("/v1/users/not-a-uuid").set(bearer(admin.accessToken));
      expect(res.status).toBe(400);
      expectErrorShape(res.body, 400);
      expect(res.body.details).toEqual([{ field: "id", code: "isUUID", message: "Geçerli bir kimlik olmalı." }]);
    });
  });
});

describe("üretim modunda hata maskeleme", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp({ extraModules: [ProbeModule], config: { nodeEnv: "production", isProduction: true } });
  });
  afterAll(() => t.close());

  it("beklenmeyen hata iç ayrıntı, mesaj ve yığın sızdırmaz", async () => {
    const res = await t.http.get("/v1/_probe/boom");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      statusCode: 500,
      code: "INTERNAL_ERROR",
      message: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
    });
    expect(JSON.stringify(res.body)).not.toMatch(/hunter2|veritabani|stack|Error/);
  });

  it("doğrulama ve yetki hataları üretimde de aynı biçimde çalışır", async () => {
    const res = await t.http.post("/v1/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_FAILED");
    expect((await t.http.get("/v1/users")).body.code).toBe("AUTH_REQUIRED");
  });
});
