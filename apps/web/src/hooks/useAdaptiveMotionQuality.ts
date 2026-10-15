"use client";

import { useEffect, useState } from "react";

export type MotionQuality = "full" | "lite";

type PerformanceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function hasLowPowerHint(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as PerformanceNavigator;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth <= 640 ||
    nav.connection?.saveData === true ||
    (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) ||
    (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4)
  );
}

/**
 * Donanım ipuçları yetersiz kaldığında gerçek kare süresini kısa süre ölçer.
 * Görsel kalite yalnızca cihaz ilk sahneyi sürdüremiyorsa hafifler; güçlü
 * cihazlarda mevcut sinematik kompozisyon aynen korunur.
 */
export function useAdaptiveMotionQuality(): MotionQuality {
  const [quality, setQuality] = useState<MotionQuality>(() =>
    hasLowPowerHint() ? "lite" : "full"
  );

  useEffect(() => {
    if (quality === "lite") return;

    let frame = 0;
    let previous = performance.now();
    const started = previous;
    let samples = 0;
    let slowFrames = 0;
    let severeFrames = 0;

    const sample = (now: number) => {
      const frameTime = now - previous;
      previous = now;

      // Arka plan sekmeleri kasıtlı olarak yavaşlatılır; onları donanım ölçümü
      // sanmamak için yalnızca görünürken örnek alıyoruz.
      if (document.visibilityState === "visible" && frameTime < 250) {
        samples += 1;
        if (frameTime > 24) slowFrames += 1;
        if (frameTime > 42) severeFrames += 1;
      }

      if (now - started < 1400) {
        frame = requestAnimationFrame(sample);
        return;
      }

      if (
        samples >= 24 &&
        (slowFrames / samples > 0.22 || severeFrames >= 3)
      ) {
        setQuality("lite");
      }
    };

    frame = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(frame);
  }, [quality]);

  return quality;
}
