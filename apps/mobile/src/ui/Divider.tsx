import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, spacing } from "@/theme";

export interface DividerProps {
  /** Soldan içeri girinti (ListRow'da simge hizası için). */
  inset?: number;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ inset = 0, style }: DividerProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[styles.line, { marginLeft: inset }, style]}
    />
  );
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.xxs },
});
