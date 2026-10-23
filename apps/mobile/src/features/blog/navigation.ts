import type { Href } from "expo-router";

/*
 * Tipli rotalar (`.expo/types/router.d.ts`) yalnız `expo` çalışınca yeniden üretilir; bu dosyalar başka ekranların
 * (Keşfet ülke sayfası) ya da yeni eklenen rotaların adreslerini üretir. Adres biçimi tek yerde, `Href`e dönüştürülerek
 * yazılır: tür denetimi üretilmiş dosyanın güncelliğine bağlı kalmaz.
 */

/** Blog yazısı ayrıntısı: `/blog/<slug>`. */
export function blogPostHref(slug: string): Href {
  return `/blog/${encodeURIComponent(slug)}` as Href;
}

/** Ülke rehberi (Keşfet sekmesindeki ülke sayfası): `/country/XX`. */
export function countryHref(code: string): Href {
  return `/country/${encodeURIComponent(code.toUpperCase())}` as Href;
}

/** Blog listesi, isteğe bağlı etiket süzgeciyle. */
export function blogListHref(tag?: string): Href {
  return (tag ? { pathname: "/blog", params: { tag } } : "/blog") as Href;
}
