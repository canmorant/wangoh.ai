/**
 * Yazı gövdesi editörünün saf dönüştürücüleri: düz metin <-> blok dizisi.
 *
 * Metin biçimi (satır tabanlı, bir satır en çok bir şey söyler):
 *  - boş satır           : paragrafı / listeyi / alıntıyı bitirir
 *  - `## Başlık`         : 2. düzey başlık, `### Başlık` 3. düzey
 *  - `- madde`           : madde işaretli liste (ardışık satırlar tek liste)
 *  - `1. madde`          : numaralı liste (numaralar yok sayılır, çizimde yeniden sıralanır)
 *  - `> alıntı`          : alıntı; son satır `> — Kaynak` ise kaynak (`cite`) olur
 *  - `![açıklama](https://adres)` ya da `![açıklama](https://adres "alt yazı")` : görsel
 *  - diğer satırlar      : paragraf (ardışık satırlar tek paragraf, satır sonları korunur)
 *
 * Gidiş-dönüş: `textToBlocks(blocksToText(b))`, kurallı blok dizilerinde (`b`: kenarlarında boşluk olmayan
 * satırlardan oluşan, sunucu doğrulamasından geçen bloklar) `b`ye eşittir. Paragrafta özel söz dizimiyle başlayan
 * satır `\` ile kaçırılır (`\## başlık değil`), paragraf içindeki boş satır tek başına `\` satırıdır. Kurallı olmayan
 * girdide (satır kenarı boşlukları, alıntı sonundaki boş satır) metin korunur, yalnız boşluklar normalleşir.
 * Sunucu sınırları `validateBlocks` ile aynı kurallarla istemcide de uygulanır.
 */
import type { BlogBlock, ImageBlock } from "../blog/blockTypes";
import { BLOCK_LIMITS, hasForbiddenChars, isBlankText, isHttpsUrl } from "../blog/contentRules";

export interface ParseIssue {
  /** Metindeki satır numarası (1'den başlar). */
  line: number;
  message: string;
}

export interface ParseResult {
  blocks: BlogBlock[];
  /** `blocks[i]`nin metindeki ilk satırı (1'den başlar). */
  lines: number[];
  /** Çevrilemeyen satırlar. Boş değilse form kaydetmez; blok yerine düz paragraf üretilir. */
  issues: ParseIssue[];
}

