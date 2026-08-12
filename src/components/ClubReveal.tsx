"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { countries, Country } from "@/data/destinations";
import { clubs } from "@/data/clubs";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";

/**
 * Rastgele futbol kulübü çekilişi.
 *
 * Daha önce bu bileşen hem ülke hem kulüp modunu barındırıyordu; "Rastgele
 * Ülke" özelliği Ülke Çarkı ile aynı işi yaptığı için kaldırıldı ve burada
 * yalnızca kulüp akışı kaldı.
 *
 * Çark yavaşlayarak durur — anında sonuç göstermek, çekiliş hissini yok eder.
 */
export default function ClubReveal({
  open,
  onClose,
  onFly,
}: {
  open: boolean;
  onClose: () => void;
  onFly: (c: Country) => void;
}) {
  const [index, setIndex] = useState(0);
  const [settled, setSettled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const resetTimer = setTimeout(() => setSettled(false), 0);

    const target = Math.floor(Math.random() * clubs.length);
    const total = clubs.length * 2 + target + 6;
    let step = 0;

    const advance = () => {
      setIndex((i) => (i + 1) % clubs.length);
      step += 1;
      if (step >= total) {
        setIndex(target);
        setSettled(true);
        return;
      }
      // Aralık kübik olarak açılır: 55ms → ~320ms
      const t = step / total;
      timer.current = setTimeout(advance, 55 + Math.pow(t, 3) * 265);
    };

    timer.current = setTimeout(advance, 55);
    return () => {
      clearTimeout(resetTimer);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const club = clubs[index];
  const clubCountry = club ? countries.find((c) => c.code === club.countryCode) ?? null : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_SOFT }}
        >
          <button
            aria-label="Kapat"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#05070c]/90 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-8 text-center backdrop-blur-2xl sm:p-10"
          >
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 h-48 blur-3xl"
              animate={{
                background: `radial-gradient(ellipse at 50% 50%, ${club?.accent ?? "#c8a45e"}, transparent 70%)`,
                opacity: settled ? 0.32 : 0.14,
              }}
              transition={{ duration: 0.9, ease: EASE_SOFT }}
            />

            <p className="relative text-[10.5px] tracking-[0.46em] text-white/40 uppercase">
              Rastgele kulüp
            </p>

            <div className="relative mt-7 min-h-[7.5rem]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: settled ? 18 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: settled ? -18 : -8 }}
                  transition={{ duration: settled ? 0.55 : 0.12, ease: EASE_OUT }}
                >
                  <span
                    className="mx-auto block h-1 w-12 rounded-full"
                    style={{ background: club?.accent }}
                  />
                  <h3 className="font-display mt-4 text-[1.95rem] leading-[1.1] text-white">
                    {club?.name}
                  </h3>
                  <p className="mt-2 text-[11px] tracking-[0.22em] text-white/45 uppercase">
                    {club?.league}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: settled ? 1 : 0, y: settled ? 0 : 10 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: settled ? 0.15 : 0 }}
              className="relative"
            >
              <p className="mt-1 text-[13px] leading-relaxed text-white/50">
                {club?.stadium}
                <span className="mx-2 text-white/20">·</span>
                {club?.city}
              </p>

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  disabled={!settled}
                  onClick={() => clubCountry && onFly(clubCountry)}
                  className="rounded-full bg-white px-6 py-3 text-[12px] font-medium tracking-[0.16em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] disabled:pointer-events-none disabled:opacity-40"
                >
                  {club ? `${club.city}'e uç` : "Uç"}
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full border border-white/12 px-6 py-3 text-[12px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-500 hover:border-white/30 hover:text-white"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
