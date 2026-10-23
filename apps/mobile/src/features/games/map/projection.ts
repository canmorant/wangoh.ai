/**
 * Eşdikdörtgen (equirectangular) izdüşüm: saf matematik, React'e bağlı değil.
 *
 * Normalleştirilmiş harita koordinatı: x = (boylam + 180) / 360, y = (90 - enlem) / 180; ikisi de [0, 1].
 * Sol üst köşe (-180, 90), sağ alt köşe (180, -90). Dünya haritasının tamamı bu birim karedir;
 * piksele çevirmek viewport.ts'in işidir.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

/** Normalleştirilmiş harita koordinatı ([0, 1] aralığı). */
export interface UnitPoint {
  x: number;
  y: number;
}

export const MAX_LAT = 90;
export const MAX_LNG = 180;

/** NaN ve ±Infinity için `fallback`, aksi halde [min, max] aralığına kıskaç. */
export function clamp(value: number, min: number, max: number, fallback = min): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

/** Boylamı [-180, 180] aralığına sarar: 190 → -170, -190 → 170. ±180'in kendisi korunur. */
export function wrapLng(lng: number): number {
  if (!Number.isFinite(lng)) return 0;
  if (lng >= -MAX_LNG && lng <= MAX_LNG) return lng;
  const wrapped = ((((lng + MAX_LNG) % 360) + 360) % 360) - MAX_LNG;
  return wrapped;
}

/** Geçerli aralığa kıskaç: enlem [-90, 90], boylam [-180, 180] (sarmadan). Geçersiz sayı 0 olur. */
export function clampLatLng(p: LatLng): LatLng {
  return { lat: clamp(p.lat, -MAX_LAT, MAX_LAT, 0), lng: clamp(p.lng, -MAX_LNG, MAX_LNG, 0) };
}

/** Enlem-boylam → normalleştirilmiş koordinat. Boylam sarılır, enlem kıskaçlanır. */
export function project(p: LatLng): UnitPoint {
  const lat = clamp(p.lat, -MAX_LAT, MAX_LAT, 0);
  const lng = wrapLng(p.lng);
  return { x: (lng + MAX_LNG) / 360, y: (MAX_LAT - lat) / 180 };
}

/**
 * Normalleştirilmiş koordinat → enlem-boylam (ters izdüşüm). Haritanın dışına (kutup ötesi, ±180 ötesi)
 * taşan değerler kenara kıskaçlanır; sonuç her zaman geçerli aralıktadır.
 */
export function unproject(p: UnitPoint): LatLng {
  const x = clamp(p.x, 0, 1, 0.5);
  const y = clamp(p.y, 0, 1, 0.5);
  return normalizeZero({ lat: MAX_LAT - y * 180, lng: x * 360 - MAX_LNG });
}

/** -0 değerini 0 yapar (görüntüde ve karşılaştırmada "-0" çıkmasın). */
function normalizeZero(p: LatLng): LatLng {
  return { lat: p.lat + 0 === 0 ? 0 : p.lat, lng: p.lng + 0 === 0 ? 0 : p.lng };
}

/** Sayıyı `decimals` basamağa yuvarlar (varsayılan 4 ≈ 11 m); -0 çıkmaz. */
export function roundCoord(value: number, decimals = 4): number {
  if (!Number.isFinite(value)) return 0;
  const f = 10 ** decimals;
  const r = Math.round(value * f) / f;
  return r === 0 ? 0 : r;
}

/** İki konum epsilon (derece) içinde aynı mı? İkisi de boşsa (null/undefined) aynıdır. */
export function sameLatLng(a: LatLng | null | undefined, b: LatLng | null | undefined, epsilon = 1e-6): boolean {
  if (!a || !b) return !a && !b;
  return Math.abs(a.lat - b.lat) <= epsilon && Math.abs(a.lng - b.lng) <= epsilon;
}
