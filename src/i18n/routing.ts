import { defineRouting } from "next-intl/routing";

/**
 * Çeviri altyapısı hazırlanan bütün diller (mesajlar, içerik çeviri belleği,
 * rehber şablonları). Hepsi yayında değil; bkz. PUBLISHED_LOCALES.
 */
export const LOCALES = ["tr", "en", "de", "ru", "es", "fr"] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "tr";

/**
 * Yayındaki diller. Varsayılan yalnız Türkçe: bir dil, sitenin bütün içeriği
 * o dile çevrilip kontrol edilmeden canlıya çıkmıyor.
 *
 * Çevirisi biten bir dili önizlemek ya da yayına almak için derleme ortamında
 *   NEXT_PUBLIC_SITE_LOCALES=tr,en
 * verilir. Listede olmayan dillerin adresleri (/en/...) proxy'de geçici
 * (307) olarak Türkçe karşılığına yönleniyor; dil seçici tek dil kaldığında
 * görünmüyor; sitemap ve hreflang yalnız yayındaki dilleri içeriyor.
 */
const requested = (process.env.NEXT_PUBLIC_SITE_LOCALES ?? "").split(",").map((l) => l.trim());
export const PUBLISHED_LOCALES: readonly AppLocale[] = LOCALES.filter(
  (l) => l === DEFAULT_LOCALE || requested.includes(l)
);
export const UNPUBLISHED_LOCALES: readonly AppLocale[] = LOCALES.filter(
  (l) => !PUBLISHED_LOCALES.includes(l)
);

export const routing = defineRouting({
  locales: PUBLISHED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,

  /**
   * Türkçe öneksiz kalıyor: /japonya/tokyo. Google'da indeksli 384 adresin
   * hiçbiri değişmiyor; diğer diller /en/japonya/tokyo gibi önek alıyor.
   * /tr/japonya/tokyo da çalışıyor ve öneksiz adrese yönleniyor.
   */
  localePrefix: "as-needed",

  /**
   * Tarayıcı diline göre otomatik yönlendirme KAPALI. Türkiye'de pek çok
   * kullanıcı İngilizce tarayıcı kullanıyor; açık olsaydı Türk okuyucu
   * İngilizce arayüze düşerdi. Dil yalnızca adresten ve dil seçiciden gelir.
   */
  localeDetection: false,

  /** Algılama kapalıyken çerez işe yaramıyor; çerez politikasında da yok. */
  localeCookie: false,

  /**
   * Kapalı: açık olsaydı proxy her yanıta "bu sayfa altı dilde var" diyen
   * bir Link başlığı eklerdi. Rehberler henüz yalnızca Türkçe; hreflang
   * bilgisini sayfa meta verisinde, gerçekten var olan dillerle veriyoruz.
   */
  alternateLinks: false,
});
