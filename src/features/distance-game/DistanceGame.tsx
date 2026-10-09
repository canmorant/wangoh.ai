"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { motion } from "framer-motion";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EASE_OUT } from "@/lib/motion";
import { cityDisplayName } from "@/data/worldCityNames";
import { cityKey, type City } from "./cities";
import { ROUNDS_PER_GAME, verdictFor } from "./scoring";
import { SLIDER_STEPS, SLIDER_TICKS, positionFromKm } from "./slider";
import { useDistanceGame, type RoundResult } from "./useDistanceGame";

/**
 * "Kaç kilometre?" — iki şehir arasındaki mesafeyi logaritmik kaydırıcıyla
 * tahmin etme oyunu. Tamamen çevrimdışı: şehir verisi bu sayfanın paketinde,
 * hiçbir ağ isteği yok (bayrak görseli bile kullanılmıyor).
 *
 * Sunucudan gelen iki küçük harita (page.tsx):
 *   countryNames  ISO2 → o dildeki ülke adı
 *   guideLinks    "ISO2:veri adı" → şehir rehberinin iç yolu (rehberi olanlar;
 *                 anahtarları soru seçiminde A kademesinin bir kuralı)
 *   guideNames    "ISO2:veri adı" → sitedeki Türkçe şehir adı (Türkçe arayüzde
 *                 ekranda bu görünür)
 */
type Props = {
  countryNames: Record<string, string>;
  guideLinks: Record<string, string>;
  guideNames: Record<string, string>;
};

type G = ReturnType<typeof useDistanceGame>;

const ACCENT = "#c8a45e";

/** Puana göre renk: bayrak oyunundaki mod renkleriyle aynı dil. */
const tintFor = (score: number) => (score >= 810 ? "#3fae9a" : score >= 560 ? ACCENT : score >= 250 ? "#d4795a" : "#e0537a");

const screenIn = {
  initial: { opacity: 0, y: 22, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.5, ease: EASE_OUT },
};

const primaryButton =
  "rounded-full bg-white px-9 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white";

export default function DistanceGame({ countryNames, guideLinks, guideNames }: Props) {
  const guided = useMemo(() => new Set(Object.keys(guideLinks)), [guideLinks]);
  const g = useDistanceGame(guided);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [g.screen]);

  // Ekran yazı tipinin (Instrument Serif) Türkçe/Orta Avrupa harfli parçasını sayfa
  // açılırken, bağlantı varken indir. Aksi hâlde oyun sırasında ilk "Ş", "ı" ya da
  // "ł" görününce tarayıcı yazı tipini ağdan ister; çevrimdışıyken bu istek
  // başarısız olur ve harf yedek yazı tipiyle çizilir.
  useEffect(() => {
    try {
      void document.fonts?.load('400 1em "Instrument Serif"', "ŞşĞğİıŁłŃńĆćŚśŹźŻżĐđŐőŰű").catch(() => {});
    } catch {
      /* yazı tipi API'si yoksa sorun değil */
    }
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#06090f]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${ACCENT}1f 0%, transparent 62%)` }}
      />
      {/* Ekran geçişleri yalnız giriş animasyonu (AnimatePresence "wait" yok): çıkış
          takılırsa oyuncu boş ekrana bakmasın. Bayrak oyunuyla aynı gerekçe. */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-xl flex-col px-4 pt-20 pb-8 sm:px-8 sm:pt-24">
        {g.screen === "intro" && <Intro key="intro" g={g} />}
        {g.screen === "playing" && g.round && (
          <Playing key="playing" g={g} countryNames={countryNames} guideLinks={guideLinks} guideNames={guideNames} />
        )}
        {g.screen === "results" && <Results key="results" g={g} countryNames={countryNames} guideNames={guideNames} />}
        <Credit />
      </div>
    </main>
  );
}

/* ----------------------------- adlar ----------------------------- */

function useNames(countryNames: Record<string, string>, guideNames: Record<string, string>) {
  const locale = useLocale();
  return {
    city: (c: City) => cityDisplayName(c.name, c.iso2, locale, guideNames[cityKey(c)]),
    country: (c: City) => countryNames[c.iso2] ?? c.iso2,
  };
}

/* ============================== INTRO ============================== */
function Intro({ g }: { g: G }) {
  const t = useTranslations("DistanceGame");
  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col justify-center py-6">
      <p className="flex items-center gap-3 text-[11px] tracking-[0.4em] text-white/40 uppercase">
        <span className="inline-block h-px w-8 bg-white/20" />
        {t("eyebrow", { rounds: ROUNDS_PER_GAME })}
      </p>
      <h1 className="font-display mt-5 text-[clamp(2.6rem,10vw,3.8rem)] leading-[1.02] text-white">{t("title")}</h1>
      <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-white/50">
        {t("intro", { rounds: ROUNDS_PER_GAME })}
      </p>

      <ul className="mt-7 max-w-md space-y-3 text-[13px] leading-relaxed text-white/40">
        {(["howScale", "howScore", "offline"] as const).map((key) => (
          <li key={key} className="flex gap-3">
            <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--gold)]/60" />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>

      {g.loaded && g.saved.played > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Stat label={t("bestResult")} value={<Num value={g.saved.best} />} />
          <Stat label={t("gamesPlayed")} value={<Num value={g.saved.played} />} />
        </div>
      )}

      <button onClick={g.start} className={`${primaryButton} mt-9 self-start`}>
        {t("start")}
      </button>
    </motion.section>
  );
}

