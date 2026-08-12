"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Country } from "@/data/destinations";
import { SECRET_DESTINATION } from "@/data/secret";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";

/**
 * The payoff for shaking the scroll. Staged deliberately — signal, then
 * coordinates, then the name — so it reads as something uncovered rather than
 * a modal that appeared.
 */
export default function SecretRoute({
  open,
  onClose,
  onFly,
}: {
  open: boolean;
  onClose: () => void;
  onFly: (c: Country) => void;
}) {
  const [stage, setStage] = useState(0);
  const [lat, setLat] = useState(0);

  useEffect(() => {
    if (!open) {
      const resetFrame = requestAnimationFrame(() => {
        setStage(0);
        setLat(0);
      });
      return () => cancelAnimationFrame(resetFrame);
    }

    const timers = [
      setTimeout(() => setStage(1), 420),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2400),
    ];

    // Latitude spins up to 78.2232 while the readout is on screen.
    const target = SECRET_DESTINATION.coordinates.lat;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start - 420) / dur);
      if (t > 0) setLat(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_SOFT }}
        >
          {/* backdrop */}
          <motion.button
            aria-label="Kapat"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#05070c]/88 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* aurora — the only place on the site with moving colour */}
          <motion.div
            aria-hidden
            className="secret-aurora pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2.2, ease: EASE_SOFT }}
          />

          {/* sweep line on entry */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/70 to-transparent"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: EASE_OUT }}
          />

          <div className="relative w-full max-w-lg text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="text-[10.5px] tracking-[0.5em] text-[var(--gold)]/80 uppercase"
            >
              Listede olmayan rota
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={stage >= 1 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="mt-6 font-mono text-[13px] tracking-[0.2em] text-white/45 tabular-nums"
            >
              {lat.toFixed(4)}&deg; K &nbsp;/&nbsp; 15,6469&deg; D
            </motion.p>

            <div className="mt-3 overflow-hidden">
              <motion.h2
                initial={{ y: "110%" }}
                animate={stage >= 2 ? { y: "0%" } : {}}
                transition={{ duration: 1.1, ease: EASE_OUT }}
                className="font-display text-[clamp(3rem,11vw,5.5rem)] leading-[1.05] text-white"
              >
                {SECRET_DESTINATION.name}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="mx-auto mt-5 max-w-sm text-[14px] leading-relaxed text-white/50"
            >
              {SECRET_DESTINATION.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.12 }}
              className="mt-10 flex items-center justify-center gap-3"
            >
              <button
                onClick={() => onFly(SECRET_DESTINATION)}
                className="group relative overflow-hidden rounded-full bg-white px-7 py-3 text-[12px] font-medium tracking-[0.16em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
              >
                <span className="relative z-10">Bu rotayı seç</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-white/12 px-7 py-3 text-[12px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-500 hover:border-white/30 hover:text-white"
              >
                Şimdi değil
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
