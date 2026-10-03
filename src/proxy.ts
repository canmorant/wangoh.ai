import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, UNPUBLISHED_LOCALES } from "./i18n/routing";

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
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = pathname.split("/")[1];
  if ((UNPUBLISHED_LOCALES as readonly string[]).includes(prefix)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(prefix.length + 1) || "/";
    return NextResponse.redirect(url, 307);
  }
  return intl(request);
}

export const config = {
  // Sayfalar dışındaki her şeyi atla: Next ve Vercel iç yolları, API, ve
  // nokta içeren yollar (görseller, ikonlar, sw.js, manifest, robots.txt,
  // sitemap.xml, ads.txt). Bunların dil öneki yok.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
