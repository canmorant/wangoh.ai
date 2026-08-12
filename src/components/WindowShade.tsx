"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import {
  SHADE_CONFIG,
  clamp01,
  dragDelta,
  dragTo,
  glideStep,
  initialGlide,
  resolveClick,
} from "@/lib/shade";

export { SHADE_CONFIG };

/**
 * Uçak penceresi perdesi — tutamağından kavranıp aşağı çekilebilir.
 *
 * GERÇEK ZAMANLI TAKİP
 * --------------------
 * Önceki sürümde çizilen konum `useSpring(raw)` idi: `raw` anında değişse de
 * ekrandaki panel yayın peşinden geliyordu, yani imleci hep geriden takip
 * ediyordu. Fiziksel bir perdeyi kavrama hissi tam olarak bu gecikmede
 * kayboluyor. Artık tek bir motion value var ve sürükleme sırasında doğrudan
 * ona yazılıyor — panel imlecle birebir hareket ediyor. Yumuşaklık yalnızca
 * bırakıldıktan sonra devreye giriyor.
 *
 * SVG NOTU
 * --------
 * Panel sabit konumda çizilir, tek bir `<g>` üzerinde `style={{ y }}` ile
 * taşınır. SVG'de `x`/`y` *öznitelik* olarak MotionValue kabul etmez; bunu
 * prop olarak geçmek perdeyi tamamen hareketsiz bırakır.
 */
