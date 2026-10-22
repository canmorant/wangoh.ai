import {
  CHOICE_BASE_POINTS,
  EARTH_RADIUS_KM,
  MAP_FULL_SCORE_KM,
  MAP_MAX_ROUND_POINTS,
  MAP_SCORE_SCALE_KM,
  SPEED_BONUS_MAX,
  SPEED_WINDOW_MS,
  STREAK_BONUS_MAX,
  STREAK_BONUS_STEP,
} from "./games.constants.js";

/*
 * Puanlama: yalnız saf fonksiyonlar (veritabanı, saat, rastgelelik yok). Sunucu süreyi kendisi ölçer ve
 * buraya geçirir; istemcinin bildirdiği süre hiçbir yerde kullanılmaz.
 */

/**
 * Hız bonusu: `round(50 * max(0, 1 - ms / 15000))`. Negatif süre (saat geri alınması) 0 ms sayılır;
 * sonlu olmayan süre (NaN, ±Infinity) bonus vermez.
 *
 * `50 * (15000 - ms) / 15000` biçiminde hesaplanır: `1 - ms / 15000` kayan noktada tam .5 sonuçları
 * aşağı düşürürdü (8250 ms: 22,5 yerine 22). Tam sayı ms için pay ve payda tam sayı olduğundan bölüm
 * doğru yuvarlanır ve .5 değerleri belgedeki gibi yukarı yuvarlanır.
 */
export function speedBonus(elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs)) return 0;
  const ms = Math.max(0, elapsedMs);
  if (ms >= SPEED_WINDOW_MS) return 0;
  return Math.round((SPEED_BONUS_MAX * (SPEED_WINDOW_MS - ms)) / SPEED_WINDOW_MS);
}

/**
 * Seri bonusu: `min(50, 10 * (seri - 1))`. `streak`, bu turu da sayan art arda doğru sayısıdır
 * (1 → 0, 2 → 10, ... 6 → 50, 7 → 50). Geçersiz/sıfır seri bonus vermez.
 */
export function streakBonus(streak: number): number {
  if (!Number.isFinite(streak) || streak < 1) return 0;
  return Math.min(STREAK_BONUS_MAX, STREAK_BONUS_STEP * (Math.floor(streak) - 1));
}

export interface ChoiceScoreInput {
  correct: boolean;
  /** Sunucunun ölçtüğü tur süresi (ms). */
  elapsedMs: number;
  /** Bu turdan ÖNCEKİ art arda doğru sayısı. */
  streakBefore: number;
}

export interface ChoiceScore {
  points: number;
  speedBonus: number;
  streakBonus: number;
  /** Bu turdan SONRAKİ art arda doğru sayısı (yanlışta 0). */
  streak: number;
}

/** Çoktan seçmeli tur puanı: doğruysa `100 + hız + seri`; yanlışta 0 ve seri sıfırlanır. */
export function scoreChoiceRound({ correct, elapsedMs, streakBefore }: ChoiceScoreInput): ChoiceScore {
  if (!correct) return { points: 0, speedBonus: 0, streakBonus: 0, streak: 0 };
  const before = Number.isFinite(streakBefore) && streakBefore > 0 ? Math.floor(streakBefore) : 0;
  const streak = before + 1;
  const speed = speedBonus(elapsedMs);
  const streakPoints = streakBonus(streak);
  return { points: CHOICE_BASE_POINTS + speed + streakPoints, speedBonus: speed, streakBonus: streakPoints, streak };
}

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * İki nokta arasındaki büyük daire uzaklığı (km). ±180 boylam sarması doğrudur: 179° ile -179° arası 2°,
 * 180° ile -180° aynı nokta (0 km). Sonlu olmayan girdi NaN döner.
 */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return Number.NaN;
  const dLat = toRad(lat2 - lat1);
  // Boylam farkı (-180, 180] aralığına sarılır: ±180 aynı meridyendir ve kayan nokta artığı (sin π ≠ 0) kalmaz.
  const dLng = toRad(((((lng2 - lng1 + 540) % 360) + 360) % 360) - 180);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  // min(1, ...): kayan nokta hatası antipodlarda asin'e 1'in hemen üstünü verebilir.
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Uzaklıktan 0-1000 arası tam sayı puan. Sonlu olmayan ya da negatif uzaklık 0 puan. */
export function mapPointsForKm(km: number): number {
  if (!Number.isFinite(km) || km < 0) return 0;
  if (km <= MAP_FULL_SCORE_KM) return MAP_MAX_ROUND_POINTS;
  return Math.round(MAP_MAX_ROUND_POINTS * Math.exp(-(km - MAP_FULL_SCORE_KM) / MAP_SCORE_SCALE_KM));
}

export interface MapScore {
  /** Tam sayıya yuvarlanmış uzaklık (ekranda gösterilen ve puanın hesaplandığı değer; web ile aynı). */
  distanceKm: number;
  points: number;
}

/** Tahmin ile hedef arasındaki uzaklığı ve puanı verir. Web gibi puan, tam sayıya yuvarlanmış km'den hesaplanır. */
export function scoreMapGuess(guess: { lat: number; lng: number }, target: { lat: number; lng: number }): MapScore {
  const km = haversineKm(guess.lat, guess.lng, target.lat, target.lng);
  if (!Number.isFinite(km)) return { distanceKm: 0, points: 0 };
  const distanceKm = Math.max(0, Math.round(km));
  return { distanceKm, points: mapPointsForKm(distanceKm) };
}

export interface LatLngIssue {
  field: "answer.lat" | "answer.lng";
  code: "isLatitude" | "isLongitude";
}

/**
 * `{ lat, lng }` girdisini doğrular: sonlu sayı, lat [-90, 90], lng [-180, 180]. Sorunları döner (boşsa geçerli).
 * JSON'da `1e999` gibi değerler `Infinity` olarak ayrışır; bu yüzden sonluluk açıkça denetlenir.
 */
export function validateLatLng(value: { lat?: unknown; lng?: unknown }): LatLngIssue[] {
  const issues: LatLngIssue[] = [];
  if (typeof value.lat !== "number" || !Number.isFinite(value.lat) || value.lat < -90 || value.lat > 90) {
    issues.push({ field: "answer.lat", code: "isLatitude" });
  }
  if (typeof value.lng !== "number" || !Number.isFinite(value.lng) || value.lng < -180 || value.lng > 180) {
    issues.push({ field: "answer.lng", code: "isLongitude" });
  }
  return issues;
}
