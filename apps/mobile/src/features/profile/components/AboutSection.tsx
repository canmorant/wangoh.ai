import Constants from "expo-constants";
import { StyleSheet, View } from "react-native";

import { spacing } from "@/theme";
import { Card, Divider, SectionHeader, Text } from "@/ui";

import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL, openExternalUrl } from "@/features/auth";

import { ActionRow } from "./ActionRow";

/** Uygulama sürümü (app.json `version`); okunamazsa "—". */
export function getAppVersion(): string {
  const version = Constants.expoConfig?.version;
  return typeof version === "string" && version.length > 0 ? version : "—";
}

/** Yasal bağlantılar (web sitesindeki gerçek sayfalar) ve uygulama sürümü. Oturum açık olmasa da görünür. */
export function AboutSection() {
  return (
    <View testID="profile-about">
      <SectionHeader title="Hakkında" />
      <Card padded={false}>
        <ActionRow
          label="Gizlilik politikası"
          icon="shield-checkmark-outline"
          external
          onPress={() => openExternalUrl(PRIVACY_POLICY_URL)}
          testID="profile-privacy"
        />
        <Divider />
        <ActionRow
          label="Kullanım koşulları"
          icon="document-text-outline"
          external
          onPress={() => openExternalUrl(TERMS_OF_USE_URL)}
          testID="profile-terms"
        />
      </Card>
      <Text variant="caption" color="textMuted" align="center" style={styles.version} testID="profile-version">
        Wangoh · Sürüm {getAppVersion()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  version: { marginTop: spacing.lg },
});
