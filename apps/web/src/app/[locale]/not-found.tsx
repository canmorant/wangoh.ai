import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Dil öneki altındaki 404 — sayfaların notFound() çağrısı ve eşleşmeyen
 * derin yollar ([...rest]) buraya düşer. Dil layout'tan geliyor.
 */
export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-6">
      <div className="max-w-[46ch] text-center">
        <p className="text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">{t("eyebrow")}</p>
        <h1 className="font-display mt-5 text-[clamp(2rem,7vw,3rem)] leading-[1.05] text-white">
          {t("title")}
        </h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-white/55">{t("description")}</p>
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
