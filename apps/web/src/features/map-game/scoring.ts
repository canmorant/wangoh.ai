import { verdictFor, type Verdict } from "../distance-game/scoring";

/* ------------------------------------------------------------------ *
 *  Puanlama — "Haritada Bul"
 *
 *  Puanın tek tanımı burası (scoreFromKm); arayüz, kanca ve testler bunu kullanır.
 *
 *    d      = tahminin gerçek yere kuş uçuşu uzaklığı (km)
 *    puan   = 1000                        d ≤ 50 km
 *             round(1000 · e^(-(d-50)/1200))   d > 50 km
 *
 *  Örnekler: 300 km → 812, 600 km → 631, 1.000 km → 453, 2.000 km → 197, 5.000 km → 16.
 *  İpucu kullanılan turun puanı yarıya iner (en çok 500).
 * ------------------------------------------------------------------ */

export const MAP_ROUNDS = 8;
export const MAX_ROUND_SCORE = 1000;
export const MAX_GAME_SCORE = MAP_ROUNDS * MAX_ROUND_SCORE;

/** Bu uzaklığa (dahil) kadar tam puan: 110 m harita verisinin kaba kıyısı bu kadar yanılgı payı doğurur. */
export const FULL_SCORE_KM = 50;
/** Puanın e kat azaldığı ek uzaklık (km). */
export const SCORE_SCALE_KM = 1200;
/** İpucu kullanılan turun puan çarpanı. */
export const HINT_FACTOR = 0.5;
export const MAX_HINT_ROUND_SCORE = MAX_ROUND_SCORE * HINT_FACTOR;

/** Uzaklıktan 0–1000 arası tam sayı puan (ipucu hesaba katılmaz). */
export function scoreFromKm(km: number): number {
  if (!Number.isFinite(km) || km < 0) return 0;
  if (km <= FULL_SCORE_KM) return MAX_ROUND_SCORE;
  return Math.round(MAX_ROUND_SCORE * Math.exp(-(km - FULL_SCORE_KM) / SCORE_SCALE_KM));
}

export interface RoundScore {
  /** Tahminin gerçek yere uzaklığı, km (tam sayıya yuvarlanmış; ekran ve puan bunu kullanır). */
  km: number;
  /** İpucu hesaba katılmadan puan. */
  base: number;
  /** Turun puanı (ipucu varsa yarısı). */
  score: number;
  verdict: Verdict;
}

export function scoreRound(distanceKm: number, hinted: boolean): RoundScore {
  const km = Math.max(0, Math.round(distanceKm));
  const base = scoreFromKm(km);
  return {
    km,
    base,
    score: hinted ? Math.round(base * HINT_FACTOR) : base,
    // Yorum, ipucundan bağımsız, tahminin kendisine göre.
    verdict: verdictFor(base),
  };
}
