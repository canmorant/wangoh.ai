import type { ReactNode } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import ContentNotice from "@/components/guide/ContentNotice";
import type { AppLocale } from "@/i18n/routing";

/** Politikaların son güncellenme tarihi (ISO); dile göre biçimlendirilir. */
const POLICY_UPDATED = "2026-10-04";

export default function LegalPage({
  eyebrow,
  title,
  summary,
  children,
  showUpdated = true,
  lang = "tr",
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
  showUpdated?: boolean;
  /** Metnin yazıldığı dil; arayüz dilinden farklıysa çeviri notu gösterilir. */
  lang?: AppLocale;
}) {
  const locale = useLocale();
  const t = useTranslations("Corporate");
  const format = useFormatter();
  // Ekran okuyucular doğru dilde okusun diye makale metnin diliyle,
  // arayüz parçaları kendi dilleriyle işaretli.
  return (
    <main className="px-4 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-20">
      <article lang={lang} className="mx-auto max-w-[840px]">
        {lang !== locale && <ContentNotice />}
        <header className="border-b border-white/[0.08] pb-10 sm:pb-12">
          <p className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-[var(--gold)]/75 uppercase">
            <span className="h-px w-8 bg-[var(--gold)]/35" />
            {eyebrow}
          </p>
          <h1 className="font-display mt-5 text-[clamp(2.6rem,9vw,4.8rem)] leading-[0.98] text-white">
            {title}
          </h1>
          <p className="mt-6 max-w-[66ch] text-[15px] leading-[1.75] text-white/58 sm:text-[16px]">
            {summary}
          </p>
          {showUpdated && (
            <p lang={locale} className="mt-5 text-[10px] tracking-[0.16em] text-white/28 uppercase">
              {t("lastUpdated", {
                date: format.dateTime(new Date(`${POLICY_UPDATED}T12:00:00Z`), {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                }),
              })}
            </p>
          )}
        </header>

        <div className="mt-10 space-y-12 sm:mt-14 sm:space-y-14">{children}</div>
      </article>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-display text-[clamp(1.55rem,4vw,2.15rem)] leading-tight text-white">
        {title}
      </h2>
      <div className="legal-copy mt-4 space-y-4 text-[14.5px] leading-[1.8] text-white/58 sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--gold)]/18 bg-[var(--gold)]/[0.045] p-5 text-[14px] leading-relaxed text-white/68 sm:p-6">
      {children}
    </div>
  );
}

