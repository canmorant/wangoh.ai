import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import DistanceGame from "@/features/distance-game/DistanceGame";
import { countryNamesFor, guideLinks, guideNames } from "@/features/distance-game/serverData";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { resolveLocale } from "@/i18n/server";
import { translatedAlternates } from "@/i18n/seo";
import { ClientMessages, CLIENT_NAMESPACES } from "@/i18n/clientMessages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.distance" });
  return {
    title: t("title"),
    description: t("description"),
    // Arayüz tamamen çevrili: her dilin kendi canonical'ı, hreflang yayındaki diller.
    alternates: translatedAlternates("/mesafe", locale),
  };
}

/**
 * "Kaç kilometre?" oyunu. Şehir verisi yalnız bu sayfanın istemci paketinde
 * (DistanceGame içe aktarır); sunucu yalnız ülke adlarını, rehber bağlantı
 * haritasını ve rehberi olan şehirlerin sitedeki adlarını prop olarak verir. Adres: tr /mesafe, en /distance, es /distancia
 * (bkz. i18n/paths.ts).
 */
export default async function DistancePage({ params }: Props) {
  const locale = await resolveLocale(params);
  return (
    <>
      <SiteHeader locale={locale} />
      <ClientMessages namespaces={CLIENT_NAMESPACES.distance}>
        <DistanceGame countryNames={countryNamesFor(locale)} guideLinks={guideLinks()} guideNames={guideNames()} />
      </ClientMessages>
      <SiteFooter />
    </>
  );
}
