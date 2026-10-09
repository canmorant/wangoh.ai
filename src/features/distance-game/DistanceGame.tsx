"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Intro } from "./IntroScreen";
import { Playing } from "./PlayScreen";
import { Results } from "./ResultsScreen";
import { ACCENT } from "./ui";
import { useDistanceGame } from "./useDistanceGame";

/**
 * "Kaç kilometre?" — iki şehir arasındaki mesafeyi logaritmik kaydırıcıyla
 * tahmin etme oyunu. Tamamen çevrimdışı: şehir verisi bu sayfanın paketinde,
 * cevap haritasının dünya verisi oyun sayfasında dinamik yüklenen ayrı bir parça;
 * hiçbir ağ isteği yok (bayrak görseli bile kullanılmıyor).
 *
 * İki mod: Serbest ve Günün Turu (aynı yerel gün için herkese aynı 10 tur; günde
 * bir resmî puan, seri). Ekranlar: IntroScreen, PlayScreen (tahmin + cevap haritası),
 * ResultsScreen (paylaş).
 *
 * Sunucudan gelen iki küçük harita (page.tsx):
 *   countryNames  ISO2 → o dildeki ülke adı
 *   guideLinks    "ISO2:veri adı" → şehir rehberinin iç yolu (rehberi olanlar;
 *                 anahtarları soru seçiminde A kademesinin bir kuralı)
 *   guideNames    "ISO2:veri adı" → sitedeki Türkçe şehir adı (Türkçe arayüzde
 *                 ekranda bu görünür)
 */
type Props = {
  countryNames: Record<string, string>;
  guideLinks: Record<string, string>;
  guideNames: Record<string, string>;
};

export default function DistanceGame({ countryNames, guideLinks, guideNames }: Props) {
  const guided = useMemo(() => new Set(Object.keys(guideLinks)), [guideLinks]);
  const g = useDistanceGame(guided);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [g.screen]);

  // Ekran yazı tipinin (Instrument Serif) Türkçe/Orta Avrupa harfli parçasını sayfa
  // açılırken, bağlantı varken indir. Aksi hâlde oyun sırasında ilk "Ş", "ı" ya da
  // "ł" görününce tarayıcı yazı tipini ağdan ister; çevrimdışıyken bu istek
  // başarısız olur ve harf yedek yazı tipiyle çizilir.
  useEffect(() => {
    try {
      void document.fonts?.load('400 1em "Instrument Serif"', "ŞşĞğİıŁłŃńĆćŚśŹźŻżĐđŐőŰű").catch(() => {});
    } catch {
      /* yazı tipi API'si yoksa sorun değil */
    }
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#06090f]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${ACCENT}1f 0%, transparent 62%)` }}
      />
      {/* Ekran geçişleri yalnız giriş animasyonu (çıkış yok): çıkış takılırsa oyuncu boş
          ekrana bakmasın. Animasyonlar CSS (globals.css dg-*), yalnız opacity/transform. */}
      <div className="dg-shell relative mx-auto flex min-h-[100svh] flex-col">
        {g.screen === "intro" && <Intro key="intro" g={g} />}
        {g.screen === "playing" && g.round && (
          <Playing key="playing" g={g} countryNames={countryNames} guideLinks={guideLinks} guideNames={guideNames} />
        )}
        {g.screen === "results" && <Results key="results" g={g} countryNames={countryNames} guideNames={guideNames} />}
        <Credit />
      </div>
    </main>
  );
}

/** GeoNames verisinin atfı (CC BY 4.0): sayfanın altında, her ekranda. */
function Credit() {
  const t = useTranslations("DistanceGame");
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
      })}
    </p>
  );
}
