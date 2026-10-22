import { AppException, type FieldErrorDetail } from "../common/errors.js";
import { MAX_ERROR_DETAILS } from "../common/validation.js";

/**
 * Blog gövdesi: düz bir blok dizisi (HTML/Markdown yok). Mobil güvenle ve yerel bileşenlerle çizer.
 * Bu dosya sınırların ve doğrulamanın TEK kaynağıdır: yönetici uçları, tohum yükleyici ve testler
 * aynı `validateBlocks`ı kullanır.
 */

export const BLOCK_TYPES = ["heading", "paragraph", "list", "quote", "image"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export interface HeadingBlock {
  type: "heading";
  level: 2 | 3;
  text: string;
}
export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}
export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: string[];
}
export interface QuoteBlock {
  type: "quote";
  text: string;
  cite?: string;
}
export interface ImageBlock {
  type: "image";
  url: string;
  alt: string;
  caption?: string;
}
export type BlogBlock = HeadingBlock | ParagraphBlock | ListBlock | QuoteBlock | ImageBlock;

/** Üst sınırlar (karakter olarak). Bir çeviri en çok `maxBlocks` blok ve `maxTotalChars` karakter taşır. */
export const BLOCK_LIMITS = {
  maxBlocks: 300,
  /** Bir çevirideki tüm blok metinlerinin toplamı. */
  maxTotalChars: 100_000,
  heading: 200,
  paragraph: 10_000,
  listItems: 100,
  listItem: 1_000,
  quote: 2_000,
  cite: 200,
  url: 2_048,
  alt: 300,
  caption: 500,
} as const;

/** Her blok türünün alabileceği anahtarlar; başkası reddedilir. */
const ALLOWED_KEYS: Record<BlockType, readonly string[]> = {
  heading: ["type", "level", "text"],
  paragraph: ["type", "text"],
  list: ["type", "ordered", "items"],
  quote: ["type", "text", "cite"],
  image: ["type", "url", "alt", "caption"],
};

/**
 * Görünmez/yönlendirici karakterler: kontrol karakterleri (NUL, ESC, DEL, C1...), satır/paragraf ayırıcılar
 * (U+2028/2029), çift yönlü metin kontrolleri (görünen metni gerçek içerikten ayırır) ve BOM. ZWJ/ZWNJ gibi
 * meşru biçim karakterleri (emoji dizileri) serbest.
 */
const FORBIDDEN_SINGLE_LINE = /[\p{Cc}\u{2028}\u{2029}\u{200e}\u{200f}\u{061c}\u{202a}-\u{202e}\u{2066}-\u{2069}\u{feff}]/u;
/** Çok satırlı metinde (paragraf, alıntı, özet) satır sonu ve sekme serbest. */
const FORBIDDEN_MULTI_LINE = /[\p{Cc}\u{2028}\u{2029}\u{200e}\u{200f}\u{061c}\u{202a}-\u{202e}\u{2066}-\u{2069}\u{feff}]/u;
const ALLOWED_WHITESPACE_CONTROLS = /[\n\r\t]/g;

/** Metinde yasak karakter var mı? `multiline` true ise `\n`, `\r`, `\t` serbesttir. */
export function hasForbiddenChars(text: string, multiline = false): boolean {
  return multiline ? FORBIDDEN_MULTI_LINE.test(text.replace(ALLOWED_WHITESPACE_CONTROLS, "")) : FORBIDDEN_SINGLE_LINE.test(text);
}

/**
 * Görünür hiçbir şey çizmeyen metin: boşluklar (NBSP dahil), "görmezden gelinebilir" karakterler (sıfır genişlikli
 * boşluk, ZWNJ/ZWJ, yumuşak tire, kelime birleştirici, Hangul dolgusu, varyasyon seçicileri...) ve Braille boşluğu
 * (U+2800). `trim()` bunların çoğunu kırpmaz; yalnız bunlardan oluşan başlık/paragraf "dolu" sayılıp boş yazı
 * yayınlanırdı. Metnin İÇİNDEKİ ZWJ/ZWNJ (emoji dizileri, Farsça) etkilenmez: yalnızca bütün metin görünmezse true.
 */
