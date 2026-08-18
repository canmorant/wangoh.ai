import fs from "node:fs";
import vm from "node:vm";
import zlib from "node:zlib";

const manifestPath = ".next/server/app/page_client-reference-manifest.js";
const buildManifestPath = ".next/server/app/page/build-manifest.json";

if (!fs.existsSync(manifestPath) || !fs.existsSync(buildManifestPath)) {
  throw new Error("Önce npm run build çalıştırılmalı.");
}

const context = { globalThis: {} };
vm.runInNewContext(fs.readFileSync(manifestPath, "utf8"), context);

const pageManifest = context.globalThis.__RSC_MANIFEST?.["/page"];
if (!pageManifest) throw new Error("Ana sayfa istemci manifesti bulunamadı.");

const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, "utf8"));
const entryFiles = [
  ...buildManifest.rootMainFiles,
  ...pageManifest.entryJSFiles["[project]/src/app/layout"],
  ...pageManifest.entryJSFiles["[project]/src/app/page"],
];
const uniqueFiles = [...new Set(entryFiles)];
const sizes = uniqueFiles.map((relativePath) => {
  const contents = fs.readFileSync(`.next/${relativePath}`);
  return {
    file: relativePath,
    raw: contents.length,
    gzip: zlib.gzipSync(contents).length,
  };
});

const totalRaw = sizes.reduce((total, item) => total + item.raw, 0);
const totalGzip = sizes.reduce((total, item) => total + item.gzip, 0);
const largest = sizes.reduce((current, item) => (item.raw > current.raw ? item : current));

const limits = {
  totalRaw: 900_000,
  totalGzip: 300_000,
  largestInitialChunk: 300_000,
};

if (totalRaw > limits.totalRaw) {
  throw new Error(`Ana sayfa başlangıç JS bütçesi aşıldı: ${totalRaw} bayt.`);
}
if (totalGzip > limits.totalGzip) {
  throw new Error(`Ana sayfa sıkıştırılmış JS bütçesi aşıldı: ${totalGzip} bayt.`);
}
if (largest.raw > limits.largestInitialChunk) {
  throw new Error(`Başlangıç paketinde aşırı büyük parça var: ${largest.file} (${largest.raw} bayt).`);
}

console.log(
  `✓ Ana sayfa JS bütçesi: ${(totalRaw / 1024).toFixed(1)} KiB ham, ${(totalGzip / 1024).toFixed(1)} KiB gzip; en büyük parça ${(largest.raw / 1024).toFixed(1)} KiB.`
);
