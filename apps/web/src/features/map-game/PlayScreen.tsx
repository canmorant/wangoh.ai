"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { Crosshair, Globe2, Lightbulb, Minus, Plus } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cityKey } from "../distance-game/cities";
import type { LngLat } from "../distance-game/mapGeometry";
import { CountUp, SoundToggle, Stat, primaryButton, secondaryButton, tintFor } from "../distance-game/ui";
import type { GlobeHandle } from "./Globe";
import { hintCircle } from "./globeMath";
import { useNames, type Names } from "./names";
import { MAX_HINT_ROUND_SCORE } from "./scoring";
import type { RoundResult, useMapGame } from "./useMapGame";

type G = ReturnType<typeof useMapGame>;

/** Küre parçası yüklenirken aynı boyutta iskelet: yerleşim zıplamasın. */
function GlobeSkeleton() {
  return <div className="absolute inset-0 animate-pulse motion-reduce:animate-none bg-white/[0.04]" />;
}

// Küre ve dünya verisi ayrı bir parça: giriş ekranına ve ana sayfaya girmez.
const Globe = dynamic(() => import("./Globe"), { ssr: false, loading: () => <GlobeSkeleton /> });

const roundButton =
  "flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/85 backdrop-blur-sm transition-colors duration-300 hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-white/15";

