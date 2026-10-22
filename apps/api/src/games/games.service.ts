import { Inject, Injectable } from "@nestjs/common";
import { and, asc, desc, eq, inArray, isNotNull, lt, max, ne, notInArray, or, sql } from "drizzle-orm";
import { TokensService } from "../auth/tokens.service.js";
import type { AuthUser } from "../common/auth-types.js";
import type { Lang } from "../common/lang.js";
import { APP_CONFIG } from "../config/config.module.js";
import type { AppConfig } from "../config/env.js";
import { DATABASE, type Database } from "../db/client.js";
import type { GameType } from "../db/schema/enums.js";
import { countries, gameSessions, scores } from "../db/schema/index.js";
import type { AnswerResponseDto, FinishResponseDto, GameRoundDto, GameSessionDto, StartSessionResponseDto } from "./dto/game.dto.js";
import type { SubmitAnswerDto } from "./dto/game-requests.dto.js";
import { type GameStrategy, streakBefore, strategyFor } from "./game-engine.js";
import {
  MAX_SESSION_SCORE,
  MAX_STALE_SESSIONS_PER_USER,
  NETWORK_GRACE_MS,
  ROUND_TIME_LIMIT_MS,
  SESSION_TTL_MS,
  STALE_SESSION_RETENTION_MS,
} from "./games.constants.js";
import {
  accountGone,
  noRoundLeft,
  notFinished,
  roundAlreadyAnswered,
  roundOutOfOrder,
  scoreRemoved,
  sessionExpired,
  sessionNotActive,
  sessionNotFound,
} from "./games.errors.js";
import { GameClock, GameRandom } from "./games.runtime.js";
import type { CountryNames, PoolCountry, StoredResult, StoredRound } from "./games.types.js";
import { LeaderboardsService } from "./leaderboards.service.js";

type SessionRow = typeof gameSessions.$inferSelect;
type ScoreRow = typeof scores.$inferSelect;

/** `rounds` sütunu sunucu sırrıdır; yalnız bu servis ve `GameStrategy` görünümleri okur. */
const roundsOf = (row: SessionRow): StoredRound[] => row.rounds as StoredRound[];

/** Bir istekteki hata, işlem sonrasına bırakılacaksa (durum yazılıp ONDAN SONRA fırlatılacaksa) bu işaret döner. */
interface Expired {
  kind: "expired";
}

/**
 * Oyun oturumları. Doğru cevaplar, hedef koordinatlar ve gelecek turların seçenekleri `rounds` sütununda
 * kalır ve istemciye yalnız `GameStrategy` görünümleri (soru + seçenekler) gider; cevaplanmış turun doğru
 * cevabı da yalnız o turun cevap yanıtında döner.
 *
 * Eşzamanlılık: oturumu değiştiren her işlem önce sahibinin `users` satırını (`FOR NO KEY UPDATE`, projedeki
 * kilit sırası `users` -> alt tablolar), sonra oturum satırını `FOR UPDATE` kilitler. Böylece
 * - bir kullanıcının aynı türde tek etkin oturumu olur (yeni başlatma eskiyi kapatır; iki başlatma sıraya girer),
 * - aynı tura iki cevap yarışırsa yalnız biri puan alır (öbürü 409),
 * - iki `finish` tek puan satırı yazar,
 * - hesap silme (`users` `FOR UPDATE`) ile kilitlenme (deadlock) oluşmaz.
 */
