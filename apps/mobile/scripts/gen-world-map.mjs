/**
 * Harita oyununun dünya haritası geometrisini üretir: src/features/games/map/worldPaths.ts
 *
 * Bu bir ARAYÜZ VARLIĞIDIR (içerik verisi değil): kara parçalarının ve ülke sınırlarının SVG çizgisi.
 * Hiçbir ülke adı, başkent ya da başka içerik taşımaz; ülke bilgisi yalnız API'den gelir.
 *
 * Kaynak: world-atlas (Natural Earth, kamu malı) TopoJSON, topojson-client ve d3-geo ile eşdikdörtgen
 * (equirectangular) izdüşüme çevrilir. 1 birim = 1/UNIT derece; x = (boylam + 180) * UNIT,
 * y = (90 - enlem) * UNIT. İzdüşüm uygulama kodundaki projection.ts ile birebir aynıdır, bu yüzden
 * işaretçiler ve dokunma noktaları yol çizimiyle çakışır.
 *
 * Boyutu küçültmek için Douglas-Peucker sadeleştirmesi, küçük halkaların atılması ve tam sayıya
 * yuvarlama (göreli komutlar) uygulanır. Betik yalnız geliştirmede çalışır; çıktı repoya eklenir.
 *
 * Çalıştır (apps/mobile içinde):
 *   node scripts/gen-world-map.mjs                 (varsayılan: 50m, tolerans 0,05 derece)
 *   node scripts/gen-world-map.mjs --res=110m --tol=0.05 --unit=20 --min-area=0.004 --borders=1
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { geoEquirectangular, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = "1"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const RES = args.res ?? "50m";
/** 1 derece = UNIT birim (tam sayı koordinatlar). 20 → 0,05 derece (~5,5 km) çözünürlük. */
const UNIT = Number(args.unit ?? 20);
/** Douglas-Peucker toleransı (derece). */
const TOL_DEG = Number(args.tol ?? 0.05);
/** Bundan küçük kara halkaları (derece²) atılır. */
const MIN_AREA_DEG2 = Number(args["min-area"] ?? 0.005);
const WITH_BORDERS = args.borders !== "0";
const OUT = fileURLToPath(new URL("../src/features/games/map/worldPaths.ts", import.meta.url));

const pkgPath = require.resolve(`world-atlas/countries-${RES}.json`);
const atlasVersion = JSON.parse(readFileSync(require.resolve("world-atlas/package.json"), "utf8")).version;
const world = JSON.parse(readFileSync(pkgPath, "utf8"));

const projection = geoEquirectangular()
  .scale((UNIT * 180) / Math.PI)
  .translate([180 * UNIT, 90 * UNIT])
  .precision(0.5);

/** d3 yol bağlamı: moveTo/lineTo/closePath çağrılarını halka/çizgi listesine toplar. */
function recorder() {
  const shapes = [];
  let cur = null;
  return {
    shapes,
    moveTo(x, y) {
      cur = { pts: [[x, y]], closed: false };
      shapes.push(cur);
    },
    lineTo(x, y) {
      cur.pts.push([x, y]);
    },
    closePath() {
      if (cur) cur.closed = true;
    },
    arc() {},
    rect() {},
  };
}

function collect(geo) {
  const ctx = recorder();
  geoPath(projection, ctx)(geo);
  return ctx.shapes;
}

function dist2ToSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let t = l2 === 0 ? 0 : ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const x = a[0] + t * dx - p[0];
  const y = a[1] + t * dy - p[1];
  return x * x + y * y;
}

/** Açık çizgi için Douglas-Peucker (yinelemeli). Uç noktalar korunur. */
function simplifyOpen(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  const tol2 = tol * tol;
  while (stack.length) {
    const [s, e] = stack.pop();
    let max = -1;
    let idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = dist2ToSegment(pts[i], pts[s], pts[e]);
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol2 && idx > 0) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** Kapalı halka: ilk noktayı ve ona en uzak noktayı sabitleyip iki yarıyı ayrı sadeleştirir. */
function simplifyRing(pts, tol) {
  if (pts.length < 4) return pts.slice();
  let far = 0;
  let max = -1;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[0][0];
    const dy = pts[i][1] - pts[0][1];
    const d = dx * dx + dy * dy;
    if (d > max) {
      max = d;
      far = i;
    }
  }
  const a = simplifyOpen(pts.slice(0, far + 1), tol);
  const b = simplifyOpen([...pts.slice(far), pts[0]], tol);
  return [...a, ...b.slice(1, -1)];
}

