import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import type { StyleProp, TextStyle } from "react-native";

import { colors, type ColorToken } from "@/theme";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
}

/** Süs amaçlı simge: ekran okuyucudan gizlenir. Anlam taşıyan simgenin kapsayıcısına erişilebilirlik etiketi verilir. */
export function Icon({ name, size = 24, color = "text", style }: IconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={colors[color]}
      style={style}
      accessible={false}
      importantForAccessibility="no"
      accessibilityElementsHidden
    />
  );
}
