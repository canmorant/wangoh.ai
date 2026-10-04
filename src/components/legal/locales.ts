import { routing, type AppLocale } from "@/i18n/routing";

/** Kurumsal ve yasal metinlerin elle çevrildiği diller. */
const LEGAL_TEXT_LOCALES: readonly AppLocale[] = ["tr", "en"];

/** Kurumsal sayfaların metni tam çevrilmiş, yayındaki dilleri (hreflang, sitemap). */
export const legalPageLocales = (): AppLocale[] =>
  routing.locales.filter((locale) => LEGAL_TEXT_LOCALES.includes(locale));

/** Sayfa metninin gösterileceği dil: o dilde çeviri yoksa Türkçe. */
export const legalTextLocale = (locale: AppLocale): "tr" | "en" => (locale === "en" ? "en" : "tr");
