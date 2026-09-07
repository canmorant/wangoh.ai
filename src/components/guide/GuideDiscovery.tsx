import Link from "next/link";

const featured = [
  { href: "/amerika-birlesik-devletleri/new-york", name: "New York", detail: "Gezilecek yerler, semt seçimi, metro ve gün gün rota." },
  { href: "/ispanya/madrid", name: "Madrid", detail: "Prado, tapas durakları, konaklama ve 4 günlük plan." },
  { href: "/japonya/tokyo", name: "Tokyo", detail: "Mahalleler, ulaşım, yeme içme ve gezi planı." },
  { href: "/italya/roma", name: "Roma", detail: "Tarihi duraklar, yemek ve yürüyüş rotaları." },
  { href: "/fransa/paris", name: "Paris", detail: "Müzeler, semtler ve ilk ziyaret için öneriler." },
  { href: "/ispanya/barcelona", name: "Barcelona", detail: "Gaudí, mahalleler, sahil ve 5 günlük rota." },
];

export default function GuideDiscovery() {
  return <section id="gezi-rehberleri" aria-labelledby="guide-heading" className="relative bg-[#080b14] px-5 py-16 sm:px-10 sm:py-24">
    <div className="mx-auto max-w-[1160px]">
      <h2 id="guide-heading" className="font-display text-4xl text-white sm:text-5xl">Bir sonraki şehrin gezi rehberi</h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">Nereler gezilir, nerede kalınır, şehir içinde nasıl dolaşılır? Türkçe şehir rehberleriyle duraklarını seç, yemek adreslerini bul ve gün gün rotanı oluştur.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => <li key={item.href}>
          <Link prefetch={false} href={item.href} className="block h-full rounded-2xl border border-white/15 p-6 transition-colors hover:border-[var(--gold)]/60 focus-visible:outline-2 focus-visible:outline-[var(--gold)]">
            <h3 className="font-display text-2xl text-white">{item.name} Gezi Rehberi</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{item.detail}</p>
          </Link>
        </li>)}
      </ul>
      <Link prefetch={false} href="/gezi-rehberleri" className="mt-8 inline-block rounded-full border border-[var(--gold)]/40 px-6 py-3 text-sm text-[var(--gold)] hover:bg-white/5">Tüm ülke ve şehir rehberleri →</Link>
    </div>
  </section>;
}
