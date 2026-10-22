import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { MAX_STALE_SESSIONS_PER_USER } from "../src/games/games.constants.js";
import { gameSessions, scores, users } from "../src/db/schema/index.js";
import { bearer, createAdmin, createTestApp, registerUser, TEST_DATABASE_URL, type TestApp, type TestSession } from "./helpers/index.js";
import { correctAnswerOf, finish, fixtureCountries, secretRounds, seedGameCountries, startGame, submit } from "./helpers/games.js";

/**
 * Yalnız gerçek PostgreSQL'e karşı çalışır (`TEST_DATABASE_URL=postgres://... pnpm --filter api test`). PGlite tek
 * bağlantı olduğundan işlemleri sıraya dizer ve satır kilitlerini sınayamaz; burada gerçek paralel bağlantılarda
 * oyun işlemlerinin kilit sırası (`users` -> `game_sessions` -> `scores`) ve yarış davranışı denenir.
 */
describe.skipIf(!TEST_DATABASE_URL)("gerçek PostgreSQL: oyun eşzamanlılığı", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t, fixtureCountries(30));
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());

  const noServerError = (results: Array<{ status: number; body: unknown }>) => {
    for (const r of results) expect(r.status, `${r.status} ${JSON.stringify(r.body)}`).toBeLessThan(500);
  };

  it("aynı tura 20 eşzamanlı cevap: tam bir kazanan, puan bir kez sayılır", async () => {
    for (let round = 0; round < 3; round++) {
      const u = await registerUser(t.http);
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const answer = correctAnswerOf(rounds[0]!, "flag-quiz");
      const results = await Promise.all(Array.from({ length: 20 }, () => submit(t, u.accessToken, start.sessionId, 0, answer)));
      noServerError(results);
      expect(results.filter((r) => r.status === 200)).toHaveLength(1);
      expect(results.filter((r) => r.status === 409)).toHaveLength(19);
      const [row] = await t.db.select().from(gameSessions).where(eq(gameSessions.id, start.sessionId));
      expect(row).toMatchObject({ currentRound: 1, correctCount: 1 });
      expect(row!.score).toBe(results.find((r) => r.status === 200)!.body.points);
    }
  });

  it("20 eşzamanlı başlatma: tür başına tam bir etkin oturum", async () => {
    const u = await registerUser(t.http);
    const results = await Promise.all(
      Array.from({ length: 20 }, (_, i) => t.http.post(`/v1/games/${i % 2 === 0 ? "capital-quiz" : "map-guess"}/sessions`).set(bearer(u.accessToken))),
    );
    noServerError(results);
    expect(results.every((r) => r.status === 201)).toBe(true);
    for (const type of ["capital-quiz", "map-guess"] as const) {
      const rows = await t.db.select().from(gameSessions).where(and(eq(gameSessions.userId, u.user.id), eq(gameSessions.gameType, type)));
      expect(rows).toHaveLength(10);
      expect(rows.filter((r) => r.status === "active")).toHaveLength(1);
    }
  });

  it("eşzamanlı başlatmalarda satır sınırı korunur: terk edilmiş kayıt ≤ N, tür başına tam bir etkin oturum, 500 yok", async () => {
    const u = await registerUser(t.http);
    const total = MAX_STALE_SESSIONS_PER_USER * 2 + 6;
    const results = await Promise.all(Array.from({ length: total }, (_, i) => t.http.post(`/v1/games/${i % 2 === 0 ? "flag-quiz" : "map-guess"}/sessions`).set(bearer(u.accessToken))));
    noServerError(results);
    expect(results.every((r) => r.status === 201)).toBe(true);
    const rows = await t.db.select().from(gameSessions).where(eq(gameSessions.userId, u.user.id));
    for (const type of ["flag-quiz", "map-guess"] as const) expect(rows.filter((r) => r.gameType === type && r.status === "active")).toHaveLength(1);
    expect(rows.filter((r) => r.status === "abandoned" || r.status === "expired").length).toBeLessThanOrEqual(MAX_STALE_SESSIONS_PER_USER);
    expect(rows.length).toBeLessThanOrEqual(MAX_STALE_SESSIONS_PER_USER + 2);
  });

  it("yönetici puan listesi/silme/devre dışı bırakma ile oyun yarışı: 500 ve kilitlenme yok", async () => {
    for (let round = 0; round < 6; round++) {
      const u = await registerUser(t.http);
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 5; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "map-guess"));
      const done = await finish(t, u.accessToken, start.sessionId);
      const results = await Promise.all([
        t.http.get(`/v1/scores?userId=${u.user.id}`).set(bearer(admin.accessToken)),
        t.http.delete(`/v1/scores/${done.body.scoreId}`).set(bearer(admin.accessToken)),
        t.http.patch(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true }),
        t.http.get("/v1/leaderboards/map-guess"),
        t.http.get("/v1/leaderboards/overall"),
        finish(t, u.accessToken, start.sessionId),
        t.http.post("/v1/games/map-guess/sessions").set(bearer(u.accessToken)),
      ]);
      noServerError(results);
    }
  }, 120_000);

  it("20 eşzamanlı finish: tek puan satırı, hepsi 200 ve aynı gövde", async () => {
    const u = await registerUser(t.http);
    const start = await startGame(t, u.accessToken, "map-guess");
    const rounds = await secretRounds(t, start.sessionId);
    for (let i = 0; i < 5; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "map-guess"));
    const results = await Promise.all(Array.from({ length: 20 }, () => finish(t, u.accessToken, start.sessionId)));
    noServerError(results);
    expect(results.every((r) => r.status === 200)).toBe(true);
    for (const r of results) expect(r.body).toEqual(results[0]!.body);
    expect(await t.db.select().from(scores).where(eq(scores.sessionId, start.sessionId))).toHaveLength(1);
  });

  it("başlatma / cevap / bitirme / hesap silme karışık yarışında kilitlenme ve 500 yok", async () => {
    for (let round = 0; round < 12; round++) {
      const u = await registerUser(t.http);
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 4; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "map-guess"));
      const results = await Promise.all([
        submit(t, u.accessToken, start.sessionId, 4, correctAnswerOf(rounds[4]!, "map-guess")),
        submit(t, u.accessToken, start.sessionId, 4, correctAnswerOf(rounds[4]!, "map-guess")),
        finish(t, u.accessToken, start.sessionId),
        finish(t, u.accessToken, start.sessionId),
        t.http.post("/v1/games/map-guess/sessions").set(bearer(u.accessToken)),
        t.http.post("/v1/games/flag-quiz/sessions").set(bearer(u.accessToken)),
        t.http.delete(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)),
        t.http.get(`/v1/games/sessions/${start.sessionId}`).set(bearer(u.accessToken)),
        t.http.get("/v1/users/me/stats").set(bearer(u.accessToken)),
      ]);
      noServerError(results);
      expect(await t.db.select().from(gameSessions).where(eq(gameSessions.userId, u.user.id))).toHaveLength(0);
      expect(await t.db.select().from(scores).where(eq(scores.userId, u.user.id))).toHaveLength(0);
      expect(await t.db.select().from(users).where(eq(users.id, u.user.id))).toHaveLength(0);
    }
  }, 120_000);

  it("silme olmadan karışık yarış: cevap + finish + başlatma, en fazla bir puan ve bir etkin oturum", async () => {
    for (let round = 0; round < 12; round++) {
      const u = await registerUser(t.http);
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 4; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "map-guess"));
      const results = await Promise.all([
        submit(t, u.accessToken, start.sessionId, 4, correctAnswerOf(rounds[4]!, "map-guess")),
        finish(t, u.accessToken, start.sessionId),
        finish(t, u.accessToken, start.sessionId),
        t.http.post("/v1/games/map-guess/sessions").set(bearer(u.accessToken)),
      ]);
      noServerError(results);
      const rows = await t.db.select().from(gameSessions).where(and(eq(gameSessions.userId, u.user.id), eq(gameSessions.gameType, "map-guess")));
      expect(rows.filter((r) => r.status === "active")).toHaveLength(1);
      expect((await t.db.select().from(scores).where(eq(scores.userId, u.user.id))).length).toBeLessThanOrEqual(1);
    }
  }, 120_000);
});
