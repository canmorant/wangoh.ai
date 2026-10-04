"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { countries, type Country } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { slugify } from "@/lib/slug";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import type { CityCardData } from "@/content/cityCardData";
import { detectOrigin } from "@/hooks/useFlightOrigin";
import FloatingNav from "@/components/FloatingNav";
import SecretRoute from "@/components/SecretRoute";
import ShakeFeedback from "@/components/ShakeFeedback";
import SiteFooter from "@/components/SiteFooter";
import AdSenseScript from "@/components/AdSenseScript";

import DestinationsSection from "@/components/DestinationsSection";

const FlightAnimation = dynamic(() => import("@/components/FlightAnimation"), { ssr: false });
const CityCards = dynamic(() => import("@/components/CityCards"), { ssr: false });
const ClubReveal = dynamic(() => import("@/components/ClubReveal"), { ssr: false });
const CountryWheel = dynamic(() => import("@/features/country-wheel/CountryWheel"), {
  ssr: false,
});
const ResponsiveHero = dynamic(() => import("@/components/ResponsiveHero"));

type View = "landing" | "flying" | "cities";

/**
 * Ülke görünümünün adresi.
 *
 * Seçilen ülkenin şehir görünümü eskiden yalnızca React state'iydi: adres
 * çubuğu wangoh.com'da kalıyordu. Paylaşılamıyor, yer imine eklenemiyor,
 * yenileyince kayboluyordu ve geri tuşu siteden çıkarıyordu.
 *
 * Artık uçuş başlarken adres /portekiz oluyor — sitenin zaten var olan, sunucu
 * tarafında üretilen ülke sayfasının adresi. Yenilenirse ya da paylaşılırsa o
 * tam sayfa açılıyor.
 *
 * slugify burada bilerek doğrudan kullanılıyor, @/content/guides'tan
 * countrySlug değil: o modül 71 rehberin tamamını içeri çekiyor ve bu bileşen
 * ana sayfanın ilk yüklemesinde. Oradan import etmek ~1.8 MB'ı açılışa taşırdı.
 */
const ROUTABLE: Country[] = [...countries, SECRET_DESTINATION];

/**
 * Dil farkında: tr → /japonya, en → /en/japonya. Slug her dilde aynı ve
 * Türkçe addan geliyor — ülke adlarının yerelleştirilmiş görünen hâli bunu
 * değiştirmez (bkz. lib/countryNames).
 */
const hrefFor = (country: Country, locale: AppLocale) =>
  getPathname({ href: `/${slugify(country.name)}`, locale });

const countryAtPath = (pathname: string): Country | null => {
  const parts = pathname.split("/").filter(Boolean);
  // Varsa dil önekini at: /en/japonya → japonya
  if (parts.length && (routing.locales as readonly string[]).includes(parts[0])) parts.shift();
  const slug = parts.join("/");
  return slug ? (ROUTABLE.find((c) => slugify(c.name) === slug) ?? null) : null;
};

