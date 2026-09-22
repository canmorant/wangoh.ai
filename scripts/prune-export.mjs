/**
 * Uygulama paketi için statik export'u budar.
 *
 * Next, her rota için istemci navigasyonunda kullanılan RSC yükünü ayrı .txt
 * dosyalarına da yazıyor: rota başına dört dosya ve bunların ikisi birebir
 * aynı. 383 rotada bu 1526 dosya ve 97 MB ham / 26 MB sıkıştırılmış yer demek.
 *
 * Uygulamada bu dosyalar kazanç sağlamıyor. Varlıklar cihazda yerel olduğu için
 * sert navigasyon zaten anında; Next, yük 404 dönünce buna kendiliğinden
 * düşüyor. Test edildi: /japonya/ → /japonya/tokyo/ geçişi .txt dosyaları
 * silinmiş hâlde doğru sayfayı açıyor.
 *
 * SADECE uygulama derlemesinde çalışır. Web tarafında bu dosyalar duruyor,
 * çünkü orada ağ üzerinden yumuşak navigasyon gerçek bir kazanç.
 *
 * Çalıştır:  node scripts/prune-export.mjs
 */
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "out");

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

let files;
try {
  files = walk(OUT);
} catch {
  console.error("out/ bulunamadı — önce `npm run build:app` çalıştırın.");
  process.exit(1);
}

const before = files.reduce((n, f) => n + statSync(f).size, 0);

// Sadece RSC yükleri; başka .txt varsa (robots gibi) dokunma.
const RSC = /(^__next\.|^index\.txt$)/;
const targets = files.filter((f) => {
  const name = f.split("/").pop();
  return name.endsWith(".txt") && RSC.test(name);
});

let freed = 0;
for (const f of targets) {
  freed += statSync(f).size;
  unlinkSync(f);
}

const after = before - freed;
const mb = (n) => (n / 1e6).toFixed(1);

console.log("\nEXPORT BUDAMA");
console.log("=".repeat(52));
console.log(`  silinen RSC yükü : ${targets.length} dosya`);
console.log(`  kazanılan        : ${mb(freed)} MB`);
console.log(`  paket            : ${mb(before)} MB → ${mb(after)} MB`);
console.log("=".repeat(52) + "\n");
