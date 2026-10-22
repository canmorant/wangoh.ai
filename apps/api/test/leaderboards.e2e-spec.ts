import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { GAME_TYPES, type GameType } from "../src/db/schema/enums.js";
import { scores, users } from "../src/db/schema/index.js";
import { LEADERBOARD_TYPES, type LeaderboardType, PERIOD_WINDOW_MS, type Period } from "../src/games/games.constants.js";
import { seededRng } from "../src/games/rng.js";
import { bearer, createAdmin, createTestApp, registerUser, type TestApp, type TestSession } from "./helpers/index.js";
import { correctAnswerOf, finish, fixtureCountries, gameClock, insertScore, keysIn, playThrough, secretRounds, seedGameCountries, startGame, submit, wrongAnswerOf } from "./helpers/games.js";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

interface Row {
  user: string; // görünen ad (testte benzersiz)
  type: GameType;
  score: number;
  at: Date;
}

interface RefEntry {
  user: string;
  score: number;
  at: number;
  rank: number;
}

/** Referans model: veritabanından bağımsız, düz JS ile liderlik hesabı. */
function reference(rows: Row[], type: LeaderboardType, since: Date | null): RefEntry[] {
  const inWindow = rows.filter((r) => !since || r.at.getTime() >= since.getTime());
  // Kullanıcı başına, tür başına en iyi puan ve ona İLK ulaşılan an.
  const best = new Map<string, Map<GameType, { score: number; at: number }>>();
  for (const r of inWindow) {
    if (type !== "overall" && r.type !== type) continue;
    const perType = best.get(r.user) ?? new Map<GameType, { score: number; at: number }>();
    const cur = perType.get(r.type);
    if (!cur || r.score > cur.score || (r.score === cur.score && r.at.getTime() < cur.at)) perType.set(r.type, { score: r.score, at: r.at.getTime() });
    best.set(r.user, perType);
  }
  const entries = [...best.entries()].map(([user, perType]) => {
    const parts = [...perType.values()];
    if (type !== "overall") return { user, score: parts[0]!.score, at: parts[0]!.at };
    return { user, score: parts.reduce((s, p) => s + p.score, 0), at: Math.max(...parts.map((p) => p.at)) };
  });
  entries.sort((a, b) => b.score - a.score || a.at - b.at || a.user.localeCompare(b.user));
  return entries.map((e) => ({ ...e, rank: 1 + entries.filter((o) => o.score > e.score).length }));
}

