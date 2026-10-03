import type { MetadataRoute } from "next";
import { countries } from "@/data/destinations";
import { countrySlug, citySlug, guideFor } from "@/content/guides";
import { absolute } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { localizedUrl, translatedAlternates } from "@/i18n/seo";

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
 *
 * Diller: tamamen çevrilmiş sayfalar (ana sayfa, testler, bayrak oyunu) her
 * dilde ayrı adresle ve hreflang alternatifleriyle giriyor. İçeriği yalnızca
 * Türkçe olan sayfaların diğer dil sürümleri noindex (i18n/seo.ts), o yüzden
 * onlar yalnızca Türkçe adresleriyle listeleniyor.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const translatedPages: MetadataRoute.Sitemap = (
    [
      ["/", 1],
      ["/tests", 0.5],
      ["/flags", 0.5],
    ] as const
  ).flatMap(([path, priority]) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(path, locale),
      priority,
      alternates: { languages: translatedAlternates(path, locale)?.languages as Record<string, string> },
    }))
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: absolute("/gezi-rehberleri"), priority: 0.9 },
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

  return [...translatedPages, ...staticPages, ...countryPages, ...cityPages];
}