const BLANK_TEXT = /^[\p{White_Space}\p{Default_Ignorable_Code_Point}\u{2800}]*$/u;
export function isBlankText(text: string): boolean {
  return BLANK_TEXT.test(text);
}

/**
 * Yalnız https adresi: `javascript:`, `http:`, `data:`, `//host`, göreli yollar, kimlik bilgili
 * (`https://kullanici@host`) ve boşluk/kontrol karakteri/ters eğik çizgi içeren adresler reddedilir. `URL` ayrıştırıcısı
 * `https:host` ve `https:///host` gibi biçimleri sessizce düzelttiğinden ham metin ayrıca denetlenir.
 */
export function isHttpsUrl(value: unknown, maxLength: number = BLOCK_LIMITS.url): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) return false;
  // Ters eğik çizgi: tarayıcılar `/` gibi okur, bazı kütüphaneler kimlik bilgisi ayırıcısı sayar; hiç kabul etme.
  // Görünmez/yön belirleyici karakterler (RLO, LRI, sıfır genişlikli boşluk...) adresi olduğundan farklı gösterir.
  if (/[\s\p{Cc}\p{Default_Ignorable_Code_Point}\\]/u.test(value)) return false;
  const authority = /^https:\/\/([^/?#]*)/i.exec(value)?.[1];
  if (authority === undefined || authority === "" || authority.includes("@")) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "" && url.username === "" && url.password === "";
  } catch {
    return false;
  }
}

const MAX_REPORTED_FIELD = 200;

class IssueCollector {
  readonly issues: FieldErrorDetail[] = [];
  totalChars = 0;

  get full(): boolean {
    return this.issues.length >= MAX_ERROR_DETAILS;
  }

