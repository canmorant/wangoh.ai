"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import WindowHero from "./WindowHero";

/**
 * İki sahne, aynı hikâye: kaydırdıkça kamera uçak penceresinden geçip
 * Central Park'a iner.
 *
 *   - Masaüstü (ince işaretçi, geniş ekran): CinematicHero — bulutlar, odak
 *     yığını, perde, SVG kabin.
 *   - Telefon ve tablet: WindowHero — kaydırmada hiçbir şeyi yeniden
 *     çizdirmeyen, yalnız transform/opacity ile çalışan hafif sahne.
 *     CinematicHero iPhone 16'da bile takılıyordu (bkz. WindowHero).
 *
 * Sunucu çıktısında ve masaüstü sahnesi yüklenene kadar WindowHero görünür;
 * ikisinin yüksekliği aynı, geçişte sayfa kaymaz.
 */
const CinematicHero = dynamic(() => import("./CinematicHero"), {
  ssr: false,
  loading: () => <WindowHero />,
});

const DESKTOP = "(min-width: 769px) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const isDesktop = () => window.matchMedia(DESKTOP).matches;

export default function ResponsiveHero() {
  const desktop = useSyncExternalStore(subscribe, isDesktop, () => false);
  return desktop ? <CinematicHero /> : <WindowHero />;
}
