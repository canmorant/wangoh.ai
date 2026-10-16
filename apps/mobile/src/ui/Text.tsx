import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";

import { colors, typography, type ColorToken, type TextVariant } from "@/theme";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  /** Renk belirteci (ham renk değil). */
  color?: ColorToken;
  align?: TextStyle["textAlign"];
}

/** Ekran okuyucuya başlık olarak bildirilen varyantlar. */
const HEADING_VARIANTS: ReadonlySet<TextVariant> = new Set(["display", "title", "heading"]);

export function Text({
  variant = "body",
  color = "text",
  align,
  style,
  accessibilityRole,
  // Çok büyük sistem yazı tipinde arayüz taşmasın; yine de metin %160'a kadar büyür.
  maxFontSizeMultiplier = 1.6,
  ...rest
}: TextProps) {
  return (
    <RNText
      accessibilityRole={accessibilityRole ?? (HEADING_VARIANTS.has(variant) ? "header" : undefined)}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[typography[variant], { color: colors[color] }, align ? { textAlign: align } : null, style]}
      {...rest}
    />
  );
}
