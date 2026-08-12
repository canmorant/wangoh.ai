"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { countries, Country } from "@/data/countries";
import { isCorrectGuess, resolveGuess } from "./normalizeAnswer";
import { ModeId } from "./gameModes";
import {
  MAX_HINTS,
  makeBag,
  dailySeed,
  scoreRound,
  scoreRevealed,
  comboTierAt,
  ComboTier,
  xpFor,
  levelFromXp,
  RoundScore,
} from "./scoring";

export type Screen = "setup" | "playing" | "results" | "review";
export type RoundStatus = "guessing" | "correct" | "revealed";

export interface Miss {
  country: Country;
  gaveUp: boolean;
}

export interface Persisted {
  xp: number;
  bestScore: Record<string, number>;
  bestStreak: number;
  played: number;
  learned: string[];
}

const EMPTY: Persisted = { xp: 0, bestScore: {}, bestStreak: 0, played: 0, learned: [] };
const STORAGE_KEY = "wangoh.flaggame.v2";

export function useFlagGame() {
  /* ---------------------------- setup ---------------------------- */
  const [screen, setScreen] = useState<Screen>("setup");
  const [mode, setMode] = useState<ModeId>("classic");
  const [duration, setDuration] = useState(60);
  const [lives, setLives] = useState(3);
  const [continent, setContinent] = useState<string | null>(null);

  const pool = useMemo(
    () => (continent ? countries.filter((c) => c.continent === continent) : countries),
    [continent]
  );

  /* ---------------------------- round ---------------------------- */
  const bag = useRef<Country[]>([]);
  const roundStart = useRef(0);
  const [current, setCurrent] = useState<Country | null>(null);
  const [status, setStatus] = useState<RoundStatus>("guessing");
  const [hints, setHints] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<RoundScore | null>(null);
  const [combo, setCombo] = useState<ComboTier | null>(null);

  /* ---------------------------- session --------------------------- */
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [livesLeft, setLivesLeft] = useState(3);
  const [misses, setMisses] = useState<Miss[]>([]);
  const [times, setTimes] = useState<number[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [endedAt, setEndedAt] = useState(0);
  const [remaining, setRemaining] = useState(0);

  /* -------------------------- persistence ------------------------- */
  const [saved, setSaved] = useState<Persisted>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  // Loaded in an effect, never during render, so SSR and hydration agree.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setSaved({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        /* unavailable or corrupt storage should never break the game */
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const persist = useCallback((next: Persisted) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  /* ---------------------------- drawing --------------------------- */
  const draw = useCallback((): Country | null => {
    if (!bag.current.length) {
      bag.current = mode === "daily" ? makeBag(pool, dailySeed()) : makeBag(pool);
    }
    return bag.current.pop() ?? null;
  }, [pool, mode]);

  const nextRound = useCallback(() => {
    const c = draw();
    setCurrent(c);
    setStatus("guessing");
    setHints(0);
    setMessage(null);
    setLastScore(null);
    setCombo(null);
    setRound((r) => r + 1);
    roundStart.current = performance.now();
  }, [draw]);

  /* ----------------------------- start ---------------------------- */
  const start = useCallback(() => {
    bag.current = [];
    setScore(0);
    setRound(0);
    setStreak(0);
    setBestStreak(0);
    setCorrect(0);
    setWrong(0);
    setHintsUsed(0);
    setMisses([]);
    setTimes([]);
    setLivesLeft(lives);
    setRemaining(duration);
    setStartedAt(Date.now());
    setEndedAt(0);
    setScreen("playing");
    nextRound();
  }, [lives, duration, nextRound]);

  const finish = useCallback(() => {
    setEndedAt(Date.now());
    setScreen("results");
    const key = mode === "timeattack" ? `timeattack-${duration}` : mode;
    persist({
      ...saved,
      xp: saved.xp + xpFor(score),
      bestScore: { ...saved.bestScore, [key]: Math.max(saved.bestScore[key] ?? 0, score) },
      bestStreak: Math.max(saved.bestStreak, bestStreak),
      played: saved.played + 1,
    });
  }, [mode, duration, saved, score, bestStreak, persist]);

  /* ---------------------------- timer ----------------------------- */
  // Only Time Attack is timed. Kept as a 1s interval rather than rAF so it
  // keeps ticking correctly if the tab is throttled.
  useEffect(() => {
    if (screen !== "playing" || mode !== "timeattack") return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [screen, mode]);

  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);
  useEffect(() => {
    if (screen === "playing" && mode === "timeattack" && remaining === 0 && startedAt) {
      finishRef.current();
    }
  }, [remaining, screen, mode, startedAt]);

  /* ---------------------------- actions --------------------------- */
  const submit = useCallback(
    (guess: string): boolean => {
      if (!current || status !== "guessing") return false;
      const g = guess.trim();
      if (!g) return false;

      if (isCorrectGuess(g, current)) {
        const elapsed = performance.now() - roundStart.current;
        const nextStreak = streak + 1;
        const rs = scoreRound(hints, elapsed, nextStreak);

        setScore((s) => s + rs.total);
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));
        setCorrect((c) => c + 1);
        setTimes((t) => [...t, elapsed]);
        setHintsUsed((h) => h + hints);
        setStatus("correct");
        setLastScore(rs);
        setCombo(comboTierAt(nextStreak));
        setMessage(null);

        if (!saved.learned.includes(current.iso2)) {
          persist({ ...saved, learned: [...saved.learned, current.iso2] });
        }

        // Time Attack keeps the pace up: straight to the next flag.
        if (mode === "timeattack") setTimeout(() => nextRound(), 550);
        return true;
      }

      setWrong((w) => w + 1);
      setStreak(0);
      const other = resolveGuess(g);
      setMessage(
        other && other !== current.iso2
          ? "Gerçek bir ülke — ama bu bayrak o değil."
          : "Tam değil. Tekrar dene ya da ipucu aç."
      );

      if (mode === "survival") {
        setLivesLeft((l) => {
          const next = l - 1;
          if (next <= 0) {
            setMisses((m) => [...m, { country: current, gaveUp: false }]);
            setTimeout(() => finishRef.current(), 400);
          }
          return next;
        });
      }
      return false;
    },
    [current, status, hints, streak, mode, saved, persist, nextRound]
  );

  const revealHint = useCallback(() => {
    if (status !== "guessing") return;
    setHints((h) => Math.min(MAX_HINTS, h + 1));
  }, [status]);

  const giveUp = useCallback(() => {
    if (!current || status !== "guessing") return;
    setStatus("revealed");
    setStreak(0);
    setLastScore(scoreRevealed());
    setMessage(null);
    setMisses((m) => [...m, { country: current, gaveUp: true }]);
    setHintsUsed((h) => h + hints);
  }, [current, status, hints]);

  const quit = useCallback(() => finishRef.current(), []);
  const backToSetup = useCallback(() => setScreen("setup"), []);
  const review = useCallback(() => setScreen("review"), []);

  /** Replay only the flags that were missed. */
  const replayMissed = useCallback(() => {
    if (!misses.length) return;
    bag.current = makeBag(misses.map((m) => m.country));
    setScore(0);
    setRound(0);
    setStreak(0);
    setCorrect(0);
    setWrong(0);
    setMisses([]);
    setTimes([]);
    setLivesLeft(lives);
    setRemaining(duration);
    setStartedAt(Date.now());
    setEndedAt(0);
    setScreen("playing");
    nextRound();
  }, [misses, lives, duration, nextRound]);

  /* ---------------------------- derived --------------------------- */
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
  const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  // Captured when the session ends rather than read during render, which would
  // be an impure render and produce a different value on every pass.
  const elapsedSec = endedAt && startedAt ? Math.round((endedAt - startedAt) / 1000) : 0;
  const progression = levelFromXp(saved.xp);

  return {
    // screens & setup
    screen, setScreen, mode, setMode, duration, setDuration, lives, setLives,
    continent, setContinent, poolSize: pool.length,
    // round
    current, status, hints, message, lastScore, combo,
    // session
    score, round, streak, bestStreak, correct, wrong, hintsUsed,
    livesLeft, misses, remaining, accuracy, avgTime, elapsedSec,
    // persistence
    saved, loaded, progression,
    // actions
    start, submit, revealHint, giveUp, nextRound, finish, quit,
    backToSetup, review, replayMissed,
  };
}
