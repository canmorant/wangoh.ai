import HomeExperience from "@/components/HomeExperience";
import GuideDiscovery from "@/components/guide/GuideDiscovery";
import JsonLd from "@/components/guide/JsonLd";
import { buildCityCardData } from "@/content/cityCardData";
import { destinationDictionary } from "@/content/localized";
import { ContentTextProvider } from "@/components/ContentText";
import { ClientMessages, CLIENT_NAMESPACES } from "@/i18n/clientMessages";
import { SITE, absolute } from "@/lib/site";
import { resolveLocale } from "@/i18n/server";
import { localizedUrl } from "@/i18n/seo";

// Meta veri (başlık, açıklama, canonical, hreflang) dil layout'undan geliyor.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return <>
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE.url}/#organization`,
            name: SITE.name,
            url: SITE.url,
            logo: absolute("/icons/icon-512.png"),
            email: SITE.email,
          },
          {
            "@type": "WebSite",
            name: SITE.name,
            url: localizedUrl("/", locale),
            inLanguage: locale === "tr" ? "tr-TR" : locale,
            publisher: { "@id": `${SITE.url}/#organization` },
          },
        ],
      }}
    />
    {/* Şehir görünümünün verisi burada, sunucuda hazırlanıyor; bkz. cityCardData.ts */}
    <ClientMessages namespaces={CLIENT_NAMESPACES.home}>
      <ContentTextProvider dictionary={destinationDictionary(locale)}>
        <HomeExperience guideLinks={<GuideDiscovery />} cityCardData={buildCityCardData(locale)} />
      </ContentTextProvider>
    </ClientMessages>
  </>;
}
