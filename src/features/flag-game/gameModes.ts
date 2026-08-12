export type ModeId = "classic" | "timeattack" | "endless" | "survival" | "daily";

export interface GameMode {
  id: ModeId;
  name: string;
  tagline: string;
  /** Countdown length in seconds. Undefined = untimed. */
  durations?: number[];
  /** Selectable life counts. Undefined = unlimited. */
  lives?: number[];
  accent: string;
}

export const GAME_MODES: GameMode[] = [
  {
    id: "classic",
    name: "Klasik",
    tagline: "Saat yok, baskı yok. Kendi hızında öğren.",
    accent: "#c8a45e",
  },
  {
    id: "timeattack",
    name: "Zamana Karşı",
    tagline: "Süre bitmeden olabildiğince çok bayrak.",
    durations: [30, 60, 90, 120, 300],
    accent: "#e0537a",
  },
  {
    id: "endless",
    name: "Sonsuz",
    tagline: "Sen durana kadar devam.",
    accent: "#4b7fd4",
  },
  {
    id: "survival",
    name: "Hayatta Kalma",
    tagline: "Belirli sayıda hata ve oyun biter.",
    lives: [3, 5],
    accent: "#d4795a",
  },
  {
    id: "daily",
    name: "Günlük",
    tagline: "Her gün herkese aynı sıra.",
    accent: "#3fae9a",
  },
];

export const DURATION_LABEL: Record<number, string> = {
  30: "30 sn",
  60: "1 dk",
  90: "90 sn",
  120: "2 dk",
  300: "5 dk",
};

export const modeById = (id: ModeId) => GAME_MODES.find((m) => m.id === id)!;
