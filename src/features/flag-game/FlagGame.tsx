"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { countries } from "@/data/countries";
import { useFlagGame } from "./useFlagGame";
import { GAME_MODES, DURATION_LABEL, modeById } from "./gameModes";
import { MAX_HINTS, currentTier } from "./scoring";
import { EASE_OUT, EASE_SOFT } from "@/lib/motion";
import { continentTr, subregionTr } from "@/lib/geoTr";

const CONTINENTS: { id: string; label: string }[] = [
  { id: "Europe", label: "Avrupa" },
  { id: "Asia", label: "Asya" },
  { id: "Africa", label: "Afrika" },
  { id: "Americas", label: "Amerika" },
  { id: "Oceania", label: "Okyanusya" },
];


/** iso3 -> common name, for turning border codes into readable hints. */
const NAME_BY_ISO3 = new Map(countries.map((c) => [c.iso3, c.name]));
const nameOf = (iso3: string) => NAME_BY_ISO3.get(iso3) ?? iso3;

export default function FlagGame() {
  const g = useFlagGame();
  const accent = modeById(g.mode).accent;

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#06090f]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ background: `radial-gradient(ellipse 70% 55% at 50% -5%, ${accent}1f 0%, transparent 62%)` }}
        transition={{ duration: 1, ease: EASE_SOFT }}
      />
      {/* Entrance-only transitions, deliberately NOT AnimatePresence with
          mode="wait". That variant holds the incoming screen until the outgoing
          one finishes exiting, so a stalled exit — a throttled tab, a dropped
          frame budget — leaves the player staring at nothing. Screen changes
          are user-initiated and infrequent; replaying an entrance on a keyed
          remount looks the same and cannot deadlock. */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col px-4 py-16 sm:px-8 sm:py-20">
        {g.screen === "setup" && <Setup key="setup" g={g} />}
        {g.screen === "playing" && <Playing key="playing" g={g} accent={accent} />}
        {g.screen === "results" && <Results key="results" g={g} accent={accent} />}
        {g.screen === "review" && <Review key="review" g={g} />}
      </div>
    </main>
  );
}

type G = ReturnType<typeof useFlagGame>;

const screenIn = {
  initial: { opacity: 0, y: 22, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.5, ease: EASE_OUT },
};

