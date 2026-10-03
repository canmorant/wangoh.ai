import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
      <Link prefetch={false} href="/gezi-rehberleri" className="mt-8 inline-block rounded-full border border-[var(--gold)]/40 px-6 py-3 text-sm text-[var(--gold)] hover:bg-white/5">{t("allGuides")}</Link>
    </div>
  </section>;
}
