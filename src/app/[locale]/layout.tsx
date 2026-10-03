import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "../globals.css";
import { SITE } from "@/lib/site";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { routing } from "@/i18n/routing";
import { OG_LOCALE, translatedAlternates } from "@/i18n/seo";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

/**
 * Tarayıcıya yalnızca istemci bileşenlerinin kullandığı mesajlar gidiyor.
 * Rehber, ülke, kurumsal ve meta veri metinleri sunucuda çözülüyor; onları
 * her sayfanın HTML'ine gömmek boşuna ağırlık olurdu. İstemci bileşeninde
 * yeni bir namespace kullanılırsa buraya eklenmeli (eksikse next-intl
 * konsola MISSING_MESSAGE yazar).
 */
const CLIENT_NAMESPACES = [
  "Nav",
  "LanguageSwitcher",
  "Home",
  "Hero",
  "TravelData",
  "BoardingPass",
  "Destinations",
  "Flight",
  "CityCards",
  "Search",
  "Footer",
  "Common",
  "SecretRoute",
  "ClubReveal",
  "Geo",
  "Wheel",
  "FlagGame",
  "TravelTest",
] as const;

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
    manifest: "/manifest.webmanifest",
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
    openGraph: { locale: OG_LOCALE[locale], siteName: SITE.name },
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
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));

  return (
    <html lang={locale} className={`${GeistSans.variable} antialiased`}>
      <body>
        <NextIntlClientProvider messages={clientMessages}>{children}</NextIntlClientProvider>
        <ServiceWorkerRegister />
        {process.env.VERCEL ? (
          <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
        ) : null}
      </body>
    </html>
  );
}
