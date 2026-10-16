/** Arayüz ve içerik dilleri. Canlı diller: tr, en, es. */
export const LANGS = ["tr", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];

/**
 * `translations` jsonb sütunlarının ortak biçimi: Türkçe zorunlu, diğer diller isteğe bağlı.
 * `T` çeviri nesnesinin biçimi; alan görevleri kendi tipini burada daraltır.
 */
export type Translations<T = Record<string, unknown>> = { tr: T } & Partial<Record<Exclude<Lang, "tr">, T>>;

/** Çeviri nesnelerinin gevşek biçimi: bilinen alanlar isteğe bağlı, ek alanlara izin var. */
export type LooseTranslation = Record<string, unknown>;
