import type { Metadata } from "next";
import ImageCredits from "@/components/ImageCredits";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link, permanentRedirect } from "@/i18n/navigation";
import { resolveLocale } from "@/i18n/server";
import { contentSeo, localizedUrl, OG_LOCALE, ogAlternateLocales } from "@/i18n/seo";
import type { AppLocale } from "@/i18n/routing";
import {
  cityPageLocales,
  localizedCountry,
  localizedDietary,
  localizedGuide,
  placeName,
} from "@/content/localized";
import {
  allCityPaths,
  findCountryBySlug,
  findCityBySlug,
  guideFor,
  countryHref,
  citySlug,
  countrySlug,
} from "@/content/guides";
import { SITE, absolute } from "@/lib/site";
import { ogImage } from "@/lib/ogImage";
import GuideArticle from "@/components/guide/GuideArticle";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import JsonLd from "@/components/guide/JsonLd";
import { googleMapsSearchUrl } from "@/content/dietary";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import AdSenseScript from "@/components/AdSenseScript";
import { canonicalCountrySlug } from "@/lib/countryAliases";
import { countryName } from "@/lib/countryNames";
import ContentNotice from "@/components/guide/ContentNotice";

type Params = { locale: string; ulke: string; sehir: string };

/** Her şehir kartı için bir statik rota — kayıtlı destinasyonların tamamı. */
export function generateStaticParams(): Omit<Params, "locale">[] {
  return allCityPaths();
}

/**
 * Sayfanın verisi, istenen dilde. Rehber, beslenme önerileri ve destinasyon
 * metinleri o dile TAM çevrildiyse sayfa o dilde kendi başına yayında
 * (canonical + hreflang); değilse eksik metinler Türkçe kalır, içerik notu
 * gösterilir ve canonical Türkçe sürüme bakar.
 */
