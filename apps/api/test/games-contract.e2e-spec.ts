import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { gameSessions } from "../src/db/schema/index.js";
import { createOpenApiDocument } from "../src/openapi/document.js";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp } from "./helpers/index.js";
import { correctAnswerOf, fixtureCountries, insertScore, secretRounds, seedGameCountries, startGame, submit, wrongAnswerOf } from "./helpers/games.js";
import { checkAgainstSchema, checkResponse, type OpenApiLike } from "./helpers/openapi-check.js";

type Res = { status: number; body: unknown; text?: string };

const GAME_OPERATIONS = [
  "gamesStartSession",
  "gamesGetSession",
  "gamesSubmitAnswer",
  "gamesFinishSession",
  "leaderboardsGet",
  "leaderboardsMe",
  "usersMeStats",
  "usersMeScores",
  "scoresList",
  "scoresDelete",
] as const;

/**
 * Oyun uçlarının GERÇEK yanıtları, üretilen OpenAPI şemasına uyar: tür, null, zorunlu alan, enum, biçim ve belgelenmemiş
 * alan yok; dönen her durum kodu belgelenmiş, belgelenen her durum (429 hariç) gerçekten üretilebiliyor.
 */
describe("oyun uçları: yanıtlar OpenAPI şemasıyla uyumlu", () => {
  let t: TestApp;
  let doc: OpenApiLike;
  const problems: string[] = [];
  const exercised = new Map<string, Set<number>>(); // operationId -> görülen durum kodları

  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t, fixtureCountries(30));
    doc = createOpenApiDocument(t.app) as unknown as OpenApiLike;
  });
  afterAll(() => t.close());

  const operationIdOf = (method: string, template: string): string => (doc.paths[template] as Record<string, { operationId: string }>)[method]!.operationId;
  /** Yanıtı denetler ve görülen durumu kaydeder; yanıtı geri verir. */
  const check = (method: string, template: string, res: Res): Res => {
    problems.push(...checkResponse(doc, method, template, res));
    const id = operationIdOf(method, template);
    exercised.set(id, (exercised.get(id) ?? new Set()).add(res.status));
    return res;
  };

  const START = "/v1/games/{gameType}/sessions";
  const SESSION = "/v1/games/sessions/{id}";
  const ANSWER = "/v1/games/sessions/{id}/answers";
  const FINISH = "/v1/games/sessions/{id}/finish";
  const BOARD = "/v1/leaderboards/{gameType}";
  const BOARD_ME = "/v1/leaderboards/{gameType}/me";

  it("başlat / geri yükle / cevapla / bitir: her tür, başarı ve hata yolları", async () => {
    const u = await registerUser(t.http, { displayName: "Şema" });
    const other = await registerUser(t.http, { displayName: "Öteki" });
    for (const type of ["flag-quiz", "capital-quiz", "map-guess"] as const) {
      const started = check("post", START, await t.http.post(`/v1/games/${type}/sessions`).set(bearer(u.accessToken)));
      const sid = (started.body as { sessionId: string }).sessionId;
      const rounds = await secretRounds(t, sid);
      const sessionUrl = `/v1/games/sessions/${sid}`;
      check("get", SESSION, await t.http.get(sessionUrl).set(bearer(u.accessToken)));
      check("post", ANSWER, await submit(t, u.accessToken, sid, 0, type === "map-guess" ? { lat: 100, lng: 0 } : "ZZZ")); // 400
      check("post", ANSWER, await submit(t, u.accessToken, sid, 3, correctAnswerOf(rounds[0]!, type))); // 409 sıra
      check("post", ANSWER, await submit(t, other.accessToken, sid, 0, correctAnswerOf(rounds[0]!, type))); // 404
      check("get", SESSION, await t.http.get(sessionUrl).set(bearer(other.accessToken))); // 404
      check("post", FINISH, await t.http.post(`${sessionUrl}/finish`).set(bearer(u.accessToken))); // 409 bitmedi
      for (let i = 0; i < rounds.length; i++) {
        // doğru, pas (null) ve yanlış turlar karışık
        const answer = i % 3 === 0 ? correctAnswerOf(rounds[i]!, type) : i % 3 === 1 ? null : wrongAnswerOf(rounds[i]!, type);
        expect(check("post", ANSWER, await submit(t, u.accessToken, sid, i, answer)).status).toBe(200);
      }
      check("get", SESSION, await t.http.get(sessionUrl).set(bearer(u.accessToken))); // tüm turlar cevaplandı: round null
      expect(check("post", FINISH, await t.http.post(`${sessionUrl}/finish`).set(bearer(u.accessToken))).status).toBe(200);
      check("get", SESSION, await t.http.get(sessionUrl).set(bearer(u.accessToken))); // finished
      check("post", ANSWER, await submit(t, u.accessToken, sid, 0, "AA")); // 409 etkin değil

      const second = (await startGame(t, u.accessToken, type)).sessionId;
      await t.db.update(gameSessions).set({ expiresAt: new Date(Date.now() - 1_000) }).where(eq(gameSessions.id, second));
      check("get", SESSION, await t.http.get(`/v1/games/sessions/${second}`).set(bearer(u.accessToken))); // expired, round null
      check("post", ANSWER, await submit(t, u.accessToken, second, 0, "AA")); // 410
      check("post", FINISH, await t.http.post(`/v1/games/sessions/${second}/finish`).set(bearer(u.accessToken))); // 410
    }
    check("post", START, await t.http.post("/v1/games/chess/sessions").set(bearer(u.accessToken))); // 400
    check("post", START, await t.http.post("/v1/games/flag-quiz/sessions")); // 401
    check("get", SESSION, await t.http.get("/v1/games/sessions/xx").set(bearer(u.accessToken))); // 400
    check("get", SESSION, await t.http.get("/v1/games/sessions/00000000-0000-4000-8000-000000000000")); // 401
    check("post", ANSWER, await t.http.post("/v1/games/sessions/00000000-0000-4000-8000-000000000000/answers").send({ roundIndex: 0, answer: null })); // 401
    check("post", ANSWER, await t.http.post("/v1/games/sessions/00000000-0000-4000-8000-000000000000/answers").set(bearer(u.accessToken)).send({})); // 400 gövde
    check("post", FINISH, await t.http.post("/v1/games/sessions/xx/finish").set(bearer(u.accessToken))); // 400
    check("post", FINISH, await t.http.post("/v1/games/sessions/00000000-0000-4000-8000-000000000000/finish")); // 401
    check("post", FINISH, await t.http.post("/v1/games/sessions/00000000-0000-4000-8000-000000000000/finish").set(bearer(u.accessToken))); // 404
  });

  it("havuz yetersizken başlatma 409 GAME_POOL_TOO_SMALL (belgelenmiş)", async () => {
    const empty = await createTestApp(); // ülke tohumu yok
    try {
      const u = await registerUser(empty.http);
      const res = await empty.http.post("/v1/games/flag-quiz/sessions").set(bearer(u.accessToken));
      check("post", START, { status: res.status, body: res.body, text: res.text });
      expect(res.status).toBe(409);
    } finally {
      await empty.close();
    }
  });

  it("liderlik, /me, istatistik, puan geçmişi ve yönetici uçları", async () => {
    const admin = await createAdmin(t);
    const u = await registerUser(t.http, { displayName: "Liderlik Şeması" });
    const rookie = await registerUser(t.http, { displayName: "Çaylak" });
    const bad = await registerUser(t.http, { displayName: "Devre Dışı" });
    await insertScore(t, { userId: u.user.id, gameType: "flag-quiz", score: 1_200 });
    await insertScore(t, { userId: u.user.id, gameType: "map-guess", score: 3_000 });
    const hiddenId = await insertScore(t, { userId: bad.user.id, gameType: "flag-quiz", score: 1_900, durationMs: 60 });
    await t.http.patch(`/v1/users/${bad.user.id}`).set(bearer(admin.accessToken)).send({ disabled: true }).expect(200);

    for (const type of ["flag-quiz", "capital-quiz", "map-guess", "overall"]) {
      for (const q of ["", "?period=week&limit=3", "?period=day"]) {
        check("get", BOARD, await t.http.get(`/v1/leaderboards/${type}${q}`));
        check("get", BOARD, await t.http.get(`/v1/leaderboards/${type}${q}`).set(bearer(u.accessToken)));
        const meQuery = q.replace(/&limit=\d+/, "");
        check("get", BOARD_ME, await t.http.get(`/v1/leaderboards/${type}/me${meQuery}`).set(bearer(u.accessToken)));
        check("get", BOARD_ME, await t.http.get(`/v1/leaderboards/${type}/me${meQuery}`).set(bearer(rookie.accessToken))); // rank/personalBest null
      }
    }
    check("get", BOARD, await t.http.get("/v1/leaderboards/flag-quiz?limit=0")); // 400
    check("get", BOARD, await t.http.get("/v1/leaderboards/chess")); // 400
    check("get", BOARD, await t.http.get("/v1/leaderboards/flag-quiz").set("Authorization", "Bearer bozuk")); // 401
    check("get", BOARD_ME, await t.http.get("/v1/leaderboards/flag-quiz/me")); // 401
    check("get", BOARD_ME, await t.http.get("/v1/leaderboards/chess/me").set(bearer(u.accessToken))); // 400

    check("get", "/v1/users/me/stats", await t.http.get("/v1/users/me/stats").set(bearer(u.accessToken)));
    check("get", "/v1/users/me/stats", await t.http.get("/v1/users/me/stats").set(bearer(rookie.accessToken)));
    check("get", "/v1/users/me/stats", await t.http.get("/v1/users/me/stats"));
    check("get", "/v1/users/me/scores", await t.http.get("/v1/users/me/scores?pageSize=1").set(bearer(u.accessToken)));
    check("get", "/v1/users/me/scores", await t.http.get("/v1/users/me/scores?pageSize=0").set(bearer(u.accessToken)));
    check("get", "/v1/users/me/scores", await t.http.get("/v1/users/me/scores"));

    check("get", "/v1/scores", await t.http.get("/v1/scores").set(bearer(admin.accessToken)));
    check("get", "/v1/scores", await t.http.get(`/v1/scores?userId=${bad.user.id}&maxDurationMs=100`).set(bearer(admin.accessToken)));
    check("get", "/v1/scores", await t.http.get("/v1/scores?userId=xx").set(bearer(admin.accessToken)));
    check("get", "/v1/scores", await t.http.get("/v1/scores"));
    check("get", "/v1/scores", await t.http.get("/v1/scores").set(bearer(u.accessToken)));

    check("delete", "/v1/scores/{id}", await t.http.delete(`/v1/scores/${hiddenId}`).set(bearer(u.accessToken))); // 403
    check("delete", "/v1/scores/{id}", await t.http.delete(`/v1/scores/${hiddenId}`)); // 401
    check("delete", "/v1/scores/{id}", await t.http.delete("/v1/scores/zz").set(bearer(admin.accessToken))); // 400
    check("delete", "/v1/scores/{id}", await t.http.delete(`/v1/scores/${hiddenId}`).set(bearer(admin.accessToken))); // 204
    check("delete", "/v1/scores/{id}", await t.http.delete(`/v1/scores/${hiddenId}`).set(bearer(admin.accessToken))); // 404
  });

  it("hiçbir yanıt şemayla çelişmiyor; belgelenen her durum (429 hariç) üretildi", () => {
    expect(problems).toEqual([]);
    for (const id of GAME_OPERATIONS) {
      const entry = Object.entries(doc.paths).flatMap(([path, item]) => Object.entries(item as Record<string, { operationId?: string; responses?: Record<string, unknown> }>).map(([method, op]) => ({ path, method, op }))).find((e) => e.op.operationId === id);
      expect(entry, id).toBeDefined();
      const documented = Object.keys(entry!.op.responses ?? {}).filter((s) => s !== "429").map(Number);
      const seen = exercised.get(id) ?? new Set<number>();
      expect([...seen].sort(), `${id} üretilen durumlar`).toEqual(expect.arrayContaining(documented.sort()));
      for (const status of seen) expect(documented, `${id} ${status} belgesiz`).toContain(status);
    }
  });

  it("doğrulayıcı gerçekten ayırt eder (kendi sağlaması): tür, null, zorunlu alan, enum ve tanımsız alan hataları yakalanır", () => {
    const d: OpenApiLike = {
      paths: {},
      components: { schemas: { Item: { type: "object", required: ["a", "k"], properties: { a: { type: "integer", minimum: 1 }, k: { type: "string", enum: ["x", "y"] }, n: { type: "string", format: "uuid", nullable: true } } } } },
    };
    const ref = { $ref: "#/components/schemas/Item" };
    expect(checkAgainstSchema(d, ref, { a: 1, k: "x", n: null })).toEqual([]);
    expect(checkAgainstSchema(d, ref, { a: 0, k: "x" })).toHaveLength(1); // minimum
    expect(checkAgainstSchema(d, ref, { a: 1.5, k: "x" })).toHaveLength(1); // integer değil
    expect(checkAgainstSchema(d, ref, { a: 1, k: "z" })).toHaveLength(1); // enum
    expect(checkAgainstSchema(d, ref, { a: 1 })).toHaveLength(1); // zorunlu k yok
    expect(checkAgainstSchema(d, ref, { a: 1, k: "x", extra: 1 })).toHaveLength(1); // tanımsız alan
    expect(checkAgainstSchema(d, ref, { a: 1, k: "x", n: "uuid-degil" })).toHaveLength(1); // uuid biçimi
    expect(checkAgainstSchema(d, ref, { a: null, k: "x" })).toHaveLength(1); // null değil
    expect(checkAgainstSchema(d, { allOf: [ref], nullable: true, type: "object" }, null)).toEqual([]); // nullable + allOf
  });
});
