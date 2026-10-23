import { StyleSheet, View } from "react-native";

import { Text } from "@/ui";
import { colors, radius, spacing } from "@/theme";

import { useRoundProgress } from "../hooks/useRoundProgress";
import { countdownLabel, isUrgent, remainingSeconds, type RoundTiming } from "../model/countdown";

export interface CountdownBarProps {
  /** Turun sunucu saatine göre kurulmuş saati (yanıtın alındığı anda sabitlenir). */
  timing: RoundTiming;
  /** Çubuğun tam dolu olduğu süre (sunucunun bildirdiği tur süresi). */
  durationMs: number;
  /** Süre dolunca BİR kez çağrılır (yeni `timing` sayacı yeniler). Süre kararını sunucu verir. */
  onExpire?: () => void;
  /** Çubuğun solundaki etiket. */
  label?: string;
  /** Tur henüz başlamadıysa (geri bildirim payı) etiket yerine gösterilir; çubuk o sırada tam doludur ve süre işlemez. */
  waitingLabel?: string;
  testID?: string;
}

/**
 * Geri sayım GÖSTERGESİ. Yalnız kendisi yeniden çizilir (100 ms), ekranın geri kalanı etkilenmez.
 * Tur başlamadan önce çubuk %100'de bekler; başlayınca sunucunun bitiş anına göre azalır. Puan ya da zaman aşımı kararı vermez.
 */
export function CountdownBar({ timing, durationMs, onExpire, label = "Süre", waitingLabel, testID }: CountdownBarProps) {
  const progress = useRoundProgress(timing, durationMs, onExpire);
  const { remainingMs: remaining, waiting } = progress;
  const urgent = !waiting && isUrgent(remaining);
  const seconds = remainingSeconds(remaining);
  const dangerous = urgent || (!waiting && remaining === 0);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={countdownLabel(remaining, progress.msToStart)}
      accessibilityValue={{ min: 0, max: Math.round(durationMs / 1000), now: seconds }}
      testID={testID}
    >
      <Text variant="caption" color="textSecondary" style={styles.label} numberOfLines={1}>
        {waiting && waitingLabel ? waitingLabel : label}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress.fraction * 100}%`, backgroundColor: dangerous ? colors.danger : colors.gold }]} />
      </View>
      <Text variant="bodyStrong" color={dangerous ? "danger" : "text"} style={styles.seconds} testID={testID ? `${testID}-seconds` : undefined}>
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
