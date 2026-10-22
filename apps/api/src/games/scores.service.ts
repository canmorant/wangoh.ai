import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, lte, max, type SQL, sql } from "drizzle-orm";
import { AppException } from "../common/errors.js";
import { type Page, pageWindow, toPage } from "../common/pagination.js";
import { DATABASE, type Database } from "../db/client.js";
import { GAME_TYPES } from "../db/schema/enums.js";
import { scores, users } from "../db/schema/index.js";
import type { AdminScoreDto, ListScoresQueryDto } from "./dto/admin-scores.dto.js";
import type { GameTypeStatsDto, ListMyScoresQueryDto, ScoreDto, UserStatsDto } from "./dto/leaderboard.dto.js";

/** Kullanıcının istatistikleri, puan geçmişi ve yönetici silmesi. */
@Injectable()
export class ScoresService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Oyun türü başına oynama, en iyi, toplam, ortalama ve son oynama. Hiç oynanmayan türler sıfır/null döner. */
  async stats(userId: string): Promise<UserStatsDto> {
    const rows = await this.db
      .select({
        gameType: scores.gameType,
        gamesPlayed: sql<number>`count(*)::int`,
        bestScore: max(scores.score),
        totalScore: sql<number>`coalesce(sum(${scores.score}), 0)::int`,
        averageScore: sql<number>`avg(${scores.score})::float8`,
        lastPlayedAt: max(scores.createdAt),
      })
      .from(scores)
      .where(eq(scores.userId, userId))
      .groupBy(scores.gameType);
    const byType = new Map(rows.map((r) => [r.gameType, r]));

    const items: GameTypeStatsDto[] = GAME_TYPES.map((gameType) => {
      const r = byType.get(gameType);
      return {
        gameType,
        gamesPlayed: r ? Number(r.gamesPlayed) : 0,
        bestScore: r?.bestScore ?? null,
        totalScore: r ? Number(r.totalScore) : 0,
        // `avg` numeric'tir; float8'e çevrildi, bir ondalığa yuvarlanır.
        averageScore: r ? Math.round(Number(r.averageScore) * 10) / 10 : null,
        lastPlayedAt: r?.lastPlayedAt ? r.lastPlayedAt.toISOString() : null,
      };
    });
    return {
      items,
      gamesPlayed: items.reduce((sum, i) => sum + i.gamesPlayed, 0),
      totalScore: items.reduce((sum, i) => sum + i.totalScore, 0),
      overallBest: items.reduce((sum, i) => sum + (i.bestScore ?? 0), 0),
    };
  }

  /** Puan geçmişi: yeniden eskiye, sayfalı. */
  async history(userId: string, query: ListMyScoresQueryDto): Promise<Page<ScoreDto>> {
    const filters: SQL[] = [eq(scores.userId, userId)];
    if (query.gameType) filters.push(eq(scores.gameType, query.gameType));
    const where = and(...filters);
    const { limit, offset } = pageWindow(query);
    const [rows, [count]] = await Promise.all([
      this.db.select().from(scores).where(where).orderBy(desc(scores.createdAt), desc(scores.id)).limit(limit).offset(offset),
      this.db.select({ total: sql<number>`count(*)::int` }).from(scores).where(where),
    ]);
    return toPage(
      rows.map((r) => ({
        id: r.id,
        gameType: r.gameType,
        score: r.score,
        correctCount: r.correctCount,
        roundsTotal: r.roundsTotal,
        durationMs: r.durationMs,
        createdAt: r.createdAt.toISOString(),
      })),
      count?.total ?? 0,
      query,
    );
  }

  /**
   * Yönetici incelemesi: tüm kullanıcıların puanları, yeniden eskiye. Liderlik yalnız görünen ad gösterdiğinden puan
   * kimliğini bu liste verir (`DELETE /v1/scores/:id` için). `maxDurationMs` insanın ulaşamayacağı hızdaki oyunları bulur.
   */
  async listAll(query: ListScoresQueryDto): Promise<Page<AdminScoreDto>> {
    const filters: SQL[] = [];
    if (query.userId) filters.push(eq(scores.userId, query.userId));
    if (query.sessionId) filters.push(eq(scores.sessionId, query.sessionId));
    if (query.gameType) filters.push(eq(scores.gameType, query.gameType));
    if (query.maxDurationMs !== undefined) filters.push(lte(scores.durationMs, query.maxDurationMs));
    const where = filters.length > 0 ? and(...filters) : undefined;
    const { limit, offset } = pageWindow(query);
    const [rows, [count]] = await Promise.all([
      this.db
        .select({
          id: scores.id,
          sessionId: scores.sessionId,
          userId: scores.userId,
          displayName: users.displayName,
          userDisabled: users.disabled,
          gameType: scores.gameType,
          score: scores.score,
          correctCount: scores.correctCount,
          roundsTotal: scores.roundsTotal,
          durationMs: scores.durationMs,
          createdAt: scores.createdAt,
        })
        .from(scores)
        .innerJoin(users, eq(users.id, scores.userId))
        .where(where)
        .orderBy(desc(scores.createdAt), desc(scores.id))
        .limit(limit)
        .offset(offset),
      this.db.select({ total: sql<number>`count(*)::int` }).from(scores).where(where),
    ]);
    return toPage(
      rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
      count?.total ?? 0,
      query,
    );
  }

  /** Hileli puanı siler (yönetici). Oturum kaydı kalır; aynı oturum bir daha puan yazmaz. */
  async remove(id: string): Promise<void> {
    const deleted = await this.db.delete(scores).where(eq(scores.id, id)).returning({ id: scores.id });
    if (deleted.length === 0) throw AppException.notFound("Puan bulunamadı.");
  }
}
