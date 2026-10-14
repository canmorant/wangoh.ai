"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useAppBack } from "@/hooks/useAppBack";

/** Ekranın sol kenarından bu kadar pikselin içinde başlayan dokunuş geri hareketi sayılır. */
const EDGE = 24;
/** Bu kadar sağa çekilince bırakıldığında geri gider. */
const TRIGGER = 84;
const MAX_PULL = 72;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * iPhone'da ekranın sol kenarından sağa çekince geri (iOS'un Safari'deki hareketi;
 * Capacitor'un WebView'ında yerleşik olarak kapalı). Çekerken kenardan bir geri
 * düğmesi süzülür, yeterince çekilip bırakılınca bir önceki ekrana dönülür.
 * Android'in kendi geri hareketi var, orada devre dışı.
 *
 * Harita oyununun küresi (canvas) kenardan da sürüklenebilsin diye canvas
 * üstünde başlayan dokunuşlar sayılmıyor; başka alanlar için `data-no-edge-back`.
 */
export default function BackSwipe() {
  const chipRef = useRef<HTMLDivElement>(null);
  const { canBack, back } = useAppBack();
  const latest = useRef({ canBack, back });

  useEffect(() => {
    latest.current = { canBack, back };
  });

  useEffect(() => {
    const chip = chipRef.current;
    if (!chip) return;
    const ios =
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!ios) return;

    let tracking = false;
    let horizontal = false;
    let x0 = 0;
    let y0 = 0;
    let t0 = 0;
    let dx = 0;

    const show = (pull: number, y: number) => {
      chip.style.transition = "none";
      chip.style.opacity = String(clamp(pull / 40, 0, 1));
      const scale = 0.82 + 0.18 * clamp(pull / TRIGGER, 0, 1);
      chip.style.transform = `translate3d(${Math.min(pull * 0.6, MAX_PULL) - 46}px,${y - 22}px,0) scale(${scale})`;
      chip.dataset.armed = pull >= TRIGGER ? "1" : "0";
    };
    const hide = () => {
      chip.style.transition = "transform 0.22s ease, opacity 0.22s ease";
      chip.style.opacity = "0";
      chip.style.transform = "translate3d(-46px,0,0) scale(0.82)";
    };

    const onStart = (e: TouchEvent) => {
      tracking = false;
      horizontal = false;
      if (e.touches.length !== 1 || !latest.current.canBack) return;
      const touch = e.touches[0];
      if (touch.clientX > EDGE) return;
      if ((e.target as Element | null)?.closest?.("canvas,[data-no-edge-back]")) return;
      tracking = true;
      x0 = touch.clientX;
      y0 = touch.clientY;
      t0 = performance.now();
      dx = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (!tracking) return;
      const touch = e.touches[0];
      dx = touch.clientX - x0;
      const dy = touch.clientY - y0;
      if (!horizontal) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.3) horizontal = true;
        else {
          tracking = false;
          return;
        }
      }
      show(dx, clamp(touch.clientY, 90, window.innerHeight - 90));
    };
    const onEnd = () => {
      if (!tracking) return;
      tracking = false;
      if (!horizontal) return;
      horizontal = false;
      const fast = dx > 40 && dx / Math.max(1, performance.now() - t0) > 0.5;
      hide();
      if (dx >= TRIGGER || fast) latest.current.back();
    };
    const onCancel = () => {
      if (horizontal) hide();
      tracking = false;
      horizontal = false;
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onCancel);
    };
  }, []);

  return (
    <div
      ref={chipRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] flex size-11 items-center justify-center rounded-full border border-white/20 bg-[rgba(14,17,26,0.86)] text-white shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md data-[armed=1]:border-[var(--gold)] data-[armed=1]:text-[var(--gold)]"
      style={{ opacity: 0, transform: "translate3d(-46px,0,0) scale(0.82)" }}
    >
      <ChevronLeft className="size-5" strokeWidth={2} />
    </div>
  );
}
