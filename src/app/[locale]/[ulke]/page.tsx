import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link, permanentRedirect } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/server";
import { localizedUrl, turkishOnlySeo } from "@/i18n/seo";
import {
  findCountryBySlug,
  countrySlug,
  citySlug,
  guideFor,
  allCountries,
} from "@/content/guides";
import { SITE, absolute } from "@/lib/site";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import ImageCredits from "@/components/ImageCredits";
import JsonLd from "@/components/guide/JsonLd";
import { countryHubFor } from "@/content/countryHubs";
import { canonicalCountrySlug } from "@/lib/countryAliases";
import SiteFooter from "@/components/SiteFooter";
import AdSenseScript from "@/components/AdSenseScript";
import ContentNotice from "@/components/guide/ContentNotice";
import { countryName } from "@/lib/countryNames";
import { localizeBestSeason, localizeBudget, localizeFlightTime } from "@/lib/travelData";

type Params = { locale: string; ulke: string };

export function generateStaticParams(): Omit<Params, "locale">[] {
  return allCountries.map((c) => ({ ulke: countrySlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { ulke } = await params;
  const country = findCountryBySlug(ulke);
  if (!country) return {};
  const t = await getTranslations({ locale, namespace: "Country" });
  const countryLabel = countryName(country.code, locale, country.name);
  // Hub'ın kendi SEO metni Türkçe; diğer dillerde arayüz dilindeki şablon.
  const hub = locale === "tr" ? countryHubFor(country.code) : null;

  const title = hub?.seoTitle ?? t("metaTitle", { country: countryLabel });
  const description =
    hub?.seoDescription ??
    t("metaDescription", {
      country: countryLabel,
      cities: country.cities
        .slice(0, 4)
        .map((c) => c.name)
        .join(", "),
    });
  // İçerik yalnızca Türkçe: canonical Türkçe sürüm, diğer diller noindex.
  const seo = turkishOnlySeo(`/${ulke}`, locale);

  return {
    title,
    description,
    alternates: seo.alternates,
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url: absolute(`/${ulke}`),
      images: country.image ? [{ url: country.image, alt: countryLabel }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: country.image ? [country.image] : undefined,
    },
    robots: seo.robots ?? { index: true, follow: true },
  };
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params);
  const { ulke } = await params;
  const country = findCountryBySlug(ulke);
  if (!country) {
    // /portugal, /japan, /türkiye → asıl Türkçe adrese kalıcı (308) yönlendirme.
    // Yalnızca harf farkı olan /Portekiz bilerek yönlendirilmiyor; nedeni
    // canonicalCountrySlug içinde.
    const canonical = canonicalCountrySlug(ulke);
    if (canonical) permanentRedirect({ href: `/${canonical}`, locale });
    notFound();
  }
  const hub = countryHubFor(country.code);
  const writtenCount = country.cities.filter((city) => guideFor(country.code, city.name)).length;

  const t = await getTranslations("Country");
  const tContent = await getTranslations("Content");
  const tGuide = await getTranslations("Guide");
  const tData = await getTranslations("TravelData");
  const format = await getFormatter();
  const countryLabel = countryName(country.code, locale, country.name);

  const crumbs = [{ name: tContent("home"), href: "/" }, { name: countryLabel }];

  return (
    <main className="relative min-h-screen bg-[#080b14] pt-24 sm:pt-28">
      <AdSenseScript />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: localizedUrl(c.href, locale) } : {}),
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristDestination",
          name: country.name,
          description: hub?.seoDescription ?? country.description,
          url: absolute(`/${ulke}`),
          image: country.image,
          touristType: t("touristType"),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: t("destinations", { country: countryLabel }),
          numberOfItems: country.cities.length,
          itemListElement: country.cities.map((city, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: city.name,
            url: absolute(`/${countrySlug(country)}/${citySlug(city)}`),
          })),
        }}
      />

      <div className="mx-auto max-w-[1100px] px-4 sm:px-8">
        <Breadcrumbs items={crumbs} />
        <ContentNotice />

        <p className="flex items-center gap-3 text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">
          <span className="inline-block h-px w-8 bg-[var(--gold)]/35" />
          {country.flag} {t("eyebrow")}
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.1rem,10vw,4rem)] leading-[1.02] text-white">
          {t("heading", { country: countryLabel })}
        </h1>
        <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-white/60 sm:text-[17px]">
          {country.description}
        </p>

        {/* hızlı bilgiler — hepsi mevcut, doğrulanmış veriden */}
        <section
          aria-label={tGuide("quickFacts")}
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5"
        >
          <Fact label={t("fact.gateway")} value={`${country.gateway} · ${country.iata}`} />
          <Fact label={t("fact.capital")} value={country.capital} />
          <Fact
            label={t("fact.flightTime")}
            value={
              country.code === "TR"
                ? t("fact.domestic")
                : t("fact.fromIstanbul", { time: localizeFlightTime(country.flightTime, locale, tData) })
            }
          />
          <Fact
            label={t("fact.bestSeason")}
            value={localizeBestSeason(country.bestSeason, locale, tData, format)}
          />
          <Fact label={t("fact.budget")} value={localizeBudget(country.budget, locale, tData)} />
        </section>

        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">{t("dontMiss")}</p>
          <p className="mt-2 text-[15.5px] leading-relaxed text-white/75">{country.signature}</p>
        </div>

        {hub && (
          <section className="mt-16" aria-labelledby="rota-planlama">
            <h2
              id="rota-planlama"
              className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] text-white"
            >
              {hub.planningHeading}
            </h2>
            <div className="mt-5 max-w-[72ch] space-y-4">
              {hub.intro.map((paragraph) => (
                <p key={paragraph} className="text-[15.5px] leading-[1.75] text-white/60">
                  {paragraph}
                </p>
              ))}
            </div>

            {hub.essentials && hub.essentials.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-[clamp(1.55rem,3vw,2.1rem)] text-white">
                  {hub.essentialsHeading ?? t("essentials")}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {hub.essentials.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-[var(--gold)]/15 bg-[var(--gold)]/[0.035] p-6">
                      <h3 className="text-[1rem] font-semibold text-white/90">{item.title}</h3>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {hub.routeIdeas.map((route) => (
                <div
                  key={route.title}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
                >
                  <p className="text-[9.5px] tracking-[0.22em] text-[var(--gold)]/75 uppercase">
                    {route.duration}
                  </p>
                  <h3 className="font-display mt-2 text-[1.25rem] text-white">{route.title}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-white/50">
                    {route.description}
                  </p>
                  <p className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
                    {route.cities.map((cityName) => {
                      const routeCity = country.cities.find((city) => city.name === cityName);
                      if (!routeCity) return null;
                      return (
                        <Link
                          key={cityName}
                          href={`/${countrySlug(country)}/${citySlug(routeCity)}`}
                          className="text-[11px] tracking-[0.12em] text-white/65 uppercase transition-colors hover:text-[var(--gold)]"
                        >
                          {cityName} →
                        </Link>
                      );
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* şehirler — her kart kendi rehberine bağlanır */}
        <section className="mt-16 pb-32">
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] text-white">
            {hub?.citiesHeading ?? t("citiesHeading", { country: countryLabel })}
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-white/50">
            {hub?.cityGridIntro ?? country.description}
          </p>
          <p className="mt-4 text-[11px] tracking-[0.12em] text-[var(--gold)]/65 uppercase">
            {writtenCount === country.cities.length
              ? t("allPublished", { total: country.cities.length })
              : t("somePublished", { written: writtenCount, total: country.cities.length })}
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {country.cities.map((city) => {
              const ready = !!guideFor(country.code, city.name);
              return (
                <Link
                  key={city.name}
                  href={`/${countrySlug(country)}/${citySlug(city)}`}
                  className="group overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.02] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-white/[0.18]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={city.image}
                      alt={`${city.name}, ${countryLabel}`}
                      fill
                      unoptimized={city.image.includes("upload.wikimedia.org")}
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-transparent"
                    />
                    <span
                      className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-[9px] tracking-[0.16em] uppercase backdrop-blur-md ${
                        ready
                          ? "bg-[var(--gold)]/20 text-[var(--gold)]"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {ready ? t("badgeReady") : t("badgePending")}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[1.3rem] leading-none text-white">
                      {city.name}
                    </h3>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/50">
                      {city.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Wikimedia görsellerinin çoğu CC BY / CC BY-SA — atıf zorunlu. */}
        <ImageCredits
          images={[country.image, ...country.cities.map((c) => c.image)].filter(Boolean)}
        />
      </div>
      <SiteFooter />
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-[#0a0e18] px-4 py-5 sm:px-5">
      <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">{label}</p>
      <p className="mt-1.5 break-words text-[13px] leading-snug text-white/90 sm:text-[13.5px]">{value}</p>
    </div>
  );
}
