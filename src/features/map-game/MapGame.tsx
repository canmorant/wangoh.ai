"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ACCENT } from "../distance-game/ui";
import { Intro } from "./IntroScreen";
import { Playing } from "./PlayScreen";
import { Results } from "./ResultsScreen";
import { useMapGame } from "./useMapGame";

/**
 * "Haritada Bul" — bir şehrin adı verilir, dünya küresinde yerini işaretlersin; gerçek yere
 * ne kadar yakınsan o kadar puan. Tamamen çevrimdışı: şehir verisi bu sayfanın paketinde,
 * küre ve dünya verisi oyun açılınca yüklenen ayrı bir parça; hiçbir ağ isteği yok.
 *
 * Kaç kilometre? ile aynı iskelet (Günün Turu, Serbest, seri, paylaşım); ortak mantık
 * features/distance-game altında (daily, feedback, share, ui, cities).
 *
 * Sunucudan gelen üç küçük harita (page.tsx): ülke adları, rehber bağlantıları, rehberli
 * şehirlerin sitedeki adları.
 */
type Props = {
  countryNames: Record<string, string>;
  guideLinks: Record<string, string>;
  guideNames: Record<string, string>;
};

export default function MapGame({ countryNames, guideLinks, guideNames }: Props) {
  const guided = useMemo(() => new Set(Object.keys(guideLinks)), [guideLinks]);
  const g = useMapGame(guided);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [g.screen]);

  // Ekran yazı tipinin (Instrument Serif) Türkçe/Orta Avrupa harfli parçasını sayfa açılırken indir:
  // çevrimdışıyken oyun sırasında ilk "Ş" ya da "ł" yedek yazı tipiyle çizilmesin.
  useEffect(() => {
    try {
      void document.fonts?.load('400 1em "Instrument Serif"', "ŞşĞğİıŁłŃńĆćŚśŹźŻżĐđŐőŰű").catch(() => {});
    } catch {
      /* yazı tipi API'si yoksa sorun değil */
    }
  }, []);

  // Küre parçasını (dünya verisiyle) bağlantı varken boşta indir; "Oyna"ya basınca hazır olsun.
  useEffect(() => {
    const preload = () => void import("./Globe").catch(() => {});
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(preload, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(preload, 800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#06090f]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${ACCENT}1f 0%, transparent 62%)` }}
      />
      <div className="dg-shell relative mx-auto flex min-h-[100svh] flex-col">
        {g.screen === "intro" && <Intro key="intro" g={g} />}
        {g.screen === "playing" && g.target && (
          <Playing key="playing" g={g} countryNames={countryNames} guideLinks={guideLinks} guideNames={guideNames} />
        )}
        {g.screen === "results" && <Results key="results" g={g} countryNames={countryNames} guideNames={guideNames} />}
        <Credit />
      </div>
    </main>
  );
}

/** GeoNames (şehirler) ve Natural Earth/world-atlas (harita) atfı: sayfanın altında, her ekranda. */
function Credit() {
  const t = useTranslations("MapGame");
  const link = (href: string) =>
    function CreditLink(chunks: ReactNode) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white/80"
        >
          {chunks}
        </a>
      );
    };
  return (
    <p className="mt-10 text-center text-[11px] tracking-[0.03em] text-white/60">
      {t.rich("dataCredit", {
        geo: link("https://www.geonames.org/"),
        cc: link("https://creativecommons.org/licenses/by/4.0/"),
        ne: link("https://www.naturalearthdata.com/"),
      })}
    </p>
  );
}
