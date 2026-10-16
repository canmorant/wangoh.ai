import { useState, type Ref } from "react";
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";

import { colors, minTouchTarget, radius, spacing, typography } from "@/theme";

import { Text } from "./Text";

export interface InputProps extends Omit<TextInputProps, "style"> {
  /** Her zaman görünen etiket (yer tutucu etiket yerine geçmez). */
  label: string;
  /** Hata varsa kırmızı kenar ve mesaj çıkar; ekran okuyucu etiketle birlikte okur. */
  error?: string | null;
  hint?: string;
  /** React 19: ref doğrudan prop. Sonraki alana odaklanmak için. */
  ref?: Ref<TextInput>;
  containerStyle?: StyleProp<ViewStyle>;
}

/** `secureTextEntry` verilirse sağda "Göster/Gizle" düğmesi çıkar. */
export function Input({ label, error, hint, ref, containerStyle, secureTextEntry, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isSecret = Boolean(secureTextEntry);
  const hasError = Boolean(error);

  const borderColor = hasError ? colors.danger : focused ? colors.gold : colors.borderStrong;

  return (
    <View style={containerStyle}>
      <Text variant="label" color="textSecondary" style={styles.label}>
        {label}
      </Text>
      <View style={[styles.field, { borderColor }, focused && styles.fieldFocused]}>
        <TextInput
          ref={ref}
          style={[styles.input, isSecret && styles.inputWithToggle]}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.gold}
          cursorColor={colors.gold}
          keyboardAppearance="dark"
          allowFontScaling
          maxFontSizeMultiplier={1.6}
          accessibilityLabel={hasError ? `${label}. Hata: ${error}` : label}
          accessibilityHint={hint}
          secureTextEntry={isSecret && !revealed}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
        {isSecret ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? `${label} alanını gizle` : `${label} alanını göster`}
            onPress={() => setRevealed((value) => !value)}
            hitSlop={4}
            style={styles.toggle}
          >
            <Text variant="small" color="gold">
              {revealed ? "Gizle" : "Göster"}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {hasError ? (
        <Text variant="small" color="danger" style={styles.message} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="small" color="textMuted" style={styles.message}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: spacing.xs },
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  fieldFocused: { backgroundColor: colors.surfaceRaised },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text,
  },
  inputWithToggle: { paddingRight: spacing.xs },
  toggle: {
    minWidth: minTouchTarget,
    minHeight: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  message: { marginTop: spacing.xs },
});
