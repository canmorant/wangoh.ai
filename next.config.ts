import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * İki hedef, tek kod tabanı.
 *
 *   npm run build      → web sitesi (sunucuda çalışır, görsel optimizasyonu açık)
 *   npm run build:app  → Capacitor için statik export (out/ klasörü)
 *
 * Ayrım önemli, çünkü statik export'ta `next/image` optimizasyonu kapanıyor.
 * Web tarafında bu optimizasyon işe yarıyor: görsellerimiz AVIF ve Next,
 * AVIF desteklemeyen eski tarayıcılara aynı görseli JPEG olarak servis ediyor.
 * Uygulamada ise WebView zaten AVIF desteklediği için ham dosya yeterli.
 */
const isApp = process.env.BUILD_TARGET === "app";

const nextConfig: NextConfig = {
  experimental: {
    // Kök layout üst seviye dinamik bir segmentte (app/[locale]/layout.tsx).
    // Next 16 dokümanı bu yapı için global-not-found.tsx öneriyor: hiçbir
    // route'a uymayan istekleri layout render etmeden karşılıyor.
    globalNotFound: true,
  },
  ...(isApp
    ? {
        output: "export" as const,
        // Statik dosya sunucusunda /japonya yerine /japonya/index.html aranır.
        trailingSlash: true,
        // Export'ta optimizasyon sunucusu yok; dosyalar olduğu gibi servis edilir.
        images: { unoptimized: true },
      }
    : {
        // route.web.ts dosyaları (sunucu gerektiren API'ler, ör. api/konum)
        // yalnız web derlemesinde; statik export'ta sunucu olmadığı için
        // uygulama derlemesi onları hiç görmüyor.
        pageExtensions: ["tsx", "ts", "jsx", "js", "web.ts"],
        images: {
          // Yerel katalogdaki uzak görsellerin kaynaklarını açıkça sınırla.
          remotePatterns: [
            { protocol: "https" as const, hostname: "images.unsplash.com" },
            { protocol: "https" as const, hostname: "upload.wikimedia.org" },
            {
              protocol: "https" as const,
              hostname: "cdn.unenvironment.org",
              pathname: "/styles/article_billboard_image/s3/2024-10/jeju-2490410_1280.jpg",
              search: "?itok=w-WmxoYz",
            },
            {
              protocol: "https" as const,
              hostname: "ek5jbm9x6ox.exactdn.com",
              pathname: "/wp-content/uploads/2024/04/04084342/Amazing-View-in-Seorak-Copyright-Korea-Tourism-Organisation-Lee-Mo-yeon.jpg",
              search: "",
            },
          ],
        },
        // Güvenlik başlıkları sunucu işi; statik export'ta yok sayılırlar ve
        // Next uyarı basar. Uygulama paketinde zaten anlamsızlar.
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "DENY" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }),
};

export default withNextIntl(nextConfig);
