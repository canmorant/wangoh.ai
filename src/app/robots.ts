import type { MetadataRoute } from "next";
import { SITE, absolute } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absolute("/sitemap.xml"),
    host: SITE.url,
  };
}
