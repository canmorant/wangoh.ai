"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { countries, Country, ORIGIN } from "@/data/destinations";
import BoardingPass from "./BoardingPass";
import { EASE_OUT } from "@/lib/motion";

interface Props {
  onSelectCountry: (country: Country) => void;
}

export default function DestinationsSection({ onSelectCountry }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const [boardingCode, setBoardingCode] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = [
    useTransform(scrollYProgress, [0, 1], [30, -30]),
    useTransform(scrollYProgress, [0, 1], [70, -70]),
    useTransform(scrollYProgress, [0, 1], [6, -6]),
  ];

  // Stamp the pass, let it land, then hand off to the flight.
  const board = (c: Country) => {
    if (boardingCode) return;
    setBoardingCode(c.code);
    setTimeout(() => {
      setBoardingCode(null);
      onSelectCountry(c);
    }, 900);
  };

  return (
    <section
      ref={ref}
      id="destinations"
      className="relative px-4 py-24 sm:px-10 sm:py-40"
      style={{ background: "linear-gradient(180deg,#06090f 0%,#0a0e1a 46%,#080b14 100%)" }}
    >
      <div className="relative mx-auto max-w-[1360px]">
        <header className="mb-14 flex flex-col gap-7 sm:mb-24 sm:gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="mb-5 flex items-center gap-3 text-[11px] tracking-[0.42em] text-white/40 uppercase"
            >
              <span className="inline-block h-px w-8 bg-white/20" />
              Kalkış &middot; {ORIGIN.iata}
            </motion.p>

            <h2 className="font-display text-[clamp(2.5rem,5.6vw,4.4rem)] leading-[1.02] text-white">
              {["Biniş kartları.", "Biri senin."].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={i === 1 ? "block italic text-white/55" : "block"}
                    initial={{ y: "110%" }}
                    animate={inView ? { y: "0%" } : {}}
                    transition={{ duration: 1.15, ease: EASE_OUT, delay: 0.08 + i * 0.09 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 }}
            className="max-w-[19rem] text-[14px] leading-relaxed text-white/40"
          >
            Her rota İstanbul’dan kalkıyor. Ayrıntılar için kartı çevir,
            sonra istediğine bin.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
          {countries.map((country, i) => (
            <motion.div
              key={country.code}
              style={{ y: drift[i % 3] }}
              initial={{ opacity: 0, y: 54, rotate: i % 2 ? -1.5 : 1.5 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 + i * 0.09 }}
            >
              <BoardingPass
                country={country}
                boarding={boardingCode === country.code}
                onSelect={() => board(country)}
              />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 1 }}
          className="mt-20 text-center text-[11px] tracking-[0.34em] text-white/20 uppercase sm:mt-28"
        >
          Her rota basılı değil
        </motion.p>
      </div>
    </section>
  );
}
