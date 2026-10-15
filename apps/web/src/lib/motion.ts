/**
 * One easing vocabulary for the whole site. Mixed ad-hoc curves are the main
 * reason interfaces read as "template" — consistency of motion is what makes
 * a product feel authored.
 */

/** Expo-out. The workhorse: fast commit, long elegant settle. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Symmetric ease for things that travel and stop, like panels. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Gentle. For opacity and colour, where overshoot would read as cheap. */
export const EASE_SOFT = [0.25, 0.8, 0.25, 1] as const;

/** A touch of overshoot. Reserved for reveals that should feel physical. */
export const EASE_BACK = [0.34, 1.4, 0.64, 1] as const;

export const DUR = {
  fast: 0.35,
  base: 0.6,
  slow: 1.0,
  reveal: 1.25,
} as const;

/** Spring used for pointer-follow interactions (tilt, magnetism). */
export const SPRING = { stiffness: 260, damping: 28, mass: 0.7 } as const;
