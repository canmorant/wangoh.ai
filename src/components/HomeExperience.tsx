"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { countries, type Country } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { slugify } from "@/lib/slug";
import { useScrollShake } from "@/hooks/useScrollShake";
import FloatingNav from "@/components/FloatingNav";
import SecretRoute from "@/components/SecretRoute";
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
const hrefFor = (country: Country) => `/${slugify(country.name)}`;
const countryAtPath = (pathname: string): Country | null => {
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return slug ? (ROUTABLE.find((c) => slugify(c.name) === slug) ?? null) : null;
};

export default function HomeExperience({ guideLinks }: { guideLinks: ReactNode }) {
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
    const href = hrefFor(country);
    if (window.location.pathname !== href) window.history.pushState(null, "", href);
  }, []);

  const handleFlightComplete = useCallback(() => {
    setView("cities");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCountry(null);
    setView("landing");
    // history.back() değil: Portekiz'den sonra Japonya'ya uçulduysa geri gitmek
    // Portekiz'i açardı. "Tüm rotalar" her zaman ana sayfaya dönmeli.
    if (window.location.pathname !== "/") window.history.pushState(null, "", "/");
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

  // Deep link from the travel test: /?fly=JP
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("fly");
    if (!code) return;
    const match = countries.find((c) => c.code === code);
    const timer = match ? window.setTimeout(() => flyTo(match), 0) : null;
    window.history.replaceState({}, "", "/");
    return () => {
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [flyTo]);

  // The hidden route. Only armed on the landing view — firing it mid-flight
  // would fight the animation that's already running. `charge` rises as the
  // user shakes, so the interface acknowledges the gesture before it fires.
  const charge = useScrollShake(() => setSecretOpen(true), {
    enabled: view === "landing" && !secretOpen && !clubOpen && !wheelOpen,
  });

  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      <AdSenseScript />
      <FloatingNav
        onHome={handleBack}
        onSelectCountry={flyTo}
        actions={[
          { label: "Testler", href: "/tests" },
          { label: "Rastgele Futbol Kulübü", onClick: openClubReveal },
          { label: "Ülke Çarkı", onClick: openWheel },
          { label: "Bayrağı Bil", href: "/flags" },
        ]}
      />

      {/* Shake feedback: the frame tightens as the gesture is recognised, so
          the interaction is discoverable instead of silent until it fires. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] transition-opacity duration-200"
        style={{
          opacity: charge,
          boxShadow: `inset 0 0 ${60 + charge * 140}px ${10 + charge * 40}px rgba(120,190,255,${
            0.05 + charge * 0.16
          })`,
        }}
      />

      {view === "flying" && selectedCountry && (
        <FlightAnimation country={selectedCountry} onComplete={handleFlightComplete} />
      )}

      {view === "landing" && (
        <>
          <h1 className="sr-only">Şehir Şehir Gezi Rehberleri — Wangoh</h1>
          <ResponsiveHero />
          {guideLinks}
          <DestinationsSection onSelectCountry={flyTo} />
          <SiteFooter />
        </>
      )}

      {view === "cities" && selectedCountry && (
        <>
          <CityCards country={selectedCountry} onBack={handleBack} />
          <SiteFooter />
        </>
      )}

      <SecretRoute open={secretOpen} onClose={closeSecret} onFly={flyTo} />
      {clubRequested && <ClubReveal open={clubOpen} onClose={closeClub} onFly={flyTo} />}
      {wheelRequested && <CountryWheel open={wheelOpen} onClose={closeWheel} onFly={flyTo} />}
    </main>
  );
}
