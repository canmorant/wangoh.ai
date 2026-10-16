import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius as radii, spacing } from "@/theme";

export interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Hareketi azalt ayarı açıksa titreşim durur. */
function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => active && setReduce(value))
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduce;
}

/** Yükleme sırasında içeriğin yerini tutan titreşen blok. Ekran okuyucudan gizlidir; kapsayıcı yüklendiğini bildirir. */
export function Skeleton({ width = "100%", height = 16, radius = radii.sm, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.55)).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(0.8);
      return;
    }
    // Web'de yerel sürücü yok (uyarı verir); yalnız mobilde açılır.
    const useNativeDriver = Platform.OS !== "web";
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver }),
        Animated.timing(opacity, { toValue: 0.55, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      accessible={false}
      importantForAccessibility="no"
      style={[{ width, height, borderRadius: radius, backgroundColor: colors.skeletonHighlight, opacity }, style]}
    />
  );
}

export interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  /** Ekran okuyucunun okuyacağı metin. */
  label?: string;
}

/** Liste yüklenirken satır yer tutucuları. */
export function SkeletonList({ count = 5, itemHeight = 72, label = "Yükleniyor" }: SkeletonListProps) {
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityLiveRegion="polite" style={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={itemHeight} radius={radii.lg} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
});
