import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import GuideArticle from "@/components/guide/GuideArticle";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import JsonLd from "@/components/guide/JsonLd";
import { dietaryGuideFor, googleMapsSearchUrl } from "@/content/dietary";
import SiteFooter from "@/components/SiteFooter";
import AdSenseScript from "@/components/AdSenseScript";

type Params = { ulke: string; sehir: string };

/** Her şehir kartı için bir statik rota — kayıtlı destinasyonların tamamı. */
export function generateStaticParams(): Params[] {
  return allCityPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { ulke, sehir } = await params;
  const country = findCountryBySlug(ulke);
  const city = country ? findCityBySlug(country, sehir) : null;
  if (!country || !city) return {};

  const guide = guideFor(country.code, city.name);
  const dietary = dietaryGuideFor(country.code, city.name);
  const path = `/${ulke}/${sehir}`;

  if (guide && !dietary) {
    throw new Error(`Beslenme tercihleri verisi eksik: ${country.code}:${city.name}`);
  }

  // Rehber yazılmışsa kendi başlığını kullanır; yazılmamışsa şehre özgü ama
  // dürüst bir başlık üretilir. İki şehir asla aynı meta veriyi paylaşmaz.
  const title = guide?.seoTitle ?? `${city.name} Gezi Rehberi — ${country.name} | ${SITE.name}`;
  const description = guide?.seoDescription ?? `${city.name} için ${SITE.name} rehberi: ${city.description}`;

  return {
    title,
    description,
    alternates: { canonical: absolute(path) },
    openGraph: {
      type: "article",
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url: absolute(path),
      images: city.image ? [{ url: city.image, alt: `${city.name}, ${country.name}` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: city.image ? [city.image] : undefined,
    },
    robots: guide
      ? { index: true, follow: true }
      : { index: false, follow: true, noarchive: true },
  };
}

export default async function CityGuidePage({ params }: { params: Promise<Params> }) {
  const { ulke, sehir } = await params;
  const country = findCountryBySlug(ulke);
  const city = country ? findCityBySlug(country, sehir) : null;
  if (!country || !city) notFound();

  const guide = guideFor(country.code, city.name);
  const dietary = dietaryGuideFor(country.code, city.name);
  const path = `/${ulke}/${sehir}`;

  if (guide && !dietary) {
    throw new Error(`Beslenme tercihleri verisi eksik: ${country.code}:${city.name}`);
  }

  const breadcrumbs = [
    { name: "Ana sayfa", href: "/" },
    { name: country.name, href: countryHref(country) },
    { name: city.name },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: absolute(c.href) } : {}),
    })),
  };

  return (
    <main className="relative min-h-screen bg-[#080b14] pt-24 sm:pt-28">
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
              inLanguage: "tr-TR",
              image: city.image || undefined,
              dateModified: guide.reviewed,
              mainEntityOfPage: { "@type": "WebPage", "@id": absolute(path) },
              publisher: { "@type": "Organization", name: SITE.name },
              author: { "@type": "Organization", name: SITE.name },
              about: { "@type": "Place", name: `${city.name}, ${country.name}` },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "TouristDestination",
              name: `${city.name}, ${country.name}`,
              description: guide.seoDescription,
              url: absolute(path),
              image: city.image || undefined,
              containedInPlace: { "@type": "Country", name: country.name },
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
            name: `${city.name} vegan ve helal restoran önerileri`,
            itemListElement: [...dietary.vegan, ...dietary.halal].map((pick, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Restaurant",
                name: pick.name,
                servesCuisine: pick.cuisine,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: city.name,
                  addressCountry: country.code,
                },
                suitableForDiet:
                  pick.category === "vegan"
                    ? "https://schema.org/VeganDiet"
                    : "https://schema.org/HalalDiet",
                sameAs: googleMapsSearchUrl(pick.name, city.name, country.name),
              },
            })),
          }}
        />
      )}

      {/* ---------------- hero ---------------- */}
      <header className="relative">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="relative mx-auto max-w-[1100px] px-4 sm:px-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] sm:aspect-[21/9] sm:rounded-[26px]">
            {city.image ? (
              <Image
                src={city.image}
                alt={`${city.name} şehrinden bir görünüm, ${country.name}`}
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
                {country.flag} {country.name}
              </p>
              <h1 className="font-display mt-3 text-[clamp(2rem,10vw,4.2rem)] leading-[1.02] text-white sm:mt-4">
                {guide?.h1 ?? `${city.name} Gezi Rehberi`}
              </h1>
            </div>
          </div>

          <p className="mt-7 max-w-[62ch] text-[16px] leading-relaxed text-white/60 sm:mt-8 sm:text-[17px]">
            {guide?.lede ?? city.description}
          </p>
        </div>
      </header>

      <div className="mt-14">
        {guide ? (
          <GuideArticle guide={guide} country={country} city={city} dietary={dietary!} />
        ) : (
          <PendingGuide country={country} city={city} />
        )}
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
  city,
}: {
  country: ReturnType<typeof findCountryBySlug> & object;
  city: { name: string; description: string };
}) {
  const written = country.cities.filter((c) => guideFor(country.code, c.name));

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-24 sm:px-8 sm:pb-32">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 sm:p-10">
        <h2 className="font-display text-[1.6rem] leading-tight text-white">
          {city.name} rehberi hazırlanıyor
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-white/55">
          Bu şehir için kapsamlı rehberimizi henüz yayınlamadık. Doğrulanmamış
          bilgiyle sayfa doldurmak yerine beklemeyi tercih ediyoruz — {city.name}{" "}
          rehberi de diğerleri gibi gezilecek yerler, semt semt konaklama, gerçek
          yemek adresleri, ulaşım ve gün gün gezi planı içerecek.
        </p>

        <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">
            Şimdilik bildiğimiz
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">{city.description}</p>
        </div>
      </div>

      {written.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-[1.5rem] text-white">
            {country.name} için yayında olan rehberler
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {written.map((c) => (
              <Link
                key={c.name}
                href={`/${countrySlug(country)}/${citySlug(c)}`}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:border-white/[0.18]"
              >
                <h3 className="font-display text-[1.2rem] text-white">{c.name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">{c.description}</p>
                <span className="mt-4 inline-block text-[10.5px] tracking-[0.2em] text-[var(--gold)] uppercase">
                  Rehberi oku →
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
        ← {country.name} rehberine dön
      </Link>
    </div>
  );
}
