/**
 * Dokunma hareketi çözümleyici: saf mantık, React/PanResponder'a bağlı değil.
 *
 * Bir hareket (parmak/fare basıldığı andan kalkana dek) şunlardan biri olur:
 *  - dokunma (tap): hareket eşiğini aşmadı, iki parmak olmadı → işaretleme;
 *  - çift dokunma: kısa sürede, yakın noktada ikinci dokunma → yakınlaştırma (ikinci dokunma işaretlemez);
 *  - sürükleme/kıstırma: görünümü değiştirir, işaretlemez.
 *
 * Parmak sayısı değişince (1 → 2 ya da 2 → 1) başlangıç noktaları yeniden alınır, böylece görünüm sıçramaz.
 */
import { pinchView, panView, type Point, type Size, type View } from "./viewport";

/** Bu mesafeden (piksel) fazla oynayan hareket sürükleme sayılır, dokunma değil. */
export const TAP_SLOP = 10;
/** Çift dokunmada iki dokunmanın kalkışı arası en çok süre (ms). */
export const DOUBLE_TAP_MAX_INTERVAL_MS = 350;
/** Çift dokunmada iki dokunma arası en çok mesafe (piksel). */
export const DOUBLE_TAP_MAX_DISTANCE = 32;

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** İki nokta eşik mesafesinden (dahil değil) uzak mı? */
export function exceedsSlop(from: Point, to: Point, slop = TAP_SLOP): boolean {
  return distance(from, to) > slop;
}

export interface TapRecord {
  point: Point;
  time: number;
}

/** `next`, `prev` dokunmasının çift dokunma devamı mı? */
export function isDoubleTap(prev: TapRecord | null, next: TapRecord): boolean {
  if (!prev) return false;
  const dt = next.time - prev.time;
  return dt >= 0 && dt <= DOUBLE_TAP_MAX_INTERVAL_MS && distance(prev.point, next.point) <= DOUBLE_TAP_MAX_DISTANCE;
}

export type GestureResult =
  | { kind: "tap"; point: Point }
  | { kind: "doubleTap"; point: Point }
  /** Sürükleme, kıstırma ya da iptal: işaretleme yok. */
  | { kind: "none" };

/** Bir hareketin görünüm ve dokunma durumunu izler. Hareketler arası yalnız son dokunma hatırlanır. */
export class GestureTracker {
  private active = false;
  private view: View = { scale: 1, tx: 0, ty: 0 };
  private anchorView: View = this.view;
  private anchorPoints: Point[] = [];
  private startPoint: Point = { x: 0, y: 0 };
  private lastPoint: Point = { x: 0, y: 0 };
  private dragging = false;
  private lastTap: TapRecord | null = null;

  /** Hareket sürüyor mu? */
  get isActive(): boolean {
    return this.active;
  }

  /** Şu anki görünüm (hareket sırasında güncel). */
  get currentView(): View {
    return this.view;
  }

  /** Sürükleme ya da kıstırma başladı mı (dokunma artık işaretleme olmaz)? */
  get isDragging(): boolean {
    return this.dragging;
  }

  /** Parmak/fare basıldı. `points` boş olabilir (konum okunamadı); o zaman (0,0) varsayılır. */
  begin(points: readonly Point[], view: View): void {
    const pts = points.slice(0, 2);
    this.active = true;
    this.view = view;
    this.anchorView = view;
    this.anchorPoints = pts.slice();
    this.startPoint = pts[0] ?? { x: 0, y: 0 };
    this.lastPoint = this.startPoint;
    this.dragging = pts.length >= 2;
  }

  /** Parmaklar hareket etti: yeni görünümü döndürür (sınırlanmış). Hareket yoksa mevcut görünüm. */
  move(points: readonly Point[], size: Size): View {
    if (!this.active || points.length === 0) return this.view;
    const pts = points.slice(0, 2);
    this.lastPoint = pts[0];

    // Parmak sayısı değişti: sıçrama olmasın diye başlangıcı şimdiki durumdan al.
    if (pts.length !== this.anchorPoints.length) {
      // Başlangıç konumu okunamamışsa (boş begin) ilk bilinen konum başlangıç olur.
      if (this.anchorPoints.length === 0) this.startPoint = pts[0];
      this.anchorView = this.view;
      this.anchorPoints = pts.slice();
      if (pts.length >= 2) this.dragging = true;
      return this.view;
    }

    if (pts.length >= 2) {
      this.dragging = true;
      this.view = pinchView(
        this.anchorView,
        midpoint(this.anchorPoints[0], this.anchorPoints[1]),
        distance(this.anchorPoints[0], this.anchorPoints[1]),
        midpoint(pts[0], pts[1]),
        distance(pts[0], pts[1]),
        size,
      );
      return this.view;
    }

    // Tek parmak
    if (!this.dragging) {
      if (!exceedsSlop(this.startPoint, pts[0])) return this.view;
      // Eşik aşıldı: kaydırma buradan başlar (eşik kadar sıçrama olmaz).
      this.dragging = true;
      this.anchorView = this.view;
      this.anchorPoints = [pts[0]];
      return this.view;
    }
    this.view = panView(this.anchorView, pts[0].x - this.anchorPoints[0].x, pts[0].y - this.anchorPoints[0].y, size);
    return this.view;
  }

  /** Parmak/fare kalktı. `point`: kalkış konumu (bilinmiyorsa son bilinen). */
  end(point: Point | null, time: number): GestureResult {
    if (!this.active) return { kind: "none" };
    this.active = false;
    if (this.dragging) {
      this.lastTap = null;
      return { kind: "none" };
    }
    const at = point ?? this.lastPoint;
    const tap: TapRecord = { point: at, time };
    if (isDoubleTap(this.lastTap, tap)) {
      this.lastTap = null;
      return { kind: "doubleTap", point: at };
    }
    this.lastTap = tap;
    return { kind: "tap", point: at };
  }

  /** Sistem hareketi elinden aldı (kaydırma görünümü, çağrı vb.): işaretleme yok. */
  cancel(): void {
    this.active = false;
    this.lastTap = null;
  }

  /** Görünüm dışarıdan değişti (düğme, sıfırlama): izlenen görünümü ve başlangıcını eşitler. */
  syncView(view: View): void {
    this.view = view;
    this.anchorView = view;
  }
}
