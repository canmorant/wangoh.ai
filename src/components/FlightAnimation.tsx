"use client";

import { useEffect, useState, useRef, useMemo, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { countryName } from "@/lib/countryNames";
import type { Country } from "@/data/destinations";
import { DEFAULT_ORIGIN_ID, TURKEY_ORIGINS, WORLD_ORIGINS, type OriginCity } from "@/data/origins";
import { useFlightOrigin } from "@/hooks/useFlightOrigin";
import { useContentText } from "@/components/ContentText";
import { geoNaturalEarth1, geoPath, geoInterpolate } from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { useAdaptiveMotionQuality } from "@/hooks/useAdaptiveMotionQuality";

interface FlightAnimationProps {
  country: Country;
  onComplete: () => void;
}

const MAP_WIDTH = 960;
const MAP_HEIGHT = 500;

export default function FlightAnimation({ country, onComplete }: FlightAnimationProps) {
  const motionQuality = useAdaptiveMotionQuality();
  const t = useTranslations("Flight");
  const locale = useLocale();
  const tx = useContentText();
  const name = countryName(country.code, locale, country.name);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"intro" | "flying" | "arriving">("intro");
  const [worldData, setWorldData] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  // Kalkış: ziyaretçinin konumu ya da seçtiği şehir (dil değil). Konum
  // alınamadıysa uçuş başlamadan şehir sorulur; "Değiştir" ile her zaman
  // değiştirilebilir, seçim bu cihazda hatırlanır.
  const { origin, status, choose } = useFlightOrigin();
  const [picking, setPicking] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_ORIGIN_ID);
  const [run, setRun] = useState(0);
  const choosing = status === "unknown" || picking;
  const ready = origin !== null && !choosing;
  const originLabel = origin?.name ? tx(origin.name) : t("yourLocation");

  const sortCities = (cities: OriginCity[]) =>
    [...cities].sort((a, b) => tx(a.name).localeCompare(tx(b.name), locale));

  const openPicker = () => {
    setSelected(origin?.id ?? DEFAULT_ORIGIN_ID);
    setPicking(true);
  };

  const startFrom = (event: FormEvent) => {
    event.preventDefault();
    choose(selected);
    setPicking(false);
    setProgress(0);
    setPhase("intro");
    setRun((n) => n + 1);
  };

  // D3 projection
  const projection = useMemo(() => {
    return geoNaturalEarth1()
      .scale(170)
      .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);
  }, []);

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  // Project coordinates
  const originLat = origin?.lat ?? null;
  const originLng = origin?.lng ?? null;
  const originPos = originLat !== null && originLng !== null ? projection([originLng, originLat]) : null;
  const destPos = projection([country.coordinates.lng, country.coordinates.lat]) || [0, 0];

  // Great circle interpolator for curved flight path. Kalkış henüz belli
  // değilken yol çizilmiyor; uçak hedefte bekliyormuş gibi davranıyor.
  const interpolator = useMemo(() => {
    if (originLat === null || originLng === null) {
      const dest: [number, number] = [country.coordinates.lng, country.coordinates.lat];
      return () => dest;
    }
    return geoInterpolate([originLng, originLat], [country.coordinates.lng, country.coordinates.lat]);
  }, [originLat, originLng, country.coordinates.lat, country.coordinates.lng]);

  // Generate flight path points along the great circle
  const flightPathD = useMemo(() => {
    const points: [number, number][] = [];
    for (let t = 0; t <= 1; t += 0.005) {
      const coord = interpolator(t);
      const projected = projection(coord);
      if (projected) points.push(projected as [number, number]);
    }
    if (points.length < 2) return "";
    return "M " + points.map(p => `${p[0]},${p[1]}`).join(" L ");
  }, [interpolator, projection]);

  // Current plane position
  const planeCoord = interpolator(Math.min(progress, 0.999));
  const planePos = projection(planeCoord) || [0, 0];
  const nextCoord = interpolator(Math.min(progress + 0.02, 1));
  const nextPos = projection(nextCoord) || [0, 0];
  const angle = Math.atan2(nextPos[1] - planePos[1], nextPos[0] - planePos[0]) * (180 / Math.PI);

  // Load world map data
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(res => res.json())
      .then((topology: Topology) => {
        const geojson = topojson.feature(topology, topology.objects.countries);
        if ("features" in geojson) {
          const paths = geojson.features
            .map(f => pathGenerator(f))
            .filter((d): d is string => d !== null);
          setWorldData(paths);
        }
      })
      .catch(() => {});
  }, [pathGenerator]);

  // Animation timers — kalkış belli olunca ve şehir seçilmiyorken çalışır.
  useEffect(() => {
    if (!ready) return;
    const timer1 = setTimeout(() => setPhase("flying"), 800);
    let interval: NodeJS.Timeout;
    const timer2 = setTimeout(() => {
      const frameDelay = motionQuality === "lite" ? 45 : 30;
      const step = motionQuality === "lite" ? 0.025 : 0.012;
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            clearInterval(interval);
            return 1;
          }
          return p + step;
        });
      }, frameDelay);
    }, 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, [motionQuality, ready, run]);

  useEffect(() => {
    if (progress >= 1) {
      const phaseTimer = setTimeout(() => setPhase("arriving"), 0);
      const completeTimer = setTimeout(onComplete, 1500);
      return () => {
        clearTimeout(phaseTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [progress, onComplete]);

  // Compute the visible portion of the flight path
  const visiblePathD = useMemo(() => {
    const points: [number, number][] = [];
    for (let t = 0; t <= progress; t += 0.005) {
      const coord = interpolator(t);
      const projected = projection(coord);
      if (projected) points.push(projected as [number, number]);
    }
    if (points.length < 2) return "";
    return "M " + points.map(p => `${p[0]},${p[1]}`).join(" L ");
  }, [progress, interpolator, projection]);

  const messages = [
    t("preparing"),
    t("nextStop", { country: name, flag: country.flag }),
    t("welcome", { country: name }),
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 py-[max(1rem,env(safe-area-inset-top))]"
        style={{ background: "linear-gradient(135deg, #070d1a 0%, #0d1b2a 50%, #132338 100%)" }}
      >
        {/* Map container */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl md:px-8"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="w-full h-auto"
          >
            {/* Subtle grid */}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`lat${i}`} x1="0" y1={i * (MAP_HEIGHT / 12)} x2={MAP_WIDTH} y2={i * (MAP_HEIGHT / 12)} stroke="rgba(200,164,94,0.06)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 19 }).map((_, i) => (
              <line key={`lng${i}`} x1={i * (MAP_WIDTH / 18)} y1="0" x2={i * (MAP_WIDTH / 18)} y2={MAP_HEIGHT} stroke="rgba(200,164,94,0.06)" strokeWidth="0.5" />
            ))}

            {/* Country shapes */}
            {worldData.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="rgba(200,164,94,0.1)"
                stroke="rgba(200,164,94,0.25)"
                strokeWidth="0.5"
              />
            ))}

            {/* Glow filter */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="markerGlow">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Full flight path (faint) */}
            <path
              d={originPos ? flightPathD : ""}
              fill="none"
              stroke="rgba(200,164,94,0.12)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />

            {/* Traveled path (bright) */}
            <path
              d={visiblePathD}
              fill="none"
              stroke="rgba(200,164,94,0.7)"
              strokeWidth="2"
              filter="url(#glow)"
            />

            {/* Origin marker */}
            {originPos && (
              <>
                <circle cx={originPos[0]} cy={originPos[1]} r="5" fill="rgba(200,164,94,0.9)" filter="url(#markerGlow)" />
                <circle cx={originPos[0]} cy={originPos[1]} r="10" fill="none" stroke="rgba(200,164,94,0.4)" strokeWidth="1">
                  <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x={originPos[0]} y={originPos[1] - 14} textAnchor="middle" fill="white" fontSize="11" fontFamily="sans-serif" fontWeight="300" opacity="0.9">{originLabel}</text>
              </>
            )}

            {/* Destination marker */}
            <circle cx={destPos[0]} cy={destPos[1]} r="5" fill={progress > 0.9 ? "rgba(200,164,94,0.9)" : "rgba(200,164,94,0.4)"} filter={progress > 0.9 ? "url(#markerGlow)" : undefined} />
            <circle cx={destPos[0]} cy={destPos[1]} r="10" fill="none" stroke="rgba(200,164,94,0.4)" strokeWidth="1">
              <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={destPos[0]} y={destPos[1] - 14} textAnchor="middle" fill="white" fontSize="11" fontFamily="sans-serif" fontWeight="300" opacity="0.9">{name}</text>

            {/* Airplane */}
            {originPos && progress < 1 && progress > 0 && (
              <g transform={`translate(${planePos[0]}, ${planePos[1]}) rotate(${angle})`}>
                <polygon points="-8,0 -4,-3 10,0 -4,3" fill="white" />
                <polygon points="-3,-2.5 -3,-7 1,-1.5" fill="white" opacity="0.7" />
                <polygon points="-3,2.5 -3,7 1,1.5" fill="white" opacity="0.7" />
                {/* Engine trail */}
                <ellipse cx="-12" cy="0" rx="6" ry="1.5" fill="rgba(200,164,94,0.3)" />
              </g>
            )}
          </svg>
        </motion.div>

        {/* Status */}
        <motion.div
          className="mt-5 w-full text-center sm:mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="px-2 text-[16px] font-light tracking-wide text-white/70 sm:text-lg sm:tracking-wider md:text-xl">
            {phase === "intro" && messages[0]}
            {phase === "flying" && messages[1]}
            {phase === "arriving" && messages[2]}
          </p>

          {/* Progress bar */}
          <div className="mx-auto mt-5 h-[2px] w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, rgba(200,164,94,0.4), rgba(200,164,94,1))",
              }}
            />
          </div>
          <p className="mt-2 text-white/30 text-xs tracking-widest uppercase">
            {Math.round(progress * 100)}%
          </p>

          {origin && !choosing && (
            <p className="mt-4 text-[12px] text-white/45">
              {t("from", { city: originLabel })}
              <span aria-hidden className="mx-2 text-white/20">·</span>
              <button
                type="button"
                onClick={openPicker}
                aria-label={t("changeLabel")}
                className="text-[var(--gold)]/80 underline-offset-4 transition-colors hover:text-[var(--gold)] hover:underline"
              >
                {t("change")}
              </button>
            </p>
          )}
        </motion.div>

        {choosing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#070d1a]/75 px-4 backdrop-blur-sm">
            <form
              onSubmit={startFrom}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1626]/95 p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="origin-title"
            >
              <p id="origin-title" className="font-display text-2xl text-white">
                {t("chooseTitle")}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                {status === "unknown" ? t("chooseHint") : t("changeHint")}
              </p>
              <label className="mt-5 block">
                <span className="text-[10px] tracking-[0.22em] text-white/40 uppercase">{t("cityLabel")}</span>
                <select
                  autoFocus
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-[#070d1a] px-3 py-3 text-[15px] text-white focus:border-[var(--gold)]/60 focus:outline-none"
                >
                  <optgroup label={t("turkey")}>
                    {sortCities(TURKEY_ORIGINS).map((city) => (
                      <option key={city.id} value={city.id}>
                        {tx(city.name)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={t("world")}>
                    {sortCities(WORLD_ORIGINS).map((city) => (
                      <option key={city.id} value={city.id}>
                        {tx(city.name)}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <div className="mt-6 flex items-center justify-end gap-3">
                {picking && origin && (
                  <button
                    type="button"
                    onClick={() => setPicking(false)}
                    className="rounded-full px-4 py-2.5 text-[12px] tracking-[0.12em] text-white/55 uppercase transition-colors hover:text-white"
                  >
                    {t("cancel")}
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-white px-5 py-2.5 text-[12px] font-medium tracking-[0.12em] text-black uppercase transition-transform hover:scale-[1.03]"
                >
                  {t("start")}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
