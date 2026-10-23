import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";
import { Button, Text } from "@/ui";

import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL, openExternalUrl } from "../legalLinks";

/** Kayıt öncesi yasal metinlere bağlantılar (web sitesindeki gerçek sayfalar). */
export function LegalNote() {
  return (
    <View style={styles.box}>
      <Text variant="small" color="textSecondary" align="center">
        Hesap oluşturmadan önce metinleri inceleyebilirsin:
      </Text>
      <View style={styles.links}>
        <Button
          title="Kullanım koşulları"
          variant="ghost"
          size="sm"
          onPress={() => openExternalUrl(TERMS_OF_USE_URL)}
          accessibilityHint="Web sitesinde açılır"
          testID="register-terms"
        />
        <Button
          title="Gizlilik politikası"
          variant="ghost"
          size="sm"
          onPress={() => openExternalUrl(PRIVACY_POLICY_URL)}
          accessibilityHint="Web sitesinde açılır"
          testID="register-privacy"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: "center", gap: spacing.xxs },
  links: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
});
