import { geoDistance, geoInterpolate, geoOrthographic, type GeoProjection } from "d3-geo";
import { EARTH_RADIUS_KM } from "../distance-game/haversine";
import type { LngLat } from "../distance-game/mapGeometry";

/**
 * Küre görünümünün saf matematiği (DOM yok; testler doğrudan çağırır). Görünüm üç sayıdır:
 * ekranın ortasındaki nokta (boylam, enlem) ve yakınlık. Küre orthographic izdüşümle çizilir.
 */

export interface View {
  lng: number;
  lat: number;
  /** 1 = tüm küre kadrajda; büyüdükçe yakınlaşır. */
  zoom: number;
}

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 24;
export const MAX_LAT = 88;
/** Kürenin kenarından bırakılan boşluk (px): atmosfer ışıması ve kenar çizgisi için. */
export const GLOBE_MARGIN = 10;

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Boylamı [-180, 180) aralığına sarar. */
export const wrapLng = (lng: number) => ((((lng + 180) % 360) + 360) % 360) - 180;

export const clampView = (v: View): View => ({
  lng: wrapLng(v.lng),
  lat: clamp(v.lat, -MAX_LAT, MAX_LAT),
  zoom: clamp(v.zoom, MIN_ZOOM, MAX_ZOOM),
});

/** İlk görünüm: Avrupa–Afrika üstü; her turda başka bir yer göstermeyi oyun belirler. */
export const INITIAL_VIEW: View = { lng: 18, lat: 22, zoom: 1 };

/** Zoom 1'deki küre yarıçapı (px): kadrajın kısa kenarına sığar. */
export const baseRadius = (width: number, height: number): number =>
  Math.max(40, Math.min(width, height) / 2 - GLOBE_MARGIN);

export const radiusOf = (view: View, width: number, height: number): number =>
  baseRadius(width, height) * view.zoom;

export function makeProjection(view: View, width: number, height: number): GeoProjection {
  return geoOrthographic()
    .rotate([-view.lng, -view.lat, 0])
    .translate([width / 2, height / 2])
    .scale(radiusOf(view, width, height))
    .clipAngle(90)
    .precision(0.6);
}

/**
 * Parmak `dx`,`dy` piksel sürüklenince görünüm: küre parmakla birlikte döner. Piksel başına
 * derece yarıçapla ters orantılı (yakınlaştıkça ince); kutuplara yakın yatay sürükleme
 * paralelin kısalığı kadar daha çok boylam döndürür.
 */
export function dragView(view: View, dx: number, dy: number, radiusPx: number): View {
  const perPx = DEG / radiusPx;
  const cosLat = Math.max(0.2, Math.cos(view.lat * RAD));
  return clampView({ ...view, lng: view.lng - (dx * perPx) / cosLat, lat: view.lat + dy * perPx });
}

export const zoomView = (view: View, factor: number): View => clampView({ ...view, zoom: view.zoom * factor });

/**
 * Ekran noktası (x, y) → [boylam, enlem]; küre dışındaysa null. d3'nin orthographic `invert`'ü
 * kürenin dışındaki noktayı kenara (ufka) sıkıştırıp sahte bir konum döndürür; o yüzden
 * önce noktanın küre diskinin içinde olduğu açıkça denetlenir.
 */
export function lngLatAt(view: View, width: number, height: number, x: number, y: number): LngLat | null {
  if (Math.hypot(x - width / 2, y - height / 2) > radiusOf(view, width, height)) return null;
  const p = makeProjection(view, width, height).invert?.([x, y]);
  if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) return null;
  return [wrapLng(p[0]), clamp(p[1], -90, 90)];
}

/** Nokta kürenin bu görünümde bakılan yüzünde mi (merkezden en çok `maxDeg` uzakta)? */
export function isFacing(view: View, point: LngLat, maxDeg = 89): boolean {
  return geoDistance([view.lng, view.lat], point) * DEG < maxDeg;
}

/** İki nokta arasındaki açı (derece). */
export const angleDeg = (a: LngLat, b: LngLat): number => geoDistance(a, b) * DEG;

