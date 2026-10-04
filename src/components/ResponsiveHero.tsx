"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

/**
 * Pencereden içeri giren sinematik sahne her cihazda çalışıyor; telefonlarda
 * ve zayıf donanımda useAdaptiveMotionQuality "lite" kaliteye geçip ağır
 * katmanları (ara bulanıklık, iki bulut katmanı, gren) kapatıyor.
 *
 * Sahne istemcide yükleniyor. Parçası gelene kadar (ve sunucu çıktısında)
 * aynı cam-kenarı kompozisyonunu tek fotoğraf ve CSS ile çizen hafif sürüm
 * yer tutuyor; yüksekliği sahneyle aynı olduğu için yüklenince sayfa kaymıyor.
 */
const CinematicHero = dynamic(() => import("./CinematicHero"), {
  ssr: false,
  loading: () => <LightweightHero />,
});

export default function ResponsiveHero() {
  return <CinematicHero />;
}

function LightweightHero() {
  const t = useTranslations("Hero");
  return (
    <section
      className="relative h-[265svh] bg-[#0b0d12] sm:h-[310vh]"
      aria-label={t("regionLabel")}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-[center_62%]"
          style={{
            backgroundImage:
              "url('/images/photo-1568515387631-8b650bbcdb90-ff3791ae.avif')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,22,0.5)_0%,rgba(8,12,22,0.08)_38%,rgba(6,9,16,0.82)_100%)]" />

        {/* Sahnedeki pencereyle aynı yerde (ekranın ortası) dursun ki sahne
            yüklenince çerçeve zıplamasın. */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[43vh] max-h-[410px] min-h-[290px] w-[58vw] min-w-[210px] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[44%] border-[18px] border-[#e6e6e2] shadow-[0_0_0_12px_rgba(172,173,171,0.95),0_0_0_999px_rgba(12,14,19,0.58),0_18px_45px_rgba(0,0,0,0.45)]"
        >
          <span className="absolute inset-0 rounded-[38%] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),transparent_38%)]" />
        </div>

        <div className="absolute bottom-0 left-0 z-10 max-w-[88vw] px-5 pb-[calc(2rem_+_env(safe-area-inset-bottom))] sm:px-10 sm:pb-16">
          <p className="font-display text-[clamp(2.2rem,11vw,4.9rem)] leading-[0.94] text-white">
            <span className="block italic font-light text-white/95">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
            <span className="block">{t("titleLine3")}</span>
          </p>
          <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/55">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
