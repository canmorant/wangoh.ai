import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CLIENT_NAMESPACES, clientMessages } from "@/i18n/clientMessages";
import { GeistSans } from "geist/font/sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "../globals.css";
import { SITE } from "@/lib/site";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { routing } from "@/i18n/routing";
import { OG_LOCALE, ogAlternateLocales, translatedAlternates } from "@/i18n/seo";
import { ogImage } from "@/lib/ogImage";
import { HERO_PLATE } from "@/lib/heroPlate";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ConsentManager from "@/components/consent/ConsentManager";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/consent";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };


/** Altı dilin hepsi derleme anında üretilsin (statik). */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata.site" });

  return {
    metadataBase: new URL(SITE.url),
    title: t("title"),
    description: t("description"),
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
    // Ana ekrana eklenince görünen ad, açıklama ve başlangıç adresi dile göre.
    // Kendi manifest dosyası olmayan diller İngilizcesini kullanır.
    manifest:
      locale === "tr"
        ? "/manifest.webmanifest"
        : locale === "es"
          ? "/manifest.es.webmanifest"
          : "/manifest.en.webmanifest",
    applicationName: SITE.name,
    appleWebApp: {
      capable: true,
      title: SITE.name,
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
    // Kendi canonical'ını vermeyen sayfalar (ana sayfa) bunu miras alıyor;
    // Türkçede eskisi gibi "/", diğer dillerde "/en" vb.
    alternates: translatedAlternates("/", locale),
    // Kendi görselini vermeyen sayfaların (ana sayfa, testler, bayrak oyunu,
    // kurumsal sayfalar) paylaşım görseli: ana sayfanın pencere manzarası.
    // og:title/description burada verilmiyor: Next onları her sayfanın kendi
    // title/description'ından türetiyor; burada verilse alt sayfalar ana
    // sayfanın başlığını miras alırdı.
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: ogAlternateLocales(locale),
      siteName: SITE.name,
      images: [ogImage(HERO_PLATE, SITE.name)!],
    },
    twitter: { card: "summary_large_image", images: [ogImage(HERO_PLATE, SITE.name)!.url] },
    other: ADSENSE_CLIENT ? { "google-adsense-account": ADSENSE_CLIENT } : undefined,
  };
}

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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Statik üretim için: bu istekte hangi dilin geçerli olduğunu next-intl'e
  // bildir. Aksi hâlde getTranslations başlıklara bakar ve sayfa dinamikleşir.
  setRequestLocale(locale);
  // Yalnız her sayfada olan istemci bileşenlerinin mesajları; sayfalar kendi
  // ihtiyaçlarını <ClientMessages> ile ekliyor (bkz. i18n/clientMessages.tsx).
  const messages = await clientMessages(CLIENT_NAMESPACES.global);

  return (
    <html lang={locale} className={`${GeistSans.variable} antialiased`}>
      <head>
        {/*
          Google Consent Mode v2: varsayılan izin durumu HTML ayrıştırılırken,
          AdSense ve Analytics dahil her etiketten önce çalışmalı. next/script
          beforeInteractive betiği gövdeye ve Next'in kendi kuyruğuna koyduğu
          için düz satır içi betik kullanılıyor.
        */}
        <script id="consent-default" dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          {/* Çerez izin penceresi; Google Analytics'i yalnız izinle yükler. */}
          <ConsentManager />
        </NextIntlClientProvider>
        <ServiceWorkerRegister />
        {process.env.VERCEL ? (
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}
