import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next 16'da middleware.ts'in yeni adı proxy.ts. Projede bundan önce bir
 * proxy/middleware yoktu; tek görevi dil yönlendirmesi:
 *   /japonya        → (iç) /tr/japonya     adres değişmez
 *   /tr/japonya     → 307 /japonya         varsayılan dil önek almaz
 *   /en/japonya     → olduğu gibi
 */
export default createMiddleware(routing);

export const config = {
  // Sayfalar dışındaki her şeyi atla: Next ve Vercel iç yolları, API, ve
  // nokta içeren yollar (görseller, ikonlar, sw.js, manifest, robots.txt,
  // sitemap.xml, ads.txt). Bunların dil öneki yok.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
