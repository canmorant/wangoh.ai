"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { countries } from "@/data/countries";
import { assertCountriesValid, assertWheelSelectionValid } from "./validateCountries";
import { useWheelPhysics } from "./useWheelPhysics";
import {
  segmentAngle,
  startAngle,
  centerAngle,
  selectedIndex,
  toCanvasRadians,
  labelFontSize,
} from "./wheelMath";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";
import { featuredFor, toCountryRoute } from "@/lib/worldAdapter";
import { continentTr, subregionTr } from "@/lib/geoTr";
import type { Country as RouteCountry } from "@/data/destinations";

const CONTINENT_COLOR: Record<string, string> = {
  Africa: "#d4795a",
  Americas: "#4b7fd4",
  Asia: "#e0537a",
  Europe: "#7a6fd4",
  Oceania: "#3fae9a",
  Antarctic: "#8a97ad",
};

const N = countries.length;

export default function CountryWheel({
  open,
  onClose,
  onFly,
}: {
  open: boolean;
  onClose: () => void;
  onFly: (c: RouteCountry) => void;
}) {
  useEffect(() => {
    // Dataset integrity, then the segment-by-segment selection check.
    assertCountriesValid(countries);
    assertWheelSelectionValid(countries.map((c) => c.name));
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sprite = useRef<HTMLCanvasElement | null>(null);
  const spriteSize = useRef(0);
  // ONE source of truth: the index under the pointer, derived from rotation.
  // There is deliberately no separate `result` state — a second store is what
  // let the card keep showing a stale country while the wheel moved on.
  const wheel = useWheelPhysics(N);

  // Props held in a ref so no effect below has to depend on their identity.
  // Assigned in an effect, not during render — mutating a ref while rendering
  // is unsafe under concurrent rendering.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* ------------------- pre-rendered wheel ------------------- */
  const buildSprite = useCallback((size: number) => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas");
    cv.width = cv.height = size * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return null;
    ctx.scale(dpr, dpr);

    const c = size / 2;
    const rOuter = c - 3;
    const rInner = c * 0.36;
    const rLabel = rOuter - 6;
    const seg = segmentAngle(N);
    // Derived from arc spacing so neighbouring labels can never overlap.
    const font = labelFontSize(rLabel, N);

    ctx.translate(c, c);

    countries.forEach((country, i) => {
      const a0 = toCanvasRadians(startAngle(i, N), 0);
      const a1 = toCanvasRadians(startAngle(i, N) + seg, 0);
      const base = CONTINENT_COLOR[country.continent] ?? "#8a97ad";

      ctx.beginPath();
      ctx.arc(0, 0, rOuter, a0, a1);
      ctx.arc(0, 0, rInner, a1, a0, true);
      ctx.closePath();

      const g = ctx.createRadialGradient(0, 0, rInner, 0, 0, rOuter);
      g.addColorStop(0, base + (i % 2 ? "6e" : "9c"));
      g.addColorStop(1, base + (i % 2 ? "aa" : "d6"));
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "rgba(6,9,15,0.5)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.save();
      ctx.rotate(toCanvasRadians(centerAngle(i, N), 0));
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.font = `600 ${font}px ui-monospace, SFMono-Regular, monospace`;
      ctx.fillText(country.iso2, rLabel, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, rOuter, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, rInner, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    return cv;
  }, []);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const size = cv.clientWidth;
    if (size < 80) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(size * dpr)) {
      cv.width = cv.height = Math.round(size * dpr);
      sprite.current = null;
    }
    if (!sprite.current || spriteSize.current !== size) {
      sprite.current = buildSprite(size);
      spriteSize.current = size;
    }
    const ctx = cv.getContext("2d");
    if (!ctx || !sprite.current) return;

    const rot = wheel.rotation.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const c = size / 2;
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.drawImage(sprite.current, -c, -c, size, size);
    ctx.restore();

    // Highlight is derived from the SAME selectedIndex that produces the
    // result, so what you see and what you get are one value.
    const idx = selectedIndex(rot, N);
    const seg = segmentAngle(N);
    ctx.save();
    ctx.translate(c, c);
    ctx.beginPath();
    ctx.arc(0, 0, c - 3, toCanvasRadians(startAngle(idx, N), rot), toCanvasRadians(startAngle(idx, N) + seg, rot));
    ctx.arc(0, 0, c * 0.36, toCanvasRadians(startAngle(idx, N) + seg, rot), toCanvasRadians(startAngle(idx, N), rot), true);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.95)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }, [buildSprite, wheel.rotation]);

  // Hand the draw function to the physics loop once.
  useEffect(() => {
    wheel.setDraw(draw);
  }, [draw, wheel]);

  // Keyed on `open` alone. The old version also depended on `onClose`, an
  // inline arrow in the parent, so every parent render reset the wheel and
  // killed any spin in progress — the "stuck on one country" bug.
  useEffect(() => {
    if (!open) return;
    wheel.reset();

    const id = requestAnimationFrame(() => draw());
    const onResize = () => {
      sprite.current = null;
      draw();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* --------------------------- pointer --------------------------- */
  const angleAt = (clientX: number, clientY: number) => {
    const cv = canvasRef.current;
    if (!cv) return 0;
    const r = cv.getBoundingClientRect();
    return (
      (Math.atan2(clientY - (r.top + r.height / 2), clientX - (r.left + r.width / 2)) * 180) / Math.PI
    );
  };

  // Everything the card renders comes from this single object, in one render
  // pass, so name, flag, ISO, continent, capital, subregion and borders can
  // never belong to different countries.
  const shown = countries[wheel.live];
  const featured = useMemo(() => (shown ? featuredFor(shown.iso2) : null), [shown]);
  const accent = shown ? CONTINENT_COLOR[shown.continent] ?? "#8a97ad" : "#8a97ad";
  const result = wheel.settled ? shown : null;

  // Dev assertion: what the wheel calculates must equal what the card shows.
  if (process.env.NODE_ENV !== "production" && shown) {
    const calculated = countries[selectedIndex(wheel.rotation.current, N)];
    if (wheel.settled && calculated && calculated.iso2 !== shown.iso2) {
      console.error(
        `[country-wheel] desync: rotation resolves to ${calculated.iso2} but the card shows ${shown.iso2}`
      );
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_SOFT }}
        >
          <button
            aria-label="Kapat"
            onClick={onClose}
            className="fixed inset-0 cursor-default bg-[#05070c]/95 backdrop-blur-2xl"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0"
            animate={{ background: `radial-gradient(ellipse 60% 50% at 50% 45%, ${accent}22, transparent 70%)` }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
          />

          <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center gap-10 px-5 py-24 lg:flex-row lg:gap-14">
            <div className="relative w-full max-w-[min(90vw,600px)] shrink-0 lg:max-w-[560px]">
              <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-[7px]">
                <svg width="32" height="36" viewBox="0 0 32 36" aria-hidden>
                  <path d="M16 36 L3 8 A14.5 14.5 0 0 1 29 8 Z" fill="#f6f4f0" />
                  <circle cx="16" cy="11" r="4.2" fill="#0d1119" />
                </svg>
              </div>

              <canvas
                ref={canvasRef}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  wheel.dragStart(angleAt(e.clientX, e.clientY));
                }}
                onPointerMove={(e) => wheel.dragMove(angleAt(e.clientX, e.clientY))}
                onPointerUp={(e) => {
                  e.currentTarget.releasePointerCapture?.(e.pointerId);
                  wheel.dragEnd();
                }}
                onPointerCancel={() => wheel.dragEnd()}
                role="slider"
                tabIndex={0}
                aria-label="Ülke çarkı"
                aria-valuemin={0}
                aria-valuemax={N - 1}
                aria-valuenow={wheel.live}
                aria-valuetext={shown?.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    wheel.spin();
                  }
                }}
                className="aspect-square w-full cursor-grab touch-none rounded-full select-none active:cursor-grabbing"
                style={{ filter: "drop-shadow(0 40px 100px rgba(0,0,0,0.8))" }}
              />

              <button
                onClick={wheel.spin}
                disabled={wheel.busy}
                aria-disabled={wheel.busy}
                className="absolute top-1/2 left-1/2 flex h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/15 bg-[#0d1119] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60"
              >
                <span className="text-[clamp(9px,1.5vw,11px)] font-semibold tracking-[0.2em] uppercase">
                  {wheel.busy ? "…" : "Çevir"}
                </span>
                <span className="mt-0.5 text-[clamp(7px,1.1vw,9px)] tracking-[0.14em] text-white/40 tabular-nums">
                  {N}
                </span>
              </button>

              <p className="mt-5 text-center text-[11px] tracking-[0.26em] text-white/30 uppercase">
                Çevir · ya da çarkı sürükle
              </p>
            </div>

            <div className="w-full max-w-sm">
              <motion.div
                animate={{ boxShadow: `0 0 100px -45px ${accent}` }}
                transition={{ duration: 0.7, ease: EASE_SOFT }}
                className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-2xl"
              >
                <p className="text-[10px] tracking-[0.42em] text-white/40 uppercase">
                  {wheel.settled
                    ? "Rotan"
                    : wheel.busy
                      ? "Çark dönüyor"
                      : "Bir sonraki rotanı keşfetmek için çarkı çevir"}
                </p>

                {/* Rendered as ONE plain node with a STABLE key. The previous
                    version wrapped this in <AnimatePresence mode="wait"> keyed
                    on the country, so a spin (which changes the country ~60x a
                    second) queued more enter/exit transitions than it could
                    finish. Exiting copies stayed mounted, producing a card that
                    showed one country's flag beside another's capital — and
                    finally froze on a stale name. Motion is now driven only by
                    `settled`, which changes at most twice per interaction. */}
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: wheel.settled ? [0.99, 1] : 1 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="mt-5"
                >
                  <div className="flex items-center gap-4">
                    {shown && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={shown.iso2}
                        src={`/flags/${shown.iso2.toLowerCase()}.svg`}
                        alt=""
                        width={56}
                        height={42}
                        className="h-[42px] w-[56px] shrink-0 rounded-[3px] object-cover shadow-lg ring-1 ring-white/15"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[1.75rem] leading-[1.05] text-white">
                        {shown?.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] tracking-[0.18em] text-white/40">
                          {shown?.iso3}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] tracking-[0.16em] uppercase"
                          style={{ background: accent + "26", color: accent }}
                        >
                          {shown ? continentTr(shown.continent) : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5">
                  <Row label="Başkent" value={shown?.capital.join(" · ") || "—"} />
                  <Row label="Alt bölge" value={shown ? subregionTr(shown.subregion) || "—" : "—"} />
                  <Row
                    label="Kara sınırı"
                    value={shown?.borders.length ? `${shown.borders.length} komşu` : "Yok — ada ya da izole"}
                  />
                  {featured && <Row label="Giriş noktası" value={`${featured.gateway} · ${featured.iata}`} />}
                </div>

                <button
                  disabled={!result}
                  onClick={() => result && onFly(toCountryRoute(result))}
                  className="mt-7 w-full rounded-full bg-white px-6 py-3.5 text-[11.5px] font-semibold tracking-[0.2em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-25"
                >
                  {result ? `Beni ${result.name} ülkesine götür` : "Seçmek için çevir"}
                </button>
              </motion.div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-30 rounded-full border border-white/12 bg-black/30 px-5 py-2.5 text-[11px] tracking-[0.18em] text-white/70 uppercase backdrop-blur-md transition-colors duration-500 hover:border-white/35 hover:text-white"
          >
            Kapat
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-[9.5px] tracking-[0.22em] text-white/35 uppercase">{label}</span>
      <span className="text-right text-[12.5px] leading-snug text-white/85">{value}</span>
    </div>
  );
}
