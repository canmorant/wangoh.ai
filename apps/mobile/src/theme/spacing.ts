/** 4 pt tabanlı aralık ölçeği. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Ekran kenar boşluğu. */
export const screenPadding = spacing.lg;

/** Dokunma hedefi alt sınırı (Apple HIG 44 pt; Android 48 dp'ye de yakın). */
export const minTouchTarget = 44;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
