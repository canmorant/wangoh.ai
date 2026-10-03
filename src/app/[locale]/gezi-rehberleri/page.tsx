import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { allCountries, countryHref, cityHref, hasGuide } from "@/content/guides";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/server";
import { localizedUrl, OG_LOCALE, turkishOnlySeo } from "@/i18n/seo";
import { countryName } from "@/lib/countryNames";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Guides" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    title, description, ...turkishOnlySeo("/gezi-rehberleri", locale),
    openGraph: { title, description, url: localizedUrl("/gezi-rehberleri", locale), type: "website", locale: OG_LOCALE[locale] },
  };
}

export default async function GuidesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("Guides");
  const tContent = await getTranslations("Content");
  const tCountry = await getTranslations("Country");
  const tCity = await getTranslations("City");
  return <main className="min-h-screen bg-[#080b14] pt-16">
    <div className="mx-auto max-w-[1100px] px-5 pb-20 sm:px-8">
      <Breadcrumbs items={[{ name: tContent("home"), href: "/" }, { name: t("breadcrumb") }]} />
      <h1 className="font-display text-4xl text-white sm:text-6xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-white/65">{t("intro")}</p>
      <nav aria-label={t("countriesNav")} className="my-10 flex flex-wrap gap-3">
        {allCountries.map(country => <a key={country.code} href={`#${country.code}`} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/60">{countryName(country.code, locale, country.name)}</a>)}
      </nav>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {allCountries.map(country => <section key={country.code} id={country.code} className="scroll-mt-8">
          <h2 className="font-display text-2xl text-[var(--gold)]"><Link prefetch={false} href={countryHref(country)}>{tCountry("heading", { country: countryName(country.code, locale, country.name) })}</Link></h2>
          <ul className="mt-4 space-y-2">
            {country.cities.filter(city => hasGuide(country.code, city.name)).map(city => <li key={city.name}>
              <Link prefetch={false} href={cityHref(country, city)} className="inline-block py-1 text-sm text-white/75 underline-offset-4 hover:underline">{tCity("heading", { city: city.name })}</Link>
            </li>)}
          </ul>
        </section>)}
      </div>
    </div>
    <SiteFooter />
  </main>;
}
