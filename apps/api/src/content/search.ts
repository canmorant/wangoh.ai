import { type SQL, sql } from "drizzle-orm";
import { escapeLike } from "../common/like.js";

/**
 * Türkçe harflere duyarlı, büyük/küçük harf duyarsız arama.
 *
 * `ILIKE` Türkçe için yanlış sonuç verir ve veritabanının yerel ayarına bağlıdır. PGlite'ta `'Isparta' ILIKE 'ısparta'`
 * ve `'IŞIK' ILIKE 'ışık'` YANLIŞ, `'İstanbul' ILIKE 'istanbul'` doğrudur: büyük "I" küçük "ı"ya değil "i"ye
 * eşlenir. Kullanıcı "ISPARTA" (Türkçe klavye, caps lock), "Isparta" (İngilizce klavye) ya da "ısparta" yazabilir.
 *
 * Çözüm: iki taraf da aynı tabloyla "katlanır" (fold) ve düz `LIKE` ile karşılaştırılır:
 *  - i, ı, İ, I hepsi `i` olur (noktalı/noktasız ayrımı kalkar),
 *  - Latin harflerin aksanlıları aksansızına iner (ç→c, ş→s, ğ→g, ö→o, ü→u, š→s, ø→o, ł→l ...),
 *  - sonra küçük harfe çevrilir.
 * Katlama JS'te (`foldSearch`) ve SQL'de (`foldSql`: `lower(translate(x, ...))`) AYNI tablodan üretilir; sonuç
 * sürücüden/yerel ayardan bağımsızdır. Bedel: "kıyı" ile "kiyi" aynı sayılır (arama için istenen davranış).
 */
const FOLD_GROUPS: ReadonlyArray<readonly [letters: string, target: string]> = [
  ["iıİIÌÍÎÏĨĪĬĮìíîïĩīĭį", "i"],
  ["ÀÁÂÃÄÅĀĂĄàáâãäåāăą", "a"],
  ["ÇĆĈĊČçćĉċč", "c"],
  ["ĎĐďđ", "d"],
  ["ÈÉÊËĒĔĖĘĚèéêëēĕėęě", "e"],
  ["ĜĞĠĢĝğġģ", "g"],
  ["ĤĦĥħ", "h"],
  ["Ĵĵ", "j"],
  ["Ķķ", "k"],
  ["ĹĻĽĿŁĺļľŀł", "l"],
  ["ÑŃŅŇñńņň", "n"],
  ["ÒÓÔÕÖØŌŎŐòóôõöøōŏő", "o"],
  ["ŔŖŘŕŗř", "r"],
  ["ŚŜŞŠȘśŝşšș", "s"],
  ["ŢŤŦȚţťŧț", "t"],
  ["ÙÚÛÜŨŪŬŮŰŲùúûüũūŭůűų", "u"],
  ["Ŵŵ", "w"],
  ["ÝŶŸýŷÿ", "y"],
  ["ŹŻŽźżž", "z"],
];

const FOLD_MAP: ReadonlyMap<string, string> = new Map(FOLD_GROUPS.flatMap(([letters, target]) => [...letters].map((ch) => [ch, target] as const)));
/** `translate(x, FOLD_FROM, FOLD_TO)` için paralel dizgiler. */
export const FOLD_FROM = [...FOLD_MAP.keys()].join("");
export const FOLD_TO = [...FOLD_MAP.values()].join("");

/** Arama terimini katlar (SQL'deki `foldSql` ile aynı sonuç). Birleşik aksan işaretleri de atılır. */
export function foldSearch(input: string): string {
  let out = "";
  for (const ch of input.normalize("NFC")) out += FOLD_MAP.get(ch) ?? ch;
  return out.replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** SQL ifadesini aynı tabloyla katlar. */
export function foldSql(expression: SQL): SQL {
  return sql`lower(translate(${expression}, ${FOLD_FROM}, ${FOLD_TO}))`;
}

/**
 * Katlanmış "içerir" koşulu: `ifade` (örn. `concat_ws(' ', ad1, ad2)`) katlanır, terim katlanıp joker karakterleri
 * (`%`, `_`, `\`) kaçırılarak aranır. Terim katlandıktan sonra boşsa koşul yoktur.
 */
export function foldContains(expression: SQL, term: string): SQL | undefined {
  const folded = foldSearch(term).trim();
  if (folded === "") return undefined;
  return sql`${foldSql(expression)} like ${`%${escapeLike(folded)}%`} escape '\\'`;
}
