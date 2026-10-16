import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";

describe("kullanıcı uç noktaları", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());

  describe("PATCH /v1/users/me", () => {
    it("görünen adı kırpıp günceller, updatedAt ilerler", async () => {
      const u = await registerUser(t.http);
      const res = await t.http.patch("/v1/users/me").set(bearer(u.accessToken)).send({ displayName: "  Yeni Ad  " });
      expect(res.status).toBe(200);
      expect(res.body.displayName).toBe("Yeni Ad");
      expect(new Date(res.body.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(u.user.updatedAt).getTime());
      expect((await t.http.get("/v1/auth/me").set(bearer(u.accessToken))).body.displayName).toBe("Yeni Ad");
    });

    it("anonim 401", async () => {
      expect((await t.http.patch("/v1/users/me").send({ displayName: "Ad Soyad" })).status).toBe(401);
    });
  });

  describe("GET /v1/users (yönetici listesi)", () => {
    const marker = `liste${Date.now().toString(36)}`;
    beforeAll(async () => {
      for (let i = 0; i < 5; i++) await registerUser(t.http, { email: `${marker}-${i}@example.test`, displayName: `Liste ${i}` });
      await registerUser(t.http, { email: `${marker}-a_b@example.test`, displayName: "Alt_Çizgi" });
      await registerUser(t.http, { email: `${marker}-axb@example.test`, displayName: "AxB Kullanıcı" });
      await registerUser(t.http, { email: `${marker}-yuzde@example.test`, displayName: "Yüzde%100" });
    });

    it("sayfalı zarf: { items, page, pageSize, total }; hassas alan yok", async () => {
      const res = await t.http.get("/v1/users").query({ q: marker, pageSize: 3 }).set(bearer(admin.accessToken));
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ page: 1, pageSize: 3, total: 8 });
      expect(res.body.items).toHaveLength(3);
      expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|password_hash|tokenHash|scrypt\$/);
      const page3 = await t.http.get("/v1/users").query({ q: marker, pageSize: 3, page: 3 }).set(bearer(admin.accessToken));
      expect(page3.body.items).toHaveLength(2);
      const beyond = await t.http.get("/v1/users").query({ q: marker, pageSize: 3, page: 9 }).set(bearer(admin.accessToken));
      expect(beyond.body).toMatchObject({ items: [], total: 8 });
    });

    it("varsayılan sayfa boyutu 20, en fazla 100", async () => {
      const def = await t.http.get("/v1/users").set(bearer(admin.accessToken));
      expect(def.body).toMatchObject({ page: 1, pageSize: 20 });
      const max = await t.http.get("/v1/users").query({ pageSize: 100 }).set(bearer(admin.accessToken));
      expect(max.status).toBe(200);
      const tooBig = await t.http.get("/v1/users").query({ pageSize: 101 }).set(bearer(admin.accessToken));
      expect(tooBig.status).toBe(400);
      expect(tooBig.body.code).toBe("VALIDATION_FAILED");
      for (const query of [{ page: 0 }, { page: -1 }, { page: "abc" }, { pageSize: 0 }, { pageSize: "1.5" }, { page: 100_001 }]) {
        expect((await t.http.get("/v1/users").query(query).set(bearer(admin.accessToken))).status, JSON.stringify(query)).toBe(400);
      }
    });

    it("q: e-posta ve görünen adda büyük/küçük harf duyarsız arama", async () => {
      const byEmail = await t.http.get("/v1/users").query({ q: marker.toUpperCase() }).set(bearer(admin.accessToken));
      expect(byEmail.body.total).toBe(8);
      const byName = await t.http.get("/v1/users").query({ q: "axb kullanıcı" }).set(bearer(admin.accessToken));
      expect(byName.body.total).toBe(1);
    });

    it("q: LIKE jokerleri (% _ \\) kaçırılır; literal olarak aranır", async () => {
      const underscore = await t.http.get("/v1/users").query({ q: `${marker}-a_b` }).set(bearer(admin.accessToken));
      expect(underscore.body.items.map((i: { email: string }) => i.email)).toEqual([`${marker}-a_b@example.test`]); // axb eşleşmez
      const percent = await t.http.get("/v1/users").query({ q: "%" }).set(bearer(admin.accessToken));
      expect(percent.body.items.map((i: { displayName: string }) => i.displayName)).toEqual(["Yüzde%100"]);
      const all = await t.http.get("/v1/users").query({ q: "%", pageSize: 100 }).set(bearer(admin.accessToken));
      expect(all.body.total).toBe(1); // "%" her şeyi eşlememeli
      const backslash = await t.http.get("/v1/users").query({ q: "\\" }).set(bearer(admin.accessToken));
      expect(backslash.status).toBe(200);
      expect(backslash.body.total).toBe(0);
      const lone = await t.http.get("/v1/users").query({ q: "_" }).set(bearer(admin.accessToken));
      expect(lone.body.items.every((i: { email: string; displayName: string }) => i.email.includes("_") || i.displayName.includes("_"))).toBe(true);
    });

    it("q: NUL baytı (%00) 500 değil 400 VALIDATION_FAILED döner; %2500 sıradan metindir", async () => {
      for (const url of ["/v1/users?q=a%00b", "/v1/users?q=%00", "/v1/users?role=%00", "/v1/users?q=%e0%80%00"]) {
        const res = await t.http.get(url).set(bearer(admin.accessToken));
        expect(res.status, url).toBe(400);
        expect(res.body.code, url).toBe("VALIDATION_FAILED");
      }
      const literal = await t.http.get("/v1/users?q=%2500").set(bearer(admin.accessToken));
      expect(literal.status).toBe(200);
      expect(literal.body.total).toBe(0);
    });

    it("role süzgeci ve geçersiz rol", async () => {
      const admins = await t.http.get("/v1/users").query({ role: "admin", pageSize: 100 }).set(bearer(admin.accessToken));
      expect(admins.body.items.length).toBeGreaterThanOrEqual(1);
      expect(admins.body.items.every((i: { role: string }) => i.role === "admin")).toBe(true);
      expect((await t.http.get("/v1/users").query({ role: "root" }).set(bearer(admin.accessToken))).status).toBe(400);
    });

    it("bilinmeyen sorgu parametresi 400", async () => {
      const res = await t.http.get("/v1/users").query({ foo: "bar" }).set(bearer(admin.accessToken));
      expect(res.status).toBe(400);
      expect(res.body.details).toContainEqual(expect.objectContaining({ field: "foo", code: "whitelistValidation" }));
    });

    it("en yeni kullanıcı önce gelir", async () => {
      const fresh = await registerUser(t.http, { email: `${marker}-son@example.test` });
      const res = await t.http.get("/v1/users").query({ pageSize: 5 }).set(bearer(admin.accessToken));
      expect(res.body.items[0].id).toBe(fresh.user.id);
    });
  });

  describe("PATCH /v1/users/:id: null değerler", () => {
    it("role/disabled/displayName için null 500 değil 400 VALIDATION_FAILED; satır değişmez", async () => {
      const u = await registerUser(t.http, { displayName: "Önce Ad" });
      for (const body of [{ role: null }, { disabled: null }, { displayName: null }, { role: null, disabled: null, displayName: null }]) {
        const res = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send(body);
        expect(res.status, JSON.stringify(body)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
        expect([...new Set(res.body.details.map((d: { field: string }) => d.field))].sort()).toEqual(Object.keys(body).sort());
      }
      const after = (await t.http.get(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken))).body;
      expect(after).toMatchObject({ role: "user", disabled: false, displayName: "Önce Ad" });
    });

    it("alanlar yine isteğe bağlıdır: boş gövde ve tek alan geçerli", async () => {
      const u = await registerUser(t.http);
      expect((await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({})).status).toBe(200);
      const only = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ disabled: false });
      expect(only.status).toBe(200);
      expect(only.body.disabled).toBe(false);
    });
  });

  describe("GET/PATCH/DELETE /v1/users/:id", () => {
    it("ayrıntı, güncelleme ve silme; olmayan kimlik 404; geçersiz kimlik 400", async () => {
      const u = await registerUser(t.http);
      const detail = await t.http.get(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken));
      expect(detail.status).toBe(200);
      expect(detail.body).toMatchObject({ id: u.user.id, email: u.email });

      const patched = await t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ displayName: "Yönetici Düzeltti" });
      expect(patched.body.displayName).toBe("Yönetici Düzeltti");

      await t.http.delete(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).expect(204);
      const gone = await t.http.get(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken));
      expect(gone.status).toBe(404);
      expect(gone.body).toEqual({ statusCode: 404, code: "NOT_FOUND", message: "Kullanıcı bulunamadı." });
      await t.http.get("/v1/auth/me").set(bearer(u.accessToken)).expect(401);

      const missing = "11111111-1111-4111-8111-111111111111";
      expect((await t.http.patch(`/v1/users/${missing}`).set(bearer(admin.accessToken)).send({ displayName: "Ad Soyad" })).status).toBe(404);
      expect((await t.http.delete(`/v1/users/${missing}`).set(bearer(admin.accessToken))).status).toBe(404);

      for (const bad of ["abc", "me", "123", "11111111-1111-4111-8111-11111111111g"]) {
        const res = await t.http.get(`/v1/users/${bad}`).set(bearer(admin.accessToken));
        expect(res.status, bad).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
        expect(res.body.details[0].field).toBe("id");
      }
    });
  });
});