@Injectable()
export class GamesService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly tokens: TokensService,
    private readonly leaderboards: LeaderboardsService,
    private readonly clock: GameClock,
    private readonly random: GameRandom,
  ) {}

  // --- başlat -----------------------------------------------------------

  async startSession(user: AuthUser, gameType: GameType, lang: Lang): Promise<StartSessionResponseDto> {
    const strategy = strategyFor(gameType);
    const pool = await this.loadPool(gameType);
    const rounds = strategy.buildRounds(pool, () => this.random.next());
    const now = this.clock.now();
    const nowIso = now.toISOString();

    const session = await this.db.transaction(async (tx) => {
      if (!(await this.tokens.lockUser(tx, user.id))) throw accountGone();
      // Aynı türde önceki etkin oturum kapanır: süresi dolmuşsa expired, değilse abandoned.
      await tx
        .update(gameSessions)
        .set({
          status: sql`case when ${gameSessions.expiresAt} <= ${nowIso}::timestamptz then 'expired'::game_status else 'abandoned'::game_status end`,
        })
        .where(and(eq(gameSessions.userId, user.id), eq(gameSessions.gameType, gameType), eq(gameSessions.status, "active")));
      // Çöp temizliği (yalnız bu kullanıcının kayıtları; puanlı `finished` kayıtlar ve puanları hiç silinmez):
      // 1) 7 günden eski bitmemiş oturumlar. Terk/süresi dolmuşların yanında başka türdeki dokunulmamış `active` satırlar da
      //    gider: 30 dk ömürleri çoktan bitti ve bir daha kullanılamaz.
      await tx
        .delete(gameSessions)
        .where(and(eq(gameSessions.userId, user.id), ne(gameSessions.status, "finished"), lt(gameSessions.startedAt, new Date(now.getTime() - STALE_SESSION_RETENTION_MS))));
      // 2) Kalan terk/süresi dolmuş kayıtlardan yalnız en yeni N tanesi tutulur: art arda başlatma satır sayısını (her satır
      //    birkaç KB `rounds`) 7 gün boyunca sınırsız şişiremez. Yeni satır bundan SONRA eklenir; etkin oturum sayılmaz.
      const staleStatuses = ["abandoned", "expired"] as const;
      await tx.delete(gameSessions).where(
        and(
          eq(gameSessions.userId, user.id),
          inArray(gameSessions.status, staleStatuses),
          notInArray(
            gameSessions.id,
            tx
              .select({ id: gameSessions.id })
              .from(gameSessions)
              .where(and(eq(gameSessions.userId, user.id), inArray(gameSessions.status, staleStatuses)))
              .orderBy(desc(gameSessions.startedAt), desc(gameSessions.id))
              .limit(MAX_STALE_SESSIONS_PER_USER),
          ),
        ),
      );
      const [row] = await tx
        .insert(gameSessions)
        .values({
          userId: user.id,
          gameType,
          status: "active",
          rounds,
          currentRound: 0,
          roundStartedAt: now,
          startedAt: now,
          expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
        })
        .returning();
      return row!;
    });

    return {
      sessionId: session.id,
      gameType,
      roundsTotal: rounds.length,
      expiresAt: session.expiresAt.toISOString(),
      round: this.roundView(strategy, rounds[0]!, 0, now, lang),
    };
  }

  // --- oku --------------------------------------------------------------

  async getSession(user: AuthUser, id: string, lang: Lang): Promise<GameSessionDto> {
    let row = await this.requireOwned(this.db, user.id, id);
    // Tembel sona erdirme: süresi dolan etkin oturum bu istekte `expired` olur.
    if (row.status === "active" && row.expiresAt.getTime() <= this.clock.now().getTime()) {
      const [updated] = await this.db
        .update(gameSessions)
        .set({ status: "expired" })
        .where(and(eq(gameSessions.id, id), eq(gameSessions.status, "active")))
        .returning();
      row = updated ?? (await this.requireOwned(this.db, user.id, id));
    }
    return this.sessionView(row, lang);
  }

  // --- cevap ------------------------------------------------------------

  async submitAnswer(user: AuthUser, id: string, dto: SubmitAnswerDto, lang: Lang): Promise<AnswerResponseDto> {
    const outcome = await this.db.transaction(async (tx) => {
      if (!(await this.tokens.lockUser(tx, user.id))) throw accountGone();
      const row = await this.lockOwned(tx, user.id, id);
      const now = this.clock.now();

      const expired = await this.expireIfDue(tx, row, now);
      if (expired) return expired;
      if (row.status !== "active") throw sessionNotActive();

      const rounds = roundsOf(row);
      if (row.currentRound >= rounds.length) throw noRoundLeft();
      if (dto.roundIndex < row.currentRound) throw roundAlreadyAnswered();
      if (dto.roundIndex > row.currentRound) throw roundOutOfOrder();

      const index = row.currentRound;
      const round = rounds[index]!;
      const strategy = strategyFor(row.gameType);
      // Biçim hatası turu tüketmez (400); doğru cevabı ele vermez.
      const answer = strategy.parseAnswer(dto.answer, round);

      const startedAt = row.roundStartedAt ?? row.startedAt;
      const elapsedMs = Math.max(0, now.getTime() - startedAt.getTime());
      // Cevap yoksa (`null`) süre, bildirilen tur süresine (20 sn) göre; cevap varsa ağ payı (3 sn) dahil.
      const timedOut = answer === null ? elapsedMs > ROUND_TIME_LIMIT_MS : elapsedMs > ROUND_TIME_LIMIT_MS + NETWORK_GRACE_MS;
      const graded = timedOut
        ? { correct: false, points: 0, speedBonus: 0, streakBonus: 0, streak: 0, distanceKm: null }
        : strategy.grade(round, answer, { elapsedMs, streakBefore: streakBefore(rounds, index) });

      const result: StoredResult = { answer, ...graded, elapsedMs, timedOut, answeredAt: now.toISOString() };
      const updatedRounds = rounds.map((r, i) => (i === index ? { ...r, result } : r));
      const nextIndex = index + 1;
      const hasNext = nextIndex < rounds.length;
      const score = Math.min(MAX_SESSION_SCORE[row.gameType], row.score + graded.points);

      await tx
        .update(gameSessions)
        .set({
          rounds: updatedRounds,
          currentRound: nextIndex,
          roundStartedAt: hasNext ? now : null,
          score,
          correctCount: row.correctCount + (graded.correct ? 1 : 0),
        })
        .where(eq(gameSessions.id, id));

      return { kind: "ok" as const, strategy, round, result, rounds: updatedRounds, nextIndex, hasNext, score, now };
    });

    if (outcome.kind === "expired") throw sessionExpired();

    const { strategy, round, result, rounds, nextIndex, hasNext, score, now } = outcome;
    return {
      correct: result.correct,
      correctAnswer: strategy.correctAnswer(round, lang),
      points: result.points,
      score,
      timedOut: result.timedOut,
      speedBonus: result.speedBonus,
      streakBonus: result.streakBonus,
      streak: result.streak,
      distanceKm: result.distanceKm,
      nextRound: hasNext ? this.roundView(strategy, rounds[nextIndex]!, nextIndex, now, lang) : null,
    };
  }

  // --- bitir ------------------------------------------------------------

  /** Tüm turlar cevaplanınca tek puan satırı yazar. İdempotent: yinelenen ve eşzamanlı çağrılar aynı satırı döner. */
  async finishSession(user: AuthUser, id: string): Promise<FinishResponseDto> {
    const outcome = await this.db.transaction(async (tx) => {
      if (!(await this.tokens.lockUser(tx, user.id))) throw accountGone();
      const row = await this.lockOwned(tx, user.id, id);
      const now = this.clock.now();

      if (row.status === "finished") {
        const [existing] = await tx.select().from(scores).where(eq(scores.sessionId, id)).limit(1);
        // Yönetici puanı sildiyse yeniden yazılmaz.
        if (!existing) throw scoreRemoved();
        return { kind: "ok" as const, score: existing };
      }
      const expired = await this.expireIfDue(tx, row, now);
      if (expired) return expired;
      if (row.status !== "active") throw sessionNotActive();

      const rounds = roundsOf(row);
      if (row.currentRound < rounds.length) throw notFinished();

      const durationMs = Math.min(
        2_147_483_647,
        rounds.reduce((sum, r) => sum + (r.result?.elapsedMs ?? 0), 0),
      );
      await tx.update(gameSessions).set({ status: "finished", finishedAt: now }).where(eq(gameSessions.id, id));
      const [inserted] = await tx
        .insert(scores)
        .values({
          userId: user.id,
          gameType: row.gameType,
          sessionId: id,
          score: row.score,
          correctCount: row.correctCount,
          roundsTotal: rounds.length,
          durationMs,
        })
        .onConflictDoNothing({ target: scores.sessionId })
        .returning();
      const score = inserted ?? (await tx.select().from(scores).where(eq(scores.sessionId, id)).limit(1))[0];
      if (!score) throw scoreRemoved();
      return { kind: "ok" as const, score };
    });

    if (outcome.kind === "expired") throw sessionExpired();
    return this.finishView(outcome.score);
  }

  // --- görünümler -------------------------------------------------------

  private async finishView(score: ScoreRow): Promise<FinishResponseDto> {
    const standing = await this.leaderboards.standing(this.db, score.userId, score.gameType, null, false);
    // Önceki en iyi: bu puandan ÖNCE yazılmış satırların en yükseği (yeniden `finish` aynı sonucu verir).
    const [previous] = await this.db
      .select({ best: max(scores.score) })
      .from(scores)
      .where(
        and(
          eq(scores.userId, score.userId),
          eq(scores.gameType, score.gameType),
          or(lt(scores.createdAt, score.createdAt), and(eq(scores.createdAt, score.createdAt), lt(scores.id, score.id))),
        ),
      );
    const personalBest = standing.personalBest ?? score.score;
    return {
      sessionId: score.sessionId,
      scoreId: score.id,
      gameType: score.gameType,
      score: score.score,
      correctCount: score.correctCount,
      roundsTotal: score.roundsTotal,
      durationMs: score.durationMs,
      rank: standing.rank ?? 1,
      personalBest,
      isPersonalBest: previous?.best === null || previous?.best === undefined || score.score > previous.best,
    };
  }

  private sessionView(row: SessionRow, lang: Lang): GameSessionDto {
    const rounds = roundsOf(row);
    const strategy = strategyFor(row.gameType);
    const showRound = row.status === "active" && row.currentRound < rounds.length;
    return {
      sessionId: row.id,
      gameType: row.gameType,
      status: row.status,
      roundsTotal: rounds.length,
      currentRound: row.currentRound,
      score: row.score,
      correctCount: row.correctCount,
      startedAt: row.startedAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
      finishedAt: row.finishedAt ? row.finishedAt.toISOString() : null,
      round: showRound ? this.roundView(strategy, rounds[row.currentRound]!, row.currentRound, row.roundStartedAt ?? row.startedAt, lang) : null,
      // Doğru cevap YOK: yalnız tur sonucu özeti.
      results: rounds.flatMap((r, index) => (r.result ? [{ index, correct: r.result.correct, points: r.result.points, timedOut: r.result.timedOut }] : [])),
    };
  }

  /** İstemciye giden tur: soru ve seçenekler. `StoredRound`un kendisi (hedef kodu, koordinat, sonuç) buradan çıkmaz. */
  private roundView(strategy: GameStrategy, round: StoredRound, index: number, startedAt: Date, lang: Lang): GameRoundDto {
    return {
      index,
      question: strategy.question(round, lang, this.config.assetsBaseUrl),
      options: strategy.options(round, lang),
      timeLimitMs: ROUND_TIME_LIMIT_MS,
      startedAt: startedAt.toISOString(),
      deadlineAt: new Date(startedAt.getTime() + ROUND_TIME_LIMIT_MS).toISOString(),
    };
  }

  // --- yardımcılar ------------------------------------------------------

  /** Oturumu kilitlemeden okur; yoksa ya da başkasınınsa 404. */
  private async requireOwned(executor: Database, userId: string, id: string): Promise<SessionRow> {
    const [row] = await executor.select().from(gameSessions).where(eq(gameSessions.id, id)).limit(1);
    if (!row || row.userId !== userId) throw sessionNotFound();
    return row;
  }

  /** Oturumu `FOR UPDATE` kilitler; yoksa ya da başkasınınsa 404. */
  private async lockOwned(tx: Database, userId: string, id: string): Promise<SessionRow> {
    const [row] = await tx.select().from(gameSessions).where(eq(gameSessions.id, id)).for("update");
    if (!row || row.userId !== userId) throw sessionNotFound();
    return row;
  }

  /**
   * Süresi dolmuşsa (etkin ve `expires_at` geçmiş, ya da zaten `expired`) durumu yazar ve işaret döner. Hata,
   * işlem tamamlandıktan SONRA fırlatılır; aksi halde geri alma `expired` işaretini de silerdi.
   */
  private async expireIfDue(tx: Database, row: SessionRow, now: Date): Promise<Expired | null> {
    if (row.status === "expired") return { kind: "expired" };
    if (row.status === "active" && row.expiresAt.getTime() <= now.getTime()) {
      await tx.update(gameSessions).set({ status: "expired" }).where(eq(gameSessions.id, row.id));
      return { kind: "expired" };
    }
    return null;
  }

  /** Havuz: `countries` tablosundan türe uygun ülkeler (ad, bayrak, başkent, koordinat). */
  private async loadPool(gameType: GameType): Promise<PoolCountry[]> {
    const eligibility =
      gameType === "capital-quiz"
        ? sql`cardinality(${countries.capital}) > 0`
        : gameType === "map-guess"
          ? and(isNotNull(countries.latitude), isNotNull(countries.longitude))
          : undefined;
    const rows = await this.db
      .select({
        code: countries.code,
        continentSlug: countries.continentSlug,
        flag: countries.flag,
        capital: countries.capital,
        latitude: countries.latitude,
        longitude: countries.longitude,
        nameTr: sql<string | null>`${countries.translations} #>> '{tr,name}'`,
        nameEn: sql<string | null>`${countries.translations} #>> '{en,name}'`,
        nameEs: sql<string | null>`${countries.translations} #>> '{es,name}'`,
      })
      .from(countries)
      .where(eligibility)
      .orderBy(asc(countries.code));

    const pool: PoolCountry[] = [];
    for (const r of rows) {
      const nameTr = r.nameTr?.trim();
      if (!nameTr) continue;
      const names: CountryNames = { tr: { name: nameTr } };
      if (r.nameEn?.trim()) names.en = { name: r.nameEn.trim() };
      if (r.nameEs?.trim()) names.es = { name: r.nameEs.trim() };
      pool.push({
        code: r.code,
        continentSlug: r.continentSlug,
        flag: r.flag,
        names,
        capital: r.capital.map((c) => c.trim()).filter((c) => c !== ""),
        latitude: r.latitude,
        longitude: r.longitude,
      });
    }
    return pool;
  }
}