export default function WindowShade({
  x,
  y,
  width,
  height,
  radius,
  scale,
  onChange,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  /** Canlı kamera ölçeği — sürüklemenin 1:1 kalmasını sağlar. */
  scale: React.MutableRefObject<number>;
  onChange?: (v: number) => void;
}) {
  /** Tek doğruluk kaynağı: 0 = tam açık, 1 = tam kapalı. Ekrandaki konum budur. */
  const value = useMotionValue(SHADE_CONFIG.initial);
  const translateY = useTransform(value, (v) => (v - 1) * height);

  const drag = useRef<{
    startY: number;
    startVal: number;
    lastY: number;
    lastT: number;
    vel: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!onChange) return;
    onChange(value.get());
    return value.on("change", onChange);
  }, [value, onChange]);

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    []
  );

  const stopMotion = useCallback(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    }
  }, []);

  /** Bırakıldıktan sonraki hafif süzülme. Perde bulunduğu yerde kalır. */
  const glide = useCallback(
    (velocityPerMs: number) => {
      let v = initialGlide(velocityPerMs);
      const step = () => {
        const r = glideStep(value.get(), v);
        value.set(r.value);
        v = r.velocity;
        if (r.done) {
          raf.current = 0;
          return;
        }
        raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [value]
  );

  const onPointerDown = (e: React.PointerEvent<SVGRectElement>) => {
    e.stopPropagation();
    // Yakalama: imleç tutamaktan çıksa bile olaylar buraya gelmeye devam eder.
    // try/catch şart: tarayıcı işaretçiyi etkin saymazsa setPointerCapture
    // hata fırlatır ve korumasız bırakılırsa sürüklemeyi daha başlamadan
    // iptal eder.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* yakalama olmadan da sürükleme çalışır */
    }
    stopMotion();
    const now = performance.now();
    drag.current = {
      startY: e.clientY,
      startVal: value.get(),
      lastY: e.clientY,
      lastT: now,
      vel: 0,
      moved: false,
      pointerId: e.pointerId,
    };
    document.body.style.userSelect = "none";
  };

  const onPointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    e.stopPropagation();

    if (!d.moved && Math.abs(e.clientY - d.startY) > SHADE_CONFIG.dragSlop) {
      d.moved = true;
    }

    if (d.moved) {
      // Doğrudan yazım — yay yok, gecikme yok. Panel imlecle birlikte gider.
      const delta = dragDelta(e.clientY - d.startY, height, scale.current);
      value.set(dragTo(d.startVal, delta));
    }

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    d.vel = dragDelta(e.clientY - d.lastY, height, scale.current) / dt;
    d.lastY = e.clientY;
    d.lastT = now;
  };

  const onPointerUp = (e: React.PointerEvent<SVGRectElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* yakalanmamışsa bırakacak bir şey de yok */
    }
    document.body.style.userSelect = "";

    if (!d.moved) {
      // Hareketsiz basış = tıklama: tamamen aç ya da tamamen kapat.
      animate(value, resolveClick(d.startVal), {
        type: "spring",
        ...SHADE_CONFIG.spring,
      });
      return;
    }
    // Sürüklendi: bulunduğu yerde kalır, yalnızca hafifçe süzülür.
    glide(d.vel);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = 0.12;
    const v = value.get();
    let next: number | null = null;
    if (e.key === "ArrowDown") next = clamp01(v + step);
    else if (e.key === "ArrowUp") next = clamp01(v - step);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    stopMotion();
    animate(value, next, { type: "spring", ...SHADE_CONFIG.spring });
  };

  const grip = width * 0.26;
  const lip = width * 0.055;
  const clipId = `shade-clip-${Math.round(width)}`;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} />
        </clipPath>
        <linearGradient id="shade-face" x1="0" y1="0" x2="0.12" y2="1">
          <stop offset="0" stopColor="#ecebe7" />
          <stop offset="0.45" stopColor="#e2e1dc" />
          <stop offset="1" stopColor="#d2d1cc" />
        </linearGradient>
        <linearGradient id="shade-cast" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070c" stopOpacity="0.6" />
          <stop offset="1" stopColor="#05070c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Görsel panel — cam açıklığına kırpılır. */}
      <g clipPath={`url(#${clipId})`} style={{ pointerEvents: "none" }}>
        <motion.g style={{ y: translateY }}>
          <rect x={x} y={y + height} width={width} height={height * 0.26} fill="url(#shade-cast)" />
          <rect x={x} y={y} width={width} height={height} fill="url(#shade-face)" />

          {/* kabartma nervürler */}
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x={x}
              y={y + height * (0.08 + i * 0.11)}
              width={width}
              height={Math.max(1, width * 0.0035)}
              fill="#000"
              opacity={0.045}
            />
          ))}

          {/* alt kenar */}
          <rect x={x} y={y + height - lip} width={width} height={lip} fill="#c4c3be" />
          <rect x={x} y={y + height - lip} width={width} height={1.4} fill="#fff" opacity={0.55} />

          {/* Tutamak — panelle birlikte hareket eder, aşağı sarkar. */}
          <rect
            x={x + width / 2 - grip / 2}
            y={y + height - lip * 0.2}
            width={grip}
            height={width * 0.115}
            rx={width * 0.028}
            fill="#e6e5e0"
            stroke="#a9a8a3"
            strokeWidth={Math.max(0.6, width * 0.0022)}
          />
          <rect
            x={x + width / 2 - grip / 2}
            y={y + height - lip * 0.2}
            width={grip}
            height={1.4}
            fill="#fff"
            opacity={0.6}
          />
          {[-1.5, -0.5, 0.5, 1.5].map((o) => (
            <rect
              key={o}
              x={x + width / 2 + o * grip * 0.13 - grip * 0.02}
              y={y + height + width * 0.016}
              width={grip * 0.04}
              height={width * 0.042}
              rx={1}
              fill="#8f8e89"
            />
          ))}
        </motion.g>
      </g>

      {/* Kavrama alanı — KIRPMA DIŞINDA.
          Kırpma yolu isabet testini de kestiği için, tutamak cam açıklığının
          üst kenarına yaklaştığında hedef kırpılıp tıklanamaz hâle geliyordu.
          Aynı dönüşümü paylaşır, böylece panelle birlikte hareket eder; görünen
          tutamaktan belirgin biçimde geniştir ki dokunmatikte de rahat tutulsun. */}
      <motion.g style={{ y: translateY }}>
        <rect
          role="slider"
          tabIndex={0}
          aria-label="Pencere perdesi — aşağı sürükleyerek kapat, yukarı sürükleyerek aç"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-orientation="vertical"
          x={x + width / 2 - grip}
          y={y + height - width * 0.14}
          width={grip * 2}
          height={width * 0.38}
          fill="transparent"
          // touch-action:none, sürükleme sırasında sayfanın kaymasını engeller.
          // outline/tap-highlight kapalı: tarayıcı, odaklanan SVG öğesinin
          // sınırlayıcı kutusuna köşeleri yuvarlatılmış bir odak çerçevesi
          // çiziyordu; tutamağa her basışta beliren kare görüntü buydu.
          // Öğe hâlâ odaklanabilir ve ok tuşlarıyla çalışır — yalnızca çizim
          // kaldırıldı.
          style={{
            cursor: "grab",
            touchAction: "none",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "none";
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        />
      </motion.g>
    </g>
  );
}
