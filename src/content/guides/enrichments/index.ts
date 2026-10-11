import type { AppLocale } from "@/i18n/routing";
import type { CityGuide, GuideSection } from "../types";
import pilot from "./data/pilot.json";

/**
 * Rehber zenginleştirmeleri: mevcut rehber metnine EKLENEN, şehre özgü bölümler.
 * Hiçbir mevcut metin silinmez ya da değiştirilmez; yalnız yeni bölüm eklenir ve
 * ulaşım bölümünün sonuna paragraf eklenir.
 *
 * Her şehir için üç dilde (tr, en, es) elle yazılmış metin bulunur; çeviri belleği
 * kullanılmaz, çünkü metinler tek tek o dilde yazıldı. Dil verilerde yoksa (de, ru, fr
 * henüz yayında değil) rehber olduğu gibi kalır.
 *
 * Şema: data/*.json, anahtar "ÜLKE_KODU:Veri adı" (destinations.ts'teki şehir adı).
 * Denetim: npx tsx scripts/enrichment-lint.ts
 */

export interface EnrichmentBlock {
  heading: string;
  body: string[];
}

export interface LocaleEnrichment {
  /** Kısa tarih ve karakter. */
  story: EnrichmentBlock;
  /** Yerel yemek ve içecek (mekân adı yok). */
  flavors: EnrichmentBlock;
  /** Ulaşım bölümünün sonuna eklenen paragraflar. */
  transport?: string[];
}

export type Enrichment = Partial<Record<"tr" | "en" | "es", LocaleEnrichment>>;

/** Kayıtlı veri dosyaları; yeni bir toplu dosya eklendikçe buraya da eklenir. */
const FILES: Record<string, Enrichment>[] = [pilot as Record<string, Enrichment>];

export const ENRICHMENTS: Record<string, Enrichment> = Object.assign({}, ...FILES);

export const STORY_ID = "hikaye";
export const FLAVORS_ID = "yerel-lezzetler";
const FOOD_SECTION_ID = "yeme-icme";
const TRANSPORT_SECTION_IDS = new Set(["ulasim", "havalimani-ulasimi", "havalimani-ulasim"]);

const isLocale = (locale: AppLocale): locale is "tr" | "en" | "es" =>
  locale === "tr" || locale === "en" || locale === "es";

/**
 * Rehbere zenginleştirmeyi ekler. Bölüm sırası: ilk bölümün (rota omurgası) hemen
 * ardından "hikâye", yeme-içme bölümünün hemen ardından "yerel lezzetler". Aynı
 * kimlikli bölüm zaten varsa o bölüm eklenmez.
 */
export function withEnrichment(guide: CityGuide, locale: AppLocale): CityGuide {
  if (!isLocale(locale)) return guide;
  const entry = ENRICHMENTS[`${guide.countryCode}:${guide.city}`]?.[locale];
  if (!entry) return guide;

  const ids = new Set(guide.sections.map((s) => s.id));
  const story: GuideSection | null = ids.has(STORY_ID)
    ? null
    : { id: STORY_ID, heading: entry.story.heading, body: entry.story.body };
  const flavors: GuideSection | null = ids.has(FLAVORS_ID)
    ? null
    : { id: FLAVORS_ID, heading: entry.flavors.heading, body: entry.flavors.body };

  const sections: GuideSection[] = [];
  let storyPlaced = !story;
  let flavorsPlaced = !flavors;
  guide.sections.forEach((section, i) => {
    const extended =
      entry.transport?.length && TRANSPORT_SECTION_IDS.has(section.id)
        ? { ...section, body: [...section.body, ...entry.transport] }
        : section;
    sections.push(extended);
    if (!storyPlaced && i === 0) {
      sections.push(story!);
      storyPlaced = true;
    }
    if (!flavorsPlaced && section.id === FOOD_SECTION_ID) {
      sections.push(flavors!);
      flavorsPlaced = true;
    }
  });
  // Yeme-içme bölümü yoksa lezzetler hikâyenin ardına (ya da sona) konur.
  if (!flavorsPlaced) {
    const at = story ? sections.findIndex((s) => s.id === STORY_ID) + 1 : sections.length;
    sections.splice(at || sections.length, 0, flavors!);
  }
  return { ...guide, sections };
}
