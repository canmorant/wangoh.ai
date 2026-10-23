/**
 * API paragraflarındaki satır içi `**kalın**` işaretlemesi (kaynak: web'in rehber metinleri).
 * Yalnız çift yıldız desteklenir; HTML, bağlantı ya da başka işaretleme yorumlanmaz, düz metin kalır.
 *
 * Kural web ile birebir aynıdır (`text.split(/(\*\*[^*]+\*\*)/)`): kalın parça `**` + en az bir
 * yıldızsız karakter + `**`. Kapanmamış, boş (`****`) ya da yıldız içeren çiftler eşleşmez ve
 * olduğu gibi (ayraçlarıyla) düz metin olarak kalır; hiçbir metin kaybolmaz.
 */

export interface InlineSegment {
  text: string;
  bold: boolean;
}

const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;

/** Metni kalın / düz parçalara böler. Bitişik aynı türden parçalar birleştirilir; boş parça üretmez. */
export function parseInlineBold(input: string): InlineSegment[] {
  const segments: InlineSegment[] = [];

  const push = (text: string, bold: boolean) => {
    if (text === "") return;
    const last = segments[segments.length - 1];
    if (last && last.bold === bold) last.text += text;
    else segments.push({ text, bold });
  };

  let cursor = 0;
  for (const match of input.matchAll(BOLD_PATTERN)) {
    const start = match.index ?? 0;
    push(input.slice(cursor, start), false);
    push(match[1] ?? "", true);
    cursor = start + match[0].length;
  }
  push(input.slice(cursor), false);
  return segments;
}

/** Ekran okuyucu ve paylaşım gibi düz metin gereken yerler için ayraçsız metin. */
export function stripInlineBold(input: string): string {
  return parseInlineBold(input)
    .map((segment) => segment.text)
    .join("");
}
