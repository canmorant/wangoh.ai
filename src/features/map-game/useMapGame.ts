"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  averageScore,
  currentStreak,
  dailySeed,
  dateKeyOf,
  EMPTY_STATS,
  parseStats,
  recordGame,
  type DateKey,
  type GameMode,
  type RecordOutcome,
  type Stats,
} from "../distance-game/daily";
import { setSoundEnabled, soundFinish, soundGuess, soundResult, soundTick, unlockAudio, vibrate } from "../distance-game/feedback";
import type { LngLat } from "../distance-game/mapGeometry";
import { INITIAL_STATE, reducer } from "./gameReducer";
import { pickTargets } from "./pickTargets";
import { MAP_ROUNDS, MAX_GAME_SCORE } from "./scoring";

export type { Phase, RoundResult, Screen } from "./gameReducer";
export type { GameMode } from "../distance-game/daily";

/** localStorage anahtarı; çerez politikasında belgeli (3 dil). */
export const STORAGE_KEY = "wangoh.mapgame.v1";
/** Günün Turu tohumunun tuzu: Kaç kilometre?'den ayrı bir dizi üretir. */
export const DAILY_SALT = "wangoh.haritada";

export interface Outcome extends Pick<RecordOutcome, "counted" | "official" | "newBest" | "streak"> {
  mode: GameMode;
  dateKey: DateKey | null;
  officialTotal: number | null;
  stats: Stats;
}

/** `guided`: sitenin rehberi olan şehirlerin anahtarları ("ISO2:veri adı"); soru kademesinde kullanılır. */
export function useMapGame(guided?: ReadonlySet<string>) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  /* -------------------------- kalıcılık -------------------------- */
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loaded, setLoaded] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [today, setToday] = useState<DateKey | null>(null);

  // Efekt içinde okunur, render sırasında asla: SSR ve hidrasyon aynı çıktıyı versin.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      let loadedStats = EMPTY_STATS;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) loadedStats = parseStats(JSON.parse(raw), MAP_ROUNDS);
      } catch {
        /* depolama kapalı ya da bozuk: oyun yine de çalışmalı */
      }
      setStats(loadedStats);
      setSoundEnabled(loadedStats.sound);
      setToday(dateKeyOf());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Gece yarısı geçtiyse (sekme açık kaldı) giriş ekranındaki "bugün" güncellensin.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") setToday(dateKeyOf());
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const persist = useCallback((next: Stats) => {
    setStats(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* yok say */
    }
  }, []);

  /* ----------------------------- türetilen ----------------------------- */
  const total = useMemo(() => state.results.reduce((sum, r) => sum + r.score, 0), [state.results]);
  const target = state.targets[state.index];
  const lastResult = state.phase === "revealed" ? state.results[state.results.length - 1] : undefined;
  const todayResult = today ? (stats.daily[today] ?? null) : null;
  const streak = today ? currentStreak(stats, today) : 0;

  /* ------------------------------ eylemler ------------------------------ */
  const saving = useRef(false);

  const start = useCallback(
    (mode: GameMode) => {
      saving.current = false;
      setOutcome(null);
      if (stats.sound) unlockAudio();
      if (mode === "daily") {
        const dateKey = dateKeyOf();
        setToday(dateKey);
        dispatch({ type: "start", targets: pickTargets({ seed: dailySeed(dateKey, DAILY_SALT), guided }), mode, dateKey });
      } else {
        dispatch({ type: "start", targets: pickTargets({ guided }), mode });
      }
    },
    [guided, stats.sound],
  );

  const home = useCallback(() => {
    saving.current = false;
    dispatch({ type: "home" });
  }, []);

  const place = useCallback(
    (point: LngLat) => {
      if (state.screen !== "playing" || state.phase !== "guessing") return;
      dispatch({ type: "place", point });
      vibrate(8);
      soundTick();
    },
    [state.screen, state.phase],
  );

  const takeHint = useCallback(() => {
    if (state.screen !== "playing" || state.phase !== "guessing" || state.hinted) return;
    dispatch({ type: "hint" });
    vibrate(12);
    soundTick();
  }, [state.screen, state.phase, state.hinted]);

  const submit = useCallback(() => {
    if (state.screen !== "playing" || state.phase !== "guessing" || !state.pin || !target) return;
    dispatch({ type: "submit" });
  }, [state.screen, state.phase, state.pin, target]);

  // Cevap açılınca ses/titreşim: sonuç reducer'dan gelir, burada yan etki olarak duyurulur.
  const announced = useRef(-1);
  useEffect(() => {
    if (state.phase !== "revealed" || !lastResult || announced.current === state.results.length) return;
    announced.current = state.results.length;
    vibrate(lastResult.verdict === "perfect" ? [14, 50, 14, 50, 26] : lastResult.verdict === "far" ? [26] : [12]);
    soundGuess();
    const timer = window.setTimeout(() => soundResult(lastResult.verdict), 140);
    return () => window.clearTimeout(timer);
  }, [state.phase, lastResult, state.results.length]);

  useEffect(() => {
    if (state.screen === "intro") announced.current = -1;
  }, [state.screen]);

  // Son turdan sonra sonucu kaydet. Olay işleyicisinde yapılıyor (efektte değil).
  const next = useCallback(() => {
    const isLast = state.screen === "playing" && state.phase === "revealed" && state.index + 1 >= state.targets.length;
    if (isLast && !saving.current) {
      saving.current = true;
      const scores = state.results.map((r) => r.score);
      const final = scores.reduce((sum, s) => sum + s, 0);
      const dateKey = state.dateKey ?? dateKeyOf();
      const result = recordGame(stats, { mode: state.mode, dateKey, total: final, scores });
      if (result.counted) persist(result.stats);
      setOutcome({
        mode: state.mode,
        dateKey: state.mode === "daily" ? dateKey : null,
        counted: result.counted,
        official: result.official,
        newBest: result.newBest,
        streak: result.streak,
        officialTotal: state.mode === "daily" ? (result.stats.daily[dateKey]?.total ?? null) : null,
        stats: result.stats,
      });
      vibrate([10, 40, 10, 40, 22]);
      soundFinish();
    }
    dispatch({ type: "next" });
  }, [state, stats, persist]);

  const setSound = useCallback(
    (on: boolean) => {
      setSoundEnabled(on);
      if (on) {
        unlockAudio();
        soundTick();
      }
      persist({ ...stats, sound: on });
    },
    [stats, persist],
  );

  return {
    screen: state.screen,
    phase: state.phase,
    mode: state.mode,
    dateKey: state.dateKey,
    targets: state.targets,
    results: state.results,
    index: state.index,
    roundNumber: state.index + 1,
    totalRounds: state.targets.length,
    target,
    pin: state.pin,
    hinted: state.hinted,
    lastResult,
    total,
    maxTotal: MAX_GAME_SCORE,
    stats,
    average: averageScore(stats),
    loaded,
    today,
    todayResult,
    streak,
    outcome,
    sound: stats.sound,
    start,
    home,
    place,
    takeHint,
    submit,
    next,
    setSound,
  };
}
