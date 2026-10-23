import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { Edge } from "react-native-safe-area-context";

import { spacing } from "@/theme";
import { Header, Screen, Text } from "@/ui";

/** Geniş ekranda (web, tablet) form okunaklı genişlikte kalır. */
const FORM_MAX_WIDTH = 480;

export interface FormScreenProps {
  title: string;
  /** Başlığın altında formdan önce gösterilen kısa açıklama. */
  intro?: string;
  children: ReactNode;
  /** Sekmesiz modal ekranda alt kenar da eklenir (giriş, kayıt). */
  edges?: readonly Edge[];
  /** Geri düğmesi davranışı; verilmezse Header'ın varsayılanı (önceki ekran, yoksa ana sayfa). */
  onBack?: () => void;
  testID?: string;
}

/** Giriş, kayıt ve profil formlarının ortak iskeleti: başlık + geri, klavyeden kaçınan kaydırma alanı. */
export function FormScreen({ title, intro, children, edges, onBack, testID }: FormScreenProps) {
  return (
    <Screen edges={edges} keyboardAvoiding header={<Header title={title} back={onBack ?? true} />} testID={testID}>
      <View style={styles.form}>
        {intro ? (
          <Text variant="body" color="textSecondary">
            {intro}
          </Text>
        ) : null}
        {children}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { width: "100%", maxWidth: FORM_MAX_WIDTH, alignSelf: "center", gap: spacing.lg },
});
