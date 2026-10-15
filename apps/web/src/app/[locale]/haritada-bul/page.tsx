import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import MapGame from "@/features/map-game/MapGame";
import { countryNamesFor, guideLinks, guideNames } from "@/features/distance-game/serverData";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { resolveLocale } from "@/i18n/server";
import { translatedAlternates } from "@/i18n/seo";
import { ClientMessages, CLIENT_NAMESPACES } from "@/i18n/clientMessages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.mapGame" });
  return {
    title: t("title"),
    description: t("description"),
    // Arayüz tamamen çevrili: her dilin kendi canonical'ı, hreflang yayındaki diller.
    alternates: translatedAlternates("/haritada-bul", locale),
  };
}

/**
 * "Haritada Bul" oyunu. Şehir verisi yalnız bu sayfanın istemci paketinde (MapGame içe
 * aktarır); sunucu yalnız ülke adlarını, rehber bağlantı haritasını ve rehberi olan
 * şehirlerin sitedeki adlarını prop olarak verir (Kaç kilometre? ile aynı). Adres:
 * tr /haritada-bul, en /find-on-map, es /encuentra-en-el-mapa (bkz. i18n/paths.ts).
 */
export default async function MapGamePage({ params }: Props) {
  const locale = await resolveLocale(params);
  return (
    <>
      <SiteHeader locale={locale} />
      <ClientMessages namespaces={CLIENT_NAMESPACES.mapGame}>
        <MapGame countryNames={countryNamesFor(locale)} guideLinks={guideLinks()} guideNames={guideNames()} />
      </ClientMessages>
      <SiteFooter />
    </>
  );
}
