import { geoCircle, geoInterpolate } from "d3-geo";
import { EARTH_RADIUS_KM } from "./haversine";

/**
 * Cevap haritasının saf geometri yardımcıları (DOM ve harita verisi yok; testler
 * doğrudan çağırır). RevealMap.tsx bunları orthographic bir projeksiyonla birleştirir.
 */

/** [boylam, enlem], derece (GeoJSON sırası). */
export type LngLat = [number, number];
export type Point = [number, number];

const DEG = 180 / Math.PI;

export const kmToDegrees = (km: number): number => (km / EARTH_RADIUS_KM) * DEG;

/** Haritada kameranın hiçbir zaman göstermeyeceği kadar yakın bir görünüm: iki ucu kapsayan en az bu kadar km. */
export const MIN_VIEW_KM = 520;
/** İki uç arasındaki mesafeye göre kenar boşluğu (her iki yana, mesafenin oranı). */
export const VIEW_PAD = 0.3;
/**
 * Kamera merkezinden bu açıdan (derece) uzaktaki noktalar hâlâ güvenle görünür sayılır;
 * ufuk 90°. Boşluk, ufka yakın kıyıların aşırı kısalmasını ve sınırda kırpılmayı önler.
 */
export const MAX_VISIBLE_DEG = 84;

/**
 * Kameranın kadraja alacağı iki nokta: A ve B, aralarındaki büyük daire boyunca
 * dışa doğru itilmiş. Böylece (1) uçlara etiket ve nefes payı kalır, (2) çok
 * yakın şehirlerde de harita en az MIN_VIEW_KM genişliğinde bir bölgeyi gösterir
 * (110 m verinin kıyıları o yakınlıkta kaba görünmesin diye).
 */
export function cameraEnds(a: LngLat, b: LngLat, distanceKm: number, tiltDeg = 0): [LngLat, LngLat] {
  const d = distanceKm / EARTH_RADIUS_KM;
  if (!(d > 1e-6)) return [a, b];
  const wanted = Math.max(d * (1 + 2 * VIEW_PAD), MIN_VIEW_KM / EARTH_RADIUS_KM);
  // Uçlar, kamera merkezinden (orta nokta + kayma) en çok MAX_VISIBLE_DEG uzakta kalsın; bundan
  // uzak çiftlerde uçlar şehirlerin kendisi olur (pay yok).
  const halfCap = Math.max(d / 2, ((MAX_VISIBLE_DEG - tiltDeg) * Math.PI) / 180);
  const span = Math.min(wanted, 2 * halfCap);
  const t = Math.max(0, (span - d) / 2 / d);
  const lerp = geoInterpolate(a, b);
  return [lerp(-t), lerp(1 + t)];
}

/** A'dan B'ye giden büyük daire üzerinde, A'dan `km` uzaktaki nokta (B'nin ötesine de uzanır). */
export function pointAlong(a: LngLat, b: LngLat, distanceKm: number, km: number): LngLat {
  if (!(distanceKm > 0)) return a;
  return geoInterpolate(a, b)(km / distanceKm);
}

/** A merkezli, yarıçapı `km` olan coğrafi daire (GeoJSON Polygon). */
export function guessCircle(center: LngLat, km: number) {
  const radius = Math.min(179.5, Math.max(0.05, kmToDegrees(km)));
  return geoCircle().center(center).radius(radius).precision(2)();
}

/** İki noktanın büyük daire orta noktası. */
export const midpoint = (a: LngLat, b: LngLat): LngLat => geoInterpolate(a, b)(0.5);

export interface LabelSpot {
  x: number;
  y: number;
  anchor: "middle";
}

type Side = "up" | "down" | "right" | "left";

