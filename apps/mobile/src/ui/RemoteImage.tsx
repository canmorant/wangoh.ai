import { Image, type ImageContentFit } from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius as radii } from "@/theme";

import { Icon } from "./Icon";

export interface RemoteImageProps {
  /** API'nin mutlak görsel adresi (`imageUrl`, `flagUrl`...). Yoksa yer tutucu çizilir. */
  uri?: string | null;
  /** Görselin içeriğini anlatan metin. Süs amaçlıysa boş metin (`""`) verilir: ekran okuyucu atlar. */
  alt: string;
  /** Genişlik/yükseklik oranı (ör. 16/9). Yükseklik verilmezse bununla hesaplanır. */
  aspectRatio?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  contentFit?: ImageContentFit;
  style?: StyleProp<ViewStyle>;
}

/**
 * Uzaktan görsel. expo-image disk/bellek önbelleği ve yumuşak geçiş sağlar; yüklenene kadar ve
 * adres yoksa ya da yükleme başarısızsa yüzey renginde simgeli yer tutucu görünür.
 */
export function RemoteImage({
  uri,
  alt,
  aspectRatio,
  width = "100%",
  height,
  radius = radii.md,
  contentFit = "cover",
  style,
}: RemoteImageProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const showImage = Boolean(uri) && failedUri !== uri;
  const decorative = alt === "";

  return (
    <View
      style={[styles.frame, { width, height, aspectRatio: height === undefined ? aspectRatio : undefined, borderRadius: radius }, style]}
      accessible={!decorative}
      accessibilityRole="image"
      accessibilityLabel={decorative ? undefined : alt}
    >
      <View style={[StyleSheet.absoluteFill, styles.placeholder]}>
        <Icon name="image-outline" size={28} color="textMuted" />
      </View>
      {showImage && uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          transition={200}
          recyclingKey={uri}
          accessible={false}
          onError={() => setFailedUri(uri)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: "hidden", backgroundColor: colors.surface },
  placeholder: { alignItems: "center", justifyContent: "center" },
});
