import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Yayındaki diller (bkz. src/i18n/routing.ts). Ortamda verilmediyse web
 * sitesinde içeriği tamamen çevrilip kontrol edilen Türkçe, İngilizce ve
 * İspanyolca. Yeni bir dil yalnız tüm içeriği çevrilip kontrol edildikten
 * sonra bu listeye eklenir.
 */
const siteLocales = process.env.NEXT_PUBLIC_SITE_LOCALES ?? "tr,en,es";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_LOCALES: siteLocales,
  },
  // Ortak API istemcisi (packages/api-client) derlenmeden TypeScript kaynağı olarak tüketilir.
  transpilePackages: ["@wangoh/api-client"],
  experimental: {
    // Kök layout üst seviye dinamik bir segmentte (app/[locale]/layout.tsx).
    // Next 16 dokümanı bu yapı için global-not-found.tsx öneriyor: hiçbir
    // route'a uymayan istekleri layout render etmeden karşılıyor.
    globalNotFound: true,
  },
  // *.web.ts(x) dosyaları (sunucu gerektiren API'ler ör. api/konum ve
  // derin yollar için genel 404 yakalayıcı [...rest]) route olarak tanınsın.
  pageExtensions: ["tsx", "ts", "jsx", "js", "web.ts", "web.tsx"],
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
};

export default withNextIntl(nextConfig);
