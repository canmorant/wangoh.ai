export type ModeId = "classic" | "timeattack" | "endless" | "survival" | "daily";

/**
 * Mod adları ve açıklamaları messages/*.json'da (FlagGame.modes.<id>).
 * Burada yalnızca davranışı belirleyen değerler var.
 */
export interface GameMode {
  id: ModeId;
  /** Countdown length in seconds. Undefined = untimed. */
  durations?: number[];
  /** Selectable life counts. Undefined = unlimited. */
  lives?: number[];
  accent: string;
}

export const GAME_MODES: GameMode[] = [
  {
    id: "classic",
    accent: "#c8a45e",
  },
  {
    id: "timeattack",
    durations: [30, 60, 90, 120, 300],
    accent: "#e0537a",
  },
  {
    id: "endless",
    accent: "#4b7fd4",
  },
  {
    id: "survival",
    lives: [3, 5],
    accent: "#d4795a",
  },
  {
    id: "daily",
    accent: "#3fae9a",
  },
];

export const modeById = (id: ModeId) => GAME_MODES.find((m) => m.id === id)!;
