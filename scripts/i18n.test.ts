/**
 * Çeviri dosyaları — dil tutarlılığı ve ICU sözdizimi.
 * Run:  npx tsx scripts/i18n.test.ts
 *
 * messages/tr.json kaynak kabul edilir. Diğer her dil:
 *   - aynı anahtar setine sahip olmalı (eksik/fazla yok, boş değer yok),
 *   - her mesajda aynı adlı ICU argümanlarını kullanmalı ({city}, {count}…),
 *   - intl-messageformat ile hatasız biçimlenmeli ve çıktıda kaçış hatasından
 *     kalma ham sözdizimi ("{", "<link>") kalmamalı. ICU'da ' kaçış karakteri:
 *     "d'<link>" gibi bir yazım etiketi metne çevirir, bu test onu yakalar.
 *
 * Ayrıca istemciye giden namespace listesinin ("use client" bileşenlerin
 * kullandıkları) ve tip kontrolünü atlayan TravelTest anahtarlarının
 * gerçekten var olduğu denetleniyor.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { IntlMessageFormat } from "intl-messageformat";
import { parse, TYPE, type MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import { LOCALES } from "../src/i18n/routing";
import { collectSources } from "../src/content/i18n/sources";
import { CLIENT_NAMESPACES } from "../src/i18n/clientMessages";

let pass = 0;
let fail = 0;
const ok = (n: string, c: boolean, d = "") => {
  if (c) pass++;
  else fail++;
  if (!c || process.env.VERBOSE) console.log(`${c ? "  PASS" : "  FAIL"}  ${n}${d ? `  — ${d}` : ""}`);
};

const ROOT = join(__dirname, "..");
type Tree = { [key: string]: string | Tree };
const load = (locale: string): Tree =>
  JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));

const flatten = (tree: Tree, prefix = "", out: Record<string, string> = {}) => {
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else flatten(v, key, out);
  }
  return out;
};

/** Mesajın kullandığı argüman adları ve türleri: {count, plural} → count:plural */
function argumentsOf(elements: MessageFormatElement[], out = new Set<string>()): Set<string> {
  for (const el of elements) {
    if (el.type === TYPE.argument) out.add(`${el.value}:arg`);
    else if (el.type === TYPE.number) out.add(`${el.value}:number`);
    else if (el.type === TYPE.plural || el.type === TYPE.select) {
      out.add(`${el.value}:${el.type === TYPE.plural ? "plural" : "select"}`);
      for (const opt of Object.values(el.options)) argumentsOf(opt.value, out);
    } else if (el.type === TYPE.tag) {
      out.add(`<${el.value}>`);
      argumentsOf(el.children, out);
    }
  }
  return out;
}

/** Biçimleme için örnek değerler: sayı isteyen argümana sayı, diğerine metin. */
function sampleValues(args: Set<string>) {
  const values: Record<string, unknown> = {};
  for (const a of args) {
    if (a.startsWith("<")) {
      const tag = a.slice(1, -1);
      values[tag] = (chunks: string[]) => `[${tag}:${chunks.join("")}]`;
      continue;
    }
    const [name, kind] = a.split(":");
    values[name] = kind === "plural" || kind === "number" ? 3 : `«${name}»`;
  }
  return values;
}

/**
 * Karşılaştırma yalnızca argüman ADLARI üzerinden: Türkçede sayıdan sonra
 * çoğul eki gerekmediği için "{count} şehir" düz argüman, diğer dillerde aynı
 * argüman {count, plural, …}. Tür farkı meşru, ad farkı hata.
 */
const argNames = (args: Set<string>) =>
  [...new Set([...args].map((a) => a.split(":")[0]))].sort().join(" ");

const source = flatten(load("tr"));
const sourceArgs = Object.fromEntries(
  Object.entries(source).map(([k, v]) => [k, argNames(argumentsOf(parse(v)))])
);

console.log("\nI18N MESSAGES\n" + "=".repeat(64));
console.log(`${Object.keys(source).length} keys in tr (source)\n`);

for (const locale of LOCALES) {
  const flat = flatten(load(locale));
  const missing = Object.keys(source).filter((k) => !(k in flat));
  const extra = Object.keys(flat).filter((k) => !(k in source));
  const empty = Object.keys(flat).filter((k) => !flat[k].trim());
  ok(`${locale}: no missing keys`, missing.length === 0, missing.slice(0, 5).join(", "));
  ok(`${locale}: no extra keys`, extra.length === 0, extra.slice(0, 5).join(", "));
  ok(`${locale}: no empty messages`, empty.length === 0, empty.slice(0, 5).join(", "));

  const parseErrors: string[] = [];
  const argMismatch: string[] = [];
  const formatErrors: string[] = [];
  const leftovers: string[] = [];
  for (const [key, message] of Object.entries(flat)) {
    let args: Set<string>;
    try {
      args = argumentsOf(parse(message));
    } catch (e) {
      parseErrors.push(`${key}: ${(e as Error).message}`);
      continue;
    }
    if (key in sourceArgs && argNames(args) !== sourceArgs[key]) {
      argMismatch.push(`${key} (${argNames(args)} ≠ ${sourceArgs[key]})`);
    }
    try {
      const out = new IntlMessageFormat(message, locale).format(sampleValues(args));
      const text = Array.isArray(out) ? out.join("") : String(out);
      if (/[{}<>]/.test(text)) leftovers.push(`${key}: ${text}`);
    } catch (e) {
      formatErrors.push(`${key}: ${(e as Error).message}`);
    }
  }
  ok(`${locale}: every message parses as ICU`, parseErrors.length === 0, parseErrors.slice(0, 3).join(" | "));
  ok(`${locale}: same ICU arguments as tr`, argMismatch.length === 0, argMismatch.slice(0, 3).join(" | "));
  ok(`${locale}: every message formats`, formatErrors.length === 0, formatErrors.slice(0, 3).join(" | "));
  ok(`${locale}: no raw syntax left after formatting`, leftovers.length === 0, leftovers.slice(0, 3).join(" | "));
}

