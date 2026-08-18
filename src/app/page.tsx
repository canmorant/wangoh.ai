"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { countries, type Country } from "@/data/destinations";
import { useScrollShake } from "@/hooks/useScrollShake";
import FloatingNav from "@/components/FloatingNav";
import SecretRoute from "@/components/SecretRoute";

import DestinationsSection from "@/components/DestinationsSection";

const CinematicHero = dynamic(() => import("@/components/CinematicHero"), { ssr: false });
const FlightAnimation = dynamic(() => import("@/components/FlightAnimation"), { ssr: false });
const CityCards = dynamic(() => import("@/components/CityCards"), { ssr: false });
const ClubReveal = dynamic(() => import("@/components/ClubReveal"), { ssr: false });
const CountryWheel = dynamic(() => import("@/features/country-wheel/CountryWheel"), {
  ssr: false,
});

type View = "landing" | "flying" | "cities";

export default function Home() {
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
    setView("flying");
  }, []);

  const handleFlightComplete = useCallback(() => {
    setView("cities");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCountry(null);
    setView("landing");
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
          <h1 className="sr-only">Hiç gitmediğin bir yere var</h1>
          <CinematicHero />
          <DestinationsSection onSelectCountry={flyTo} />
          <Footer />
        </>
      )}

      {view === "cities" && selectedCountry && (
        <>
          <CityCards country={selectedCountry} onBack={handleBack} />
          <Footer />
        </>
      )}

      <SecretRoute open={secretOpen} onClose={closeSecret} onFly={flyTo} />
      {clubRequested && <ClubReveal open={clubOpen} onClose={closeClub} onFly={flyTo} />}
      {wheelRequested && <CountryWheel open={wheelOpen} onClose={closeWheel} onFly={flyTo} />}
    </main>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-[13px] tracking-[0.34em] text-white/30 uppercase">Wangoh</div>
        <p className="text-[12px] text-white/20">
          &copy; {new Date().getFullYear()} Wangoh. Tüm hakları saklıdır. Görseller Unsplash&rsquo;ten.
        </p>
      </div>
    </footer>
  );
}
