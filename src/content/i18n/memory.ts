import type { AppLocale } from "@/i18n/routing";
import en from "./tm/en.json";
import de from "./tm/de.json";
import ru from "./tm/ru.json";
import es from "./tm/es.json";
import fr from "./tm/fr.json";

/**
 * Dil başına çeviri belleği: tm/<dil>.json, grup → { karma → çeviri }.
 * Gruplar (destinations, hubs, guides…) yalnızca düzen için; arama tek
 * düz tablo üzerinden.
 *
 * Yalnızca sunucuda kullanılmalı: dosyalar megabaytlarca. İstemciye gereken
 * metinler sunucuda çözülüp prop olarak iniyor (scripts/i18n.test.ts denetler).
 */
type Raw = Record<string, Record<string, string>>;
const RAW: Record<Exclude<AppLocale, "tr">, Raw> = { en, de, ru, es, fr } as Record<Exclude<AppLocale, "tr">, Raw>;

const flat = new Map<AppLocale, ReadonlyMap<string, string>>();

export function translationMemory(locale: AppLocale): ReadonlyMap<string, string> | null {
  if (locale === "tr") return null;
  let memory = flat.get(locale);
  if (!memory) {
    const map = new Map<string, string>();
    for (const group of Object.values(RAW[locale])) for (const [k, v] of Object.entries(group)) map.set(k, v);
    flat.set(locale, map);
    memory = map;
  }
  return memory;
}
