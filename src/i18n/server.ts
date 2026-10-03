import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "./routing";

/**
 * Her sayfanın ve generateMetadata'nın başında:
 *   - dili doğrular (desteklenmeyen dil → 404),
 *   - statik üretim için next-intl'e bildirir (setRequestLocale; aksi hâlde
 *     getTranslations istek başlıklarına bakar ve sayfa dinamikleşir),
 *   - tipli dil kodunu döndürür.
 */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<AppLocale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
}
