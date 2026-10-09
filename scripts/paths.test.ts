/**
 * Dile göre adresler (src/i18n/paths.ts) — çakışma ve iki yönlü çeviri.
 * Run:  npx tsx scripts/paths.test.ts
 *
 * Her sayfanın her dilde TEK adresi olmalı ve o adres geri iç yola dönmeli;
 * aksi hâlde proxy bir sayfayı yanlış sayfaya yazar ya da döngüye girer.
 */
import { execFileSync } from "node:child_process";
import { allCountries, countrySlug, citySlug } from "../src/content/guides";
import { appFilePath, internalPath, localizePath, stripFileIndex } from "../src/i18n/paths";
import { SLUG_LOCALES } from "../src/i18n/slugs.gen";
import { LOCALES } from "../src/i18n/routing";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  if (!c || process.env.VERBOSE) console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};

/** Uygulamanın ilk düzey sabit yolları (route klasörleri). */
const STATIC_ROUTES = [
  "gezi-rehberleri", "hakkimizda", "iletisim", "gizlilik-politikasi",
  "cerez-politikasi", "kullanim-kosullari", "tests", "flags", "mesafe", "haritada-bul", "cevrimdisi",
];

const countryPaths = allCountries.map((c) => `/${countrySlug(c)}`);
const cityPaths = allCountries.flatMap((c) => c.cities.map((city) => `/${countrySlug(c)}/${citySlug(city)}`));
const internal = [...STATIC_ROUTES.map((s) => `/${s}`), ...countryPaths, ...cityPaths];

for (const locale of LOCALES) {
  const localized = internal.map((p) => localizePath(p, locale));

  // 1) Tek adres: iki iç yol aynı dış adrese çevrilmesin.
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  internal.forEach((p, i) => {
    const prev = seen.get(localized[i]);
    if (prev) dupes.push(`${prev} & ${p} → ${localized[i]}`);
    seen.set(localized[i], p);
  });
  ok(`${locale}: dış adresler benzersiz`, dupes.length === 0, dupes.slice(0, 5).join("; "));

  // 2) Geri dönüş: dış adres → iç yol → aynı dış adres.
  const broken = internal.filter((p, i) => internalPath(localized[i], locale) !== p);
  ok(`${locale}: dış → iç geri dönüş`, broken.length === 0, broken.slice(0, 5).join(", "));

  // 3) İç yol o dilde başka bir sayfanın dış adresi olmasın (proxy onu
  //    yönlendirmek yerine yanlış sayfaya yazardı).
  const shadow = internal.filter((p) => {
    const owner = seen.get(p);
    return owner !== undefined && owner !== p;
  });
  ok(`${locale}: iç yol başka sayfanın adresiyle çakışmıyor`, shadow.length === 0, shadow.slice(0, 5).join(", "));

  // 4) Sorgu ve çapa korunuyor, önek/kök değişmiyor.
  ok(`${locale}: sorgu ve çapa korunuyor`, localizePath("/fransa/paris?a=1#sss", locale).endsWith("?a=1#sss"));
  ok(`${locale}: kök yol değişmiyor`, localizePath("/", locale) === "/" && internalPath("/", locale) === "/");

  // 5) Yalnız adresleri çevrilen dillerde değişiklik var; Türkçede iç yol = dış adres.
  const changes = localized.filter((p, i) => p !== internal[i]).length;
  const expectChanges = (SLUG_LOCALES as readonly string[]).includes(locale);
  ok(`${locale}: ${expectChanges ? "adresler çevriliyor" : "adresler iç yolla aynı"}`, expectChanges ? changes > 0 : changes === 0, `${changes} değişen`);

  // 6) Slug biçimi.
  const bad = localized.filter((p) => !/^(\/[a-z0-9]+(-[a-z0-9]+)*)+$/.test(p));
  ok(`${locale}: slug biçimi (küçük harf, tire)`, bad.length === 0, bad.slice(0, 5).join(", "));
}

// 6b) Uygulama paketi: bağlantı = dosya yolu (Capacitor uzantısız yolu kök index.html'e düşürür).
const fileCases: Array<[string, string]> = [
  ["/", "/index.html"],
  ["/mesafe", "/mesafe/index.html"],
  ["/mesafe/", "/mesafe/index.html"],
  ["/japonya/tokyo", "/japonya/tokyo/index.html"],
  ["/mesafe?x=1#y", "/mesafe/index.html?x=1#y"],
  ["/?fly=JP", "/index.html?fly=JP"],
  ["/gezi-rehberleri#japonya", "/gezi-rehberleri/index.html#japonya"],
  ["/mesafe/index.html", "/mesafe/index.html"],
  ["/img/a.png", "/img/a.png"],
  ["#cerez", "#cerez"],
  ["https://wangoh.com/x", "https://wangoh.com/x"],
  ["mailto:info@wangoh.com", "mailto:info@wangoh.com"],
  ["//cdn.example.com/x", "//cdn.example.com/x"],
];
for (const [input, want] of fileCases) {
  ok(`appFilePath(${JSON.stringify(input)})`, appFilePath(input) === want, `${appFilePath(input)} ≠ ${want}`);
}
ok(
  "appFilePath: her iç yol .../index.html olur ve stripFileIndex geri verir",
  internal.every((p) => appFilePath(p).endsWith("/index.html") && stripFileIndex(appFilePath(p)) === p),
);
ok(
  "iç yollarda nokta yok (Capacitor son parçadaki noktayı dosya sayar)",
  internal.every((p) => !p.includes(".")),
  internal.filter((p) => p.includes(".")).slice(0, 5).join(", "),
);
ok("stripFileIndex: kök", stripFileIndex("/index.html") === "/" && stripFileIndex("/tr/index.html") === "/tr");

// 7) Harita güncel: her yerin slug'ı ya listede ya da Türkçesiyle aynı.
try {
  execFileSync("npx", ["tsx", "scripts/gen-localized-slugs.ts", "--check"], { stdio: "pipe" });
  ok("slugs.gen.ts güncel", true);
} catch (e) {
  ok("slugs.gen.ts güncel", false, String((e as { stderr?: Buffer }).stderr ?? e).trim().split("\n")[0]);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
