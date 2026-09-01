"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CinematicHero = dynamic(() => import("./CinematicHero"), { ssr: false });

type HeroMode = "pending" | "mobile" | "desktop";

/**
 * Telefonlarda tam sinematik sahnenin çok sayıda büyük kompozit katmanını hiç
 * oluşturmuyoruz. İlk ekran aynı cam-kenarı dilini tek fotoğraf ve CSS ile
 * koruyor; masaüstü cihazlar mevcut animasyonun tamamını almaya devam ediyor.
 */
export default function ResponsiveHero() {
  const [mode, setMode] = useState<HeroMode>("pending");

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 769px) and (pointer: fine)");
    const update = () => setMode(desktop.matches ? "desktop" : "mobile");
    update();
    desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, []);

  if (mode === "desktop") return <CinematicHero />;

  return <LightweightHero reserveDesktopHeight={mode === "pending"} />;
}

function LightweightHero({ reserveDesktopHeight }: { reserveDesktopHeight: boolean }) {
  return (
    <section
      className={`relative overflow-hidden bg-[#0b0d12] ${
        reserveDesktopHeight ? "h-[100svh] md:h-[310vh]" : "h-[100svh]"
      }`}
      aria-label="Wangoh seyahat keşfi"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-[center_62%]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1200&q=72&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,22,0.5)_0%,rgba(8,12,22,0.08)_38%,rgba(6,9,16,0.82)_100%)]" />

        <div
          aria-hidden
          className="absolute left-1/2 top-[43%] h-[43vh] max-h-[410px] min-h-[290px] w-[58vw] min-w-[210px] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[44%] border-[18px] border-[#e6e6e2] shadow-[0_0_0_12px_rgba(172,173,171,0.95),0_0_0_999px_rgba(12,14,19,0.58),0_18px_45px_rgba(0,0,0,0.45)]"
        >
          <span className="absolute inset-0 rounded-[38%] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),transparent_38%)]" />
        </div>

        <div className="absolute bottom-0 left-0 z-10 max-w-[88vw] px-5 pb-[calc(2rem_+_env(safe-area-inset-bottom))]">
          <p className="font-display text-[clamp(2.75rem,13vw,4.9rem)] leading-[0.9] text-white">
            <span className="block italic font-light text-white/95">Hiç</span>
            <span className="block">gitmediğin</span>
            <span className="block">bir yere var</span>
          </p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/55">
            Dünyanın en güzel şehirlerine açılan bir cam kenarı. Unutulmaz rotalar,
            büyüleyici duraklar ve kesintisiz tek bir manzara.
          </p>
        </div>
      </div>
    </section>
  );
}
