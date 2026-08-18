"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import type { Country } from "@/data/destinations";
import { boardingFor, barcodeBars } from "@/lib/boarding";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { turkishDative } from "@/lib/turkish";

/**
 * A destination rendered as a boarding pass.
 *
 * Structure follows a real pass: a photographic header, the route block, a
 * perforated tear line, then the stub with the barcode. The card tilts toward
 * the pointer with a glare that tracks it, and the perforation is a real
 * mask-based cut rather than a dashed border, so the two halves read as
 * separate pieces of material.
 */
export default function BoardingPass({
  country,
  onSelect,
  boarding = false,
}: {
  country: Country;
  onSelect: () => void;
  /** Plays the validation state before the flight transition takes over. */
  boarding?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const d = boardingFor(country);
  const bars = barcodeBars(country.code);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), SPRING);
  const imgX = useSpring(useTransform(px, [-0.5, 0.5], [10, -10]), SPRING);

  const glare = useMotionTemplate`linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) ${gx}%, transparent 70%)`;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx - 0.5);
    py.set(ny - 0.5);
    gx.set(nx * 100);
    gy.set(ny * 100);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
    gx.set(50);
  };

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className="group relative"
      >
        {/* Card + its contact shadow share a wrapper so the shadow is anchored
            to the ticket, not to the control row below it. */}
        {/* The whole ticket is the primary target. Deliberately a div with an
            explicit button role rather than a <button>: a real button may not
            contain interactive descendants, and keeping the semantics here lets
            the control row live outside it with no nesting at all. */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`${country.shortName || country.name} ülkesine ${d.flight} sefer numaralı uçuşa bin`}
          onClick={onSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect();
            }
          }}
          className="relative cursor-pointer rounded-[19px] outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0e1a]"
        >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-5 -bottom-2 h-10 rounded-[50%] bg-black/70 blur-2xl transition-all duration-500 group-hover:inset-x-8 group-hover:-bottom-3 group-hover:opacity-80"
        />

        <div
          className="pass-shape relative overflow-hidden bg-[#f4f2ee] text-[#14161c] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]"
          style={{ ["--accent" as string]: country.accent }}
        >
          {/* ---------------- header ---------------- */}
          <div className="relative h-[172px] overflow-hidden sm:h-[190px]">
            <motion.div className="absolute -inset-4" style={{ x: imgX }}>
              <Image
                src={country.image}
                alt=""
                fill
                unoptimized={country.image.includes("upload.wikimedia.org")}
                sizes="(max-width:640px) 92vw, (max-width:1024px) 46vw, 30vw"
                className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </motion.div>
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(8,10,16,0.05) 0%, rgba(8,10,16,0.55) 100%), linear-gradient(0deg, ${country.accent}22, transparent 60%)`,
              }}
            />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9.5px] font-semibold tracking-[0.18em] text-[#14161c] uppercase">
                Ülke Rehberi
              </span>
              <span className="text-[22px] leading-none drop-shadow">{country.flag}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
              <div>
                <p className="text-[9.5px] tracking-[0.28em] text-white/75 uppercase">
                  {country.gateway} &middot; {country.cities.length} Şehir
                </p>
                <p className="font-display text-[1.8rem] sm:text-[2rem] leading-none text-white drop-shadow">
                  {country.shortName || country.name}
                </p>
              </div>
              <span
                className="rounded-md px-2 py-1 text-[13px] font-bold tracking-[0.08em] text-white shadow-sm"
                style={{ background: country.accent }}
              >
                {country.code}
              </span>
            </div>
          </div>

          {/* accent rule */}
          <div className="h-[3px] w-full" style={{ background: country.accent }} />

          {/* ---------------- route ---------------- */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-center justify-between gap-3">
              <Endpoint code={d.from} label="Kalkış" />

              {/* route line — the dot travels on hover */}
              <div className="relative mx-1 h-6 flex-1">
                <span className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 border-t border-dashed border-[#14161c]/25" />
                <span
                  aria-hidden
                  className="absolute top-1/2 left-0 -translate-y-1/2 transition-[left] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:left-full"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 -translate-x-1/2 rotate-90 fill-[#14161c]/70">
                    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                  </svg>
                </span>
              </div>

              <Endpoint code={d.to} label="Varış" align="right" />
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Field label="Sefer" value={d.flight} />
              <Field label="Kapı" value={d.gate} />
              <Field label="Koltuk" value={d.seat} />
              <Field label="Biniş" value={d.boards} />
            </div>
          </div>

          {/* ---------------- perforation ---------------- */}
          <div className="relative h-6">
            <span className="absolute top-1/2 right-5 left-5 border-t border-dashed border-[#14161c]/25" />
            {/* notches punched into the card edges */}
            <span className="absolute top-1/2 -left-2.5 h-5 w-5 -translate-y-1/2 rounded-full bg-[#0a0e1a]" />
            <span className="absolute top-1/2 -right-2.5 h-5 w-5 -translate-y-1/2 rounded-full bg-[#0a0e1a]" />
          </div>

          {/* ---------------- stub ---------------- */}
          <div className="flex items-center justify-between gap-4 px-5 pt-1 pb-5">
            <div>
              <p className="text-[8.5px] tracking-[0.24em] text-[#14161c]/45 uppercase">
                Süre
              </p>
              <p className="text-[13px] font-semibold tabular-nums">{country.flightTime}</p>
              <p className="mt-2 text-[8.5px] tracking-[0.24em] text-[#14161c]/45 uppercase">
                Sıra
              </p>
              <p className="text-[11px] tabular-nums">{d.sequence}</p>
            </div>

            <svg
              viewBox={`0 0 ${bars.reduce((a, b) => a + b + 2, 0)} 40`}
              className="h-11 flex-1"
              preserveAspectRatio="none"
              aria-hidden
            >
              {
                bars.reduce<{ x: number; els: React.ReactNode[] }>(
                  (acc, w, i) => {
                    acc.els.push(
                      <rect key={i} x={acc.x} y="0" width={w} height="40" fill="#14161c" />
                    );
                    acc.x += w + 2;
                    return acc;
                  },
                  { x: 0, els: [] }
                ).els
              }
            </svg>
          </div>

          {/* glare */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glare }}
          />

          {/* ---------------- back face ---------------- */}
          <motion.div
            initial={false}
            animate={{ opacity: flipped ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className={`absolute inset-0 flex flex-col justify-center gap-4 bg-[#f4f2ee] px-6 ${
              flipped ? "" : "pointer-events-none"
            }`}
          >
            <Detail label="Ülke" value={country.name} />
            <Detail label="Başkent" value={country.capital} />
            <Detail label="En iyi mevsim" value={country.bestSeason} />
            <Detail label="Bütçe" value={country.budget} />
            <Detail label="Kaçırma" value={country.signature} />
            <Detail label="Şehirler" value={`bu ülkedeki ${country.cities.length} şehir rehberi`} />
          </motion.div>

          {/* ---------------- validation stamp ---------------- */}
          {boarding && (
            <motion.div
              initial={{ opacity: 0, scale: 1.6, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: -12 }}
              transition={{ duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
            >
              <span
                className="rounded-lg border-[3px] px-5 py-2 text-[15px] font-bold tracking-[0.22em] uppercase"
                style={{ borderColor: country.accent, color: country.accent }}
              >
                BİNİLDİ
              </span>
            </motion.div>
          )}
        </div>
        </div>

        {/* Controls sit OUTSIDE the clickable card, so nothing is nested. The
            CTA calls the identical handler, so the two can never diverge. */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={onSelect}
            tabIndex={-1}
            aria-hidden
            className="flex-1 rounded-full bg-white px-4 py-2.5 text-[11px] font-medium tracking-[0.18em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] group-hover:scale-[1.02]"
          >
            {turkishDative(country.shortName || country.name)} Git
          </button>
          <button
            onClick={() => setFlipped((f) => !f)}
            aria-expanded={flipped}
            aria-label={`${country.shortName || country.name} ayrıntılarını ${flipped ? "gizle" : "göster"}`}
            className="rounded-full border border-white/15 px-4 py-2.5 text-[11px] tracking-[0.18em] text-white/60 uppercase transition-colors duration-500 hover:border-white/35 hover:text-white"
          >
            {flipped ? "Geri" : "Ayrıntılar"}
          </button>
        </div>

        <span className="sr-only">
          {d.from} çıkışlı {d.to} varışlı {d.flight} sefer sayılı uçuş, kapı {d.gate}, koltuk {d.seat}
        </span>
      </motion.div>
    </div>
  );
}

function Endpoint({
  code,
  label,
  align = "left",
}: {
  code: string;
  label: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-[8.5px] tracking-[0.24em] text-[#14161c]/45 uppercase">{label}</p>
      <p className="font-display text-[1.25rem] sm:text-[1.4rem] leading-none tracking-tight truncate max-w-[130px]">{code}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8.5px] tracking-[0.2em] text-[#14161c]/45 uppercase">{label}</p>
      <p className="mt-0.5 text-[12.5px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#14161c]/10 pb-3">
      <p className="text-[8.5px] tracking-[0.24em] text-[#14161c]/45 uppercase">{label}</p>
      <p className="mt-1 text-[13.5px] leading-snug">{value}</p>
    </div>
  );
}
