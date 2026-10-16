import { sql } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums.js";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Küçük harfe çevrilmiş ve kırpılmış e-posta. Benzersizlik `lower(email)` üzerinde. */
    email: text("email").notNull(),
    /** `scrypt$N$r$p$salt$hash`; API yanıtlarında asla dönmez. */
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    disabled: boolean("disabled").notNull().default(false),
    /**
     * Erişim belirtecindeki `ver` talebiyle karşılaştırılır. Parola değişince artar; böylece
     * eski erişim belirteçleri 15 dk beklemeden anında geçersiz olur.
     */
    tokenVersion: integer("token_version").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_lower_idx").on(sql`lower(${t.email})`), index("users_role_idx").on(t.role)],
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Aynı girişten türeyen belirteçler aynı ailede durur; yeniden kullanımda aile iptal edilir. */
    familyId: uuid("family_id").notNull(),
    /**
     * Verildiği andaki `users.token_version`. Yenilemede kullanıcının güncel değeriyle eşleşmezse
     * (parola değişimiyle yarışan bir yenileme belirteç üretmiş olabilir) belirteç geçersizdir.
     */
    tokenVersion: integer("token_version").notNull().default(0),
    /** Ham değerin SHA-256 özeti (hex). Ham belirteç veritabanına yazılmaz. */
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    /** Döndürülerek (rotation) harcandığı an. Dolu bir belirteç tekrar gelirse yeniden kullanım sayılır. */
    usedAt: timestamp("used_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("refresh_tokens_user_idx").on(t.userId), index("refresh_tokens_family_idx").on(t.familyId)],
);

export type RefreshTokenRow = typeof refreshTokens.$inferSelect;
