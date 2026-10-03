import type { useFormatter, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";

/**
 * destinations.ts'teki yapılandırılmış alanların dile göre gösterimi.
 *
 * Veri Türkçe tutuluyor ve öyle kalıyor. Bu alanlar serbest metin değil,
 * düzenli kalıplar olduğu için uydurmadan yerelleştirilebiliyor:
 *   budget      "Yüksek" | "Orta" | "Ekonomik"
 *   flightTime  "11sa 30dk", "13sa 30dk+", "Başlangıç noktası"
 *   bestSeason  ay aralıkları + beş sabit ifade ("Bölgeye göre", "kış için"…)
 *
 * Kurallar:
 *   - Türkçede değer AYNEN döner (davranış değişmez).
 *   - Kalıp tanınmazsa Türkçe aslı döner — asla tahmin edilmiş bir çıktı yok.
 *   - Ay adları next-intl'in tarih biçimlendiricisinden (Intl), elle değil.
 */

type TravelT = ReturnType<typeof useTranslations<"TravelData">>;
type Formatter = Pick<ReturnType<typeof useFormatter>, "dateTime">;

const BUDGET_KEYS = { Yüksek: "high", Orta: "moderate", Ekonomik: "budget" } as const;

export function localizeBudget(value: string, locale: AppLocale, t: TravelT): string {
  if (locale === "tr") return value;
  const key = BUDGET_KEYS[value as keyof typeof BUDGET_KEYS];
  return key ? t(`budget.${key}`) : value;
}

export function localizeFlightTime(value: string, locale: AppLocale, t: TravelT): string {
  if (locale === "tr") return value;
  if (value === "Başlangıç noktası") return t("flight.origin");
  const m = value.match(/^(\d+)sa(?: (\d+)dk)?(\+?)$/);
  if (!m) return value;
  // "+" dilden bağımsız: "en az" anlamında, olduğu gibi kalıyor.
  return t("flight.duration", { hours: m[1], minutes: m[2] ?? "00" }) + m[3];
}

const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function localizeBestSeason(
  value: string,
  locale: AppLocale,
  t: TravelT,
  format: Formatter
): string {
  if (locale === "tr") return value;

  const month = (name: string) => {
    const i = MONTHS_TR.indexOf(name.trim());
    if (i < 0) return null;
    // Ayın ortası ve UTC: saat dilimi kayması ayı değiştiremesin.
    return format.dateTime(new Date(Date.UTC(2024, i, 15)), { month: "long", timeZone: "UTC" });
  };
  const range = (text: string) => {
    const months = text.split("–").map(month);
    return months.every(Boolean) ? months.join("–") : null;
  };

  const parts = value.split(" · ").map((raw) => {
    const seg = raw.trim();
    if (seg === "Bölgeye göre") return t("season.byRegion");
    if (seg === "kış deneyimi") return t("season.winterExperience");
    let m: RegExpMatchArray | null;
    if ((m = seg.match(/^kuzey ışıkları için (.+)$/))) {
      const r = range(m[1]);
      return r && t("season.forNorthernLights", { months: r });
    }
    if ((m = seg.match(/^kış için (.+)$/))) {
      const r = range(m[1]);
      return r && t("season.forWinter", { months: r });
    }
    if ((m = seg.match(/^(.+) genel$/))) {
      const r = range(m[1]);
      return r && t("season.general", { months: r });
    }
    return range(seg);
  });

  return parts.every(Boolean) ? parts.join(" · ") : value;
}
