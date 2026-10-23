import type { CitySummaryDto } from "@wangoh/api-client";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Badge, RemoteImage, Text } from "@/ui";

/** Ülke ekranındaki şehir kartı: görsel, ad, kısa açıklama; rehber durumu rozeti. */
export const CityCard = memo(function CityCard({
  city,
  width,
  onPress,
}: {
  city: CitySummaryDto;
  width: number;
  onPress: (slug: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${city.name}${city.hasGuide ? ", rehber yayında" : ", rehber hazırlanıyor"}`}
      accessibilityHint="Şehir sayfasını açar"
      onPress={() => onPress(city.slug)}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <View>
        <RemoteImage uri={city.imageUrl} alt={`${city.name} kapak görseli`} aspectRatio={4 / 3} radius={0} />
        <Badge label={city.hasGuide ? "Rehber" : "Hazırlanıyor"} tone={city.hasGuide ? "gold" : "neutral"} style={styles.badge} />
      </View>
      <View style={styles.info}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {city.name}
        </Text>
        {city.description ? (
          <Text variant="small" color="textSecondary" numberOfLines={3}>
            {city.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.8 },
  badge: { position: "absolute", top: spacing.sm, right: spacing.sm, backgroundColor: colors.overlay },
  info: { padding: spacing.md, gap: spacing.xs },
});
