import type { GameType } from "../db/schema/enums.js";

/** Liderlikte oyun türlerinin yanında kabul edilen toplam sıralama anahtarı. */
export const OVERALL = "overall" as const;
export const LEADERBOARD_TYPES = ["flag-quiz", "capital-quiz", "map-guess", OVERALL] as const;
export type LeaderboardType = (typeof LEADERBOARD_TYPES)[number];

export const PERIODS = ["all", "week", "day"] as const;
export type Period = (typeof PERIODS)[number];
/** Kayan pencere uzunlukları (UTC takvim günü değil: son 7 gün / son 24 saat). */
export const PERIOD_WINDOW_MS: Record<Exclude<Period, "all">, number> = {
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
};

/** Çoktan seçmeli oyunlarda tur sayısı ve seçenek sayısı. */
export const CHOICE_ROUNDS = 10;
export const CHOICE_OPTIONS = 4;
export const MAP_GUESS_ROUNDS = 5;
/** Havuzda bu kadar uygun ülke yoksa oyun başlamaz (409 `GAME_POOL_TOO_SMALL`). */
export const MIN_POOL_SIZE = 10;

/**
 * Bayrağı başka bir ülkeyle aynı olan bağımlı bölgeler. `flag-quiz`'de bayrak gösterildiğinde doğru cevap
 * belirsiz kalır (Svalbard, Norveç bayrağını kullanır), bu yüzden hedef ya da seçenek olarak seçilmezler.
 * `capital-quiz` ve `map-guess` ülke adını gösterdiği için etkilenmez.
 */
export const SHARED_FLAG_DEPENDENCIES: ReadonlySet<string> = new Set(["SJ"]);

/** Tur süresi (istemciye bildirilir) ve ağ payı: bu ikisinin toplamını aşan cevap zaman aşımıdır. */
export const ROUND_TIME_LIMIT_MS = 20_000;
export const NETWORK_GRACE_MS = 3_000;
/** Oturumun ömrü: başlangıç + 30 dk. */
export const SESSION_TTL_MS = 30 * 60 * 1000;
/** Terk edilmiş/süresi dolmuş oturum kayıtları bu süre sonra, o kullanıcının bir sonraki başlatmasında temizlenir. */
export const STALE_SESSION_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
/** Kullanıcı başına tutulan terk edilmiş/süresi dolmuş oturum sayısı (en yeniler); fazlası her başlatmada silinir. */
export const MAX_STALE_SESSIONS_PER_USER = 20;

/** Çoktan seçmeli puan: 100 + hız bonusu (en çok 50) + seri bonusu (en çok 50). */
export const CHOICE_BASE_POINTS = 100;
export const SPEED_BONUS_MAX = 50;
export const SPEED_WINDOW_MS = 15_000;
export const STREAK_BONUS_STEP = 10;
export const STREAK_BONUS_MAX = 50;

/**
 * Harita oyunu (web "Haritada Bul" ile aynı formül, `apps/web/src/features/map-game/scoring.ts`):
 * 50 km'ye kadar tam puan, ötesinde `round(1000 * exp(-(km - 50) / 1200))`.
 */
export const MAP_MAX_ROUND_POINTS = 1000;
export const MAP_FULL_SCORE_KM = 50;
export const MAP_SCORE_SCALE_KM = 1200;
export const EARTH_RADIUS_KM = 6371;

/** Tek oturumda ulaşılabilecek en yüksek toplam (sunucu tarafı tavan). */
export const MAX_SESSION_SCORE: Record<GameType, number> = {
  "flag-quiz": 2000,
  "capital-quiz": 2000,
  "map-guess": 5000,
};

export const ROUNDS_PER_GAME: Record<GameType, number> = {
  "flag-quiz": CHOICE_ROUNDS,
  "capital-quiz": CHOICE_ROUNDS,
  "map-guess": MAP_GUESS_ROUNDS,
};

/** Liderlik listesi sınırları. */
export const LEADERBOARD_DEFAULT_LIMIT = 20;
export const LEADERBOARD_MAX_LIMIT = 100;

/** Makine okur hata kodları (`code`); durum kodları denetleyici belgelerinde. */
export const GameErrorCode = {
  POOL_TOO_SMALL: "GAME_POOL_TOO_SMALL",
  SESSION_EXPIRED: "GAME_SESSION_EXPIRED",
  SESSION_NOT_ACTIVE: "GAME_SESSION_NOT_ACTIVE",
  ROUND_ALREADY_ANSWERED: "GAME_ROUND_ALREADY_ANSWERED",
  ROUND_OUT_OF_ORDER: "GAME_ROUND_OUT_OF_ORDER",
  NO_ROUND_LEFT: "GAME_NO_ROUND_LEFT",
  NOT_FINISHED: "GAME_NOT_FINISHED",
  SCORE_REMOVED: "GAME_SCORE_REMOVED",
} as const;
