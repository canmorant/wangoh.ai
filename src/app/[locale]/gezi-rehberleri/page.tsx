import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { countryHref, cityHref, hasGuide } from "@/content/guides";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import JsonLd from "@/components/guide/JsonLd";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/server";
import { contentSeo, localizedUrl, OG_LOCALE, ogAlternateLocales } from "@/i18n/seo";
import { guideIndexLocales, placeName } from "@/content/localized";
import { countriesByRegion } from "@/content/regions";
import { countryName } from "@/lib/countryNames";
import { ogImage } from "@/lib/ogImage";
import { SITE } from "@/lib/site";
import { countries } from "@/data/destinations";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "Guides" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const available = guideIndexLocales();
  const share = ogImage(countries[0]?.image, t("title"));
  return {
    title, description, ...contentSeo("/gezi-rehberleri", locale, available),
    openGraph: {
      title, description, url: localizedUrl("/gezi-rehberleri", locale), type: "website",
      locale: OG_LOCALE[locale], alternateLocale: ogAlternateLocales(locale, available), siteName: SITE.name,
      images: share ? [share] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: share ? [share.url] : undefined },
  };
}

export default async function GuidesPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("Guides");
  const tContent = await getTranslations("Content");
  const tCountry = await getTranslations("Country");
  const tCity = await getTranslations("City");
  const tRegions = await getTranslations("Regions");
  // Bölge → ülke → şehir; rehberi olmayan ülke dizinde yer almaz.
  const regions = countriesByRegion()
    .map(({ region, countries }) => ({
      region,
      countries: countries.filter((c) => c.cities.some((city) => hasGuide(c.code, city.name))),
    }))
    .filter((r) => r.countries.length > 0);
  const label = (code: string, name: string) => countryName(code, locale, name);
  const crumbs = [{ name: tContent("home"), href: "/" }, { name: t("breadcrumb") }];

  return <main className="min-h-screen bg-[#080b14] pt-24 sm:pt-28">
    <SiteHeader locale={locale} />
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem", position: i + 1, name: c.name,
        ...(c.href ? { item: localizedUrl(c.href, locale) } : {}),
      })),
    }} />
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t("title"),
      description: t("metaDescription"),
      url: localizedUrl("/gezi-rehberleri", locale),
      inLanguage: locale,
      isPartOf: { "@type": "WebSite", name: SITE.name, url: localizedUrl("/", locale) },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: regions.flatMap((r) => r.countries).map((c, i) => ({
          "@type": "ListItem", position: i + 1,
          name: tCountry("heading", { country: label(c.code, c.name) }),
          url: localizedUrl(countryHref(c), locale),
        })),
      },
    }} />
    <div className="mx-auto max-w-[1100px] px-5 pb-20 sm:px-8">
      <Breadcrumbs items={crumbs} />
      <h1 className="font-display text-4xl text-white sm:text-6xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-white/65">{t("intro")}</p>
      <nav aria-label={t("countriesNav")} className="my-10 flex flex-wrap gap-3">
        {regions.flatMap((r) => r.countries).map(country => <a key={country.code} href={`#${country.code}`} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/60">{label(country.code, country.name)}</a>)}
      </nav>
      {regions.map(({ region, countries }) => <section key={region} aria-labelledby={`bolge-${region}`} className="mt-14 scroll-mt-28 first-of-type:mt-0">
        <h2 id={`bolge-${region}`} className="font-display border-b border-white/[0.08] pb-4 text-3xl text-white">{tRegions(`${region}.guides`)}</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map(country => <section key={country.code} id={country.code} className="scroll-mt-28">
            <h3 className="font-display text-2xl text-[var(--gold)]"><Link prefetch={false} href={countryHref(country)}>{tCountry("heading", { country: label(country.code, country.name) })}</Link></h3>
            <ul className="mt-4 space-y-2">
              {country.cities.filter(city => hasGuide(country.code, city.name)).map(city => <li key={city.name}>
                <Link prefetch={false} href={cityHref(country, city)} className="inline-block py-1 text-sm text-white/75 underline-offset-4 hover:underline">{tCity("heading", { city: placeName(city.name, locale) })}</Link>
              </li>)}
            </ul>
          </section>)}
        </div>
      </section>)}
    </div>
    <SiteFooter />
  </main>;
}
