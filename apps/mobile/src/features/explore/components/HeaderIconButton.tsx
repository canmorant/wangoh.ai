import { Pressable, StyleSheet } from "react-native";

import { colors, minTouchTarget, radius } from "@/theme";
import { Icon, type IconName } from "@/ui";

export interface HeaderIconButtonProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  hint?: string;
}

/** Başlığın sağındaki simge düğmesi (44 pt dokunma hedefi). */
export function HeaderIconButton({ icon, label, onPress, hint }: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon name={icon} size={22} color="gold" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { width: minTouchTarget, height: minTouchTarget, alignItems: "center", justifyContent: "center", borderRadius: radius.pill },
  pressed: { backgroundColor: colors.surfaceRaised },
});