describe("liderlik tabloları", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t, fixtureCountries(30));
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());
  afterEach(() => vi.restoreAllMocks());

  const named = async (displayName: string) => registerUser(t.http, { displayName });
  const board = (type: string, query = "", token?: string) => {
    const req = t.http.get(`/v1/leaderboards/${type}${query}`);
    return token ? req.set(bearer(token)) : req;
  };
  const me = (type: string, token: string, query = "") => t.http.get(`/v1/leaderboards/${type}/me${query}`).set(bearer(token));

  describe("elle kurulmuş senaryo (flag-quiz)", () => {
    const now = Date.now();
    let users_: Record<string, TestSession>;
    beforeAll(async () => {
      users_ = Object.fromEntries(await Promise.all(["Ceren", "Dilan", "Ada", "Bora", "Emre", "Fatma", "Gül"].map(async (n) => [n, await named(n)] as const)));
      const add = (name: string, type: GameType, score: number, ago: number) => insertScore(t, { userId: users_[name]!.user.id, gameType: type, score, createdAt: new Date(now - ago) });
      await add("Ceren", "flag-quiz", 1500, 30 * DAY);
      await add("Ceren", "flag-quiz", 1500, 2 * DAY);
      await add("Dilan", "flag-quiz", 1500, 5 * DAY);
      await add("Ada", "flag-quiz", 900, 10 * DAY);
      await add("Ada", "flag-quiz", 1200, 9 * DAY);
      await add("Ada", "flag-quiz", 800, HOUR);
      await add("Bora", "flag-quiz", 1200, 8 * DAY);
      await add("Emre", "flag-quiz", 700, 23 * HOUR);
      await add("Fatma", "flag-quiz", 50, HOUR);
      await add("Gül", "flag-quiz", 999, 25 * HOUR);
      // diğer türler
      await add("Ada", "capital-quiz", 1000, 3 * HOUR);
      await add("Ada", "map-guess", 3000, 2 * HOUR);
      await add("Bora", "capital-quiz", 1000, 5 * DAY);
      await add("Ceren", "map-guess", 3200, 4 * DAY);
    });

    const summary = (body: { entries: Array<{ rank: number; displayName: string; score: number }> }) => body.entries.map((e) => [e.rank, e.displayName, e.score]);

    it("tüm zamanlar: kullanıcı başına en iyi puan; eşit puan aynı sıra, listede puana ilk ulaşan üstte", async () => {
      const res = await board("flag-quiz");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ gameType: "flag-quiz", period: "all", totalPlayers: 7 });
      expect(summary(res.body)).toEqual([
        [1, "Ceren", 1500], // 30 gün önce ilk ulaştı (sonra tekrarladı): Dilan'dan önce
        [1, "Dilan", 1500],
        [3, "Ada", 1200], // 9 gün önce
        [3, "Bora", 1200], // 8 gün önce: aynı puan, aynı sıra, daha geç
        [5, "Gül", 999],
        [6, "Emre", 700],
        [7, "Fatma", 50],
      ]);
      const names = res.body.entries.map((e: { displayName: string }) => e.displayName);
      expect(new Set(names).size).toBe(names.length); // kullanıcı başına tek satır
    });

    it("period=week: son 7 günün penceresinde en iyi; pencere dışı puanlar sayılmaz", async () => {
      const res = await board("flag-quiz", "?period=week");
      expect(res.body).toMatchObject({ period: "week", totalPlayers: 6 });
      expect(summary(res.body)).toEqual([
        [1, "Dilan", 1500], // pencerede 5 gün önce; Ceren pencerede 2 gün önce ulaştı
        [1, "Ceren", 1500],
        [3, "Gül", 999],
        [4, "Ada", 800], // 1200'ü pencere dışı, penceredeki en iyisi 800
        [5, "Emre", 700],
        [6, "Fatma", 50],
      ]);
    });

    it("period=day: son 24 saat", async () => {
      const res = await board("flag-quiz", "?period=day");
      expect(res.body).toMatchObject({ period: "day", totalPlayers: 3 });
      expect(summary(res.body)).toEqual([
        [1, "Ada", 800],
        [2, "Emre", 700],
        [3, "Fatma", 50],
      ]);
    });

    it("overall: oyun türü başına en iyilerin toplamı", async () => {
      const res = await board("overall");
      expect(res.body).toMatchObject({ gameType: "overall", period: "all", totalPlayers: 7 });
      expect(summary(res.body)).toEqual([
        [1, "Ada", 1200 + 1000 + 3000],
        [2, "Ceren", 1500 + 3200],
        [3, "Bora", 1200 + 1000],
        [4, "Dilan", 1500],
        [5, "Gül", 999],
        [6, "Emre", 700],
        [7, "Fatma", 50],
      ]);
      const week = await board("overall", "?period=week");
      // Hafta: Ada 800 + 1000 + 3000, Ceren 1500 + 3200, Dilan 1500, Bora yalnız capital-quiz 1000 (flag 1200'ü 8 gün önce), Gül 999, Emre 700, Fatma 50
      expect(summary(week.body)).toEqual([
        [1, "Ada", 4800],
        [2, "Ceren", 4700],
        [3, "Dilan", 1500],
        [4, "Bora", 1000],
        [5, "Gül", 999],
        [6, "Emre", 700],
        [7, "Fatma", 50],
      ]);
    });

    it("diğer türler kendi puanlarını gösterir", async () => {
      // Eşit puan: Bora'nın 1000'ine daha önce (5 gün önce) ulaşıldığı için üstte.
      expect(summary((await board("capital-quiz")).body)).toEqual([[1, "Bora", 1000], [1, "Ada", 1000]]);
      expect(summary((await board("map-guess")).body)).toEqual([[1, "Ceren", 3200], [2, "Ada", 3000]]);
      const empty = await board("map-guess", "?period=day");
      expect(empty.body).toMatchObject({ totalPlayers: 1, entries: [{ rank: 1, displayName: "Ada", score: 3000 }] });
    });

    it("yalnız displayName, rank, score, achievedAt, isMe döner: e-posta ve kimlik sızmaz", async () => {
      for (const type of LEADERBOARD_TYPES) {
        const res = await board(type);
        expect(Object.keys(res.body).sort()).toEqual(["entries", "gameType", "period", "totalPlayers"]);
        for (const e of res.body.entries) expect(Object.keys(e).sort()).toEqual(["achievedAt", "displayName", "isMe", "rank", "score"]);
        const text = JSON.stringify(res.body);
        for (const s of Object.values(users_)) {
          expect(text).not.toContain(s.email);
          expect(text).not.toContain(s.user.id);
        }
        expect(text).not.toMatch(/@|password|userId|user_id|email/i);
      }
    });

    it("achievedAt puana ilk ulaşılan andır", async () => {
      const res = await board("flag-quiz");
      const ceren = res.body.entries.find((e: { displayName: string }) => e.displayName === "Ceren");
      expect(Date.parse(ceren.achievedAt)).toBe(now - 30 * DAY);
      const ada = res.body.entries.find((e: { displayName: string }) => e.displayName === "Ada");
      expect(Date.parse(ada.achievedAt)).toBe(now - 9 * DAY);
    });

    it("isMe yalnız oturum açıksa ve yalnız kendi satırında; anonimde hep false", async () => {
      const anon = await board("flag-quiz");
      expect(anon.body.entries.every((e: { isMe: boolean }) => e.isMe === false)).toBe(true);
      const asBora = await board("flag-quiz", "", users_.Bora!.accessToken);
      expect(asBora.body.entries.filter((e: { isMe: boolean }) => e.isMe).map((e: { displayName: string }) => e.displayName)).toEqual(["Bora"]);
      const asBoraDay = await board("overall", "?period=day", users_.Bora!.accessToken);
      expect(asBoraDay.body.entries.some((e: { isMe: boolean }) => e.isMe)).toBe(false); // Bora son 24 saatte puansız
      const bad = await board("flag-quiz", "", "bozuk");
      expect(bad.status).toBe(401);
      expect(bad.body.code).toBe("AUTH_TOKEN_INVALID");
    });

    it("önbellek başlıkları: anonim liste 15 sn herkese açık (Vary: Authorization), oturumlu istek ve hatalar no-store", async () => {
      const anon = await board("flag-quiz");
      expect(anon.headers["cache-control"]).toBe("public, max-age=15");
      expect(anon.headers.vary).toContain("Authorization");
      expect((await board("flag-quiz", "", users_.Ada!.accessToken)).headers["cache-control"]).toBe("no-store");
      expect((await board("flag-quiz", "?limit=0")).headers["cache-control"]).toBe("no-store");
      expect((await board("chess")).headers["cache-control"]).toBe("no-store");
      expect((await me("flag-quiz", users_.Ada!.accessToken)).headers["cache-control"]).toBe("no-store");
    });

    it("aynı görünen adı taşıyan iki kullanıcıdan yalnız isteği yapan isMe olur", async () => {
      const twinA = await named("İkiz");
      const twinB = await named("İkiz");
      await insertScore(t, { userId: twinA.user.id, gameType: "map-guess", score: 4000 });
      await insertScore(t, { userId: twinB.user.id, gameType: "map-guess", score: 3900 });
      const res = await board("map-guess", "", twinB.accessToken);
      expect(res.body.entries.map((e: { displayName: string; isMe: boolean }) => [e.displayName, e.isMe])).toEqual([
        ["İkiz", false],
        ["İkiz", true],
        ["Ceren", false],
        ["Ada", false],
      ]);
      await t.db.delete(users).where(eq(users.id, twinA.user.id));
      await t.db.delete(users).where(eq(users.id, twinB.user.id));
    });

    it("limit: en iyi N satır, sıralar tüm oyunculara göre; geçersiz değer 400", async () => {
      const two = await board("flag-quiz", "?limit=2");
      expect(summary(two.body)).toEqual([[1, "Ceren", 1500], [1, "Dilan", 1500]]);
      expect(two.body.totalPlayers).toBe(7);
      expect(summary((await board("flag-quiz", "?limit=3")).body)).toEqual([[1, "Ceren", 1500], [1, "Dilan", 1500], [3, "Ada", 1200]]);
      expect((await board("flag-quiz", "?limit=100")).status).toBe(200);
      for (const bad of ["0", "-1", "101", "abc", "1.5", ""]) {
        const res = await board("flag-quiz", `?limit=${bad}`);
        expect(res.status, bad).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
    });

    it("geçersiz tür ya da dönem 400", async () => {
      for (const url of ["/v1/leaderboards/chess", "/v1/leaderboards/OVERALL", "/v1/leaderboards/flag-quiz?period=month", "/v1/leaderboards/flag-quiz?period=", "/v1/leaderboards/chess/me"]) {
        const res = await t.http.get(url).set(bearer(users_.Ada!.accessToken));
        expect(res.status, url).toBe(400);
        expect(res.body.code).toBe("VALIDATION_FAILED");
      }
    });

    it("/me: sıram, en iyim ve toplam oyuncu (eşit puan aynı sıra)", async () => {
      const ada = await me("flag-quiz", users_.Ada!.accessToken);
      expect(ada.status).toBe(200);
      expect(ada.body).toEqual({ gameType: "flag-quiz", period: "all", rank: 3, personalBest: 1200, totalPlayers: 7 });
      expect((await me("flag-quiz", users_.Bora!.accessToken)).body).toMatchObject({ rank: 3, personalBest: 1200 });
      expect((await me("flag-quiz", users_.Dilan!.accessToken)).body).toMatchObject({ rank: 1, personalBest: 1500 });
      expect((await me("flag-quiz", users_.Ada!.accessToken, "?period=week")).body).toEqual({ gameType: "flag-quiz", period: "week", rank: 4, personalBest: 800, totalPlayers: 6 });
      expect((await me("flag-quiz", users_.Ada!.accessToken, "?period=day")).body).toMatchObject({ rank: 1, personalBest: 800, totalPlayers: 3 });
      expect((await me("overall", users_.Ada!.accessToken)).body).toEqual({ gameType: "overall", period: "all", rank: 1, personalBest: 5200, totalPlayers: 7 });
      expect((await me("overall", users_.Bora!.accessToken)).body).toMatchObject({ rank: 3, personalBest: 2200 });
    });

    it("/me: puanı olmayan kullanıcıda rank ve personalBest null, totalPlayers yine döner", async () => {
      const rookie = await named("Çaylak");
      expect((await me("flag-quiz", rookie.accessToken)).body).toEqual({ gameType: "flag-quiz", period: "all", rank: null, personalBest: null, totalPlayers: 7 });
      expect((await me("overall", rookie.accessToken)).body).toMatchObject({ rank: null, personalBest: null });
      expect((await me("flag-quiz", users_.Bora!.accessToken, "?period=day")).body).toMatchObject({ rank: null, personalBest: null, totalPlayers: 3 });
    });

    it("pencere sınırı kayan ve dahil: tam 24 saat / 7 gün öncesi içeride, 1 ms öncesi dışarıda (saat sabitlenerek)", async () => {
      const T = Date.now();
      vi.spyOn(gameClock(t), "now").mockImplementation(() => new Date(T));
      const cases = {
        "Gün içinde": T - DAY,
        "Gün dışında": T - DAY - 1,
        "Hafta içinde": T - PERIOD_WINDOW_MS.week,
        "Hafta dışında": T - PERIOD_WINDOW_MS.week - 1,
      };
      const created: TestSession[] = [];
      for (const [name, at] of Object.entries(cases)) {
        const u = await named(name);
        created.push(u);
        await insertScore(t, { userId: u.user.id, gameType: "capital-quiz", score: 4000 + created.length, createdAt: new Date(at) });
      }
      const mine = (body: { entries: Array<{ displayName: string }> }) => body.entries.map((e) => e.displayName).filter((n) => n in cases).sort();
      expect(mine((await board("capital-quiz", "?period=day&limit=100")).body)).toEqual(["Gün içinde"]);
      // /me aynı pencereyi kullanır: sınırdaki puan (dahil) sayılır, 1 ms ötesi sayılmaz.
      const rank = async (u: TestSession, period: string) => (await me("capital-quiz", u.accessToken, `?period=${period}`)).body.rank;
      expect([await rank(created[0]!, "day"), await rank(created[1]!, "day")]).toEqual([expect.any(Number), null]);
      expect([await rank(created[2]!, "week"), await rank(created[3]!, "week")]).toEqual([expect.any(Number), null]);
      expect(mine((await board("capital-quiz", "?period=week&limit=100")).body)).toEqual(["Gün dışında", "Gün içinde", "Hafta içinde"]);
      expect(mine((await board("capital-quiz", "?limit=100")).body)).toEqual(Object.keys(cases).sort());
      for (const u of created) await t.db.delete(users).where(eq(users.id, u.user.id));
    });
  });

  describe("referans modelle karşılaştırma (rastgele veri)", () => {
    it("tüm tür ve dönemlerde API, düz JS referansıyla birebir aynı; /me ve isMe de", async () => {
      const now = Date.now();
      vi.spyOn(gameClock(t), "now").mockImplementation(() => new Date(now));
      const rng = seededRng(77);
      const players = await Promise.all(Array.from({ length: 14 }, (_, i) => named(`Rastgele ${String(i).padStart(2, "0")}`)));
      const rows: Row[] = [];
      let stamp = 0;
      for (const p of players) {
        const count = Math.floor(rng() * 6); // 0-5 oyun
        for (let i = 0; i < count; i++) {
          const type = GAME_TYPES[Math.floor(rng() * 3)]!;
          const score = type === "map-guess" ? Math.floor(rng() * 6) * 500 : Math.floor(rng() * 6) * 300; // bilerek çok eşitlik
          // Her satırın zamanı benzersiz (eşitlik bozucu belirleyici olsun); dağılım 0-9 gün.
          const at = new Date(now - Math.floor(rng() * 9 * DAY) - stamp++);
          rows.push({ user: p.user.displayName, type, score, at });
          await insertScore(t, { userId: p.user.id, gameType: type, score, createdAt: at });
        }
      }
      // Önceki testlerdeki kullanıcılar da var; karşılaştırma yalnız bu bölümün oyuncularıyla yapılır.
      const mine = new Set(players.map((p) => p.user.displayName));
      const everything = await t.db.select().from(scores);
      expect(everything.length).toBeGreaterThanOrEqual(rows.length);

      const allRows: Row[] = [];
      const userRows = await t.db.select({ id: users.id, name: users.displayName }).from(users);
      const nameOf = new Map(userRows.map((u) => [u.id, u.name]));
      for (const s of everything) allRows.push({ user: nameOf.get(s.userId)!, type: s.gameType, score: s.score, at: s.createdAt });
      // Görünen adı tekrar eden kullanıcılar referansı bulandırmasın.
      expect(new Set(userRows.map((u) => u.name)).size).toBe(userRows.length);

      const periods: Array<[Period, Date | null]> = [["all", null], ["week", new Date(now - 7 * DAY)], ["day", new Date(now - DAY)]];
      for (const type of LEADERBOARD_TYPES) {
        for (const [period, since] of periods) {
          const expected = reference(allRows, type, since);
          const res = await board(type, `?period=${period}&limit=100`);
          expect(res.status).toBe(200);
          expect(res.body.totalPlayers, `${type}/${period}`).toBe(expected.length);
          expect(res.body.entries.map((e: { rank: number; displayName: string; score: number }) => [e.rank, e.displayName, e.score]), `${type}/${period}`).toEqual(
            expected.map((e) => [e.rank, e.user, e.score]),
          );
          expect(res.body.entries.map((e: { achievedAt: string }) => Date.parse(e.achievedAt)), `${type}/${period} zaman`).toEqual(expected.map((e) => e.at));

          for (const p of players) {
            const mineRef = expected.find((e) => e.user === p.user.displayName);
            const r = await me(type, p.accessToken, `?period=${period}`);
            expect(r.body, `${type}/${period}/${p.user.displayName}`).toEqual({
              gameType: type,
              period,
              rank: mineRef?.rank ?? null,
              personalBest: mineRef?.score ?? null,
              totalPlayers: expected.length,
            });
          }
          // isMe: oturum açık bir oyuncu için yalnız kendi satırı işaretli.
          const viewer = players[3]!;
          const asViewer = await board(type, `?period=${period}&limit=100`, viewer.accessToken);
          const flagged = asViewer.body.entries.filter((e: { isMe: boolean }) => e.isMe).map((e: { displayName: string }) => e.displayName);
          expect(flagged).toEqual(expected.some((e) => e.user === viewer.user.displayName) ? [viewer.user.displayName] : []);
        }
      }
      expect(mine.size).toBe(14);
    }, 60_000);
  });

  describe("liste boyutu", () => {
    it("varsayılan 20 satır, limit=100 hepsini verir; çok oyunculu tabloda sıralar doğru", async () => {
      const ids: string[] = [];
      for (let i = 0; i < 25; i++) {
        const id = randomUUID();
        ids.push(id);
        await t.db.insert(users).values({ id, email: `toplu-${i}-${id.slice(0, 6)}@example.test`, passwordHash: "x", displayName: `Toplu ${String(i).padStart(2, "0")}` });
        await insertScore(t, { userId: id, gameType: "capital-quiz", score: 10_000 + i, createdAt: new Date(Date.now() - i * 1000) });
      }
      const def = await board("capital-quiz");
      expect(def.body.entries).toHaveLength(20);
      expect(def.body.entries[0]).toMatchObject({ rank: 1, displayName: "Toplu 24", score: 10_024 });
      expect(def.body.entries.map((e: { rank: number }) => e.rank)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
      expect(def.body.totalPlayers).toBeGreaterThanOrEqual(25);
      const all = await board("capital-quiz", "?limit=100");
      expect(all.body.entries.length).toBe(all.body.totalPlayers);
      await t.db.delete(users).where(eq(users.id, ids[0]!));
      for (const id of ids.slice(1)) await t.db.delete(users).where(eq(users.id, id));
    });
  });

  describe("oyun akışıyla tutarlılık ve yönetici silmesi", () => {
    it("finish'in rank/personalBest/isPersonalBest değerleri liderlikle aynı; kişisel rekor yalnız artışta", async () => {
      const player = await named("Akışçı");
      const rival = await named("Rakip");

      const play = async (who: TestSession, type: GameType, mistakes: number) => {
        const start = await startGame(t, who.accessToken, type);
        const rounds = await secretRounds(t, start.sessionId);
        for (let i = 0; i < rounds.length; i++) {
          const ans = i < mistakes ? wrongAnswerOf(rounds[i]!, type) : correctAnswerOf(rounds[i]!, type);
          await submit(t, who.accessToken, start.sessionId, i, ans);
        }
        const body = (await finish(t, who.accessToken, start.sessionId)).body;
        sessionIds.set(body.scoreId, start.sessionId);
        return body;
      };
      const sessionIds = new Map<string, string>();

      const first = await play(player, "map-guess", 0);
      expect(first).toMatchObject({ score: 5000, isPersonalBest: true, personalBest: 5000, rank: 1 });
      const worse = await play(player, "map-guess", 3);
      expect(worse.score).toBeLessThan(5000);
      expect(worse).toMatchObject({ isPersonalBest: false, personalBest: 5000, rank: 1 });
      const equal = await play(player, "map-guess", 0);
      expect(equal).toMatchObject({ score: 5000, isPersonalBest: false, personalBest: 5000, rank: 1 }); // eşit puan rekor değil
      const rivalGame = await play(rival, "map-guess", 0);
      expect(rivalGame).toMatchObject({ score: 5000, rank: 1, isPersonalBest: true }); // eşit puan aynı sıra
      const weaker = await play(rival, "map-guess", 4);
      expect(weaker.personalBest).toBe(5000);

      const lb = await board("map-guess", "", player.accessToken);
      expect(lb.body.entries.slice(0, 2).map((e: { displayName: string; rank: number; isMe: boolean }) => [e.displayName, e.rank, e.isMe])).toEqual([
        ["Akışçı", 1, true], // eşit puan: puana önce ulaşan üstte
        ["Rakip", 1, false],
      ]);
      expect((await me("map-guess", player.accessToken)).body).toMatchObject({ rank: 1, personalBest: 5000 });

      // Yeniden finish: önceki en iyi, kendinden ÖNCEKİ satırlara göre hesaplandığından sonuç değişmez.
      expect((await finish(t, player.accessToken, sessionIds.get(first.scoreId)!)).body).toEqual(first);
    });

    it("yönetici puanı silince liderlik/istatistik değişir; finish yeniden puan yazmaz (410)", async () => {
      const cheater = await named("Hileci");
      const honest = await named("Dürüst");
      const cheatId = await insertScore(t, { userId: cheater.user.id, gameType: "capital-quiz", score: 99_999 });
      await insertScore(t, { userId: honest.user.id, gameType: "capital-quiz", score: 1_234 });
      expect((await board("capital-quiz", "?limit=1")).body.entries[0]).toMatchObject({ displayName: "Hileci", score: 99_999 });

      const asUser = await t.http.delete(`/v1/scores/${cheatId}`).set(bearer(honest.accessToken));
      expect(asUser.status).toBe(403);
      expect(asUser.body.code).toBe("FORBIDDEN");
      expect((await t.http.delete(`/v1/scores/${cheatId}`)).status).toBe(401);
      expect((await board("capital-quiz", "?limit=1")).body.entries[0].displayName).toBe("Hileci"); // reddedilen istek bir şeyi değiştirmedi

      const del = await t.http.delete(`/v1/scores/${cheatId}`).set(bearer(admin.accessToken));
      expect(del.status).toBe(204);
      expect(del.text).toBe("");
      expect((await board("capital-quiz", "?limit=1")).body.entries[0].displayName).not.toBe("Hileci");
      expect((await me("capital-quiz", cheater.accessToken)).body).toMatchObject({ rank: null, personalBest: null });
      expect((await t.http.get("/v1/users/me/stats").set(bearer(cheater.accessToken))).body.gamesPlayed).toBe(0);

      const again = await t.http.delete(`/v1/scores/${cheatId}`).set(bearer(admin.accessToken));
      expect(again.status).toBe(404);
      expect(again.body.code).toBe("NOT_FOUND");
      expect((await t.http.delete("/v1/scores/not-a-uuid").set(bearer(admin.accessToken))).status).toBe(400);
      expect((await t.http.delete(`/v1/scores/${randomUUID()}`).set(bearer(admin.accessToken))).status).toBe(404);
    });

    it("oyunla yazılan puan silinirse aynı oturumun finish çağrısı 410 GAME_SCORE_REMOVED döner, puan geri gelmez", async () => {
      const player = await named("Silinen Puan");
      const start = await startGame(t, player.accessToken, "map-guess");
      const rounds = await secretRounds(t, start.sessionId);
      for (let i = 0; i < 5; i++) await submit(t, player.accessToken, start.sessionId, i, correctAnswerOf(rounds[i]!, "map-guess"));
      const done = await finish(t, player.accessToken, start.sessionId);
      expect(done.status).toBe(200);
      expect((await t.http.delete(`/v1/scores/${done.body.scoreId}`).set(bearer(admin.accessToken))).status).toBe(204);
      const again = await finish(t, player.accessToken, start.sessionId);
      expect(again.status).toBe(410);
      expect(again.body.code).toBe("GAME_SCORE_REMOVED");
      expect(await t.db.select().from(scores).where(eq(scores.sessionId, start.sessionId))).toHaveLength(0);
    });

    it("kullanıcı silinince puanları liderlikten ve sıralardan kalkar", async () => {
      const a = await named("Geçici A");
      const b = await named("Geçici B");
      await insertScore(t, { userId: a.user.id, gameType: "flag-quiz", score: 100_000 });
      await insertScore(t, { userId: b.user.id, gameType: "flag-quiz", score: 99_000 });
      expect((await me("flag-quiz", b.accessToken)).body.rank).toBe(2);
      await t.http.delete(`/v1/users/${a.user.id}`).set(bearer(admin.accessToken)).expect(204);
      expect((await me("flag-quiz", b.accessToken)).body.rank).toBe(1);
      expect((await board("flag-quiz", "?limit=1")).body.entries[0].displayName).toBe("Geçici B");
      expect(keysIn((await board("flag-quiz")).body).has("userId")).toBe(false);
    });
  });
});

