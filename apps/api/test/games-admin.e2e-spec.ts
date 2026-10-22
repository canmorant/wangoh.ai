import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";
import { fixtureCountries, insertScore, playThrough, seedGameCountries } from "./helpers/games.js";

const MINUTE = 60 * 1000;
const ITEM_KEYS = ["correctCount", "createdAt", "displayName", "durationMs", "gameType", "id", "roundsTotal", "score", "sessionId", "userDisabled", "userId"];

/**
 * Yönetici puan incelemesi: liderlikte yalnız görünen ad vardır, puan kimliğini yalnız sahibi bilirdi; hile
 * müdahalesi (DELETE /v1/scores/:id) bu uç olmadan fiilen kullanılamıyordu.
 */
describe("yönetici puan listesi (GET /v1/scores)", () => {
  let t: TestApp;
  let admin: TestSession;
  let ada: TestSession;
  let bora: TestSession;
  const now = Date.now();
  const ids: Record<string, string> = {};

  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t, fixtureCountries(30));
    admin = await createAdmin(t);
    ada = await registerUser(t.http, { displayName: "Ada" });
    bora = await registerUser(t.http, { displayName: "Bora" });
    // createdAt benzersiz: sıra belirleyici.
    ids.a1 = await insertScore(t, { userId: ada.user.id, gameType: "flag-quiz", score: 1000, durationMs: 90_000, createdAt: new Date(now - 50 * MINUTE) });
    ids.a2 = await insertScore(t, { userId: ada.user.id, gameType: "capital-quiz", score: 1200, durationMs: 80_000, createdAt: new Date(now - 40 * MINUTE) });
    ids.b1 = await insertScore(t, { userId: bora.user.id, gameType: "flag-quiz", score: 1850, durationMs: 118, createdAt: new Date(now - 30 * MINUTE) });
    ids.b2 = await insertScore(t, { userId: bora.user.id, gameType: "map-guess", score: 5000, durationMs: 52, createdAt: new Date(now - 20 * MINUTE) });
    ids.b3 = await insertScore(t, { userId: bora.user.id, gameType: "flag-quiz", score: 700, durationMs: 60_000, createdAt: new Date(now - 10 * MINUTE) });
  });
  afterAll(() => t.close());

  const list = (token: string | undefined, query = "") => {
    const req = t.http.get(`/v1/scores${query}`);
    return token ? req.set(bearer(token)) : req;
  };
  const scoreIds = (body: { items: Array<{ id: string }> }) => body.items.map((i) => i.id);

  it("anonim 401, kullanıcı 403, yönetici 200; kullanıcı kendi puanı için bile erişemez", async () => {
    expect((await list(undefined)).status).toBe(401);
    const forbidden = await list(ada.accessToken);
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.code).toBe("FORBIDDEN");
    expect((await list(ada.accessToken, `?userId=${ada.user.id}`)).status).toBe(403);
    expect((await list(admin.accessToken)).status).toBe(200);
  });

  it("varsayılan: yeniden eskiye, sayfa zarfı, yalnız beklenen alanlar (e-posta ve parola yok), önbelleğe alınmaz", async () => {
    const res = await list(admin.accessToken);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ page: 1, pageSize: 20, total: 5 });
    expect(scoreIds(res.body)).toEqual([ids.b3, ids.b2, ids.b1, ids.a2, ids.a1]);
    for (const item of res.body.items) expect(Object.keys(item).sort()).toEqual(ITEM_KEYS);
    expect(res.body.items[0]).toEqual({
      id: ids.b3,
      sessionId: expect.stringMatching(/^[0-9a-f-]{36}$/),
      userId: bora.user.id,
      displayName: "Bora",
      userDisabled: false,
      gameType: "flag-quiz",
      score: 700,
      correctCount: 0,
      roundsTotal: 10,
      durationMs: 60_000,
      createdAt: new Date(now - 10 * MINUTE).toISOString(),
    });
    expect(JSON.stringify(res.body)).not.toMatch(/@|password|email/i);
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("süzgeçler: userId, gameType, sessionId ve birleşimi; toplam süzgece uyar", async () => {
    const byUser = await list(admin.accessToken, `?userId=${bora.user.id}`);
    expect(scoreIds(byUser.body)).toEqual([ids.b3, ids.b2, ids.b1]);
    expect(byUser.body.total).toBe(3);

    const byType = await list(admin.accessToken, "?gameType=flag-quiz");
    expect(scoreIds(byType.body)).toEqual([ids.b3, ids.b1, ids.a1]);
    expect(byType.body.total).toBe(3);

    const both = await list(admin.accessToken, `?userId=${ada.user.id}&gameType=flag-quiz`);
    expect(scoreIds(both.body)).toEqual([ids.a1]);

    const sessionId = byUser.body.items[1].sessionId as string; // b2
    const bySession = await list(admin.accessToken, `?sessionId=${sessionId}`);
    expect(scoreIds(bySession.body)).toEqual([ids.b2]);

    const none = await list(admin.accessToken, `?userId=${randomUUID()}`);
    expect(none.body).toMatchObject({ items: [], total: 0 });
    expect((await list(admin.accessToken, `?userId=${ada.user.id}&gameType=map-guess`)).body).toMatchObject({ items: [], total: 0 });
  });

  it("maxDurationMs: olağan dışı hızlı (bot) oyunları bulur; sınır dahil", async () => {
    expect(scoreIds((await list(admin.accessToken, "?maxDurationMs=1000")).body)).toEqual([ids.b2, ids.b1]);
    expect(scoreIds((await list(admin.accessToken, "?maxDurationMs=118")).body)).toEqual([ids.b2, ids.b1]);
    expect(scoreIds((await list(admin.accessToken, "?maxDurationMs=117")).body)).toEqual([ids.b2]);
    expect(scoreIds((await list(admin.accessToken, "?maxDurationMs=51")).body)).toEqual([]);
    const combined = await list(admin.accessToken, "?maxDurationMs=100000&gameType=capital-quiz");
    expect(scoreIds(combined.body)).toEqual([ids.a2]);
    expect(combined.body.total).toBe(1);
  });

  it("sayfalama: toplam sabit, sayfalar tekrarsız ve eksiksiz; eşit zamanlı kayıtlarda sıra kararlı", async () => {
    const p1 = await list(admin.accessToken, "?pageSize=2&page=1");
    const p2 = await list(admin.accessToken, "?pageSize=2&page=2");
    const p3 = await list(admin.accessToken, "?pageSize=2&page=3");
    const p4 = await list(admin.accessToken, "?pageSize=2&page=4");
    for (const p of [p1, p2, p3, p4]) expect(p.body.total).toBe(5);
    expect([...scoreIds(p1.body), ...scoreIds(p2.body), ...scoreIds(p3.body)]).toEqual([ids.b3, ids.b2, ids.b1, ids.a2, ids.a1]);
    expect(p4.body).toMatchObject({ items: [], page: 4, pageSize: 2, total: 5 });

    const same = new Date(now - 5 * MINUTE);
    const twins = await registerUser(t.http, { displayName: "İkizler" });
    const twinIds = [];
    for (let i = 0; i < 4; i++) twinIds.push(await insertScore(t, { userId: twins.user.id, gameType: "capital-quiz", score: i, createdAt: same }));
    const seen: string[] = [];
    for (const page of [1, 2]) seen.push(...scoreIds((await list(admin.accessToken, `?userId=${twins.user.id}&pageSize=2&page=${page}`)).body));
    expect(new Set(seen).size).toBe(4);
    expect(seen.sort()).toEqual(twinIds.sort());
  });

  it("geçersiz sorgular 400 VALIDATION_FAILED", async () => {
    for (const bad of [
      "?userId=abc",
      "?sessionId=1",
      "?gameType=overall",
      "?gameType=chess",
      "?maxDurationMs=0",
      "?maxDurationMs=-5",
      "?maxDurationMs=abc",
      "?maxDurationMs=",
      "?maxDurationMs=1.5",
      "?maxDurationMs=2147483648",
      "?page=0",
      "?pageSize=101",
      "?sort=score",
    ]) {
      const res = await list(admin.accessToken, bad);
      expect(res.status, bad).toBe(400);
      expect(res.body.code, bad).toBe("VALIDATION_FAILED");
    }
  });

  it("gerçek oyun akışında yazılan puan da listelenir; liderlikteki ad → kullanıcı → puan kimliği → silme işlevi uçtan uca çalışır", async () => {
    const bot = await registerUser(t.http, { displayName: "Süper Hızlı Bot" });
    const honest = await registerUser(t.http, { displayName: "Dürüst Oyuncu" });
    const botGame = await playThrough(t, bot.accessToken, "capital-quiz");
    await playThrough(t, honest.accessToken, "capital-quiz", { correct: (i) => i < 9 });

    // Liderlikte yalnız görünen ad var; hilecinin kimliği ve puan kimliği görünmez.
    const board = await t.http.get("/v1/leaderboards/capital-quiz");
    expect(board.body.entries[0]).toMatchObject({ rank: 1, displayName: "Süper Hızlı Bot", score: botGame.finish.score });
    expect(JSON.stringify(board.body)).not.toContain(botGame.finish.scoreId);

    // 1) yönetici kullanıcıyı görünen adla bulur, 2) puanlarını listeler, 3) süreye bakıp siler.
    const found = await t.http.get(`/v1/users?q=${encodeURIComponent("Süper Hızlı")}`).set(bearer(admin.accessToken));
    expect(found.body.items.map((u: { id: string }) => u.id)).toEqual([bot.user.id]);
    const scoresOfBot = await list(admin.accessToken, `?userId=${bot.user.id}&gameType=capital-quiz`);
    expect(scoresOfBot.body.total).toBe(1);
    expect(scoresOfBot.body.items[0]).toMatchObject({ id: botGame.finish.scoreId, sessionId: botGame.sessionId, score: botGame.finish.score, displayName: "Süper Hızlı Bot" });
    expect(scoresOfBot.body.items[0].durationMs).toBe(botGame.finish.durationMs);
    expect(scoreIds((await list(admin.accessToken, `?sessionId=${botGame.sessionId}`)).body)).toEqual([botGame.finish.scoreId]);

    await t.http.delete(`/v1/scores/${botGame.finish.scoreId}`).set(bearer(admin.accessToken)).expect(204);
    expect((await list(admin.accessToken, `?userId=${bot.user.id}`)).body).toMatchObject({ items: [], total: 0 });
    expect((await t.http.get("/v1/leaderboards/capital-quiz")).body.entries[0].displayName).toBe("Dürüst Oyuncu");
  });

  it("devre dışı kullanıcının puanları yöneticiye görünür ve işaretlenir (liderlikten düşer ama silinebilir)", async () => {
    const cheater = await registerUser(t.http, { displayName: "Devre Dışı Hileci" });
    const id = await insertScore(t, { userId: cheater.user.id, gameType: "capital-quiz", score: 99_000, durationMs: 40 });
    await t.http.patch(`/v1/users/${cheater.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true }).expect(200);
    const res = await list(admin.accessToken, `?userId=${cheater.user.id}`);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({ id, userDisabled: true, score: 99_000, durationMs: 40 });
    expect((await t.http.get("/v1/leaderboards/capital-quiz")).body.entries.map((e: { displayName: string }) => e.displayName)).not.toContain("Devre Dışı Hileci");
    await t.http.delete(`/v1/scores/${id}`).set(bearer(admin.accessToken)).expect(204);
  });
});
