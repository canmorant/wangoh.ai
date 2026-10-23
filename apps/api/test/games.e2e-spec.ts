import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { GAME_TYPES, type GameType } from "../src/db/schema/enums.js";
import { gameSessions, scores, users } from "../src/db/schema/index.js";
import { FEEDBACK_GRACE_MS, MAX_STALE_SESSIONS_PER_USER } from "../src/games/games.constants.js";
import { seededRng } from "../src/games/rng.js";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";
import {
  correctAnswerOf,
  finish,
  fixtureCountries,
  gameClock,
  gameRandom,
  keysIn,
  numbersIn,
  playThrough,
  secretRounds,
  seedGameCountries,
  startGame,
  submit,
  wrongAnswerOf,
} from "./helpers/games.js";

const ROUNDS: Record<GameType, number> = { "flag-quiz": 10, "capital-quiz": 10, "map-guess": 5 };

/** Oyun saatini sabitler; `advance` ile ilerletilir. */
function fakeClock(t: TestApp, at = Date.now()) {
  let now = at;
  vi.spyOn(gameClock(t), "now").mockImplementation(() => new Date(now));
  return {
    advance: (ms: number) => {
      now += ms;
    },
    set: (ms: number) => {
      now = ms;
    },
    get now() {
      return now;
    },
  };
}

