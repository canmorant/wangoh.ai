import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findCountryBySlug,
  countrySlug,
  citySlug,
  guideFor,
  allCountries,
} from "@/content/guides";
import { SITE, absolute } from "@/lib/site";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import JsonLd from "@/components/guide/JsonLd";
import { countryHubFor } from "@/content/countryHubs";

type Params = { ulke: string };

export function generateStaticParams(): Params[] {
  return allCountries.map((c) => ({ ulke: countrySlug(c) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { ulke } = await params;
  const country = findCountryBySlug(ulke);
  if (!country) return {};
  const hub = countryHubFor(country.code);

  const title = hub?.seoTitle ?? `${country.name} Gezi Rehberi: Gezilecek Şehirler ve Rotalar`;
  const description =
    hub?.seoDescription ??
    `${country.name} seyahat rehberi — ${country.cities
      .slice(0, 4)
      .map((c) => c.name)
      .join(", ")} ve daha fazlası. En iyi dönem, uçuş süresi, bütçe ve şehir şehir rehberler.`;

  return {
    title,
    description,
    alternates: { canonical: absolute(`/${ulke}`) },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url: absolute(`/${ulke}`),
      images: country.image ? [{ url: country.image, alt: country.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: country.image ? [country.image] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { ulke } = await params;
  const country = findCountryBySlug(ulke);
  if (!country) notFound();
  const hub = countryHubFor(country.code);
  const writtenCount = country.cities.filter((city) => guideFor(country.code, city.name)).length;

  const crumbs = [{ name: "Ana sayfa", href: "/" }, { name: country.name }];

  return (
    <main className="relative min-h-screen bg-[#080b14] pt-24 sm:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: absolute(c.href) } : {}),
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
          touristType: "Kültür, gastronomi, şehir ve doğa gezginleri",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${country.name} destinasyonları`,
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

        <p className="flex items-center gap-3 text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">
          <span className="inline-block h-px w-8 bg-[var(--gold)]/35" />
          {country.flag} Ülke rehberi
        </p>
        <h1 className="font-display mt-4 text-[clamp(2.1rem,10vw,4rem)] leading-[1.02] text-white">
          {country.name} Gezi Rehberi
        </h1>
        <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-white/60 sm:text-[17px]">
          {country.description}
        </p>

        {/* hızlı bilgiler — hepsi mevcut, doğrulanmış veriden */}
        <section
          aria-label="Hızlı bilgiler"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-5"
        >
          <Fact label="Giriş noktası" value={`${country.gateway} · ${country.iata}`} />
          <Fact label="Başkent" value={country.capital} />
          <Fact
            label="Uçuş süresi"
            value={country.code === "TR" ? "Ülke içi rotaya göre" : `İstanbul'dan ${country.flightTime}`}
          />
          <Fact label="En iyi dönem" value={country.bestSeason} />
          <Fact label="Bütçe" value={country.budget} />
        </section>

        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
          <p className="text-[9.5px] tracking-[0.24em] text-white/35 uppercase">Kaçırmayın</p>
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
                  {hub.essentialsHeading ?? "Gitmeden önce bilinmesi gerekenler"}
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
            {hub?.citiesHeading ?? `${country.name}’da gezilecek şehirler`}
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-white/50">
            {hub?.cityGridIntro ?? country.description}
          </p>
          <p className="mt-4 text-[11px] tracking-[0.12em] text-[var(--gold)]/65 uppercase">
            {writtenCount === country.cities.length
              ? `${country.cities.length} şehrin tamamı için özgün rehber yayında`
              : `${writtenCount}/${country.cities.length} şehir rehberi yayında`}
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
                      alt={`${city.name}, ${country.name}`}
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
                      {ready ? "Rehber yayında" : "Hazırlanıyor"}
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
      </div>
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
