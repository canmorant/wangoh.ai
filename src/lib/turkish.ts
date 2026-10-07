/** Türkçe büyük ünlü uyumuna göre özel ada yönelme eki ekler. */
export function turkishDative(name: string) {
  const lower = name.toLocaleLowerCase("tr-TR");
  const vowels = [...lower].filter((letter) => "aeıioöuü".includes(letter));
  const lastVowel = vowels.at(-1) ?? "e";
  const suffixVowel = "aıou".includes(lastVowel) ? "a" : "e";
  const endsWithVowel = "aeıioöuü".includes(lower.at(-1) ?? "");
  return `${name}'${endsWithVowel ? "y" : ""}${suffixVowel}`;
}

/**
 * Özel adlara bulunma (-da/-de/-ta/-te), yönelme (-a/-e) ve belirtme (-ı/-i/-u/-ü)
 * eklerini büyük ve küçük ünlü uyumu, ünsüz benzeşmesi ve iyelikli ad
 * kaynaştırması ("Toba Gölü'nde") ile getirir. Yazılışı telaffuzundan
 * ayrılan adlar OVERRIDES tablosunda.
 */
type NameInfo = { front: boolean; rounded: boolean; vowelFinal: boolean; hard: boolean; possessive: boolean };

const LETTER_MAP: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", å: "a", ä: "e",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ø: "ö",
  ú: "u", ù: "u", û: "u",
  ć: "c", č: "ç", š: "ş", ž: "z", ł: "l", ñ: "n", ň: "n", ř: "r", ğ: "ğ",
};

const POSSESSIVE_ENDING =
  /(Gölü|Gölleri|Vadisi|Kıyısı|Parkı|Adası|Adaları|Dağı|Bölgesi|İsviçresi|Şelaleleri|Krateri|Boğazı|Yarımadası|Cumhuriyeti|Emirlikleri|Devletleri)$/;

/** Telaffuzu yazılışına uymayan adlar: ünlü uyumu ("front") ve son ünsüzün sertliği ("hard"). */
const OVERRIDES: Record<string, { front?: boolean; hard?: boolean; vowelFinal?: boolean }> = {
  Nice: { front: true, hard: true, vowelFinal: false }, // [nis]: Nice'te, Nice'e
  Seul: { front: true },
  "Los Angeles": { front: false, hard: true },
  Manchester: { front: false },
  Edinburgh: { front: false, hard: false },
};

function nameInfo(name: string): NameInfo {
  const possessive = POSSESSIVE_ENDING.test(name);
  const lower = name.toLocaleLowerCase("tr-TR");
  const mapped = [...lower].map((c) => LETTER_MAP[c] ?? c).join("");
  const letters = [...mapped].filter((c) => /\p{L}/u.test(c));
  const vowels = letters.filter((c) => "aeıioöuü".includes(c));
  const lastVowel = vowels.at(-1) ?? "e";
  const last = letters.at(-1) ?? "e";
  const override = OVERRIDES[name];
  const vowelFinal = override?.vowelFinal ?? "aeıioöuü".includes(last);
  const front = override?.front ?? "eiöü".includes(lastVowel);
  const hard = override?.hard ?? "çfhkpsşt".includes(last);
  const rounded = "oöuü".includes(lastVowel);
  return { front, rounded, vowelFinal, hard, possessive };
}

/** "Londra" → "Londra'da", "Paris" → "Paris'te", "Toba Gölü" → "Toba Gölü'nde". */
export function turkishLocative(name: string) {
  const { front, vowelFinal, hard, possessive } = nameInfo(name);
  const vowel = front ? "e" : "a";
  if (possessive) return `${name}'nd${vowel}`;
  return `${name}'${!vowelFinal && hard ? "t" : "d"}${vowel}`;
}

/** "Roma" → "Roma'ya", "Berlin" → "Berlin'e", "Bled Gölü" → "Bled Gölü'ne". */
export function turkishDativeCase(name: string) {
  const { front, vowelFinal, possessive } = nameInfo(name);
  const vowel = front ? "e" : "a";
  return `${name}'${possessive ? "n" : vowelFinal ? "y" : ""}${vowel}`;
}

/** "Roma" → "Roma'yı", "Berlin" → "Berlin'i", "Seul" → "Seul'ü". */
export function turkishAccusative(name: string) {
  const { front, rounded, vowelFinal, possessive } = nameInfo(name);
  const vowel = front ? (rounded ? "ü" : "i") : rounded ? "u" : "ı";
  return `${name}'${possessive ? "n" : vowelFinal ? "y" : ""}${vowel}`;
}
