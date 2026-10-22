import { Inject, Injectable } from "@nestjs/common";
import { type SQL, sql } from "drizzle-orm";
import { DATABASE, type Database, rowsOf } from "../db/client.js";
import { GAME_TYPES, type GameType } from "../db/schema/enums.js";
import type { LeaderboardDto, LeaderboardMeDto } from "./dto/leaderboard.dto.js";
import { type LeaderboardType, OVERALL, PERIOD_WINDOW_MS, type Period } from "./games.constants.js";
import { GameClock } from "./games.runtime.js";

export interface Standing {
  /** Dönemdeki en iyi puan (`overall`te toplam); puan yoksa null. */
  personalBest: number | null;
  /** 1 + kullanıcıdan KESİN yüksek puanlı oyuncu sayısı (eşit puan aynı sıra); puan yoksa null. */
  rank: number | null;
  totalPlayers: number;
}

interface ListRow {
  rank: number | string | bigint;
  score: number | string | bigint;
  achieved_ms: number | string;
  total: number | string | bigint;
  display_name: string;
  is_me: boolean;
}

const asNumber = (value: number | string | bigint | null | undefined): number => Number(value ?? 0);

/**
 * Devre dışı bırakılmış hesapların puanları liderlikte, sırada ve oyuncu sayısında yer almaz (hilecinin 1. kalmaması
 * için). Geri alınabilir: puanlar silinmez, hesap yeniden etkinleştirilince geri döner. `scores` tablosu `s` takma
 * adıyla kullanılmalı. `NOT EXISTS` kullanıcı tablosunda yalnız (az sayıdaki) devre dışı satırlara bakar.
 */
const NOT_DISABLED: SQL = sql`not exists (select 1 from users du where du.id = s.user_id and du.disabled)`;

/**
 * Liderlik tabloları. Bir kullanıcı tabloda tek satırdır: dönemdeki EN İYİ tek oyun puanı. Eşit puanda
 * puana önce ulaşan üstte, sıra numarası ise `rank()` gibi eşit puanlarda aynıdır (1, 2, 2, 4).
 * Satırlarda yalnız `displayName` döner; kullanıcı kimliği ve e-posta SQL'den bile çıkmaz.
 *
 * Verimlilik (bkz. `games/README.md`): tek tür için `finish`/`me` yolları dizin dostudur
 * (`scores_user_game_type_idx`, `scores_game_type_score_idx`); tam liste türün bölümünü bir kez, `overall` her
 * türün bölümünü ayrı ayrı tarar (`DISTINCT ON`), sıralama pencere fonksiyonuyla yapılır.
 */
