"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Country, City } from "@/data/destinations";
import { citySlug, countrySlug, guideFor } from "@/content/guides";

interface CityCardsProps {
  country: Country;
  onBack: () => void;
}

export default function CityCards({ country, onBack }: CityCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="group flex items-center gap-2 text-white/50 hover:text-[var(--gold)] transition-colors mb-12 cursor-pointer"
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
          className="text-center mb-16"
        >
          <span className="text-5xl mb-4 block">{country.flag}</span>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">{country.name} rotasını keşfet</h2>
          <p className="text-white/50 max-w-lg mx-auto">{country.description}</p>
        </motion.div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

function CityCard({ city, country }: { city: City; country: Country }) {
  const ready = !!guideFor(country.code, city.name);
  return (
    <Link
      href={`/${countrySlug(country)}/${citySlug(city)}`}
      className="group relative block h-[320px] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-[1.03] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
