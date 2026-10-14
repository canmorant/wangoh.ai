import { ISLAND } from "./island";

/**
 * Pencerenin Dynamic Island'ın çerçevesine dönüşmesi (yalnız uygulama, adalı iPhone).
 *
 * Tek bir şekil, kaydırdıkça her adımda biraz daha küçülür ve biraz daha ada biçimini
 * alır: uzun pencere önce kareye, sonra yatık bir yuvarlak dikdörtgene, sonunda ada
 * boyunda hapa dönüşür; çerçeve halkaları da aynı oranda incelir. Hiçbir aşamada
 * bir şey aniden belirmez ya da büyümez; iki uç da (başlangıç = kabinin CSS'i, bitiş =
 * IslandFrame'in CSS'i) birebir aynı ölçülerle çiziliyor.
 *
 * Kutu ve halkalar canvas'a çiziliyor: yüzlerce piksellik box-shadow halkalarını
 * her karede CSS ile yeniden boyamak iPhone'da takılırdı; burada halkalar yalnız
 * çevre uzunluğu kadar çizgi, duvar tek düz dolgu.
 */

/** Halka renkleri, içten dışa: 7 açık çerçeve, 4 koyu gölge. .hero-window ve .island-frame ile aynı. */
export const BAND_COLORS = [
  "#ffffff", "#e9e9e6", "#e0e0dd", "#d6d6d3", "#cbcbc8", "#c2c2bf", "#ecebe8",
  "#0e0f13", "#131419", "#17181d", "#1a1b21",
] as const;
/** Pencere halkaları, cam genişliğinin oranı (.hero-window). */
export const WINDOW_BANDS = [0.022, 0.052, 0.074, 0.096, 0.128, 0.155, 0.162, 0.2, 0.26, 0.34, 0.46] as const;
/** Adadaki çerçeve halkaları, px (.island-frame). */
export const ISLAND_BANDS = [0.9, 1.8, 2.8, 3.6, 4.2, 4.5, 4.7, 5.6, 6.4, 7, 7.6] as const;

/** Pencere kutusunun en/boy oranı ve köşe yarıçapı oranı (CSS: gw / 0.74, gw·0.42). */
const WINDOW_ASPECT = 0.74;
const WINDOW_RADIUS = 0.42;

export interface MorphFrame {
  /** Görünüm alanı (px). */
  viewW: number;
  viewH: number;
  /** Pencere açıklığının genişliği (CSS --gw). */
  glassW: number;
  /** Adanın dikey ortası (px, ekran üstünden). */
  dockY: number;
}

