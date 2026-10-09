import type { DateKey, GameMode } from "./daily";
import type { Round } from "./pickRounds";
import { scoreGuess } from "./scoring";
import { kmFromPosition, SLIDER_STEPS, START_POSITION, stepPosition } from "./slider";

export type Screen = "intro" | "playing" | "results";
export type Phase = "guessing" | "revealed";

export interface RoundResult {
  round: Round;
  /** Oyuncunun tahmini, km. */
  guess: number;
  /** Bağıl hata (0,12 = %12). */
  error: number;
  score: number;
}

export interface State {
  screen: Screen;
  /** Serbest oyun ya da Günün Turu. */
  mode: GameMode;
  /** Oyunun BAŞLADIĞI yerel gün (günün turunda sonuç bu güne yazılır). */
  dateKey: DateKey | null;
  rounds: Round[];
  index: number;
  phase: Phase;
  /** Kaydırıcı konumu (0–SLIDER_STEPS). */
  position: number;
  results: RoundResult[];
}

export type Action =
  | { type: "start"; rounds: Round[]; mode?: GameMode; dateKey?: DateKey }
  | { type: "position"; position: number }
  | { type: "nudge"; direction: 1 | -1 }
  | { type: "submit" }
  | { type: "next" }
  | { type: "home" };

export const INITIAL_STATE: State = {
  screen: "intro",
  mode: "free",
  dateKey: null,
  rounds: [],
  index: 0,
  phase: "guessing",
  position: START_POSITION,
  results: [],
};

/** Saf indirgeyici: çift tıklama / Enter+tık gibi tekrarlar durum denetimiyle etkisiz kalır. */
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...INITIAL_STATE,
        screen: "playing",
        mode: action.mode ?? "free",
        dateKey: action.mode === "daily" ? (action.dateKey ?? null) : null,
        rounds: action.rounds,
      };
    case "position":
      if (state.screen !== "playing" || state.phase !== "guessing") return state;
      return { ...state, position: Math.min(SLIDER_STEPS, Math.max(0, Math.round(action.position))) };
    case "nudge":
      if (state.screen !== "playing" || state.phase !== "guessing") return state;
      return { ...state, position: stepPosition(state.position, action.direction) };
    case "submit": {
      if (state.screen !== "playing" || state.phase !== "guessing") return state;
      const round = state.rounds[state.index];
      const guess = kmFromPosition(state.position);
      const { error, score } = scoreGuess(guess, round.km);
      return { ...state, phase: "revealed", results: [...state.results, { round, guess, error, score }] };
    }
    case "home":
      return INITIAL_STATE;
    case "next":
      if (state.screen !== "playing" || state.phase !== "revealed") return state;
      if (state.index + 1 >= state.rounds.length) return { ...state, screen: "results" };
      return { ...state, index: state.index + 1, phase: "guessing", position: START_POSITION };
  }
}

