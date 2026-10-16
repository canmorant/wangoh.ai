import { pgEnum } from "drizzle-orm/pg-core";

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const userRoleEnum = pgEnum("user_role", USER_ROLES);

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];
export const blogStatusEnum = pgEnum("blog_status", BLOG_STATUSES);

export const GAME_TYPES = ["flag-quiz", "capital-quiz", "map-guess"] as const;
export type GameType = (typeof GAME_TYPES)[number];
export const gameTypeEnum = pgEnum("game_type", GAME_TYPES);

export const GAME_STATUSES = ["active", "finished", "abandoned", "expired"] as const;
export type GameStatus = (typeof GAME_STATUSES)[number];
export const gameStatusEnum = pgEnum("game_status", GAME_STATUSES);
