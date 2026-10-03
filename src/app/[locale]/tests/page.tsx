import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TravelTest from "@/components/TravelTest";
import SiteFooter from "@/components/SiteFooter";
import { resolveLocale } from "@/i18n/server";
import { translatedAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.tests" });
  return {
    title: t("title"),
    description: t("description"),
    // Arayüz tamamen çevrili: her dilin kendi canonical'ı, hreflang altı dil.
    alternates: translatedAlternates("/tests", locale),
  };
}

export default async function TestsPage({ params }: Props) {
  await resolveLocale(params);
  return (
    <>
      <TravelTest />
      <SiteFooter />
    </>
  );
}
