/**
 * Uygulama paketinin kök kabuğu: out/index.html.
 *
 * Neden gerekli
 * -------------
 * Capacitor'un yerel sunucusu (iOS Router.swift, Android WebViewLocalServer)
 * uzantısız HER yola, hangi dizin olursa olsun, KÖK index.html'i döndürüyor.
 * Statik export ise sayfaları out/tr/... altında üretiyor ve kökte index.html
 * bırakmıyor. Sonuç: uygulama açılışta (`/`) hiçbir şey bulamıyor; bulsa bile
 * `/tr/mesafe/` gibi uzantısız her adres ana kabuğu gösterir, sayfayı değil.
 *
 * İki önlem birlikte çalışıyor:
 *   1. Uygulama derlemesindeki bağlantılar `/tr/mesafe/index.html` gibi
 *      UZANTILI dosya yoludur (bkz. src/i18n/navigation.ts); sunucu bunları
 *      doğrudan dosya olarak okur, yönlendirmeye gerek kalmaz.
 *   2. Bu kabuk açılış (`/`) ve kaçak uzantısız adresler içindir: doğru
 *      dosya yoluna `location.replace` ile geçer. Dahili bir bağlantı
 *      kaçırılmışsa bile (içerikte elle yazılmış `/mesafe/` vb.) kullanıcı
 *      doğru sayfaya, en kötü ihtimalle ana sayfaya düşer; 404'te kalmaz.
 *
 * Kabuk YÖNLENDİRME DÖNGÜSÜ kurmamalı: Capacitor `/tr/` isteğine de bu dosyayı
 * döndürdüğü için hedef daima uzantılı bir dosya (`.../index.html`) olur.
 *
 * `shellTarget` saf bir fonksiyon: aynı kod hem kabuğa gömülüyor hem
 * validate-app-export.mjs'te sınanıyor.
 *
 * Çalıştır:  node scripts/app-shell.mjs   (build:app sonunda otomatik)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_LOCALE = "tr";
export const APP_HOME = `/${APP_LOCALE}/index.html`;
const BACKGROUND = "#0a0e1a";

/**
 * location.pathname → açılacak dosya yolu (daima uzantılı).
 * Kendi içinde bağımsız olmalı (toString ile kabuğa gömülüyor).
 *
 *   "/"                → "/tr/index.html"
 *   "/tr/"             → "/tr/index.html"
 *   "/tr/mesafe/"      → "/tr/mesafe/index.html"
 *   "/mesafe"          → "/tr/mesafe/index.html"   (dil öneki eksik)
 *   "/tr/japonya/tokyo/index.html" → aynen
 */
export function shellTarget(pathname) {
  var p = String(pathname || "/").replace(/\/{2,}/g, "/");
  var clean = p.replace(/\/index\.html$/, "").replace(/\/+$/, "");
  if (clean === "") return "/tr/index.html";
  if (clean !== "/tr" && clean.indexOf("/tr/") !== 0) clean = "/tr" + clean;
  return clean + "/index.html";
}

export function shellHtml() {
  return `<!doctype html>
<html lang="${APP_LOCALE}" data-app-shell style="background:${BACKGROUND}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="${BACKGROUND}">
<meta name="color-scheme" content="dark">
<title>Wangoh</title>
<style>
html,body{margin:0;height:100%;background:${BACKGROUND};color:rgba(255,255,255,.7);font:15px/1.5 system-ui,-apple-system,sans-serif}
body{display:flex;align-items:center;justify-content:center}
a{color:rgba(255,255,255,.85);opacity:0;animation:late 0s 2.5s forwards}
@keyframes late{to{opacity:1}}
</style>
<noscript><meta http-equiv="refresh" content="0;url=${APP_HOME}"><style>a{opacity:1;animation:none}</style></noscript>
<script>
(function () {
  var shellTarget = ${shellTarget.toString()};
  var file = shellTarget(location.pathname);
  var to = file + location.search + location.hash;
  var atEntry = location.pathname === "/" || location.pathname === "/index.html";
  function go(u) { location.replace(u); }
  if (atEntry || !window.fetch) return go(to);
  // Hedef dosya paketten yoksa (eski bir adres) 404'te kalma, ana sayfayı aç.
  fetch(file, { method: "HEAD", cache: "no-store" }).then(
    function (r) { go(r.status === 404 ? "${APP_HOME}" : to); },
    function () { go(to); }
  );
})();
</script>
</head>
<body><a href="${APP_HOME}">Wangoh</a></body>
</html>
`;
}

/** out/index.html'i yazar. */
export function writeShell(outDir) {
  const file = join(outDir, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, shellHtml());
  return file;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = fileURLToPath(new URL("../out", import.meta.url));
  try {
    const file = writeShell(out);
    console.log(`UYGULAMA KABUĞU: ${file}`);
  } catch (e) {
    console.error("out/ yazılamadı — önce `npm run build:app` çalıştırın.", e);
    process.exit(1);
  }
}
