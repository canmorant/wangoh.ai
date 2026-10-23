import { useMemo } from "react";
import { StyleSheet, type StyleProp, type TextStyle } from "react-native";

import { Text, type TextProps } from "@/ui";

import { parseInlineBold } from "../lib/markup";

export interface RichTextProps {
  /** API metni; `**kalın**` ayraçları kalın parçaya çevrilir, başka işaretleme yorumlanmaz. */
  text: string;
  variant?: TextProps["variant"];
  color?: TextProps["color"];
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

/** Paragraf: düz metin ve kalın parçalar tek `Text` içinde iç içe çizilir (HTML kullanılmaz). */
export function RichText({ text, variant = "body", color = "textSecondary", style, numberOfLines }: RichTextProps) {
  const segments = useMemo(() => parseInlineBold(text), [text]);

  return (
    <Text variant={variant} color={color} style={style} numberOfLines={numberOfLines}>
      {segments.map((segment, index) =>
        segment.bold ? (
          <Text key={index} variant={variant} color="text" style={styles.bold}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: "700" },
});
