import { colors } from "./colors";
import { minTouchTarget, radius, screenPadding, spacing } from "./spacing";
import { fontFamily, typography } from "./typography";

export { colors, type ColorToken } from "./colors";
export { minTouchTarget, radius, screenPadding, spacing, type RadiusToken, type SpacingToken } from "./spacing";
export { fontFamily, typography, type TextVariant } from "./typography";

/** Tüm belirteçler tek nesnede; ekranlar çoğunlukla ayrı adlarla içe aktarır. */
export const theme = { colors, spacing, radius, typography, fontFamily, screenPadding, minTouchTarget } as const;
