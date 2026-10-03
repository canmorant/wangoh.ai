import { defineRouting } from "next-intl/routing";

/** Sitenin desteklediği diller. Varsayılan Türkçe. */
export const LOCALES = ["tr", "en", "de", "ru", "es", "fr"] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "tr";

export const routing = defineRouting({
  locales: LOCALES,
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
