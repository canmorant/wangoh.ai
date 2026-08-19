import Link from "next/link";
import { SITE } from "@/lib/site";

const corporateLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

const policyLinks = [
  { href: "/gizlilik-politikasi", label: "Gizlilik" },
  { href: "/cerez-politikasi", label: "Çerezler" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
] as const;

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#070a12] px-5 py-12 sm:px-8 sm:py-14">
      <div className="mx-auto grid max-w-[1160px] gap-10 md:grid-cols-[1.35fr_1fr_1fr] md:gap-12">
        <div>
          <Link
            href="/"
            className="text-[13px] tracking-[0.34em] text-white/90 uppercase transition-opacity hover:opacity-70"
          >
            Wangoh
          </Link>
          <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-white/38">
            Şehirleri yalnızca işaretlemeyen; bir yolculuğun ritmini, mahallesini ve
            sofrasını anlatan bağımsız seyahat yayını.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-5 inline-block text-[13px] text-[var(--gold)]/80 transition-colors hover:text-[var(--gold)]"
          >
            {SITE.email}
          </a>
        </div>

        <nav aria-label="Kurumsal sayfalar">
          <p className="text-[9.5px] tracking-[0.24em] text-white/25 uppercase">Wangoh</p>
          <ul className="mt-4 space-y-3">
            {corporateLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Yasal ve gizlilik sayfaları">
          <p className="text-[9.5px] tracking-[0.24em] text-white/25 uppercase">
            Gizlilik ve koşullar
          </p>
          <ul className="mt-4 space-y-3">
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1160px] flex-col gap-2 border-t border-white/[0.06] pt-6 text-[11px] leading-relaxed text-white/22 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Wangoh. Tüm hakları saklıdır.</p>
        <p>
          Görseller ağırlıklı olarak{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white/50"
          >
            Unsplash
          </a>
          &rsquo;ten sağlanır.
        </p>
      </div>
    </footer>
  );
}

