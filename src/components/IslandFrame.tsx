"use client";

import { useEffect, useRef } from "react";
import { clamp01, progress, smooth } from "@/lib/camera";
import { ISLAND, readSafeTop } from "@/lib/island";

/**
 * Dynamic Island'ın çevresindeki ince pencere çerçevesi (yalnız uygulama, yalnız adalı iPhone).
 *
 * Ana sayfada pencere sahnesi (WindowHero) kaydırdıkça ada çerçevesine dönüşür; şekil adaya
 * vardığı anda bu çerçeve onun yerini alıyor (birebir aynı ölçüde, kısa bir çapraz geçiş) ve
 * sayfa boyu, tüm sayfalarda adanın çevresinde kalıyor. Geri kaydırınca pencereye döner.
 *
 * Hero sahnesinden haber almak için sahnenin bölümünü `data-hero-stage` ile buluyor;
 * sahne yoksa (kıta görünümü, diğer sayfalar) çerçeve doğrudan görünür. Yalnız opacity.
 */
export default function IslandFrame() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

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
      if (stage && view) {
        const rect = stage.getBoundingClientRect();
        const travel = rect.height - view.clientHeight;
        const p = travel <= 0 ? 0 : clamp01(-rect.top / travel);
        // WindowHero'daki canvas çerçevenin adaya vardığı an (m=1 → q=0,88) ve onun sönmesi (0,90–0,96).
        show = smooth(0.88, 0.94, progress(p));
      }
      const key = show.toFixed(3);
      if (key === last) return;
      last = key;
      ring.style.opacity = key;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const measure = () => {
      const inset = readSafeTop();
      hasIsland = inset >= ISLAND.MIN_INSET;
      ring.style.display = hasIsland ? "block" : "none";
      ring.style.top = `${inset - ISLAND.INSET_TO_TOP}px`;
      last = "";
      schedule();
    };

    measure();
    // WebView güvenli alanı ilk kareden sonra bildirebilir; birkaç kez yeniden ölç.
    const retries = [150, 600, 1500, 3500].map((ms) => window.setTimeout(measure, ms));
    const onVisible = () => {
      if (document.visibilityState === "visible") measure();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.addEventListener("pageshow", measure);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("wangoh:hero", schedule);
    return () => {
      retries.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("pageshow", measure);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("wangoh:hero", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="island-frame"
      style={{ display: "none", opacity: 0, transform: "translate3d(-50%,0,0)" }}
    />
  );
}
