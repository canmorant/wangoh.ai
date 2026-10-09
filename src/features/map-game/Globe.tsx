"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, type KeyboardEvent, type Ref } from "react";
import { geoCircle, geoGraticule, geoInterpolate, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { world } from "../distance-game/worldMap";
import { kmToDegrees, type LngLat } from "../distance-game/mapGeometry";
import { ACCENT } from "../distance-game/ui";
import {
  clamp,
  clampView,
  dragView,
  fitView,
  flyDuration,
  flyView,
  hintView,
  INITIAL_VIEW,
  lngLatAt,
  makeProjection,
  MAX_ZOOM,
  MIN_ZOOM,
  radiusOf,
  zoomView,
  type View,
} from "./globeMath";

/**
 * Etkileşimli küre (canvas). Sürükle: döndür (bırakınca kayarak durur). Çimdikle ya da + / −:
 * yakınlaştır. Dokun: işaret koy. Kıyılar ve sınırlar JS paketinin içindeki 110 m dünya
 * verisinden çizilir (ağ isteği yok, çevrimdışı çalışır). Çizim isteğe bağlı: yalnız
 * hareket ya da animasyon varken kare üretilir, durağan küre pil harcamaz.
 *
 * Bu dosya dünya verisini içe aktardığı için yalnız oyun ekranında, dinamik import ile yüklenir.
 */

export interface GlobeHandle {
  zoomIn(): void;
  zoomOut(): void;
  /** Ekranın ortasındaki noktayı işaretle (klavye ve ince ayar için). */
  placeAtCenter(): void;
  /** Tur başındaki genel görünüme dön. */
  resetView(): void;
}

export interface GlobeReveal {
  truth: LngLat;
  /** Gerçek yerin adı (işaretin yanında yazılır). */
  label: string;
  /** "1.240 km": yayın ortasındaki etiket. */
  distanceLabel: string;
  tint: string;
}

export interface GlobeProps {
  ref?: Ref<GlobeHandle>;
  /** Tur numarası; değişince kamera genel görünüme döner. */
  roundKey: number;
  pin: LngLat | null;
  reveal: GlobeReveal | null;
  hint: { center: LngLat; radiusKm: number } | null;
  reduced: boolean;
  ariaLabel: string;
  keyboardHelpId?: string;
  onPlace(point: LngLat): void;
  /** Oyuncu küreye ilk kez dokundu / sürükledi. */
  onInteract?(): void;
  /** Yakınlık değişti (genel görünüme dön düğmesini göstermek için). */
  onZoom?(zoom: number): void;
}

const TAP_SLOP = 7;
const TAP_MAX_MS = 700;
const ARC_MS = 950;
const PULSE_MS = 1700;
const PIN_POP_MS = 340;
const HINT_FADE_MS = 500;
const TWO_PI = Math.PI * 2;

const SEA_NEAR = "#1d3a66";
const SEA_FAR = "#0a1528";
const LAND = "#2d4870";
const PIN_COLOR = "#ffffff";

const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

interface Fly {
  from: View;
  to: View;
  t0: number;
  dur: number;
}

interface Pointer {
  x: number;
  y: number;
}

interface Gesture {
  startX: number;
  startY: number;
  startT: number;
  lastX: number;
  lastY: number;
  lastT: number;
  moved: boolean;
  /** Parmak hızı, derece/ms. */
  vLng: number;
  vLat: number;
  pinch: { dist: number; zoom: number; midX: number; midY: number } | null;
}

/* ------------------------------ çizim yardımcıları ------------------------------ */

const graticules = new Map<number, GeoPermissibleObjects>();
function graticuleFor(zoom: number): GeoPermissibleObjects {
  const step = zoom < 3 ? 15 : zoom < 9 ? 5 : 2;
  let g = graticules.get(step);
  if (!g) {
    g = geoGraticule().step([step, step])();
    graticules.set(step, g);
  }
  return g;
}

function drawPin(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetY = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-4, -9, -12, -14, -12, -23);
  ctx.arc(0, -23, 12, Math.PI, 0);
  ctx.bezierCurveTo(12, -14, 4, -9, 0, 0);
  ctx.closePath();
  ctx.fillStyle = PIN_COLOR;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = "#06090f";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -23, 4.6, 0, TWO_PI);
  ctx.fillStyle = "#06090f";
  ctx.fill();
  ctx.restore();
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fill: string,
  align: CanvasTextAlign,
) {
  ctx.font = '600 13px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = 3.6;
  ctx.strokeStyle = "rgba(6,9,15,0.92)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

function drawPill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tint: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = '700 14px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const w = ctx.measureText(text).width + 22;
  const h = 28;
  const r = h / 2;
  const left = x - w / 2;
  const top = y - h / 2;
  ctx.beginPath();
  ctx.moveTo(left + r, top);
  ctx.lineTo(left + w - r, top);
  ctx.arc(left + w - r, top + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(left + r, top + h);
  ctx.arc(left + r, top + r, r, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(6,9,15,0.9)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = tint;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 0.5);
  ctx.restore();
}

interface Timeline {
  pin: number;
  /** Yay çizimi 0–1; ipucu yoksa 0. */
  arc: number;
  /** Gerçek yer işaretinin nabzı 0–1, bittiyse -1. */
  pulse: number;
  hint: number;
}

interface Scene {
  w: number;
  h: number;
  view: View;
  pin: LngLat | null;
  reveal: GlobeReveal | null;
  hint: { center: LngLat; radiusKm: number } | null;
  locked: boolean;
  /** Etkileşim sırasında ayrıntı azaltılır. */
  moving: boolean;
  tl: Timeline;
}

function drawScene(ctx: CanvasRenderingContext2D, s: Scene) {
  const { w, h, view } = s;
  const projection = makeProjection(view, w, h);
  if (s.moving) projection.precision(1.2);
  const path = geoPath(projection, ctx);
  const R = radiusOf(view, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const { land, borders } = world();

  ctx.clearRect(0, 0, w, h);

  // Atmosfer ışıması (yalnız kürenin kenarı kadrajdayken görünür).
  if (view.zoom < 2.6) {
    const glow = ctx.createRadialGradient(cx, cy, R * 0.97, cx, cy, R * 1.13);
    glow.addColorStop(0, "rgba(200,164,94,0.26)");
    glow.addColorStop(1, "rgba(200,164,94,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.13, 0, TWO_PI);
    ctx.fill();
  }

  // Deniz.
  const sea = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.38, R * 0.08, cx, cy, R * 1.05);
  sea.addColorStop(0, SEA_NEAR);
  sea.addColorStop(1, SEA_FAR);
  ctx.beginPath();
  path({ type: "Sphere" });
  ctx.fillStyle = sea;
  ctx.fill();

  // Enlem/boylam ağı.
  ctx.beginPath();
  path(graticuleFor(view.zoom));
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.stroke();

  // Kara ve sınırlar.
  ctx.beginPath();
  path(land);
  ctx.fillStyle = LAND;
  ctx.fill();
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = "rgba(200,164,94,0.5)";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.beginPath();
  path(borders);
  ctx.lineWidth = view.zoom > 3 ? 1 : 0.65;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.stroke();

  // İpucu halkası.
  if (s.hint) {
    const ring = geoCircle().center(s.hint.center).radius(kmToDegrees(s.hint.radiusKm)).precision(2)();
    ctx.save();
    ctx.globalAlpha = s.tl.hint;
    ctx.beginPath();
    path(ring);
    ctx.fillStyle = "rgba(200,164,94,0.13)";
    ctx.fill();
    ctx.setLineDash([9, 7]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = ACCENT;
    ctx.stroke();
    ctx.restore();
  }

  // Kürenin kenarına doğru kararma: yuvarlaklık hissi.
  ctx.save();
  ctx.beginPath();
  path({ type: "Sphere" });
  ctx.clip();
  const shade = ctx.createRadialGradient(cx - R * 0.12, cy - R * 0.16, R * 0.5, cx, cy, R);
  shade.addColorStop(0, "rgba(2,6,14,0)");
  shade.addColorStop(1, "rgba(2,6,14,0.58)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // Küre kenarı.
  ctx.beginPath();
  path({ type: "Sphere" });
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(200,164,94,0.4)";
  ctx.stroke();

  // Ortadaki artı: ince ayar işareti.
  if (!s.locked) {
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy);
    ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx, cy + 8);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.stroke();
  }

  // Cevap: yay, gerçek yer ve etiketler.
  const { reveal, pin, tl } = s;
  if (reveal && pin) {
    const lerp = geoInterpolate(pin, reveal.truth);
    if (tl.arc > 0) {
      const steps = 64;
      const upto = Math.max(1, Math.ceil(steps * tl.arc));
      const coordinates = Array.from({ length: upto + 1 }, (_, i) => lerp(Math.min(1, (i / steps) * 1)));
      const end = lerp(tl.arc);
      coordinates[coordinates.length - 1] = end;
      ctx.save();
      ctx.lineCap = "round";
      ctx.beginPath();
      path({ type: "LineString", coordinates });
      ctx.lineWidth = 7;
      ctx.strokeStyle = reveal.tint;
      ctx.globalAlpha = 0.25;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      path({ type: "LineString", coordinates });
      ctx.lineWidth = 2.6;
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = reveal.tint;
      ctx.stroke();
      ctx.restore();
      if (tl.arc < 1) {
        const head = projection(end);
        if (head) {
          ctx.beginPath();
          ctx.arc(head[0], head[1], 4, 0, TWO_PI);
          ctx.fillStyle = "#fff6dc";
          ctx.fill();
        }
      }
    }

    const truthXY = projection(reveal.truth);
    if (truthXY) {
      const [tx, ty] = truthXY;
      if (tl.pulse >= 0) {
        ctx.beginPath();
        ctx.arc(tx, ty, 8 + 26 * tl.pulse, 0, TWO_PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = ACCENT;
        ctx.globalAlpha = 0.8 * (1 - tl.pulse);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      ctx.arc(tx, ty, 10, 0, TWO_PI);
      ctx.fillStyle = "rgba(200,164,94,0.25)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, ty, 5.4, 0, TWO_PI);
      ctx.fillStyle = ACCENT;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#06090f";
      ctx.stroke();
      const right = tx < w * 0.62;
      ctx.save();
      ctx.globalAlpha = clamp(tl.arc * 1.5, 0, 1);
      drawLabel(ctx, reveal.label, right ? tx + 14 : tx - 14, ty - 14, "#f3dfae", right ? "left" : "right");
      ctx.restore();
    }

    if (tl.arc >= 1) {
      const mid = projection(lerp(0.5));
      if (mid) drawPill(ctx, reveal.distanceLabel, mid[0], mid[1] - 20, reveal.tint, clamp((tl.arc - 0.98) * 50, 0, 1));
    }
  }

  // Oyuncunun işareti en üstte (cevapta gerçek yerin altında kalmasın diye en son).
  if (pin) {
    const xy = projection(pin);
    if (xy) drawPin(ctx, xy[0], xy[1], easeOutBack(clamp(tl.pin, 0, 1)));
  }
}

/* --------------------------------- bileşen --------------------------------- */

export default function Globe({
  ref,
  roundKey,
  pin,
  reveal,
  hint,
  reduced,
  ariaLabel,
  keyboardHelpId,
  onPlace,
  onInteract,
  onZoom,
}: GlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const view = useRef<View>(INITIAL_VIEW);
  const size = useRef({ w: 320, h: 320, dpr: 1 });
  const raf = useRef(0);
  const fly = useRef<Fly | null>(null);
  const inertia = useRef<{ vLng: number; vLat: number; last: number } | null>(null);
  const pointers = useRef(new Map<number, Pointer>());
  const gesture = useRef<Gesture | null>(null);
  const times = useRef({ pin: -1, reveal: -1, arcDelay: 0, hint: -1 });
  const interacting = useRef(false);
  const latest = useRef({ pin, reveal, hint, reduced, onPlace, onInteract, onZoom });
  const lastZoom = useRef(1);

  const frameRef = useRef<(now: number) => void>(() => {});

  const request = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame((now) => frameRef.current(now));
  }, []);

  // Her render'dan sonra güncel prop'lar çizim döngüsünün okuyacağı yere yazılır.
  useEffect(() => {
    latest.current = { pin, reveal, hint, reduced, onPlace, onInteract, onZoom };
    request();
  });

  const notifyZoom = useCallback(() => {
    const z = Math.round(view.current.zoom * 10) / 10;
    if (z !== lastZoom.current) {
      lastZoom.current = z;
      latest.current.onZoom?.(z);
    }
  }, []);

  const flyTo = useCallback(
    (to: View) => {
      const target = clampView(to);
      inertia.current = null;
      if (latest.current.reduced) {
        fly.current = null;
        view.current = target;
        notifyZoom();
        request();
        return;
      }
      fly.current = { from: view.current, to: target, t0: performance.now(), dur: flyDuration(view.current, target) };
      request();
    },
    [notifyZoom, request],
  );

  // Çizim döngüsü: her karede animasyonları ilerletir, sahneyi çizer, iş sürüyorsa kendini yeniden kurar.
  useEffect(() => {
    frameRef.current = (now: number) => {
      raf.current = 0;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const cur = latest.current;
      let active = false;

      if (fly.current) {
        const f = fly.current;
        const t = (now - f.t0) / f.dur;
        if (t >= 1) {
          view.current = f.to;
          fly.current = null;
        } else {
          view.current = flyView(f.from, f.to, t);
          active = true;
        }
        notifyZoom();
      }
      if (inertia.current) {
        const dt = Math.min(48, now - inertia.current.last);
        inertia.current.last = now;
        const decay = Math.exp(-dt / 340);
        inertia.current.vLng *= decay;
        inertia.current.vLat *= decay;
        view.current = clampView({
          ...view.current,
          lng: view.current.lng + inertia.current.vLng * dt,
          lat: view.current.lat + inertia.current.vLat * dt,
        });
        if (Math.abs(inertia.current.vLng) + Math.abs(inertia.current.vLat) < 0.0012) inertia.current = null;
        else active = true;
      }

      const t = times.current;
      const pinT = t.pin < 0 ? 1 : cur.reduced ? 1 : (now - t.pin) / PIN_POP_MS;
      if (pinT < 1) active = true;
      let arc = 0;
      let pulse = -1;
      if (cur.reveal && t.reveal >= 0) {
        const since = now - t.reveal - t.arcDelay;
        arc = cur.reduced ? 1 : clamp(since / ARC_MS, 0, 1);
        if (arc < 1) active = true;
        const pulseT = (since - ARC_MS) / PULSE_MS;
        if (!cur.reduced && pulseT >= 0 && pulseT < 1) {
          pulse = easeInOut(pulseT);
          active = true;
        } else if (!cur.reduced && pulseT < 0) {
          active = true;
        }
      }
      const hintT = !cur.hint ? 0 : t.hint < 0 || cur.reduced ? 1 : clamp((now - t.hint) / HINT_FADE_MS, 0, 1);
      if (cur.hint && hintT < 1) active = true;

      const { w, h, dpr } = size.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(ctx, {
        w,
        h,
        view: view.current,
        pin: cur.pin,
        reveal: cur.reveal,
        hint: cur.hint,
        locked: !!cur.reveal,
        moving: interacting.current || !!fly.current || !!inertia.current,
        tl: { pin: pinT, arc, pulse, hint: hintT },
      });
      if (active) raf.current = requestAnimationFrame((n) => frameRef.current(n));
    };
    request();
  }, [notifyZoom, request]);

  // Boyut: kutuya uyar, yüksek çözünürlüklü ekranda keskin çiz.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const apply = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(120, Math.round(rect.width));
      const h = Math.max(120, Math.round(rect.height));
      const dpr = Math.min(2.5, window.devicePixelRatio || 1);
      size.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      request();
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(wrap);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [request]);

  // Yeni tur: işaret, cevap ve ipucu sıfırlanır; kamera genel görünüme döner.
  useEffect(() => {
    times.current = { pin: -1, reveal: -1, arcDelay: 0, hint: -1 };
    flyTo({ ...view.current, zoom: MIN_ZOOM });
  }, [roundKey, flyTo]);

  // İşaret konulunca küçük bir "düşme" animasyonu.
  useEffect(() => {
    if (pin) times.current.pin = performance.now();
    request();
  }, [pin, request]);

  // İpucu: halka belirir, kamera oraya uçar.
  useEffect(() => {
    if (!hint) return;
    times.current.hint = performance.now();
    flyTo(hintView(hint.center, hint.radiusKm));
  }, [hint, flyTo]);

  // Cevap: kamera iki noktayı kadraja alır, ardından yay çizilir.
  useEffect(() => {
    if (!reveal || !pin) return;
    const to = fitView(pin, reveal.truth);
    const dur = latest.current.reduced ? 0 : flyDuration(view.current, to);
    times.current.reveal = performance.now();
    times.current.arcDelay = dur + 120;
    flyTo(to);
  }, [reveal, pin, flyTo]);

  const place = useCallback(
    (x: number, y: number) => {
      const { w, h } = size.current;
      const point = lngLatAt(view.current, w, h, x, y);
      if (point) latest.current.onPlace(point);
    },
    [],
  );

  const zoomBy = useCallback(
    (factor: number) => {
      fly.current = null;
      inertia.current = null;
      view.current = zoomView(view.current, factor);
      notifyZoom();
      request();
    },
    [notifyZoom, request],
  );

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => flyTo({ ...view.current, zoom: clamp(view.current.zoom * 1.8, MIN_ZOOM, MAX_ZOOM) }),
      zoomOut: () => flyTo({ ...view.current, zoom: clamp(view.current.zoom / 1.8, MIN_ZOOM, MAX_ZOOM) }),
      placeAtCenter: () => place(size.current.w / 2, size.current.h / 2),
      resetView: () => flyTo({ ...view.current, zoom: MIN_ZOOM }),
    }),
    [flyTo, place],
  );

  /* ----------------------------- işaretçi olayları ----------------------------- */

  const local = (e: { clientX: number; clientY: number }): Pointer => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    latest.current.onInteract?.();
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    fly.current = null;
    inertia.current = null;
    interacting.current = true;
    const now = performance.now();
    if (pointers.current.size === 1) {
      gesture.current = {
        startX: p.x,
        startY: p.y,
        startT: now,
        lastX: p.x,
        lastY: p.y,
        lastT: now,
        moved: false,
        vLng: 0,
        vLat: 0,
        pinch: null,
      };
    } else if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.moved = true;
      gesture.current.pinch = {
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        zoom: view.current.zoom,
        midX: (a.x + b.x) / 2,
        midY: (a.y + b.y) / 2,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    const { w, h } = size.current;
    const now = performance.now();

    if (pointers.current.size >= 2 && g.pinch) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const next = clampView({ ...view.current, zoom: g.pinch.zoom * (dist / g.pinch.dist) });
      // İki parmağı birlikte kaydırmak da küreyi döndürür.
      view.current = dragView(next, midX - g.pinch.midX, midY - g.pinch.midY, radiusOf(next, w, h));
      g.pinch.midX = midX;
      g.pinch.midY = midY;
      notifyZoom();
      request();
      return;
    }

    if (!g.moved && Math.hypot(p.x - g.startX, p.y - g.startY) < TAP_SLOP) return;
    g.moved = true;
    const dx = p.x - g.lastX;
    const dy = p.y - g.lastY;
    const dt = Math.max(1, now - g.lastT);
    const before = view.current;
    view.current = dragView(before, dx, dy, radiusOf(before, w, h));
    // Hız: son hareketin ağırlıklı ortalaması (bırakınca kayma için).
    const vLng = (view.current.lng - before.lng) / dt;
    const vLat = (view.current.lat - before.lat) / dt;
    g.vLng = g.vLng * 0.6 + vLng * 0.4;
    g.vLat = g.vLat * 0.6 + vLat * 0.4;
    g.lastX = p.x;
    g.lastY = p.y;
    g.lastT = now;
    request();
  };

  const endPointer = (e: React.PointerEvent<HTMLCanvasElement>, cancelled: boolean) => {
    const g = gesture.current;
    const had = pointers.current.delete(e.pointerId);
    if (!g || !had) return;
    const now = performance.now();
    if (pointers.current.size > 0) {
      // Çimdik bitti, tek parmak kaldı: sıçrama olmasın diye yeniden başlat.
      const rest = [...pointers.current.values()][0];
      g.pinch = null;
      g.moved = true;
      g.lastX = rest.x;
      g.lastY = rest.y;
      g.lastT = now;
      g.vLng = 0;
      g.vLat = 0;
      return;
    }
    interacting.current = false;
    gesture.current = null;
    if (cancelled) {
      request();
      return;
    }
    if (!g.moved && now - g.startT < TAP_MAX_MS) {
      const p = local(e);
      if (!latest.current.reveal) place(p.x, p.y);
    } else if (g.moved && !latest.current.reduced && now - g.lastT < 90) {
      const speed = Math.abs(g.vLng) + Math.abs(g.vLat);
      if (speed > 0.004) inertia.current = { vLng: g.vLng, vLat: g.vLat, last: now };
    }
    request();
  };

  // Tekerlek: yalnız Ctrl/⌘ ile (dokunmatik yüzeyde çimdik de böyle gelir); düz kaydırma sayfayı kaydırır.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomBy(Math.exp(-e.deltaY * 0.0022));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  const onKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const step = 14 / Math.max(1, view.current.zoom);
    const move = (dLng: number, dLat: number) => {
      e.preventDefault();
      fly.current = null;
      inertia.current = null;
      view.current = clampView({ ...view.current, lng: view.current.lng + dLng, lat: view.current.lat + dLat });
      request();
    };
    switch (e.key) {
      case "ArrowLeft":
        return move(-step, 0);
      case "ArrowRight":
        return move(step, 0);
      case "ArrowUp":
        return move(0, step);
      case "ArrowDown":
        return move(0, -step);
      case "+":
      case "=":
        e.preventDefault();
        return zoomBy(1.5);
      case "-":
      case "_":
        e.preventDefault();
        return zoomBy(1 / 1.5);
      case "Enter":
      case " ":
        if (!latest.current.reveal) {
          e.preventDefault();
          place(size.current.w / 2, size.current.h / 2);
        }
    }
  };

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        role="application"
        aria-label={ariaLabel}
        aria-describedby={keyboardHelpId}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endPointer(e, false)}
        onPointerCancel={(e) => endPointer(e, true)}
        onKeyDown={onKeyDown}
        className="block size-full touch-none rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        style={{ cursor: reveal ? "default" : "crosshair" }}
      />
    </div>
  );
}
