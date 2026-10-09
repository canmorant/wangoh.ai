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
} from "./daily";
import {
  detentIndex,
  setSoundEnabled,
  soundFinish,
  soundGuess,
  soundResult,
  soundTick,
  unlockAudio,
  vibrate,
} from "./feedback";
import { INITIAL_STATE, reducer } from "./gameReducer";
import { pickRounds, type Round } from "./pickRounds";
import { MAX_GAME_SCORE, scoreGuess, verdictFor } from "./scoring";
import { kmFromPosition, stepPosition } from "./slider";

export type { Phase, RoundResult, Screen } from "./gameReducer";
export type { GameMode } from "./daily";

const STORAGE_KEY = "wangoh.distancegame.v2";
/** Sürüm 1: yalnız { best, played }; ilk açılışta bir kez okunup v2'ye taşınır. */
const LEGACY_KEY = "wangoh.distancegame.v1";

/** Oyun bittiğinde oluşan sonuç bilgisi (sonuç ekranı gösterir). */
export interface Outcome extends Pick<RecordOutcome, "counted" | "official" | "newBest" | "streak"> {
  mode: GameMode;
  dateKey: DateKey | null;
  /** Günün Turu'nda o günün RESMÎ toplamı (tekrarda oyunun kendi toplamından farklı olabilir). */
  officialTotal: number | null;
  /** Oyun sonrası istatistik. */
  stats: Stats;
}

/**
 * `guided`: sitenin rehberi olan şehirlerin anahtarları ("ISO2:veri adı"); soru
 * seçiminde A kademesinin bir kuralı (bkz. cities.ts isTierA). Kümenin kimliği
 * değişmedikçe aynı kalmalı (DistanceGame useMemo ile verir).
 */
export function useDistanceGame(guided?: ReadonlySet<string>) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  /* -------------------------- kalıcılık -------------------------- */
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loaded, setLoaded] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  /** Bugünün yerel tarihi; yalnız istemcide ve pencereye dönüldükçe yenilenir. */
  const [today, setToday] = useState<DateKey | null>(null);

  // Efekt içinde okunur, render sırasında asla: SSR ve hidrasyon aynı çıktıyı versin.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      let loadedStats = EMPTY_STATS;
      try {
        const current = localStorage.getItem(STORAGE_KEY);
        const legacy = current ? null : localStorage.getItem(LEGACY_KEY);
        if (current) loadedStats = parseStats(JSON.parse(current));
        else if (legacy) {
          // Sürüm 1 kaydı: bir kez v2'ye taşınır ve eski anahtar silinir (çerez politikasında yalnız v2 var).
          loadedStats = parseStats(JSON.parse(legacy));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedStats));
          localStorage.removeItem(LEGACY_KEY);
        }
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
  const round = state.rounds[state.index] as Round | undefined;
  const guess = kmFromPosition(state.position);
  const lastResult = state.phase === "revealed" ? state.results[state.results.length - 1] : undefined;
  const todayResult = today ? (stats.daily[today] ?? null) : null;
  const streak = today ? currentStreak(stats, today) : 0;

  /* ------------------------------ eylemler ------------------------------ */
  // Çift dokunuşla sonuç iki kez kaydedilmesin diye kilit.
  const saving = useRef(false);

  const start = useCallback(
    (mode: GameMode) => {
      saving.current = false;
      setOutcome(null);
      // Ses bağlamı yalnız ses açıksa kurulur (kapalıyken başka uygulamanın sesine dokunma).
      if (stats.sound) unlockAudio();
      if (mode === "daily") {
        const dateKey = dateKeyOf();
        setToday(dateKey);
        dispatch({ type: "start", rounds: pickRounds({ seed: dailySeed(dateKey), guided }), mode, dateKey });
      } else {
        dispatch({ type: "start", rounds: pickRounds({ guided }), mode });
      }
    },
    [guided, stats.sound],
  );

  const home = useCallback(() => {
    saving.current = false;
    dispatch({ type: "home" });
  }, []);

  /** Kaydırıcı: bir "tık" eşiği geçildiyse kısa titreşim + (açıksa) ses. */
  const detent = useCallback((fromKm: number, toKm: number) => {
    if (detentIndex(fromKm) !== detentIndex(toKm)) {
      vibrate(7);
      soundTick();
    }
  }, []);

  const setPosition = useCallback(
    (position: number) => {
      detent(kmFromPosition(state.position), kmFromPosition(position));
      dispatch({ type: "position", position });
    },
    [state.position, detent],
  );

  const nudge = useCallback(
    (direction: 1 | -1) => {
      detent(kmFromPosition(state.position), kmFromPosition(stepPosition(state.position, direction)));
      dispatch({ type: "nudge", direction });
    },
    [state.position, detent],
  );

  const submit = useCallback(() => {
    if (state.screen !== "playing" || state.phase !== "guessing" || !round) return;
    dispatch({ type: "submit" });
    // Sonucu burada (tıklama olayı içinde) duyur: titreşim ve ses kullanıcı hareketinden doğar.
    const verdict = verdictFor(scoreGuess(kmFromPosition(state.position), round.km).score);
    vibrate(verdict === "perfect" ? [14, 50, 14, 50, 26] : verdict === "far" ? [26] : [12]);
    soundGuess();
    window.setTimeout(() => soundResult(verdict), 140);
  }, [state.screen, state.phase, state.position, round]);

  // Son turdan sonra sonucu kaydet. Olay işleyicisinde yapılıyor (efektte değil).
  const next = useCallback(() => {
    const isLast = state.screen === "playing" && state.phase === "revealed" && state.index + 1 >= state.rounds.length;
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
    setPosition,
    nudge,
    submit,
    next,
    setSound,
  };
}
