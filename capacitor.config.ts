import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Wangoh native kabuğu.
 *
 * Uygulama, `npm run build:app` ile üretilen statik export'u (out/) cihaza
 * gömer. Tüm rehberler ve 344 görsel pakette olduğu için çevrimdışı çalışır;
 * gezginler rehberi tam da roaming yokken açar.
 *
 * Derleme sırası:
 *   npm run build:app     → out/ (statik export, RSC yükleri budanmış)
 *   npx cap sync          → out/ içeriğini ios/ ve android/ projelerine kopyalar
 *   npx cap open ios      → Xcode'da aç, derle, cihaza yükle
 *   npx cap open android  → Android Studio'da aç
 */
const config: CapacitorConfig = {
  appId: "com.wangoh.app",
  appName: "Wangoh",
  webDir: "out",

  // Sitenin lacivert zemini. Açılış ve sayfa geçişlerinde beyaz flaş olmasın.
  backgroundColor: "#0a0e1a",

  server: {
    // Android WebView'ın içeriği https:// kaynağından sunması; service worker
    // ve güvenli bağlam gerektiren API'ler için şart.
    androidScheme: "https",
  },

  ios: {
    // Sitenin kendi zemini çentik altına kadar uzansın; WebView beyaz boşluk
    // bırakmasın.
    contentInset: "never",
    backgroundColor: "#0a0e1a",
  },

  android: {
    backgroundColor: "#0a0e1a",
    // Karışık içerik yok: her şey paketten ya da https'ten geliyor.
    allowMixedContent: false,
  },
};

export default config;
