import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Offline" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: false },
  };
}

/**
 * Service worker'ın çevrimdışıyken, önbellekte de bulunmayan bir sayfa
 * istendiğinde gösterdiği yedek.
 */
export default async function OfflinePage({ params }: Props) {
  await resolveLocale(params);
  const t = await getTranslations("Offline");
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-6">
      <div className="max-w-[46ch] text-center">
        <p className="text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="font-display mt-5 text-[clamp(2rem,7vw,3rem)] leading-[1.05] text-white">
          {t("title")}
        </h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-white/55">{t("body")}</p>
        <Link
          href="/"
          className="mt-9 inline-block rounded-full border border-white/15 px-7 py-3 text-[11px] tracking-[0.2em] text-white/70 uppercase transition-colors duration-300 hover:border-white/35 hover:text-white"
        >
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
