"use client";

import { useId, useLayoutEffect, useMemo, useRef } from "react";
import { geoInterpolate, geoPath } from "d3-geo";
import { useFormatter } from "next-intl";
import { estimateLabelWidth, guessCircle, placeLabels, pointAlong, type LngLat } from "./mapGeometry";
import { MAP_HEIGHT, MAP_WIDTH } from "./mapDimensions";
import { prepare } from "./worldMap";
import { ACCENT } from "./ui";

/**
 * Cevap haritası: iki şehir, aralarında büyük daire yayı (çizilerek belirir),
 * tahminin A merkezli dairesi ve tahminin yay üzerindeki karşılığı. Bu dosya ve
 * harita verisi yalnız oyun sayfasında, dinamik import ile yüklenir; ağ isteği
 * yok (veri JS paketinin içinde), çevrimdışı çalışır.
 *
 * İki katman: altta durağan harita (kıyılar, sınırlar), üstte hareketli katman
 * (yay, noktalar, daire). Üst katman kendi bileşik katmanında (will-change), böylece
 * her karede yalnız küçük yay yeniden boyanır, kıyıların büyük yolu değil.
 */

export interface MapCity {
  name: string;
  lat: number;
  lng: number;
}

export interface RevealMapProps {
  a: MapCity;
  b: MapCity;
  /** Gerçek mesafe, km. */
  km: number;
  /** Tahmin, km. */
  guessKm: number;
  /** Tahmin işaretinin ve hata çizgisinin rengi (puana göre). */
  tint: string;
  /** Hareketi azalt: animasyon yok, son hâl hemen. */
  reduced: boolean;
  labels: { actual: string; guess: string; caption: string; aria: string };
}

const ARC_MS = 900;
const ARC_DELAY_MS = 180;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** B'nin ötesindeki / A–B arasındaki büyük daire parçası: örneklenmiş noktalarla (> 180° güvenli). */
function alongLine(a: LngLat, b: LngLat, from: number, to: number): LngLat[] {
  const lerp = geoInterpolate(a, b);
  const steps = Math.max(2, Math.min(64, Math.ceil(Math.abs(to - from) * 12)));
  return Array.from({ length: steps + 1 }, (_, i) => lerp(from + ((to - from) * i) / steps));
}

