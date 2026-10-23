import { useRef } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import { colors, minTouchTarget, radius, spacing, typography } from "@/theme";
import { Icon } from "@/ui";

export interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  /** Klavyedeki "Ara" tuşu ya da Enter. */
  onSubmit?: () => void;
  placeholder?: string;
  accessibilityLabel?: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Arama kutusu: sol büyüteç, doluyken sağda temizle düğmesi. Giriş alanı 16 pt (iOS yakınlaştırmaz). */
export function SearchField({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Ülke ara",
  accessibilityLabel = "Ülke ara",
  autoFocus = false,
  style,
  testID,
}: SearchFieldProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.field, style]}>
      <Icon name="search" size={20} color="textMuted" />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.gold}
        cursorColor={colors.gold}
        keyboardAppearance="dark"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        clearButtonMode="never"
        maxFontSizeMultiplier={1.6}
        accessibilityLabel={accessibilityLabel}
        style={styles.input}
        testID={testID}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aramayı temizle"
          hitSlop={4}
          onPress={() => {
            onChangeText("");
            inputRef.current?.focus();
          }}
          style={styles.clear}
        >
          <Icon name="close-circle" size={20} color="textMuted" />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Web'de tarayıcının odak çerçevesi alanın kendi kenarlığıyla çakışmasın; yerelde bu stil yoktur. */
function webOnly(style: object): TextStyle {
  return Platform.OS === "web" ? (style as TextStyle) : {};
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingLeft: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 52,
    paddingVertical: spacing.md,
    color: colors.text,
    ...webOnly({ outlineStyle: "none" }),
  },
  clear: { width: minTouchTarget, height: minTouchTarget, alignItems: "center", justifyContent: "center" },
});
