import type { MetadataRoute } from "next";
import { countries } from "@/data/destinations";
import { countrySlug, citySlug, guideFor } from "@/content/guides";
import { absolute } from "@/lib/site";

/**
 * Yalnızca gerçekten içeriği olan sayfalar haritaya girer. Rehberi henüz
 * yazılmamış şehirler `noindex` olduğu için buraya da alınmıyor — ince içeriği
 * dizine göndermek sitenin tamamının değerlendirmesini düşürür.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, priority: 1 },
    { url: absolute("/tests"), lastModified: now, priority: 0.5 },
    { url: absolute("/flags"), lastModified: now, priority: 0.5 },
  ];

  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: absolute(`/${countrySlug(c)}`),
    lastModified: now,
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = countries.flatMap((c) =>
    c.cities.flatMap((city) => {
      const guide = guideFor(c.code, city.name);
      return guide
        ? [
            {
              url: absolute(`/${countrySlug(c)}/${citySlug(city)}`),
              lastModified: new Date(guide.reviewed),
              priority: 0.9,
            },
          ]
        : [];
    })
  );

  return [...staticPages, ...countryPages, ...cityPages];
}
