import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";
import ConsentSettingsButton from "./consent/ConsentSettingsButton";

// Hem sunucu sayfalarında hem istemci bileşeni HomeExperience içinde
// render ediliyor; bu yüzden async getTranslations değil useTranslations.
const corporateLinks = [
  { href: "/gezi-rehberleri", key: "allGuides" },
  { href: "/hakkimizda", key: "about" },
  { href: "/iletisim", key: "contact" },
] as const;

const policyLinks = [
  { href: "/gizlilik-politikasi", key: "privacy" },
  { href: "/cerez-politikasi", key: "cookies" },
  { href: "/kullanim-kosullari", key: "terms" },
] as const;

export default function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#070a12] px-5 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto grid max-w-[1160px] gap-10 md:grid-cols-[1.35fr_1fr_1fr] md:gap-12">
        <div>
          <Link
            href="/"
            className="text-[13px] tracking-[0.34em] text-white/90 uppercase transition-opacity hover:opacity-70"
          >
            Wangoh
          </Link>
          <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-white/38">
            {t("tagline")}
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-5 inline-block text-[13px] text-[var(--gold)]/80 transition-colors hover:text-[var(--gold)]"
          >
            {SITE.email}
          </a>
        </div>

        <nav aria-label={t("corporateNav")}>
          <p className="text-[9.5px] tracking-[0.24em] text-white/25 uppercase">Wangoh</p>
          <ul className="mt-4 space-y-3">
            {corporateLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("policyNav")}>
          <p className="text-[9.5px] tracking-[0.24em] text-white/25 uppercase">
            {t("policyHeading")}
          </p>
          <ul className="mt-4 space-y-3">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <ConsentSettingsButton
                label={t("cookieSettings")}
                className="text-left text-[13px] text-white/50 transition-colors hover:text-white"
              />
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1160px] flex-col gap-2 border-t border-white/[0.06] pt-6 text-[11px] leading-relaxed text-white/22 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p>
            {t.rich("imageSource", {
              link: (chunks) => (
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white/50"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <LanguageSwitcher className="-mx-3 text-white/45" />
        </div>
      </div>
    </footer>
  );
}
