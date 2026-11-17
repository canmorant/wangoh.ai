import { Pressable, StyleSheet, View } from "react-native";

import { colors, minTouchTarget, spacing } from "@/theme";
import { Card, Icon, Text } from "@/ui";

import type { CityRecapEntry } from "../model/cityRecap";

export interface CityRecapListProps {
  entries: readonly CityRecapEntry[];
  onOpen(entry: CityRecapEntry): void;
}

/**
 * "Bu Şehir Neresi?" sonucunda oyunda çıkan şehirler: bilinen/bilinmeyen işareti ve şehir rehberine bağlantı.
 * Şehir adları API'den gelir. Kayıt yoksa (uygulama oyun sırasında yeniden açıldıysa) hiçbir şey çizilmez.
 */
export function CityRecapList({ entries, onOpen }: CityRecapListProps) {
  if (entries.length === 0) return null;
  return (
    <View testID="city-recap">
      <Card style={styles.card}>
        <Text variant="label" color="textSecondary">
          Bu oyundaki yerler
        </Text>
        <View>
          {entries.map((entry, position) => (
            <Pressable
              key={entry.index}
              accessibilityRole="link"
              accessibilityLabel={`${entry.label} rehberini aç. ${entry.correct ? "Doğru bildin." : "Bilemedin."}`}
              onPress={() => onOpen(entry)}
              style={({ pressed }) => [styles.row, position > 0 && styles.divider, pressed && styles.pressed]}
              testID={`city-recap-${entry.index}`}
            >
              <Icon name={entry.correct ? "checkmark-circle" : "close-circle"} size={22} color={entry.correct ? "success" : "danger"} />
              <Text variant="bodyStrong" style={styles.name} numberOfLines={1}>
                {entry.label}
              </Text>
              <Text variant="small" color="gold">
                Rehberi aç
              </Text>
              <Icon name="chevron-forward" size={18} color="gold" />
            </Pressable>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: minTouchTarget, paddingVertical: spacing.xs },
  divider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  name: { flex: 1 },
  pressed: { opacity: 0.7 },
});
