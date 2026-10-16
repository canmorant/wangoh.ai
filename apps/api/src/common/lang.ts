import { applyDecorators } from "@nestjs/common";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { LANGS, type Lang, type Translations } from "../db/schema/types.js";

export { LANGS, type Lang };
export const DEFAULT_LANG: Lang = "tr";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/**
 * `lang` sorgu alanı dekoratörü (`@LangField() lang: Lang = "tr"`): Swagger belgesi + doğrulama.
 * Başka sorgu DTO'larına (ör. sayfalı liste) eklemek için; `LangQueryDto` yalnız `lang` taşır.
 */
export function LangField(): PropertyDecorator {
  return applyDecorators(
    ApiPropertyOptional({ enum: LANGS, default: DEFAULT_LANG, description: "İçerik dili. Çeviri tam değilse Türkçeye düşülür." }),
    IsOptional(),
    IsIn(LANGS),
  );
}

/** `?lang=tr|en|es` sorgu parametresi; verilmezse Türkçe. Diğer değerler 400 döner. */
export class LangQueryDto {
  @LangField()
  lang: Lang = DEFAULT_LANG;
}

export interface ResolvedTranslation<T> {
  /** Gerçekte sunulan dil. */
  lang: Lang;
  /** İstenen dil tam olarak sunuldu mu? `false` ise Türkçeye düşülmüştür. */
  complete: boolean;
  value: T;
}

/**
 * İstenen dilde çeviriyi seçer. İstenen dilde çeviri yoksa ya da `completeLangs` içinde değilse
 * Türkçeye düşer ve `complete: false` döner. `completeLangs` verilmezse (ör. blog) yalnız
 * çevirinin varlığına bakılır. Çeviri uydurulmaz.
 */
export function resolveTranslation<T>(
  translations: Translations<T>,
  completeLangs: readonly string[] | null | undefined,
  requested: Lang = DEFAULT_LANG,
): ResolvedTranslation<T> {
  if (requested === DEFAULT_LANG) return { lang: "tr", complete: true, value: translations.tr };
  const candidate = translations[requested];
  const isComplete = completeLangs === undefined || completeLangs === null || completeLangs.includes(requested);
  if (candidate !== undefined && candidate !== null && isComplete) {
    return { lang: requested, complete: true, value: candidate };
  }
  return { lang: "tr", complete: false, value: translations.tr };
}
