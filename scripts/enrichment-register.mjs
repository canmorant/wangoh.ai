/**
 * data/*.json dosyalarını kayıt dosyasına (src/content/guides/enrichments/data/index.ts) yazar.
 * Yeni bir toplu dosya eklenince çalıştır:  node scripts/enrichment-register.mjs
 * (scripts/enrichment-lint.ts kayıt eskiyse hata verir.)
 */
import { readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "guides", "enrichments", "data");
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const lines = [
  "// Otomatik üretilir: node scripts/enrichment-register.mjs — elle düzenleme.",
  'import type { Enrichment } from "../index";',
  ...files.map((f, i) => `import d${i} from "./${f}";`),
  "",
  "/** Kayıtlı veri dosyaları (hepsi birleştirilir). */",
  `export const DATA_FILES = [${files.map((_, i) => `d${i}`).join(", ")}] as unknown as Record<string, Enrichment>[];`,
  "",
];
writeFileSync(join(dir, "index.ts"), lines.join("\n"));
console.log(`${files.length} dosya kaydedildi`);
