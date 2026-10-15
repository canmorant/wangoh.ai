import type { Metadata } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import "@fontsource/instrument-serif/400.css";
import "./globals.css";
import messages from "../../messages/tr.json";

/**
 * Hiçbir route'a uymayan istekler (geçersiz dil öneki gibi) için 404.
 *
 * Kök layout app/[locale]/layout.tsx; Next 16 bu yapıda global-not-found'u
 * öneriyor — layout render etmeden doğrudan bu sayfayı döndürüyor, o yüzden
 * stiller ve fontlar burada ayrıca import ediliyor. Dil bilgisi olmadığından
 * varsayılan dilin (Türkçe) metinleri mesaj dosyasından okunuyor.
 *
 * Dil öneki altındaki 404'ler (notFound() çağrıları) bunu değil,
 * app/[locale]/not-found.tsx'i kullanır.
 */
const t = messages.NotFound;

export const metadata: Metadata = {
  title: `${t.eyebrow} · Wangoh`,
  description: t.description,
};

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={`${GeistSans.variable} antialiased`}>
      <body>
        <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-6">
          <div className="max-w-[46ch] text-center">
            <p className="text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">{t.eyebrow}</p>
            <h1 className="font-display mt-5 text-[clamp(2rem,7vw,3rem)] leading-[1.05] text-white">
              {t.title}
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-white/55">{t.description}</p>
            {/* next-intl Link değil: bu sayfada dil bağlamı yok, hedef Türkçe ana sayfa. */}
            <Link
              href="/"
              className="mt-9 inline-block rounded-full border border-white/15 px-7 py-3 text-[11px] tracking-[0.2em] text-white/70 uppercase transition-colors duration-300 hover:border-white/35 hover:text-white"
            >
              {t.home}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
