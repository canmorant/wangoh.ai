/** Türkçe büyük ünlü uyumuna göre özel ada yönelme eki ekler. */
export function turkishDative(name: string) {
  const lower = name.toLocaleLowerCase("tr-TR");
  const vowels = [...lower].filter((letter) => "aeıioöuü".includes(letter));
  const lastVowel = vowels.at(-1) ?? "e";
  const suffixVowel = "aıou".includes(lastVowel) ? "a" : "e";
  const endsWithVowel = "aeıioöuü".includes(lower.at(-1) ?? "");
  return `${name}'${endsWithVowel ? "y" : ""}${suffixVowel}`;
}
