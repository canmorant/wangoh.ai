import { useState, type Ref } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { colors, radius, spacing, typography } from "@/theme";
import { Text } from "@/ui";

export interface TextAreaProps extends Omit<TextInputProps, "style" | "multiline"> {
  label: string;
  error?: string | null;
  hint?: string;
  /** Alanın en az yüksekliği (pt). */
  minHeight?: number;
  /** Sayaç: "123 / 1000". */
  maxChars?: number;
  ref?: Ref<TextInput>;
  monospace?: boolean;
}

/** Çok satırlı metin kutusu (özet, gövde editörü). `Input` ile aynı etiket/hata/ipucu düzeni. */
export function TextArea({ label, error, hint, minHeight = 120, maxChars, ref, monospace = false, value, onFocus, onBlur, ...rest }: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const length = typeof value === "string" ? value.length : 0;

  return (
    <View>
      <Text variant="label" color="textSecondary" style={styles.label}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        value={value}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.gold}
        cursorColor={colors.gold}
        keyboardAppearance="dark"
        allowFontScaling
        maxFontSizeMultiplier={1.6}
        accessibilityLabel={hasError ? `${label}. Hata: ${error}` : label}
        accessibilityHint={hint}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          monospace && styles.mono,
          { minHeight, borderColor: hasError ? colors.danger : focused ? colors.gold : colors.borderStrong },
          focused && styles.focused,
        ]}
        {...rest}
      />
      {hasError ? (
        <Text variant="small" color="danger" style={styles.message} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="small" color="textMuted" style={styles.message}>
          {hint}
        </Text>
      ) : null}
      {maxChars !== undefined ? (
        <Text variant="caption" color={length > maxChars ? "danger" : "textMuted"} align="right" style={styles.counter}>
          {length} / {maxChars}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.xs },
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  mono: { fontFamily: "monospace", fontSize: 14, lineHeight: 21 },
  focused: { backgroundColor: colors.surfaceRaised },
  message: { marginTop: spacing.xs },
  counter: { marginTop: spacing.xxs },
});
