import { routing, type AppLocale } from "@/i18n/routing";

/** Kurumsal ve yasal metinlerin elle çevrildiği diller. */
const LEGAL_TEXT_LOCALES = ["tr", "en", "es"] as const satisfies readonly AppLocale[];

export type LegalTextLocale = (typeof LEGAL_TEXT_LOCALES)[number];

const isLegalTextLocale = (locale: AppLocale): locale is LegalTextLocale =>
  (LEGAL_TEXT_LOCALES as readonly AppLocale[]).includes(locale);

/** Kurumsal sayfaların metni tam çevrilmiş, yayındaki dilleri (hreflang, sitemap). */
export const legalPageLocales = (): AppLocale[] => routing.locales.filter(isLegalTextLocale);

/** Sayfa metninin gösterileceği dil: o dilde çeviri yoksa Türkçe. */
export const legalTextLocale = (locale: AppLocale): LegalTextLocale =>
  isLegalTextLocale(locale) ? locale : "tr";