/* ============================= PLAYING ============================= */
function Playing({ g, countryNames, guideLinks, guideNames }: { g: G } & Props) {
  const t = useTranslations("DistanceGame");
  const format = useFormatter();
  const names = useNames(countryNames, guideNames);
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

  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col">
      {/* ---- HUD ---- */}
      <header className="flex items-end justify-between gap-4">
        <p className="pb-0.5 text-[11px] tracking-[0.3em] text-white/50 uppercase tabular-nums">
          {t("round", { current: g.roundNumber, total: g.totalRounds })}
        </p>
        <Stat label={t("score")} value={<Num value={g.total} />} align="right" />
      </header>
      <ProgressStrip g={g} />

      {/* ---- soru ---- */}
      <h1 className="sr-only">
        {t.rich("question", {
          a: names.city(round.a),
          b: names.city(round.b),
          city: (chunks) => <strong>{chunks}</strong>,
        })}
      </h1>
      {/* Şehir kartları, başlık ile kontroller arasındaki boşlukta ortalı; kontroller
          altta, baş parmağın erişiminde. */}
      <div className="flex min-h-6 flex-1 flex-col justify-center py-6">
        <div className="flex items-stretch gap-2.5">
          <CityCard city={round.a} names={names} guideLinks={guideLinks} showGuide={revealed} />
          <CityCard city={round.b} names={names} guideLinks={guideLinks} showGuide={revealed} />
        </div>
        <p className="mt-3 text-center text-[10.5px] tracking-[0.28em] text-white/35 uppercase">{t("caption")}</p>
      </div>

      {/* ---- tahmin ---- */}
      {!revealed ? (
        <div>
          <p className="text-center">
            <output
              aria-hidden
              className="font-display text-[clamp(3.4rem,17vw,5rem)] leading-none text-white tabular-nums"
            >
              {format.number(g.guess)}
            </output>
            <span className="ml-2 text-[1.2rem] text-white/40">km</span>
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
              aria-valuetext={t("sliderValueText", { km: format.number(g.guess) })}
              className="km-range min-w-0 flex-1"
              style={sliderStyle}
            />
            <StepButton direction={1} label={t("increase")} onStep={g.nudge} />
          </div>

          {/* Ölçek işaretleri: kaydırıcı logaritmik olduğu için eşit aralıklı. */}
          <div aria-hidden className="relative mx-[calc(2.75rem_+_0.5rem_+_14px)] mt-0.5 h-4 text-[10px] text-white/30 tabular-nums">
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
          <p className="mt-1 text-center text-[10px] tracking-[0.2em] text-white/25 uppercase">{t("scaleHint")}</p>

          <button type="button" onClick={g.submit} className={`${primaryButton} mt-6 w-full`}>
            {t("guess")}
          </button>
        </div>
      ) : (
        result && <Reveal g={g} result={result} nextRef={nextRef} />
      )}
    </motion.section>
  );
}

