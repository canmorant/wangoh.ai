import { ALL_DESTINATIONS, destinationTexts } from "./destinations";
import { ORIGIN_CITIES } from "@/data/origins";
import { countryHubFor } from "@/content/countryHubs";
import { DIETARY_GUIDES } from "@/content/dietary/catalog";
import { buildGuides } from "@/content/guides";
import { createGuideContext } from "@/content/guides/context";
import { en as anyTemplates } from "@/content/guides/templates/en";
import { isTranslatable, textKey, translateDeep } from "./core";
import { DIETARY_KEYS, HUB_KEYS } from "./keys";

/**
 * Çevrilmesi gereken bütün Türkçe kaynak metinler, gruplarıyla.
 *
 * Elle liste tutulmuyor: içerik, sitenin kullandığı yerelleştirme yoluyla
 * "kayıt modunda" (boş bellekle) bir kez üretiliyor ve çeviriciye sorulan
 * her metin kaydediliyor. Böylece buradaki küme, çalışma anında gerçekten
 * çevrilmeye çalışılan metinlerle birebir aynı.
 *
 * Kullanan: scripts/content-i18n.ts (eksikleri çıkarma, birleştirme) ve
 * scripts/i18n.test.ts (kapsam raporu).
 */

export type SourceGroup = "destinations" | "hubs" | "dietary" | "guides";

export interface SourceText {
  key: string;
  text: string;
  group: SourceGroup;
  /** Bu metni kullanan sayfalar: "JP:Tokyo" (rehber/beslenme) ya da "JP" (ülke). */
  scopes: Set<string>;
}

export { ALL_DESTINATIONS, destinationTexts } from "./destinations";

export function collectSources(): Map<string, SourceText> {
  const out = new Map<string, SourceText>();
  const add = (text: string, group: SourceGroup, scope: string) => {
    if (!isTranslatable(text)) return;
    const key = textKey(text);
    const entry = out.get(key);
    if (entry) entry.scopes.add(scope);
    else out.set(key, { key, text, group, scopes: new Set([scope]) });
  };
  const recorder = (group: SourceGroup, scope: string) => (text: string) => {
    add(text, group, scope);
    return text;
  };

  // Sıra önemli: bir metin ilk geçtiği grupta tutulur. Yer adları ve kısa
  // destinasyon metinleri en çok paylaşılanlar; önce onlar.
  for (const country of ALL_DESTINATIONS) {
    for (const text of destinationTexts(country)) add(text, "destinations", country.code);
  }
  // Uçuş animasyonunun kalkış şehirleri (ana sayfa).
  for (const city of ORIGIN_CITIES) add(city.name, "destinations", "origins");

  for (const country of ALL_DESTINATIONS) {
    const hub = countryHubFor(country.code);
    if (hub) translateDeep(hub, recorder("hubs", country.code), HUB_KEYS);
  }

  for (const entry of DIETARY_GUIDES) {
    translateDeep(entry, recorder("dietary", `${entry.countryCode}:${entry.city}`), DIETARY_KEYS);
  }

  // Rehberler: boş bellekli bir bağlam her eksiği kendi rehberine yazar.
  // Kalıplar dilden bağımsız olarak aynı kaynak metinleri ister; istisnalar
  // dile özgü iki seçenek: sectionHeadings (bölüm başlıklarını bellekten
  // istemez) ve internationalAudience (Türkiye'ye özel kaynakları atlar).
  // Kayıt, en geniş metin kümesini görsün diye ikisi de kapalı.
  const expanded = { ...anyTemplates.expanded, sectionHeadings: undefined, internationalAudience: undefined };
  const ctx = createGuideContext("en", new Map(), { ...anyTemplates, expanded });
  buildGuides(ctx);
  for (const [scope, texts] of ctx.missing) for (const text of texts) add(text, "guides", scope);

  return out;
}
