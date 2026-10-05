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
  const nonWebChange = (path) =>
    /^(ios|android|docs|reports|\.claude|\.codex)\//.test(path) ||
    /^[^/]+\.md$/i.test(path) ||
    /^capacitor\.config\./.test(path);
  const skip = paths.every(nonWebChange);
  console.log(skip ? "Skipping: only documentation or native app changes." : "Building: website changes detected.");
  process.exit(skip ? 0 : 1);
} catch {
  console.log("Building: previous deployment cannot be compared safely.");
  process.exit(1);
}