/* ----------------------------- şehir kartı ----------------------------- */
function CityCard({
  city,
  names,
  guideLinks,
  showGuide,
}: {
  city: City;
  names: ReturnType<typeof useNames>;
  guideLinks: Record<string, string>;
  showGuide: boolean;
}) {
  const t = useTranslations("DistanceGame");
  const guide = guideLinks[cityKey(city)];
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-4">
      <h2 className="font-display text-[clamp(1.6rem,8vw,2.3rem)] leading-[1.05] text-white [overflow-wrap:anywhere]">
        {names.city(city)}
      </h2>
      <p className="mt-1.5 text-[12px] text-white/45">{names.country(city)}</p>
      {showGuide && guide && (
        <Link
          href={guide}
          prefetch={false}
          className="mt-3 text-[11.5px] leading-snug text-[var(--gold)]/85 underline decoration-[var(--gold)]/30 underline-offset-4 transition-colors hover:text-[var(--gold)]"
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
}: {
  g: G;
  result: RoundResult;
  nextRef: RefObject<HTMLButtonElement | null>;
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
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      aria-live="polite"
      className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: tint }}>
            {t(`verdict.${verdict}`)}
          </p>
          <p className="font-display mt-2 text-[3.1rem] leading-none tabular-nums" style={{ color: tint }}>
            +<Num value={result.score} />
          </p>
          <p className="mt-1.5 text-[9.5px] tracking-[0.22em] text-white/35 uppercase">{t("roundScore")}</p>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] tracking-[0.22em] text-white/35 uppercase">{t("errorLabel")}</p>
          <p className="font-display mt-1.5 text-[1.9rem] leading-none text-white tabular-nums">{percent}</p>
          <p className="mt-1.5 text-[11px] text-white/45">{t(`direction.${direction}`)}</p>
        </div>
      </div>

      <Ruler guess={result.guess} actual={result.round.km} tint={tint} />

      <dl className="grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-4">
        <div>
          <dt className="text-[9.5px] tracking-[0.22em] text-white/35 uppercase">{t("actualDistance")}</dt>
          <dd className="font-display mt-1 text-[1.5rem] leading-none text-white tabular-nums">
            <Num value={result.round.km} /> <span className="text-[0.9rem] text-white/40">km</span>
          </dd>
        </div>
        <div>
          <dt className="text-[9.5px] tracking-[0.22em] text-white/35 uppercase">{t("yourGuess")}</dt>
          <dd className="font-display mt-1 text-[1.5rem] leading-none text-white/80 tabular-nums">
            <Num value={result.guess} /> <span className="text-[0.9rem] text-white/40">km</span>
          </dd>
        </div>
      </dl>

      <button ref={nextRef} type="button" onClick={g.next} className={`${primaryButton} mt-6 w-full`}>
        {last ? t("seeResults") : t("nextRound")}
      </button>
    </motion.div>
  );
}

/**
 * Tahmin ve gerçek mesafe, kaydırıcıyla AYNI logaritmik ölçekte: iki nokta
 * arasındaki boşluk "ne kadar yanıldın"ı gösterir. Harita gerekmiyor.
 */
