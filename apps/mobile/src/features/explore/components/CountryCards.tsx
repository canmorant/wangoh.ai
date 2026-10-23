import type { CountrySummaryDto } from "@wangoh/api-client";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Badge, Card, Icon, RemoteImage, Text } from "@/ui";

import { joinCapitals } from "../lib/facts";

export const FEATURED_CARD_WIDTH = 176;
const FEATURED_IMAGE_HEIGHT = 132;

/** Bayrak emojisi; bazı kaynaklarda boş olabilir. Ekran okuyucudan gizli (ülke adı zaten okunur). */
export function FlagEmoji({ flag, size = 28 }: { flag: string | null | undefined; size?: number }) {
  return (
    <Text
      accessible={false}
      importantForAccessibility="no"
      style={{ fontSize: size, lineHeight: size + 6, width: size + 8, textAlign: "center" }}
    >
      {flag ?? "🏳️"}
    </Text>
  );
}

interface CardProps {
  country: CountrySummaryDto;
  onPress: (code: string) => void;
}

/** Ana ekran "öne çıkan ülkeler" şeridindeki görselli kart. */
export const FeaturedCountryCard = memo(function FeaturedCountryCard({ country, onPress }: CardProps) {
  const capital = joinCapitals(country.capital);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${country.name}${capital ? `, başkent ${capital}` : ""}`}
      accessibilityHint="Ülke rehberini açar"
      onPress={() => onPress(country.code)}
      style={({ pressed }) => [styles.featured, pressed && styles.pressed]}
    >
      <RemoteImage
        uri={country.imageUrl}
        alt={`${country.name} kapak görseli`}
        height={FEATURED_IMAGE_HEIGHT}
        radius={0}
      />
      <View style={styles.featuredInfo}>
        <View style={styles.nameRow}>
          <Text accessible={false} style={styles.smallFlag}>
            {country.flag ?? ""}
          </Text>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
            {country.name}
          </Text>
        </View>
        {capital ? (
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {capital}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
});

/** Kıta ekranı ve arama sonuçlarındaki satır: bayrak, ad, başkent, rehber rozeti. */
export const CountryRow = memo(function CountryRow({ country, onPress }: CardProps) {
  const capital = joinCapitals(country.capital);
  return (
    <Card
      padded={false}
      onPress={() => onPress(country.code)}
      accessibilityLabel={`${country.name}${capital ? `, başkent ${capital}` : ""}${country.hasTravel ? ", seyahat rehberi var" : ""}`}
      accessibilityHint="Ülke ayrıntısını açar"
    >
      <View style={styles.row}>
        <FlagEmoji flag={country.flag} />
        <View style={styles.flex}>
          <Text variant="bodyStrong" numberOfLines={2}>
            {country.name}
          </Text>
          {capital ? (
            <Text variant="small" color="textSecondary" numberOfLines={1}>
              {capital}
            </Text>
          ) : null}
        </View>
        {country.hasTravel ? <Badge label="Rehber" tone="gold" /> : null}
        <Icon name="chevron-forward" size={20} color="textMuted" />
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  featured: {
    width: FEATURED_CARD_WIDTH,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.8 },
  featuredInfo: { padding: spacing.md, gap: spacing.xxs },
  nameRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  smallFlag: { fontSize: 16, lineHeight: 22 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 64 },
});
