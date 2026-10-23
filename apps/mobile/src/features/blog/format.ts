/**
 * Blog arayüzü için saf biçimlendirme yardımcıları. `Intl`e dayanmaz (Hermes'te tarih/yerel ayar desteği
 * cihaza göre değişir); Türkçe ay adları arayüz etiketidir, içerik değildir.
 */

const MONTHS_TR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"] as const;
const MONTHS_TR_SHORT = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"] as const;

export interface DateFormatOptions {
  /** Saat dilimi yerine UTC alanlarını kullanır (testler için). Varsayılan: cihazın yerel saati. */
  utc?: boolean;
}

function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function fields(date: Date, utc: boolean) {
  return utc
    ? { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate(), hour: date.getUTCHours(), minute: date.getUTCMinutes() }
    : { year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), hour: date.getHours(), minute: date.getMinutes() };
}

/** "22 Ekim 2026". Geçersiz ya da boş girdide boş metin. */
export function formatDateTr(iso: string | null | undefined, { utc = false }: DateFormatOptions = {}): string {
  const date = parseDate(iso);
  if (!date) return "";
  const f = fields(date, utc);
  return `${f.day} ${MONTHS_TR[f.month]} ${f.year}`;
}

/** "22 Eki 2026 14:05". */
export function formatDateTimeTr(iso: string | null | undefined, { utc = false }: DateFormatOptions = {}): string {
  const date = parseDate(iso);
  if (!date) return "";
  const f = fields(date, utc);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${f.day} ${MONTHS_TR_SHORT[f.month]} ${f.year} ${pad(f.hour)}:${pad(f.minute)}`;
}

/** Türkçe kurallarıyla ilk harfi büyütür: i -> İ, ı -> I. */
export function capitalizeTr(text: string): string {
  const first = text.charAt(0);
  if (first === "") return text;
  const upper = first === "i" ? "İ" : first === "ı" ? "I" : first.toUpperCase();
  return upper + text.slice(1);
}

/**
 * Etiketin ekranda görünen adı. Etiketler dil bağımsız tanımlayıcılardır (`ülke-rehberi`, `europe`); kıta
 * etiketleri API'den gelen kıta adıyla (`continentNames`: slug -> ad) gösterilir, kalanlar okunur hâle getirilir
 * (tireler boşluk, ilk harf büyük).
 */
export function tagLabel(tag: string, continentNames?: Readonly<Record<string, string>>): string {
  const continent = continentNames?.[tag];
  if (continent) return continent;
  return capitalizeTr(tag.replace(/-+/g, " ").trim());
}

/** Kelime sayısından okuma süresi (dakika, en az 1). Dakikada 200 kelime. */
export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

/** Boşlukla ayrılmış kelime sayısı. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}
