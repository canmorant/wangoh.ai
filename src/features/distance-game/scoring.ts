/* ------------------------------------------------------------------ *
 *  Puanlama ve kaydırıcı sınırları — "Kaç kilometre?"
 *
 *  Puan formülü yalnızca burada tanımlı (scoreFromError); kullanıcı arayüzü,
 *  kanca ve testler hep bu fonksiyonu kullanır.
 *
 *    e     = |tahmin − gerçek| / gerçek
 *    puan  = round(1000 · max(0, 1 − e)²),  e ≤ %2 ise 1000
 * ------------------------------------------------------------------ */

export const ROUNDS_PER_GAME = 10;
export const MAX_ROUND_SCORE = 1000;
export const MAX_GAME_SCORE = ROUNDS_PER_GAME * MAX_ROUND_SCORE;

/** Bu orana kadar (dahil) hata tam puan getirir. */
export const FULL_SCORE_ERROR = 0.02;

/** Kaydırıcı aralığı (km). Soru mesafeleri de bu aralığa sığar. */
export const MIN_GUESS_KM = 10;
export const MAX_GUESS_KM = 20000;

/** Bağıl hata: |tahmin − gerçek| / gerçek. Gerçek mesafe 0 ise tanımsız, 0 ya da sonsuz döner. */
export function errorRatio(guessKm: number, actualKm: number): number {
  if (actualKm <= 0) return guessKm === actualKm ? 0 : Infinity;
  return Math.abs(guessKm - actualKm) / actualKm;
}

/** Puanın tek tanımı: bağıl hatadan 0–1000 arası tam sayı puan. */
export function scoreFromError(error: number): number {
  if (Number.isNaN(error)) return 0;
  if (error <= FULL_SCORE_ERROR) return MAX_ROUND_SCORE;
  return Math.round(MAX_ROUND_SCORE * Math.max(0, 1 - error) ** 2);
}

export interface GuessScore {
  /** Bağıl hata (0,12 = %12). */
  error: number;
  score: number;
}

export function scoreGuess(guessKm: number, actualKm: number): GuessScore {
  const error = errorRatio(guessKm, actualKm);
  return { error, score: scoreFromError(error) };
}

/** Tur sonu yorumunun anahtarı (DistanceGame.verdict.<key>). */
export type Verdict = "perfect" | "great" | "good" | "fair" | "far";

export function verdictFor(score: number): Verdict {
  // Eşikler hata oranına karşılık gelir: 810 ≈ %10, 560 ≈ %25, 250 ≈ %50.
  if (score >= 1000) return "perfect";
  if (score >= 810) return "great";
  if (score >= 560) return "good";
  if (score >= 250) return "fair";
  return "far";
}
