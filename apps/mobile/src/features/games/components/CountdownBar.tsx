import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import { countdownLabel, isUrgent, remainingFraction, remainingMs, remainingSeconds } from "../model/countdown";

export interface CountdownBarProps {
  /** Yerel saat (Date.now) bitişi. */
  deadline: number;
  /** Çubuğun tam dolu olduğu süre (sunucunun bildirdiği tur süresi). */
  durationMs: number;
  /** Süre dolunca BİR kez çağrılır (yeni `deadline` sayacı yeniler). Süre kararını sunucu verir. */
  onExpire?: () => void;
  /** Çubuğun solundaki etiket. */
  label?: string;
  testID?: string;
}

/**
 * Geri sayım GÖSTERGESİ. Yalnız kendisi yeniden çizilir (100 ms), ekranın geri kalanı etkilenmez.
 * Zamanlayıcı yereldir; puan ya da zaman aşımı kararı vermez, süre dolunca yalnız `onExpire` bildirir.
 */
export function CountdownBar({ deadline, durationMs, onExpire, label = "Süre", testID }: CountdownBarProps) {
  const [now, setNow] = useState(() => Date.now());
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;
  const firedFor = useRef<number | null>(null);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= deadline) {
        if (id !== undefined) clearInterval(id);
        if (firedFor.current !== deadline) {
          firedFor.current = deadline;
          expireRef.current?.();
        }
      }
    };
    tick();
    id = setInterval(tick, 100);
    return () => {
      if (id !== undefined) clearInterval(id);
    };
  }, [deadline]);

  const remaining = remainingMs(deadline, now);
  const urgent = isUrgent(remaining);
  const seconds = remainingSeconds(remaining);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={countdownLabel(remaining)}
      accessibilityValue={{ min: 0, max: Math.round(durationMs / 1000), now: seconds }}
      testID={testID}
    >
      <Text variant="caption" color="textSecondary" style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${remainingFraction(remaining, durationMs) * 100}%`, backgroundColor: urgent || remaining === 0 ? colors.danger : colors.gold },
          ]}
        />
      </View>
      <Text variant="bodyStrong" color={urgent || remaining === 0 ? "danger" : "text"} style={styles.seconds} testID={testID ? `${testID}-seconds` : undefined}>
        {seconds} sn
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 28 },
  label: { flexShrink: 0 },
  track: { flex: 1, height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceRaised, overflow: "hidden" },
  fill: { height: "100%", borderRadius: radius.pill },
  seconds: { minWidth: 48, textAlign: "right", fontVariant: ["tabular-nums"] },
});