@Injectable()
export class LeaderboardsService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly clock: GameClock,
  ) {}

  /** Kayan pencerenin başlangıcı; `all` için null. */
  windowStart(period: Period): Date | null {
    if (period === "all") return null;
    return new Date(this.clock.now().getTime() - PERIOD_WINDOW_MS[period]);
  }

  async list(type: LeaderboardType, period: Period, limit: number, viewerId: string | undefined): Promise<LeaderboardDto> {
    const best = bestPerUser(type, this.windowStart(period));
    const isMe = viewerId ? sql`(t.user_id = ${viewerId}::uuid)` : sql`false`;
    const result = await this.db.execute(sql`
      with best as (${best}),
      ranked as (
        select user_id, score, achieved_at,
               rank() over (order by score desc) as rank,
               count(*) over () as total
        from best
      ),
      top as (
        select * from ranked order by score desc, achieved_at asc, user_id asc limit ${limit}
      )
      select t.rank, t.score, (extract(epoch from t.achieved_at) * 1000)::float8 as achieved_ms,
             t.total, u.display_name, ${isMe} as is_me
      from top t
      join users u on u.id = t.user_id
      order by t.score desc, t.achieved_at asc, t.user_id asc
    `);
    const rows = rowsOf<ListRow>(result);
    return {
      gameType: type,
      period,
      totalPlayers: rows.length > 0 ? asNumber(rows[0]!.total) : 0,
      entries: rows.map((r) => ({
        rank: asNumber(r.rank),
        displayName: r.display_name,
        score: asNumber(r.score),
        achievedAt: new Date(Math.round(asNumber(r.achieved_ms))).toISOString(),
        isMe: r.is_me === true,
      })),
    };
  }

  async me(userId: string, type: LeaderboardType, period: Period): Promise<LeaderboardMeDto> {
    const standing = await this.standing(this.db, userId, type, this.windowStart(period), true);
    return { gameType: type, period, rank: standing.rank, personalBest: standing.personalBest, totalPlayers: standing.totalPlayers };
  }

  /**
   * Kullanıcının sırası ve en iyisi. Tek tür için üç dizin dostu sorgu: kendi en iyisi, ondan KESİN yüksek
   * puanı olan farklı oyuncu sayısı (`scores_game_type_score_idx` aralık taraması), isteğe bağlı toplam oyuncu.
   * `overall` bölümü toplayarak hesaplar.
   */
  async standing(executor: Database, userId: string, type: LeaderboardType, since: Date | null, withTotal: boolean): Promise<Standing> {
    if (type === OVERALL) return this.overallStanding(executor, userId, since);
    const sinceCond = since ? sql`and s.created_at >= ${since.toISOString()}::timestamptz` : sql``;
    // Kendi en iyim: sorgulayan kullanıcı etkindir (devre dışı hesap belirteç alamaz), ayrıca süzmeye gerek yok.
    const [mine] = rowsOf<{ best: number | string | null }>(
      await executor.execute(sql`select max(s.score) as best from scores s where s.user_id = ${userId}::uuid and s.game_type = ${type}::game_type ${sinceCond}`),
    );
    const personalBest = mine?.best === null || mine?.best === undefined ? null : asNumber(mine.best);
    let rank: number | null = null;
    if (personalBest !== null) {
      const [above] = rowsOf<{ n: number | string }>(
        await executor.execute(
          sql`select count(distinct s.user_id) as n from scores s where s.game_type = ${type}::game_type and s.score > ${personalBest} ${sinceCond} and ${NOT_DISABLED}`,
        ),
      );
      rank = asNumber(above?.n) + 1;
    }
    let totalPlayers = 0;
    if (withTotal) {
      const [total] = rowsOf<{ n: number | string }>(
        await executor.execute(sql`select count(distinct s.user_id) as n from scores s where s.game_type = ${type}::game_type ${sinceCond} and ${NOT_DISABLED}`),
      );
      totalPlayers = asNumber(total?.n);
    }
    return { personalBest, rank, totalPlayers };
  }

  private async overallStanding(executor: Database, userId: string, since: Date | null): Promise<Standing> {
    const result = await executor.execute(sql`
      with best as (${bestPerUser(OVERALL, since)}),
      mine as (select score from best where user_id = ${userId}::uuid)
      select (select score from mine) as best,
             (select count(*) from best where score > (select score from mine)) as above,
             (select count(*) from best) as total
    `);
    const [row] = rowsOf<{ best: number | string | null; above: number | string; total: number | string }>(result);
    const personalBest = row?.best === null || row?.best === undefined ? null : asNumber(row.best);
    return { personalBest, rank: personalBest === null ? null : asNumber(row?.above) + 1, totalPlayers: asNumber(row?.total) };
  }
}

/**
 * Kullanıcı başına tek satır `(user_id, score, achieved_at)`:
 * - tek tür: dönemdeki en iyi puan ve ona İLK ulaşıldığı an;
 * - `overall`: oyun türü başına en iyilerin toplamı ve en son tamamlanan türün anı (toplama ulaşıldığı an).
 */
function bestPerUser(type: LeaderboardType, since: Date | null): SQL {
  if (type === OVERALL) {
    // Tür başına ayrı `DISTINCT ON` + `UNION ALL`: her kol `scores_game_type_score_idx` ile kendi türünü tarar. Tek
    // `DISTINCT ON (user_id, game_type)` tüm tabloyu kullanıcıya göre sıralardı (100 bin kullanıcı / 800 bin puanda ≈ 3 kat yavaş).
    const perType = sql.join(
      GAME_TYPES.map((t) => sql`(${bestOfType(t, since)})`),
      sql` union all `,
    );
    return sql`
      select b.user_id, sum(b.score)::int as score, max(b.achieved_at) as achieved_at
      from (${perType}) b
      group by b.user_id`;
  }
  return bestOfType(type as GameType, since);
}

/** Tek oyun türünde kullanıcı başına en iyi puan ve ona İLK ulaşıldığı an. */
function bestOfType(type: GameType, since: Date | null): SQL {
  const sinceCond = since ? sql`and s.created_at >= ${since.toISOString()}::timestamptz` : sql``;
  return sql`
    select distinct on (s.user_id) s.user_id, s.score, s.created_at as achieved_at
    from scores s
    where s.game_type = ${type}::game_type ${sinceCond} and ${NOT_DISABLED}
    order by s.user_id, s.score desc, s.created_at asc, s.id asc`;
}
