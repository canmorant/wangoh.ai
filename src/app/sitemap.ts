import type { MetadataRoute } from "next";
import { countries } from "@/data/destinations";
import { countrySlug, citySlug, guideFor } from "@/content/guides";
import { absolute } from "@/lib/site";

/**
 * Statik export'ta (Capacitor uygulama derlemesi) bu metadata route'ları
 * derleme anında üretilmek zorunda; aksi hâlde Next "force-static
 * yapılandırılmamış" diye derlemeyi durduruyor. İçerik zaten tamamen
 * statik veriden geliyor, dolayısıyla bir şey kaybetmiyoruz.
 */
export const dynamic = "force-static";


/**
 * Yalnızca gerçekten içeriği olan sayfalar haritaya girer. Rehberi henüz
 * yazılmamış şehirler `noindex` olduğu için buraya da alınmıyor — ince içeriği
 * dizine göndermek sitenin tamamının değerlendirmesini düşürür.
 */
export default function sitemap(): MetadataRoute.Sitemap {

  const staticPages: MetadataRoute.Sitemap = [
    { url: absolute("/"), priority: 1 },
    { url: absolute("/gezi-rehberleri"), priority: 0.9 },
    { url: absolute("/tests"), priority: 0.5 },
    { url: absolute("/flags"), priority: 0.5 },
    { url: absolute("/hakkimizda"), priority: 0.4 },
    { url: absolute("/iletisim"), priority: 0.4 },
    { url: absolute("/gizlilik-politikasi"), priority: 0.2 },
    { url: absolute("/cerez-politikasi"), priority: 0.2 },
    { url: absolute("/kullanim-kosullari"), priority: 0.2 },
  ];

  const countryPages: MetadataRoute.Sitemap = countries.map((c) => ({
    url: absolute(`/${countrySlug(c)}`),
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
