import type { routing } from "@/i18n/routing";
import type messages from "../messages/tr.json";

/**
 * next-intl tip güvenliği: çeviri anahtarları Türkçe kaynak dosyadan
 * türetiliyor. Olmayan bir anahtar (t("Nav.yokBoyle")) derleme hatası verir,
 * dil kodları da yalnızca desteklenen altı dil olabilir.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
