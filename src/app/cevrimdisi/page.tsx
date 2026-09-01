import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Çevrimdışısınız — Wangoh",
  description: "Bağlantı yokken gösterilen sayfa.",
  robots: { index: false, follow: false },
};

/**
 * Service worker'ın çevrimdışıyken, önbellekte de bulunmayan bir sayfa
 * istendiğinde gösterdiği yedek.
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b14] px-6">
      <div className="max-w-[46ch] text-center">
        <p className="text-[11px] tracking-[0.34em] text-[var(--gold)]/70 uppercase">
          Bağlantı yok
        </p>
        <h1 className="font-display mt-5 text-[clamp(2rem,7vw,3rem)] leading-[1.05] text-white">
          Şu an çevrimdışısın
        </h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-white/55">
          Daha önce açtığın rehberler bağlantı olmadan da okunabilir. Henüz
          açmadığın sayfalar için internete ihtiyacın var.
        </p>
        <Link
          href="/"
          className="mt-9 inline-block rounded-full border border-white/15 px-7 py-3 text-[11px] tracking-[0.2em] text-white/70 uppercase transition-colors duration-300 hover:border-white/35 hover:text-white"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </main>
  );
}
