"use client";

import { useTranslations } from "next-intl";
import { IS_APP_BUILD } from "@/i18n/routing";
import FloatingNav from "./FloatingNav";

/**
 * Ana sayfa dışındaki sayfaların üst menüsü: ana sayfadaki FloatingNav'ın
 * aynısı. Rastgele kulüp ve ülke çarkı ana sayfanın içinde açılan katmanlar
 * olduğu için buradan ana sayfaya ?open=... ile gidiyor; HomeExperience
 * açılışta ilgili katmanı açıyor.
 */
export default function SiteNav({
  searchDictionaryUrl,
  topInset = true,
}: {
  searchDictionaryUrl?: string;
  /**
   * Uygulamada üst menü güvenli alanın (çentik/ada) altına iniyor; sayfalar menüyü
   * web'deki yerine (üstten 12px) göre boşluklandırılmış. Aradaki farkı, sayfa
   * içeriği menüyle çakışmasın diye burada boşlukla ekliyoruz. Kendi güvenli alan
   * payını taşıyan sayfalar (oyunlar) false verir.
   */
  topInset?: boolean;
}) {
  const t = useTranslations("Nav");
  return (
    <>
      <FloatingNav
        searchDictionaryUrl={searchDictionaryUrl}
        actions={[
          { label: t("tests"), href: "/tests" },
          { label: t("randomClub"), href: "/?open=club" },
          { label: t("countryWheel"), href: "/?open=wheel" },
          { label: t("guessFlag"), href: "/flags" },
          { label: t("distance"), href: "/mesafe" },
          { label: t("mapGame"), href: "/haritada-bul" },
        ]}
      />
      {IS_APP_BUILD && topInset && (
        <div aria-hidden className="h-[calc(max(0.75rem,env(safe-area-inset-top))_-_0.75rem)]" />
      )}
    </>
  );
}
