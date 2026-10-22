import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";
import { fixtureCountries, insertScore, playThrough, seedGameCountries } from "./helpers/games.js";

const HOUR = 60 * 60 * 1000;

describe("kullanıcı oyun istatistikleri ve geçmişi", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t, fixtureCountries(30));
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());

  const stats = (token: string) => t.http.get("/v1/users/me/stats").set(bearer(token));
  const history = (token: string, query = "") => t.http.get(`/v1/users/me/scores${query}`).set(bearer(token));

  describe("GET /v1/users/me/stats", () => {
    it("hiç oynamamış kullanıcı: üç tür de sıfır/null", async () => {
      const u = await registerUser(t.http);
      const res = await stats(u.accessToken);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        items: [
          { gameType: "flag-quiz", gamesPlayed: 0, bestScore: null, totalScore: 0, averageScore: null, lastPlayedAt: null },
          { gameType: "capital-quiz", gamesPlayed: 0, bestScore: null, totalScore: 0, averageScore: null, lastPlayedAt: null },
          { gameType: "map-guess", gamesPlayed: 0, bestScore: null, totalScore: 0, averageScore: null, lastPlayedAt: null },
        ],
        gamesPlayed: 0,
        totalScore: 0,
        overallBest: 0,
      });
    });

    it("oyun türü başına oynama, en iyi, toplam, ortalama ve son oynama", async () => {
      const u = await registerUser(t.http);
      const t0 = Date.now() - 10 * HOUR;
      await insertScore(t, { userId: u.user.id, gameType: "flag-quiz", score: 100, createdAt: new Date(t0) });
      await insertScore(t, { userId: u.user.id, gameType: "flag-quiz", score: 201, createdAt: new Date(t0 + HOUR) });
      await insertScore(t, { userId: u.user.id, gameType: "flag-quiz", score: 50, createdAt: new Date(t0 + 2 * HOUR) });
      await insertScore(t, { userId: u.user.id, gameType: "map-guess", score: 4000, createdAt: new Date(t0 + 3 * HOUR) });
      const res = await stats(u.accessToken);
      expect(res.status).toBe(200);
      const [flag, capital, map] = res.body.items;
      expect(flag).toEqual({ gameType: "flag-quiz", gamesPlayed: 3, bestScore: 201, totalScore: 351, averageScore: 117, lastPlayedAt: new Date(t0 + 2 * HOUR).toISOString() });
      expect(capital).toMatchObject({ gamesPlayed: 0, bestScore: null });
      expect(map).toEqual({ gameType: "map-guess", gamesPlayed: 1, bestScore: 4000, totalScore: 4000, averageScore: 4000, lastPlayedAt: new Date(t0 + 3 * HOUR).toISOString() });
      expect(res.body).toMatchObject({ gamesPlayed: 4, totalScore: 4351, overallBest: 4201 });
      expect(typeof res.body.items[0].averageScore).toBe("number");
    });

    it("ortalama bir ondalığa yuvarlanır ve sayı tipindedir (numeric dizgisi değil)", async () => {
      const u = await registerUser(t.http);
      for (const score of [100, 101, 101]) await insertScore(t, { userId: u.user.id, gameType: "capital-quiz", score });
      const res = await stats(u.accessToken);
      expect(res.body.items[1].averageScore).toBe(100.7); // 100,666...
      expect(res.body.items[1].gamesPlayed).toBe(3);
      expect(typeof res.body.items[1].totalScore).toBe("number");
    });

    it("gerçek oyun akışından gelir ve yalnız kendi puanlarını sayar", async () => {
      const a = await registerUser(t.http);
      const b = await registerUser(t.http);
      const first = await playThrough(t, a.accessToken, "map-guess");
      await playThrough(t, b.accessToken, "map-guess", { correct: () => false });
      const res = await stats(a.accessToken);
      expect(res.body.items[2]).toMatchObject({ gameType: "map-guess", gamesPlayed: 1, bestScore: first.finish.score });
      expect(res.body.gamesPlayed).toBe(1);
      expect((await stats(b.accessToken)).body.gamesPlayed).toBe(1);
    });

    it("hassas alan yok ve önbelleğe alınmaz", async () => {
      const u = await registerUser(t.http);
      const res = await stats(u.accessToken);
      expect(JSON.stringify(res.body)).not.toMatch(/email|userId|user_id|password|@/);
      expect(res.headers["cache-control"]).toBe("no-store");
    });
  });

  describe("GET /v1/users/me/scores", () => {
    let u: TestSession;
    let other: TestSession;
    const base = Date.now() - 100 * HOUR;
    beforeAll(async () => {
      u = await registerUser(t.http);
      other = await registerUser(t.http);
      for (let i = 0; i < 7; i++) {
        await insertScore(t, { userId: u.user.id, gameType: i % 2 === 0 ? "flag-quiz" : "capital-quiz", score: 100 + i, createdAt: new Date(base + i * HOUR), correctCount: i, durationMs: 1000 + i });
      }
      await insertScore(t, { userId: other.user.id, gameType: "flag-quiz", score: 777 });
    });

    it("sayfalı zarf, yeniden eskiye; yalnız kendi puanları", async () => {
      const res = await history(u.accessToken, "?pageSize=3");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ page: 1, pageSize: 3, total: 7 });
      expect(res.body.items.map((i: { score: number }) => i.score)).toEqual([106, 105, 104]);
      expect(res.body.items[0]).toEqual({
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
        gameType: "flag-quiz",
        score: 106,
        correctCount: 6,
        roundsTotal: 10,
        durationMs: 1006,
        createdAt: new Date(base + 6 * HOUR).toISOString(),
      });
      const page3 = await history(u.accessToken, "?pageSize=3&page=3");
      expect(page3.body.items.map((i: { score: number }) => i.score)).toEqual([100]);
      expect((await history(u.accessToken, "?pageSize=3&page=9")).body).toMatchObject({ items: [], total: 7 });
      expect(JSON.stringify(res.body)).not.toContain("777");
      expect(JSON.stringify(res.body)).not.toMatch(/userId|sessionId|email/);
    });

    it("gameType süzgeci ve geçersiz sorgular", async () => {
      const flag = await history(u.accessToken, "?gameType=flag-quiz");
      expect(flag.body.total).toBe(4);
      expect(flag.body.items.every((i: { gameType: string }) => i.gameType === "flag-quiz")).toBe(true);
      expect((await history(u.accessToken, "?gameType=map-guess")).body).toMatchObject({ items: [], total: 0 });
      for (const bad of ["?gameType=overall", "?gameType=chess", "?page=0", "?pageSize=101", "?pageSize=abc", "?page=1.5"]) {
        const res = await history(u.accessToken, bad);
        expect(res.status, bad).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
      expect((await history(u.accessToken)).body).toMatchObject({ page: 1, pageSize: 20 });
    });

    it("eşit zamanlı kayıtlarda sıra kararlı: sayfalar arasında tekrar ya da kayıp yok", async () => {
      const v = await registerUser(t.http);
      const same = new Date(Date.now() - 5 * HOUR);
      for (let i = 0; i < 6; i++) await insertScore(t, { userId: v.user.id, gameType: "flag-quiz", score: i, createdAt: same });
      const seen: string[] = [];
      for (const page of [1, 2, 3]) seen.push(...(await history(v.accessToken, `?pageSize=2&page=${page}`)).body.items.map((i: { id: string }) => i.id));
      expect(new Set(seen).size).toBe(6);
    });
  });

  describe("rota çakışması: users/me/... ile users/:id", () => {
    it("GET /v1/users/me/stats ve /scores oyun uçlarına gider; kimlik/hesap uçları (users/me, users/:id) değişmeden çalışır", async () => {
      const u = await registerUser(t.http);
      expect((await stats(u.accessToken)).body).toHaveProperty("items");
      expect((await history(u.accessToken)).body).toHaveProperty("total");

      // Hesap uçları: PATCH /users/me hâlâ UsersController'a gider.
      const patch = await t.http.patch("/v1/users/me").set(bearer(u.accessToken)).send({ displayName: "Yeni Ad" });
      expect(patch.status).toBe(200);
      expect(patch.body.displayName).toBe("Yeni Ad");
      // GET /users/me tanımlı değildir: `users/:id` yönetici ucuna düşer (kullanıcı 403, yönetici UUID doğrulamasından 400).
      expect((await t.http.get("/v1/users/me").set(bearer(u.accessToken))).status).toBe(403);
      expect((await t.http.get("/v1/users/me").set(bearer(admin.accessToken))).status).toBe(400);
      // GET /users/:id hâlâ yöneticinin kullanıcı ayrıntısı.
      const detail = await t.http.get(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken));
      expect(detail.status).toBe(200);
      expect(detail.body.id).toBe(u.user.id);
      expect((await t.http.get(`/v1/users/${randomUUID()}`).set(bearer(admin.accessToken))).status).toBe(404);
      // Kullanıcı, yönetici uç noktasına erişemez; `me/stats` ise yönetici de dahil herkesin kendi verisidir.
      expect((await t.http.get(`/v1/users/${u.user.id}`).set(bearer(u.accessToken))).status).toBe(403);
      expect((await stats(admin.accessToken)).status).toBe(200);
      // Üç segmentli bilinmeyen yollar 404.
      expect((await t.http.get("/v1/users/me/bilinmeyen").set(bearer(u.accessToken))).status).toBe(404);
    });

    it("kayıtlı rota tablosunda aynı yöntem ve yol iki kez tanımlı değil; users/me/stats ve users/me/scores tek kez", () => {
      const router = (t.app.getHttpAdapter().getInstance() as { router?: { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> } }).router;
      const stack = router?.stack ?? [];
      const routes = stack.flatMap((layer) => (layer.route ? Object.keys(layer.route.methods).map((m) => `${m.toUpperCase()} ${layer.route!.path}`) : []));
      expect(routes.length).toBeGreaterThan(20);
      const duplicates = routes.filter((r, i) => routes.indexOf(r) !== i);
      expect(duplicates).toEqual([]);
      expect(routes.filter((r) => r === "GET /v1/users/me/stats")).toHaveLength(1);
      expect(routes.filter((r) => r === "GET /v1/users/me/scores")).toHaveLength(1);
      expect(routes).toContain("GET /v1/users/:id");
      expect(routes).toContain("PATCH /v1/users/me");
      expect(routes).not.toContain("GET /v1/users/me");
      // Oyun uçları: sabit segmentli yollar parametrelilerle çakışmaz.
      for (const expected of [
        "POST /v1/games/:gameType/sessions",
        "GET /v1/games/sessions/:id",
        "POST /v1/games/sessions/:id/answers",
        "POST /v1/games/sessions/:id/finish",
        "GET /v1/leaderboards/:gameType",
        "GET /v1/leaderboards/:gameType/me",
        "DELETE /v1/scores/:id",
      ]) expect(routes, expected).toContain(expected);
    });
  });
});
