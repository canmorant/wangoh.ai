/**
 * Rehber zenginleştirme verisi (src/content/guides/enrichments/data/*.json) denetimi.
 *
 *   npx tsx scripts/enrichment-lint.ts                 hepsi
 *   npx tsx scripts/enrichment-lint.ts a.json b.json   yalnız bu dosyalardaki anahtarları raporla
 *
 * Denetlenenler: şema (tr/en/es, hikâye, lezzetler, ulaşım), anahtarın gerçek bir rehbere ait
 * olması, kelime aralıkları, yasak içerik (fiyat, saat, adres/bağlantı, puan), Türkçe şehir ekleri,
 * şablon tekrarı (aynı cümle ya da başlık çok şehirde). Hata varsa çıkış kodu 1.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { GUIDES } from "../src/content/guides/index";
import { turkishAccusative, turkishDativeCase, turkishLocative } from "../src/lib/turkish";

type Block = { heading: string; body: string[] };
type Entry = { story?: Block; flavors?: Block; transport?: string[] };
type Data = Record<string, Partial<Record<"tr" | "en" | "es", Entry>>>;

const DIR = join(__dirname, "..", "src", "content", "guides", "enrichments", "data");
const LOCALES = ["tr", "en", "es"] as const;

const files = readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
{
  const registry = readFileSync(join(DIR, "index.ts"), "utf8");
  const missing = files.filter((f) => !registry.includes(`"./${f}"`));
  if (missing.length) console.log(`! kayıt eski: ${missing.length} dosya data/index.ts'te yok (node scripts/enrichment-register.mjs çalıştır): ${missing.slice(0, 4).join(", ")}…`);
}
const requested = process.argv.slice(2).map((f) => resolve(f));
const all = new Map<string, { file: string; entry: Data[string] }>();
const errors: string[] = [];
const err = (key: string, msg: string) => errors.push(`${key}: ${msg}`);
const inScope = new Set<string>();

for (const f of files) {
  const path = join(DIR, f);
  const mine = !requested.length || requested.includes(path);
  let data: Data;
  try {
    data = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    // Başka bir ajanın yazmakta olduğu dosya geçici olarak bozuk görünebilir: yalnız kendi dosyalarını raporla.
    if (mine) errors.push(`${f}: geçersiz JSON (${(e as Error).message})`);
    continue;
  }
  for (const [key, entry] of Object.entries(data)) {
    if (all.has(key) && mine) err(key, `birden fazla dosyada var (${all.get(key)!.file} ve ${f})`);
    all.set(key, { file: f, entry });
    if (mine) inScope.add(key);
  }
}

const guides = new Map(GUIDES.map((g) => [`${g.countryCode}:${g.city}`, g]));
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const blockWords = (b: Block) => b.body.reduce((n, p) => n + words(p), 0);

/* ---- yasak içerik ---- */
const FORBIDDEN: [RegExp, string][] = [
  [/[€$£₺¥]/, "para birimi simgesi"],
  [/\b\d[\d.,]*\s?(TL|EUR|USD|GBP|lira|euro|dolar|dollars?|euros?|pounds?|libras?)\b/i, "fiyat"],
  [/\b([01]?\d|2[0-3])[:.][0-5]\d\b/, "saat (ss:dd)"],
  [/\b(saat|hours?|horas?)\s+\d/i, "çalışma saati"],
  [/https?:|www\.|@\w+\.\w+/i, "bağlantı / e-posta"],
  [/\+\d{2}[\s\d-]{6,}/, "telefon"],
  [/\b(yıldız(lı)?|michelin|tripadvisor|rating|stars?|estrellas?|puanı|reseñas?|reviews?)\b/i, "puan / yıldız / değerlendirme"],
  [/\*\*|^#|\n/m, "biçimlendirme işareti ya da satır sonu"],
];

/* ---- Türkçe şehir ekleri ---- */
function allowedSuffixes(city: string): Set<string> {
  const after = (s: string) => s.slice(city.length + 1);
  const loc = after(turkishLocative(city));
  const dat = after(turkishDativeCase(city));
  const acc = after(turkishAccusative(city));
  const gen = acc.startsWith("y") ? `n${acc.slice(1)}n` : `${acc}n`;
  const abl = `${loc}n`;
  return new Set([loc, dat, acc, gen, abl]);
}
function checkSuffixes(key: string, city: string, label: string, text: string) {
  const ok = allowedSuffixes(city);
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?<![\\p{L}])${escaped}['’]([\\p{L}]+)`, "gu");
  for (const m of text.matchAll(re)) {
    if (!ok.has(m[1])) err(key, `${label}: "${city}'${m[1]}" yanlış ek; beklenen ${[...ok].map((s) => `'${s}`).join(" ")}`);
  }
}

/* ---- şablon tekrarı ---- */
const sentenceCount = new Map<string, Set<string>>();
const headingCount = new Map<string, Set<string>>();
const norm = (s: string, city: string) => s.replaceAll(city, "{C}").toLowerCase().replace(/\s+/g, " ").trim();
for (const [key, { entry }] of all) {
  const city = key.slice(key.indexOf(":") + 1);
  for (const loc of LOCALES) {
    const e = entry[loc];
    if (!e) continue;
    for (const p of [...(e.story?.body ?? []), ...(e.flavors?.body ?? []), ...(e.transport ?? [])]) {
      for (const s of p.split(/(?<=[.!?])\s+/)) {
        if (s.length < 30) continue;
        const k = `${loc}|${norm(s, city)}`;
        sentenceCount.set(k, (sentenceCount.get(k) ?? new Set()).add(key));
      }
    }
    for (const h of [e.story?.heading, e.flavors?.heading]) {
      if (!h) continue;
      const k = `${loc}|${norm(h, city)}`;
      headingCount.set(k, (headingCount.get(k) ?? new Set()).add(key));
    }
  }
}

for (const key of inScope) {
  const { entry } = all.get(key)!;
  const guide = guides.get(key);
  if (!guide) {
    err(key, "bu anahtarla rehber yok");
    continue;
  }
  const city = guide.city;
  for (const loc of LOCALES) {
    const e = entry[loc];
    if (!e) {
      err(key, `${loc} eksik`);
      continue;
    }
    for (const [name, block, min, max] of [
      ["story", e.story, 60, 230],
      ["flavors", e.flavors, 55, 200],
    ] as const) {
      if (!block || typeof block.heading !== "string" || !Array.isArray(block.body)) {
        err(key, `${loc}.${name} eksik ya da biçimi yanlış`);
        continue;
      }
      if (block.heading.length < 18 || block.heading.length > 95) err(key, `${loc}.${name}.heading uzunluğu ${block.heading.length} (18–95)`);
      const w = blockWords(block);
      if (w < min || w > max) err(key, `${loc}.${name} ${w} kelime (${min}–${max})`);
      if (block.body.length < 1 || block.body.length > 3) err(key, `${loc}.${name} ${block.body.length} paragraf (1–3)`);
      for (const p of block.body) {
        const pw = words(p);
        if (pw < 20 || pw > 130) err(key, `${loc}.${name} paragraf ${pw} kelime (20–130)`);
      }
    }
    if (e.transport) {
      const tw = e.transport.reduce((n, p) => n + words(p), 0);
      if (tw < 25 || tw > 130 || e.transport.length > 2) err(key, `${loc}.transport ${tw} kelime / ${e.transport.length} paragraf (25–130, en çok 2)`);
    }
    const texts: [string, string][] = [
      [`${loc}.story.heading`, e.story?.heading ?? ""],
      [`${loc}.flavors.heading`, e.flavors?.heading ?? ""],
      ...(e.story?.body ?? []).map((t, i) => [`${loc}.story[${i}]`, t] as [string, string]),
      ...(e.flavors?.body ?? []).map((t, i) => [`${loc}.flavors[${i}]`, t] as [string, string]),
      ...(e.transport ?? []).map((t, i) => [`${loc}.transport[${i}]`, t] as [string, string]),
    ];
    for (const [label, text] of texts) {
      for (const [re, what] of FORBIDDEN) if (re.test(text)) err(key, `${label}: yasak içerik (${what}): "${text.slice(0, 70)}…"`);
      if (loc === "tr") checkSuffixes(key, city, label, text);
      if (loc !== "tr" && /[ğşıİĞŞ]/.test(text)) {
        const m = text.match(/\S*[ğşıİĞŞ]\S*/g);
        err(key, `${label}: ${loc} metninde Türkçe harf: ${m?.slice(0, 3).join(", ")}`);
      }
    }
    // Aynı cümle ya da başlık 3+ şehirde → şablon.
    for (const [label, text] of texts) {
      const isHeading = label.endsWith(".heading");
      const parts = isHeading ? [text] : text.split(/(?<=[.!?])\s+/).filter((s) => s.length >= 30);
      for (const s of parts) {
        const k = `${loc}|${norm(s, city)}`;
        const n = (isHeading ? headingCount : sentenceCount).get(k)?.size ?? 0;
        if (n >= (isHeading ? 3 : 2)) err(key, `${label}: aynı ${isHeading ? "başlık" : "cümle"} ${n} şehirde: "${s.slice(0, 80)}"`);
      }
    }
  }
}

const checked = inScope.size;
if (errors.length) {
  console.log(errors.join("\n"));
  console.log(`\n✗ ${errors.length} hata (${checked} şehir denetlendi)`);
  process.exit(1);
}
console.log(`✓ ${checked} şehir temiz (tr, en, es; ${all.size} şehir kayıtlı)`);
