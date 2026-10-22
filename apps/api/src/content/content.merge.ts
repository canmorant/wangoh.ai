import { AppException, type FieldErrorDetail } from "../common/errors.js";
import { FOREIGN_LANGS, type ForeignLang } from "./content.constants.js";
import type { TravelTexts } from "./content.types.js";
import { REQUIRED_GUIDE_FIELDS } from "./dto/guide.dto.js";

/** Çeviri yaması: `tr` her zaman nesne; `en`/`es` nesne ya da `null` (dili sil). */
export interface LangPatch<T> {
  tr?: T;
  en?: T | null;
  es?: T | null;
}

/** DTO örneklerini (sınıf örnekleri) düz JSON'a çevirir; `undefined` alanlar düşer. */
export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Dil başına BİRLEŞTİRİR: gönderilen alanlar o dildeki alanların yerine geçer (diziler ve iç içe nesneler tümüyle),
 * gönderilmeyen alanlar korunur. `null` (yalnız en/es) dili siler. Girdi değişmez.
 */
export function mergeTranslations<T extends object>(current: Record<string, T>, patch: LangPatch<Partial<T>> | undefined): Record<string, T> {
  const next: Record<string, T> = { ...current };
  if (!patch) return next;
  for (const lang of ["tr", ...FOREIGN_LANGS] as const) {
    const incoming = patch[lang];
    if (incoming === undefined) continue;
    if (incoming === null) {
      if (lang !== "tr") delete next[lang];
      continue;
    }
    next[lang] = { ...(next[lang] ?? ({} as T)), ...toPlain(incoming) };
  }
  return next;
}

/**
 * `completeLangs`: istenen liste (yoksa mevcut), kanonik sırada. Açıkça istenen bir dilin çevirisi yoksa 400;
 * mevcut listedeki bir dilin çevirisi silindiyse (`en: null`) sessizce düşer.
 */
export function resolveCompleteLangs(
  requested: readonly ForeignLang[] | undefined,
  previous: readonly string[],
  translations: Record<string, object>,
  field = "completeLangs",
): ForeignLang[] {
  if (requested) {
    const missing = requested.filter((lang) => translations[lang] === undefined);
    if (missing.length > 0) {
      throw AppException.validation(
        missing.map((lang) => ({ field, code: "missingTranslation", message: `"${lang}" dilinin çevirisi yok; önce çeviriyi gönderin.` })),
        "Çeviri tam değil.",
      );
    }
  }
  const base = requested ?? previous;
  return FOREIGN_LANGS.filter((lang) => base.includes(lang) && translations[lang] !== undefined);
}

function missingFields(body: Record<string, unknown> | undefined, required: readonly string[]): string[] {
  return required.filter((field) => body === undefined || body[field] === undefined || body[field] === null || body[field] === "");
}

/** Tam işaretlenen (ve Türkçe) dillerde zorunlu alanlar eksikse 400 `VALIDATION_FAILED`. */
export function assertRequired(
  field: string,
  translations: Record<string, object>,
  langs: readonly string[],
  required: readonly string[],
  extraRequired?: (lang: string, body: Record<string, unknown>) => string[],
): void {
  const details: FieldErrorDetail[] = [];
  for (const lang of langs) {
    const body = translations[lang] as Record<string, unknown> | undefined;
    if (body === undefined) {
      details.push({ field: `${field}.${lang}`, code: "missingTranslation", message: `"${lang}" dilinin çevirisi yok.` });
      continue;
    }
    const missing = [...missingFields(body, required), ...(extraRequired?.(lang, body) ?? [])];
    if (missing.length > 0) {
      details.push({ field: `${field}.${lang}`, code: "incompleteTranslation", message: `Eksik alanlar: ${missing.join(", ")}.` });
    }
  }
  if (details.length > 0) throw AppException.validation(details, "Çeviri tam değil.");
}

export const REQUIRED_CITY_FIELDS = ["name", "description"] as const;
export const REQUIRED_COUNTRY_FIELDS = ["name"] as const;
export const REQUIRED_TRAVEL_FIELDS = ["description", "signature", "gateway", "capital", "bestSeason", "flightTime", "budget"] as const;
export { REQUIRED_GUIDE_FIELDS };

/** Tam sayılan bir dilin seyahat metninde hub, Türkçede varsa o dilde de bulunmalı. */
export function requiredHub(trTexts: TravelTexts | undefined): (lang: string, body: Record<string, unknown>) => string[] {
  return (lang, body) => (lang !== "tr" && trTexts?.hub !== undefined && body.hub === undefined ? ["hub"] : []);
}

/** Yazılan hub'dan yalnız yazılabilir alanları bırakır (yanıta özgü `cityLinks` atılır). */
export function stripHubDerived<T extends { routeIdeas?: Array<Record<string, unknown>> }>(hub: T): T {
  return { ...hub, routeIdeas: hub.routeIdeas?.map(({ cityLinks: _cityLinks, ...route }) => route) } as T;
}

/**
 * Rota şehirleri (`hub.routeIdeas[].cities`) şehre Türkçe adıyla bağlanır, tüm dillerde (anahtar çevrilmez). Şehrin
 * Türkçe adı değişince başvurular da değişmezse bağlantılar sessizce kopar. Değişen olmadıysa `null`; girdi değişmez.
 */
export function renameCityInTravel(translations: Record<string, TravelTexts>, from: string, to: string): Record<string, TravelTexts> | null {
  const next = toPlain(translations);
  let changed = false;
  for (const body of Object.values(next)) {
    const routes: unknown = body?.hub?.routeIdeas;
    if (!Array.isArray(routes)) continue;
    for (const route of routes as Array<{ cities?: unknown }>) {
      if (!Array.isArray(route?.cities)) continue;
      route.cities = route.cities.map((city: unknown) => {
        if (city !== from) return city;
        changed = true;
        return to;
      });
    }
  }
  return changed ? next : null;
}

/** `renameCityInTravel` gibi, rehberlerdeki `relatedGuides[].city` başvuruları için. */
export function renameCityInGuide(translations: Record<string, object>, from: string, to: string): Record<string, object> | null {
  const next = toPlain(translations) as Record<string, { relatedGuides?: unknown }>;
  let changed = false;
  for (const body of Object.values(next)) {
    if (!Array.isArray(body?.relatedGuides)) continue;
    for (const item of body.relatedGuides as Array<{ city?: unknown }>) {
      if (item?.city !== from) continue;
      item.city = to;
      changed = true;
    }
  }
  return changed ? next : null;
}

/** Yazılan rehber gövdesinden yanıta özgü `relatedGuides[].slug` alanını atar. */
export function stripGuideDerived<T extends { relatedGuides?: Array<Record<string, unknown>> }>(body: T): T {
  if (!body.relatedGuides) return body;
  return { ...body, relatedGuides: body.relatedGuides.map(({ slug: _slug, ...item }) => item) };
}