/**
 * İki noktayı kadraja alan görünüm: merkez büyük daire orta noktası, yakınlık iki ucun
 * etiket ve işaretlere pay bırakarak sığacağı kadar. Aynı yere çok yakınsa üst sınırda kalır.
 */
export function fitView(a: LngLat, b: LngLat, fill = 0.62): View {
  const half = (angleDeg(a, b) / 2) * RAD;
  const center = geoInterpolate(a, b)(0.5);
  // Uç, merkezden R·zoom·sin(half) uzakta; kadrajın `fill` oranına sığsın.
  const zoom = half < 1e-4 ? MAX_ZOOM : fill / Math.sin(Math.min(half, Math.PI / 2));
  return clampView({ lng: center[0], lat: center[1], zoom: Math.min(zoom, 14) });
}

/** Bir noktaya, istenen yakınlıkta bakan görünüm. */
export const viewAt = (point: LngLat, zoom: number): View => clampView({ lng: point[0], lat: point[1], zoom });

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Uçuş süresi (ms): yakın sıçrama kısa, dünyanın öbür ucu uzun. */
export function flyDuration(from: View, to: View): number {
  const deg = angleDeg([from.lng, from.lat], [to.lng, to.lat]);
  const zoomSteps = Math.abs(Math.log(to.zoom / from.zoom));
  return clamp(380 + deg * 5 + zoomSteps * 90, 420, 1300);
}

/**
 * Uçuşun `t` anındaki görünümü (0–1). Merkez büyük daire boyunca; yakınlık logaritmik, uzak
 * sıçramalarda yolun ortasında biraz uzaklaşır (yukarıdan bakış hissi).
 */
export function flyView(from: View, to: View, t: number): View {
  const e = easeInOutCubic(clamp(t, 0, 1));
  const here: LngLat = [from.lng, from.lat];
  const there: LngLat = [to.lng, to.lat];
  const deg = angleDeg(here, there);
  const center = deg < 1e-6 ? here : geoInterpolate(here, there)(e);
  const logZ = Math.log(from.zoom) + (Math.log(to.zoom) - Math.log(from.zoom)) * e;
  const lift = Math.sin(Math.PI * e) * Math.min(Math.log(Math.min(from.zoom, to.zoom)), 0.9 * Math.min(1, deg / 60));
  return clampView({ lng: center[0], lat: center[1], zoom: Math.exp(logZ - lift) });
}

/* ------------------------------ ipucu halkası ------------------------------ */

export const HINT_RADIUS_KM = 1500;

/** [0, 1) aralığında deterministik sayı (aynı kimlik → aynı sayı). */
function hash01(id: number, salt: number): number {
  let h = (id * 2654435761 + salt * 40503) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d) >>> 0;
  h ^= h >>> 12;
  return (h >>> 0) / 4294967296;
}

/** `from` noktasından `bearing` (radyan, kuzeyden saat yönü) yönünde `km` ilerideki nokta. */
export function destinationPoint(from: LngLat, bearing: number, km: number): LngLat {
  const d = km / EARTH_RADIUS_KM;
  const lat1 = from[1] * RAD;
  const lng1 = from[0] * RAD;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearing));
  const lng2 =
    lng1 + Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return [wrapLng(lng2 * DEG), lat2 * DEG];
}

/**
 * İpucu halkası: gerçek yer halkanın İÇİNDE ama tam ortasında değil (ortası kayık), yoksa
 * ipucu cevabı verirdi. Kayma şehre özgü ve sabit (aynı şehir her oyunda aynı halkayı verir).
 */
export function hintCircle(target: LngLat, id: number): { center: LngLat; radiusKm: number } {
  const bearing = hash01(id, 1) * 2 * Math.PI;
  const offsetKm = HINT_RADIUS_KM * (0.22 + 0.33 * hash01(id, 2));
  return { center: destinationPoint(target, bearing, offsetKm), radiusKm: HINT_RADIUS_KM };
}

/** Halkayı kadraja alan görünüm. */
export const hintView = (center: LngLat, radiusKm: number): View =>
  viewAt(center, clamp(0.45 / Math.sin((radiusKm / EARTH_RADIUS_KM) * 1.0), 1.5, 6));
