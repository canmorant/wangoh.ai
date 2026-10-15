/**
 * Kaynak dosyalardaki uzak görsel URL'lerini yerel yollarla değiştirir.
 *
 * scripts/.image-map.json dosyasını okur (images-localize.mjs üretir) ve
 * eşlenen her URL'i /images/... yoluna çevirir. Eşlenmemiş URL'lere
 * DOKUNMAZ — indirilemeyen görseller bilerek uzak kalır ki sayfa boş
 * kutuyla değil, hâlâ çalışan bir görselle yayında olsun.
 *
 * Önce prova:  node scripts/images-rewrite.mjs
 * Uygula:      node scripts/images-rewrite.mjs --apply
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MAP = join(ROOT, "scripts/.image-map.json");
const APPLY = process.argv.includes("--apply");

/**
 * Yeniden yazılmayacak dosyalar.
 *
 * imageCredits.ts içindeki URL'ler görselin kendisi değil, atfın işaret ettiği
 * KAYNAK sayfa. Onları yerel yola çevirmek lisansın istediği "kaynağa bağlantı"
 * şartını kırardı — prova bu dosyada 41 değişiklik yapmak üzereydi.
 */
const SKIP = new Set(["src/data/imageCredits.ts"]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(entry) && !SKIP.has(p.replace(ROOT, ""))) acc.push(p);
  }
  return acc;
}

const map = JSON.parse(readFileSync(MAP, "utf8"));
const urls = Object.keys(map);

console.log("\nGÖRSEL YOLU YENİDEN YAZMA\n" + "=".repeat(64));
console.log(APPLY ? "MOD: uygula\n" : "MOD: prova (yazmaz) — uygulamak için --apply\n");

let totalReplaced = 0;
const perFile = {};
const unmapped = new Map();

for (const file of walk(join(ROOT, "src"))) {
  let text = readFileSync(file, "utf8");
  const before = text;
  let count = 0;

  for (const url of urls) {
    if (!text.includes(url)) continue;
    // Tam eşleşme; URL'ler tırnak içinde tutuluyor.
    const parts = text.split(url);
    count += parts.length - 1;
    text = parts.join(map[url]);
  }

  // Değişmeden kalan uzak görselleri raporla.
  const leftover = text.match(
    /["'`](https:\/\/(?:upload\.wikimedia\.org|images\.unsplash\.com)\/[^"'`\s]+)["'`]/g
  );
  if (leftover) {
    for (const l of leftover) {
      const u = l.slice(1, -1);
      unmapped.set(u, (unmapped.get(u) || 0) + 1);
    }
  }

  if (count > 0) {
    const rel = file.replace(ROOT, "");
    perFile[rel] = count;
    totalReplaced += count;
    if (APPLY && text !== before) writeFileSync(file, text);
  }
}

for (const [f, n] of Object.entries(perFile).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${f}`);
}

console.log(`\n  değiştirilen referans : ${totalReplaced}`);
console.log(`  yerel kalan (eşlenmemiş): ${unmapped.size}`);
for (const [u, n] of unmapped) console.log(`    ×${n}  ${u}`);

if (!APPLY) console.log("\n  (hiçbir dosya yazılmadı — uygulamak için: --apply)");
console.log("\n" + "=".repeat(64) + "\n");
