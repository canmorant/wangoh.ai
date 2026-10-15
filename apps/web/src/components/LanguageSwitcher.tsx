"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Dillerin kendi dilindeki adları. Bilerek çevrilmiyor: dil seçicide her dil
 * kendi adıyla görünür ki o dili okuyan biri tanıyabilsin.
 */
const ENDONYMS: Record<AppLocale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  ru: "Русский",
  es: "Español",
  fr: "Français",
};

/**
 * Dil seçici. Yalnızca dili değiştirir; kullanıcı aynı sayfada kalır:
 *   /japonya/tokyo?tab=x#ne-yenir  →  /en/japonya/tokyo?tab=x#ne-yenir
 *
 * - Yol: next-intl'in usePathname'i önek olmadan döner ("/japonya/tokyo");
 *   getPathname hedef dilin adresini üretir (Türkçe öneksiz). Dinamik route
 *   parametreleri yolun içinde olduğu için bozulmaz.
 * - next-intl'in useRouter'ı dil değişiminde öneki zorla ekliyor (/tr/...);
 *   bu, dil çerezini güncellemek için. Bizde çerez ve algılama kapalı, o
 *   yüzden zorlama yalnızca fazladan bir 307 doğuruyor ve istemci
 *   yönlendirmesinde #çapa kayboluyordu. Adres doğrudan hesaplanıp Next'in
 *   kendi router'ıyla açılıyor.
 * - Sorgu ve #çapa: tıklama anında window.location'dan okunuyor.
 *   useSearchParams kullanılmadı, çünkü statik üretilen sayfalarda Suspense
 *   sınırı ister ve sayfanın o kısmını istemci tarafına iterdi.
 * - replace: dil değişimi geçmişe yeni bir kayıt eklemez.
 *
 * Görünüm: kapalıyken kısa kod (TR), açılınca diller kendi adlarıyla. Görünen
 * kod yalnızca süs; asıl kontrol üstüne yerleşmiş, görünmez yerel <select> —
 * klavye, ekran okuyucu ve mobil seçici hepsi tarayıcının kendisinden.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const change = (next: AppLocale) => {
    if (next === locale) return;
    const { search, hash } = window.location;
    startTransition(() => {
      router.replace(`${getPathname({ href: pathname, locale: next })}${search}${hash}`);
    });
  };

  // Yalnız Türkçe yayındayken seçilecek başka dil yok.
  if (routing.locales.length < 2) return null;

  return (
    <label
      className={`relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] tracking-[0.12em] text-white/70 uppercase transition-colors hover:text-white lg:min-h-0 lg:py-1.5 ${isPending ? "opacity-60" : ""} ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-white/55" aria-hidden />
      <span aria-hidden>{locale}</span>
      <select
        value={locale}
        onChange={(e) => change(e.target.value as AppLocale)}
        aria-label={t("label")}
        disabled={isPending}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {ENDONYMS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