describe("liderlik: devre dışı bırakılan kullanıcılar", () => {
  let t: TestApp;
  let admin: TestSession;
  beforeAll(async () => {
    t = await createTestApp();
    await seedGameCountries(t, fixtureCountries(30));
    admin = await createAdmin(t);
  });
  afterAll(() => t.close());
  afterEach(() => vi.restoreAllMocks());

  const board = (type: string, query = "", token?: string) => {
    const req = t.http.get(`/v1/leaderboards/${type}${query}`);
    return token ? req.set(bearer(token)) : req;
  };
  const me = (type: string, token: string, query = "") => t.http.get(`/v1/leaderboards/${type}/me${query}`).set(bearer(token));
  const setDisabled = (id: string, disabled: boolean) => t.http.patch(`/v1/users/${id}`).set(bearer(admin.accessToken)).send({ disabled }).expect(200);
  const summary = (body: { entries: Array<{ rank: number; displayName: string; score: number }> }) => body.entries.map((e) => [e.rank, e.displayName, e.score]);

  it("devre dışı kullanıcı liste, sıra ve oyuncu sayısından çıkar; yeniden etkinleştirilince geri döner", async () => {
    const cheater = await registerUser(t.http, { displayName: "Hileci" });
    const honest = await registerUser(t.http, { displayName: "Dürüst" });
    const third = await registerUser(t.http, { displayName: "Üçüncü" });
    await insertScore(t, { userId: cheater.user.id, gameType: "flag-quiz", score: 99_000 });
    await insertScore(t, { userId: cheater.user.id, gameType: "capital-quiz", score: 50_000 });
    await insertScore(t, { userId: honest.user.id, gameType: "flag-quiz", score: 1_200 });
    await insertScore(t, { userId: honest.user.id, gameType: "capital-quiz", score: 700 });
    await insertScore(t, { userId: third.user.id, gameType: "flag-quiz", score: 900 });

    expect(summary((await board("flag-quiz")).body)).toEqual([[1, "Hileci", 99_000], [2, "Dürüst", 1_200], [3, "Üçüncü", 900]]);
    expect((await me("flag-quiz", honest.accessToken)).body).toMatchObject({ rank: 2, totalPlayers: 3 });

    await setDisabled(cheater.user.id, true);

    for (const period of ["all", "week", "day"]) {
      const flag = await board("flag-quiz", `?period=${period}`);
      expect(summary(flag.body), `flag-quiz/${period}`).toEqual([[1, "Dürüst", 1_200], [2, "Üçüncü", 900]]);
      expect(flag.body.totalPlayers, `flag-quiz/${period}`).toBe(2);
      expect((await me("flag-quiz", honest.accessToken, `?period=${period}`)).body, `me ${period}`).toEqual({ gameType: "flag-quiz", period, rank: 1, personalBest: 1_200, totalPlayers: 2 });
      expect((await me("flag-quiz", third.accessToken, `?period=${period}`)).body, `me third ${period}`).toMatchObject({ rank: 2, totalPlayers: 2 });
    }
    expect(summary((await board("capital-quiz")).body)).toEqual([[1, "Dürüst", 700]]);
    // overall: hilecinin iki türü de düşer
    expect(summary((await board("overall")).body)).toEqual([[1, "Dürüst", 1_900], [2, "Üçüncü", 900]]);
    expect((await board("overall")).body.totalPlayers).toBe(2);
    expect((await me("overall", honest.accessToken)).body).toEqual({ gameType: "overall", period: "all", rank: 1, personalBest: 1_900, totalPlayers: 2 });
    expect((await me("overall", third.accessToken)).body).toMatchObject({ rank: 2, totalPlayers: 2 });

    // Yeniden etkinleştirme geri alır: puanlar silinmedi.
    await setDisabled(cheater.user.id, false);
    expect(summary((await board("flag-quiz")).body)).toEqual([[1, "Hileci", 99_000], [2, "Dürüst", 1_200], [3, "Üçüncü", 900]]);
    expect((await me("flag-quiz", honest.accessToken)).body).toMatchObject({ rank: 2, totalPlayers: 3 });
    expect(summary((await board("overall")).body)[0]).toEqual([1, "Hileci", 149_000]);
  });

  it("finish yanıtındaki sıra devre dışı kullanıcıları saymaz", async () => {
    const cheater = await registerUser(t.http, { displayName: "Hileci 2" });
    const player = await registerUser(t.http, { displayName: "Oyuncu 2" });
    await insertScore(t, { userId: cheater.user.id, gameType: "map-guess", score: 5_000 });
    await setDisabled(cheater.user.id, true);
    // 4 tam + 1 yanlış tur: 5000'in altında kalır; hilecinin 5000'i sayılsaydı sıra 2 olurdu.
    const played = await playThrough(t, player.accessToken, "map-guess", { correct: (i) => i < 4 });
    expect(played.finish.score).toBeLessThan(5_000);
    expect(played.finish.rank).toBe(1);
    expect((await board("map-guess")).body.entries.map((e: { displayName: string }) => e.displayName)).toEqual(["Oyuncu 2"]);
  });
});
