import type { MetadataRoute } from "next";
import { countries } from "@/data/destinations";
import { countrySlug, citySlug, guideFor } from "@/content/guides";
import { routing, type AppLocale } from "@/i18n/routing";
import { cityPageLocales, countryPageLocales, guideIndexLocales } from "@/content/localized";
import { localizedUrl, translatedAlternates } from "@/i18n/seo";
import { legalPageLocales } from "@/components/legal/locales";
import { SITE } from "@/lib/site";

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
 * Diller: her sayfa, içeriği TAM çevrilmiş olduğu her dilde ayrı adresle ve
 * yalnız o dilleri gösteren hreflang alternatifleriyle giriyor (sayfalardaki
 * contentSeo ile aynı kural). Çevirisi eksik dil sürümleri noindex olduğu
 * için haritada yok.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = (
    path: string,
    locales: readonly AppLocale[],
    extra: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">
  ): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: localizedUrl(path, locale),
      ...extra,
      ...(locales.length > 1
        ? { alternates: { languages: translatedAlternates(path, locale, locales)?.languages as Record<string, string> } }
        : {}),
    }));

  const translatedPages: MetadataRoute.Sitemap = (
    [
      ["/", 1],
      ["/tests", 0.5],
      ["/flags", 0.5],
      ["/mesafe", 0.5],
    ] as const
  ).flatMap(([path, priority]) => entries(path, routing.locales, { priority }));

  const staticPages: MetadataRoute.Sitemap = [
    ...entries("/gezi-rehberleri", guideIndexLocales(), { priority: 0.9 }),
    ...entries("/hakkimizda", legalPageLocales(), { priority: 0.4 }),
    ...entries("/iletisim", legalPageLocales(), { priority: 0.4 }),
    ...entries("/gizlilik-politikasi", legalPageLocales(), { priority: 0.2 }),
    ...entries("/cerez-politikasi", legalPageLocales(), { priority: 0.2 }),
    ...entries("/kullanim-kosullari", legalPageLocales(), { priority: 0.2 }),
  ];

  // Görseller (Google Görseller için image sitemap): sayfanın kendi fotoğrafı.
  const image = (src: string | undefined) => (src ? { images: [new URL(src, SITE.url).href] } : {});

  const countryPages: MetadataRoute.Sitemap = countries.flatMap((c) => {
    // Ülke sayfası, içindeki en son gözden geçirilen rehberle birlikte güncellenir.
    const reviewed = c.cities
      .map((city) => guideFor(c.code, city.name)?.reviewed)
      .filter((d): d is string => !!d)
      .sort()
      .at(-1);
    return entries(`/${countrySlug(c)}`, countryPageLocales(c), {
      priority: 0.8,
      ...(reviewed ? { lastModified: new Date(reviewed) } : {}),
      ...image(c.image),
    });
  });

  const cityPages: MetadataRoute.Sitemap = countries.flatMap((c) =>
    c.cities.flatMap((city) => {
      const guide = guideFor(c.code, city.name);
      return guide
        ? entries(`/${countrySlug(c)}/${citySlug(city)}`, cityPageLocales(c, city.name), {
            lastModified: new Date(guide.reviewed),
            priority: 0.9,
            ...image(city.image),
          })
        : [];
    })
  );

  return [...translatedPages, ...staticPages, ...countryPages, ...cityPages];
}