export default function RevealMap({ a, b, km, guessKm, tint, reduced, labels }: RevealMapProps) {
  const format = useFormatter();
  const uid = useId().replace(/:/g, "");

  const A = useMemo<LngLat>(() => [a.lng, a.lat], [a.lng, a.lat]);
  const B = useMemo<LngLat>(() => [b.lng, b.lat], [b.lng, b.lat]);

  const scene = useMemo(() => {
    const { camera, paths } = prepare(A, B, km);
    const projection = camera.projection;
    const path = geoPath(projection);
    const pa = projection(A) ?? [MAP_WIDTH * 0.3, MAP_HEIGHT / 2];
    const pb = projection(B) ?? [MAP_WIDTH * 0.7, MAP_HEIGHT / 2];

    const arc = path({ type: "LineString", coordinates: alongLine(A, B, 0, 1) }) ?? "";
    const circle = path(guessCircle(A, guessKm)) ?? "";
    const guessLngLat = pointAlong(A, B, km, guessKm);
    const guessPoint = projection(guessLngLat);
    // Hata çizgisi: tahminin yay üzerindeki karşılığından B'ye.
    const ratio = guessKm / km;
    const error =
      guessPoint && Math.abs(ratio - 1) > 0.004
        ? (path({ type: "LineString", coordinates: alongLine(A, B, ratio, 1) }) ?? "")
        : "";

    const places = placeLabels(
      pa,
      pb,
      estimateLabelWidth(a.name),
      estimateLabelWidth(b.name),
      { width: MAP_WIDTH, height: MAP_HEIGHT },
      guessPoint ? [guessPoint] : [],
    );
    return { paths, pa, pb, arc, circle, guessPoint, error, places };
  }, [A, B, km, guessKm, a.name, b.name]);

  /* --------------------------- yay animasyonu --------------------------- */
  const arcRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Boyamadan önce kurulur: ilk karede yay ve sayaç son hâlleriyle görünüp sonra silinmesin.
  useLayoutEffect(() => {
    const arc = arcRef.current;
    const glow = glowRef.current;
    const dot = dotRef.current;
    const counter = counterRef.current;
    if (!arc || !counter) return;
    const writeCounter = (value: number) => {
      counter.textContent = format.number(Math.round(value));
    };
    const setProgress = (p: number) => {
      const offset = String(1 - p);
      arc.style.strokeDashoffset = offset;
      if (glow) glow.style.strokeDashoffset = offset;
    };
    if (reduced) {
      setProgress(1);
      writeCounter(km);
      dot?.setAttribute("opacity", "0");
      return;
    }
    setProgress(0);
    writeCounter(0);
    const total = arc.getTotalLength();
    let raf = 0;
    let t0 = 0;
    const frame = (now: number) => {
      if (!t0) t0 = now;
      const raw = Math.min(1, Math.max(0, (now - t0 - ARC_DELAY_MS) / ARC_MS));
      const p = easeInOutCubic(raw);
      setProgress(p);
      writeCounter(km * p);
      if (dot) {
        if (raw > 0 && raw < 1) {
          const pt = arc.getPointAtLength(total * p);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
          dot.setAttribute("opacity", "1");
        } else {
          dot.setAttribute("opacity", "0");
        }
      }
      if (raw < 1) raf = requestAnimationFrame(frame);
      else writeCounter(km);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      setProgress(1);
      writeCounter(km);
    };
  }, [scene, km, reduced, format]);

  const { paths, pa, pb, places, guessPoint } = scene;
  const failed = !paths.land;
  const afterArc = ARC_DELAY_MS + ARC_MS;

  return (
    <figure className="m-0">
      <div className="flex items-start justify-between gap-4 px-1 pb-3">
        <div>
          <p className="text-[9.5px] tracking-[0.24em] text-white/60 uppercase">{labels.actual}</p>
          <p className="font-display mt-1 text-[clamp(1.9rem,9vw,2.4rem)] leading-none text-[var(--gold)] tabular-nums">
            <span ref={counterRef}>{format.number(km)}</span>
            <span className="ml-1.5 text-[0.5em] text-white/60">km</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] tracking-[0.24em] text-white/60 uppercase">{labels.guess}</p>
          <p className="font-display mt-1 text-[clamp(1.4rem,6.5vw,1.8rem)] leading-none text-white tabular-nums">
            {format.number(guessKm)}
            <span className="ml-1.5 text-[0.55em] text-white/60">km</span>
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a1424]">
        {/* Genişlik, en-boy oranı korunarak ekran yüksekliğinin %40'ıyla sınırlı: iki katman aynı kutuyu paylaşır. */}
        <div className="relative mx-auto w-full" style={{ maxWidth: `calc(var(--dg-map-max, 40svh) * ${MAP_WIDTH / MAP_HEIGHT})` }}>
          <svg
            role="img"
            aria-label={labels.aria}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="block h-auto w-full"
          >
            <defs>
              <radialGradient id={`${uid}-sea`} cx="50%" cy="46%" r="70%">
                <stop offset="0" stopColor="#15294a" />
                <stop offset="1" stopColor="#0b162b" />
              </radialGradient>
            </defs>
            <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#0a1424" />
            {paths.sphere && (
              <path d={paths.sphere} fill={`url(#${uid}-sea)`} stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1" />
            )}
            {paths.graticule && (
              <path d={paths.graticule} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.5" />
            )}
            {!failed && (
              <g className={reduced ? undefined : "dg-fade"} style={{ ["--dg-delay" as string]: "0ms" }}>
                <path
                  d={paths.land}
                  fill="#233553"
                  stroke={ACCENT}
                  strokeOpacity="0.35"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                />
                {paths.highlightA && <path d={paths.highlightA} fill={ACCENT} fillOpacity="0.16" />}
                {paths.highlightB && <path d={paths.highlightB} fill={ACCENT} fillOpacity="0.16" />}
                <path
                  d={paths.borders}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.16"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                />
              </g>
            )}
          </svg>

          <svg
            aria-hidden
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="pointer-events-none absolute inset-0 block h-full w-full"
            style={{ willChange: "transform" }}
          >
            {/* tahmin dairesi: A merkezli, yarıçap = tahmin */}
            {scene.circle && (
              <g className="dg-fade" style={{ ["--dg-delay" as string]: `${reduced ? 0 : afterArc - 350}ms` }}>
                <path d={scene.circle} fill={tint} fillOpacity="0.07" />
                <path
                  d={scene.circle}
                  fill="none"
                  stroke={tint}
                  strokeWidth="1.6"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* hata: tahminin karşılığından gerçek noktaya; altın yayın ALTINDA, böylece yay görünür kalır */}
            {scene.error && (
              <path
                className="dg-fade"
                style={{ ["--dg-delay" as string]: `${reduced ? 0 : afterArc - 100}ms` }}
                d={scene.error}
                fill="none"
                stroke={tint}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeOpacity="0.9"
              />
            )}
            {/* gerçek yay: önce yumuşak ışıma, üstte ince çizgi */}
            <path
              ref={glowRef}
              d={scene.arc}
              pathLength={1}
              fill="none"
              stroke={ACCENT}
              strokeOpacity="0.28"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="1 1"
              strokeDashoffset={reduced ? 0 : 1}
            />
            <path
              ref={arcRef}
              d={scene.arc}
              pathLength={1}
              fill="none"
              stroke={ACCENT}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="1 1"
              strokeDashoffset={reduced ? 0 : 1}
            />
            <circle ref={dotRef} r="3.4" fill="#fff6dc" opacity="0" />

            {guessPoint && (
              <g
                className="dg-pop"
                style={{ ["--dg-delay" as string]: `${reduced ? 0 : afterArc - 100}ms` }}
                transform={`translate(${guessPoint[0]} ${guessPoint[1]})`}
              >
                <circle r="6.5" fill="#06090f" stroke="#ffffff" strokeWidth="2" />
                <circle r="2.2" fill={tint} />
              </g>
            )}

            {/* A: başlangıç (beyaz) */}
            <g className="dg-pop" style={{ ["--dg-delay" as string]: "0ms" }}>
              <circle cx={pa[0]} cy={pa[1]} r="9" fill={ACCENT} fillOpacity="0.2" />
              <circle cx={pa[0]} cy={pa[1]} r="4.6" fill="#ffffff" stroke="#06090f" strokeWidth="1.6" />
            </g>
            {/* B: varış (altın), yay bitince belirir */}
            <g className="dg-pop" style={{ ["--dg-delay" as string]: `${reduced ? 0 : afterArc - 250}ms` }}>
              {!reduced && (
                <circle
                  className="dg-pulse"
                  style={{ ["--dg-delay" as string]: `${afterArc - 200}ms` }}
                  cx={pb[0]}
                  cy={pb[1]}
                  r="7"
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="1.6"
                />
              )}
              <circle cx={pb[0]} cy={pb[1]} r="9" fill={ACCENT} fillOpacity="0.2" />
              <circle cx={pb[0]} cy={pb[1]} r="4.6" fill={ACCENT} stroke="#06090f" strokeWidth="1.6" />
            </g>

            <text
              x={places.a.x}
              y={places.a.y}
              textAnchor="middle"
              className="dg-fade"
              style={{
                ["--dg-delay" as string]: "60ms",
                paintOrder: "stroke",
                stroke: "#06090f",
                strokeWidth: 3.2,
                strokeLinejoin: "round",
              }}
              fill="#ffffff"
              fontSize="12.5"
              fontWeight="600"
            >
              {a.name}
            </text>
            <text
              x={places.b.x}
              y={places.b.y}
              textAnchor="middle"
              className="dg-fade"
              style={{
                ["--dg-delay" as string]: `${reduced ? 0 : afterArc - 250}ms`,
                paintOrder: "stroke",
                stroke: "#06090f",
                strokeWidth: 3.2,
                strokeLinejoin: "round",
              }}
              fill="#f3dfae"
              fontSize="12.5"
              fontWeight="600"
            >
              {b.name}
            </text>
          </svg>
        </div>
      </div>
      <figcaption className="mt-2.5 flex items-center gap-2 px-1 text-[11px] leading-snug text-white/60">
        <span
          aria-hidden
          className="inline-block h-0 w-5 shrink-0 border-t-2 border-dashed"
          style={{ borderColor: tint }}
        />
        {labels.caption}
      </figcaption>
    </figure>
  );
}
