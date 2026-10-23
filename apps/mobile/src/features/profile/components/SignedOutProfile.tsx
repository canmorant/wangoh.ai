import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Button, Icon, Text, type IconName } from "@/ui";

const BENEFITS: ReadonlyArray<{ icon: IconName; text: string }> = [
  { icon: "trophy-outline", text: "Oyun puanların hesabına kaydedilir" },
  { icon: "podium-outline", text: "Liderlik tablosunda yer alırsın" },
  { icon: "stats-chart-outline", text: "İstatistiklerini ve son skorlarını görürsün" },
];

/** Oturum yokken tanıtım ve giriş/kayıt çağrısı. */
export function SignedOutProfile() {
  return (
    <View style={styles.box} testID="profile-signed-out">
      <View style={styles.iconWrap}>
        <Icon name="person-circle-outline" size={36} color="gold" />
      </View>
      <Text variant="heading" align="center">
        Wangoh hesabın
      </Text>
      <Text variant="body" color="textSecondary" align="center">
        Giriş yap ya da ücretsiz hesap oluştur; oyun ilerlemen hesabında tutulur.
      </Text>
      <View style={styles.benefits}>
        {BENEFITS.map((item) => (
          <View key={item.text} style={styles.benefit}>
            <Icon name={item.icon} size={20} color="gold" />
            <Text variant="small" style={styles.benefitText}>
              {item.text}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Button title="Giriş yap" onPress={() => router.push("/login")} fullWidth testID="profile-login" />
        <Button title="Hesap oluştur" variant="secondary" onPress={() => router.push("/register")} fullWidth testID="profile-register" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl, width: "100%", maxWidth: 480, alignSelf: "center" },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.goldSoft,
    marginBottom: spacing.sm,
  },
  benefits: { alignSelf: "stretch", gap: spacing.md, marginVertical: spacing.md },
  benefit: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  benefitText: { flex: 1 },
  actions: { alignSelf: "stretch", gap: spacing.md },
});
