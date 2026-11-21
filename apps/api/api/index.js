/**
 * Vercel işlevi. Nest uygulaması ilk istekte kurulur (soğuk başlatma) ve aynı örnekteki sonraki isteklerde
 * yeniden kullanılır; `main.ts`teki `listen` yerine Express uygulamasının kendisi istek işleyicisidir.
 * Yapılandırma ortam değişkenlerinden gelir (bkz. docs/backend-mobil-mimarisi.md, bölüm 4 ve README "Yayın").
 * Bu dosya paketlenmiş çıktıyı (`api/_server.mjs`, `scripts/bundle-vercel.mjs`) içe aktarır: önce `pnpm build`
 * ve paketleme çalışmış olmalıdır (vercel.json derleme komutu).
 */
import { createApp, formatStartupError } from "./_server.mjs";

let ready;

async function start() {
  const app = await createApp();
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req, res) {
  let server;
  try {
    ready ??= start();
    server = await ready;
  } catch (err) {
    // Kurulum başarısız (ör. veritabanına ulaşılamadı): sonraki istek baştan denesin, ayrıntı yalnız günlüğe yazılsın.
    ready = undefined;
    console.error(formatStartupError(err));
    res.statusCode = 503;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.end(JSON.stringify({ statusCode: 503, code: "SERVICE_UNAVAILABLE", message: "Sunucu şu an hazır değil. Lütfen biraz sonra tekrar deneyin." }));
    return;
  }
  server(req, res);
}
