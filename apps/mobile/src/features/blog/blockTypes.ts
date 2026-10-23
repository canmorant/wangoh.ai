import type { HeadingBlockDto, ImageBlockDto, ListBlockDto, ParagraphBlockDto, QuoteBlockDto } from "@wangoh/api-client";

/** Blog gövdesinin tek öğesi (API şeması: heading, paragraph, list, quote, image). */
export type BlogBlock = HeadingBlockDto | ParagraphBlockDto | ListBlockDto | QuoteBlockDto | ImageBlockDto;
export type ImageBlock = ImageBlockDto;

export const BLOCK_TYPES = ["heading", "paragraph", "list", "quote", "image"] as const;