function quantize(pts) {
  const out = [];
  for (const [x, y] of pts) {
    const q = [Math.round(x), Math.round(y)];
    const last = out[out.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) out.push(q);
  }
  return out;
}

function ringAreaUnits2(pts) {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a / 2);
}

/** Sayıları, SVG ayrıştırıcılarının hepsinin sorunsuz okuduğu biçimde (boşlukla ayrılmış) yazar. */
function serialize(shapes, { closeRings }) {
  const parts = [];
  let kept = 0;
  let points = 0;
  for (const shape of shapes) {
    let pts = shape.pts;
    if (closeRings && shape.closed) {
      pts = simplifyRing(pts, TOL_DEG * UNIT);
      pts = quantize(pts);
      if (pts.length > 1) {
        const a = pts[0];
        const z = pts[pts.length - 1];
        if (a[0] === z[0] && a[1] === z[1]) pts.pop();
      }
      if (pts.length < 3) continue;
      if (ringAreaUnits2(pts) < MIN_AREA_DEG2 * UNIT * UNIT) continue;
    } else {
      pts = quantize(simplifyOpen(pts, TOL_DEG * UNIT));
      if (pts.length < 2) continue;
    }
    kept++;
    points += pts.length;
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    if (pts.length > 1) {
      d += "l";
      const rel = [];
      for (let i = 1; i < pts.length; i++) rel.push(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      d += rel.join(" ");
    }
    if (closeRings && shape.closed) d += "z";
    parts.push(d);
  }
  return { d: parts.join(""), kept, points };
}

const landGeo = feature(world, world.objects.land);
const land = serialize(collect(landGeo), { closeRings: true });

let borders = { d: "", kept: 0, points: 0 };
if (WITH_BORDERS) {
  const borderGeo = mesh(world, world.objects.countries, (a, b) => a !== b);
  borders = serialize(collect(borderGeo), { closeRings: false });
}

const header = `/**
 * ÜRETİLMİŞ DOSYA: elle düzenleme. Yeniden üretmek için (apps/mobile içinde): node scripts/gen-world-map.mjs
 *
 * Arayüz varlığı (içerik değil): dünya kara parçaları ve ülke sınırları, eşdikdörtgen izdüşümde SVG yolu.
 * Kaynak: world-atlas ${atlasVersion} countries-${RES} (Natural Earth, kamu malı).
 * Birim: 1/${UNIT} derece. x = (boylam + 180) * ${UNIT}, y = (90 - enlem) * ${UNIT}.
 * Sadeleştirme: Douglas-Peucker ${TOL_DEG}°, ${MIN_AREA_DEG2} derece²'den küçük kara halkaları atıldı.
 */
`;

const body = `
/** Bir derecenin birim sayısı. */
export const WORLD_UNITS_PER_DEGREE = ${UNIT};
/** Haritanın birim cinsinden genişliği (360 derece) ve yüksekliği (180 derece). */
export const WORLD_WIDTH = ${360 * UNIT};
export const WORLD_HEIGHT = ${180 * UNIT};

/** Kara parçaları (dolgu, fillRule=evenodd). ${land.kept} halka, ${land.points} nokta. */
export const LAND_PATH =
  ${JSON.stringify(land.d)};

/** Ülke sınırları (yalnız çizgi). ${borders.kept} çizgi, ${borders.points} nokta. */
export const BORDER_PATH =
  ${JSON.stringify(borders.d)};
`;

mkdirSync(dirname(OUT), { recursive: true });
const text = header + body;
writeFileSync(OUT, text);
const kb = (n) => (n / 1024).toFixed(1);
console.log(
  `worldPaths.ts yazıldı: ${kb(Buffer.byteLength(text))} KB (kara ${kb(land.d.length)} KB / ${land.kept} halka / ${land.points} nokta; ` +
    `sınır ${kb(borders.d.length)} KB / ${borders.kept} çizgi / ${borders.points} nokta) [res=${RES} unit=${UNIT} tol=${TOL_DEG} min-area=${MIN_AREA_DEG2}]`,
);
