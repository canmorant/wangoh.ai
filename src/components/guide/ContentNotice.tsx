import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";

/**
 * Ana içeriği henüz yalnızca Türkçe olan sayfalarda (rehberler, ülke
 * sayfaları, kurumsal metinler) Türkçe dışındaki dillerde gösterilen not.
 * Kullanıcı arayüzü kendi dilinde görürken neden Türkçe metin okuduğunu
 * bilsin. Türkçede hiçbir şey render etmez.
 *
 * SEO tarafı ayrı: bu sayfalar o dillerde noindex ve canonical'ları Türkçe
 * sürüme bakıyor (i18n/seo.ts → turkishOnlySeo).
 */
export default function ContentNotice() {
  const locale = useLocale();
  const t = useTranslations("Content");
  if (locale === "tr") return null;
  return (
    <aside
      lang={locale}
      className="mb-8 flex items-start gap-3 rounded-2xl border border-[var(--gold)]/20 bg-[var(--gold)]/[0.05] px-5 py-4"
    >
      <Languages className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]/80" aria-hidden />
      <div>
        <p className="text-[13.5px] leading-relaxed text-white/80">{t("turkishOnly")}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/45">{t("turkishOnlyHint")}</p>
      </div>
    </aside>
  );
}
