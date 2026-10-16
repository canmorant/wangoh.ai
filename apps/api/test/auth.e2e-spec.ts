import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { refreshTokens, users } from "../src/db/schema/index.js";
import {
  bearer,
  createTestApp,
  DEFAULT_TEST_PASSWORD,
  decodeJwt,
  expireRefreshToken,
  loginUser,
  registerUser,
  signAccessToken,
  type TestApp,
  uniqueEmail,
  unsignedToken,
} from "./helpers/index.js";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

describe("kimlik akışı", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  describe("kayıt", () => {
    it("201, her zaman user rolü, belirteç çifti ve hassas alan yok", async () => {
      const email = uniqueEmail();
      const res = await t.http.post("/v1/auth/register").send({ email, password: DEFAULT_TEST_PASSWORD, displayName: "Ayşe" });
      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({ email, displayName: "Ayşe", role: "user", disabled: false });
      expect(res.body.expiresIn).toBe(900);
      expect(typeof res.body.accessToken).toBe("string");
      expect(res.body.refreshToken).toHaveLength(43);

      const json = JSON.stringify(res.body);
      for (const forbidden of ["passwordHash", "password_hash", "tokenHash", "token_hash", "tokenVersion", "scrypt$"]) {
        expect(json).not.toContain(forbidden);
      }
      expect(Object.keys(res.body.user).sort()).toEqual(["createdAt", "disabled", "displayName", "email", "id", "role", "updatedAt"]);
    });

    it("parola ve yenileme belirteci veritabanında yalnız özet olarak durur", async () => {
      const s = await registerUser(t.http);
      const [row] = await t.db.select().from(users).where(eq(users.id, s.user.id));
      expect(row!.passwordHash.startsWith("scrypt$")).toBe(true);
      expect(row!.passwordHash).not.toContain(s.password);

      const stored = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
      expect(stored).toHaveLength(1);
      expect(stored[0]!.tokenHash).toBe(sha256(s.refreshToken));
      expect(JSON.stringify(stored)).not.toContain(s.refreshToken);
    });

    it("erişim belirteci doğru talepleri taşır (sub, iss, aud, 15 dk) ve rol içermez", async () => {
      const s = await registerUser(t.http);
      const claims = decodeJwt(s.accessToken);
      expect(claims.sub).toBe(s.user.id);
      expect(claims.iss).toBe("wangoh-api");
      expect(claims.aud).toBe("wangoh-app");
      expect((claims.exp as number) - (claims.iat as number)).toBe(900);
      expect(claims).not.toHaveProperty("role");
      expect(claims).not.toHaveProperty("email");
    });

    it("rol yükseltme girişimi reddedilir (bilinmeyen alan)", async () => {
      const res = await t.http.post("/v1/auth/register").send({ email: uniqueEmail(), password: DEFAULT_TEST_PASSWORD, displayName: "Kötü", role: "admin" });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("VALIDATION_FAILED");
      expect(res.body.details).toContainEqual({ field: "role", code: "whitelistValidation", message: "Bu alana izin verilmiyor." });
    });

    it("e-posta kırpılır, küçük harfe çevrilir; büyük/küçük harf tekrarı 409", async () => {
      const base = uniqueEmail("buyuk");
      const first = await t.http.post("/v1/auth/register").send({ email: `  ${base.toUpperCase()} `, password: DEFAULT_TEST_PASSWORD, displayName: "Birinci" });
      expect(first.status).toBe(201);
      expect(first.body.user.email).toBe(base);

      const dup = await t.http.post("/v1/auth/register").send({ email: base, password: DEFAULT_TEST_PASSWORD, displayName: "İkinci" });
      expect(dup.status).toBe(409);
      expect(dup.body).toEqual({ statusCode: 409, code: "AUTH_EMAIL_TAKEN", message: "Bu e-posta adresi zaten kayıtlı." });

      const mixed = base.replace(/^./, (c) => c.toUpperCase());
      const dup2 = await t.http.post("/v1/auth/register").send({ email: mixed, password: DEFAULT_TEST_PASSWORD, displayName: "Üçüncü" });
      expect(dup2.status).toBe(409);
    });

    it("veritabanı düzeyinde de lower(email) benzersiz (kayıt yarışı)", async () => {
      const email = uniqueEmail("yaris");
      const results = await Promise.all(
        [0, 1, 2, 3].map(() => t.http.post("/v1/auth/register").send({ email, password: DEFAULT_TEST_PASSWORD, displayName: "Yarış" })),
      );
      const statuses = results.map((r) => r.status).sort();
      expect(statuses).toEqual([201, 409, 409, 409]);
      for (const r of results.filter((x) => x.status === 409)) expect(r.body.code).toBe("AUTH_EMAIL_TAKEN");
      const rows = await t.db.select().from(users).where(eq(users.email, email));
      expect(rows).toHaveLength(1);
    });
  });

  describe("giriş", () => {
    it("doğru bilgilerle 200 ve yeni oturum", async () => {
      const s = await registerUser(t.http);
      const res = await t.http.post("/v1/auth/login").send({ email: s.email.toUpperCase(), password: s.password });
      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(s.user.id);
      expect(res.body.refreshToken).not.toBe(s.refreshToken);
    });

    it("hatalı parola ile bilinmeyen e-posta aynı yanıtı verir (varlık sızmaz)", async () => {
      const s = await registerUser(t.http);
      const wrong = await t.http.post("/v1/auth/login").send({ email: s.email, password: "yanlis-parola-1" });
      const unknown = await t.http.post("/v1/auth/login").send({ email: uniqueEmail("yok"), password: "yanlis-parola-1" });
      expect(wrong.status).toBe(401);
      expect(unknown.status).toBe(401);
      expect(wrong.body).toEqual(unknown.body);
      expect(wrong.body).toEqual({ statusCode: 401, code: "AUTH_INVALID_CREDENTIALS", message: "E-posta veya parola hatalı." });
      expect(wrong.headers["www-authenticate"]).toContain("Bearer");
    });

    it("devre dışı hesap doğru parolayla 403, yanlış parolayla 401 alır", async () => {
      const s = await registerUser(t.http);
      await t.db.update(users).set({ disabled: true }).where(eq(users.id, s.user.id));
      const ok = await t.http.post("/v1/auth/login").send({ email: s.email, password: s.password });
      expect(ok.status).toBe(403);
      expect(ok.body.code).toBe("AUTH_ACCOUNT_DISABLED");
      const bad = await t.http.post("/v1/auth/login").send({ email: s.email, password: "yanlis-parola-1" });
      expect(bad.status).toBe(401);
      expect(bad.body.code).toBe("AUTH_INVALID_CREDENTIALS");
    });
  });

  describe("yenileme (rotation) ve yeniden kullanım tespiti", () => {
    it("her yenileme yeni çift verir; eski belirteç tekrar kullanılamaz", async () => {
      const s = await registerUser(t.http);
      const r1 = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      expect(r1.status).toBe(200);
      expect(r1.body.refreshToken).not.toBe(s.refreshToken);
      expect(r1.body.accessToken).not.toBe(s.accessToken);
      expect(r1.body.user.id).toBe(s.user.id);

      const r2 = await t.http.post("/v1/auth/refresh").send({ refreshToken: r1.body.refreshToken });
      expect(r2.status).toBe(200);

      const replay = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      expect(replay.status).toBe(401);
      expect(replay.body.code).toBe("AUTH_TOKEN_INVALID");
    });

    it("eski belirteçle yeniden kullanım tüm aileyi iptal eder (güncel belirteç dahil)", async () => {
      const s = await registerUser(t.http);
      const r1 = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      const latest = r1.body.refreshToken as string;

      // Saldırgan/çoğaltılmış istemci eski belirteci oynatır.
      const replay = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      expect(replay.status).toBe(401);

      // Meşru kullanıcının güncel belirteci de artık geçersiz.
      const afterwards = await t.http.post("/v1/auth/refresh").send({ refreshToken: latest });
      expect(afterwards.status).toBe(401);
      const family = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
      expect(family.length).toBeGreaterThanOrEqual(2);
      expect(family.every((row) => row.revokedAt !== null)).toBe(true);
    });

    it("aile iptali diğer oturumları (başka aileleri) etkilemez", async () => {
      const a = await registerUser(t.http);
      const b = await loginUser(t.http, a.email, a.password); // ikinci cihaz = ayrı aile
      const rotated = await t.http.post("/v1/auth/refresh").send({ refreshToken: a.refreshToken });
      expect(rotated.status).toBe(200);
      await t.http.post("/v1/auth/refresh").send({ refreshToken: a.refreshToken }).expect(401); // yeniden kullanım

      const other = await t.http.post("/v1/auth/refresh").send({ refreshToken: b.refreshToken });
      expect(other.status).toBe(200);
    });

    it("aynı belirteçle eşzamanlı iki yenileme: yalnız biri kazanır, aile iptal olur", async () => {
      const s = await registerUser(t.http);
      const [x, y] = await Promise.all([
        t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }),
        t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }),
      ]);
      const statuses = [x.status, y.status].sort();
      expect(statuses).toEqual([200, 401]);

      const winner = x.status === 200 ? x : y;
      // Kaybeden istek yeniden kullanım sayıldığından kazananın yeni belirteci de iptal.
      const follow = await t.http.post("/v1/auth/refresh").send({ refreshToken: winner.body.refreshToken });
      expect(follow.status).toBe(401);
    });

    it("birçok eşzamanlı yenilemede tam bir kazanan çıkar", async () => {
      const s = await registerUser(t.http);
      const results = await Promise.all(Array.from({ length: 6 }, () => t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken })));
      expect(results.filter((r) => r.status === 200)).toHaveLength(1);
      expect(results.filter((r) => r.status === 401)).toHaveLength(5);
    });

    it("süresi dolmuş, bilinmeyen ve bozuk belirteç 401 AUTH_TOKEN_INVALID", async () => {
      const s = await registerUser(t.http);
      await expireRefreshToken(t, s.refreshToken);
      for (const token of [s.refreshToken, "A".repeat(43), "kisa-ama-yeterince-uzun-degil"]) {
        const res = await t.http.post("/v1/auth/refresh").send({ refreshToken: token });
        expect(res.status).toBe(401);
        expect(res.body.code).toBe("AUTH_TOKEN_INVALID");
      }
    });

    it("devre dışı bırakılmış kullanıcının belirteci yenilenemez", async () => {
      const s = await registerUser(t.http);
      await t.db.update(users).set({ disabled: true }).where(eq(users.id, s.user.id));
      const res = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      expect(res.status).toBe(401);
      expect(res.body.code).toBe("AUTH_ACCOUNT_DISABLED");
    });

    it("parola değişimiyle yarışıp geç kalan belirteç (eski token_version) reddedilir ve aile kapanır", async () => {
      const s = await registerUser(t.http);
      // Parola değişiminin araya girdiğini taklit et: kullanıcı sürümü belirteç verildikten sonra arttı.
      await t.db.update(users).set({ tokenVersion: 1 }).where(eq(users.id, s.user.id));
      const res = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      expect(res.status).toBe(401);
      expect(res.body.code).toBe("AUTH_TOKEN_INVALID");
      const rows = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
      expect(rows.every((r) => r.revokedAt !== null)).toBe(true);
    });

    it("yenileme, kullanıcının süresi dolmuş belirteç satırlarını temizler", async () => {
      const s = await registerUser(t.http);
      const r1 = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      await expireRefreshToken(t, s.refreshToken); // ilk (kullanılmış) satır süresi dolmuş sayılır
      const before = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
      expect(before).toHaveLength(2);
      const r2 = await t.http.post("/v1/auth/refresh").send({ refreshToken: r1.body.refreshToken });
      expect(r2.status).toBe(200);
      const after = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
      expect(after).toHaveLength(2); // süresi dolan silindi, yeni eklendi
      expect(after.every((r) => r.expiresAt.getTime() > Date.now())).toBe(true);
    });

    it("yenileme sonrası verilen belirteçler yeni aileyi değil aynı aileyi sürdürür", async () => {
      const s = await registerUser(t.http);
      const r1 = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      const rows = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
      expect(new Set(rows.map((r) => r.familyId)).size).toBe(1);
      expect(rows).toHaveLength(2);
      expect(r1.status).toBe(200);
    });
  });

  describe("çıkış", () => {
    it("204; belirteç ailesi iptal olur; tekrar çıkış ve bilinmeyen belirteç de 204", async () => {
      const s = await registerUser(t.http);
      const rotated = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken });
      const current = rotated.body.refreshToken as string;

      await t.http.post("/v1/auth/logout").send({ refreshToken: current }).expect(204);
      await t.http.post("/v1/auth/refresh").send({ refreshToken: current }).expect(401);
      await t.http.post("/v1/auth/logout").send({ refreshToken: current }).expect(204);
      await t.http.post("/v1/auth/logout").send({ refreshToken: "B".repeat(43) }).expect(204);
    });

    it("yalnız ilgili oturumu kapatır; diğer cihaz sürer", async () => {
      const a = await registerUser(t.http);
      const b = await loginUser(t.http, a.email, a.password);
      await t.http.post("/v1/auth/logout").send({ refreshToken: a.refreshToken }).expect(204);
      await t.http.post("/v1/auth/refresh").send({ refreshToken: b.refreshToken }).expect(200);
    });
  });

  describe("erişim belirteci doğrulaması (GET /v1/auth/me)", () => {
    it("geçerli belirteçle kullanıcıyı döner", async () => {
      const s = await registerUser(t.http);
      const res = await t.http.get("/v1/auth/me").set(bearer(s.accessToken));
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: s.user.id, email: s.email, role: "user" });
    });

    it("belirteç yoksa 401 AUTH_REQUIRED", async () => {
      const res = await t.http.get("/v1/auth/me");
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ statusCode: 401, code: "AUTH_REQUIRED", message: "Bu işlem için giriş yapmalısınız." });
      expect(res.headers["www-authenticate"]).toContain("Bearer");
    });

    it("bozuk/yanlış biçimli başlıklar 401 AUTH_TOKEN_INVALID", async () => {
      for (const header of ["Bearer", "Bearer ", "Bearer a.b.c", "Basic abc", "abc", "Bearer a b"]) {
        const res = await t.http.get("/v1/auth/me").set("Authorization", header);
        expect(res.status, header).toBe(401);
        expect(res.body.code, header).toBe("AUTH_TOKEN_INVALID");
      }
    });

    it("süresi dolmuş, yanlış sır/iss/aud/algoritma, imzasız ve eski sürüm belirteçleri reddedilir", async () => {
      const s = await registerUser(t.http);
      const bad: Record<string, string> = {
        suresiDolmus: await signAccessToken(t, s.user.id, { expiresIn: -60 }),
        yanlisSir: await signAccessToken(t, s.user.id, { secret: "baska-bir-sir-baska-bir-sir-baska-bir-sir-123" }),
        yanlisIss: await signAccessToken(t, s.user.id, { issuer: "baskasi" }),
        yanlisAud: await signAccessToken(t, s.user.id, { audience: "baskasi" }),
        yanlisAlg: await signAccessToken(t, s.user.id, { algorithm: "HS512" }),
        eskiSurum: await signAccessToken(t, s.user.id, { ver: 99 }),
        imzasiz: unsignedToken(s.user.id),
      };
      for (const [name, token] of Object.entries(bad)) {
        const res = await t.http.get("/v1/auth/me").set(bearer(token));
        expect(res.status, name).toBe(401);
        expect(res.body.code, name).toBe("AUTH_TOKEN_INVALID");
      }
      // Kontrol: aynı yöntemle imzalanmış geçerli belirteç kabul edilir.
      const good = await signAccessToken(t, s.user.id);
      await t.http.get("/v1/auth/me").set(bearer(good)).expect(200);
    });

    it("var olmayan kullanıcı için imzalı belirteç reddedilir", async () => {
      const token = await signAccessToken(t, "00000000-0000-4000-8000-000000000000", { ver: 0 });
      const res = await t.http.get("/v1/auth/me").set(bearer(token));
      expect(res.status).toBe(401);
    });

    it("sub UUID değilse veritabanına gitmeden 401 (500 değil)", async () => {
      const token = await signAccessToken(t, "' or 1=1 --", { ver: 0 });
      const res = await t.http.get("/v1/auth/me").set(bearer(token));
      expect(res.status).toBe(401);
    });
  });

  describe("parola değişimi", () => {
    it("yanlış mevcut parola 403 (401 değil: istemci çıkış yapmasın)", async () => {
      const s = await registerUser(t.http);
      const res = await t.http.post("/v1/users/me/password").set(bearer(s.accessToken)).send({ currentPassword: "yanlis-parola-1", newPassword: "YeniParola-123" });
      expect(res.status).toBe(403);
      expect(res.body.code).toBe("AUTH_INVALID_CREDENTIALS");
      await t.http.get("/v1/auth/me").set(bearer(s.accessToken)).expect(200);
    });

    it("tüm belirteçleri (erişim + tüm yenileme aileleri) iptal eder, yeni parola çalışır", async () => {
      const s = await registerUser(t.http);
      const other = await loginUser(t.http, s.email, s.password);

      await t.http.post("/v1/users/me/password").set(bearer(s.accessToken)).send({ currentPassword: s.password, newPassword: "YeniParola-123" }).expect(204);

      // Eski erişim belirteçleri 15 dk beklemeden anında düşer.
      await t.http.get("/v1/auth/me").set(bearer(s.accessToken)).expect(401);
      await t.http.get("/v1/auth/me").set(bearer(other.accessToken)).expect(401);
      // Tüm yenileme belirteçleri iptal.
      await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).expect(401);
      await t.http.post("/v1/auth/refresh").send({ refreshToken: other.refreshToken }).expect(401);

      await t.http.post("/v1/auth/login").send({ email: s.email, password: s.password }).expect(401);
      const fresh = await t.http.post("/v1/auth/login").send({ email: s.email, password: "YeniParola-123" });
      expect(fresh.status).toBe(200);
      await t.http.get("/v1/auth/me").set(bearer(fresh.body.accessToken)).expect(200);
    });

    it("zayıf yeni parola 400, oturum bozulmaz", async () => {
      const s = await registerUser(t.http);
      const res = await t.http.post("/v1/users/me/password").set(bearer(s.accessToken)).send({ currentPassword: s.password, newPassword: "kisa" });
      expect(res.status).toBe(400);
      expect(res.body.details).toContainEqual(expect.objectContaining({ field: "newPassword", code: "minLength" }));
      await t.http.get("/v1/auth/me").set(bearer(s.accessToken)).expect(200);
    });

    it("eşzamanlı iki parola değişimi: biri kazanır, diğeri 409/403 alır; son durum tutarlı", async () => {
      const s = await registerUser(t.http);
      const [a, b] = await Promise.all([
        t.http.post("/v1/users/me/password").set(bearer(s.accessToken)).send({ currentPassword: s.password, newPassword: "ParolaBir-1234" }),
        t.http.post("/v1/users/me/password").set(bearer(s.accessToken)).send({ currentPassword: s.password, newPassword: "ParolaIki-1234" }),
      ]);
      expect([a.status, b.status].filter((x) => x === 204)).toHaveLength(1);
      expect([a.status, b.status].filter((x) => x === 409 || x === 403 || x === 401)).toHaveLength(1);
      const winnerPassword = a.status === 204 ? "ParolaBir-1234" : "ParolaIki-1234";
      await t.http.post("/v1/auth/login").send({ email: s.email, password: winnerPassword }).expect(200);
    });
  });

  describe("hesap silme", () => {
    it("yanlış parola 403; doğru parola 204 ve her şey gider", async () => {
      const s = await registerUser(t.http);
      const wrong = await t.http.delete("/v1/users/me").set(bearer(s.accessToken)).send({ password: "yanlis-parola-1" });
      expect(wrong.status).toBe(403);
      await t.http.get("/v1/auth/me").set(bearer(s.accessToken)).expect(200);

      await t.http.delete("/v1/users/me").set(bearer(s.accessToken)).send({ password: s.password }).expect(204);

      await t.http.get("/v1/auth/me").set(bearer(s.accessToken)).expect(401);
      await t.http.post("/v1/auth/login").send({ email: s.email, password: s.password }).expect(401);
      await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).expect(401);
      expect(await t.db.select().from(users).where(eq(users.id, s.user.id))).toHaveLength(0);
      expect(await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id))).toHaveLength(0);

      // E-posta serbest kalır.
      await t.http.post("/v1/auth/register").send({ email: s.email, password: DEFAULT_TEST_PASSWORD, displayName: "Yeniden" }).expect(201);
    });

    it("parola gövdesi olmadan 400", async () => {
      const s = await registerUser(t.http);
      const res = await t.http.delete("/v1/users/me").set(bearer(s.accessToken));
      expect(res.status).toBe(400);
      expect(res.body.code).toBe("VALIDATION_FAILED");
    });
  });
});
