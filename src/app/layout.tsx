import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { SITE, absolute } from "@/lib/site";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Wangoh — Hiç Gitmediğin Bir Yere Var",
  description:
    "Dünyanın en güzel şehirlerine açılan bir cam kenarı. Unutulmaz rotalar, büyüleyici duraklar, kesintisiz tek bir manzara.",
  keywords: ["seyahat", "keşif", "uçuş", "rotalar", "wangoh"],
  manifest: "/manifest.webmanifest",
  applicationName: "Wangoh",
  appleWebApp: {
    capable: true,
    title: "Wangoh",
    // Durum çubuğu koyu zeminle kaynaşsın.
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
  alternates: { canonical: absolute("/") },
  other: ADSENSE_CLIENT
    ? { "google-adsense-account": ADSENSE_CLIENT }
    : undefined,
};

/**
 * theme-color: Android'de adres çubuğunu ve uygulama modunda durum çubuğunu
 * sitenin zeminiyle aynı renge boyar. viewportFit=cover, iPhone'da çentik
 * altındaki alanı da kullanmamızı sağlıyor.
 */
export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${GeistSans.variable} antialiased`}>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