const HEADING = /^(#{2,3})(?:[ \t]+(.*))?$/;
const BULLET = /^-(?:[ \t]+(.*))?$/;
const NUMBERED = /^\d{1,3}\.(?:[ \t]+(.*))?$/;
const QUOTE = /^>[ \t]?(.*)$/;
const IMAGE_START = /^!\[/;
const CITE_LIKE = /^—(?:[ \t].*)?$/;

const IMAGE_HINT = "Görsel biçimi: ![açıklama](https://adres)";

function startsSpecial(line: string): boolean {
  return HEADING.test(line) || BULLET.test(line) || NUMBERED.test(line) || QUOTE.test(line) || IMAGE_START.test(line);
}

/** Paragraf satırı özel söz dizimi gibi (ya da kaçış gibi) görünüyorsa kaçırılması gerekir. */
function needsEscape(line: string): boolean {
  const rest = line.replace(/^\\+/, "");
  return rest === "" ? line !== "" : startsSpecial(rest);
}

function escapeParagraphLine(line: string): string {
  if (line === "") return "\\";
  return needsEscape(line) ? `\\${line}` : line;
}

function unescapeParagraphLine(line: string): string {
  return needsEscape(line) ? line.slice(1) : line;
}

function needsQuoteEscape(content: string): boolean {
  return CITE_LIKE.test(content.replace(/^\\+/, ""));
}

function escapeAlt(alt: string): string {
  return alt.replace(/[\\[\]]/g, "\\$&");
}

function escapeCaption(caption: string): string {
  return caption.replace(/["\\]/g, "\\$&");
}

function unescapeBackslashes(value: string): string {
  return value.replace(/\\(.)/gs, "$1");
}

type ImageParse = { ok: true; block: BlogBlock } | { ok: false; message: string };

/** `![alt](url)` ya da `![alt](url "alt yazı")`; `line` kırpılmış ve `![` ile başlar. */
function parseImageLine(line: string): ImageParse {
  let i = 2;
  let alt = "";
  let closed = false;
  while (i < line.length) {
    const char = line[i]!;
    if (char === "\\" && i + 1 < line.length) {
      alt += line[i + 1]!;
      i += 2;
      continue;
    }
    if (char === "]") {
      closed = true;
      break;
    }
    alt += char;
    i += 1;
  }
  if (!closed || line[i + 1] !== "(" || !line.endsWith(")") || line.length < i + 3) return { ok: false, message: IMAGE_HINT };

  const inner = line.slice(i + 2, -1).trim();
  let url = inner;
  let caption: string | undefined;
  if (/\s/.test(inner)) {
    const match = /^(\S+)\s+"((?:\\.|[^"\\])*)"$/s.exec(inner);
    if (!match) return { ok: false, message: IMAGE_HINT };
    url = match[1]!;
    caption = unescapeBackslashes(match[2]!).trim();
  }

  alt = alt.trim();
  if (alt === "") return { ok: false, message: "Görselin açıklaması (alt metin) boş olamaz: ![açıklama](https://adres)" };
  if (!isHttpsUrl(url)) return { ok: false, message: "Görsel adresi https:// ile başlayan geçerli bir adres olmalı." };

  const block: ImageBlock = { type: "image", url, alt };
  if (caption) block.caption = caption;
  return { ok: true, block };
}

type Open =
  | { kind: "paragraph"; start: number; lines: string[] }
  | { kind: "bullet" | "numbered"; start: number; items: string[] }
  | { kind: "quote"; start: number; lines: string[] };

/** Düz metni bloklara çevirir; çevrilemeyen satırları `issues` içinde bildirir. */
export function parseBlocks(input: string): ParseResult {
  const blocks: BlogBlock[] = [];
  const lines: number[] = [];
  const issues: ParseIssue[] = [];
  let open: Open | null = null;

  const push = (block: BlogBlock, line: number) => {
    blocks.push(block);
    lines.push(line);
  };

  const flush = () => {
    if (!open) return;
    const current = open;
    open = null;
    switch (current.kind) {
      case "paragraph":
        push({ type: "paragraph", text: current.lines.join("\n") }, current.start);
        return;
      case "bullet":
      case "numbered":
        if (current.items.length > 0) push({ type: "list", ordered: current.kind === "numbered", items: current.items }, current.start);
        return;
      case "quote": {
        const content = [...current.lines];
        let cite: string | undefined;
        const last = content[content.length - 1];
        if (last !== undefined && CITE_LIKE.test(last)) {
          cite = last.slice(1).trim();
          content.pop();
        }
        const text = content
          .map((line) => (line.startsWith("\\") && needsQuoteEscape(line) ? line.slice(1) : line))
          .join("\n")
          .replace(/^\n+|\n+$/g, "");
        if (text === "") {
          issues.push({ line: current.start, message: "Alıntı metni boş olamaz." });
          return;
        }
        if (cite === "") {
          issues.push({ line: current.start, message: "Alıntı kaynağı (— Kaynak) boş olamaz." });
          cite = undefined;
        }
        push(cite ? { type: "quote", text, cite } : { type: "quote", text }, current.start);
        return;
      }
    }
  };

  const addParagraphLine = (content: string, lineNo: number) => {
    if (open?.kind === "paragraph") open.lines.push(content);
    else {
      flush();
      open = { kind: "paragraph", start: lineNo, lines: [content] };
    }
  };

  const rawLines = input.replace(/\r\n?/g, "\n").split("\n");
  rawLines.forEach((raw, index) => {
    const lineNo = index + 1;
    const line = raw.trim();
    if (line === "") {
      flush();
      return;
    }
    if (line.startsWith("\\")) {
      addParagraphLine(unescapeParagraphLine(line), lineNo);
      return;
    }

    let match: RegExpExecArray | null;
    if ((match = HEADING.exec(line))) {
      flush();
      const text = (match[2] ?? "").trim();
      if (text === "") issues.push({ line: lineNo, message: "Başlık boş olamaz: ## Başlık" });
      else push({ type: "heading", level: match[1]!.length === 2 ? 2 : 3, text }, lineNo);
      return;
    }
    if ((match = BULLET.exec(line)) || (match = NUMBERED.exec(line))) {
      const kind = line.startsWith("-") ? "bullet" : "numbered";
      let list: Extract<Open, { items: string[] }>;
      if ((open?.kind === "bullet" || open?.kind === "numbered") && open.kind === kind) list = open;
      else {
        flush();
        list = { kind, start: lineNo, items: [] };
        open = list;
      }
      const item = (match[1] ?? "").trim();
      if (item === "") issues.push({ line: lineNo, message: "Liste maddesi boş olamaz." });
      else list.items.push(item);
      return;
    }
    if ((match = QUOTE.exec(line))) {
      let quote: Extract<Open, { kind: "quote" }>;
      if (open?.kind === "quote") quote = open;
      else {
        flush();
        quote = { kind: "quote", start: lineNo, lines: [] };
        open = quote;
      }
      quote.lines.push(match[1]!.trim());
      return;
    }
    if (IMAGE_START.test(line)) {
      flush();
      const image = parseImageLine(line);
      if (image.ok) push(image.block, lineNo);
      else {
        issues.push({ line: lineNo, message: image.message });
        addParagraphLine(line, lineNo);
      }
      return;
    }
    addParagraphLine(line, lineNo);
  });
  flush();

  return { blocks, lines, issues };
}

/** Düz metni bloklara çevirir (`parseBlocks`un yalnız bloklar). Hiçbir girdide hata fırlatmaz. */
export function textToBlocks(text: string): BlogBlock[] {
  return parseBlocks(text).blocks;
}

function oneLine(value: string): string {
  return value.replace(/\s*[\r\n\u2028\u2029]+\s*/g, " ").trim();
}

/** Blokları editör metnine çevirir. Bilinmeyen/bozuk bloklar atlanır. */
export function blocksToText(blocks: readonly BlogBlock[] | null | undefined): string {
  if (!Array.isArray(blocks)) return "";
  const chunks: string[] = [];
  for (const block of blocks as readonly unknown[]) {
    const chunk = blockToText(block);
    if (chunk !== null) chunks.push(chunk);
  }
  return chunks.join("\n\n");
}

function blockToText(block: unknown): string | null {
  if (typeof block !== "object" || block === null) return null;
  const b = block as Record<string, unknown>;
  switch (b.type) {
    case "heading":
      if (typeof b.text !== "string") return null;
      return `${b.level === 3 ? "###" : "##"} ${oneLine(b.text)}`;
    case "paragraph":
      if (typeof b.text !== "string") return null;
      return b.text
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => escapeParagraphLine(line.trim()))
        .join("\n");
    case "list": {
      if (!Array.isArray(b.items)) return null;
      const items = b.items.filter((item): item is string => typeof item === "string");
      if (items.length === 0) return null;
      return items.map((item, index) => `${b.ordered === true ? `${index + 1}.` : "-"} ${oneLine(item)}`).join("\n");
    }
    case "quote": {
      if (typeof b.text !== "string") return null;
      const lines = b.text
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .map((line) => (needsQuoteEscape(line) ? `\\${line}` : line));
      if (typeof b.cite === "string" && oneLine(b.cite) !== "") lines.push(`— ${oneLine(b.cite)}`);
      return lines.map((line) => (line === "" ? ">" : `> ${line}`)).join("\n");
    }
    case "image": {
      if (typeof b.url !== "string" || typeof b.alt !== "string") return null;
      const caption = typeof b.caption === "string" ? oneLine(b.caption) : "";
      return `![${escapeAlt(oneLine(b.alt))}](${b.url}${caption ? ` "${escapeCaption(caption)}"` : ""})`;
    }
    default:
      return null;
  }
}

