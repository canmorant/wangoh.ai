/**
 * Yakınlaştırma/kaydırma görünümü: saf mantık. Piksel dönüşümü, kenar sınırları, kıstırma ve dokunma → konum.
 *
 * Dünya, kapsayıcıya sığacak en büyük 2:1 dikdörtgen olarak (1x'te) kapsayıcıda ortalanır. Görünüm
 * `{ scale, tx, ty }`: ekran = (tx, ty) + scale * dünyaPikseli. Dünya pikseli, 1x'te dünyanın sol üst
 * köşesinden ölçülen pikseldir (x ∈ [0, worldWidth], y ∈ [0, worldWidth / 2]).
 */
import { clamp, project, unproject, type LatLng } from "./projection";

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point, Size {}

export interface View {
  /** Yakınlaştırma çarpanı: MIN_SCALE..MAX_SCALE. */
  scale: number;
  /** Dünyanın sol üst köşesinin ekrandaki konumu (piksel). */
  tx: number;
  ty: number;
}

export const MIN_SCALE = 1;
export const MAX_SCALE = 8;
/** Düğmelerin ve çift dokunmanın yakınlaştırma çarpanı. */
export const ZOOM_STEP = 2;

const EPSILON = 1e-6;

/** Boyut kullanılabilir mi (iki kenar da sonlu ve > 0)? Yerleşim ölçülmeden önce false. */
export function hasArea(size: Size): boolean {
  return Number.isFinite(size.width) && Number.isFinite(size.height) && size.width > 0 && size.height > 0;
}

/** 1x'te dünyanın piksel boyutu: kapsayıcıya sığan en büyük 2:1 dikdörtgen. Boyut geçersizse 0x0. */
export function worldSize(size: Size): Size {
  if (!hasArea(size)) return { width: 0, height: 0 };
  const width = Math.min(size.width, size.height * 2);
  return { width, height: width / 2 };
}

export function clampScale(scale: number): number {
  return clamp(scale, MIN_SCALE, MAX_SCALE, MIN_SCALE);
}

/** Bir eksende ötelemeyi sınırlar: içerik görünümden küçükse ortalar, değilse kenarlardan dışarı kaymaz. */
function clampAxis(t: number, content: number, viewport: number): number {
  if (!Number.isFinite(t)) return (viewport - content) / 2;
  if (content <= viewport + EPSILON) return (viewport - content) / 2;
  return clamp(t, viewport - content, 0);
}

/** Ölçeği ve ötelemeyi geçerli aralığa getirir: 1x–8x, harita dışına kayma yok. */
export function clampView(view: View, size: Size): View {
  const scale = clampScale(view.scale);
  const world = worldSize(size);
  return {
    scale,
    tx: clampAxis(view.tx, world.width * scale, size.width),
    ty: clampAxis(view.ty, world.height * scale, size.height),
  };
}

/** Varsayılan görünüm: 1x, dünya ortalanmış. */
export function initialView(size: Size): View {
  return clampView({ scale: MIN_SCALE, tx: 0, ty: 0 }, size);
}

export function isInitialView(view: View, size: Size): boolean {
  const base = initialView(size);
  return (
    Math.abs(view.scale - base.scale) < EPSILON &&
    Math.abs(view.tx - base.tx) < EPSILON &&
    Math.abs(view.ty - base.ty) < EPSILON
  );
}

export function sameView(a: View, b: View): boolean {
  return Math.abs(a.scale - b.scale) < EPSILON && Math.abs(a.tx - b.tx) < EPSILON && Math.abs(a.ty - b.ty) < EPSILON;
}

/** Görünümü (dx, dy) piksel kaydırır (sınırlarla). */
export function panView(view: View, dx: number, dy: number, size: Size): View {
  return clampView({ ...view, tx: view.tx + dx, ty: view.ty + dy }, size);
}

/** `focal` ekran noktasının altındaki dünya noktasını yerinde tutarak ölçeği `newScale` yapar. */
export function zoomAbout(view: View, newScale: number, focal: Point, size: Size): View {
  const scale = clampScale(newScale);
  const current = clampScale(view.scale);
  // Odak noktasının altındaki dünya pikseli (1x birimi); ölçek her zaman >= 1 olduğundan sıfıra bölme olmaz.
  const wx = (focal.x - view.tx) / current;
  const wy = (focal.y - view.ty) / current;
  return clampView({ scale, tx: focal.x - wx * scale, ty: focal.y - wy * scale }, size);
}

/** Çarpanla yakınlaştır/uzaklaştır (düğmeler). */
export function zoomBy(view: View, factor: number, focal: Point, size: Size): View {
  const f = Number.isFinite(factor) && factor > 0 ? factor : 1;
  return zoomAbout(view, view.scale * f, focal, size);
}

/** Kapsayıcının ortası (düğmelerle yakınlaştırmanın odağı). */
export function centerOf(size: Size): Point {
  return { x: size.width / 2, y: size.height / 2 };
}

