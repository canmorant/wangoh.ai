/* ------------------------------------------------------------------ *
 *  Scoring, combos and progression
 *
 *  Design rule fixed by the brief: fewer hints must always score more. Hints
 *  therefore scale the base down rather than subtracting a flat penalty, so a
 *  hinted answer is worth less but never feels punished into nothing.
 * ------------------------------------------------------------------ */

export const MAX_HINTS = 3;

/** Multiplier applied to the base score, by hints used. */
export const HINT_MULTIPLIER = [1, 0.7, 0.45, 0.2] as const;

export const BASE_POINTS = 100;

/** Plain per-hint values, with no speed or combo bonuses. */
export const POINTS_BY_HINTS = HINT_MULTIPLIER.map((m) =>
  Math.round(BASE_POINTS * m)
) as readonly number[];

export const SPEED = {
  /** At or under this, full speed bonus. */
  fastMs: 3000,
  /** At or over this, none. */
  slowMs: 15000,
  maxBonus: 50,
};

export interface RoundScore {
  base: number;
  speedBonus: number;
  comboBonus: number;
  total: number;
}

/** Speed bonus decays linearly between fastMs and slowMs. */
export function speedBonus(elapsedMs: number): number {
  const { fastMs, slowMs, maxBonus } = SPEED;
  if (elapsedMs <= fastMs) return maxBonus;
  if (elapsedMs >= slowMs) return 0;
  return Math.round(maxBonus * (1 - (elapsedMs - fastMs) / (slowMs - fastMs)));
}

/** +10 for every full run of 5, capped so it stays a garnish, not the meal. */
export function comboBonus(streakAfter: number): number {
  return Math.min(50, Math.floor(streakAfter / 5) * 10);
}

export function scoreRound(hintsUsed: number, elapsedMs: number, streakAfter: number): RoundScore {
  const mult = HINT_MULTIPLIER[Math.min(hintsUsed, MAX_HINTS)];
  const base = Math.round(BASE_POINTS * mult);
  // Bonuses scale by the same multiplier, so a hinted round can never out-earn
  // an unhinted one at equal speed and combo.
  const speed = Math.round(speedBonus(elapsedMs) * mult);
  const combo = Math.round(comboBonus(streakAfter) * mult);
  return { base, speedBonus: speed, comboBonus: combo, total: base + speed + combo };
}

/** Score for a round the player gave up on. */
export function scoreRevealed(): RoundScore {
  return { base: 0, speedBonus: 0, comboBonus: 0, total: 0 };
}

/* ----------------------------- combos ----------------------------- */

export interface ComboTier {
  at: number;
  label: string;
  icon: string;
}

export const COMBO_TIERS: ComboTier[] = [
  { at: 3, label: "Güzel", icon: "🔥" },
  { at: 5, label: "Alev Aldın", icon: "⚡" },
  { at: 10, label: "İnanılmaz", icon: "🚀" },
  { at: 20, label: "Kâşif Ustası", icon: "🏆" },
];

/** The tier newly reached at this exact streak, or null. */
export function comboTierAt(streak: number): ComboTier | null {
  return COMBO_TIERS.find((t) => t.at === streak) ?? null;
}

/** The highest tier earned so far, for persistent display. */
export function currentTier(streak: number): ComboTier | null {
  let best: ComboTier | null = null;
  for (const t of COMBO_TIERS) if (streak >= t.at) best = t;
  return best;
}

/* --------------------------- progression --------------------------- */

/** XP earned from a round's score. */
export const xpFor = (score: number) => Math.round(score * 0.6);

/** Quadratic curve: each level costs more than the last. */
export function levelFromXp(xp: number): { level: number; into: number; needed: number } {
  const safe = Math.max(0, xp);
  const level = Math.floor(Math.sqrt(safe / 50)) + 1;
  const floorXp = 50 * (level - 1) ** 2;
  const ceilXp = 50 * level ** 2;
  return { level, into: safe - floorXp, needed: ceilXp - floorXp };
}

/* ------------------------------ bag ------------------------------- */

/**
 * Shuffle bag: every item appears once per cycle before any repeat, so the
 * same handful cannot dominate the way naive Math.random() does.
 */
export function makeBag<T>(items: T[], rng: () => number = Math.random): T[] {
  const bag = [...items];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

/** Deterministic per-day index, so the Daily challenge matches for everyone. */
export function dailyIndex(count: number, date = new Date()): number {
  return Math.abs(hashDate(date)) % count;
}

function hashDate(date: Date): number {
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

/** Seeded RNG for the Daily sequence — identical order for every player. */
export function dailySeed(date = new Date()): () => number {
  let s = Math.abs(hashDate(date)) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** Simple per-hint score with no bonuses. */
export function scoreFor(hintsUsed: number, revealed: boolean): number {
  if (revealed) return 0;
  return Math.round(BASE_POINTS * HINT_MULTIPLIER[Math.min(hintsUsed, MAX_HINTS)]);
}
