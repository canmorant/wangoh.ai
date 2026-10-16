import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { refreshTokens, users } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, findUserRow, loginUser, registerUser, type TestApp } from "./helpers/index.js";
import { ProbeModule } from "./helpers/probe.js";

describe("yetkilendirme (RBAC)", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp({ extraModules: [ProbeModule] });
  });
  afterAll(() => t.close());

  describe("koruma dekoratörleri", () => {
    it("varsayılan kapalı kapı: @Public olmayan uç anonimi 401 ile reddeder", async () => {
      const res = await t.http.get("/v1/_probe/default");
      expect(res.status).toBe(401);
      expect(res.body.code).toBe("AUTH_REQUIRED");
      const u = await registerUser(t.http);
      const ok = await t.http.get("/v1/_probe/default").set(bearer(u.accessToken));
      expect(ok.status).toBe(200);
      expect(ok.body.id).toBe(u.user.id);
    });

    it("@Public: anonim 200; belirteç hiç okunmaz (bozuk belirteç bile sorun olmaz, kullanıcı dolmaz)", async () => {
      const u = await registerUser(t.http);
      expect((await t.http.get("/v1/_probe/public")).body.id).toBeNull();
      const withToken = await t.http.get("/v1/_probe/public").set(bearer(u.accessToken));
      expect(withToken.status).toBe(200);
      expect(withToken.body.id).toBeNull();
      await t.http.get("/v1/_probe/public").set("Authorization", "Bearer bozuk").expect(200);
    });

    it("@OptionalAuth: belirteç yoksa anonim, geçerliyse kullanıcı, bozuk/süresi dolmuşsa 401", async () => {
      const u = await registerUser(t.http);
      const admin = await createAdmin(t);
      expect((await t.http.get("/v1/_probe/optional")).body).toEqual({ id: null, role: null });
      expect((await t.http.get("/v1/_probe/optional").set(bearer(u.accessToken))).body).toEqual({ id: u.user.id, role: "user" });
      expect((await t.http.get("/v1/_probe/optional").set(bearer(admin.accessToken))).body.role).toBe("admin");
      const bad = await t.http.get("/v1/_probe/optional").set("Authorization", "Bearer bozuk");
      expect(bad.status).toBe(401);
      expect(bad.body.code).toBe("AUTH_TOKEN_INVALID");
    });

    it("@Roles: anonim 401, user 403, admin 200", async () => {
      const u = await registerUser(t.http);
      const admin = await createAdmin(t);
      expect((await t.http.get("/v1/_probe/admin")).status).toBe(401);
      const forbidden = await t.http.get("/v1/_probe/admin").set(bearer(u.accessToken));
      expect(forbidden.status).toBe(403);
      expect(forbidden.body).toEqual({ statusCode: 403, code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok." });
      expect((await t.http.get("/v1/_probe/admin").set(bearer(admin.accessToken))).status).toBe(200);
    });

    it("@Public ile @Roles birlikte (yanlış yapılandırma) güvenli tarafta kalır: herkese 403", async () => {
      const admin = await createAdmin(t);
      expect((await t.http.get("/v1/_probe/public-admin")).status).toBe(403);
      expect((await t.http.get("/v1/_probe/public-admin").set(bearer(admin.accessToken))).status).toBe(403);
    });
  });

  describe("yönetici uç noktaları", () => {
    it("anonim 401, user 403, admin 200", async () => {
      const u = await registerUser(t.http);
      const admin = await createAdmin(t);
      const id = u.user.id;
      const routes: Array<[string, string, object?]> = [
        ["get", "/v1/users"],
        ["get", `/v1/users/${id}`],
        ["patch", `/v1/users/${id}`, { displayName: "Yeni Ad" }],
        ["delete", `/v1/users/${admin.user.id}`],
      ];
      for (const [method, url, body] of routes) {
        const anon = await (t.http as any)[method](url).send(body);
        expect(anon.status, `anonim ${method} ${url}`).toBe(401);
        const asUser = await (t.http as any)[method](url).set(bearer(u.accessToken)).send(body);
        expect(asUser.status, `user ${method} ${url}`).toBe(403);
        expect(asUser.body.code).toBe("FORBIDDEN");
      }
      // Reddedilen istekler hiçbir şeyi değiştirmedi.
      expect((await findUserRow(t, id))!.displayName).toBe("Test Kullanıcı");
      expect(await findUserRow(t, admin.user.id)).toBeDefined();

      expect((await t.http.get("/v1/users").set(bearer(admin.accessToken))).status).toBe(200);
      expect((await t.http.get(`/v1/users/${id}`).set(bearer(admin.accessToken))).status).toBe(200);
      expect((await t.http.patch(`/v1/users/${id}`).set(bearer(admin.accessToken)).send({ displayName: "Yeni Ad" })).status).toBe(200);
    });

    it("kullanıcı kendi kimliğiyle bile yönetici ucuna erişemez; /users/me yönetici ucuna düşmez", async () => {
      const u = await registerUser(t.http);
      expect((await t.http.get(`/v1/users/${u.user.id}`).set(bearer(u.accessToken))).status).toBe(403);
      expect((await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(u.accessToken)).send({ role: "admin" })).status).toBe(403);
      const me = await t.http.patch("/v1/users/me").set(bearer(u.accessToken)).send({ displayName: "Yeni Ad" });
      expect(me.status).toBe(200);
      expect(me.body.displayName).toBe("Yeni Ad");
    });

    it("rol yükseltme girişimleri: PATCH /users/me ve kayıt rol alanını reddeder", async () => {
      const u = await registerUser(t.http);
      for (const body of [{ role: "admin" }, { displayName: "Ad Soyad", role: "admin" }, { displayName: "Ad Soyad", disabled: false }, { isAdmin: true, displayName: "Ad Soyad" }]) {
        const res = await t.http.patch("/v1/users/me").set(bearer(u.accessToken)).send(body);
        expect(res.status, JSON.stringify(body)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
      expect((await findUserRow(t, u.user.id))!.role).toBe("user");
    });

    it("rol değişikliği veritabanından okunduğu için mevcut belirteçte anında geçerli olur", async () => {
      const u = await registerUser(t.http);
      const admin = await createAdmin(t);
      await t.http.get("/v1/users").set(bearer(u.accessToken)).expect(403);

      const promote = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ role: "admin" });
      expect(promote.status).toBe(200);
      expect(promote.body.role).toBe("admin");
      // Aynı (eski) erişim belirteci artık admin yetkisiyle çalışır.
      await t.http.get("/v1/users").set(bearer(u.accessToken)).expect(200);

      await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ role: "user" }).expect(200);
      // Düşürme de anında etkili.
      await t.http.get("/v1/users").set(bearer(u.accessToken)).expect(403);
    });

    it("admin olmayan ayarlanan geçersiz rol değeri 400", async () => {
      const admin = await createAdmin(t);
      const u = await registerUser(t.http);
      const res = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ role: "superadmin" });
      expect(res.status).toBe(400);
      const extra = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ passwordHash: "x", email: "a@b.co" });
      expect(extra.status).toBe(400);
    });
  });

  describe("devre dışı kullanıcı", () => {
    it("mevcut erişim belirteci anında reddedilir, yenileme ve giriş kapanır; yeniden etkinleştirince yeni giriş çalışır", async () => {
      const u = await registerUser(t.http);
      const admin = await createAdmin(t);
      await t.http.get("/v1/auth/me").set(bearer(u.accessToken)).expect(200);

      const disable = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true });
      expect(disable.status).toBe(200);
      expect(disable.body.disabled).toBe(true);

      const me = await t.http.get("/v1/auth/me").set(bearer(u.accessToken));
      expect(me.status).toBe(401);
      expect(me.body.code).toBe("AUTH_ACCOUNT_DISABLED");
      expect((await t.http.post("/v1/auth/refresh").send({ refreshToken: u.refreshToken })).status).toBe(401);
      expect((await t.http.post("/v1/auth/login").send({ email: u.email, password: u.password })).status).toBe(403);
      const live = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, u.user.id));
      expect(live.every((r) => r.revokedAt !== null)).toBe(true);

      await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ disabled: false }).expect(200);
      // Devre dışı bırakırken `ver` arttığı için eski erişim belirteci geri gelmez.
      expect((await t.http.get("/v1/auth/me").set(bearer(u.accessToken))).status).toBe(401);
      const again = await loginUser(t.http, u.email, u.password);
      await t.http.get("/v1/auth/me").set(bearer(again.accessToken)).expect(200);
    });

    it("devre dışı admin yönetici ucuna erişemez", async () => {
      const a = await createAdmin(t);
      const b = await createAdmin(t);
      await t.http.patch(`/v1/users/${a.user.id}`).set(bearer(b.accessToken)).send({ disabled: true }).expect(200);
      expect((await t.http.get("/v1/users").set(bearer(a.accessToken))).status).toBe(401);
    });
  });
});