function loadCityPage(locale: AppLocale, ulke: string, sehir: string) {
  const country = findCountryBySlug(ulke);
  const city = country ? findCityBySlug(country, sehir) : null;
  if (!country || !city) return null;

  const guide = localizedGuide(country.code, city.name, locale)?.value ?? null;
  const dietary = localizedDietary(country.code, city.name, locale)?.value ?? null;
  if (guide && !dietary) {
    throw new Error(`Beslenme tercihleri verisi eksik: ${country.code}:${city.name}`);
  }
  const localCountry = localizedCountry(country, locale).value;
  const localCity = localCountry.cities.find((c) => c.name === city.name) ?? city;
  const available = cityPageLocales(country, city.name);

  return {
    country,
    city,
    localCountry,
    localCity,
    guide,
    dietary,
    available,
    complete: available.includes(locale),
    path: `/${ulke}/${sehir}`,
    cityLabel: placeName(city.name, locale),
    countryLabel: countryName(country.code, locale, country.name),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { ulke, sehir } = await params;
  const page = loadCityPage(locale, ulke, sehir);
  if (!page) return {};
  const { city, guide, complete, path, cityLabel, countryLabel, localCity, available } = page;
  const t = await getTranslations({ locale, namespace: "City" });

  // Rehber yazılmışsa kendi başlığını kullanır; yazılmamışsa şehre özgü ama
  // dürüst bir başlık üretilir. İki şehir asla aynı meta veriyi paylaşmaz.
  // Rehberin SEO metni yalnız tam çevrildiği dilde kullanılıyor.
  const ownSeo = complete ? guide : null;
  const title = ownSeo?.seoTitle ?? t("metaTitle", { city: cityLabel, country: countryLabel });
  const description =
    ownSeo?.seoDescription ??
    t("metaDescription", { city: cityLabel, summary: guide?.seoDescription ?? localCity.description });
  const seo = contentSeo(path, locale, available);
  const url = complete ? localizedUrl(path, locale) : absolute(path);
  const share = ogImage(city.image, t("heroAlt", { city: cityLabel, country: countryLabel }));

  return {
    title,
    description,
    alternates: seo.alternates,
    openGraph: {
      type: "article",
      locale: complete ? OG_LOCALE[locale] : SITE.locale,
      alternateLocale: complete ? ogAlternateLocales(locale, available) : undefined,
      siteName: SITE.name,
      title,
      description,
      url,
      images: share ? [share] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: share ? [share.url] : undefined,
    },
    robots: guide
      ? (seo.robots ?? { index: true, follow: true })
      : { index: false, follow: true, noarchive: true },
  };
}

export default async function CityGuidePage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params);
  const { ulke, sehir } = await params;
  if (!findCountryBySlug(ulke)) {
    // /portugal/lizbon → /portekiz/lizbon; şehir kısmı korunur.
    const canonical = canonicalCountrySlug(ulke);
    if (canonical) permanentRedirect({ href: `/${canonical}/${sehir}`, locale });
    notFound();
  }
  const page = loadCityPage(locale, ulke, sehir);
  if (!page) notFound();
  const { country, city, localCountry, localCity, guide, dietary, complete, path, cityLabel, countryLabel } = page;

  const t = await getTranslations("City");
  const tContent = await getTranslations("Content");
  const tGuides = await getTranslations("Guides");
  const pageUrl = complete ? localizedUrl(path, locale) : absolute(path);

  // Ana sayfa › Rehberler › Ülke › Şehir: her şehir hem ülke hub'ına hem
  // rehber dizinine bağlanıyor; arama motoru hiyerarşiyi buradan da okuyor.
  const breadcrumbs = [
    { name: tContent("home"), href: "/" },
    { name: tGuides("breadcrumb"), href: "/gezi-rehberleri" },
    { name: countryLabel, href: countryHref(country) },
    { name: cityLabel },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: localizedUrl(c.href, locale) } : {}),
    })),
  };

  return (
    <main className="relative min-h-screen bg-[#080b14] pt-24 sm:pt-28">
      <SiteHeader locale={locale} />
      <AdSenseScript />
      <JsonLd data={breadcrumbSchema} />

      {guide && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.h1,
              description: guide.seoDescription,
              inLanguage: complete ? (locale === "tr" ? "tr-TR" : locale) : "tr-TR",
              image: city.image
                ? [ogImage(city.image, cityLabel)!.url, new URL(city.image, SITE.url).href]
                : undefined,
              dateModified: guide.reviewed,
              mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
              publisher: { "@type": "Organization", name: SITE.name, url: localizedUrl("/", locale) },
              author: { "@type": "Organization", name: SITE.name, url: localizedUrl("/hakkimizda", locale) },
              about: { "@type": "Place", name: `${cityLabel}, ${countryLabel}` },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "TouristDestination",
              name: `${cityLabel}, ${countryLabel}`,
              description: guide.seoDescription,
              url: pageUrl,
              image: city.image ? new URL(city.image, SITE.url).href : undefined,
              containedInPlace: { "@type": "Country", name: countryLabel },
            }}
          />
          {/* FAQPage sadece sayfada gerçekten görünen SSS için. */}
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: guide.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }}
          />
        </>
      )}

      {dietary && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: t("dietaryListName", { city: cityLabel }),
            itemListElement: [...dietary.vegan, ...dietary.halal].map((pick, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Restaurant",
                name: pick.name,
                servesCuisine: pick.cuisine,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: cityLabel,
                  addressCountry: country.code,
                },
                suitableForDiet:
                  pick.category === "vegan"
                    ? "https://schema.org/VeganDiet"
                    : "https://schema.org/HalalDiet",
                // Harita araması mekânın kimliği değil (sameAs değil), haritası.
                hasMap: googleMapsSearchUrl(pick.name, cityLabel, countryLabel),
              },
            })),
          }}
        />
      )}

      {/* ---------------- hero ---------------- */}
      <header className="relative">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-8">
          <Breadcrumbs items={breadcrumbs} />
          {!complete && <ContentNotice />}
        </div>

        <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] sm:aspect-[21/9] sm:rounded-[26px]">
            {city.image ? (
              <Image
                src={city.image}
                alt={t("heroAlt", { city: cityLabel, country: countryLabel })}
                fill
                priority
                unoptimized={city.image.includes("upload.wikimedia.org")}
                sizes="(max-width:1100px) 100vw, 1100px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-white/[0.04]" />
            )}
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-[#080b14]/25 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="flex items-center gap-3 text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">
                <span className="inline-block h-px w-8 bg-[var(--gold)]/35" />
                {country.flag} {countryLabel}
              </p>
              <h1 className="font-display mt-3 text-[clamp(2rem,10vw,4.2rem)] leading-[1.02] text-white sm:mt-4">
                {guide?.h1 ?? t("heading", { city: cityLabel })}
              </h1>
            </div>
          </div>

          <p className="mt-7 max-w-[62ch] text-[16px] leading-relaxed text-white/60 sm:mt-8 sm:text-[17px]">
            {guide?.lede ?? localCity.description}
          </p>
        </div>
      </header>

      <div className="mt-14">
        {guide ? (
          <GuideArticle guide={guide} country={localCountry} city={localCity} dietary={dietary!} />
        ) : (
          <PendingGuide country={localCountry} countryLabel={countryLabel} city={localCity} cityLabel={cityLabel} />
        )}

        {/* Wikimedia görselleri CC BY / CC BY-SA — atıf zorunlu. */}
        <div className="mx-auto max-w-[1100px] px-4 sm:px-8">
          <ImageCredits images={[city.image].filter(Boolean)} />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}

