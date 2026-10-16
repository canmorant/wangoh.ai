import { Platform, type TextStyle } from "react-native";

/**
 * Web sitesi Geist Sans (gövde) ve Instrument Serif (başlık) kullanır. Mobilde yazı tipi dosyası
 * paketlenmez: gövde sistem yazı tipi, marka başlığı (display) platformun serif'idir.
 */
export const fontFamily = {
  /** undefined: platformun sistem yazı tipi. */
  body: undefined as string | undefined,
  display: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, 'Times New Roman', serif" }),
} as const;

export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body"
  | "bodyStrong"
  | "small"
  | "caption"
  | "label"
  | "button";

/** Satır yüksekliği yazı boyutunun yaklaşık 1,4 katı; sistem yazı tipi ölçeklemesiyle (Dynamic Type) uyumlu. */
export const typography: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fontFamily.display, fontSize: 34, lineHeight: 40, fontWeight: "700", letterSpacing: -0.3 },
  title: { fontFamily: fontFamily.display, fontSize: 26, lineHeight: 32, fontWeight: "700", letterSpacing: -0.2 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: "700" },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  small: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" },
  /** Küçük büyük-harf etiket: bölüm üst başlığı, form alanı etiketi. */
  label: { fontSize: 13, lineHeight: 18, fontWeight: "600", letterSpacing: 0.4 },
  button: { fontSize: 16, lineHeight: 22, fontWeight: "600" },
};
