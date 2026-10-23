/**
 * Sunucudan gelen gövdeyi çizmeden önce güvenli hâle getirir. API zaten doğrular; yine de istemci hiçbir şeyi
 * körü körüne çizmez: bilinmeyen blok türleri sessizce atlanır, bozuk alanlar düzeltilir ya da blok atlanır,
 * görsel adresleri yalnız https kabul edilir. Çıktı yalnız `BlogBlock` biçimindedir (HTML/Markdown yorumlanmaz).
 */
import type { BlogBlock, ImageBlock } from "./blockTypes";
import { isHttpsUrl } from "./contentRules";
import { countWords } from "./format";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function visibleText(value: unknown): string | null {
  const result = text(value);
  return result !== null && result.trim() !== "" ? result : null;
}

export function sanitizeBlocks(value: unknown): BlogBlock[] {
  if (!Array.isArray(value)) return [];
  const blocks: BlogBlock[] = [];
  for (const raw of value as unknown[]) {
    if (!isRecord(raw)) continue;
    switch (raw.type) {
      case "heading": {
        const content = visibleText(raw.text);
        if (content !== null) blocks.push({ type: "heading", level: raw.level === 3 ? 3 : 2, text: content });
        break;
      }
      case "paragraph": {
        const content = visibleText(raw.text);
        if (content !== null) blocks.push({ type: "paragraph", text: content });
        break;
      }
      case "list": {
        const items = Array.isArray(raw.items) ? raw.items.map(visibleText).filter((item): item is string => item !== null) : [];
        if (items.length > 0) blocks.push({ type: "list", ordered: raw.ordered === true, items });
        break;
      }
      case "quote": {
        const content = visibleText(raw.text);
        if (content === null) break;
        const cite = visibleText(raw.cite);
        blocks.push(cite === null ? { type: "quote", text: content } : { type: "quote", text: content, cite });
        break;
      }
      case "image": {
        if (!isHttpsUrl(raw.url)) break;
        const caption = visibleText(raw.caption);
        const image: ImageBlock = { type: "image", url: raw.url, alt: text(raw.alt) ?? "" };
        if (caption !== null) image.caption = caption;
        blocks.push(image);
        break;
      }
      default:
        break;
    }
  }
  return blocks;
}

/** Bir blokta okunacak metin (kelime sayımı için). */
function blockText(block: BlogBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text;
    case "list":
      return block.items.join(" ");
    case "quote":
      return block.text;
    default:
      return "";
  }
}

export function bodyWordCount(blocks: readonly BlogBlock[]): number {
  return blocks.reduce((total, block) => total + countWords(blockText(block)), 0);
}