describe("oyunlar: oturum akışı", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t);
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());
  afterEach(() => vi.restoreAllMocks());

  const newUser = (displayName = "Oyuncu") => registerUser(t.http, { displayName });
  const sessionRow = async (id: string) => (await t.db.select().from(gameSessions).where(eq(gameSessions.id, id)))[0]!;
  const scoreRows = (sessionId: string) => t.db.select().from(scores).where(eq(scores.sessionId, sessionId));
  const getSession = (token: string, id: string, query = "") => t.http.get(`/v1/games/sessions/${id}${query}`).set(bearer(token));

  describe("erişim", () => {
    it("tüm oyun uçları anonimi 401 AUTH_REQUIRED ile reddeder; liderlik listesi herkese açık", async () => {
      const id = randomUUID();
      const routes: Array<[string, string]> = [
        ["post", "/v1/games/flag-quiz/sessions"],
        ["get", `/v1/games/sessions/${id}`],
        ["post", `/v1/games/sessions/${id}/answers`],
        ["post", `/v1/games/sessions/${id}/finish`],
        ["get", "/v1/leaderboards/flag-quiz/me"],
        ["get", "/v1/users/me/stats"],
        ["get", "/v1/users/me/scores"],
        ["delete", `/v1/scores/${id}`],
      ];
      for (const [method, url] of routes) {
        const res = await (t.http as any)[method](url).send({ roundIndex: 0, answer: "AA" });
        expect(res.status, `${method} ${url}`).toBe(401);
        expect(res.body.code).toBe("AUTH_REQUIRED");
      }
      expect((await t.http.get("/v1/leaderboards/flag-quiz")).status).toBe(200);
    });

    it("geçersiz oyun türü 400, geçersiz oturum kimliği 400, olmayan oturum 404", async () => {
      const u = await newUser();
      const bad = await t.http.post("/v1/games/chess/sessions").set(bearer(u.accessToken));
      expect(bad.status).toBe(400);
      expect(bad.body.code).toBe("VALIDATION_FAILED");
      expect(bad.body.details[0].field).toBe("gameType");
      expect((await t.http.post("/v1/games/overall/sessions").set(bearer(u.accessToken))).status).toBe(400);
      expect((await getSession(u.accessToken, "yok")).status).toBe(400);
      const missing = await getSession(u.accessToken, randomUUID());
      expect(missing.status).toBe(404);
      expect(missing.body.code).toBe("NOT_FOUND");
    });
  });

  describe.each(GAME_TYPES)("tam akış: %s", (type) => {
    it("başlat → tüm turları oyna → bitir → yinelenen bitir aynı sonucu verir", async () => {
      const u = await newUser("Akış Oyuncusu");
      const total = ROUNDS[type];
      const start = await startGame(t, u.accessToken, type);

      expect(start.gameType).toBe(type);
      expect(start.roundsTotal).toBe(total);
      expect(start.round.index).toBe(0);
      expect(start.round.timeLimitMs).toBe(20_000);
      expect(Date.parse(start.round.deadlineAt) - Date.parse(start.round.startedAt)).toBe(20_000);
      if (type === "map-guess") expect(start.round.options).toBeNull();
      else {
        expect(start.round.options).toHaveLength(4);
        expect(new Set(start.round.options!.map((o) => o.id)).size).toBe(4);
        for (const o of start.round.options!) expect(Object.keys(o).sort()).toEqual(["id", "label"]);
      }
      if (type === "flag-quiz") {
        expect(start.round.question.flagUrl).toMatch(/\/flags\/[a-z]{2}\.svg$/);
        expect(start.round.question.flag).toMatch(/^flag-/);
        expect(start.round.question.countryName).toBeNull();
      } else {
        expect(start.round.question.countryName).toMatch(/^Ülke /);
        expect(start.round.question.flagUrl).toBeNull();
      }

      const rounds = await secretRounds(t, start.sessionId);
      expect(rounds).toHaveLength(total);
      expect(new Set(rounds.map((r) => r.code)).size).toBe(total);

      const row0 = await sessionRow(start.sessionId);
      expect(row0.status).toBe("active");
      expect(row0.expiresAt.getTime() - row0.startedAt.getTime()).toBe(30 * 60 * 1000);

      let running = 0;
      let nextRound = start.round;
      for (let i = 0; i < total; i++) {
        expect(nextRound.index).toBe(i);
        const res = await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, type));
        expect(res.status).toBe(200);
        expect(res.headers["cache-control"]).toBe("no-store");
        expect(res.body).toMatchObject({ correct: true, timedOut: false, correctAnswer: { code: rounds[i]!.code } });
        expect(res.body.points).toBeGreaterThan(type === "map-guess" ? 999 : 99);
        running += res.body.points;
        expect(res.body.score).toBe(running);
        if (type === "map-guess") {
          expect(res.body.points).toBe(1000);
          expect(res.body.distanceKm).toBe(0);
          expect(res.body.correctAnswer.lat).toBeCloseTo(rounds[i]!.latitude!, 9);
          expect(res.body.correctAnswer.lng).toBeCloseTo(rounds[i]!.longitude!, 9);
        } else {
          expect(res.body.distanceKm).toBeNull();
          expect(res.body.correctAnswer.lat).toBeNull();
        }
        if (i < total - 1) {
          expect(res.body.nextRound.index).toBe(i + 1);
          nextRound = res.body.nextRound;
        } else expect(res.body.nextRound).toBeNull();
      }

      const mid = await getSession(u.accessToken, start.sessionId);
      expect(mid.body).toMatchObject({ status: "active", currentRound: total, round: null, score: running, correctCount: total });
      expect(await scoreRows(start.sessionId)).toHaveLength(0); // bitirilmeden puan yazılmaz

      const done = await finish(t, u.accessToken, start.sessionId);
      expect(done.status).toBe(200);
      expect(done.body).toMatchObject({
        sessionId: start.sessionId,
        gameType: type,
        score: running,
        correctCount: total,
        roundsTotal: total,
        isPersonalBest: true,
        personalBest: running,
      });
      expect(done.body.rank).toBeGreaterThanOrEqual(1);
      expect(done.body.durationMs).toBeGreaterThanOrEqual(0);

      // İdempotent: ikinci çağrı aynı gövdeyi döner, tek puan satırı kalır.
      const again = await finish(t, u.accessToken, start.sessionId);
      expect(again.status).toBe(200);
      expect(again.body).toEqual(done.body);
      const rows = await scoreRows(start.sessionId);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ userId: u.user.id, gameType: type, score: running, roundsTotal: total, correctCount: total });
      expect(rows[0]!.id).toBe(done.body.scoreId);

      const after = await getSession(u.accessToken, start.sessionId);
      expect(after.body).toMatchObject({ status: "finished", round: null, score: running });
      expect(after.body.finishedAt).not.toBeNull();
      expect(after.body.results).toHaveLength(total);
    });

    it("karışık cevaplar: yanlışlar 0 puan, correctCount ve skor tutarlı", async () => {
      const u = await newUser();
      const wrongOn = new Set([1, 4]);
      const played = await playThrough(t, u.accessToken, type, { correct: (i) => !wrongOn.has(i) });
      const total = ROUNDS[type];
      played.answers.forEach((a, i) => {
        if (wrongOn.has(i)) {
          expect(a.correct).toBe(false);
          if (type !== "map-guess") expect(a.points).toBe(0);
          else expect(a.points).toBeLessThan(500);
          expect(a.timedOut).toBe(false);
        } else expect(a.correct).toBe(true);
      });
      expect(played.finish.correctCount).toBe(total - 2);
      expect(played.finish.score).toBe(played.answers.reduce((s, a) => s + a.points, 0));
    });
  });

  describe("puanlama (sunucu saatiyle)", () => {
    it("çoktan seçmeli: hız bonusu 0 ms'de 50, 15000 ms'de 0, ötesinde 0; seri bonusu bu turu sayar (ilk tur oturumdan, sonrakiler geri bildirim payından sonra ölçülür)", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["flag-quiz"];
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const right = (i: number) => correctAnswerOf(rounds[i]!, "flag-quiz");

      const r0 = await submit(t, u.accessToken, start.sessionId, 0, right(0)); // 0 ms
      expect(r0.body).toMatchObject({ points: 150, speedBonus: 50, streakBonus: 0, streak: 1 });
      clock.advance(G + 15_000);
      const r1 = await submit(t, u.accessToken, start.sessionId, 1, right(1)); // tur başlangıcından tam 15000 ms
      expect(r1.body).toMatchObject({ points: 110, speedBonus: 0, streakBonus: 10, streak: 2 });
      clock.advance(G + 15_001);
      const r2 = await submit(t, u.accessToken, start.sessionId, 2, right(2));
      expect(r2.body).toMatchObject({ points: 120, speedBonus: 0, streakBonus: 20, streak: 3 });
      clock.advance(G + 7_500);
      const r3 = await submit(t, u.accessToken, start.sessionId, 3, wrongAnswerOf(rounds[3]!, "flag-quiz"));
      expect(r3.body).toMatchObject({ correct: false, points: 0, streak: 0, speedBonus: 0, streakBonus: 0 });
      const r4 = await submit(t, u.accessToken, start.sessionId, 4, right(4)); // pay içinde (0 ms), seri sıfırdan
      expect(r4.body).toMatchObject({ points: 150, streak: 1 });
      clock.advance(G + 7_500);
      const r5 = await submit(t, u.accessToken, start.sessionId, 5, right(5));
      expect(r5.body).toMatchObject({ speedBonus: 25, streakBonus: 10, points: 135, streak: 2 });
      expect(r5.body.score).toBe(150 + 110 + 120 + 0 + 150 + 135);
    });

    it("skor tavanları: çoktan seçmeli kusursuz oyun 1850 (≤ 2000), harita 5000", async () => {
      const u = await newUser();
      fakeClock(t); // saat hiç ilerlemez: her cevap 0 ms
      for (const type of ["flag-quiz", "capital-quiz"] as const) {
        const played = await playThrough(t, u.accessToken, type);
        expect(played.finish.score).toBe(1850);
        expect(played.finish.score).toBeLessThanOrEqual(2000);
        expect(played.answers.map((a) => a.points)).toEqual([150, 160, 170, 180, 190, 200, 200, 200, 200, 200]);
      }
      const map = await playThrough(t, u.accessToken, "map-guess");
      expect(map.finish.score).toBe(5000);
    });

    it("harita: uzaklık haversine ile, puan web formülüyle; ipucu ya da hız etkilemez", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      const target = { lat: rounds[0]!.latitude!, lng: rounds[0]!.longitude! };
      const guess = { lat: Math.max(-90, Math.min(90, target.lat + 3)), lng: target.lng };
      const res = await submit(t, u.accessToken, start.sessionId, 0, guess);
      expect(res.status).toBe(200);
      const km = Math.abs(guess.lat - target.lat) * (Math.PI * 6371) / 180;
      expect(res.body.distanceKm).toBe(Math.round(km));
      expect(res.body.points).toBe(Math.round(1000 * Math.exp(-(Math.round(km) - 50) / 1200)));
      expect(res.body.correct).toBe(res.body.points >= 500);
      expect(res.body.speedBonus).toBe(0);
      expect(res.body.streakBonus).toBe(0);
    });

    it("durationMs gerçek duvar saati toplamıdır (oturum başından son cevaba; geri bildirim payı dahil): zaman aşımı ve pas dahil; finish, geçmiş ve yönetici listesinde aynı", async () => {
      const u = await newUser();
      const admin2 = await createAdmin(t);
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["flag-quiz"];
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      // Her cevaptan önce geçen gerçek süre (ilk tur için oturumdan, sonrakiler için önceki cevaptan); bazıları pay içinde.
      const advances = [0, 400, 1_000, G + 2_500, 250, G + 20_000, G + 22_999, G + 23_001, 7, G + 14_999];
      for (let i = 0; i < 10; i++) {
        clock.advance(advances[i]!);
        const res = await submit(t, u.accessToken, start.sessionId, i, i % 2 === 0 ? correctAnswerOf(rounds[i]!, "flag-quiz") : null);
        expect(res.status).toBe(200);
      }
      const total = advances.reduce((a, b) => a + b, 0);
      const done = await finish(t, u.accessToken, start.sessionId);
      expect(done.body.durationMs).toBe(total);
      expect((await t.http.get("/v1/users/me/scores").set(bearer(u.accessToken))).body.items[0].durationMs).toBe(total);
      const adminView = await t.http.get(`/v1/scores?sessionId=${start.sessionId}`).set(bearer(admin2.accessToken));
      expect(adminView.body.items[0].durationMs).toBe(total);
      expect((await t.http.get(`/v1/scores?sessionId=${start.sessionId}&maxDurationMs=${total}`).set(bearer(admin2.accessToken))).body.total).toBe(1);
      expect((await t.http.get(`/v1/scores?sessionId=${start.sessionId}&maxDurationMs=${total - 1}`).set(bearer(admin2.accessToken))).body.total).toBe(0);
      // Tur başına ölçülen süre pay düşülmüş ve 0'a kıskaçlıdır; durationMs bunların toplamı DEĞİL.
      const stored = (await secretRounds(t, start.sessionId)).map((r) => r.result!.elapsedMs);
      expect(stored).toEqual(advances.map((a, i) => (i === 0 ? a : Math.max(0, a - G))));
      expect(stored.reduce((a, b) => a + b, 0)).toBeLessThan(total);
    });

    it("tüm turlar geri bildirim payı içinde cevaplansa da durationMs gerçek süreyi taşır (hile için süre alt sınırı bozulmaz)", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 10; i++) {
        clock.advance(i === 0 ? 0 : 100); // ilk tur anında, sonrakiler 100 ms: payın (2 sn) çok içinde
        expect((await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "flag-quiz"))).body.speedBonus).toBe(50);
      }
      expect((await secretRounds(t, start.sessionId)).every((r) => r.result!.elapsedMs === 0)).toBe(true); // tur sürelerinin toplamı 0
      expect((await finish(t, u.accessToken, start.sessionId)).body.durationMs).toBe(900); // gerçek süre: 9 × 100 ms'

    });

    it("harita: 'doğru' sayısı tur puanı ≥ 500 ile sayılır; 1-499 puan alan yakın ama uzak tahmin puan getirir, doğru sayılmaz", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      const target = { lat: rounds[0]!.latitude!, lng: rounds[0]!.longitude! };
      // ~1500 km kuzey ya da güney (enlem sınırı aşılmasın): puan ≈ 1000·exp(-1450/1200) ≈ 299
      const dLat = (1500 * 180) / (Math.PI * 6371);
      const guess = { lat: target.lat + (target.lat + dLat <= 90 ? dLat : -dLat), lng: target.lng };
      const res = await submit(t, u.accessToken, start.sessionId, 0, guess);
      expect(res.body.distanceKm).toBe(1500);
      expect(res.body.points).toBe(Math.round(1000 * Math.exp(-1450 / 1200)));
      expect(res.body.points).toBeGreaterThan(0);
      expect(res.body.points).toBeLessThan(500);
      expect(res.body.correct).toBe(false);
      expect((await sessionRow(start.sessionId)).correctCount).toBe(0);
      expect((await sessionRow(start.sessionId)).score).toBe(res.body.points);
    });

    it("zaman aşımı: 20 sn + 3 sn ağ payı (dahil) kabul, ötesi 0 puan ve doğru cevap bile sayılmaz; ilk tur oturumdan, sonrakiler geri bildirim payından sonra ölçülür", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["capital-quiz"];
      const start = await startGame(t, u.accessToken, "capital-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const right = (i: number) => correctAnswerOf(rounds[i]!, "capital-quiz");

      clock.advance(23_000); // tam sınır: kabul edilir (hız bonusu yok)
      const onTime = await submit(t, u.accessToken, start.sessionId, 0, right(0));
      expect(onTime.body).toMatchObject({ correct: true, timedOut: false, points: 100, speedBonus: 0 });

      clock.advance(G + 23_001); // tur başlangıcından 1 ms geç
      const late = await submit(t, u.accessToken, start.sessionId, 1, right(1));
      expect(late.status).toBe(200);
      expect(late.body).toMatchObject({ correct: false, timedOut: true, points: 0, streak: 0, score: 100 });
      expect(late.body.correctAnswer.code).toBe(rounds[1]!.code); // doğru cevap açıklanır, puan yok
      expect(late.body.nextRound.index).toBe(2);

      const next = await submit(t, u.accessToken, start.sessionId, 2, right(2)); // pay içinde: 0 ms, seri yeniden başlar
      expect(next.body).toMatchObject({ correct: true, points: 150, streak: 1 });
      const session = await getSession(u.accessToken, start.sessionId);
      expect(session.body.results).toEqual([
        { index: 0, correct: true, points: 100, timedOut: false },
        { index: 1, correct: false, points: 0, timedOut: true },
        { index: 2, correct: true, points: 150, timedOut: false },
      ]);
    });

    it("zaman aşımına uğrayan harita turu da geçerli biçimli cevap ister ve 0 puan verir", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      clock.advance(60_000);
      const bad = await submit(t, u.accessToken, start.sessionId, 0, { lat: 100, lng: 0 });
      expect(bad.status).toBe(400);
      const late = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "map-guess"));
      expect(late.body).toMatchObject({ correct: false, timedOut: true, points: 0, distanceKm: null });
    });

    it("istemci süre bildiremez: gövdedeki ek alan (ms, elapsedMs...) 400", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const res = await t.http
        .post(`/v1/games/sessions/${start.sessionId}/answers`)
        .set(bearer(u.accessToken))
        .send({ roundIndex: 0, answer: rounds[0]!.code, elapsedMs: 1 });
      expect(res.status).toBe(400);
      expect(res.body.details[0]).toMatchObject({ field: "elapsedMs", code: "whitelistValidation" });
    });
  });

  describe("geri bildirim payı: sonraki turun sayacı cevap anı + pay'da başlar", () => {
    it("pay sabitleri: çoktan seçmeli 2 sn, harita 5 sn", () => {
      expect(FEEDBACK_GRACE_MS).toEqual({ "flag-quiz": 2_000, "capital-quiz": 2_000, "map-guess": 5_000 });
    });

    it.each(GAME_TYPES)("%s: nextRound.startedAt = cevap anı + pay, deadlineAt = +20 sn; geri yükleme aynı turu verir; oturum süresi uzamaz", async (type) => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS[type];
      const start = await startGame(t, u.accessToken, type);
      const rounds = await secretRounds(t, start.sessionId);
      const t0 = clock.now;
      expect(Date.parse(start.round.startedAt)).toBe(t0); // ilk tur: oturum oluşunca
      expect(Date.parse(start.round.deadlineAt)).toBe(t0 + 20_000);

      clock.advance(300);
      const a0 = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, type));
      expect(Date.parse(a0.body.nextRound.startedAt)).toBe(t0 + 300 + G);
      expect(Date.parse(a0.body.nextRound.deadlineAt)).toBe(t0 + 300 + G + 20_000);
      const row = await sessionRow(start.sessionId);
      expect(row.roundStartedAt!.getTime()).toBe(t0 + 300 + G);
      expect(row.expiresAt.getTime() - row.startedAt.getTime()).toBe(30 * 60 * 1000); // pay oturum ömrünü bozmaz
      const restored = await getSession(u.accessToken, start.sessionId);
      expect(restored.body.round).toEqual(a0.body.nextRound);

      // Son tur: sonraki tur yok, saat temizlenir.
      for (let i = 1; i < rounds.length; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, type));
      expect((await sessionRow(start.sessionId)).roundStartedAt).toBeNull();
    });

    it("pay içinde cevaplanan tur tam hız bonusu alır; negatif süre 0'a kıskaçlanır; paydan sonra bonus normal azalır", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["flag-quiz"];
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const right = (i: number) => correctAnswerOf(rounds[i]!, "flag-quiz");
      const bonus = async (i: number, wait: number) => {
        clock.advance(wait);
        const res = await submit(t, u.accessToken, start.sessionId, i, right(i));
        expect(res.status).toBe(200);
        return res.body.speedBonus as number;
      };

      expect(await bonus(0, 0)).toBe(50);
      expect(await bonus(1, 1)).toBe(50); // payın hemen başında: süre negatif, 0 sayılır
      expect(await bonus(2, G - 1)).toBe(50); // payın bitmesine 1 ms kala
      expect(await bonus(3, G)).toBe(50); // pay biter bitmez: 0 ms
      expect(await bonus(4, G + 1)).toBe(50); // 1 ms
      expect(await bonus(5, G + 7_500)).toBe(25);
      expect(await bonus(6, G + 14_999)).toBe(0); // 14999 ms: round(0,003) = 0
      expect(await bonus(7, G + 15_000)).toBe(0);
      expect(await bonus(8, G + 3_000)).toBe(40);
      // Saklanan süre pay düşülmüş ve hiçbir zaman negatif değildir.
      const stored = (await secretRounds(t, start.sessionId)).slice(0, 9).map((r) => r.result!.elapsedMs);
      expect(stored).toEqual([0, 0, 0, 0, 1, 7_500, 14_999, 15_000, 3_000]);
      expect(stored.every((ms) => ms >= 0)).toBe(true);
    });

    it("pay yokmuş gibi hesaplanan süre artık bonusu yemez: pay süresi kadar bekleyen kullanıcı, beklemeyenle aynı bonusu alır", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["flag-quiz"];
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      clock.advance(G); // geri bildirim süresi kadar bekledi (eskiden bu 2000 ms = bonus 43 olurdu)
      const res = await submit(t, u.accessToken, start.sessionId, 1, correctAnswerOf(rounds[1]!, "flag-quiz"));
      expect(res.body.speedBonus).toBe(50);
    });

    it("zaman aşımı sınırı aynı başlangıçtan ölçülür: cevap 23 sn + pay'a, cevapsız tur 20 sn + pay'a kadar kabul", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["flag-quiz"];
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const right = (i: number) => correctAnswerOf(rounds[i]!, "flag-quiz");
      await submit(t, u.accessToken, start.sessionId, 0, right(0));

      clock.advance(23_001); // eskiden zaman aşımıydı (cevap anından 23001 ms); şimdi turun 21001. ms'si
      expect((await submit(t, u.accessToken, start.sessionId, 1, right(1))).body).toMatchObject({ timedOut: false, correct: true, speedBonus: 0 });
      clock.advance(G + 23_000);
      expect((await submit(t, u.accessToken, start.sessionId, 2, right(2))).body).toMatchObject({ timedOut: false, correct: true });
      clock.advance(G + 23_001);
      expect((await submit(t, u.accessToken, start.sessionId, 3, right(3))).body).toMatchObject({ timedOut: true, correct: false, points: 0 });
      clock.advance(G + 20_000);
      expect((await submit(t, u.accessToken, start.sessionId, 4, null)).body.timedOut).toBe(false);
      clock.advance(G + 20_001);
      expect((await submit(t, u.accessToken, start.sessionId, 5, null)).body.timedOut).toBe(true);
    });

    it("harita: sonucu 20 sn'den uzun inceleyen kullanıcı sonraki turu kaybetmez (pay 5 sn); ötesinde zaman aşımı", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS["map-guess"];
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      const right = (i: number) => correctAnswerOf(rounds[i]!, "map-guess");
      const first = await submit(t, u.accessToken, start.sessionId, 0, right(0));
      expect(first.body.points).toBe(1000);

      clock.advance(24_000); // mesafe/puan ekranında 24 sn; eskiden sonraki tur 23 sn sınırını aşıp 0 puan olurdu
      const reviewed = await submit(t, u.accessToken, start.sessionId, 1, right(1));
      expect(reviewed.body).toMatchObject({ timedOut: false, correct: true, points: 1000 });

      clock.advance(G + 23_000);
      expect((await submit(t, u.accessToken, start.sessionId, 2, right(2))).body).toMatchObject({ timedOut: false, points: 1000 });
      clock.advance(G + 23_001);
      expect((await submit(t, u.accessToken, start.sessionId, 3, right(3))).body).toMatchObject({ timedOut: true, points: 0 });
    });

    it("oturum süresi (30 dk) paydan etkilenmez: son kullanma anı sabit, ondan sonra cevap 410", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "map-guess"));
      expect((await sessionRow(start.sessionId)).expiresAt.toISOString()).toBe(start.expiresAt);
      clock.set(Date.parse(start.expiresAt));
      expect((await submit(t, u.accessToken, start.sessionId, 1, correctAnswerOf(rounds[1]!, "map-guess"))).status).toBe(410);
    });
  });

  describe("serverNow: istemci geri sayımı aygıt saatinden bağımsız kurar", () => {
    const remaining = (round: { deadlineAt: string; serverNow: string }) => Date.parse(round.deadlineAt) - Date.parse(round.serverNow);
    const untilStart = (round: { startedAt: string; serverNow: string }) => Math.max(0, Date.parse(round.startedAt) - Date.parse(round.serverNow));

    it.each(GAME_TYPES)("%s: start, cevap (nextRound) ve GET geri yükleme turlarında serverNow var; belirleyici saatte değerler tam", async (type) => {
      const u = await newUser();
      const clock = fakeClock(t);
      const G = FEEDBACK_GRACE_MS[type];
      const t0 = clock.now;
      const start = await startGame(t, u.accessToken, type);
      const rounds = await secretRounds(t, start.sessionId);

      // İlk tur: sayaç oturumla başladı; startedAt - serverNow <= 0, kalan süre tur süresi.
      expect(start.round.serverNow).toBe(new Date(t0).toISOString());
      expect(Date.parse(start.round.startedAt) - Date.parse(start.round.serverNow)).toBe(0);
      expect(untilStart(start.round)).toBe(0);
      expect(remaining(start.round)).toBe(20_000);

      // Cevap sonrası nextRound: startedAt - serverNow = tam pay.
      clock.advance(300);
      const a0 = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, type));
      const next = a0.body.nextRound;
      expect(next.serverNow).toBe(new Date(t0 + 300).toISOString());
      expect(Date.parse(next.startedAt) - Date.parse(next.serverNow)).toBe(G);
      expect(untilStart(next)).toBe(G);
      expect(remaining(next)).toBe(G + 20_000);

      // GET geri yükleme: serverNow o anki saat; pay içinde kalan başlama süresi azalır, pay bitince 0, kalan süre tur süresi kadar sınırlı.
      clock.advance(700);
      const mid = (await getSession(u.accessToken, start.sessionId)).body.round;
      expect(mid.serverNow).toBe(new Date(t0 + 1_000).toISOString());
      expect(untilStart(mid)).toBe(G - 700);
      expect(remaining(mid)).toBe(G - 700 + 20_000);
      clock.advance(G); // payın bitiminden 700 ms sonrası
      const after = (await getSession(u.accessToken, start.sessionId)).body.round;
      expect(Date.parse(after.startedAt) - Date.parse(after.serverNow)).toBe(-700);
      expect(untilStart(after)).toBe(0);
      expect(remaining(after)).toBe(20_000 - 700);
      // Sabit alanlar serverNow'dan bağımsız aynı tur.
      expect({ ...after, serverNow: null }).toEqual({ ...next, serverNow: null });
    });

    it("gerçek saatte: ilk turda startedAt - serverNow <= 0 ve serverNow geçerli ISO; nextRound'da pay'a yakın (ve pay'dan büyük değil)", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      expect(start.round.serverNow).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(Date.parse(start.round.startedAt) - Date.parse(start.round.serverNow)).toBeLessThanOrEqual(0);
      expect(Math.abs(Date.parse(start.round.serverNow) - Date.now())).toBeLessThan(5_000);

      const a0 = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      const wait = Date.parse(a0.body.nextRound.startedAt) - Date.parse(a0.body.nextRound.serverNow);
      expect(wait).toBeLessThanOrEqual(FEEDBACK_GRACE_MS["flag-quiz"]); // serverNow cevap anından sonra üretilir
      expect(wait).toBeGreaterThan(FEEDBACK_GRACE_MS["flag-quiz"] - 2_000);
      const got = (await getSession(u.accessToken, start.sessionId)).body.round;
      expect(Date.parse(got.serverNow)).toBeGreaterThanOrEqual(Date.parse(a0.body.nextRound.serverNow));
    });

    it("tur yoksa (tüm turlar cevaplandı, bitmiş ya da süresi dolmuş) round null: serverNow yok", async () => {
      const u = await newUser();
      const played = await playThrough(t, u.accessToken, "map-guess");
      const body = (await getSession(u.accessToken, played.sessionId)).body;
      expect(body.round).toBeNull();
      expect(played.answers.at(-1)!.nextRound).toBeNull();
    });
  });

  describe("tur sırası, yinelenen cevap, başkasının oturumu", () => {
    it("sırası bozuk roundIndex 409; yinelenen cevap 409 ve puan bir kez sayılır", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const ahead = await submit(t, u.accessToken, start.sessionId, 1, correctAnswerOf(rounds[1]!, "flag-quiz"));
      expect(ahead.status).toBe(409);
      expect(ahead.body.code).toBe("GAME_ROUND_OUT_OF_ORDER");
      expect((await sessionRow(start.sessionId)).currentRound).toBe(0);

      const first = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      expect(first.status).toBe(200);
      const dup = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      expect(dup.status).toBe(409);
      expect(dup.body.code).toBe("GAME_ROUND_ALREADY_ANSWERED");
      const row = await sessionRow(start.sessionId);
      expect(row.score).toBe(first.body.points);
      expect(row.correctCount).toBe(1);
      expect(row.currentRound).toBe(1);
    });

    it("eşzamanlı çift cevap: yalnız biri puan alır, öbürü 409", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const answer = correctAnswerOf(rounds[0]!, "flag-quiz");
      const results = await Promise.all(Array.from({ length: 6 }, () => submit(t, u.accessToken, start.sessionId, 0, answer)));
      const ok = results.filter((r) => r.status === 200);
      const conflict = results.filter((r) => r.status === 409);
      expect(ok).toHaveLength(1);
      expect(conflict).toHaveLength(5);
      expect(conflict.every((r) => r.body.code === "GAME_ROUND_ALREADY_ANSWERED")).toBe(true);
      const row = await sessionRow(start.sessionId);
      expect(row.score).toBe(ok[0]!.body.points);
      expect(row.currentRound).toBe(1);
      expect(row.correctCount).toBe(1);
    });

    it("tüm turlar bitince yeni cevap 409 (tur kalmadı / zaten cevaplandı), roundIndex doğrulanır", async () => {
      const u = await newUser();
      const played = await playThrough(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, played.sessionId);
      const extra = await submit(t, u.accessToken, played.sessionId, 5, correctAnswerOf(rounds[0]!, "map-guess"));
      expect(extra.status).toBe(409);

      const u2 = await newUser();
      const start = await startGame(t, u2.accessToken, "map-guess");
      const r2 = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 5; i++) await submit(t, u2.accessToken, start.sessionId, i, correctAnswerOf(r2[i]!, "map-guess"));
      const noRound = await submit(t, u2.accessToken, start.sessionId, 5, { lat: 1, lng: 1 });
      expect(noRound.status).toBe(409);
      expect(noRound.body.code).toBe("GAME_NO_ROUND_LEFT");
      for (const bad of [-1, 1.5, "0", 101, null, undefined]) {
        const res = await submit(t, u2.accessToken, start.sessionId, bad as number, { lat: 1, lng: 1 });
        expect(res.status, JSON.stringify(bad)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
    });

    it("başkasının oturumu her uçta 404 (varlığı sızmaz) ve oturum değişmez", async () => {
      const owner = await newUser();
      const other = await newUser();
      const start = await startGame(t, owner.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);

      const get = await getSession(other.accessToken, start.sessionId);
      const ans = await submit(t, other.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      const fin = await finish(t, other.accessToken, start.sessionId);
      const nonexistent = await getSession(other.accessToken, randomUUID());
      for (const res of [get, ans, fin]) {
        expect(res.status).toBe(404);
        expect(res.body).toEqual(nonexistent.body); // varlıkla yokluk ayırt edilemez
      }
      const row = await sessionRow(start.sessionId);
      expect([row.status, row.currentRound, row.score]).toEqual(["active", 0, 0]);
      // Yönetici bile başkasının oyun oturumunu oynayamaz.
      expect((await getSession(admin.accessToken, start.sessionId)).status).toBe(404);
      // Sahibi etkilenmeden devam eder.
      expect((await submit(t, owner.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"))).status).toBe(200);
    });

    it("bitirmeden önce 409 GAME_NOT_FINISHED ve puan yazılmaz", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "capital-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 9; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "capital-quiz"));
      const early = await finish(t, u.accessToken, start.sessionId);
      expect(early.status).toBe(409);
      expect(early.body.code).toBe("GAME_NOT_FINISHED");
      expect(await scoreRows(start.sessionId)).toHaveLength(0);
      expect((await sessionRow(start.sessionId)).status).toBe("active");
      await submit(t, u.accessToken, start.sessionId, 9, correctAnswerOf(rounds[9]!, "capital-quiz"));
      expect((await finish(t, u.accessToken, start.sessionId)).status).toBe(200);
    });

    it("eşzamanlı çift finish: tek puan satırı, ikisi de 200 ve aynı gövde", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 10; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "flag-quiz"));
      const results = await Promise.all(Array.from({ length: 6 }, () => finish(t, u.accessToken, start.sessionId)));
      expect(results.map((r) => r.status)).toEqual([200, 200, 200, 200, 200, 200]);
      for (const r of results) expect(r.body).toEqual(results[0]!.body);
      expect(await scoreRows(start.sessionId)).toHaveLength(1);
      expect(await t.db.select().from(scores).where(eq(scores.userId, u.user.id))).toHaveLength(1);
    });
  });

  describe("tek etkin oturum, süre dolması, bitmiş oturumlar", () => {
    it("yeni oturum aynı türdeki etkin oturumu abandoned yapar; diğer türler etkilenmez", async () => {
      const u = await newUser();
      const a = await startGame(t, u.accessToken, "flag-quiz");
      const other = await startGame(t, u.accessToken, "capital-quiz");
      const b = await startGame(t, u.accessToken, "flag-quiz");
      expect((await sessionRow(a.sessionId)).status).toBe("abandoned");
      expect((await sessionRow(b.sessionId)).status).toBe("active");
      expect((await sessionRow(other.sessionId)).status).toBe("active");

      const rounds = await secretRounds(t, a.sessionId);
      const old = await submit(t, u.accessToken, a.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      expect(old.status).toBe(409);
      expect(old.body.code).toBe("GAME_SESSION_NOT_ACTIVE");
      expect((await finish(t, u.accessToken, a.sessionId)).body.code).toBe("GAME_SESSION_NOT_ACTIVE");
      expect((await getSession(u.accessToken, a.sessionId)).body).toMatchObject({ status: "abandoned", round: null });
    });

    it("eşzamanlı başlatmalarda kullanıcı başına tür başına tam bir etkin oturum kalır", async () => {
      const u = await newUser();
      const results = await Promise.all(Array.from({ length: 8 }, () => t.http.post("/v1/games/map-guess/sessions").set(bearer(u.accessToken))));
      expect(results.every((r) => r.status === 201)).toBe(true);
      const rows = await t.db.select().from(gameSessions).where(and(eq(gameSessions.userId, u.user.id), eq(gameSessions.gameType, "map-guess")));
      expect(rows).toHaveLength(8);
      expect(rows.filter((r) => r.status === "active")).toHaveLength(1);
      expect(rows.filter((r) => r.status === "abandoned")).toHaveLength(7);
    });

    it("başlatma, kullanıcının 7 günden eski terk/süresi dolmuş oturumlarını temizler; puanlı, yeni ve başkasının kayıtları kalır", async () => {
      const u = await newUser();
      const other = await newUser();
      const day = 24 * 60 * 60 * 1000;
      const insert = async (userId: string, status: "abandoned" | "expired" | "finished" | "active", ageDays: number) => {
        const startedAt = new Date(Date.now() - ageDays * day);
        const [row] = await t.db
          .insert(gameSessions)
          .values({ userId, gameType: "flag-quiz", status, rounds: [], startedAt, expiresAt: new Date(startedAt.getTime() + 30 * 60 * 1000) })
          .returning({ id: gameSessions.id });
        return row!.id;
      };
      const oldAbandoned = await insert(u.user.id, "abandoned", 8);
      const oldExpired = await insert(u.user.id, "expired", 9);
      const oldStaleActive = await insert(u.user.id, "active", 10); // başlatma önce expired yapar, sonra siler
      const oldFinished = await insert(u.user.id, "finished", 8);
      const recentAbandoned = await insert(u.user.id, "abandoned", 1);
      const othersOld = await insert(other.user.id, "abandoned", 20);
      // Başka türde, hiç dokunulmamış ve çoktan süresi dolmuş "active" satır da (yalnız aynı tür değil) temizlenir.
      const [otherTypeStale] = await t.db
        .insert(gameSessions)
        .values({ userId: u.user.id, gameType: "map-guess", status: "active", rounds: [], startedAt: new Date(Date.now() - 12 * day), expiresAt: new Date(Date.now() - 12 * day + 30 * 60 * 1000) })
        .returning({ id: gameSessions.id });
      await startGame(t, u.accessToken, "flag-quiz");
      const remaining = new Set((await t.db.select({ id: gameSessions.id }).from(gameSessions)).map((r) => r.id));
      expect([oldAbandoned, oldExpired, oldStaleActive, otherTypeStale!.id].filter((id) => remaining.has(id))).toEqual([]);
      expect([oldFinished, recentAbandoned, othersOld].every((id) => remaining.has(id))).toBe(true);
    });

    it("kullanıcı başına terk edilmiş/süresi dolmuş kayıt sayısı sınırlıdır: en yeni N kalır, eskiler silinir; etkin, bitmiş ve başkasının oturumları sayılmaz", async () => {
      const u = await newUser();
      const other = await newUser();
      const otherStart = await startGame(t, other.accessToken, "flag-quiz");
      const finished = await playThrough(t, u.accessToken, "capital-quiz");
      const clock = fakeClock(t); // her başlatma farklı anda: "en yeni" sırası belirleyici
      const ids: string[] = [];
      for (let i = 0; i < MAX_STALE_SESSIONS_PER_USER + 12; i++) {
        clock.advance(1_000);
        ids.push((await startGame(t, u.accessToken, i % 3 === 0 ? "map-guess" : "flag-quiz")).sessionId);
      }
      const rows = await t.db.select().from(gameSessions).where(eq(gameSessions.userId, u.user.id));
      const active = rows.filter((r) => r.status === "active");
      expect(active).toHaveLength(2); // tür başına bir etkin oturum (map-guess ve flag-quiz)
      const staleRows = rows.filter((r) => r.status === "abandoned" || r.status === "expired");
      expect(staleRows).toHaveLength(MAX_STALE_SESSIONS_PER_USER);
      // Kalanlar, etkin olmayanların en yenileridir.
      const activeIds = new Set(active.map((r) => r.id));
      const expectedStale = ids.filter((id) => !activeIds.has(id)).slice(-MAX_STALE_SESSIONS_PER_USER);
      expect(staleRows.map((r) => r.id).sort()).toEqual([...expectedStale].sort());
      // En eski kayıt silindi (404), en yenisi durumunu söylüyor.
      expect((await getSession(u.accessToken, ids[0]!)).status).toBe(404);
      expect((await getSession(u.accessToken, expectedStale.slice(-1)[0]!)).body.status).toBe("abandoned");
      // Bitmiş (puanlı) oturum ve puanı ile başkasının etkin oturumu dokunulmaz.
      expect(rows.find((r) => r.id === finished.sessionId)?.status).toBe("finished");
      expect(await scoreRows(finished.sessionId)).toHaveLength(1);
      expect((await sessionRow(otherStart.sessionId)).status).toBe("active");
    });

    it("süresi dolmuş (expired) kayıtlar da aynı sınıra dahildir", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const ids: string[] = [];
      for (let i = 0; i < MAX_STALE_SESSIONS_PER_USER + 5; i++) {
        ids.push((await startGame(t, u.accessToken, "flag-quiz")).sessionId);
        clock.advance(31 * 60 * 1000); // sonraki başlatmada bu oturum expired olarak kapanır
      }
      const rows = await t.db.select().from(gameSessions).where(eq(gameSessions.userId, u.user.id));
      const stale = rows.filter((r) => r.status === "expired");
      expect(stale).toHaveLength(MAX_STALE_SESSIONS_PER_USER);
      expect(rows.filter((r) => r.status === "active")).toHaveLength(1);
      expect((await getSession(u.accessToken, ids[0]!)).status).toBe(404);
    });

    it("tümü cevaplanıp bitirilmeden yeni oyun başlayınca eski oturum terk edilir (puan yazılmaz)", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 5; i++) await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "map-guess"));
      await startGame(t, u.accessToken, "map-guess");
      expect((await finish(t, u.accessToken, start.sessionId)).status).toBe(409);
      expect(await scoreRows(start.sessionId)).toHaveLength(0);
    });

    it("süresi dolmuş oturum: GET expired işaretler, cevap/finish 410; işaret kalıcıdır", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      await t.db.update(gameSessions).set({ expiresAt: new Date(Date.now() - 1_000) }).where(eq(gameSessions.id, start.sessionId));
      expect((await sessionRow(start.sessionId)).status).toBe("active"); // tembel: henüz işaretlenmedi

      const get = await getSession(u.accessToken, start.sessionId);
      expect(get.status).toBe(200);
      expect(get.body).toMatchObject({ status: "expired", round: null });
      expect((await sessionRow(start.sessionId)).status).toBe("expired");

      const ans = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "flag-quiz"));
      expect(ans.status).toBe(410);
      expect(ans.body.code).toBe("GAME_SESSION_EXPIRED");
      expect((await finish(t, u.accessToken, start.sessionId)).status).toBe(410);
    });

    it("cevap anında da tembel sona erdirme: 410 ve veritabanında expired (geri alınmaz)", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "capital-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      await t.db.update(gameSessions).set({ expiresAt: new Date(Date.now() - 1) }).where(eq(gameSessions.id, start.sessionId));
      const ans = await submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "capital-quiz"));
      expect(ans.status).toBe(410);
      const row = await sessionRow(start.sessionId);
      expect(row.status).toBe("expired");
      expect(row.score).toBe(0);
      expect(row.currentRound).toBe(0);
    });

    it("süre sınırı: expires_at anında dolmuş sayılır (≤), bir ms öncesi etkin", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const start = await startGame(t, u.accessToken, "flag-quiz");
      clock.set(Date.parse(start.expiresAt) - 1);
      expect((await getSession(u.accessToken, start.sessionId)).body.status).toBe("active");
      clock.set(Date.parse(start.expiresAt));
      expect((await getSession(u.accessToken, start.sessionId)).body.status).toBe("expired");
    });

    it("süre sınırı cevap ve bitirmede de aynı: expires_at'ten 1 ms önce cevap kabul, tam expires_at anında 410", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const early = await startGame(t, u.accessToken, "flag-quiz");
      clock.set(Date.parse(early.expiresAt) - 1);
      const ok = await submit(t, u.accessToken, early.sessionId, 0, null);
      expect(ok.status).toBe(200);
      expect(ok.body.timedOut).toBe(true); // 30 dk beklendi: tur süresi çoktan aşıldı ama oturum hâlâ etkin
      expect((await sessionRow(early.sessionId)).status).toBe("active");

      const late = await startGame(t, u.accessToken, "capital-quiz");
      const rounds = await secretRounds(t, late.sessionId);
      clock.set(Date.parse(late.expiresAt));
      const gone = await submit(t, u.accessToken, late.sessionId, 0, correctAnswerOf(rounds[0]!, "capital-quiz"));
      expect(gone.status).toBe(410);
      expect(gone.body.code).toBe("GAME_SESSION_EXPIRED");
      expect((await sessionRow(late.sessionId)).status).toBe("expired");

      // Tüm turlar cevaplanmış oturum, süre dolunca bitirilemez; 1 ms önce bitirilebilir.
      const full = await startGame(t, u.accessToken, "map-guess");
      const fullRounds = await secretRounds(t, full.sessionId);
      for (let i = 0; i < 5; i++) await submit(t, u.accessToken, full.sessionId, i, correctAnswerOf(fullRounds[i]!, "map-guess"));
      clock.set(Date.parse(full.expiresAt) - 1);
      expect((await finish(t, u.accessToken, full.sessionId)).status).toBe(200);
      const full2 = await startGame(t, u.accessToken, "map-guess");
      for (let i = 0; i < 5; i++) await submit(t, u.accessToken, full2.sessionId, i, correctAnswerOf((await secretRounds(t, full2.sessionId))[i]!, "map-guess"));
      clock.set(Date.parse(full2.expiresAt));
      expect((await finish(t, u.accessToken, full2.sessionId)).status).toBe(410);
      expect(await scoreRows(full2.sessionId)).toHaveLength(0);
    });

    it("süresi dolmuş etkin oturum, yeni başlatmada abandoned değil expired olur", async () => {
      const u = await newUser();
      const old = await startGame(t, u.accessToken, "map-guess");
      await t.db.update(gameSessions).set({ expiresAt: new Date(Date.now() - 5_000) }).where(eq(gameSessions.id, old.sessionId));
      await startGame(t, u.accessToken, "map-guess");
      expect((await sessionRow(old.sessionId)).status).toBe("expired");
    });

    it("bitmiş oturuma cevap 409 GAME_SESSION_NOT_ACTIVE", async () => {
      const u = await newUser();
      const played = await playThrough(t, u.accessToken, "map-guess");
      const res = await submit(t, u.accessToken, played.sessionId, 0, { lat: 1, lng: 1 });
      expect(res.status).toBe(409);
      expect(res.body.code).toBe("GAME_SESSION_NOT_ACTIVE");
    });

    it("oturum geri yüklenir: devam eden tur, puan ve cevaplanmış turlar", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const a0 = await submit(t, u.accessToken, start.sessionId, 0, wrongAnswerOf(rounds[0]!, "flag-quiz"));
      const a1 = await submit(t, u.accessToken, start.sessionId, 1, correctAnswerOf(rounds[1]!, "flag-quiz"));
      const restored = await getSession(u.accessToken, start.sessionId);
      expect(restored.status).toBe(200);
      expect(restored.body).toMatchObject({ sessionId: start.sessionId, gameType: "flag-quiz", status: "active", roundsTotal: 10, currentRound: 2, score: a1.body.points, correctCount: 1, finishedAt: null });
      // Aynı tur; yalnız yanıtın üretildiği an (`serverNow`) farklı olabilir.
      expect({ ...restored.body.round, serverNow: null }).toEqual({ ...a1.body.nextRound, serverNow: null });
      expect(restored.body.results).toEqual([
        { index: 0, correct: false, points: 0, timedOut: false },
        { index: 1, correct: true, points: a1.body.points, timedOut: false },
      ]);
      expect(a0.body.nextRound.index).toBe(1);
    });
  });

  describe("cevap doğrulama", () => {
    it("çoktan seçmeli: seçenek dışı ya da biçimsiz cevap 400, tur tüketilmez", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const notOffered = fixtureCountries(30).map((c) => c.code).find((c) => !start.round.options!.some((o) => o.id === c))!;
      for (const bad of [notOffered, "", "ZZZ", 7, { lat: 1, lng: 2 }, ["AA"], true]) {
        const res = await submit(t, u.accessToken, start.sessionId, 0, bad);
        expect(res.status, JSON.stringify(bad)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
        expect(JSON.stringify(res.body)).not.toContain(`"${rounds[0]!.code}"`);
      }
      const noAnswer = await t.http.post(`/v1/games/sessions/${start.sessionId}/answers`).set(bearer(u.accessToken)).send({ roundIndex: 0 });
      expect(noAnswer.status).toBe(400);
      expect((await sessionRow(start.sessionId)).currentRound).toBe(0);
      // Küçük harf ve boşluk kabul edilir.
      const ok = await submit(t, u.accessToken, start.sessionId, 0, ` ${rounds[0]!.code.toLowerCase()} `);
      expect(ok.status).toBe(200);
      expect(ok.body.correct).toBe(true);
    });

    it("answer: null = cevap yok (pas ya da süre doldu): 0 puan, seri sıfırlanır, tur geçilir; alan hiç yoksa 400", async () => {
      const u = await newUser();
      const clock = fakeClock(t);
      const start = await startGame(t, u.accessToken, "flag-quiz");
      const rounds = await secretRounds(t, start.sessionId);
      const right = (i: number) => correctAnswerOf(rounds[i]!, "flag-quiz");

      expect((await submit(t, u.accessToken, start.sessionId, 0, right(0))).body.streak).toBe(1);
      expect((await submit(t, u.accessToken, start.sessionId, 1, right(1))).body.streak).toBe(2);
      clock.advance(5_000); // süre içinde bilerek pas
      const skip = await submit(t, u.accessToken, start.sessionId, 2, null);
      expect(skip.status).toBe(200);
      expect(skip.body).toMatchObject({ correct: false, points: 0, timedOut: false, streak: 0, speedBonus: 0, streakBonus: 0, distanceKm: null });
      expect(skip.body.correctAnswer.code).toBe(rounds[2]!.code); // tur bitti: doğru cevap açıklanır
      expect(skip.body.nextRound.index).toBe(3);
      expect((await submit(t, u.accessToken, start.sessionId, 3, right(3))).body).toMatchObject({ streak: 1, streakBonus: 0 }); // seri baştan

      const G = FEEDBACK_GRACE_MS["flag-quiz"];
      clock.advance(G + 20_000); // tur başlangıcından tam 20 sn: henüz süre aşımı değil
      expect((await submit(t, u.accessToken, start.sessionId, 4, null)).body).toMatchObject({ timedOut: false, points: 0 });
      clock.advance(G + 20_001); // 1 ms geç: süre doldu, null bile olsa timedOut
      expect((await submit(t, u.accessToken, start.sessionId, 5, null)).body).toMatchObject({ timedOut: true, points: 0 });
      const session = await getSession(u.accessToken, start.sessionId);
      expect(session.body.results.map((r: { correct: boolean }) => r.correct)).toEqual([true, true, false, true, false, false]);

      const noField = await t.http.post(`/v1/games/sessions/${start.sessionId}/answers`).set(bearer(u.accessToken)).send({ roundIndex: 6 });
      expect(noField.status).toBe(400);
      expect(noField.body.details[0]).toMatchObject({ field: "answer", code: "isDefined" });
      expect((await sessionRow(start.sessionId)).currentRound).toBe(6);

      const mapStart = await startGame(t, u.accessToken, "map-guess");
      const mapSkip = await submit(t, u.accessToken, mapStart.sessionId, 0, null);
      expect(mapSkip.body).toMatchObject({ correct: false, points: 0, distanceKm: null, timedOut: false });
    });

    it("harita: aralık dışı, sonsuz (1e999), sayı olmayan ve fazladan alanlı cevaplar 400", async () => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      const bads: unknown[] = [
        "AA", 5, [1, 2], {}, { lat: 1 }, { lng: 1 }, { lat: "1", lng: 2 }, { lat: null, lng: 2 }, { lat: 90.0001, lng: 0 }, { lat: -90.0001, lng: 0 },
        { lat: 0, lng: 180.0001 }, { lat: 0, lng: -180.0001 }, { lat: 1, lng: 2, extra: 3 },
      ];
      for (const bad of bads) {
        const res = await submit(t, u.accessToken, start.sessionId, 0, bad);
        expect(res.status, JSON.stringify(bad)).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
      const infinite = await t.http
        .post(`/v1/games/sessions/${start.sessionId}/answers`)
        .set(bearer(u.accessToken))
        .set("Content-Type", "application/json")
        .send('{"roundIndex":0,"answer":{"lat":1e999,"lng":0}}');
      expect(infinite.status).toBe(400);
      expect(infinite.body.details.map((d: { field: string }) => d.field)).toContain("answer.lat");
      expect(numbersIn(infinite.body)).not.toContain(rounds[0]!.latitude);

      expect((await sessionRow(start.sessionId)).currentRound).toBe(0);
      for (const edge of [{ lat: 90, lng: 180 }, { lat: -90, lng: -180 }, { lat: 0, lng: 0 }]) {
        const s = await startGame(t, u.accessToken, "map-guess");
        const res = await submit(t, u.accessToken, s.sessionId, 0, edge);
        expect(res.status, JSON.stringify(edge)).toBe(200);
        expect(res.body.distanceKm).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("sırlar istemciye gitmez", () => {
    const FORBIDDEN_KEYS = ["correct", "correctAnswer", "answer", "rounds", "result", "target", "targetCode", "lat", "lng", "latitude", "longitude", "capital", "names", "code"];
    const ERROR_KEYS = ["statusCode", "code", "message", "details"];

    /** Soru yanıtında (başlat/GET/nextRound) yasak anahtar ve hedef değeri aranır. */
    function assertQuestionClean(payload: unknown, secret: { code: string; latitude: number | null; longitude: number | null }, type: GameType) {
      const text = JSON.stringify(payload);
      const keys = keysIn(payload);
      for (const key of FORBIDDEN_KEYS) expect(keys.has(key), `yasak anahtar ${key}: ${text}`).toBe(false);
      if (type === "map-guess") {
        const numbers = numbersIn(payload);
        expect(numbers).not.toContain(secret.latitude);
        expect(numbers).not.toContain(secret.longitude);
        expect(text).not.toContain(`"${secret.code}"`);
      }
    }

    it.each(GAME_TYPES)("%s: başlat, geri yükle ve her nextRound yanıtı doğru cevabı içermez", async (type) => {
      const u = await newUser();
      const start = await startGame(t, u.accessToken, type);
      const rounds = await secretRounds(t, start.sessionId);
      const total = rounds.length;

      for (let i = 0; i < total; i++) {
        // Cevaplanmamış TÜM turların sırları, şu ana kadar dönen hiçbir gövdede olmamalı.
        const current = i === 0 ? start.round : (await getSession(u.accessToken, start.sessionId)).body.round;
        expect(current.index).toBe(i);
        assertQuestionClean(current, rounds[i]!, type);
        if (type === "capital-quiz") expect(JSON.stringify(current)).not.toMatch(/"capital"|"correct"/);
        // Seçeneklerin hiçbiri "doğru" diye işaretli değil.
        for (const o of current.options ?? []) expect(Object.keys(o).sort()).toEqual(["id", "label"]);

        const get = (await getSession(u.accessToken, start.sessionId)).body;
        const { results, ...rest } = get;
        for (const key of ["rounds", "target", "targetCode", "correctAnswer", "answer", "latitude", "longitude"]) expect(keysIn(rest).has(key), `GET ${key}`).toBe(false);
        for (const r of results) expect(Object.keys(r).sort()).toEqual(["correct", "index", "points", "timedOut"]);
        expect(results).toHaveLength(i);

        const res = await submit(t, u.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, type));
        expect(res.status).toBe(200);
        // Doğru cevap yalnız cevaplanan turunki; bir sonraki tur temiz.
        expect(res.body.correctAnswer.code).toBe(rounds[i]!.code);
        if (res.body.nextRound) assertQuestionClean(res.body.nextRound, rounds[i + 1]!, type);
      }
      const done = await finish(t, u.accessToken, start.sessionId);
      expect(keysIn(done.body).has("correctAnswer")).toBe(false);
      expect(keysIn(done.body).has("rounds")).toBe(false);
    });

    it("hata gövdeleri yalnız {statusCode, code, message, details} taşır ve sır içermez", async () => {
      const u = await newUser();
      const other = await newUser();
      const start = await startGame(t, u.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      const secret = rounds[0]!;
      const errors = [
        await submit(t, u.accessToken, start.sessionId, 3, { lat: 1, lng: 1 }), // sıra bozuk
        await submit(t, u.accessToken, start.sessionId, 0, { lat: 99, lng: 1 }), // geçersiz
        await submit(t, other.accessToken, start.sessionId, 0, { lat: 1, lng: 1 }), // başkası
        await finish(t, u.accessToken, start.sessionId), // erken bitirme
        await getSession(other.accessToken, start.sessionId),
      ];
      await t.db.update(gameSessions).set({ expiresAt: new Date(Date.now() - 1) }).where(eq(gameSessions.id, start.sessionId));
      errors.push(await submit(t, u.accessToken, start.sessionId, 0, { lat: 1, lng: 1 }));
      for (const res of errors) {
        expect(res.status).toBeGreaterThanOrEqual(400);
        for (const key of Object.keys(res.body)) expect(ERROR_KEYS).toContain(key);
        const text = JSON.stringify(res.body);
        expect(numbersIn(res.body)).not.toContain(secret.latitude);
        expect(numbersIn(res.body)).not.toContain(secret.longitude);
        expect(text).not.toContain(`"${secret.code}"`);
        expect(text).not.toContain(secret.names.tr.name);
      }
    });

    it("sorular oturum başına rastgeledir: doğru cevabın konumu sabit değil ve hedefler tekrar etmiyor", async () => {
      const u = await newUser();
      const positions = new Set<number>();
      const targets = new Set<string>();
      for (let i = 0; i < 12; i++) {
        const s = await startGame(t, u.accessToken, "flag-quiz");
        const rounds = await secretRounds(t, s.sessionId);
        for (const r of rounds) positions.add(r.options.findIndex((o) => o.code === r.code));
        targets.add(rounds.map((r) => r.code).join(","));
      }
      expect(positions.size).toBe(4);
      expect(targets.size).toBeGreaterThan(8);
    });
  });

  describe("rastgelelik ve dil", () => {
    it("rastgelelik enjekte edilebilir: aynı tohum aynı soru dizisini üretir", async () => {
      const u = await newUser();
      const seeds: string[] = [];
      for (let i = 0; i < 2; i++) {
        const rng = seededRng(2024);
        vi.spyOn(gameRandom(t), "next").mockImplementation(rng);
        const s = await startGame(t, u.accessToken, "flag-quiz");
        seeds.push(JSON.stringify((await secretRounds(t, s.sessionId)).map((r) => [r.code, r.options.map((o) => o.code)])));
        vi.restoreAllMocks();
      }
      expect(seeds[0]).toBe(seeds[1]);
      const free = await startGame(t, u.accessToken, "flag-quiz");
      expect(JSON.stringify((await secretRounds(t, free.sessionId)).map((r) => [r.code, r.options.map((o) => o.code)]))).not.toBe(seeds[0]);
    });

    it("?lang=en etiketleri İngilizce verir, çevirisi olmayan dilde Türkçeye düşer, geçersiz dil 400", async () => {
      const u = await newUser();
      const tr = await startGame(t, u.accessToken, "flag-quiz");
      expect(tr.round.options!.every((o) => o.label.startsWith("Ülke "))).toBe(true);
      const en = await startGame(t, u.accessToken, "flag-quiz", "?lang=en");
      expect(en.round.options!.every((o) => o.label.startsWith("Country "))).toBe(true);
      const es = await startGame(t, u.accessToken, "flag-quiz", "?lang=es");
      expect(es.round.options!.every((o) => o.label.startsWith("Ülke "))).toBe(true);
      const cap = await startGame(t, u.accessToken, "capital-quiz", "?lang=en");
      expect(cap.round.question.countryName).toMatch(/^Country /);
      expect(cap.round.options!.every((o) => o.label.startsWith("Başkent "))).toBe(true); // başkent kaynak biçiminde (çeviri uydurulmaz)
      // Geri yüklemede dil, o isteğin `lang`ından gelir (oturumda saklanmaz).
      const enAgain = await startGame(t, u.accessToken, "flag-quiz", "?lang=en");
      expect(en.sessionId).not.toBe(enAgain.sessionId);
      const restoredTr = await getSession(u.accessToken, enAgain.sessionId, "?lang=tr");
      expect(restoredTr.body.round.options.every((o: { label: string }) => o.label.startsWith("Ülke "))).toBe(true);
      const restoredEn = await getSession(u.accessToken, enAgain.sessionId, "?lang=en");
      expect(restoredEn.body.round.options.every((o: { label: string }) => o.label.startsWith("Country "))).toBe(true);
      const bad = await t.http.post("/v1/games/flag-quiz/sessions?lang=xx").set(bearer(u.accessToken));
      expect(bad.status).toBe(400);
      expect(bad.body.code).toBe("VALIDATION_FAILED");
    });
  });

  describe("hesap silme", () => {
    it("kullanıcı silinince oturumları ve puanları da gider (yönetici silmesi ve kendi hesabını silme)", async () => {
      const victim = await newUser("Silinecek");
      const keeper = await newUser("Kalacak");
      const played = await playThrough(t, victim.accessToken, "flag-quiz");
      const active = await startGame(t, victim.accessToken, "map-guess");
      const keepPlayed = await playThrough(t, keeper.accessToken, "flag-quiz");
      expect(await t.db.select().from(gameSessions).where(eq(gameSessions.userId, victim.user.id))).toHaveLength(2);

      const del = await t.http.delete(`/v1/users/${victim.user.id}`).set(bearer(admin.accessToken));
      expect(del.status).toBe(204);
      expect(await t.db.select().from(gameSessions).where(eq(gameSessions.userId, victim.user.id))).toHaveLength(0);
      expect(await t.db.select().from(scores).where(eq(scores.userId, victim.user.id))).toHaveLength(0);
      expect(await scoreRows(played.sessionId)).toHaveLength(0);
      expect(await t.db.select().from(users).where(eq(users.id, victim.user.id))).toHaveLength(0);
      expect((await getSession(victim.accessToken, active.sessionId)).status).toBe(401); // belirteç artık geçersiz
      // Diğer kullanıcı etkilenmedi.
      expect(await scoreRows(keepPlayed.sessionId)).toHaveLength(1);

      const self = await newUser("Kendini silen");
      const own = await playThrough(t, self.accessToken, "capital-quiz");
      const delSelf = await t.http.delete("/v1/users/me").set(bearer(self.accessToken)).send({ password: self.password });
      expect(delSelf.status).toBe(204);
      expect(await scoreRows(own.sessionId)).toHaveLength(0);
      expect(await t.db.select().from(gameSessions).where(eq(gameSessions.userId, self.user.id))).toHaveLength(0);
    });

    it("oyun sürerken hesap silme ile eşzamanlı cevap/bitirme 500 üretmez", async () => {
      for (let round = 0; round < 4; round++) {
        const u = await newUser();
        const start = await startGame(t, u.accessToken, "map-guess");
        const rounds = await secretRounds(t, start.sessionId);
        const results = await Promise.all([
          submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "map-guess")),
          finish(t, u.accessToken, start.sessionId),
          t.http.delete(`/v1/users/${u.user.id}`).set(bearer(admin.accessToken)),
          submit(t, u.accessToken, start.sessionId, 0, correctAnswerOf(rounds[0]!, "map-guess")),
        ]);
        for (const r of results) expect(r.status, `${r.status} ${JSON.stringify(r.body)}`).toBeLessThan(500);
        expect(await t.db.select().from(gameSessions).where(eq(gameSessions.userId, u.user.id))).toHaveLength(0);
      }
    });
  });
});

describe("oyunlar: havuz yetersizliği", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  it("boş havuzda her tür 409 GAME_POOL_TOO_SMALL; oturum satırı yazılmaz", async () => {
    const u = await registerUser(t.http);
    for (const type of GAME_TYPES) {
      const res = await t.http.post(`/v1/games/${type}/sessions`).set(bearer(u.accessToken));
      expect(res.status, type).toBe(409);
      expect(res.body).toMatchObject({ statusCode: 409, code: "GAME_POOL_TOO_SMALL" });
      expect(res.body.message).toMatch(/yeterli ülke/);
    }
    expect(await t.db.select().from(gameSessions)).toHaveLength(0);
  });

  it("tür başına havuz: bayrak için tüm ülkeler, başkent için başkenti olanlar, harita için koordinatı olanlar sayılır; tam 10 yeter", async () => {
    const list = fixtureCountries(12);
    // 12 ülke: 9'unun başkenti var (yetersiz), 9'unun koordinatı yok (yetersiz)
    list.forEach((c, i) => {
      if (i >= 9) c.capital = [];
      if (i < 9) c.withCoordinates = false;
    });
    await seedGameCountries(t, list);
    const u = await registerUser(t.http);
    expect((await t.http.post("/v1/games/flag-quiz/sessions").set(bearer(u.accessToken))).status).toBe(201);
    const capital = await t.http.post("/v1/games/capital-quiz/sessions").set(bearer(u.accessToken));
    expect(capital.status).toBe(409);
    expect(capital.body.code).toBe("GAME_POOL_TOO_SMALL");
    const map = await t.http.post("/v1/games/map-guess/sessions").set(bearer(u.accessToken));
    expect(map.status).toBe(409);
    expect(map.body.code).toBe("GAME_POOL_TOO_SMALL");
  });

  it("başlatma havuz yüzünden başarısız olursa kullanıcının etkin oturumu bozulmaz", async () => {
    const u = await registerUser(t.http);
    const start = await startGame(t, u.accessToken, "flag-quiz"); // önceki testte tohumlanan 12 ülkelik havuz bayrak için yeter
    const failed = await t.http.post("/v1/games/capital-quiz/sessions").set(bearer(u.accessToken));
    expect(failed.status).toBe(409);
    const [row] = await t.db.select().from(gameSessions).where(eq(gameSessions.id, start.sessionId));
    expect(row!.status).toBe("active");
  });
});