/* ============================= PLAYING ============================= */
export function Playing({ g, countryNames, guideLinks, guideNames }: { g: G } & Names) {
  const t = useTranslations("MapGame");
  const format = useFormatter();
  const reduced = useReducedMotion() ?? false;
  const names = useNames({ countryNames, guideNames });
  const target = g.target!;
  const city = target.city;
  const cityName = names.city(city);
  const revealed = g.phase === "revealed";
  const result = g.lastResult;

  const globe = useRef<GlobeHandle>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState(false);
  // Hareket ipucu ilk dokunuşa kadar görünür (oyun boyunca bir kez).
  const [touched, setTouched] = useState(false);

  // Yeni tur hep sayfanın başında açılsın.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [g.index]);

  // Klavyeyle baştan sona oynanabilsin: cevaptan sonra "sıradaki tur" düğmesine odaklan.
  useEffect(() => {
    if (revealed) nextRef.current?.focus({ preventScroll: true });
  }, [revealed]);

  const hint = useMemo(() => (g.hinted ? hintCircle([city.lng, city.lat], city.id) : null), [g.hinted, city]);

  const reveal = useMemo(
    () =>
      revealed && result
        ? {
            truth: [city.lng, city.lat] as LngLat,
            label: cityName,
            distanceLabel: `${format.number(result.km)} km`,
            tint: tintFor(result.base),
          }
        : null,
    [revealed, result, city.lng, city.lat, cityName, format],
  );

  const previousTotal = result ? g.total - result.score : g.total;
  const announce = result
    ? t("announce", {
        km: format.number(result.km),
        score: format.number(result.score),
        verdict: t(`verdict.${result.verdict}`),
      })
    : g.pin
      ? t("pinPlaced")
      : "";

  return (
    <section className="dg-rise flex flex-1 flex-col">
      {/* ---- HUD ---- */}
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0 pb-0.5">
          <p className="text-[11px] tracking-[0.3em] text-white/70 uppercase tabular-nums">
            {t("round", { current: g.roundNumber, total: g.totalRounds })}
          </p>
          <p className="mt-1 truncate text-[9.5px] tracking-[0.24em] text-[var(--gold)] uppercase">
            {g.mode === "daily" ? t("modeDaily") : t("modeFree")}
          </p>
        </div>
        <div className="flex items-end gap-3">
          <Stat
            label={t("score")}
            value={
              <CountUp
                value={g.total}
                from={previousTotal}
                duration={900}
                delay={reduced ? 0 : 1400}
                reduced={reduced}
              />
            }
            align="right"
          />
          <SoundToggle on={g.sound} onToggle={g.setSound} label={t("soundLabel")} />
        </div>
      </header>
      <ProgressStrip g={g} />

      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
      <p id="mg-keys" className="sr-only">
        {t("keyboardHelp")}
      </p>

      <div className="mg-body mt-3 flex flex-1 flex-col gap-3">
        {/* ---- soru ---- */}
        <div
          key={`card-${g.index}`}
          className="mg-card dg-rise flex items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5"
        >
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(1.6rem,7.6vw,2.2rem)] leading-[1.05] text-white [overflow-wrap:anywhere]">
              <span className="sr-only">{t("find")}: </span>
              {cityName}
            </h1>
            <p className="mt-0.5 text-[12.5px] text-white/70">{names.country(city)}</p>
          </div>
          {g.hinted && !revealed && (
            <p className="shrink-0 rounded-full border border-[var(--gold)]/40 bg-black/20 px-3 py-1.5 text-[10.5px] leading-snug tracking-[0.04em] text-[var(--gold)]">
              {t("hintUsed", { max: format.number(MAX_HINT_ROUND_SCORE) })}
            </p>
          )}
        </div>

        {/* ---- küre ---- */}
        <div className="mg-stage relative overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#070c17]">
          <Globe
            ref={globe}
            roundKey={g.index}
            pin={g.pin}
            reveal={reveal}
            hint={hint}
            reduced={reduced}
            ariaLabel={t("globeAria", { city: cityName, country: names.country(city) })}
            keyboardHelpId="mg-keys"
            onPlace={g.place}
            onZoom={(z) => setZoomed(z > 1.25)}
            onInteract={() => setTouched(true)}
          />
          {!touched && !revealed && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-3 bottom-3 rounded-full bg-black/55 px-3 py-1.5 text-center text-[10.5px] leading-snug tracking-[0.06em] text-white/80 backdrop-blur-sm"
            >
              {t("gestureHint")}
            </p>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button type="button" aria-label={t("zoomIn")} onClick={() => globe.current?.zoomIn()} className={roundButton}>
              <Plus className="size-[18px]" aria-hidden strokeWidth={1.8} />
            </button>
            <button type="button" aria-label={t("zoomOut")} onClick={() => globe.current?.zoomOut()} className={roundButton}>
              <Minus className="size-[18px]" aria-hidden strokeWidth={1.8} />
            </button>
            {!revealed && (
              <button type="button" aria-label={t("markCenter")} title={t("markCenter")} onClick={() => globe.current?.placeAtCenter()} className={roundButton}>
                <Crosshair className="size-[18px]" aria-hidden strokeWidth={1.8} />
              </button>
            )}
            {zoomed && (
              <button type="button" aria-label={t("resetView")} title={t("resetView")} onClick={() => globe.current?.resetView()} className={roundButton}>
                <Globe2 className="size-[18px]" aria-hidden strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>

        {/* ---- eylemler ---- */}
        <div className="mg-actions">
          {!revealed ? (
            <>
              <div className="flex items-stretch gap-2.5">
                <button
                  type="button"
                  onClick={g.takeHint}
                  disabled={g.hinted}
                  aria-describedby="mg-hint-note"
                  className={`${secondaryButton} shrink-0 px-5 disabled:pointer-events-none disabled:opacity-40`}
                >
                  <Lightbulb className="size-4" aria-hidden />
                  {t("hint")}
                </button>
                <button
                  type="button"
                  onClick={g.submit}
                  disabled={!g.pin}
                  className={`${primaryButton} min-w-0 flex-1 px-4 disabled:pointer-events-none disabled:opacity-40`}
                >
                  {g.pin ? t("guess") : t("guessWaiting")}
                </button>
              </div>
              <p id="mg-hint-note" className="mt-2 text-center text-[11px] leading-snug text-white/55">
                {t("hintNote")}
              </p>
            </>
          ) : (
            result && (
              <Reveal
                g={g}
                result={result}
                guide={guideLinks[cityKey(city)]}
                nextRef={nextRef}
                reduced={reduced}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- cevap paneli ----------------------------- */
function Reveal({
  g,
  result,
  guide,
  nextRef,
  reduced,
}: {
  g: G;
  result: RoundResult;
  guide: string | undefined;
  nextRef: React.RefObject<HTMLButtonElement | null>;
  reduced: boolean;
}) {
  const t = useTranslations("MapGame");
  const format = useFormatter();
  const tint = tintFor(result.base);
  const last = g.roundNumber >= g.totalRounds;

  // Küçük ekranlarda panel kesilirse görünür yere kaydır; zaten görünüyorsa dokunma.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <div
      ref={panelRef}
      className="dg-rise rounded-[20px] border border-white/[0.1] bg-white/[0.05] p-5 backdrop-blur-xl"
      style={{ ["--dg-delay" as string]: "1200ms" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: tint }}>
            {t(`verdict.${result.verdict}`)}
          </p>
          <p className="font-display mt-2 text-[3.1rem] leading-none tabular-nums" style={{ color: tint }}>
            +<CountUp value={result.score} duration={950} delay={reduced ? 0 : 1300} reduced={reduced} />
          </p>
          <p className="mt-1.5 text-[9.5px] tracking-[0.22em] text-white/60 uppercase">
            {result.hinted ? t("roundScoreHint") : t("roundScore")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] tracking-[0.22em] text-white/60 uppercase">{t("distanceLabel")}</p>
          <p className="font-display mt-1.5 text-[1.9rem] leading-none text-white tabular-nums">
            {format.number(result.km)}
            <span className="ml-1.5 text-[0.5em] text-white/60">km</span>
          </p>
          <p className="mt-1.5 max-w-[10rem] text-[11.5px] leading-snug text-white/70">
            {result.km <= 50 ? t("onTarget") : t("awayFrom")}
          </p>
        </div>
      </div>

      {guide && (
        <Link
          href={guide}
          prefetch={false}
          className="mt-3 -mb-1 inline-flex min-h-11 items-center text-[12px] leading-snug text-[var(--gold)] underline decoration-[var(--gold)]/40 underline-offset-4 transition-colors hover:decoration-[var(--gold)]"
        >
          {t("readGuide")}
        </Link>
      )}

      <button ref={nextRef} type="button" onClick={g.next} className={`${primaryButton} mt-4 w-full`}>
        {last ? t("seeResults") : t("nextRound")}
      </button>
    </div>
  );
}

/* ----------------------------- ilerleme çizgisi ----------------------------- */
function ProgressStrip({ g }: { g: G }) {
  const t = useTranslations("MapGame");
  return (
    <div role="img" aria-label={t("progress", { done: g.results.length, total: g.totalRounds })} className="mt-3 flex gap-1">
      {Array.from({ length: g.totalRounds }, (_, i) => {
        const done = g.results[i];
        return (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-500"
            style={{
              background: done
                ? tintFor(done.base)
                : i === g.index
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(255,255,255,0.14)",
            }}
          />
        );
      })}
    </div>
  );
}
