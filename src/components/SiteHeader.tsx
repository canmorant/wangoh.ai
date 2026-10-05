import { ClientMessages, CLIENT_NAMESPACES } from "@/i18n/clientMessages";
import { ContentTextProvider } from "@/components/ContentText";
import { destinationDictionary } from "@/content/i18n/destinations";
import type { AppLocale } from "@/i18n/routing";
import SiteNav from "./SiteNav";

/**
 * Rehber, ülke, test ve bayrak sayfalarının üst menüsü. Menünün ve içindeki
 * aramanın mesajlarını ve destinasyon sözlüğünü kendisi sağlıyor; sayfanın
 * geri kalanının istemci mesajlarına dokunmuyor.
 */
export default async function SiteHeader({ locale }: { locale: AppLocale }) {
  return (
    <ClientMessages namespaces={CLIENT_NAMESPACES.nav}>
      {process.env.BUILD_TARGET === "app" || locale === "tr" ? (
        <ContentTextProvider dictionary={destinationDictionary(locale)}>
          <SiteNav />
        </ContentTextProvider>
      ) : (
        <SiteNav searchDictionaryUrl={`/api/search-dictionary/${locale}`} />
      )}
    </ClientMessages>
  );
}
