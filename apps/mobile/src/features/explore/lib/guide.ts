/**
 * Şehir rehberi yardımcıları: içindekiler, bölüm başlıkları ve tarih biçimi. Saf mantık (React yok).
 */

export type PlacesKind = "food" | "sights" | undefined;

/** Mekân kartı bölümünün başlığı ve giriş metni: restoran kartları ya da gezi durakları. */
export function placesSection(kind: PlacesKind): { title: string; intro: string; tocLabel: string } {
  if (kind === "sights") {
    return {
      title: "Öne çıkan duraklar",
      tocLabel: "Öne çıkan duraklar",
      intro:
        "Şehri en iyi anlatan duraklar. Saatli giriş, bilet ve çalışma saatleri değişebildiği için yola çıkmadan önce resmî kanaldan doğrulayın.",
    };
  }
  return {
    title: "Nerede yenir? Seçilmiş adresler",
    tocLabel: "Nerede yenir?",
    intro:
      "Aşağıdakiler tek tek gezilecek adresler değil, şehrin yeme kültürünü en iyi anlatan duraklar. Çalışma saatleri ve fiyatlar değişebildiği için yola çıkmadan önce doğrulayın.",
  };
}

export interface GuideLike {
  sections: { id: string; heading: string }[];
  places: unknown[];
  placesKind?: PlacesKind;
  itinerary: unknown[];
  practicalTips?: unknown[];
  practicalHeading?: string;
  relatedGuides?: unknown[];
  faqs: unknown[];
  sources?: unknown[];
}

export interface TocEntry {
  /** Bölümün sabit kimliği; açık/kapalı durumu ve kaydırma konumu bununla izlenir. */
  id: string;
  label: string;
}

/** Bölüm kimlikleri API'nin `sections[].id` değerleriyle çakışmasın diye ön ekle ayrılır. */
export const GUIDE_BLOCK_IDS = {
  places: "blok-mekanlar",
  itinerary: "blok-gezi-plani",
  practical: "blok-pratik",
  related: "blok-rota",
  faq: "blok-sss",
  sources: "blok-kaynaklar",
} as const;

export const DEFAULT_PRACTICAL_HEADING = "Bilmeden gitme";

/** Rehberin bölümleri, ekrandaki sırayla. Boş olan bölüm içindekilerde yer almaz. */
export function buildToc(guide: GuideLike): TocEntry[] {
  const toc: TocEntry[] = guide.sections.map((section) => ({ id: section.id, label: section.heading }));
  if (guide.places.length > 0) toc.push({ id: GUIDE_BLOCK_IDS.places, label: placesSection(guide.placesKind).tocLabel });
  if (guide.itinerary.length > 0) toc.push({ id: GUIDE_BLOCK_IDS.itinerary, label: "Gün gün gezi planı" });
  if (guide.practicalTips && guide.practicalTips.length > 0) {
    toc.push({ id: GUIDE_BLOCK_IDS.practical, label: guide.practicalHeading?.trim() || DEFAULT_PRACTICAL_HEADING });
  }
  if (guide.relatedGuides && guide.relatedGuides.length > 0) toc.push({ id: GUIDE_BLOCK_IDS.related, label: "Rotayı sürdür" });
  if (guide.faqs.length > 0) toc.push({ id: GUIDE_BLOCK_IDS.faq, label: "Sık sorulan sorular" });
  if (guide.sources && guide.sources.length > 0) toc.push({ id: GUIDE_BLOCK_IDS.sources, label: "Resmî kaynaklar" });
  return toc;
}

/** İlk açılışta açık olan bölümler: yalnız ilk içerik bölümü. */
export function initialOpenIds(toc: readonly TocEntry[]): string[] {
  const first = toc[0];
  return first ? [first.id] : [];
}

const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

/**
 * "2026-08-09" → "9 Ağustos 2026". Biçim bozuksa girdiyi aynen döndürür (tarih uydurulmaz).
 * Intl'e bağlı değil: Hermes'te yerel ayar desteği cihaza göre değişir.
 */
export function formatReviewedDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const name = MONTHS[month - 1];
  if (!name || day < 1 || day > 31) return iso;
  return `${day} ${name} ${year}`;
}
