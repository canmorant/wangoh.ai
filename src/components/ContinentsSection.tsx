"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { countries } from "@/data/destinations";
import { homeCountriesOf, REGION_NAME_KEY, REGIONS, type Region } from "@/data/continents";
import { EASE_OUT } from "@/lib/motion";

/**
 * Uygulamanın ana sayfa kıta seçimi: dört kart, tek ekranda. Karta dokununca o
 * kıtanın ülkelerine geçilir (HomeExperience "continent" görünümü). Web sitesi
 * eski ülke listesini kullanmaya devam ediyor; bu bileşen yalnız uygulama paketinde.
 *
 * Kartın fotoğrafı, kıtayı temsil eden ülkenin kendi görseli (yeni görsel yok,
 * çevrimdışı paketteki dosyalar).
 */
const COVER_COUNTRY: Record<Region, string> = { europe: "IT", asia: "JP", americas: "US", africa: "EG" };

const cardImage = (region: Region): string => {
  const own = countries.find((c) => c.code === COVER_COUNTRY[region]) ?? homeCountriesOf(region)[0];
  return own.image;
};

export default function ContinentsSection({ onSelect }: { onSelect: (region: Region) => void }) {
  const t = useTranslations("Continents");
  const tr = useTranslations("Regions");

  return (
    <section
      id="continents"
      aria-labelledby="continents-title"
      className="relative flex min-h-[100svh] flex-col px-4 pt-14 pb-[calc(1.25rem_+_env(safe-area-inset-bottom))]"
      style={{ background: "linear-gradient(180deg,#06090f 0%,#0a0e1a 55%,#080b14 100%)" }}
    >
      <header className="mb-6 max-w-md">
        <p className="mb-3 flex items-center gap-3 text-[10.5px] tracking-[0.38em] text-white/45 uppercase">
          <span className="inline-block h-px w-7 bg-white/25" />
          {t("eyebrow")}
        </p>
        <h2 id="continents-title" className="font-display text-[clamp(2.1rem,9.5vw,3rem)] leading-[1.03] text-white">
          {t("title")}
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">{t("intro")}</p>
      </header>

      <div className="grid min-h-[26rem] flex-1 grid-cols-2 grid-rows-2 gap-3">
        {REGIONS.map((region, i) => {
          const list = homeCountriesOf(region);
          const name = tr(REGION_NAME_KEY[region]);
          return (
            <motion.button
              key={region}
              type="button"
              onClick={() => onSelect(region)}
              aria-label={`${name}, ${t("countries", { count: list.length })}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.08 }}
              whileTap={{ scale: 0.97 }}
              className="group relative isolate flex min-h-0 flex-col justify-between overflow-hidden rounded-[26px] border border-white/[0.1] p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Image
                src={cardImage(region)}
                alt=""
                fill
                sizes="50vw"
                className="-z-20 object-cover transition-transform duration-700 group-active:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,9,15,0.18)_0%,rgba(6,9,15,0.34)_38%,rgba(6,9,15,0.88)_100%)]"
              />

              <span aria-hidden className="flex gap-1 text-[1.15rem] leading-none drop-shadow">
                {list.slice(0, 4).map((c) => (
                  <span key={c.code}>{c.flag}</span>
                ))}
              </span>

              <span className="flex items-end justify-between gap-2">
                <span className="min-w-0">
                  <span className="font-display block text-[clamp(1.5rem,7vw,2rem)] leading-[1.02] text-white [overflow-wrap:anywhere]">
                    {name}
                  </span>
                  <span className="mt-1.5 block text-[11px] tracking-[0.14em] text-white/65 uppercase">
                    {t("countries", { count: list.length })}
                  </span>
                </span>
                <ArrowUpRight aria-hidden className="mb-1 size-5 shrink-0 text-[var(--gold)]" strokeWidth={1.6} />
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
