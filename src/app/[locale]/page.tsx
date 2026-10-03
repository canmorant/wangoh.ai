import HomeExperience from "@/components/HomeExperience";
import GuideDiscovery from "@/components/guide/GuideDiscovery";
import JsonLd from "@/components/guide/JsonLd";
import { buildCityCardData } from "@/content/cityCardData";
import { destinationDictionary } from "@/content/localized";
import { ContentTextProvider } from "@/components/ContentText";
import { ClientMessages, CLIENT_NAMESPACES } from "@/i18n/clientMessages";
import { SITE } from "@/lib/site";
import { resolveLocale } from "@/i18n/server";
import { localizedUrl } from "@/i18n/seo";

// Meta veri (başlık, açıklama, canonical, hreflang) dil layout'undan geliyor.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  return <>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: localizedUrl("/", locale), inLanguage: locale === "tr" ? "tr-TR" : locale }} />
    {/* Şehir görünümünün verisi burada, sunucuda hazırlanıyor; bkz. cityCardData.ts */}
    <ClientMessages namespaces={CLIENT_NAMESPACES.home}>
      <ContentTextProvider dictionary={destinationDictionary(locale)}>
        <HomeExperience guideLinks={<GuideDiscovery />} cityCardData={buildCityCardData(locale)} />
      </ContentTextProvider>
    </ClientMessages>
  </>;
}
