import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, UNPUBLISHED_LOCALES, type AppLocale } from "./i18n/routing";
import { hasLocalizedPaths, internalPath, localizePath } from "./i18n/paths";

const intl = createMiddleware(routing);

/**
 * Next 16'da middleware.ts'in yeni adı proxy.ts. Görevi dil yönlendirmesi:
 *   /japonya        → (iç) /tr/japonya     adres değişmez
 *   /tr/japonya     → 307 /japonya         varsayılan dil önek almaz
 *   /en/japonya     → yayındaysa olduğu gibi
 *
 * Henüz yayında olmayan bir dilin adresi (çevirisi süren dil) Türkçe
 * karşılığına GEÇİCİ olarak yönleniyor. 308 değil, çünkü tarayıcılar kalıcı
 * yönlendirmeyi önbelleğe alıyor; dil yayına girdiğinde aynı adres yeniden
 * kendi sayfasını açmalı.
 *
 * Adresleri kendi dilinde olan dillerde (en, es; bkz. i18n/paths):
 *   /en/france/paris  → (iç) /en/fransa/paris   adres değişmez (rewrite)
 *   /en/fransa/paris  → 308 /en/france/paris    eski/Türkçe slug'lı adres
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = pathname.split("/")[1];
  if ((UNPUBLISHED_LOCALES as readonly string[]).includes(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(prefix.length + 1) || "/";
    return NextResponse.redirect(url, 307);
  }
  if (hasLocalizedPaths(prefix) && (routing.locales as readonly string[]).includes(prefix)) {
    const locale = prefix as AppLocale;
    const rest = pathname.slice(prefix.length + 1);
    if (rest.length > 1) {
      const internal = internalPath(rest, locale);
      const external = localizePath(internal, locale);
      if (external !== rest) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${external}`;
        return NextResponse.redirect(url, 308);
      }
      if (internal !== rest) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}${internal}`;
        const headers = new Headers(request.headers);
        headers.set("X-NEXT-INTL-LOCALE", locale);
        return NextResponse.rewrite(url, { request: { headers } });
      }
    }
  }
  return intl(request);
}

export const config = {
  // Sayfalar dışındaki her şeyi atla: Next ve Vercel iç yolları, API, ve
  // nokta içeren yollar (görseller, ikonlar, sw.js, manifest, robots.txt,
  // sitemap.xml, ads.txt). Bunların dil öneki yok.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
