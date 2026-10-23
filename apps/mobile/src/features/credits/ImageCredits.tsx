import type { ImageCreditDto } from "@wangoh/api-client";
import { useMemo, useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, View, type TextStyle } from "react-native";

import { colors, minTouchTarget, spacing } from "@/theme";
import { Text } from "@/ui";

import { CREDITS_TITLE, SOURCE_LABEL, buildCreditRows, openSafeUrl, type CreditRow } from "./creditRows";

export interface ImageCreditsProps {
  /** API'nin ayrıntı yanıtındaki `imageCredits` (yalnız atıf gerektiren görseller). Boş/yok: hiçbir şey çizilmez. */
  credits: readonly ImageCreditDto[] | null | undefined;
  testID?: string;
}

function ExternalLink({ url, label, a11yLabel, testID }: { url: string; label: string; a11yLabel: string; testID: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={a11yLabel}
      onPress={() => openSafeUrl(url, (target) => Linking.openURL(target))}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}
      testID={testID}
    >
      <Text variant="small" color="gold" style={styles.underline}>
        {label}
      </Text>
    </Pressable>
  );
}

function Separator() {
  return (
    <Text variant="small" color="textMuted" style={styles.separator} accessible={false} importantForAccessibility="no">
      ·
    </Text>
  );
}

/**
 * Bir görselin satırı: `yazar · Kaynak · lisans`. Yazar uzunsa (kaynakta birkaç yüz karakterlik açıklamalar var) kendi satırlarına
 * sarılır, kırpılmaz; bağlantı grubu ("Kaynak · lisans", bölünmez) altına iner. Bağlantılar 44 pt hedeflidir.
 */
function CreditLine({ row }: { row: CreditRow }) {
  const [wrapped, setWrapped] = useState(false);
  const hasLinks = row.sourceUrl !== null || row.licenseName !== null;

  return (
    <View style={styles.line} testID="image-credit-row">
      {row.author ? (
        <View style={[styles.authorBox, wrapped && styles.authorBoxWrapped]}>
          {/* Noktayı ekran okuyucu okumasın: etiket yalnız yazar metnidir. */}
          <Text variant="small" color="textSecondary" style={styles.author} accessibilityLabel={row.author} testID="credit-author">
            {row.author}
            {/* Ayırıcı yazarın son sözcüğüne yapışık (bölünmeyen boşluk) kalır; bağlantılar alta inince görünmez olur ama yerini korur. */}
            {hasLinks ? <Text color={wrapped ? "transparent" : "textMuted"}>{"\u00A0·"}</Text> : null}
          </Text>
        </View>
      ) : null}
      {hasLinks ? (
        <View
          style={[styles.links, wrapped && styles.linksWrapped]}
          // Bağlantı grubu yazarın altına indiyse (üst koordinatı > 0) aralık sıkılaştırılır ve ayırıcı gizlenir (genişlikleri değişmez: sarma kararı sallanmaz).
          onLayout={(event) => setWrapped(row.author !== null && event.nativeEvent.layout.y > 1)}
        >
          {row.sourceUrl ? <ExternalLink url={row.sourceUrl} label={SOURCE_LABEL} a11yLabel={row.sourceA11yLabel} testID="credit-source" /> : null}
          {row.sourceUrl && row.licenseName ? <Separator /> : null}
          {row.licenseName ? (
            row.licenseUrl && row.licenseA11yLabel ? (
              <ExternalLink url={row.licenseUrl} label={row.licenseName} a11yLabel={row.licenseA11yLabel} testID="credit-license" />
            ) : (
              <Text variant="small" color="textSecondary" style={styles.licenseText} testID="credit-license">
                {row.licenseName}
              </Text>
            )
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/**
 * Görsel atıfları: ekranın SONUNDA, kaydırmanın sonunda duran, gizli/katlanmış olmayan bölüm (CC BY / CC BY-SA lisans koşulu).
 * Her görsel için bir satır: yazar · Kaynak (sayfa bağlantısı) · lisans adı (lisans bağlantısı). Bağlantılar yalnız http/https açar.
 * Gösterilecek atıf yoksa hiçbir şey çizmez.
 */
export function ImageCredits({ credits, testID = "image-credits" }: ImageCreditsProps) {
  const rows = useMemo(() => buildCreditRows(credits), [credits]);
  if (rows.length === 0) return null;
  return (
    <View style={styles.section} testID={testID}>
      <Text variant="bodyStrong" color="textSecondary" accessibilityRole="header">
        {CREDITS_TITLE}
      </Text>
      <View style={styles.list}>
        {rows.map((row) => (
          <CreditLine key={row.key} row={row} />
        ))}
      </View>
    </View>
  );
}

/** Web'de boşluksuz uzun dizgiler (dosya adları: "Brno_Katedrála_sv._Petra...") taşmasın; yerelde sistem zaten karakterden böler. */
const breakLongWords = Platform.select<TextStyle>({ web: { overflowWrap: "anywhere" } as unknown as TextStyle, default: {} });

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  list: { gap: spacing.xs },
  line: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" },
  // Kısa yazar bağlantılarla aynı satırda, onlarla aynı 44 pt yükseklikte ortalanır; uzunsa tek başına satırı doldurur ve sarılır.
  authorBox: { flexShrink: 1, minHeight: minTouchTarget, justifyContent: "center" },
  authorBoxWrapped: { minHeight: 0, paddingVertical: spacing.xs },
  author: { flexShrink: 1, ...breakLongWords },
  // Grup yazarın altına indiğinde bağlantının görünmez dokunma payı yazı satırının üstüne biner (yazar metni dokunulabilir değil).
  links: { flexDirection: "row", alignItems: "center", flexShrink: 0 },
  // Yatay kayma yerleşimi değiştirmez (transform): sarma kararı sallanmaz. Bağlantı yazıları yazar metniyle aynı sola hizalanır.
  linksWrapped: { marginTop: -spacing.sm, transform: [{ translateX: -spacing.xs }] },
  licenseText: { paddingVertical: spacing.xs },
  separator: { paddingHorizontal: spacing.xs },
  link: { minHeight: minTouchTarget, minWidth: minTouchTarget, justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.xs },
  underline: { textDecorationLine: "underline" },
  pressed: { opacity: 0.7 },
});
