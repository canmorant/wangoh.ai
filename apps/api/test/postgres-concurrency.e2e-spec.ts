import { randomUUID } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { hashRefreshToken } from "../src/auth/tokens.service.js";
import { createDatabase } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import { refreshTokens, users } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, findUserRow, provisionPostgres, registerUser, TEST_DATABASE_URL, type TestApp } from "./helpers/index.js";

/**
 * Yalnız gerçek PostgreSQL'e karşı çalışır (`TEST_DATABASE_URL=postgres://... pnpm --filter api test`).
 * PGlite tek bağlantı olduğundan işlemleri sıraya dizer; satır kilidi, danışma kilidi ve gerçek
 * paralel bağlantılardaki yarış durumları ancak burada sınanır.
 */
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe.skipIf(!TEST_DATABASE_URL)("gerçek PostgreSQL: eşzamanlılık", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  const activeAdmins = async () => (await t.db.select().from(users).where(and(eq(users.role, "admin"), eq(users.disabled, false)))).length;
  const removeOtherAdmins = async (keep: string[]) => {
    for (const row of await t.db.select().from(users).where(eq(users.role, "admin"))) {
      if (!keep.includes(row.id)) await t.db.delete(users).where(eq(users.id, row.id));
    }
  };

  for (const mode of ["düşürme", "devre dışı bırakma", "silme"] as const) {
    it(`son admin ${mode} halkası: ${6} admin birbirini eşzamanlı ${mode} edince en az biri kalır, 500/kilitlenme yok`, async () => {
      for (let round = 0; round < 4; round++) {
        const admins = await Promise.all(Array.from({ length: 6 }, () => createAdmin(t)));
        await removeOtherAdmins(admins.map((a) => a.user.id));
        const results = await Promise.all(
          admins.map((caller, i) => {
            const target = admins[(i + 1) % admins.length]!;
            const req =
              mode === "silme"
                ? t.http.delete(`/v1/users/${target.user.id}`)
                : t.http.patch(`/v1/users/${target.user.id}`).send(mode === "düşürme" ? { role: "user" } : { disabled: true });
            return req.set(bearer(caller.accessToken));
          }),
        );
        for (const r of results) expect([200, 204, 401, 403, 404, 409], `${mode}: ${r.status} ${JSON.stringify(r.body)}`).toContain(r.status);
        expect(await activeAdmins(), `tur ${round}`).toBeGreaterThanOrEqual(1);
      }
    }, 60_000);
  }

  it("aynı yenileme belirteciyle 20 eşzamanlı istekte tam bir kazanan çıkar", async () => {
    const s = await registerUser(t.http);
    const results = await Promise.all(Array.from({ length: 20 }, () => t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken })));
    expect(results.filter((r) => r.status === 200)).toHaveLength(1);
    expect(results.filter((r) => r.status === 401)).toHaveLength(19);
    expect(results.some((r) => r.status >= 500)).toBe(false);
    const rows = await t.db.select().from(refreshTokens).where(eq(refreshTokens.userId, s.user.id));
    expect(rows.every((r) => r.revokedAt !== null)).toBe(true); // kaybedenler yeniden kullanım sayıp aileyi iptal etti
  });

  it("parola değişimiyle eşzamanlı yenileme: değişimden sonra hiçbir eski zincir erişim üretemez", async () => {
    for (let round = 0; round < 25; round++) {
      const s = await registerUser(t.http);
      const [change, refresh] = await Promise.all([
        t.http.post("/v1/users/me/password").set(bearer(s.accessToken)).send({ currentPassword: s.password, newPassword: "YeniParola-123" }),
        t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }),
      ]);
      expect([change.status, refresh.status].some((x) => x >= 500)).toBe(false);
      if (change.status !== 204) continue;
      // Yarışı kazanıp yeni belirteç almış olsa bile bu zincir artık kullanılamaz.
      if (refresh.status === 200) {
        const next = await t.http.post("/v1/auth/refresh").send({ refreshToken: refresh.body.refreshToken });
        expect(next.status, `tur ${round}: parola değişimi sonrası eski zincir yenilendi`).toBe(401);
        await t.http.get("/v1/auth/me").set(bearer(refresh.body.accessToken)).expect(401);
      }
    }
  }, 120_000);

  // --- kilit sırası: users -> refresh_tokens (AUTHN-03 / AUTHZ-1 / AUTHN-04) -------------------------

  /**
   * Kullanıcının süresi dolmuş bir yenileme satırını AYRI bir bağlantıda kilitler. Yenileme/giriş
   * işlemi `purgeExpired` adımında bu satırda bekler; böylece iki isteğin iç içe girdiği pencere
   * milisaniyelik şansa bırakılmadan, belirleyici biçimde açık tutulur.
   */
  const blockExpiredPurge = async (userId: string) => {
    const [row] = await t.db
      .insert(refreshTokens)
      .values({ userId, familyId: randomUUID(), tokenHash: hashRefreshToken(randomUUID()), expiresAt: new Date(Date.now() - 60_000) })
      .returning({ id: refreshTokens.id });
    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString: t.config.databaseUrl });
    await client.connect();
    await client.query("begin");
    await client.query("select 1 from refresh_tokens where id = $1 for update", [row!.id]);
    let released = false;
    return {
      release: async () => {
        if (released) return;
        released = true;
        await client.query("rollback").catch(() => undefined);
        await client.end().catch(() => undefined);
      },
    };
  };

  const liveTokens = async (userId: string) =>
    (await t.db.select().from(refreshTokens).where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)))).length;

  for (const mode of ["devre dışı bırakma", "silme"] as const) {
    it(`yenileme sürerken yönetici ${mode} kilitlenmez: yönetici işlemi uygulanır, yeni belirteç de iptal olur`, async () => {
      const s = await registerUser(t.http);
      const admin = await createAdmin(t);
      const blocker = await blockExpiredPurge(s.user.id);
      let refresh, adminRes;
      try {
        const refreshP = t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).then((r) => r);
        await sleep(400); // yenileme belirteci talep etti, purgeExpired'da bekliyor
        const adminReq =
          mode === "silme"
            ? t.http.delete(`/v1/users/${s.user.id}`).set(bearer(admin.accessToken))
            : t.http.patch(`/v1/users/${s.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true });
        const adminP = adminReq.then((r) => r);
        await sleep(400);
        await blocker.release();
        [refresh, adminRes] = await Promise.all([refreshP, adminP]);
      } finally {
        await blocker.release();
      }
      expect(adminRes.status, JSON.stringify(adminRes.body)).toBe(mode === "silme" ? 204 : 200);
      expect([200, 401], JSON.stringify(refresh.body)).toContain(refresh.status);

      const row = await findUserRow(t, s.user.id);
      if (mode === "silme") {
        expect(row).toBeUndefined();
      } else {
        expect(row?.disabled).toBe(true);
        expect(await liveTokens(s.user.id)).toBe(0); // yarışı kazanan yenileme de dahil hiçbir belirteç canlı kalmaz
        if (refresh.status === 200) {
          await t.http.post("/v1/auth/refresh").send({ refreshToken: refresh.body.refreshToken }).expect(401);
          await t.http.get("/v1/auth/me").set(bearer(refresh.body.accessToken)).expect(401);
        }
      }
    }, 30_000);

    it(`doğal yarış: yenileme ve yönetici ${mode} eşzamanlı 25 turda 5xx/kilitlenme üretmez`, async () => {
      const admin = await createAdmin(t);
      for (let round = 0; round < 25; round++) {
        const s = await registerUser(t.http);
        const adminReq =
          mode === "silme"
            ? t.http.delete(`/v1/users/${s.user.id}`).set(bearer(admin.accessToken))
            : t.http.patch(`/v1/users/${s.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true });
        const [refresh, adminRes] = await Promise.all([t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }), adminReq]);
        expect(adminRes.status, `tur ${round}: yönetici ${JSON.stringify(adminRes.body)}`).toBe(mode === "silme" ? 204 : 200);
        expect([200, 401], `tur ${round}: yenileme ${JSON.stringify(refresh.body)}`).toContain(refresh.status);
        if (mode === "devre dışı bırakma") expect(await liveTokens(s.user.id), `tur ${round}`).toBe(0);
      }
    }, 120_000);
  }

  it("giriş sürerken yönetici silme: giriş 5xx vermez, silme uygulanır", async () => {
    const s = await registerUser(t.http);
    const admin = await createAdmin(t);
    const blocker = await blockExpiredPurge(s.user.id);
    let login, removed;
    try {
      const loginP = t.http.post("/v1/auth/login").send({ email: s.email, password: s.password }).then((r) => r);
      await sleep(500); // parola doğrulandı, belirteç verme adımında bekliyor
      const removeP = t.http.delete(`/v1/users/${s.user.id}`).set(bearer(admin.accessToken)).then((r) => r);
      await sleep(400);
      await blocker.release();
      [login, removed] = await Promise.all([loginP, removeP]);
    } finally {
      await blocker.release();
    }
    expect(removed.status, JSON.stringify(removed.body)).toBe(204);
    expect([200, 401], JSON.stringify(login.body)).toContain(login.status);
    expect(await findUserRow(t, s.user.id)).toBeUndefined();
  }, 30_000);

  it("giriş sürerken yönetici devre dışı bırakma: kilitlenme yok, yeni oturum canlı kalmaz", async () => {
    const s = await registerUser(t.http);
    const admin = await createAdmin(t);
    const blocker = await blockExpiredPurge(s.user.id);
    let login, patched;
    try {
      const loginP = t.http.post("/v1/auth/login").send({ email: s.email, password: s.password }).then((r) => r);
      await sleep(500);
      const patchP = t.http.patch(`/v1/users/${s.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true }).then((r) => r);
      await sleep(400);
      await blocker.release();
      [login, patched] = await Promise.all([loginP, patchP]);
    } finally {
      await blocker.release();
    }
    expect(patched.status, JSON.stringify(patched.body)).toBe(200);
    expect([200, 403], JSON.stringify(login.body)).toContain(login.status);
    expect(await liveTokens(s.user.id)).toBe(0);
  }, 30_000);

  it("çıkış, eşzamanlı yenilemenin bastığı yeni belirteci de iptal eder (belirleyici pencere)", async () => {
    const s = await registerUser(t.http);
    const blocker = await blockExpiredPurge(s.user.id);
    let refresh, logout;
    try {
      const refreshP = t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).then((r) => r);
      await sleep(400); // R1 talep edildi, R2 henüz işlenmedi
      const logoutP = t.http.post("/v1/auth/logout").send({ refreshToken: s.refreshToken }).then((r) => r);
      await sleep(400);
      await blocker.release();
      [refresh, logout] = await Promise.all([refreshP, logoutP]);
    } finally {
      await blocker.release();
    }
    expect(logout.status).toBe(204);
    expect([200, 401]).toContain(refresh.status);
    if (refresh.status === 200) await t.http.post("/v1/auth/refresh").send({ refreshToken: refresh.body.refreshToken }).expect(401);
    const own = await t.db.select().from(refreshTokens).where(and(eq(refreshTokens.userId, s.user.id), isNull(refreshTokens.revokedAt)));
    expect(own.filter((r) => r.expiresAt > new Date())).toHaveLength(0); // aile tamamen iptal
  }, 30_000);

  it("yeniden kullanım tespiti, sürmekte olan yenilemenin bastığı belirteci de iptal eder (belirleyici pencere)", async () => {
    const s = await registerUser(t.http);
    const rotated = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).expect(200); // R1 -> R2
    const blocker = await blockExpiredPurge(s.user.id);
    let next, replay;
    try {
      const nextP = t.http.post("/v1/auth/refresh").send({ refreshToken: rotated.body.refreshToken }).then((r) => r); // R2 -> R3 (bekliyor)
      await sleep(400);
      const replayP = t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).then((r) => r); // R1 tekrar: çalıntı
      await sleep(400);
      await blocker.release();
      [next, replay] = await Promise.all([nextP, replayP]);
    } finally {
      await blocker.release();
    }
    expect(replay.status).toBe(401);
    expect([200, 401]).toContain(next.status);
    if (next.status === 200) await t.http.post("/v1/auth/refresh").send({ refreshToken: next.body.refreshToken }).expect(401);
    const live = await t.db.select().from(refreshTokens).where(and(eq(refreshTokens.userId, s.user.id), isNull(refreshTokens.revokedAt)));
    expect(live.filter((r) => r.expiresAt > new Date())).toHaveLength(0);
  }, 30_000);

  it("doğal yarış: yenileme ve çıkış eşzamanlı 40 turda aileden canlı belirteç bırakmaz", async () => {
    for (let round = 0; round < 40; round++) {
      const s = await registerUser(t.http);
      const [refresh, logout] = await Promise.all([
        t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }),
        t.http.post("/v1/auth/logout").send({ refreshToken: s.refreshToken }),
      ]);
      expect(logout.status, `tur ${round}`).toBe(204);
      expect([200, 401], `tur ${round}`).toContain(refresh.status);
      expect(await liveTokens(s.user.id), `tur ${round}: çıkıştan sonra canlı belirteç`).toBe(0);
    }
  }, 120_000);

  it("doğal yarış: yenileme ve yeniden kullanım tespiti eşzamanlı 40 turda aileden canlı belirteç bırakmaz", async () => {
    for (let round = 0; round < 40; round++) {
      const s = await registerUser(t.http);
      const rotated = await t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }).expect(200);
      const [next, replay] = await Promise.all([
        t.http.post("/v1/auth/refresh").send({ refreshToken: rotated.body.refreshToken }),
        t.http.post("/v1/auth/refresh").send({ refreshToken: s.refreshToken }),
      ]);
      expect(replay.status, `tur ${round}`).toBe(401);
      expect([200, 401], `tur ${round}`).toContain(next.status);
      expect(await liveTokens(s.user.id), `tur ${round}: tespit sonrası canlı belirteç`).toBe(0);
    }
  }, 120_000);

  it("aynı e-postayla 10 eşzamanlı kayıttan yalnız biri başarır", async () => {
    const email = `es-${Date.now()}@example.test`;
    const results = await Promise.all(
      Array.from({ length: 10 }, () => t.http.post("/v1/auth/register").send({ email, password: "Parola-12345", displayName: "Yarış" })),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 409)).toHaveLength(9);
  });

  it("migrasyonlar iki örnekte aynı anda çalışınca danışma kilidi sıraya dizer (hata yok, tablolar tek)", async () => {
    const db = await provisionPostgres(TEST_DATABASE_URL!);
    const [a, b, c] = await Promise.all([1, 2, 3].map(() => createDatabase({ databaseUrl: db.url, pgliteDir: "memory://" })));
    try {
      await expect(Promise.all([runMigrations(a!), runMigrations(b!), runMigrations(c!)])).resolves.toBeDefined();
      const rows = await a!.db.select().from(users);
      expect(rows).toEqual([]);
    } finally {
      await Promise.all([a!.close(), b!.close(), c!.close()]);
      await db.drop();
    }
  }, 60_000);
});
