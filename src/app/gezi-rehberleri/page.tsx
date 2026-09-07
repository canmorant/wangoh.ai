import type { Metadata } from "next";
import Link from "next/link";
import { allCountries, countryHref, cityHref, hasGuide } from "@/content/guides";
import SiteFooter from "@/components/SiteFooter";
import Breadcrumbs from "@/components/guide/Breadcrumbs";
import { absolute } from "@/lib/site";

const title = "Gezi Rehberleri: Ülke Ülke, Şehir Şehir Seyahat | Wangoh";
const description = "New York, Madrid, Tokyo, Roma ve daha fazlası: Türkçe şehir rehberlerinde gezilecek yerler, konaklama, ulaşım, yemek ve gün gün gezi planları.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: absolute("/gezi-rehberleri") },
  openGraph: { title, description, url: absolute("/gezi-rehberleri"), type: "website", locale: "tr_TR" },
};

export default function GuidesPage() {
  return <main className="min-h-screen bg-[#080b14] pt-16">
    <div className="mx-auto max-w-[1100px] px-5 pb-20 sm:px-8">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Gezi rehberleri" }]} />
      <h1 className="font-display text-4xl text-white sm:text-6xl">Ülke ve şehir gezi rehberleri</h1>
      <p className="mt-6 max-w-2xl leading-relaxed text-white/65">Gideceğin ülkeyi seç, şehir rehberinden gezilecek yerleri ve ulaşım seçeneklerini incele. Konaklama bölgeleri, yemek durakları ve günlük planlarla kendi rotanı kur.</p>
      <nav aria-label="Ülkelere git" className="my-10 flex flex-wrap gap-3">
        {allCountries.map(country => <a key={country.code} href={`#${country.code}`} className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-white/60">{country.name}</a>)}
      </nav>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {allCountries.map(country => <section key={country.code} id={country.code} className="scroll-mt-8">
          <h2 className="font-display text-2xl text-[var(--gold)]"><Link prefetch={false} href={countryHref(country)}>{country.name} Gezi Rehberi</Link></h2>
          <ul className="mt-4 space-y-2">
            {country.cities.filter(city => hasGuide(country.code, city.name)).map(city => <li key={city.name}>
              <Link prefetch={false} href={cityHref(country, city)} className="inline-block py-1 text-sm text-white/75 underline-offset-4 hover:underline">{city.name} Gezi Rehberi</Link>
            </li>)}
          </ul>
        </section>)}
      </div>
    </div>
    <SiteFooter />
  </main>;
}
