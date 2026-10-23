/**
 * Enlem-boylam ızgarası (graticule): saf mantık. Çizgiler ekran pikselinde (sabit kalınlık) çizilsin diye
 * görünüme göre piksel konumları hesaplanır; yalnız görünür olanlar döner. Kutuplar ve ±180 sınır sayılır
 * (harita kenarı), ızgara çizgisi değildir.
 */
import { worldSize, type Size, type View } from "./viewport";

/** Yakınlaştırmaya göre çizgi aralığı (derece): yakınlaştıkça sıklaşır. */
export function graticuleStep(scale: number): number {
  if (!Number.isFinite(scale) || scale < 2) return 30;
  if (scale < 4) return 15;
  if (scale < 6.5) return 10;
  return 5;
}

export interface GraticuleLines {
  /** Dikey çizgilerin (boylam) ekran x konumları. */
  xs: number[];
  /** Yatay çizgilerin (enlem) ekran y konumları. */
  ys: number[];
  /** Çizgilerin uzanacağı görünür harita dikdörtgeni (görünümle kesişim). */
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export function graticuleLines(view: View, size: Size): GraticuleLines {
  const world = worldSize(size);
  const ww = world.width * view.scale;
  const wh = world.height * view.scale;
  const x0 = Math.max(0, view.tx);
  const x1 = Math.min(size.width, view.tx + ww);
  const y0 = Math.max(0, view.ty);
  const y1 = Math.min(size.height, view.ty + wh);
  const empty: GraticuleLines = { xs: [], ys: [], x0, x1, y0, y1 };
  if (world.width <= 0 || x1 <= x0 || y1 <= y0) return empty;

  const step = graticuleStep(view.scale);
  const xs: number[] = [];
  for (let lng = -180 + step; lng < 180; lng += step) {
    const x = view.tx + ((lng + 180) / 360) * ww;
    if (x >= x0 && x <= x1) xs.push(x);
  }
  const ys: number[] = [];
  for (let lat = 90 - step; lat > -90; lat -= step) {
    const y = view.ty + ((90 - lat) / 180) * wh;
    if (y >= y0 && y <= y1) ys.push(y);
  }
  return { xs, ys, x0, x1, y0, y1 };
}

/** Çizgileri tek SVG yol dizesine çevirir ("M x y0 V y1" ve "M x0 y H x1"). */
export function graticulePath(lines: GraticuleLines): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  let d = "";
  for (const x of lines.xs) d += `M${r(x)} ${r(lines.y0)}V${r(lines.y1)}`;
  for (const y of lines.ys) d += `M${r(lines.x0)} ${r(y)}H${r(lines.x1)}`;
  return d;
}
