import { Linking } from "react-native";

/**
 * Yasal metinler web sitesindeki gerçek sayfalardır (apps/web: `gizlilik-politikasi`, `kullanim-kosullari`);
 * uygulama bunları kopyalamaz, tarayıcıda açar. Metinler yalnız web'de güncellenir.
 */
export const PRIVACY_POLICY_URL = "https://wangoh.com/tr/gizlilik-politikasi";
export const TERMS_OF_USE_URL = "https://wangoh.com/tr/kullanim-kosullari";

/** Bağlantıyı sistem tarayıcısında açar; açılamazsa (tarayıcı yok, engelli) sessizce vazgeçer. */
export function openExternalUrl(url: string): void {
  Linking.openURL(url).catch(() => undefined);
}
