import { execFileSync } from "node:child_process";

// Vercel: 0 yayını atlar, 1 derlemeyi başlatır. Karşılaştırma başarısızsa
// derle: son commit yerine son başarılı yayın baz alınır, aradaki değişiklikler
// (özellikle daha önce atlanan commit'ler) kaybolmaz.
const previous = process.env.VERCEL_GIT_PREVIOUS_SHA;
const current = process.env.VERCEL_GIT_COMMIT_SHA;
if (!previous || !current) process.exit(1);

try {
  const paths = execFileSync("git", ["diff", "--no-renames", "--name-only", "-z", previous, current], {
    encoding: "utf8",
  }).split("\0").filter(Boolean);
  // Monorepo: yalnız mobil uygulamayı (apps/mobile), API'yi (apps/api) ve dokümantasyonu
  // ilgilendiren değişiklikler web yayınını tetiklemez. Kök yapılandırma ve bağımlılık
  // dosyaları (package.json, pnpm-lock.yaml, pnpm-workspace.yaml, turbo.json ...),
  // ortak paketler (packages/*, web onları kaynak olarak derler) ve apps/web altındaki
  // her şey derlemeyi tetikler.
  const nonWebChange = (path) =>
    /^apps\/(mobile|api)\//.test(path) ||
    /^(docs|reports|\.claude|\.codex)\//.test(path) ||
    /^apps\/web\/docs\//.test(path) ||
    /^[^/]+\.md$/i.test(path) ||
    /^apps\/[^/]+\/[^/]+\.md$/i.test(path);
  const skip = paths.every(nonWebChange);
  console.log(skip ? "Skipping: only documentation or mobile app changes." : "Building: website changes detected.");
  process.exit(skip ? 0 : 1);
} catch {
  console.log("Building: previous deployment cannot be compared safely.");
  process.exit(1);
}