/* ============================== SETUP ============================== */
function Setup({ g }: { g: G }) {
  const mode = modeById(g.mode);
  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col justify-center">
      <p className="flex items-center gap-3 text-[11px] tracking-[0.4em] text-white/40 uppercase">
        <span className="inline-block h-px w-8 bg-white/20" />
        {g.poolSize} bayrak
      </p>
      <h1 className="font-display mt-5 text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.02] text-white">
        Bayrağı Bil
      </h1>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/45">
        Dünyadaki her ülke. Üç ipucu; her biri bir öncekinden daha az puan.
      </p>

      {g.loaded && g.saved.played > 0 && (
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Stat label="Seviye" value={g.progression.level} />
          <Stat label="XP" value={g.saved.xp} />
          <Stat label="En iyi seri" value={g.saved.bestStreak} />
          <Stat label="Öğrenilen" value={g.saved.learned.length} />
        </div>
      )}

      <div className="mt-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_MODES.map((m) => {
          const active = g.mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => g.setMode(m.id)}
              aria-pressed={active}
              className="group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                borderColor: active ? m.accent + "80" : "rgba(255,255,255,0.08)",
                background: active ? m.accent + "14" : "rgba(255,255,255,0.02)",
              }}
            >
              <span
                className="block text-[13px] font-semibold tracking-[0.06em]"
                style={{ color: active ? m.accent : "rgba(255,255,255,0.9)" }}
              >
                {m.name}
              </span>
              <span className="mt-1.5 block text-[12.5px] leading-relaxed text-white/40">
                {m.tagline}
              </span>
              {g.loaded && g.saved.bestScore[m.id] > 0 && (
                <span className="mt-2 block text-[10px] tracking-[0.2em] text-white/30 uppercase tabular-nums">
                  Rekor {g.saved.bestScore[m.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* mode-specific options */}
      <AnimatePresence mode="wait">
        {mode.durations && (
          <Options key="dur" label="Ne kadar sürsün?">
            {mode.durations.map((d) => (
              <Chip key={d} active={g.duration === d} onClick={() => g.setDuration(d)} accent={mode.accent}>
                {DURATION_LABEL[d]}
              </Chip>
            ))}
          </Options>
        )}
        {mode.lives && (
          <Options key="lives" label="Kaç can?">
            {mode.lives.map((l) => (
              <Chip key={l} active={g.lives === l} onClick={() => g.setLives(l)} accent={mode.accent}>
                {l} can
              </Chip>
            ))}
          </Options>
        )}
      </AnimatePresence>

      <Options label="Hangi bölge?">
        <Chip active={g.continent === null} onClick={() => g.setContinent(null)} accent={mode.accent}>
          Tüm dünya
        </Chip>
        {CONTINENTS.map((c) => (
          <Chip key={c.id} active={g.continent === c.id} onClick={() => g.setContinent(c.id)} accent={mode.accent}>
            {c.label}
          </Chip>
        ))}
      </Options>

      <button
        onClick={g.start}
        className="mt-10 self-start rounded-full bg-white px-9 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
      >
        Oynamaya başla
      </button>
    </motion.section>
  );
}

/* ============================= PLAYING ============================= */
function Playing({ g, accent }: { g: G; accent: string }) {
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  /** Timestamp guard against a double submit (Enter + click firing together). */
  const lastSubmit = useRef(0);
  const c = g.current;
  const revealed = g.status !== "guessing";
  const tier = currentTier(g.streak);

  // New round: clear the field and put the caret back so play continues
  // keyboard-only.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setGuess("");
      if (g.status === "guessing") inputRef.current?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [g.round, g.status]);

  /**
   * The input is cleared on EVERY submission, right or wrong.
   *
   * Previously it only cleared on a correct answer, so a wrong guess stayed in
   * the field and the next attempt got appended to it ("Trkiye" + "Türkiye").
   * Focus is restored on the next frame so a player never has to touch the
   * mouse — which matters most in Time Attack.
   *
   * Only the text is reset. The flag, hints, score, streak, attempts and timer
   * all stay exactly as they were.
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Time-based rather than a boolean released in requestAnimationFrame: a
    // rAF-released flag stays stuck if frames stall, which silently swallowed
    // every subsequent submission. This one always frees itself.
    const now = performance.now();
    if (now - lastSubmit.current < 120) return;
    lastSubmit.current = now;

    const correct = g.submit(guess);
    // Cleared on EVERY submission, right or wrong. Previously only a correct
    // answer cleared it, so the next attempt was appended to the failed one
    // ("Trkiye" + "Türkiye").
    setGuess("");

    // Focus immediately so typing can resume with no dependency on a frame
    // landing; preventScroll stops a mobile keyboard jumping the page.
    if (!correct) inputRef.current?.focus({ preventScroll: true });
  };

  const timePct = g.mode === "timeattack" ? g.remaining / g.duration : 1;
  const low = g.mode === "timeattack" && g.remaining <= 10;

  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col">
      {/* ---- HUD ---- */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex items-center gap-5">
          <AnimatedStat label="Puan" value={g.score} />
          <Stat label="Tur" value={g.round} />
          <Stat label="Seri" value={g.streak} />
          {g.mode === "survival" && (
            <div>
              <p className="text-[9px] tracking-[0.26em] text-white/30 uppercase">Can</p>
              <p className="mt-0.5 text-[1.1rem] leading-none">
                {"♥".repeat(Math.max(0, g.livesLeft))}
                <span className="text-white/15">{"♥".repeat(Math.max(0, g.lives - g.livesLeft))}</span>
              </p>
            </div>
          )}
        </div>
        <button
          onClick={g.quit}
          className="min-h-11 rounded-full border border-white/12 px-4 py-1.5 text-[10.5px] tracking-[0.16em] text-white/50 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
        >
          Oturumu bitir
        </button>
      </header>

      {/* ---- timer ---- */}
      {g.mode === "timeattack" && (
        <div className="mb-7">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[9px] tracking-[0.26em] text-white/30 uppercase">Kalan süre</span>
            <motion.span
              animate={{ color: low ? "#ff6b6b" : "#ffffff", scale: low ? [1, 1.06, 1] : 1 }}
              transition={{ duration: 0.6, repeat: low ? Infinity : 0 }}
              className="font-display text-[1.5rem] leading-none tabular-nums"
            >
              {String(Math.floor(g.remaining / 60)).padStart(2, "0")}:
              {String(g.remaining % 60).padStart(2, "0")}
            </motion.span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${timePct * 100}%`, backgroundColor: low ? "#ff6b6b" : accent }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center">
        {/* ---- flag ---- */}
        <AnimatePresence mode="wait">
          {c && (
            <motion.div
              key={c.iso2 + g.round}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="w-full max-w-[420px]"
            >
              <div className="relative overflow-hidden rounded-[18px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/12">
                {/* Neutral alt text while guessing so the answer cannot leak to
                    a screen reader or to view-source. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${c.iso2.toLowerCase()}.svg`}
                  alt={revealed ? `${c.name} bayrağı` : "Tanımlanacak bayrak"}
                  width={840}
                  height={630}
                  className="block aspect-[4/3] w-full bg-[#0d1119] object-contain"
                  draggable={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- combo ---- */}
        <div className="mt-4 h-7">
          <AnimatePresence>
            {g.combo && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="flex items-center justify-center gap-2 text-[13px]"
                style={{ color: accent }}
              >
                <span>{g.combo.icon}</span>
                <span className="tracking-[0.14em] uppercase">
                  {g.combo.label} · üst üste {g.streak}
                </span>
              </motion.div>
            )}
            {!g.combo && tier && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[11px] tracking-[0.2em] text-white/25 uppercase"
              >
                {tier.icon} {g.streak} seri
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ---- hints ---- */}
        <div className="w-full max-w-[420px] space-y-2">
          <AnimatePresence initial={false}>
            {c && g.hints >= 1 && (
              <Hint key="h1" label="Başkent">
                {c.capital.length ? c.capital.join(" · ") : "Kayıtlı resmî başkent yok"}
              </Hint>
            )}
            {c && g.hints >= 2 && (
              <Hint key="h2" label="Kıta">
                {continentTr(c.continent)}
                {c.subregion ? ` — ${subregionTr(c.subregion)}` : ""}
              </Hint>
            )}
            {c && g.hints >= 3 && (
              <Hint key="h3" label="Kara sınırı">
                {c.borders.length
                  ? c.borders.slice(0, 4).map(nameOf).join(", ") +
                    (c.borders.length > 4 ? ` — ve ${c.borders.length - 4} tane daha` : "")
                  : "Bu ülkenin kara sınırı yok."}
              </Hint>
            )}
          </AnimatePresence>
        </div>

        {/* ---- answer ---- */}
        <div className="mt-6 w-full max-w-[420px]">
          {!revealed ? (
            <form onSubmit={onSubmit}>
              <label htmlFor="guess" className="sr-only">
                Bu bayrak hangi ülkeye ait?
              </label>
              <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] p-1.5 backdrop-blur-xl transition-colors duration-500 focus-within:border-white/30">
                <input
                  id="guess"
                  ref={inputRef}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Ülkenin adını yaz"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[15px] text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="min-h-11 shrink-0 rounded-full bg-white px-4 py-2.5 text-[10.5px] font-semibold tracking-[0.14em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] sm:px-5 sm:text-[11px] sm:tracking-[0.18em]"
                >
                  Tahmin et
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={g.revealHint}
                  disabled={g.hints >= MAX_HINTS}
                  className="min-h-11 rounded-full border border-white/12 px-4 py-2 text-[10.5px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white disabled:opacity-40"
                >
                  {g.hints >= MAX_HINTS ? "Tüm ipuçları açıldı" : `İpucu ver (${g.hints}/${MAX_HINTS})`}
                </button>
                <button
                  type="button"
                  onClick={g.giveUp}
                  className="min-h-11 rounded-full border border-white/12 px-4 py-2 text-[10.5px] tracking-[0.16em] text-white/45 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
                >
                  Cevabı göster
                </button>
              </div>
            </form>
          ) : (
            <RoundResult g={g} accent={accent} />
          )}

          <div aria-live="polite" className="mt-3 min-h-[20px] text-center">
            <AnimatePresence mode="wait">
              {g.message && !revealed && (
                <motion.p
                  key={g.message + g.wrong}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE_SOFT }}
                  className="text-[12.5px] text-white/45"
                >
                  {g.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* --------------------------- round result --------------------------- */
function RoundResult({ g, accent }: { g: G; accent: string }) {
  const c = g.current!;
  const correct = g.status === "correct";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[10px] tracking-[0.36em] uppercase"
            style={{ color: correct ? accent : "rgba(255,255,255,0.4)" }}
          >
            {correct ? "Doğru" : "Cevap şuydu"}
          </p>
          <h2 className="font-display mt-2 text-[2rem] leading-none text-white">{c.name}</h2>
          <p className="mt-1 text-[12px] text-white/40">{c.officialName}</p>
        </div>
        {correct && g.lastScore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
            className="shrink-0 text-right"
          >
            <p className="font-display text-[1.8rem] leading-none" style={{ color: accent }}>
              +{g.lastScore.total}
            </p>
            <p className="mt-1 text-[9.5px] tracking-[0.14em] text-white/35 uppercase tabular-nums">
              {g.lastScore.base} temel
              {g.lastScore.speedBonus > 0 && ` · +${g.lastScore.speedBonus} hız`}
              {g.lastScore.comboBonus > 0 && ` · +${g.lastScore.comboBonus} kombo`}
            </p>
          </motion.div>
        )}
      </div>

      <div className="mt-5 space-y-2 border-t border-white/[0.08] pt-4 text-[13px]">
        <Fact label="Başkent" value={c.capital.join(" · ") || "—"} />
        <Fact label="Kıta" value={`${continentTr(c.continent)}${c.subregion ? ` — ${subregionTr(c.subregion)}` : ""}`} />
        <Fact
          label="Kara sınırı"
          value={c.borders.length ? c.borders.map(nameOf).join(", ") : "Yok — bu ülkenin kara sınırı yok."}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={g.nextRound}
          className="rounded-full bg-white px-6 py-2.5 text-[11px] font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
        >
          Sıradaki bayrak
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/12 px-5 py-2.5 text-[11px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
        >
          Bu ülkeyi keşfet
        </Link>
      </div>
    </motion.div>
  );
}

