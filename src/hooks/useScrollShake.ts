"use client";

import { useEffect, useRef, useState } from "react";
import { ShakeDetector, SHAKE_CONFIG, normalizeWheel, ShakeConfig } from "@/lib/shake";

/**
 * Binds the shake detector to raw wheel + touch input.
 *
 * Deliberately NOT bound to scroll events: Lenis smooths `scrollY`, which
 * destroys the direction reversals this gesture depends on. See src/lib/shake.ts.
 *
 * Returns `charge` (0…1) so the UI can react while the user is shaking —
 * the gesture should feel like it is being noticed before it fires.
 */
export function useScrollShake(
  onShake: () => void,
  { enabled = true, config = SHAKE_CONFIG }: { enabled?: boolean; config?: ShakeConfig } = {}
) {
  const [charge, setCharge] = useState(0);
  // Kept in a ref so the listener never re-binds when the callback identity
  // changes. Assigned in an effect, not during render — mutating a ref while
  // rendering is not safe under concurrent rendering.
  const cb = useRef(onShake);
  useEffect(() => {
    cb.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const det = new ShakeDetector(config);
    let raf = 0;
    let lastTouchY: number | null = null;

    const feed = (delta: number) => {
      const now = performance.now();
      if (det.push(delta, now)) {
        setCharge(0);
        cb.current();
        return;
      }
      // Throttle charge updates to one per frame.
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          setCharge(det.charge(performance.now()));
        });
      }
    };

    const onWheel = (e: WheelEvent) => {
      feed(normalizeWheel(e.deltaY, e.deltaMode, window.innerHeight));
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y == null) return;
      if (lastTouchY != null) feed(lastTouchY - y);
      lastTouchY = y;
    };

    const onTouchEnd = () => {
      lastTouchY = null;
    };

    // passive: these listeners only observe; they never preventDefault.
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Decay the charge indicator when the user stops.
    const decay = setInterval(() => {
      setCharge((c) => (c > 0.01 ? det.charge(performance.now()) : 0));
    }, 220);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      clearInterval(decay);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, config]);

  return charge;
}
