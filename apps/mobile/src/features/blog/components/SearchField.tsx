import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors, minTouchTarget, radius, spacing, typography } from "@/theme";
import { Icon } from "@/ui";

export interface SearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  /** Görünen ipucu; ekran okuyucu için etiket de olur. */
  placeholder: string;
  accessibilityLabel?: string;
  maxLength?: number;
  testID?: string;
}

/** Arama kutusu: sol simge, sağda temizle düğmesi (44 pt). Liste başlığında kullanılır. */
export function SearchField({ value, onChangeText, placeholder, accessibilityLabel, maxLength = 100, testID }: SearchFieldProps) {
  return (
    <View style={styles.field}>
      <Icon name="search" size={20} color="textMuted" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        selectionColor={colors.gold}
        cursorColor={colors.gold}
        keyboardAppearance="dark"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={maxLength}
        maxFontSizeMultiplier={1.6}
        style={styles.input}
        testID={testID}
      />
      {value !== "" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aramayı temizle"
          onPress={() => onChangeText("")}
          hitSlop={4}
          style={styles.clear}
        >
          <Icon name="close-circle" size={20} color="textMuted" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: minTouchTarget + spacing.xs,
    paddingLeft: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
  },
  input: { ...typography.body, flex: 1, minHeight: minTouchTarget, color: colors.text, paddingVertical: spacing.sm },
  clear: { width: minTouchTarget, height: minTouchTarget, alignItems: "center", justifyContent: "center" },
});