export interface Shape {
  cx: number;
  cy: number;
  w: number;
  h: number;
  r: number;
  /** Halka dış kenarları (açıklığın kenarından dışa, px), BAND_COLORS sırasında. */
  bands: number[];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Çarpımsal ara değer: bir şey 10× küçülürken her adımda aynı oranda küçülür. */
const logLerp = (a: number, b: number, t: number) => a * Math.pow(b / a, t);

/**
 * m: 0 → pencere, 1 → ada çerçevesi.
 *
 * Yükseklik genişlikten biraz önce çöker (üs 0,75 ve 1,25): şekil, hâlâ büyükken bile
 * hapa benzemeye erken başlar, genişlik ise yavaşça adanın genişliğine iner.
 */
export function morphShape(m: number, f: MorphFrame): Shape {
  const t = Math.min(1, Math.max(0, m));
  const winW = f.glassW;
  const winH = f.glassW / WINDOW_ASPECT;
  const w = logLerp(winW, ISLAND.W, Math.pow(t, 1.25));
  const h = logLerp(winH, ISLAND.H, Math.pow(t, 0.75));
  // Pencerede köşe yarıçapı kısa kenarın yarısının %84'ü; adada tam hap (%100).
  const radiusRatio = (WINDOW_RADIUS * f.glassW) / (Math.min(winW, winH) / 2);
  const r = lerp(radiusRatio, 1, t) * (Math.min(w, h) / 2);
  const bands = WINDOW_BANDS.map((ratio, i) => logLerp(ratio * f.glassW, ISLAND_BANDS[i], t));
  return { cx: f.viewW / 2, cy: lerp(f.viewH / 2, f.dockY, t), w, h, r, bands };
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export interface Look {
  /** Koyu duvarın opaklığı. */
  wall: number;
  /** Camın (yansıma ve ton) opaklığı. */
  glass: number;
  /** Açıklığın siyaha dönme oranı (ada zemini). */
  fill: number;
}

/** Şekli, f.viewW × f.viewH mantıksal piksellik bağlama çizer (dpr dönüşümü çağıranda). */
export function drawMorph(ctx: CanvasRenderingContext2D, f: MorphFrame, s: Shape, look: Look) {
  ctx.clearRect(0, 0, f.viewW, f.viewH);
  const x = s.cx - s.w / 2;
  const y = s.cy - s.h / 2;

  if (look.wall > 0.002) {
    ctx.fillStyle = `rgba(29,31,37,${look.wall})`;
    ctx.beginPath();
    ctx.rect(0, 0, f.viewW, f.viewH);
    roundedRect(ctx, x, y, s.w, s.h, s.r);
    ctx.fill("evenodd");
  }

  // Halkalar dıştan içe; her biri, kendinden önceki dış halkanın iç kenarındaki
  // yumuşatma çizgisini kapatsın diye 0,5px dışa taşıyor.
  for (let i = BAND_COLORS.length - 1; i >= 0; i--) {
    const inner = i === 0 ? 0 : s.bands[i - 1];
    const outer = s.bands[i];
    const thickness = outer - inner;
    if (thickness <= 0.01) continue;
    const width = thickness + (i === BAND_COLORS.length - 1 ? 0 : 0.5);
    const offset = inner + width / 2;
    ctx.beginPath();
    roundedRect(ctx, x - offset, y - offset, s.w + 2 * offset, s.h + 2 * offset, s.r + offset);
    ctx.lineWidth = width;
    ctx.strokeStyle = BAND_COLORS[i];
    ctx.stroke();
  }

  if (look.fill > 0.002) {
    ctx.fillStyle = `rgba(0,0,0,${look.fill})`;
    ctx.beginPath();
    roundedRect(ctx, x, y, s.w, s.h, s.r);
    ctx.fill();
  }

  if (look.glass > 0.002) {
    ctx.save();
    ctx.beginPath();
    roundedRect(ctx, x, y, s.w, s.h, s.r);
    ctx.clip();
    ctx.globalAlpha = look.glass;
    // .hero-glass: 162° çapraz yansıma, üstten gölge, hafif mavi ton.
    const angle = (162 * Math.PI) / 180;
    const dx = Math.sin(angle);
    const dy = -Math.cos(angle);
    const len = Math.abs(s.w * dx) + Math.abs(s.h * dy);
    const reflection = ctx.createLinearGradient(
      s.cx - (dx * len) / 2, s.cy - (dy * len) / 2, s.cx + (dx * len) / 2, s.cy + (dy * len) / 2
    );
    reflection.addColorStop(0.14, "rgba(255,255,255,0)");
    reflection.addColorStop(0.3, "rgba(255,255,255,0.15)");
    reflection.addColorStop(0.41, "rgba(255,255,255,0.05)");
    reflection.addColorStop(0.54, "rgba(255,255,255,0)");
    ctx.fillStyle = reflection;
    ctx.fillRect(x, y, s.w, s.h);
    const shade = ctx.createLinearGradient(0, y, 0, y + s.h);
    shade.addColorStop(0, "rgba(10,15,24,0.5)");
    shade.addColorStop(0.3, "rgba(10,15,24,0.1)");
    shade.addColorStop(1, "rgba(10,15,24,0)");
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, s.w, s.h);
    ctx.fillStyle = "rgba(143,188,216,0.07)";
    ctx.fillRect(x, y, s.w, s.h);
    ctx.restore();
  }
}