/* -------- istemciye giden namespace'ler (i18n/clientMessages.tsx) -------- */
{
  const listed = new Set<string>(Object.values(CLIENT_NAMESPACES).flat());
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []
    );
  const used = new Set<string>();
  for (const file of walk(join(ROOT, "src"))) {
    const code = readFileSync(file, "utf8");
    if (!/^\s*["']use client["']/.test(code)) continue;
    for (const m of code.matchAll(/useTranslations\(\s*"(\w+)/g)) used.add(m[1]);
    // Kök çevirmen (useTranslations()) "Nav.tests" gibi tam anahtar kullanır.
    if (/useTranslations\(\s*\)/.test(code)) {
      for (const m of code.matchAll(/\bt\(\s*"([A-Z]\w+)\./g)) used.add(m[1]);
    }
  }
  // İstemci bileşeni içinde render edilen sunucu-uyumlu bileşenler.
  used.add("Footer"); // SiteFooter → HomeExperience
  const notSent = [...used].filter((ns) => !listed.has(ns));
  const unknown = [...listed].filter((ns) => !(ns in load("tr")));
  ok("client namespaces are sent to the browser", notSent.length === 0, notSent.join(", "));
  ok("CLIENT_NAMESPACES only names real namespaces", unknown.length === 0, unknown.join(", "));
}

/* --------- TravelTest: dinamik anahtarlar tip kontrolünden kaçıyor --------- */
{
  const code = readFileSync(join(ROOT, "src/components/TravelTest.tsx"), "utf8");
  const block = code.slice(code.indexOf("const QUESTIONS"), code.indexOf("];", code.indexOf("const QUESTIONS")));
  const questions = [...block.matchAll(/^\s{4}id: "(\w+)",[\s\S]*?options: \[([\s\S]*?)\]/gm)].map((m) => ({
    id: m[1],
    options: [...m[2].matchAll(/id: "(\w+)"/g)].map((o) => o[1]),
  }));
  ok("TravelTest questions found in source", questions.length === 5, `${questions.length}`);
  for (const locale of LOCALES) {
    const flat = flatten(load(locale));
    const absent = questions.flatMap((q) =>
      [`TravelTest.questions.${q.id}.kicker`, `TravelTest.questions.${q.id}.prompt`].concat(
        q.options.flatMap((o) => [
          `TravelTest.questions.${q.id}.options.${o}.label`,
          `TravelTest.questions.${q.id}.options.${o}.note`,
        ])
      ).filter((k) => !(k in flat))
    );
    ok(`${locale}: every TravelTest question/option has text`, absent.length === 0, absent.slice(0, 3).join(", "));
  }
}

/* ------------------------ içerik çeviri belleği ------------------------ */
{
  // İstemci bileşenleri megabaytlık belleği ya da kaynak toplayıcıyı içe
  // aktarmamalı; ihtiyaç duydukları metinler sunucudan prop olarak iner.
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []
    );
  const leaking = walk(join(ROOT, "src"))
    .filter((f) => /^\s*["']use client["']/.test(readFileSync(f, "utf8")))
    .filter((f) => /from "@\/content\/(localized|i18n\/(memory|sources))"/.test(readFileSync(f, "utf8")));
  ok("client components don't import the translation memory", leaking.length === 0, leaking.join(", "));

  const sources = collectSources();
  for (const locale of LOCALES.filter((l) => l !== "tr")) {
    const tm = JSON.parse(readFileSync(join(ROOT, "src/content/i18n/tm", `${locale}.json`), "utf8")) as Record<
      string,
      Record<string, string>
    >;
    const keys = Object.values(tm).flatMap((g) => Object.keys(g));
    const stale = keys.filter((k) => !sources.has(k));
    const empty = Object.values(tm).flatMap((g) => Object.entries(g)).filter(([, v]) => !v.trim());
    ok(`${locale}: content translations all belong to current Turkish texts`, stale.length === 0, `${stale.length} eski (npx tsx scripts/content-i18n.ts prune)`);
    ok(`${locale}: no empty content translations`, empty.length === 0, empty.slice(0, 3).map(([k]) => k).join(", "));
    const keySet = new Set(keys);
    const done = [...sources.values()].filter((src) => keySet.has(src.key)).length;
    console.log(`  info  ${locale}: içerik çevirisi ${done}/${sources.size}`);
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
