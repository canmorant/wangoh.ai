"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Country } from "@/data/destinations";
import { homeCountriesOf, REGION_NAME_KEY, type Region } from "@/data/continents";
import { EASE_OUT } from "@/lib/motion";
import BoardingPass from "./BoardingPass";

/**
 * Uygulamada bir kıtanın ülkeleri (biniş kartları). DestinationsSection'ın web
 * sürümüyle aynı kartlar ve aynı biniş damgası geçişi; fark: yalnız seçilen
 * kıtanın ülkeleri ve "Tüm kıtalar" düğmesi.
 */
const PAGE = 8;

export default function ContinentView({
  region,
  onBack,
  onSelectCountry,
}: {
  region: Region;
  onBack: () => void;
  onSelectCountry: (country: Country) => void;
}) {
  const t = useTranslations("Continents");
  const tr = useTranslations("Regions");
  const td = useTranslations("Destinations");
  const list = homeCountriesOf(region);
  const [visible, setVisible] = useState(PAGE);
  const [boardingCode, setBoardingCode] = useState<string | null>(null);

  // Damgayı bas, kartın inmesine izin ver, sonra uçuşa/şehirlere geç.
  const board = (country: Country) => {
    if (boardingCode) return;
    setBoardingCode(country.code);
    setTimeout(() => {
      setBoardingCode(null);
      onSelectCountry(country);
    }, 900);
  };

  return (
    <section
      aria-labelledby="continent-title"
      className="relative min-h-[100svh] px-4 pt-[calc(env(safe-area-inset-top)_+_5.5rem)] pb-24"
      style={{ background: "linear-gradient(180deg,#06090f 0%,#0a0e1a 46%,#080b14 100%)" }}
    >
      <div className="mx-auto max-w-[1360px]">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[12px] tracking-[0.14em] text-white/80 uppercase transition-colors active:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {t("back")}
        </button>

        <header className="mb-10 max-w-md">
          <p className="mb-3 text-[10.5px] tracking-[0.38em] text-white/45 uppercase">{t("eyebrow")}</p>
          <h1 id="continent-title" className="font-display text-[clamp(2.4rem,11vw,3.6rem)] leading-[1.02] text-white">
            {tr(REGION_NAME_KEY[region])}
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">
            {t("countries", { count: list.length })} · {t("hint")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {list.slice(0, visible).map((country, i) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "80px" }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: Math.min(i, 3) * 0.06 }}
            >
              <BoardingPass
                country={country}
                boarding={boardingCode === country.code}
                onSelect={() => board(country)}
              />
            </motion.div>
          ))}
        </div>

        {visible < list.length && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => Math.min(v + PAGE, list.length))}
              className="min-h-12 rounded-full border border-white/15 bg-white/[0.07] px-7 text-[12px] font-medium tracking-[0.16em] text-white/80 uppercase transition-colors active:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {td("showMore")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
