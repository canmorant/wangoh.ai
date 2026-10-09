"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cityDisplayName } from "@/data/worldCityNames";
import { cityKey, type City } from "./cities";
import { MAP_HEIGHT, MAP_WIDTH } from "./mapDimensions";
import { verdictFor } from "./scoring";
import { SLIDER_STEPS, SLIDER_TICKS, positionFromKm } from "./slider";
import type { RoundResult, useDistanceGame } from "./useDistanceGame";
import { CountUp, SoundToggle, Stat, primaryButton, tintFor } from "./ui";

type G = ReturnType<typeof useDistanceGame>;

export interface Names {
  countryNames: Record<string, string>;
  guideLinks: Record<string, string>;
  guideNames: Record<string, string>;
}

/** Harita parçası yüklenirken aynı boyutta iskelet: yerleşim zıplamasın. */
function MapSkeleton() {
  return (
    <div className="px-0">
      <div className="h-[3.4rem]" />
      <div
        className="mx-auto w-full animate-pulse rounded-2xl motion-reduce:animate-none border border-white/[0.08] bg-white/[0.04]"
        style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`, maxWidth: `calc(var(--dg-map-max, 40svh) * ${MAP_WIDTH / MAP_HEIGHT})` }}
      />
    </div>
  );
}

// Harita ve dünya verisi ayrı bir parça: oyunun ilk paketine ve ana sayfaya girmez.
const RevealMap = dynamic(() => import("./RevealMap"), { ssr: false, loading: () => <MapSkeleton /> });

export function useNames({ countryNames, guideNames }: Pick<Names, "countryNames" | "guideNames">) {
  const locale = useLocale();
  return {
    city: (c: City) => cityDisplayName(c.name, c.iso2, locale, guideNames[cityKey(c)]),
    country: (c: City) => countryNames[c.iso2] ?? c.iso2,
  };
}

/* ============================= PLAYING ============================= */
export function Playing({ g, countryNames, guideLinks, guideNames }: { g: G } & Names) {
  const t = useTranslations("DistanceGame");
  const format = useFormatter();
  const reduced = useReducedMotion() ?? false;
  const names = useNames({ countryNames, guideNames });
  const round = g.round!;
  const revealed = g.phase === "revealed";
  const result = g.lastResult;

  const sliderRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Yeni tur hep sayfanın başında açılsın: cevap panelindeki "sıradaki tur" düğmesine
  // basmak için aşağı kaydırılmış olabilir.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [g.index]);

  // Klavye ile baştan sona oynanabilsin: tur başında kaydırıcıya, cevaptan sonra
  // "sıradaki tur" düğmesine odaklan.
  useEffect(() => {
    (revealed ? nextRef : sliderRef).current?.focus({ preventScroll: true });
  }, [g.index, revealed]);

  // Cevap haritasını, oyuncu tahmin ederken boşta hazırla: harita parçası ve dünya verisi
  // yüklenir, kıyı yolları çizilir. Cevap ekranında animasyonun ortasında iş kalmaz.
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      void import("./worldMap")
        .then((m) => {
          if (!cancelled) return m.prepareIdle([round.a.lng, round.a.lat], [round.b.lng, round.b.lat], round.km);
        })
        .catch(() => {});
      void import("./RevealMap").catch(() => {});
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(run, { timeout: 1500 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(run, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [round]);

  const onSliderKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      g.nudge(-1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      g.nudge(1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      g.submit();
    }
  };

  const fraction = g.position / SLIDER_STEPS;
  const sliderStyle = { "--fill": `calc(14px + (100% - 28px) * ${fraction})` } as CSSProperties;
  const previousTotal = result ? g.total - result.score : g.total;

  // Ekran okuyucuya cevap: görünür panel sonradan eklendiği için kalıcı bir canlı bölge.
  const announce = result
    ? t("announce", {
        actual: format.number(result.round.km),
        guess: format.number(result.guess),
        score: format.number(result.score),
        verdict: t(`verdict.${verdictFor(result.score)}`),
      })
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
                delay={reduced ? 0 : 500}
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

      {/* ---- soru ---- */}
      <h1 id="dg-question" className="sr-only">
        {t.rich("question", {
          a: names.city(round.a),
          b: names.city(round.b),
          city: (chunks) => <strong>{chunks}</strong>,
        })}
      </h1>

      <div className="dg-body flex flex-1 flex-col">
        {!revealed ? (
          <>
            {/* Şehir kartları, başlık ile kontroller arasındaki boşlukta ortalı; kontroller
                altta, baş parmağın erişiminde. Tur değişince kartlar sırayla yükselir. */}
            <div key={`cards-${g.index}`} className="dg-stage flex min-h-6 flex-1 flex-col justify-center py-6">
              <div className="flex items-stretch gap-2.5">
                <CityCard city={round.a} names={names} guideLinks={guideLinks} showGuide={false} delay={0} />
                <CityCard city={round.b} names={names} guideLinks={guideLinks} showGuide={false} delay={70} />
              </div>
              <p className="mt-3 text-center text-[10.5px] tracking-[0.28em] text-white/60 uppercase">{t("caption")}</p>
            </div>

            <div
              key={`controls-${g.index}`}
              className="dg-controls dg-rise"
              style={{ ["--dg-delay" as string]: "120ms" }}
            >
              <p className="text-center">
                <output
                  aria-hidden
                  className="font-display text-[clamp(3.4rem,17vw,5rem)] leading-none text-white tabular-nums"
                >
                  {format.number(g.guess)}
                </output>
                <span className="ml-2 text-[1.2rem] text-white/60">km</span>
              </p>

              <div className="mt-3 flex items-center gap-2">
                <StepButton direction={-1} label={t("decrease")} onStep={g.nudge} />
                <input
                  ref={sliderRef}
                  type="range"
                  min={0}
                  max={SLIDER_STEPS}
                  step={1}
                  value={g.position}
                  onChange={(e) => g.setPosition(Number(e.target.value))}
                  onKeyDown={onSliderKey}
                  aria-label={t("sliderLabel")}
                  aria-describedby="dg-question dg-scale-hint"
                  aria-valuetext={t("sliderValueText", { km: format.number(g.guess) })}
                  className="km-range min-w-0 flex-1"
                  style={sliderStyle}
                />
                <StepButton direction={1} label={t("increase")} onStep={g.nudge} />
              </div>

              {/* Ölçek işaretleri: kaydırıcı logaritmik olduğu için eşit aralıklı. */}
              <div
                aria-hidden
                className="relative mx-[calc(2.75rem_+_0.5rem_+_14px)] mt-0.5 h-4 text-[10px] text-white/60 tabular-nums"
              >
                {SLIDER_TICKS.map((km) => (
                  <span
                    key={km}
                    className="absolute top-0 -translate-x-1/2"
                    style={{ left: `${(positionFromKm(km) / SLIDER_STEPS) * 100}%` }}
                  >
                    {format.number(km)}
                  </span>
                ))}
              </div>
              <p id="dg-scale-hint" className="mt-1 text-center text-[10px] tracking-[0.2em] text-white/55 uppercase">
                {t("scaleHint")}
              </p>

              <button type="button" onClick={g.submit} className={`${primaryButton} mt-6 w-full`}>
                {t("guess")}
              </button>
            </div>
          </>
        ) : (
          result && (
            <>
              <div key={`map-${g.index}`} className="dg-stage dg-rise flex flex-1 flex-col justify-center py-4">
                <RevealMap
                  a={{ name: names.city(round.a), lat: round.a.lat, lng: round.a.lng }}
                  b={{ name: names.city(round.b), lat: round.b.lat, lng: round.b.lng }}
                  km={result.round.km}
                  guessKm={result.guess}
                  tint={tintFor(result.score)}
                  reduced={reduced}
                  labels={{
                    actual: t("actualDistance"),
                    guess: t("yourGuess"),
                    caption: t("mapCaption"),
                    aria: t("mapAria", {
                      a: names.city(round.a),
                      b: names.city(round.b),
                      actual: format.number(result.round.km),
                      guess: format.number(result.guess),
                    }),
                  }}
                />
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <CityCard city={round.a} names={names} guideLinks={guideLinks} showGuide compact />
                  <CityCard city={round.b} names={names} guideLinks={guideLinks} showGuide compact />
                </div>
              </div>
              <div className="dg-controls">
                <Reveal g={g} result={result} nextRef={nextRef} reduced={reduced} />
              </div>
            </>
          )
        )}
      </div>
    </section>
  );
}

/* ----------------------------- şehir kartı ----------------------------- */
function CityCard({
  city,
  names,
  guideLinks,
  showGuide,
  delay = 0,
  compact = false,
}: {
  city: City;
  names: ReturnType<typeof useNames>;
  guideLinks: Record<string, string>;
  showGuide: boolean;
  delay?: number;
  compact?: boolean;
}) {
  const t = useTranslations("DistanceGame");
  const guide = guideLinks[cityKey(city)];
  return (
    <div
      className={`dg-rise flex min-w-0 flex-1 flex-col rounded-2xl border border-white/[0.1] bg-white/[0.03] ${compact ? "px-3.5 py-3" : "px-4 py-4"}`}
      style={{ ["--dg-delay" as string]: `${delay}ms` }}
    >
      <h2
        className={`font-display leading-[1.05] text-white [overflow-wrap:anywhere] ${compact ? "text-[1.25rem]" : "text-[clamp(1.6rem,8vw,2.3rem)]"}`}
      >
        {names.city(city)}
      </h2>
      <p className={`text-white/65 ${compact ? "mt-1 text-[11.5px]" : "mt-1.5 text-[12px]"}`}>{names.country(city)}</p>
      {showGuide && guide && (
        <Link
          href={guide}
          prefetch={false}
          className="mt-1 -mb-1.5 inline-flex min-h-11 items-center text-[11.5px] leading-snug text-[var(--gold)] underline decoration-[var(--gold)]/40 underline-offset-4 transition-colors hover:decoration-[var(--gold)]"
        >
          {t("readGuide")}
        </Link>
      )}
    </div>
  );
}

/* ----------------------------- cevap paneli ----------------------------- */
function Reveal({
  g,
  result,
  nextRef,
  reduced,
}: {
  g: G;
  result: RoundResult;
  nextRef: RefObject<HTMLButtonElement | null>;
  reduced: boolean;
}) {
  const t = useTranslations("DistanceGame");
  const format = useFormatter();
  const tint = tintFor(result.score);
  const verdict = verdictFor(result.score);
  const direction = result.guess > result.round.km ? "over" : result.guess < result.round.km ? "under" : "exact";
  const percent = format.number(result.error, {
    style: "percent",
    maximumFractionDigits: result.error < 0.1 ? 1 : 0,
  });
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
      style={{ ["--dg-delay" as string]: "90ms" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: tint }}>
            {t(`verdict.${verdict}`)}
          </p>
          <p className="font-display mt-2 text-[3.1rem] leading-none tabular-nums" style={{ color: tint }}>
            +<CountUp value={result.score} duration={950} delay={reduced ? 0 : 250} reduced={reduced} />
          </p>
          <p className="mt-1.5 text-[9.5px] tracking-[0.22em] text-white/60 uppercase">{t("roundScore")}</p>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] tracking-[0.22em] text-white/60 uppercase">{t("errorLabel")}</p>
          <p className="font-display mt-1.5 text-[1.9rem] leading-none text-white tabular-nums">{percent}</p>
          <p className="mt-1.5 text-[11.5px] text-white/70">{t(`direction.${direction}`)}</p>
        </div>
      </div>

      <button ref={nextRef} type="button" onClick={g.next} className={`${primaryButton} mt-5 w-full`}>
        {last ? t("seeResults") : t("nextRound")}
      </button>
    </div>
  );
}

/* ----------------------------- ilerleme çizgisi ----------------------------- */
function ProgressStrip({ g }: { g: G }) {
  const t = useTranslations("DistanceGame");
  return (
    <div
      role="img"
      aria-label={t("progress", { done: g.results.length, total: g.totalRounds })}
      className="mt-3 flex gap-1"
    >
      {Array.from({ length: g.totalRounds }, (_, i) => {
        const done = g.results[i];
        return (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-500"
            style={{
              background: done
                ? tintFor(done.score)
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

/**
 * − / + düğmesi: bir dokunuş bir adım (görünen değeri gerçekten değiştiren bir
 * sonraki konum), basılı tutunca hızlanarak tekrarlar. Parmakla kaydırıcıyı
 * sürüklemek kaba kalıyor; ince ayar bu düğmelerle.
 */
function StepButton({
  direction,
  label,
  onStep,
}: {
  direction: 1 | -1;
  label: string;
  onStep: (direction: 1 | -1) => void;
}) {
  const timers = useRef<{ delay?: number; repeat?: number }>({});
  const stop = useCallback(() => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.repeat);
  }, []);
  useEffect(() => stop, [stop]);

  // Basılı tutarken yenilenen aralık, güncel onStep'i görsün (konum değiştikçe işlev değişir).
  const latest = useRef(onStep);
  useEffect(() => {
    latest.current = onStep;
  });

  const begin = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stop();
    latest.current(direction);
    timers.current.delay = window.setTimeout(() => {
      timers.current.repeat = window.setInterval(() => latest.current(direction), 60);
    }, 380);
  };

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={begin}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      // Klavye ve ekran okuyucu etkinleştirmesi (detail === 0) pointer olayı üretmez.
      onClick={(e) => {
        if (e.detail === 0) latest.current(direction);
      }}
      onContextMenu={(e) => e.preventDefault()}
      className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/20 text-[1.4rem] leading-none text-white/80 select-none transition-colors duration-300 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-white/10"
    >
      <span aria-hidden>{direction < 0 ? "−" : "+"}</span>
    </button>
  );
}
