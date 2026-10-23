import { StyleSheet, View } from "react-native";

import type { AuthUser } from "@/auth";
import { colors, radius, spacing } from "@/theme";
import { Badge, Button, Card, Text } from "@/ui";

import { initialOf, roleLabel } from "../format";

export interface AccountCardProps {
  user: AuthUser;
  onEditName: () => void;
}

/** Hesap özeti: avatar harfi, görünen ad, e-posta, rol rozeti ve ad düzenleme. */
export function AccountCard({ user, onEditName }: AccountCardProps) {
  return (
    <Card testID="profile-account">
      <View style={styles.row}>
        <View style={styles.avatar} accessible={false} importantForAccessibility="no-hide-descendants">
          <Text variant="heading" color="gold">
            {initialOf(user.displayName)}
          </Text>
        </View>
        <View style={styles.texts}>
          <Text variant="subheading" numberOfLines={2} testID="profile-display-name">
            {user.displayName}
          </Text>
          <Text variant="small" color="textSecondary" numberOfLines={1} ellipsizeMode="middle" testID="profile-email">
            {user.email}
          </Text>
          <Badge label={roleLabel(user.role)} tone={user.role === "admin" ? "gold" : "neutral"} style={styles.badge} />
        </View>
      </View>
      <Button title="Görünen adı düzenle" variant="secondary" size="sm" onPress={onEditName} style={styles.edit} testID="profile-edit-name" />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  texts: { flex: 1, gap: spacing.xxs },
  badge: { marginTop: spacing.xs },
  edit: { marginTop: spacing.lg },
});