/* ============================= RESULTS ============================= */
function Results({ g, accent }: { g: G; accent: string }) {
  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col justify-center">
      <p className="text-[11px] tracking-[0.42em] text-white/40 uppercase">Oturum bitti</p>
      <h1 className="font-display mt-4 text-[clamp(3rem,9vw,5rem)] leading-none text-white">
        <AnimatedNumber value={g.score} />
        <span className="ml-3 text-[0.35em] tracking-[0.2em] text-white/35 uppercase">puan</span>
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        <Stat label="Doğru" value={g.correct} />
        <Stat label="Yanlış" value={g.wrong} />
        <Stat label="İsabet" value={`%${g.accuracy}`} />
        <Stat label="En iyi seri" value={g.bestStreak} />
        <Stat label="Ort. süre" value={g.avgTime ? `${(g.avgTime / 1000).toFixed(1)} sn` : "—"} />
        <Stat label="Kullanılan ipucu" value={g.hintsUsed} />
        <Stat label="Öğrenilen ülke" value={g.loaded ? g.saved.learned.length : 0} />
        <Stat label="Oynanan süre" value={`${Math.floor(g.elapsedSec / 60)}dk ${g.elapsedSec % 60}sn`} />
      </div>

      {/* level progress */}
      {g.loaded && (
        <div className="mt-10 max-w-sm">
          <div className="mb-2 flex items-baseline justify-between text-[10px] tracking-[0.2em] text-white/35 uppercase">
            <span>Seviye {g.progression.level}</span>
            <span className="tabular-nums">
              {g.progression.into} / {g.progression.needed} XP
            </span>
          </div>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(g.progression.into / g.progression.needed) * 100}%` }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.3 }}
              style={{ background: accent }}
            />
          </div>
        </div>
      )}

      <div className="mt-11 flex flex-wrap items-center gap-2.5">
        <button
          onClick={g.start}
          className="rounded-full bg-white px-7 py-3 text-[11.5px] font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
        >
          Tekrar oyna
        </button>
        <Ghost onClick={g.backToSetup}>Modu değiştir</Ghost>
        {g.misses.length > 0 && <Ghost onClick={g.review}>{g.misses.length} yanlışı incele</Ghost>}
        <Link
          href="/"
          className="rounded-full border border-white/12 px-6 py-3 text-[11.5px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
        >
          Ülkeleri keşfet
        </Link>
      </div>
    </motion.section>
  );
}

/* ============================== REVIEW ============================== */
function Review({ g }: { g: G }) {
  return (
    <motion.section {...screenIn} className="flex flex-1 flex-col py-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.42em] text-white/40 uppercase">İnceleme</p>
          <h1 className="font-display mt-3 text-[clamp(2rem,5vw,3rem)] leading-none text-white">
            Bilemediğin {g.misses.length} bayrak
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={g.replayMissed}
            className="rounded-full bg-white px-6 py-2.5 text-[11px] font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
          >
            Bunları tekrar oyna
          </button>
          <Ghost onClick={() => g.setScreen("results")}>Geri</Ghost>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {g.misses.map(({ country: c }, i) => (
          <motion.div
            key={c.iso2 + i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.05 }}
            className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/flags/${c.iso2.toLowerCase()}.svg`}
              alt={`${c.name} bayrağı`}
              width={84}
              height={63}
              className="h-[63px] w-[84px] shrink-0 rounded-[3px] object-cover ring-1 ring-white/12"
            />
            <div className="min-w-0">
              <h3 className="font-display text-[1.15rem] leading-tight text-white">{c.name}</h3>
              <p className="mt-1 text-[12px] text-white/45">
                {c.capital.join(" · ") || "—"} · {continentTr(c.continent)}
              </p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-white/35">
                {c.borders.length ? `Komşuları: ${c.borders.map(nameOf).join(", ")}` : "Kara sınırı yok"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

/* ============================= PRIMITIVES ============================= */
function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.26em] text-white/30 uppercase">{label}</p>
      <p className="font-display mt-0.5 text-[1.4rem] leading-none text-white tabular-nums">{value}</p>
    </div>
  );
}

function AnimatedStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.26em] text-white/30 uppercase">{label}</p>
      <p
        className="font-display mt-0.5 text-[1.4rem] leading-none text-white tabular-nums"
        aria-live="polite"
      >
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}

/** Counts up to the target rather than snapping. */
function AnimatedNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const dur = 550;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown}</>;
}

function Options({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="overflow-hidden"
    >
      <p className="mt-7 mb-2.5 text-[9.5px] tracking-[0.26em] text-white/30 uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </motion.div>
  );
}

function Chip({
  active,
  onClick,
  accent,
  children,
}: {
  active: boolean;
  onClick: () => void;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="min-h-11 rounded-full px-4 py-2 text-[11px] tracking-[0.14em] uppercase transition-all duration-400"
      style={{
        background: active ? accent + "22" : "transparent",
        color: active ? accent : "rgba(255,255,255,0.45)",
        border: `1px solid ${active ? accent + "66" : "rgba(255,255,255,0.10)"}`,
      }}
    >
      {children}
    </button>
  );
}

function Ghost({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/12 px-6 py-3 text-[11.5px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
    >
      {children}
    </button>
  );
}

function Hint({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -6 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.42, ease: EASE_OUT }}
      className="overflow-hidden"
    >
      <div className="flex items-baseline gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
        <span className="shrink-0 text-[9.5px] tracking-[0.22em] text-[var(--gold)]/70 uppercase">
          {label}
        </span>
        <span className="text-[13.5px] text-white/80">{children}</span>
      </div>
    </motion.div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-[9.5px] tracking-[0.22em] text-white/35 uppercase">{label}</span>
      <span className="text-right text-white/80">{value}</span>
    </div>
  );
}