function Ruler({ guess, actual, tint }: { guess: number; actual: number; tint: string }) {
  const t = useTranslations("DistanceGame");
  const at = (km: number) => (positionFromKm(km) / SLIDER_STEPS) * 100;
  const guessAt = at(guess);
  const actualAt = at(actual);
  // Etiketler uçlardaki noktalarda ekran dışına taşmasın: merkezleri kenardan en az 28px içeride.
  const labelAt = (percent: number) => `clamp(28px, ${percent}%, calc(100% - 28px))`;
  return (
    <div aria-hidden className="relative mx-6 mt-9 mb-10 h-1.5 rounded-full bg-white/10">
      {SLIDER_TICKS.map((km) => (
        <span key={km} className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/20" style={{ left: `${at(km)}%` }} />
      ))}
      <span
        className="absolute top-0 h-full rounded-full"
        style={{ left: `${Math.min(guessAt, actualAt)}%`, width: `${Math.abs(guessAt - actualAt)}%`, background: tint }}
      />
      {/* gerçek: dolu nokta, altta etiket */}
      <span
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#0b0f18]"
        style={{ left: `${actualAt}%`, background: tint }}
      />
      <span
        className="absolute top-full mt-3.5 -translate-x-1/2 text-[9.5px] tracking-[0.18em] whitespace-nowrap uppercase"
        style={{ left: labelAt(actualAt), color: tint }}
      >
        {t("rulerActual")}
      </span>
      {/* tahmin: içi boş halka, üstte etiket */}
      <span
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0b0f18]"
        style={{ left: `${guessAt}%` }}
      />
      <span
        className="absolute bottom-full mb-3.5 -translate-x-1/2 text-[9.5px] tracking-[0.18em] whitespace-nowrap text-white/60 uppercase"
        style={{ left: labelAt(guessAt) }}
      >
        {t("rulerGuess")}
      </span>
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
            className="h-1 flex-1 rounded-full"
            style={{
              background: done ? tintFor(done.score) : i === g.index ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.1)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================= RESULTS ============================= */
function Results({ g, countryNames, guideNames }: { g: G } & Pick<Props, "countryNames" | "guideNames">) {
  const t = useTranslations("DistanceGame");
  const format = useFormatter();
  const names = useNames(countryNames, guideNames);
  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col py-4">
      <p className="text-[11px] tracking-[0.42em] text-white/40 uppercase">{t("gameOver")}</p>
      <h1 className="mt-4">
        <span className="block text-[10px] tracking-[0.26em] text-white/35 uppercase">{t("totalScore")}</span>
        <span className="font-display mt-1 block text-[clamp(3.6rem,17vw,5.5rem)] leading-none text-white tabular-nums">
          <Num value={g.total} />
          <span className="ml-3 text-[0.3em] tracking-[0.12em] text-white/35">
            {t("outOf", { max: format.number(g.maxTotal) })}
          </span>
        </span>
      </h1>

      <p className="mt-4 text-[13px] tracking-[0.06em]" style={{ color: g.newBest ? "#3fae9a" : "rgba(255,255,255,0.45)" }}>
        {g.newBest ? t("newBest") : t("bestSoFar", { score: format.number(g.saved.best) })}
      </p>

      <h2 className="mt-9 text-[9.5px] tracking-[0.26em] text-white/30 uppercase">{t("recap")}</h2>
      <ol className="mt-2 border-t border-white/[0.07]">
        {g.results.map((r) => (
          <li key={r.round.a.id} className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-3">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] text-white/85">
                {names.city(r.round.a)} – {names.city(r.round.b)}
              </p>
              <p className="mt-0.5 text-[11px] text-white/35 tabular-nums">
                {t("recapDetail", { actual: format.number(r.round.km), guess: format.number(r.guess) })}
              </p>
            </div>
            <span className="font-display shrink-0 text-[1.5rem] leading-none tabular-nums" style={{ color: tintFor(r.score) }}>
              <Num value={r.score} />
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-9 flex flex-wrap items-center gap-2.5">
        <button onClick={g.start} className={primaryButton}>
          {t("playAgain")}
        </button>
        <Link
          href="/gezi-rehberleri"
          prefetch={false}
          className="rounded-full border border-white/12 px-6 py-3.5 text-[11.5px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
        >
          {t("exploreGuides")}
        </Link>
      </div>
    </motion.section>
  );
}

/* ============================= PRIMITIVES ============================= */

/** GeoNames verisinin atfı (CC BY 4.0): sayfanın altında, her ekranda. */
function Credit() {
  const t = useTranslations("DistanceGame");
  const link = (href: string) =>
    function CreditLink(chunks: ReactNode) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/60"
        >
          {chunks}
        </a>
      );
    };
  return (
    <p className="mt-10 text-center text-[10.5px] tracking-[0.04em] text-white/30">
      {t.rich("dataCredit", {
        geo: link("https://www.geonames.org/"),
        cc: link("https://creativecommons.org/licenses/by/4.0/"),
      })}
    </p>
  );
}

function Stat({ label, value, align = "left" }: { label: string; value: ReactNode; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="text-[9px] tracking-[0.26em] text-white/30 uppercase">{label}</p>
      <p className="font-display mt-0.5 text-[1.4rem] leading-none text-white tabular-nums">{value}</p>
    </div>
  );
}

/** Sayıyı dile göre biçimler (tr 1.234, en 1,234). */
function Num({ value }: { value: number }) {
  const format = useFormatter();
  return <>{format.number(value)}</>;
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

  const begin = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stop();
    onStep(direction);
    timers.current.delay = window.setTimeout(() => {
      timers.current.repeat = window.setInterval(() => onStep(direction), 60);
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
        if (e.detail === 0) onStep(direction);
      }}
      onContextMenu={(e) => e.preventDefault()}
      className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-white/12 text-[1.4rem] leading-none text-white/70 select-none transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:bg-white/10"
    >
      <span aria-hidden>{direction < 0 ? "−" : "+"}</span>
    </button>
  );
}
