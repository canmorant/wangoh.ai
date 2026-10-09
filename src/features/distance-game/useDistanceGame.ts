"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { INITIAL_STATE, reducer } from "./gameReducer";
import { pickRounds, type Round } from "./pickRounds";
import { MAX_GAME_SCORE } from "./scoring";
import { kmFromPosition } from "./slider";

export type { Phase, RoundResult, Screen } from "./gameReducer";

export interface Persisted {
  /** En iyi toplam puan. */
  best: number;
  played: number;
}

const EMPTY: Persisted = { best: 0, played: 0 };
const STORAGE_KEY = "wangoh.distancegame.v1";

export function useDistanceGame() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  /* -------------------------- kalıcılık -------------------------- */
  const [saved, setSaved] = useState<Persisted>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [newBest, setNewBest] = useState(false);

  // Efekt içinde okunur, render sırasında asla: SSR ve hidrasyon aynı çıktıyı versin.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<Persisted>;
          setSaved({
            best: Number.isFinite(parsed.best) ? Math.max(0, Number(parsed.best)) : 0,
            played: Number.isFinite(parsed.played) ? Math.max(0, Number(parsed.played)) : 0,
          });
        }
      } catch {
        /* depolama kapalı ya da bozuk: oyun yine de çalışmalı */
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
      /* yok say */
    }
  }, []);

  /* ----------------------------- türetilen ----------------------------- */
  const total = useMemo(() => state.results.reduce((sum, r) => sum + r.score, 0), [state.results]);
  const round = state.rounds[state.index] as Round | undefined;
  const guess = kmFromPosition(state.position);
  const lastResult = state.phase === "revealed" ? state.results[state.results.length - 1] : undefined;

  /* ------------------------------ eylemler ------------------------------ */
  // Çift dokunuşla sonuç iki kez kaydedilmesin diye kilit.
  const saving = useRef(false);

  const start = useCallback(() => {
    saving.current = false;
    setNewBest(false);
    dispatch({ type: "start", rounds: pickRounds() });
  }, []);

  const setPosition = useCallback((position: number) => dispatch({ type: "position", position }), []);
  const nudge = useCallback((direction: 1 | -1) => dispatch({ type: "nudge", direction }), []);
  const submit = useCallback(() => dispatch({ type: "submit" }), []);

  // Son turdan sonra sonucu kaydet. Olay işleyicisinde yapılıyor (efektte değil).
  const next = useCallback(() => {
    const isLast = state.screen === "playing" && state.phase === "revealed" && state.index + 1 >= state.rounds.length;
    if (isLast && !saving.current) {
      saving.current = true;
      const final = state.results.reduce((sum, r) => sum + r.score, 0);
      setNewBest(final > saved.best);
      persist({ best: Math.max(saved.best, final), played: saved.played + 1 });
    }
    dispatch({ type: "next" });
  }, [state, saved, persist]);

  return {
    screen: state.screen,
    phase: state.phase,
    rounds: state.rounds,
    results: state.results,
    index: state.index,
    roundNumber: state.index + 1,
    totalRounds: state.rounds.length,
    round,
    position: state.position,
    guess,
    lastResult,
    total,
    maxTotal: MAX_GAME_SCORE,
    saved,
    loaded,
    newBest,
    start,
    setPosition,
    nudge,
    submit,
    next,
  };
}