// --- doğrulama (sunucu `validateBlocks` ile aynı kurallar) ------------------------------------------------

export interface BlockIssue {
  /** Noktalı yol: `body.3.url`. */
  field: string;
  code: string;
  message: string;
}

/** Sunucu yanıtındaki hata sayısı sınırıyla aynı: ekranı doğrulama mesajlarıyla doldurmaz. */
const MAX_ISSUES = 50;

class Collector {
  readonly issues: BlockIssue[] = [];
  totalChars = 0;

  get full(): boolean {
    return this.issues.length >= MAX_ISSUES;
  }

  add(field: string, code: string, message: string): void {
    if (!this.full) this.issues.push({ field, code, message });
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkText(c: Collector, field: string, value: unknown, max: number, multiline = false): boolean {
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
  if (hasForbiddenChars(value, multiline)) {
    c.add(field, "noControlChars", "Kontrol ya da yön belirleyici karakter içeremez.");
    return false;
  }
  c.totalChars += value.length;
  return true;
}

function checkBlock(c: Collector, block: unknown, path: string): void {
  const at = (key: string) => `${path}.${key}`;
  if (!isPlainObject(block)) {
    c.add(path, "isObject", "Blok bir nesne olmalı.");
    return;
  }
  switch (block.type) {
    case "heading":
      if (block.level !== 2 && block.level !== 3) c.add(at("level"), "isIn", "Başlık düzeyi 2 ya da 3 olmalı.");
      checkText(c, at("text"), block.text, BLOCK_LIMITS.heading);
      return;
    case "paragraph":
      checkText(c, at("text"), block.text, BLOCK_LIMITS.paragraph, true);
      return;
    case "list": {
      const items = block.items;
      if (!Array.isArray(items)) c.add(at("items"), "isArray", "Liste olmalı.");
      else if (items.length === 0) c.add(at("items"), "arrayNotEmpty", "Liste boş olamaz.");
      else if (items.length > BLOCK_LIMITS.listItems) {
        c.add(at("items"), "arrayMaxSize", `Listede en fazla ${BLOCK_LIMITS.listItems} madde olabilir.`);
      } else items.forEach((item, i) => checkText(c, `${at("items")}.${i}`, item, BLOCK_LIMITS.listItem));
      return;
    }
    case "quote":
      checkText(c, at("text"), block.text, BLOCK_LIMITS.quote, true);
      if (block.cite !== undefined) checkText(c, at("cite"), block.cite, BLOCK_LIMITS.cite);
      return;
    case "image":
      if (typeof block.url !== "string") c.add(at("url"), "isString", "Metin olmalı.");
      else if (block.url.length > BLOCK_LIMITS.url) c.add(at("url"), "maxLength", `En fazla ${BLOCK_LIMITS.url} karakter olabilir.`);
      else if (!isHttpsUrl(block.url)) c.add(at("url"), "isHttpsUrl", "Adres https:// ile başlayan geçerli bir adres olmalı.");
      else c.totalChars += block.url.length;
      checkText(c, at("alt"), block.alt, BLOCK_LIMITS.alt);
      if (block.caption !== undefined) checkText(c, at("caption"), block.caption, BLOCK_LIMITS.caption);
      return;
    default:
      c.add(at("type"), "isIn", "Blok türü şunlardan biri olmalı: heading, paragraph, list, quote, image.");
  }
}

/** Bir blok dizisini sunucuyla aynı kurallarla doğrular; sorun yoksa boş liste döner. Boş dizi geçerlidir (taslak). */
export function validateBlocks(value: unknown, basePath = "body"): BlockIssue[] {
  const c = new Collector();
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

export interface BodyIssue {
  /** Sorunun metindeki satırı (1'den); satıra bağlanamayan genel sorunlarda null. */
  line: number | null;
  message: string;
}

/** `body.<blok>[.items.<n>].alan` yolundaki blok sırasını ve (listede) madde sırasını çıkarır. */
export function locateIssue(field: string, basePath = "body"): { block: number; item: number | null } | null {
  if (!field.startsWith(`${basePath}.`)) return null;
  const parts = field.slice(basePath.length + 1).split(".");
  const block = Number(parts[0]);
  if (!Number.isInteger(block) || block < 0) return null;
  const item = parts[1] === "items" && parts[2] !== undefined ? Number(parts[2]) : null;
  return { block, item: item !== null && Number.isInteger(item) ? item : null };
}

/**
 * Editör metnini baştan sona doğrular: çevrilemeyen satırlar + blok kuralları (sunucuyla aynı). Her sorun mümkünse
 * metindeki satıra bağlanır. `requireContent`: yayın için gövde boş olamaz.
 */
export function validateBodyText(text: string, options: { requireContent?: boolean } = {}): BodyIssue[] {
  const parsed = parseBlocks(text);
  const issues: BodyIssue[] = parsed.issues.map((issue) => ({ line: issue.line, message: issue.message }));
  for (const issue of validateBlocks(parsed.blocks)) {
    const where = locateIssue(issue.field);
    if (!where) {
      issues.push({ line: null, message: issue.message });
      continue;
    }
    const start = parsed.lines[where.block];
    issues.push({ line: start === undefined ? null : start + (where.item ?? 0), message: issue.message });
  }
  if (options.requireContent && parsed.blocks.length === 0 && parsed.issues.length === 0) {
    issues.push({ line: null, message: "Yayınlanan yazının gövdesi boş olamaz." });
  }
  return issues;
}
