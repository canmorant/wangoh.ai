import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

const links = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/gizlilik-politikasi", label: "Gizlilik" },
] as const;

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080b14]">
      <header className="border-b border-white/[0.07] bg-[#080b14]/95 px-4 backdrop-blur-xl sm:px-8">
        <nav
          aria-label="Kurumsal navigasyon"
          className="mx-auto flex min-h-18 max-w-[1160px] items-center justify-between gap-6"
        >
          <Link
            href="/"
            className="shrink-0 text-[13px] tracking-[0.34em] text-white/90 uppercase transition-opacity hover:opacity-70"
          >
            Wangoh
          </Link>
          <div className="flex items-center gap-4 sm:gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hidden text-[12px] text-white/48 transition-colors hover:text-white sm:inline"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full border border-white/12 px-4 py-2.5 text-[10px] tracking-[0.16em] text-white/62 uppercase transition-colors hover:border-white/30 hover:text-white"
            >
              Ana sayfa
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <SiteFooter />
    </div>
  );
}

