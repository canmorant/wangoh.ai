/* ------------------------------------------------------------------ *
 *  Günün Turu, seri ve istatistikler — saf mantık (tarayıcıya dokunmaz)
 *
 *  Günün Turu: aynı yerel tarih için herkese aynı 10 tur. Tarih "YYYY-MM-DD"
 *  anahtarıdır; tur tohumu bu anahtardan türer (pickRounds seed'i). Tarih ve
 *  seri aritmetiği hep anahtar üzerinden, UTC gün sayısıyla yapılır: yaz saati
 *  geçişleri ve saat dilimi değişimi "24 saat = 1 gün" varsayımını bozmasın.
 *
 *  Kayıt kuralları (recordGame):
 *    - Serbest oyun: istatistiğe işler (oynanan, ortalama, en iyi).
 *    - Günün Turu, o günün İLK bitirilişi: RESMÎ puan; istatistiğe ve seriye
 *      işler. Aynı gün tekrar oynanabilir ama resmî puan, istatistik ve seri
 *      değişmez (aynı 10 turu bilerek oynamak rekoru şişirmesin).
 * ------------------------------------------------------------------ */

import { MAX_GAME_SCORE, ROUNDS_PER_GAME } from "./scoring";

export type GameMode = "free" | "daily";

/** "YYYY-MM-DD" */
export type DateKey = string;

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(value: unknown): value is DateKey {
  if (typeof value !== "string") return false;
  const m = DATE_KEY.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

/**
 * Bir anın "YYYY-MM-DD" anahtarı. `timeZone` verilmezse CİHAZIN yerel saat
 * dilimi (oyun budur); yalnız testler ve açık saat dilimi gereken yerler için
 * IANA adı verilir ("Europe/Istanbul").
 */
export function dateKeyOf(date: Date = new Date(), timeZone?: string): DateKey {
  if (timeZone) {
    // en-CA biçimi zaten YYYY-MM-DD.
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
      date,
    );
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const dayNumber = (key: DateKey): number => {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
};

/** `to` − `from`, gün olarak (to daha sonraysa pozitif). */
export const daysBetween = (from: DateKey, to: DateKey): number => dayNumber(to) - dayNumber(from);

/** Anahtara n gün ekler (negatif de olur). */
export function addDays(key: DateKey, n: number): DateKey {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + n));
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/**
 * Tarihten 32 bit tohum (FNV-1a). Tuz, tohum evrenini bu oyuna özgü kılar;
 * ayrı bir oyun aynı tarihte aynı diziye düşmesin. Aynı anahtar → aynı tohum.
 */
export function dailySeed(key: DateKey): number {
  const text = `wangoh.mesafe:${key}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/* ----------------------------- istatistikler ----------------------------- */

export interface DailyEntry {
  /** Resmî toplam puan. */
  total: number;
  /** Tur puanları (emoji şeridi için). */
  scores: number[];
}

export interface Stats {
  /** Sayılan oyun sayısı (serbest + günün turu resmî). */
  played: number;
  /** En iyi toplam puan. */
  best: number;
  /** Ortalama için: toplamı bilinen oyun sayısı ve puan toplamı (eski kayıttan göçte 0). */
  scored: number;
  points: number;
  /** Arka arkaya Günün Turu günü sayısı ve en uzun seri. */
  streak: number;
  bestStreak: number;
  /** Son resmî Günün Turu günü. */
  lastDaily: DateKey | null;
  /** Son günlerin resmî sonuçları. */
  daily: Record<DateKey, DailyEntry>;
  /** Ses efektleri açık mı (varsayılan kapalı). */
  sound: boolean;
}

export const EMPTY_STATS: Stats = {
  played: 0,
  best: 0,
  scored: 0,
  points: 0,
  streak: 0,
  bestStreak: 0,
  lastDaily: null,
  daily: {},
  sound: false,
};

/** Günlük sonuçlardan bu kadar günlüğü saklanır. */
export const DAILY_KEEP_DAYS = 45;

const finite = (v: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : 0;

function parseDailyEntry(raw: unknown): DailyEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const { total, scores } = raw as { total?: unknown; scores?: unknown };
  if (!Array.isArray(scores) || scores.length !== ROUNDS_PER_GAME) return null;
  const clean = scores.map((s) => finite(s, 0, 1000));
  return { total: Math.min(MAX_GAME_SCORE, finite(total, 0, MAX_GAME_SCORE)), scores: clean };
}

/**
 * localStorage'dan okunan (bozuk olabilir) değeri güvenli bir Stats'a çevirir.
 * Sürüm 1 kaydı ({ best, played }) da kabul edilir. Hiçbir durumda fırlatmaz.
 */
export function parseStats(raw: unknown): Stats {
  if (!raw || typeof raw !== "object") return EMPTY_STATS;
  const r = raw as Record<string, unknown>;
  const daily: Record<DateKey, DailyEntry> = {};
  if (r.daily && typeof r.daily === "object") {
    for (const [key, value] of Object.entries(r.daily as Record<string, unknown>)) {
      const entry = isDateKey(key) ? parseDailyEntry(value) : null;
      if (entry) daily[key] = entry;
    }
  }
  const lastDaily = isDateKey(r.lastDaily) ? r.lastDaily : null;
  const streak = lastDaily ? finite(r.streak, 0, 100_000) : 0;
  return {
    played: finite(r.played),
    best: finite(r.best, 0, MAX_GAME_SCORE),
    scored: finite(r.scored),
    points: finite(r.points),
    streak,
    bestStreak: Math.max(streak, finite(r.bestStreak, 0, 100_000)),
    lastDaily,
    daily,
    sound: r.sound === true,
  };
}

/** Güncel seri: bugün ya da dün oynanmışsa süregelir, daha eskiyse kopmuştur (0). */
export function currentStreak(stats: Stats, today: DateKey): number {
  if (!stats.lastDaily || stats.streak <= 0) return 0;
  const gap = daysBetween(stats.lastDaily, today);
  // gap < 0: cihaz saati / saat dilimi geriye gitti; seriyi cezalandırma.
  return gap <= 1 ? stats.streak : 0;
}

export const averageScore = (stats: Stats): number | null =>
  stats.scored > 0 ? Math.round(stats.points / stats.scored) : null;

export interface FinishedGame {
  mode: GameMode;
  /** Günün Turu için oyunun BAŞLADIĞI gün (gece yarısını aşan oyun başladığı güne yazılır). */
  dateKey: DateKey;
  total: number;
  scores: number[];
}

export interface RecordOutcome {
  stats: Stats;
  /** Bu oyun istatistiğe/resmî sonuca işlendi mi (günün turu tekrarı değil). */
  counted: boolean;
  /** Günün Turu'nun resmî ilk oyunu mu. */
  official: boolean;
  newBest: boolean;
  /** Oyun sonundaki güncel seri (günün turu dışında bile bugünkü durum). */
  streak: number;
}

function prune(daily: Record<DateKey, DailyEntry>, anchor: DateKey): Record<DateKey, DailyEntry> {
  const kept: Record<DateKey, DailyEntry> = {};
  for (const [key, entry] of Object.entries(daily)) {
    if (daysBetween(key, anchor) <= DAILY_KEEP_DAYS) kept[key] = entry;
  }
  return kept;
}

export function recordGame(stats: Stats, game: FinishedGame): RecordOutcome {
  const { mode, dateKey, total, scores } = game;
  if (mode === "daily" && stats.daily[dateKey]) {
    // Tekrar: hiçbir şey değişmez.
    return { stats, counted: false, official: false, newBest: false, streak: currentStreak(stats, dateKey) };
  }
  const newBest = stats.played > 0 && total > stats.best;
  const next: Stats = {
    ...stats,
    played: stats.played + 1,
    best: Math.max(stats.best, total),
    scored: stats.scored + 1,
    points: stats.points + total,
  };
  if (mode === "daily") {
    let streak: number;
    let lastDaily = stats.lastDaily;
    if (!lastDaily) {
      streak = 1;
      lastDaily = dateKey;
    } else {
      const gap = daysBetween(lastDaily, dateKey);
      if (gap === 1) {
        streak = stats.streak + 1;
        lastDaily = dateKey;
      } else if (gap <= 0) {
        // Saat dilimi / cihaz saati geriye gitti: seri ve son gün ilerlemez.
        streak = Math.max(1, stats.streak);
      } else {
        streak = 1;
        lastDaily = dateKey;
      }
    }
    next.streak = streak;
    next.bestStreak = Math.max(stats.bestStreak, streak);
    next.lastDaily = lastDaily;
    next.daily = prune({ ...stats.daily, [dateKey]: { total, scores: [...scores] } }, dateKey);
  }
  return {
    stats: next,
    counted: true,
    official: mode === "daily",
    newBest,
    streak: currentStreak(next, dateKey),
  };
}

/** "YYYY-MM-DD" → o günün YEREL öğlen saati (biçimlemede gün kaymasın diye 12:00). */
export function localDateFromKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}