describe("son admin koruması", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  it("tek aktif admin düşürülemez, devre dışı bırakılamaz, silinemez", async () => {
    const admin = await createAdmin(t);
    const demote = await t.http.patch(`/v1/users/${admin.user.id}`).set(bearer(admin.accessToken)).send({ role: "user" });
    expect(demote.status).toBe(409);
    expect(demote.body.code).toBe("LAST_ADMIN");
    expect((await t.http.patch(`/v1/users/${admin.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true })).body.code).toBe("LAST_ADMIN");
    expect((await t.http.delete(`/v1/users/${admin.user.id}`).set(bearer(admin.accessToken))).body.code).toBe("LAST_ADMIN");
    const self = await t.http.delete("/v1/users/me").set(bearer(admin.accessToken)).send({ password: admin.password });
    expect(self.status).toBe(409);
    expect(self.body.code).toBe("LAST_ADMIN");

    const row = await findUserRow(t, admin.user.id);
    expect(row).toMatchObject({ role: "admin", disabled: false });
    // Görünen ad değişikliği serbest.
    await t.http.patch(`/v1/users/${admin.user.id}`).set(bearer(admin.accessToken)).send({ displayName: "Baş Yönetici" }).expect(200);
    // Adminin kendi rolünü "admin" olarak yeniden göndermesi zararsız.
    await t.http.patch(`/v1/users/${admin.user.id}`).set(bearer(admin.accessToken)).send({ role: "admin" }).expect(200);
  });

  it("iki admin varken biri düşürülebilir; kalan son admin olur ve korunur", async () => {
    // Önceki testten kalan admin de dahil aktif adminleri say.
    const first = await createAdmin(t);
    const second = await createAdmin(t);
    const all = await t.db.select().from(users).where(eq(users.role, "admin"));
    // Fazlalığı temizle: yalnız first ve second kalsın.
    for (const row of all.filter((r) => r.id !== first.user.id && r.id !== second.user.id)) {
      await t.db.delete(users).where(eq(users.id, row.id));
    }
    await t.http.patch(`/v1/users/${second.user.id}`).set(bearer(first.accessToken)).send({ role: "user" }).expect(200);
    const blocked = await t.http.patch(`/v1/users/${first.user.id}`).set(bearer(first.accessToken)).send({ role: "user" });
    expect(blocked.status).toBe(409);
    expect(blocked.body.code).toBe("LAST_ADMIN");
  });

  it("devre dışı bir admin silinebilir (aktif admin sayısını düşürmez)", async () => {
    const a = await createAdmin(t);
    const b = await createAdmin(t);
    await t.http.patch(`/v1/users/${b.user.id}`).set(bearer(a.accessToken)).send({ disabled: true }).expect(200);
    await t.http.delete(`/v1/users/${b.user.id}`).set(bearer(a.accessToken)).expect(204);
  });

  it("eşzamanlı karşılıklı düşürme sistemi admin'siz bırakamaz", async () => {
    const a = await createAdmin(t);
    const b = await createAdmin(t);
    // Yalnız a ve b aktif admin kalsın.
    for (const row of await t.db.select().from(users).where(eq(users.role, "admin"))) {
      if (row.id !== a.user.id && row.id !== b.user.id) await t.db.delete(users).where(eq(users.id, row.id));
    }
    const [x, y] = await Promise.all([
      t.http.patch(`/v1/users/${b.user.id}`).set(bearer(a.accessToken)).send({ role: "user" }),
      t.http.patch(`/v1/users/${a.user.id}`).set(bearer(b.accessToken)).send({ role: "user" }),
    ]);
    const statuses = [x.status, y.status].sort();
    // Biri başarır; diğeri ya 409 (son admin) ya 401/403 (yetkisi az önce alındı) olur.
    expect(statuses[0]).toBe(200);
    expect([409, 401, 403]).toContain(statuses[1]);
    const activeAdmins = await t.db.select().from(users).where(eq(users.role, "admin"));
    expect(activeAdmins.filter((r) => !r.disabled).length).toBeGreaterThanOrEqual(1);
  });

  it("eşzamanlı karşılıklı silme de admin'siz bırakmaz", async () => {
    const a = await createAdmin(t);
    const b = await createAdmin(t);
    for (const row of await t.db.select().from(users).where(eq(users.role, "admin"))) {
      if (row.id !== a.user.id && row.id !== b.user.id) await t.db.delete(users).where(eq(users.id, row.id));
    }
    const results = await Promise.all([
      t.http.delete(`/v1/users/${b.user.id}`).set(bearer(a.accessToken)),
      t.http.delete(`/v1/users/${a.user.id}`).set(bearer(b.accessToken)),
    ]);
    expect(results.map((r) => r.status).sort()[0]).toBe(204);
    expect((await t.db.select().from(users).where(eq(users.role, "admin"))).length).toBeGreaterThanOrEqual(1);
  });
});
