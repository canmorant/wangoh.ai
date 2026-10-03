import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FlagGame from "@/features/flag-game/FlagGame";
import SiteFooter from "@/components/SiteFooter";
import { resolveLocale } from "@/i18n/server";
import { translatedAlternates } from "@/i18n/seo";
import { ClientMessages, CLIENT_NAMESPACES } from "@/i18n/clientMessages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Metadata.flags" });
  return {
    title: t("title"),
    description: t("description"),
    // Arayüz tamamen çevrili: her dilin kendi canonical'ı, hreflang altı dil.
    alternates: translatedAlternates("/flags", locale),
  };
}

export default async function FlagsPage({ params }: Props) {
  await resolveLocale(params);
  return (
    <>
      <ClientMessages namespaces={CLIENT_NAMESPACES.flags}>
        <FlagGame />
      </ClientMessages>
      <SiteFooter />
    </>
  );
}