/**
 * Rehberi henüz yazılmamış şehirler.
 *
 * Bilerek uydurma içerik üretilmiyor: elimizde gerçekten olan bilgi gösteriliyor,
 * gerisi için dürüst bir durum belirtiliyor ve okuyucu yazılmış rehberlere
 * yönlendiriliyor. Bu sayfalar `robots: noindex` ile işaretli, çünkü ince
 * içeriğin dizine girmesi sitenin tamamına zarar verir.
 */
function PendingGuide({
  country,
  countryLabel,
  city,
  cityLabel,
}: {
  country: ReturnType<typeof findCountryBySlug> & object;
  countryLabel: string;
  city: { name: string; description: string };
  cityLabel: string;
}) {
  const t = useTranslations("City");
  const locale = useLocale();
  const written = country.cities.filter((c) => guideFor(country.code, c.name));

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 sm:px-8 sm:pb-32">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 sm:p-10">
        <h2 className="font-display text-[1.6rem] leading-tight text-white">
          {t("pendingTitle", { city: cityLabel })}
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-white/55">
          {t("pendingBody", { city: cityLabel })}
        </p>

        <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">
            {t("knownSoFar")}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">{city.description}</p>
        </div>
      </div>

      {written.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-[1.5rem] text-white">
            {t("publishedGuides", { country: countryLabel })}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {written.map((c) => (
              <Link
                key={c.name}
                href={`/${countrySlug(country)}/${citySlug(c)}`}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:border-white/[0.18]"
              >
                <h3 className="font-display text-[1.2rem] text-white">{placeName(c.name, locale)}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">{c.description}</p>
                <span className="mt-4 inline-block text-[10.5px] tracking-[0.2em] text-[var(--gold)] uppercase">
                  {t("readGuide")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Link
        href={countryHref(country)}
        className="mt-12 inline-block rounded-full border border-white/12 px-6 py-3 text-[11px] tracking-[0.18em] text-white/60 uppercase transition-colors duration-400 hover:border-white/30 hover:text-white"
      >
        {t("backToCountry", { country: countryLabel })}
      </Link>
    </div>
  );
}
