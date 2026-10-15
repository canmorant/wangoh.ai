import type { MetadataRoute } from "next";
import { SITE, absolute } from "@/lib/site";

/**
 * Bu metadata route'u derleme anında üretilir. İçerik tamamen statik veriden
 * geliyor, dolayısıyla istek anında hesaplamaya gerek yok.
 */
export const dynamic = "force-static";


export default function robots(): MetadataRoute.Robots {
  return {
    // /api: istemcinin JSON uçları (konum, arama sözlüğü); sayfa değiller.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absolute("/sitemap.xml"),
    host: SITE.url,
  };
}
