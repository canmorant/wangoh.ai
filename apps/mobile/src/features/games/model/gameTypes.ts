/**
 * Oyun türleri ve arayüz etiketleri. Saf modül (React Native içe aktarmaz), birim testle denenir.
 * İçerik verisi (ülke, bayrak, başkent) burada YOKTUR; yalnız oyunun kendi adı ve açıklaması.
 */

export const PLAYABLE_GAME_TYPES = ["flag-quiz", "capital-quiz", "map-guess"] as const;
export type PlayableGameType = (typeof PLAYABLE_GAME_TYPES)[number];

export const LEADERBOARD_TYPES = ["overall", ...PLAYABLE_GAME_TYPES] as const;
export type LeaderboardTypeKey = (typeof LEADERBOARD_TYPES)[number];

export const LEADERBOARD_PERIODS = ["all", "week", "day"] as const;
export type LeaderboardPeriodKey = (typeof LEADERBOARD_PERIODS)[number];

/** Liderlik listesinde istenen en çok satır (API sınırı 100). */
export const LEADERBOARD_LIMIT = 50;

/** İçerik dili: mobil arayüz Türkçe, API'ye her çağrıda açıkça verilir. */
export const GAME_LANG = "tr" as const;

export type GameKind = "choice" | "map";

export function isPlayableGameType(value: unknown): value is PlayableGameType {
  return typeof value === "string" && (PLAYABLE_GAME_TYPES as readonly string[]).includes(value);
}

export function isLeaderboardType(value: unknown): value is LeaderboardTypeKey {
  return typeof value === "string" && (LEADERBOARD_TYPES as readonly string[]).includes(value);
}

export function isLeaderboardPeriod(value: unknown): value is LeaderboardPeriodKey {
  return typeof value === "string" && (LEADERBOARD_PERIODS as readonly string[]).includes(value);
}

/** Çoktan seçmeli mi, harita mı: soru biçimini ve cevap yolunu belirler. */
export function gameKindOf(gameType: PlayableGameType): GameKind {
  return gameType === "map-guess" ? "map" : "choice";
}

export interface GameInfo {
  title: string;
  description: string;
  /** Kartta gösterilen tur sayısı (oturum başlayınca gerçek değer API'den `roundsTotal` olarak gelir). */
  rounds: number;
}

export const GAME_INFO: Record<PlayableGameType, GameInfo> = {
  "flag-quiz": {
    title: "Bayrak Oyunu",
    description: "Gösterilen bayrağın hangi ülkeye ait olduğunu dört seçenek arasından bul.",
    rounds: 10,
  },
  "capital-quiz": {
    title: "Başkent Oyunu",
    description: "Adı verilen ülkenin başkentini dört seçenek arasından seç.",
    rounds: 10,
  },
  "map-guess": {
    title: "Haritada Bul",
    description: "Adı verilen ülkeyi dünya haritasında işaretle; hedefe yaklaştıkça puanın artar.",
    rounds: 5,
  },
};

export const LEADERBOARD_TYPE_LABELS: Record<LeaderboardTypeKey, string> = {
  overall: "Genel",
  "flag-quiz": "Bayrak",
  "capital-quiz": "Başkent",
  "map-guess": "Harita",
};

export const LEADERBOARD_TYPE_TITLES: Record<LeaderboardTypeKey, string> = {
  overall: "Genel liderlik",
  "flag-quiz": "Bayrak liderliği",
  "capital-quiz": "Başkent liderliği",
  "map-guess": "Harita liderliği",
};

export const LEADERBOARD_PERIOD_LABELS: Record<LeaderboardPeriodKey, string> = {
  all: "Tümü",
  week: "Bu hafta",
  day: "Bugün",
};

/** Ekran okuyucu ve boş durum metinleri için dönemin açık anlatımı. */
export const LEADERBOARD_PERIOD_DESCRIPTIONS: Record<LeaderboardPeriodKey, string> = {
  all: "tüm zamanlar",
  week: "son 7 gün",
  day: "son 24 saat",
};

/** Rota parametresi dizi gelebilir (expo-router); ilk değeri al. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Binlik ayracı nokta (Türkçe): 1850 -> "1.850". Hermes'in Intl desteğine bağlı kalmamak için elle. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return sign + String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Sunucunun ölçtüğü süre (ms) gösterim için: 83 400 -> "1 dk 23 sn"; 42 300 -> "42,3 sn". */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const totalSeconds = ms / 1000;
  if (totalSeconds < 60) return `${totalSeconds.toFixed(1).replace(".", ",")} sn`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds - minutes * 60);
  return seconds === 60 ? `${minutes + 1} dk` : `${minutes} dk ${seconds} sn`;
}
