/**
 * Uygulama paketini (out/) Capacitor'un yerel sunucusu gibi sunan küçük
 * Node sunucusu. `validate-app-export.mjs` ve elle denemeler için.
 *
 * Neden var: cihazda ne olacağını emülatörsüz öğrenmek gerekiyor. Capacitor'un
 * kendi kaynağı okunduğunda iki yerel sunucunun da aynı kuralı uyguladığı
 * görülüyor (node_modules/@capacitor/ios/Capacitor/Capacitor/Router.swift ve
 * node_modules/@capacitor/android/.../WebViewLocalServer.java):
 *
 *   - Yolun son parçasında nokta (uzantı) YOKSA, istek hangi yola gelirse
 *     gelsin KÖK index.html döner ("SPA yönlendirmesi"). `/tr/mesafe/` bile.
 *   - Uzantılı yol ise dosya olarak okunur; yoksa 404.
 *   - Dizin → dizin/index.html eşlemesi YOK.
 *
 * İki kip:
 *   capacitor  Yukarıdaki kural. Varsayılan; uygulamanın gerçek davranışı.
 *   plain      Sıradan statik sunucu: dizin → index.html, olmayan → 404
 *              (vercel/serve/nginx gibi). Paket iki kipte de çalışmalı.
 *
 * Elle çalıştırma:
 *   node scripts/app-server.mjs [--mode capacitor|plain] [--port 3501] [--dir out]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

/** Android Uri.getLastPathSegment(): sondaki "/" yok sayılır. */
function lastSegment(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

/**
 * İstek yolu bir DOSYA isteği mi? iOS: pathExtension boş değilse; Android:
 * son parçada nokta varsa. İkisi ayrışan uç durumlar ("a.", ".a") gerçek
 * cihazda platformlara göre farklı davrandığı için dosya sayılmaz ve 404 olur;
 * böyle bir adres paketten çıkmamalı.
 */
function classify(pathname) {
  if (pathname === "/") return "root";
  const last = lastSegment(pathname);
  const ext = extname(last);
  if (ext && last.includes(".")) return "file";
  if (!last.includes(".")) return "spa";
  return "ambiguous";
}

async function readIfFile(file) {
  try {
    const s = await stat(file);
    if (!s.isFile()) return null;
    return { body: await readFile(file), size: s.size };
  } catch {
    return null;
  }
}

/**
 * @param {{ root: string, mode?: "capacitor"|"plain", port?: number, host?: string }} opts
 * @returns {Promise<{ port: number, url: string, close: () => Promise<void>, log: Array<{method:string,path:string,status:number,served:string}> }>}
 */
export async function startAppServer({ root, mode = "capacitor", port = 0, host = "127.0.0.1" }) {
  const base = resolve(root);
  const log = [];

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      pathname = url.pathname;
    }
    const send = (status, body, type, served) => {
      log.push({ method: req.method ?? "GET", path: url.pathname + url.search, status, served });
      res.writeHead(status, {
        "Content-Type": type,
        "Content-Length": body.length,
        "Cache-Control": "no-cache",
      });
      res.end(req.method === "HEAD" ? undefined : body);
    };
    const notFound = (why) =>
      send(404, Buffer.from(`404 ${why}`), "text/plain; charset=utf-8", "404");

    if (req.method !== "GET" && req.method !== "HEAD") return notFound("method");

    const abs = normalize(join(base, pathname));
    if (abs !== base && !abs.startsWith(base + sep)) return notFound("outside");

    if (mode === "capacitor") {
      const kind = classify(pathname);
      if (kind === "root" || kind === "spa") {
        // Köke de, /tr/mesafe/ gibi uzantısız her yola da KÖK index.html.
        const hit = await readIfFile(join(base, "index.html"));
        if (!hit) return notFound("kök index.html yok");
        return send(200, hit.body, TYPES[".html"], "/index.html");
      }
      if (kind === "ambiguous") return notFound("belirsiz uzantı");
      const hit = await readIfFile(abs);
      if (!hit) return notFound("dosya yok");
      return send(200, hit.body, TYPES[extname(abs)] ?? "application/octet-stream", pathname);
    }

    // plain: dosya, yoksa dizin/index.html
    const direct = await readIfFile(abs);
    if (direct) {
      return send(200, direct.body, TYPES[extname(abs)] ?? "application/octet-stream", pathname);
    }
    try {
      if ((await stat(abs)).isDirectory()) {
        if (!pathname.endsWith("/")) {
          log.push({ method: req.method ?? "GET", path: url.pathname, status: 308, served: "redirect" });
          res.writeHead(308, { Location: `${url.pathname}/${url.search}` });
          return res.end();
        }
        const idx = await readIfFile(join(abs, "index.html"));
        if (idx) return send(200, idx.body, TYPES[".html"], `${pathname}index.html`);
      }
    } catch {
      /* yok */
    }
    return notFound("dosya yok");
  });

  await new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(port, host, ok);
  });
  const addr = server.address();
  const actualPort = typeof addr === "object" && addr ? addr.port : port;
  return {
    port: actualPort,
    url: `http://${host}:${actualPort}`,
    log,
    close: () =>
      new Promise((ok) => {
        server.closeAllConnections?.();
        server.close(() => ok());
      }),
  };
}

// CLI
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (name, fallback) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > -1 ? process.argv[i + 1] : fallback;
  };
  const root = resolve(arg("dir", fileURLToPath(new URL("../out", import.meta.url))));
  const mode = arg("mode", "capacitor");
  const port = Number(arg("port", "3501"));
  const srv = await startAppServer({ root, mode, port });
  console.log(`${root} → ${srv.url}  (kip: ${mode})`);
}
