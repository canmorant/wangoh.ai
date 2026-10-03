/**
 * İçerik çevirisi iş akışı (rehberler, ülke sayfaları, beslenme, destinasyonlar).
 *
 *   npx tsx scripts/content-i18n.ts status
 *       Grup ve dil başına çevrilmiş/eksik metin sayısı.
 *
 *   npx tsx scripts/content-i18n.ts extract <grup> <azami-karakter> <çıktı> [kapsam,...]
 *       Henüz çevrilmemiş metinleri bir iş dosyasına yazar:
 *         @<anahtar> [kapsam]
 *         <Türkçe metin>
 *       Kapsam verilirse (ör. "JP:Tokyo,JP:Kyoto") yalnız o sayfaların metinleri.
 *
 *   npx tsx scripts/content-i18n.ts merge <çeviri-dosyası>
 *       Çeviri dosyasını src/content/i18n/tm/<dil>.json'a işler:
 *         @<anahtar>
 *         en: …
 *         de: …
 *         ru: …
 *         es: …
 *         fr: …
 *       Denetimler: bilinmeyen anahtar, eksik dil, **kalın** işaret sayısı,
 *       kaynaktaki sayıların çeviride bulunması (uyarı).
 *
 *   npx tsx scripts/content-i18n.ts prune
 *       Kaynağı artık olmayan (Türkçesi değişmiş/silinmiş) çevirileri temizler.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { collectSources, type SourceGroup, type SourceText } from "../src/content/i18n/sources";

const LOCALES = ["en", "de", "ru", "es", "fr"] as const;
type Locale = (typeof LOCALES)[number];
type Memory = Record<string, Record<string, string>>;

const TM_DIR = join(__dirname, "..", "src", "content", "i18n", "tm");
const loadTm = (l: Locale): Memory => JSON.parse(readFileSync(join(TM_DIR, `${l}.json`), "utf8"));
const saveTm = (l: Locale, tm: Memory) => {
  const sorted: Memory = {};
  for (const group of Object.keys(tm).sort()) {
    sorted[group] = Object.fromEntries(Object.entries(tm[group]).sort(([a], [b]) => a.localeCompare(b)));
  }
  writeFileSync(join(TM_DIR, `${l}.json`), JSON.stringify(sorted, null, 1) + "\n");
};
const has = (tm: Memory, key: string) => Object.values(tm).some((g) => key in g);

/** Fransız dizgisi: : ; ? ! » öncesi ve « sonrası bölünmez boşluk, tipografik kesme. */
const frenchTypography = (s: string) =>
  s
    .replace(/'/g, "’")
    .replace(/ ([:;?!»])/g, " $1")
    .replace(/« /g, "« ");

const numbersIn = (s: string) => (s.match(/\d+/g) ?? []).sort().join(",");

const [command, ...args] = process.argv.slice(2);
const sources = collectSources();

if (command === "status") {
  const tms = Object.fromEntries(LOCALES.map((l) => [l, loadTm(l)])) as Record<Locale, Memory>;
  const groups: SourceGroup[] = ["destinations", "hubs", "dietary", "guides"];
  for (const group of groups) {
    const items = [...sources.values()].filter((s) => s.group === group);
    const chars = items.reduce((a, s) => a + s.text.length, 0);
    const cols = LOCALES.map((l) => {
      const done = items.filter((s) => has(tms[l], s.key));
      return `${l} ${done.length}/${items.length}`;
    });
    const pending = items.filter((s) => LOCALES.some((l) => !has(tms[l], s.key)));
    console.log(
      `${group.padEnd(13)} ${cols.join("  ")}   bekleyen ${pending.length} metin / ${pending.reduce((a, s) => a + s.text.length, 0)} kr (toplam ${chars})`
    );
  }
} else if (command === "extract") {
  const [group, maxChars, out, scopes] = args;
  const wanted = scopes ? new Set(scopes.split(",")) : null;
  const tms = LOCALES.map(loadTm);
  const pending: SourceText[] = [];
  let total = 0;
  for (const s of sources.values()) {
    if (s.group !== group) continue;
    if (wanted && ![...s.scopes].some((sc) => wanted.has(sc))) continue;
    if (tms.every((tm) => has(tm, s.key))) continue;
    if (total + s.text.length > Number(maxChars) && pending.length > 0) break;
    pending.push(s);
    total += s.text.length;
  }
  const body = pending.map((s) => `@${s.key} [${[...s.scopes].slice(0, 3).join(" ")}]\n${s.text}`).join("\n\n");
  writeFileSync(out, `# ${group} — ${pending.length} metin, ${total} karakter\n\n${body}\n`);
  console.log(`${out}: ${pending.length} metin, ${total} karakter`);
} else if (command === "merge") {
  const text = readFileSync(args[0], "utf8");
  const tms = Object.fromEntries(LOCALES.map((l) => [l, loadTm(l)])) as Record<Locale, Memory>;
  const errors: string[] = [];
  const warnings: string[] = [];
  let merged = 0;
  for (const block of text.split(/^@/m).slice(1)) {
    const [head, ...lines] = block.split("\n");
    const key = head.trim().split(/\s/)[0];
    const source = sources.get(key);
    if (!source) {
      errors.push(`${key}: bilinmeyen anahtar`);
      continue;
    }
    const tr: Partial<Record<Locale, string>> = {};
    for (const line of lines) {
      const m = line.match(/^(en|de|ru|es|fr): (.*)$/);
      if (m) tr[m[1] as Locale] = m[2].trim();
    }
    const missing = LOCALES.filter((l) => !tr[l]);
    if (missing.length) {
      errors.push(`${key}: eksik dil ${missing.join(",")}`);
      continue;
    }
    const bolds = (s: string) => (s.match(/\*\*/g) ?? []).length;
    for (const l of LOCALES) {
      let value = tr[l]!;
      if (l === "fr") value = frenchTypography(value);
      if (bolds(value) !== bolds(source.text)) errors.push(`${key} ${l}: **kalın** işaret sayısı farklı`);
      if (numbersIn(value) !== numbersIn(source.text)) {
        warnings.push(`${key} ${l}: sayılar farklı (${numbersIn(source.text)} → ${numbersIn(value)})`);
      }
      tms[l][source.group] ??= {};
      tms[l][source.group][key] = value;
    }
    merged++;
  }
  if (errors.length) {
    console.log("HATA — hiçbir şey yazılmadı:\n  " + errors.join("\n  "));
    process.exit(1);
  }
  for (const l of LOCALES) saveTm(l, tms[l]);
  console.log(`${merged} metin işlendi`);
  if (warnings.length) console.log(`${warnings.length} uyarı:\n  ` + warnings.slice(0, 40).join("\n  "));
} else if (command === "prune") {
  for (const l of LOCALES) {
    const tm = loadTm(l);
    let removed = 0;
    for (const group of Object.keys(tm)) {
      for (const key of Object.keys(tm[group])) {
        if (!sources.has(key)) {
          delete tm[group][key];
          removed++;
        }
      }
    }
    saveTm(l, tm);
    console.log(`${l}: ${removed} eski çeviri silindi`);
  }
} else {
  console.log("komutlar: status | extract | merge | prune  (ayrıntı dosyanın başında)");
}