/** Çift dokunma: 2x yakınlaştır; zaten en yakındaysa başlangıç görünümüne dön. */
export function doubleTapView(view: View, focal: Point, size: Size): View {
  if (view.scale >= MAX_SCALE - EPSILON) return initialView(size);
  return zoomAbout(view, view.scale * ZOOM_STEP, focal, size);
}

/**
 * İki parmakla kıstırma. `anchor`, kıstırmanın başladığı andaki görünüm; `anchorMid`/`anchorDist` o andaki
 * iki parmağın orta noktası ve aralarındaki mesafe, `mid`/`dist` şimdiki değerler. Parmakların altındaki dünya
 * noktası orta noktayı izler (yakınlaştırırken aynı anda kayar). Başlangıç mesafesi ~0 ise (sıfıra bölme)
 * yalnız kaydırma uygulanır.
 */
export function pinchView(anchor: View, anchorMid: Point, anchorDist: number, mid: Point, dist: number, size: Size): View {
  const ratio = anchorDist > EPSILON && Number.isFinite(dist) && dist >= 0 ? dist / anchorDist : 1;
  const scale = clampScale(anchor.scale * ratio);
  const base = clampScale(anchor.scale);
  const wx = (anchorMid.x - anchor.tx) / base;
  const wy = (anchorMid.y - anchor.ty) / base;
  return clampView({ scale, tx: mid.x - wx * scale, ty: mid.y - wy * scale }, size);
}

/** Dünyanın ekrandaki dikdörtgeni (harita sınırı): dışı kutup ötesi/harita dışı. */
export function worldRect(view: View, size: Size): Rect {
  const world = worldSize(size);
  return { x: view.tx, y: view.ty, width: world.width * view.scale, height: world.height * view.scale };
}

/** Enlem-boylam → ekran pikseli (görünüm dahil). */
export function toScreen(p: LatLng, view: View, size: Size): Point {
  const world = worldSize(size);
  const u = project(p);
  return { x: view.tx + u.x * world.width * view.scale, y: view.ty + u.y * world.height * view.scale };
}

/**
 * Ekran pikseli → enlem-boylam (görünüm dahil). Harita dışındaki dokunuş (kutup ötesi ya da kenar boşluğu)
 * en yakın kenara kıskaçlanır. Boyut henüz ölçülmediyse null.
 */
export function fromScreen(p: Point, view: View, size: Size): LatLng | null {
  const world = worldSize(size);
  if (world.width <= 0 || world.height <= 0) return null;
  const scale = clampScale(view.scale);
  return unproject({
    x: (p.x - view.tx) / (world.width * scale),
    y: (p.y - view.ty) / (world.height * scale),
  });
}

/**
 * Verilen konumların hepsini (kenarlıkla) görünür kılan görünüm: gerekli en küçük ölçek (1x–`maxScale`) ve
 * sınır kutusunun merkezine ortalanmış. Tek nokta ya da çok yakın noktalarda ölçek `maxScale`'e kıskaçlanır.
 * Konum yoksa başlangıç görünümü.
 */
export function fitView(points: readonly LatLng[], size: Size, padding = 40, maxScale = 4): View {
  if (points.length === 0 || !hasArea(size)) return initialView(size);
  const world = worldSize(size);
  const units = points.map(project);
  const minX = Math.min(...units.map((u) => u.x));
  const maxX = Math.max(...units.map((u) => u.x));
  const minY = Math.min(...units.map((u) => u.y));
  const maxY = Math.max(...units.map((u) => u.y));
  const boxW = (maxX - minX) * world.width;
  const boxH = (maxY - minY) * world.height;
  const availW = Math.max(1, size.width - padding * 2);
  const availH = Math.max(1, size.height - padding * 2);
  const fitScale = Math.min(boxW > EPSILON ? availW / boxW : Infinity, boxH > EPSILON ? availH / boxH : Infinity);
  const scale = clamp(Number.isFinite(fitScale) ? fitScale : maxScale, MIN_SCALE, Math.min(maxScale, MAX_SCALE), MIN_SCALE);
  const cx = ((minX + maxX) / 2) * world.width;
  const cy = ((minY + maxY) / 2) * world.height;
  return clampView({ scale, tx: size.width / 2 - cx * scale, ty: size.height / 2 - cy * scale }, size);
}

/**
 * SVG içeriği (LAND_PATH, birim = 1/unitsPerDegree derece, genişlik `pathWidth` birim) için `G` dönüşüm matrisi
 * `[a, b, c, d, e, f]`: yol birimlerini ekran pikseline çevirir.
 */
export function pathMatrix(view: View, size: Size, pathWidth: number): [number, number, number, number, number, number] {
  const world = worldSize(size);
  const k = pathWidth > 0 ? (world.width * view.scale) / pathWidth : 0;
  return [k, 0, 0, k, view.tx, view.ty];
}