  add(field: string, code: string, message: string): void {
    // Alan yolu kullanıcı girdisini (anahtar adları) yansıtabilir: yanıtta şişmesin.
    if (!this.full) this.issues.push({ field: field.slice(0, MAX_REPORTED_FIELD), code, message });
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Zorunlu ya da isteğe bağlı bir metin alanını doğrular; geçerliyse true. */
function checkText(c: IssueCollector, field: string, value: unknown, max: number, opts: { multiline?: boolean } = {}): boolean {
  if (typeof value !== "string") {
    c.add(field, "isString", "Metin olmalı.");
    return false;
  }
  if (isBlankText(value)) {
    c.add(field, "isNotEmpty", "Bu alan boş olamaz.");
    return false;
  }
  if (value.length > max) {
    c.add(field, "maxLength", `En fazla ${max} karakter olabilir.`);
    return false;
  }
  if (hasForbiddenChars(value, opts.multiline === true)) {
    c.add(field, "noControlChars", "Kontrol ya da yön belirleyici karakter içeremez.");
    return false;
  }
  c.totalChars += value.length;
  return true;
}

function checkUrl(c: IssueCollector, field: string, value: unknown): void {
  if (typeof value !== "string") {
    c.add(field, "isString", "Metin olmalı.");
    return;
  }
  if (value.length > BLOCK_LIMITS.url) {
    c.add(field, "maxLength", `En fazla ${BLOCK_LIMITS.url} karakter olabilir.`);
    return;
  }
  if (!isHttpsUrl(value)) {
    c.add(field, "isHttpsUrl", "Adres https:// ile başlayan geçerli bir adres olmalı.");
    return;
  }
  c.totalChars += value.length;
}

function checkBlock(c: IssueCollector, block: unknown, path: string): void {
  const at = (key: string): string => `${path}.${key}`;
  if (!isPlainObject(block)) {
    c.add(path, "isObject", "Blok bir nesne olmalı.");
    return;
  }
  const type = block.type;
  if (typeof type !== "string" || !(BLOCK_TYPES as readonly string[]).includes(type)) {
    c.add(at("type"), "isIn", `Blok türü şunlardan biri olmalı: ${BLOCK_TYPES.join(", ")}.`);
    return;
  }
  const blockType = type as BlockType;
  const allowed = ALLOWED_KEYS[blockType];
  for (const key of Object.keys(block)) {
    if (!allowed.includes(key)) c.add(at(key), "whitelistValidation", "Bu alana izin verilmiyor.");
  }

  switch (blockType) {
    case "heading": {
      if (block.level !== 2 && block.level !== 3) c.add(at("level"), "isIn", "Başlık düzeyi 2 ya da 3 olmalı.");
      checkText(c, at("text"), block.text, BLOCK_LIMITS.heading);
      return;
    }
    case "paragraph": {
      checkText(c, at("text"), block.text, BLOCK_LIMITS.paragraph, { multiline: true });
      return;
    }
    case "list": {
      if (typeof block.ordered !== "boolean") c.add(at("ordered"), "isBoolean", "Evet/hayır değeri olmalı.");
      const items = block.items;
      if (!Array.isArray(items)) {
        c.add(at("items"), "isArray", "Liste olmalı.");
      } else if (items.length === 0) {
        c.add(at("items"), "arrayNotEmpty", "Liste boş olamaz.");
      } else if (items.length > BLOCK_LIMITS.listItems) {
        c.add(at("items"), "arrayMaxSize", `Listede en fazla ${BLOCK_LIMITS.listItems} madde olabilir.`);
      } else {
        items.forEach((item, i) => checkText(c, `${at("items")}.${i}`, item, BLOCK_LIMITS.listItem));
      }
      return;
    }
    case "quote": {
      checkText(c, at("text"), block.text, BLOCK_LIMITS.quote, { multiline: true });
      if (block.cite !== undefined) checkText(c, at("cite"), block.cite, BLOCK_LIMITS.cite);
      return;
    }
    case "image": {
      checkUrl(c, at("url"), block.url);
      checkText(c, at("alt"), block.alt, BLOCK_LIMITS.alt);
      if (block.caption !== undefined) checkText(c, at("caption"), block.caption, BLOCK_LIMITS.caption);
      return;
    }
  }
}

/**
 * Bir blok dizisini doğrular ve sorunların listesini döner (geçerliyse boş). `field` yolları `basePath`
 * önekini taşır (`translations.tr.body.3.url`). Dizi boyutu `maxBlocks`, toplam metin `maxTotalChars`
 * ile sınırlıdır; en fazla `MAX_ERROR_DETAILS` sorun toplanır. Boş dizi geçerlidir (taslak).
 */
export function validateBlocks(value: unknown, basePath = "body"): FieldErrorDetail[] {
  const c = new IssueCollector();
  if (!Array.isArray(value)) {
    c.add(basePath, "isArray", "Liste olmalı.");
    return c.issues;
  }
  if (value.length > BLOCK_LIMITS.maxBlocks) {
    c.add(basePath, "arrayMaxSize", `En fazla ${BLOCK_LIMITS.maxBlocks} blok olabilir.`);
    return c.issues;
  }
  for (let i = 0; i < value.length && !c.full; i++) checkBlock(c, value[i], `${basePath}.${i}`);
  if (c.totalChars > BLOCK_LIMITS.maxTotalChars) {
    c.add(basePath, "maxTotalLength", `Toplam metin en fazla ${BLOCK_LIMITS.maxTotalChars} karakter olabilir.`);
  }
  return c.issues;
}

/** Geçersizse 400 `VALIDATION_FAILED` fırlatır (alan yolları `basePath` ile başlar). */
export function assertValidBlocks(value: unknown, basePath: string): asserts value is BlogBlock[] {
  const issues = validateBlocks(value, basePath);
  if (issues.length > 0) throw AppException.validation(issues);
}
