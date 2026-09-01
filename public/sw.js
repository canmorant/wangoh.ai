/**
 * Wangoh service worker.
 *
 * Amaç çevrimdışı okunabilirlik: gezginler rehberi tam da yurtdışında,
 * veri olmadan açar. Ziyaret edilen her sayfa ve görsel önbelleğe alınır,
 * bağlantı yokken oradan servis edilir.
 *
 * Stratejiler:
 *   gezinme (HTML)  → önce ağ, olmazsa önbellek, o da yoksa /cevrimdisi
 *   /images, /icons → önce önbellek (içerik sabit, adı hash'li)
 *   /_next/static   → önce önbellek (dosya adı zaten sürümlü)
 *   diğer GET       → önce ağ, sessizce önbelleğe düş
 *
 * Reklam, analitik ve GET olmayan istekler hiç dokunulmadan geçer.
 */

const VERSION = "v1";
const SHELL = `wangoh-shell-${VERSION}`;
const PAGES = `wangoh-pages-${VERSION}`;
const ASSETS = `wangoh-assets-${VERSION}`;

const OFFLINE_URL = "/cevrimdisi";

/** Açılışta mutlaka lazım olanlar. */
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/manifest.webmanifest"];

/** Bu alan adlarına hiç karışma. */
const BYPASS = /(googlesyndication|googletagmanager|google-analytics|doubleclick|adsbygoogle)/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      // Tek bir dosyanın 404'ü tüm kurulumu düşürmesin.
      await Promise.allSettled(PRECACHE.map((u) => cache.add(u)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL, PAGES, ASSETS]);
      const names = await caches.keys();
      await Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

/** Sayfa güncellemesini beklemeden devreye almak için. */
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  // Yalnızca sağlam yanıtları sakla; opak/hatalı yanıt önbelleği zehirler.
  if (res.ok && res.status === 200) cache.put(request, res.clone());
  return res;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res.ok && res.status === 200) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(request);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Farklı kaynaklar ve reklam/analitik: dokunma.
  if (url.origin !== self.location.origin) return;
  if (BYPASS.test(url.href)) return;

  // Sayfa gezinmeleri — içerik tazeliği önemli, ama çevrimdışıyken de açılmalı.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await networkFirst(request, PAGES);
        } catch {
          const cache = await caches.open(SHELL);
          const offline = await cache.match(OFFLINE_URL);
          return (
            offline ||
            new Response("Çevrimdışısınız.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })()
    );
    return;
  }

  // İçeriği adına gömülü, değişmeyen varlıklar.
  if (
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/flags/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/_next/image")
  ) {
    event.respondWith(cacheFirst(request, ASSETS).catch(() => fetch(request)));
    return;
  }

  event.respondWith(networkFirst(request, PAGES).catch(() => fetch(request)));
});
