/**
 * Etiket normalleştirmenin TEK kaynağı: yazma uçları (DTO), `tag` süzgeci ve tohum yükleyici aynısını kullanır;
 * aksi halde yazılan etiket süzgeçle bulunamaz.
 *
 * - Unicode NFC: "ü" tek karakter da (U+00FC) `u` + birleşik trema da (U+0075 U+0308) aynı etiket olur,
 *   tekrar ayıklama ve eşleşme çalışır.
 * - `İ` (U+0130) önce `i`ye çevrilir. Yerel ayarsız `toLowerCase()` onu `i` + birleşik nokta (U+0069 U+0307)
 *   yapar: "İstanbul" hiçbir klavyeyle yazılamayan, `?tag=istanbul` ile bulunamayan bir etikete dönerdi.
 * - Yerel ayar (tr) kullanılmaz: etiketler dil bağımsızdır ve `toLocaleLowerCase("tr")` İngilizce "IT" etiketini
 *   "ıt" yapardı. Bedeli: "I" her zaman `i` olur ("IĞDIR" -> "iğdir"); noktasız `ı` yazılmışsa olduğu gibi kalır.
 */
export function normalizeTag(value: string): string {
  return value.trim().normalize("NFC").replace(/\u0130/g, "i").toLowerCase().normalize("NFC");
}
