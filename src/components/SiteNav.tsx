"use client";

import { useTranslations } from "next-intl";
import FloatingNav from "./FloatingNav";

/**
 * Ana sayfa dışındaki sayfaların üst menüsü: ana sayfadaki FloatingNav'ın
 * aynısı. Rastgele kulüp ve ülke çarkı ana sayfanın içinde açılan katmanlar
 * olduğu için buradan ana sayfaya ?open=... ile gidiyor; HomeExperience
 * açılışta ilgili katmanı açıyor.
 */
export default function SiteNav() {
  const t = useTranslations("Nav");
  return (
    <FloatingNav
      actions={[
        { label: t("tests"), href: "/tests" },
        { label: t("randomClub"), href: "/?open=club" },
        { label: t("countryWheel"), href: "/?open=wheel" },
        { label: t("guessFlag"), href: "/flags" },
      ]}
    />
  );
}
