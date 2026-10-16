import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { blogStatusEnum } from "./enums.js";
import { countries } from "./content.js";
import type { LooseTranslation, Translations } from "./types.js";
import { users } from "./users.js";

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    status: blogStatusEnum("status").notNull().default("draft"),
    /** Yazar silinirse null olur; yazı kalır. */
    authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
    coverImage: text("cover_image"),
    tags: text("tags").array().notNull().default([]),
    countryCode: text("country_code").references(() => countries.code, { onDelete: "set null" }),
    /** `{ tr: { title, excerpt, body: Block[] }, en?: ..., es?: ... }` */
    translations: jsonb("translations").$type<Translations<LooseTranslation>>().notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("blog_posts_status_published_idx").on(t.status, t.publishedAt),
    index("blog_posts_country_idx").on(t.countryCode),
    index("blog_posts_tags_idx").using("gin", t.tags),
  ],
);
