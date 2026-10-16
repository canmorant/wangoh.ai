import { desc } from "drizzle-orm";
import { index, integer, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { gameStatusEnum, gameTypeEnum } from "./enums.js";
import { users } from "./users.js";

/**
 * Sunucu kontrollü oyun oturumu. `rounds` sunucu sırrıdır (hedefler, seçenekler, verilen cevaplar):
 * oturum bitmeden istemciye gitmez.
 */
export const gameSessions = pgTable(
  "game_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameType: gameTypeEnum("game_type").notNull(),
    status: gameStatusEnum("status").notNull().default("active"),
    rounds: jsonb("rounds").$type<unknown[]>().notNull().default([]),
    currentRound: integer("current_round").notNull().default(0),
    roundStartedAt: timestamp("round_started_at", { withTimezone: true }),
    score: integer("score").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    /** Başlangıç + 30 dk. */
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("game_sessions_user_type_status_idx").on(t.userId, t.gameType, t.status)],
);

export const scores = pgTable(
  "scores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameType: gameTypeEnum("game_type").notNull(),
    sessionId: uuid("session_id")
      .notNull()
      .unique()
      .references(() => gameSessions.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    correctCount: integer("correct_count").notNull(),
    roundsTotal: integer("rounds_total").notNull(),
    /** Süreyi sunucu ölçer; istemcinin bildirdiği süre kullanılmaz. */
    durationMs: integer("duration_ms").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("scores_game_type_score_idx").on(t.gameType, desc(t.score)),
    index("scores_user_game_type_idx").on(t.userId, t.gameType),
  ],
);