export default function HomeExperience({
  guideLinks,
  cityCardData,
}: {
  guideLinks: ReactNode;
  cityCardData: CityCardData;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [view, setView] = useState<View>("landing");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [secretOpen, setSecretOpen] = useState(false);
  const [clubOpen, setClubOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [clubRequested, setClubRequested] = useState(false);
  const [wheelRequested, setWheelRequested] = useState(false);

  const flyTo = useCallback((country: Country) => {
    setSecretOpen(false);
    setClubOpen(false);
    setWheelOpen(false);
    setSelectedCountry(country);
    const skipHeavyFlight = window.matchMedia(
      "(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)"
    ).matches;
    setView(skipHeavyFlight ? "cities" : "flying");
    if (skipHeavyFlight) window.scrollTo({ top: 0, behavior: "instant" });

    // Uçuş başlarken adres de değişsin; böylece animasyon sırasında geri tuşuna
    // basan da ana sayfaya döner, siteden çıkmaz. Next bu çağrıyı kendi
    // router'ına entegre ediyor (sayfayı yeniden yüklemiyor).
    //
    // Çarktan gelen, rehberi olmayan ülkelerin (ör. Barbados) sunucuda bir
    // sayfası yok: adresleri yenilenince ya da paylaşılınca 404 olurdu. Onlar
    // için adres ana sayfa kalır; geri tuşu yine ana sayfaya döner.
    const routable = ROUTABLE.includes(country);
    const href = routable ? hrefFor(country, locale) : getPathname({ href: "/", locale });
    if (window.location.pathname !== href || !routable) window.history.pushState(null, "", href);
  }, [locale]);

  const handleFlightComplete = useCallback(() => {
    setView("cities");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCountry(null);
    setView("landing");
    // history.back() değil: Portekiz'den sonra Japonya'ya uçulduysa geri gitmek
    // Portekiz'i açardı. "Tüm rotalar" her zaman ana sayfaya dönmeli.
    const home = getPathname({ href: "/", locale });
    if (window.location.pathname !== home) window.history.pushState(null, "", home);
  }, [locale]);

  // Uçuşun kalkış noktası (yaklaşık konum) ziyaretçi bir ülke seçmeden,
  // sayfa boştayken sorulur; animasyon başladığında hazır olur. Ağır uçuş
  // animasyonunu görmeyen cihazlarda (mobil, azaltılmış hareket) sorulmaz.
  useEffect(() => {
    const flies = !window.matchMedia(
      "(max-width: 768px), (pointer: coarse), (prefers-reduced-motion: reduce)"
    ).matches;
    if (!flies) return;
    const timer = window.setTimeout(() => void detectOrigin(), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  // Tarayıcının geri/ileri tuşları: adres neyse onu göster.
  useEffect(() => {
    const onPopState = () => {
      const country = countryAtPath(window.location.pathname);
      if (country) {
        setSelectedCountry(country);
        setView("cities");
        window.scrollTo({ top: 0, behavior: "instant" });
      } else {
        setSelectedCountry(null);
        setView("landing");
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Stable identities. Inline arrows here previously re-created these on every
  // render, which reset the wheel mid-spin via its own effect deps.
  const closeWheel = useCallback(() => setWheelOpen(false), []);
  const openWheel = useCallback(() => {
    setWheelRequested(true);
    setWheelOpen(true);
  }, []);
  const closeSecret = useCallback(() => setSecretOpen(false), []);
  const closeClub = useCallback(() => setClubOpen(false), []);
  const openClubReveal = useCallback(() => {
    setClubRequested(true);
    setClubOpen(true);
  }, []);

  // Deep links: /?fly=JP from the travel test, /?open=club|wheel from the
  // menu on the other pages (those layers only exist on the home page).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("fly");
    const open = params.get("open");
    if (!code && !open) return;
    const match = code ? countries.find((c) => c.code === code) : undefined;
    const timer = window.setTimeout(() => {
      if (match) flyTo(match);
      else if (open === "club") openClubReveal();
      else if (open === "wheel") openWheel();
    }, 0);
    window.history.replaceState({}, "", getPathname({ href: "/", locale }));
    return () => window.clearTimeout(timer);
  }, [flyTo, locale, openClubReveal, openWheel]);

  // The hidden route. Only armed on the landing view — firing it mid-flight
  // would fight the animation that's already running.
  const openSecret = useCallback(() => setSecretOpen(true), []);

  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      <AdSenseScript />
      <FloatingNav
        onHome={handleBack}
        onSelectCountry={flyTo}
        actions={[
          { label: t("Nav.tests"), href: "/tests" },
          { label: t("Nav.randomClub"), onClick: openClubReveal },
          { label: t("Nav.countryWheel"), onClick: openWheel },
          { label: t("Nav.guessFlag"), href: "/flags" },
        ]}
      />

      {/* Shake feedback: the edges glow as the gesture is recognised, so the
          interaction is discoverable instead of silent until it fires. */}
      <ShakeFeedback
        enabled={view === "landing" && !secretOpen && !clubOpen && !wheelOpen}
        onShake={openSecret}
      />

      {view === "flying" && selectedCountry && (
        <FlightAnimation country={selectedCountry} onComplete={handleFlightComplete} />
      )}

      {view === "landing" && (
        <>
          <h1 className="sr-only">{t("Home.srTitle")}</h1>
          <ResponsiveHero />
          {guideLinks}
          <DestinationsSection onSelectCountry={flyTo} />
          <SiteFooter />
        </>
      )}

      {view === "cities" && selectedCountry && (
        <>
          <CityCards country={selectedCountry} data={cityCardData} onBack={handleBack} />
          <SiteFooter />
        </>
      )}

      <SecretRoute open={secretOpen} onClose={closeSecret} onFly={flyTo} />
      {clubRequested && <ClubReveal open={clubOpen} onClose={closeClub} onFly={flyTo} />}
      {wheelRequested && <CountryWheel open={wheelOpen} onClose={closeWheel} onFly={flyTo} />}
    </main>
  );
}