/**
 * İki şehir etiketinin yeri. Her etiket kendi noktasının üstüne, altına, sağına ya da soluna
 * konabilir; 16 birleşimin hepsi puanlanır, en az cezalısı seçilir:
 *   - iki etiket birbirinin üstüne binerse çok ağır ceza,
 *   - bir etiket başka bir noktayı (öteki şehir, tahmin işareti: `avoid`) örterse ceza,
 *   - eşitlikte sezgi: ekranda üstte kalan noktanın etiketi üstte, alttakinin altta (aynı
 *     yükseklikte A üstte); yan yerleşimler son çare (iki nokta üst üste yakınken işe yarar).
 * x, metnin genişliği kadar kenardan içeride tutulur.
 */
export function placeLabels(
  pa: Point,
  pb: Point,
  widthA: number,
  widthB: number,
  box: { width: number; height: number },
  avoid: Point[] = [],
  edge = 8,
  above = 13,
  below = 21,
  gap = 12,
): { a: LabelSpot; b: LabelSpot } {
  const spot = (p: Point, width: number, side: Side): LabelSpot => {
    const half = Math.min(width, box.width - 2 * edge) / 2;
    const cx = side === "right" ? p[0] + gap + half : side === "left" ? p[0] - gap - half : p[0];
    const cy = side === "up" ? p[1] - above : side === "down" ? p[1] + below : p[1] + 4;
    return {
      x: Math.min(box.width - edge - half, Math.max(edge + half, cx)),
      y: Math.min(box.height - 6, Math.max(14, cy)),
      anchor: "middle",
    };
  };
  const rect = (s: LabelSpot, width: number) => ({ l: s.x - width / 2, r: s.x + width / 2, t: s.y - 11, b: s.y + 4 });
  const hitsPoint = (r: ReturnType<typeof rect>, p: Point, radius: number) => {
    const dx = Math.max(r.l - p[0], 0, p[0] - r.r);
    const dy = Math.max(r.t - p[1], 0, p[1] - r.b);
    return dx * dx + dy * dy < radius * radius;
  };
  const aFirst: Side = pa[1] <= pb[1] ? "up" : "down";
  const bFirst: Side = aFirst === "up" ? "down" : "up";
  const order = (first: Side): Side[] => [first, first === "up" ? "down" : "up", "right", "left"];
  let best: { a: LabelSpot; b: LabelSpot } | null = null;
  let bestCost = Infinity;
  order(aFirst).forEach((sideA, ia) => {
    order(bFirst).forEach((sideB, ib) => {
      const a = spot(pa, widthA, sideA);
      const b = spot(pb, widthB, sideB);
      const ra = rect(a, widthA);
      const rb = rect(b, widthB);
      // Tercih sırası: ilk seçenek 0, ters dikey 1, yanlar 2 ve 3.
      let cost = ia + ib;
      if (ra.l < rb.r && rb.l < ra.r && ra.t < rb.b && rb.t < ra.b) cost += 100;
      if (hitsPoint(ra, pb, 9)) cost += 30;
      if (hitsPoint(rb, pa, 9)) cost += 30;
      for (const p of avoid) {
        if (hitsPoint(ra, p, 9)) cost += 30;
        if (hitsPoint(rb, p, 9)) cost += 30;
      }
      if (cost < bestCost) {
        bestCost = cost;
        best = { a, b };
      }
    });
  });
  return best!;
}

/** Etiket genişliği için kaba tahmin (px): 12,5 px yarı kalın yazı. */
export const estimateLabelWidth = (text: string, fontPx = 12.5): number => Math.ceil(text.length * fontPx * 0.58) + 6;

/**
 * Yayın eğriliği: büyük daire, orthographic görünümün merkezi yayın tam üstündeyse
 * düz bir çizgi görünür. Merkezi yayın orta noktasından kuzey/güneye kaydırmak
 * yayı kavisli gösterir. Kayma, mesafeyle orantılı ve sınırlı (derece).
 */
export const tiltDegrees = (distanceKm: number): number => {
  const d = kmToDegrees(distanceKm);
  // Uzak çiftte iki şehir ufka yakın: kayma, onları ufkun ardına itmeyecek kadar küçük.
  return Math.max(0, Math.min(12, d * 0.12, MAX_VISIBLE_DEG - d / 2));
};
