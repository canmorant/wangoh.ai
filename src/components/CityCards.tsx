"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Country, City } from "@/data/destinations";
import { citySlug, countrySlug, guideFor } from "@/content/guides";
import { countryHubFor } from "@/content/countryHubs";

interface CityCardsProps {
  country: Country;
  onBack: () => void;
}

export default function CityCards({ country, onBack }: CityCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hub = countryHubFor(country.code);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="group mb-10 flex min-h-11 items-center gap-2 text-white/50 transition-colors hover:text-[var(--gold)] sm:mb-12"
          aria-label="Ülkelere dön"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-sm tracking-wider uppercase">Tüm Rotalar</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="text-5xl mb-4 block">{country.flag}</span>
          <h1 className="mb-4 text-[clamp(2.1rem,10vw,3rem)] font-light leading-tight text-white">{country.name} rotasını keşfet</h1>
          <p className="text-white/50 max-w-lg mx-auto">{country.description}</p>
        </motion.div>

        {hub && country.cities.length > 0 && (
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="mb-12 overflow-hidden rounded-[24px] border border-white/[0.09] bg-white/[0.025] sm:mb-14 sm:rounded-[26px]"
            aria-labelledby={`${country.code.toLowerCase()}-overview-title`}
          >
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)] lg:gap-12 lg:p-10">
              <div>
                <p className="flex items-center gap-3 text-[10px] tracking-[0.28em] text-[var(--gold)]/75 uppercase">
                  <span className="inline-block h-px w-7 bg-[var(--gold)]/35" />
                  {country.name} gezi rehberi
                </p>
                <h2
                  id={`${country.code.toLowerCase()}-overview-title`}
                  className="font-display mt-4 text-[clamp(1.7rem,3.3vw,2.35rem)] leading-tight text-white"
                >
                  {country.name} hakkında kısa bilgiler
                </h2>
                <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.8] text-white/60">
                  {hub.cityGridIntro}
                </p>
                <Link
                  href={`/${countrySlug(country)}`}
                  className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] text-[var(--gold)] uppercase transition-colors hover:text-white"
                >
                  Ayrıntılı ülke rehberini oku
                  <span aria-hidden>→</span>
                </Link>
              </div>

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.07] self-start">
                <OverviewFact label="Başkent" value={country.capital} />
                <OverviewFact label="Bütçe" value={country.budget} />
                <OverviewFact label="En iyi dönem" value={country.bestSeason} />
                <OverviewFact
                  label={country.code === "TR" ? "Ulaşım" : "İstanbul'dan"}
                  value={country.code === "TR" ? "Rotaya göre" : country.flightTime}
                />
              </dl>
            </div>
          </motion.article>
        )}

        {/* Countries reached from the wheel have no curated guide. Say so
            plainly rather than rendering an empty grid. */}
        {country.cities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-md rounded-[22px] border border-white/[0.08] bg-white/[0.03] px-8 py-12 text-center backdrop-blur-xl"
          >
            <span className="text-4xl">{country.flag}</span>
            <h3 className="font-display mt-4 text-2xl text-white">
              Haritanın dışına indin
            </h3>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">
              {country.name} için henüz bir rehber yazmadık. Rota gerçek,
              varıştan sonrası sana kalmış.
            </p>
            <button
              onClick={onBack}
              className="mt-7 rounded-full bg-white px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
            >
              Kalkışlara dön
            </button>
          </motion.div>
        )}

        {country.cities.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.28em] text-white/35 uppercase">Şehir rehberleri</p>
            <h2 className="font-display mt-3 text-[clamp(1.7rem,3.4vw,2.35rem)] text-white">
              {hub?.citiesHeading ?? `${country.name}'da gezilecek şehirler`}
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-white/45">
              {country.cities.length} özgün rota arasından sana en uygun şehri seç.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {country.cities.map((city, i) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <CityCard city={city} country={country} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function OverviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-[#0a0e18] px-4 py-4 sm:px-5 sm:py-5">
      <dt className="text-[9px] tracking-[0.2em] text-white/35 uppercase">{label}</dt>
      <dd className="mt-1.5 break-words text-[12.5px] leading-snug text-white/80">{value}</dd>
    </div>
  );
}

function CityCard({ city, country }: { city: City; country: Country }) {
  const ready = !!guideFor(country.code, city.name);
  return (
    <Link
      href={`/${countrySlug(country)}/${citySlug(city)}`}
      className="group relative block h-[280px] cursor-pointer overflow-hidden rounded-2xl transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:h-[320px]"
      aria-label={`${city.name} gezi rehberini aç`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${city.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/15 transition-all duration-500" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-light text-white mb-1">{city.name}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{city.description}</p>
        <div className="mt-3 flex items-center gap-2 text-[var(--gold)] text-xs tracking-wider uppercase opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <span>{ready ? "Rehberi oku" : "Rehbere git"}</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)]/0 to-transparent group-hover:via-[var(--gold)]/60 transition-all duration-500" />
    </Link>
  );
}
