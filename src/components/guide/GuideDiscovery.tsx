import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { countryHref, hasGuide } from "@/content/guides";
import { countriesByRegion } from "@/content/regions";
import { SECRET_DESTINATION } from "@/data/secret";
import { countryName } from "@/lib/countryNames";

// Adresler her dilde aynı (Türkçe slug); dil öneki Link'ten geliyor.
const featured = [
  { id: "newYork", href: "/amerika-birlesik-devletleri/new-york" },
  { id: "madrid", href: "/ispanya/madrid" },
  { id: "tokyo", href: "/japonya/tokyo" },
  { id: "rome", href: "/italya/roma" },
  { id: "paris", href: "/fransa/paris" },
  { id: "barcelona", href: "/ispanya/barcelona" },
] as const;

export default function GuideDiscovery() {
  const t = useTranslations("Discovery");
  const locale = useLocale();
  // Ana sayfadan her ülke rehberine doğrudan bağlantı: rehberi olan ülkeler, bölge sırasıyla (gizli rota hariç).
  const guideCountries = countriesByRegion()
    .flatMap((r) => r.countries)
    .filter((c) => c.code !== SECRET_DESTINATION.code && c.cities.some((city) => hasGuide(c.code, city.name)));
  return <section id="gezi-rehberleri" aria-labelledby="guide-heading" className="relative bg-[#080b14] px-5 py-16 sm:px-10 sm:py-24">
    <div className="mx-auto max-w-[1160px]">
      <h2 id="guide-heading" className="font-display text-4xl text-white sm:text-5xl">{t("heading")}</h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">{t("intro")}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => <li key={item.href}>
          <Link prefetch={false} href={item.href} className="block h-full rounded-2xl border border-white/15 p-6 transition-colors hover:border-[var(--gold)]/60 focus-visible:outline-2 focus-visible:outline-[var(--gold)]">
            <h3 className="font-display text-2xl text-white">{t("guideTitle", { city: t(`featured.${item.id}.name`) })}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{t(`featured.${item.id}.detail`)}</p>
          </Link>
        </li>)}
      </ul>
      <h3 id="guide-countries-heading" className="mt-14 text-[11px] tracking-[0.3em] text-[var(--gold)]/75 uppercase">{t("countriesHeading")}</h3>
      <ul aria-labelledby="guide-countries-heading" className="mt-5 flex flex-wrap gap-2.5">
        {guideCountries.map((country) => <li key={country.code}>
          <Link prefetch={false} href={countryHref(country)} className="inline-block rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/75 transition-colors hover:border-[var(--gold)]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--gold)]">{countryName(country.code, locale, country.name)}</Link>
        </li>)}
      </ul>
      <Link prefetch={false} href="/gezi-rehberleri" className="mt-8 inline-block rounded-full border border-[var(--gold)]/40 px-6 py-3 text-sm text-[var(--gold)] hover:bg-white/5">{t("allGuides")}</Link>
    </div>
  </section>;
}
