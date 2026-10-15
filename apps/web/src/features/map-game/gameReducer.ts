import type { DateKey, GameMode } from "../distance-game/daily";
import { haversineKm } from "../distance-game/haversine";
import type { LngLat } from "../distance-game/mapGeometry";
import type { Verdict } from "../distance-game/scoring";
import type { Target } from "./pickTargets";
import { scoreRound } from "./scoring";

export type Screen = "intro" | "playing" | "results";
export type Phase = "guessing" | "revealed";

export interface RoundResult {
  target: Target;
  /** Oyuncunun işareti. */
  guess: LngLat;
  /** Gerçek yere uzaklık, km. */
  km: number;
  /** İpucu hesaba katılmadan puan. */
  base: number;
  /** Turun puanı (ipucu varsa yarısı). */
  score: number;
  hinted: boolean;
  verdict: Verdict;
}

export interface State {
  screen: Screen;
  mode: GameMode;
  /** Oyunun BAŞLADIĞI yerel gün (günün turunda sonuç bu güne yazılır). */
  dateKey: DateKey | null;
  targets: Target[];
  index: number;
  phase: Phase;
  /** Bu turdaki işaret; yoksa null. */
  pin: LngLat | null;
  /** Bu turda ipucu alındı mı? */
  hinted: boolean;
  results: RoundResult[];
}

export type Action =
  | { type: "start"; targets: Target[]; mode?: GameMode; dateKey?: DateKey }
  | { type: "place"; point: LngLat }
  | { type: "hint" }
  | { type: "submit" }
  | { type: "next" }
  | { type: "home" };

export const INITIAL_STATE: State = {
  screen: "intro",
  mode: "free",
  dateKey: null,
  targets: [],
  index: 0,
  phase: "guessing",
  pin: null,
  hinted: false,
  results: [],
};

const finitePoint = ([lng, lat]: LngLat) => Number.isFinite(lng) && Number.isFinite(lat);

/** Saf indirgeyici: çift dokunuş gibi tekrarlar durum denetimiyle etkisiz kalır. */
export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...INITIAL_STATE,
        screen: "playing",
        mode: action.mode ?? "free",
        dateKey: action.mode === "daily" ? (action.dateKey ?? null) : null,
        targets: action.targets,
      };
    case "place":
      if (state.screen !== "playing" || state.phase !== "guessing" || !finitePoint(action.point)) return state;
      return { ...state, pin: action.point };
    case "hint":
      if (state.screen !== "playing" || state.phase !== "guessing" || state.hinted) return state;
      return { ...state, hinted: true };
    case "submit": {
      if (state.screen !== "playing" || state.phase !== "guessing" || !state.pin) return state;
      const target = state.targets[state.index];
      const km = haversineKm(state.pin[1], state.pin[0], target.city.lat, target.city.lng);
      const scored = scoreRound(km, state.hinted);
      return {
        ...state,
        phase: "revealed",
        results: [...state.results, { target, guess: state.pin, hinted: state.hinted, ...scored }],
      };
    }
    case "home":
      return INITIAL_STATE;
    case "next":
      if (state.screen !== "playing" || state.phase !== "revealed") return state;
      if (state.index + 1 >= state.targets.length) return { ...state, screen: "results" };
      return { ...state, index: state.index + 1, phase: "guessing", pin: null, hinted: false };
  }
}
