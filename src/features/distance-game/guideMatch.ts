import { TR_CITY_NAMES } from "@/data/worldCityNames";

/**
 * Oyundaki şehir ile sitenin rehberi olan şehir nasıl eşleşir? Tek yer burası:
 * hem sunucu verisi (serverData.guideMatches) hem de veri üreticisi
 * (scripts/gen-world-cities.mjs, rehberli şehirleri veriye zorla ekler) bunu
 * kullanır; böylece "rehberi var" kararı iki yerde ayrışmaz.
 *
 * Eşleşme AYNI ülke kodunda ve ad üzerinden olur (ad, aksan ve noktalama
 * gözetmeden karşılaştırılır: Hue = Huế, Rodos = Ródos). Rehber adı şu üç
 * adaydan biriyle aynı olmalı:
 *   1. oyundaki şehrin Türkçe tablodaki karşılığı (Münih, Marakeş...),
 *   2. oyundaki şehrin veri adı (Tokyo, Nice...),
 *   3. rehber adının İngilizce çevirisi (Roma → Rome).
 * Adı bu üç yolla eşleşmeyen az sayıda şehir için açık bir ALIAS tablosu var.
 */

/** Aksan, büyük/küçük harf ve noktalama gözetmeyen karşılaştırma anahtarı. */
export function normName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Şehir adı eşleşmeyen ya da rehberin adı bir çift/bölge olan şehirler için
 * AÇIK eşleştirme: "ISO2:veri adı" → rehberdeki şehir adı.
 *   linkOnly: true  → yalnız "rehberini oku" bağlantısı verir; ekranda rehberin
 *                     adı GÖSTERİLMEZ ("Recife ve Olinda" yerine "Recife" yazar).
 * Yalnız emin olunanlar: rehber, o şehri ana üs olarak anlatıyor ya da aynı yerin
 * başka yazımı. Emin olunamayan yerler (Postojna ve Predjama, Keukenhof ve Lisse,
 * Inari ve Saariselkä...) bilerek yok.
 */
export interface GuideAlias {
  /** Rehberdeki (Türkçe) şehir adı. */
  guide: string;
  linkOnly?: true;
}
export const GUIDE_ALIASES: Readonly<Record<string, GuideAlias>> = {
  "BR:Recife": { guide: "Recife ve Olinda", linkOnly: true },
  "BR:Manaus": { guide: "Manaus ve Amazon", linkOnly: true },
  "AR:Salta": { guide: "Salta ve Jujuy", linkOnly: true },
  "CN:Guilin": { guide: "Guilin ve Yangshuo", linkOnly: true },
  // Aynı yer, farklı yazım: GeoNames "Pilsen" (İngilizce/Almanca), rehber "Plzeň"; "Ko Samui" / "Koh Samui".
  "CZ:Pilsen": { guide: "Plzeň" },
  "TH:Ko Samui": { guide: "Koh Samui" },
};

/**
 * Rehberde şehir gibi görünen ama oyuna şehir olarak GİRMEMESİ gereken kayıtlar:
 * "ISO2:rehber adı". Okinawa rehberi adayı anlatıyor; aynı adlı Okinawa şehri
 * (Koza) adanın merkezi (Naha) değil.
 */
export const GUIDE_SKIP: ReadonlySet<string> = new Set(["JP:Okinawa"]);

/** Oyundaki şehrin (ülke + veri adı) rehber adıyla aynı sayılacağı adlar. */
export function dataNameVariants(iso2: string, dataName: string): string[] {
  const turkish = TR_CITY_NAMES[`${iso2}:${dataName}`];
  return [dataName, ...(turkish ? [turkish] : [])].map(normName);
}

/**
 * Rehberdeki şehir (Türkçe ad + İngilizce çevirisi), oyundaki şehirle bu üç
 * yoldan biriyle eşleşiyor mu? (ALIAS tablosu ayrıca, çağıran tarafta.)
 */
export function guideMatchesName(iso2: string, dataName: string, guideName: string, guideNameEn: string): boolean {
  if (GUIDE_SKIP.has(`${iso2}:${guideName}`)) return false;
  const variants = dataNameVariants(iso2, dataName);
  return variants.includes(normName(guideName)) || variants.includes(normName(guideNameEn));
}
