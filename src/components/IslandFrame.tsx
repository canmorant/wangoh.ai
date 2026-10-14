"use client";

import { useEffect, useRef } from "react";
import { clamp01, progress, smooth } from "@/lib/camera";

/** Dynamic Island'ın üst kenarı, üst güvenli alanın bu kadar piksel üstünde (59→11, 62→14). */
const INSET_TO_TOP = 48;
/** Adalı iPhone'larda üst güvenli alan ≥ 55px (çentikli eski modellerde 44–47). */
const MIN_INSET = 55;
const ISLAND_H = 39;
/** Çerçeve pencerenin camında bu kadar büyük başlar, adaya konarken 1'e iner. */
const START_SCALE = 2.3;

/**
 * Dynamic Island'ın çevresindeki küçük pencere çerçevesi (yalnız uygulama, yalnız adalı iPhone).
 *
 * Ana sayfada pencereden içeri girerken (WindowHero) çerçeve camın ortasında belirir,
 * kaydırdıkça yukarı süzülüp küçülür ve adaya oturur; sonra sayfa boyunca (ve tüm
 * sayfalarda) adanın çevresinde kalır. Geri kaydırınca aynı yoldan camın ortasına döner.
 *
 * Hero sahnesinden haber almak için sahnenin bölümünü `data-hero-stage` ile buluyor
 * (WindowHero); sahne yoksa (kıta görünümü, diğer sayfalar) çerçeve doğrudan adada.
 * Yalnız transform ve opacity değişiyor.
 */
export default function IslandFrame() {
  const probeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const probe = probeRef.current;
    const ring = ringRef.current;
    if (!probe || !ring) return;

    let inset = 0;
    let hasIsland = false;
    let stage: HTMLElement | null = null;
    let frame = 0;
    let last = "";

    const render = () => {
      frame = 0;
      if (!hasIsland) return;
      if (!stage?.isConnected) stage = document.querySelector<HTMLElement>("[data-hero-stage]");
      const view = stage?.firstElementChild as HTMLElement | null;

      let show = 1;
      let m = 1;
      let cy = window.innerHeight / 2;
      if (stage && view) {
        const rect = stage.getBoundingClientRect();
        const viewH = view.clientHeight;
        const travel = rect.height - viewH;
        const p = travel <= 0 ? 0 : clamp01(-rect.top / travel);
        const q = progress(p);
        show = smooth(0.08, 0.34, q);
        m = smooth(0.3, 0.92, q);
        cy = viewH / 2;
      }
      const dock = inset - INSET_TO_TOP + ISLAND_H / 2;
      const y = (1 - m) * (cy - dock);
      const s = 1 + (START_SCALE - 1) * (1 - m);
      const key = `${show.toFixed(3)}|${y.toFixed(1)}|${s.toFixed(3)}`;
      if (key === last) return;
      last = key;
      ring.style.opacity = String(show);
      ring.style.transform = `translate3d(-50%,${y}px,0) scale(${s})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const measure = () => {
      inset = parseFloat(getComputedStyle(probe).paddingTop) || 0;
      hasIsland = inset >= MIN_INSET;
      ring.style.display = hasIsland ? "block" : "none";
      ring.style.top = `${inset - INSET_TO_TOP}px`;
      last = "";
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("wangoh:hero", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("wangoh:hero", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={probeRef}
        aria-hidden
        className="pointer-events-none invisible fixed top-0 left-0 h-0 w-0"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="island-frame"
        style={{ display: "none", opacity: 0, transform: "translate3d(-50%,0,0)" }}
      />
    </>
  );
}
