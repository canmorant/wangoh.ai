import type { MetadataRoute } from "next";
import { SITE, absolute } from "@/lib/site";

/**
 * Statik export'ta (Capacitor uygulama derlemesi) bu metadata route'ları
 * derleme anında üretilmek zorunda; aksi hâlde Next "force-static
 * yapılandırılmamış" diye derlemeyi durduruyor. İçerik zaten tamamen
 * statik veriden geliyor, dolayısıyla bir şey kaybetmiyoruz.
 */
export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absolute("/sitemap.xml"),
    host: SITE.url,
  };
}
