# Wangoh

Türkçe öncelikli seyahat rehberi sitesi (wangoh.com), REST API'si ve bağımsız mobil uygulaması. Depo bir
[Turborepo](https://turborepo.dev) monorepo'sudur; paket yöneticisi pnpm.

```
.
├── apps/
│   ├── web/      Next.js 16 web sitesi (wangoh.com, Turbopack). Vercel'e buradan yayınlanır.
│   ├── api/      NestJS 12 REST API: kimlik doğrulama (user/admin), kıtalar, ülkeler, şehir
│   │             rehberleri, blog, oyunlar ve kullanıcı bazlı puanlama. Swagger: /docs
│   └── mobile/   React Native + Expo uygulaması (Expo Router). İçeriğin tamamı API'den gelir;
│                 web arayüzünü göstermez (WebView ya da Capacitor yok).
├── packages/
│   └── api-client/   apps/api/openapi.json'dan Orval ile üretilen TanStack Query istemcisi
│                     (@wangoh/api-client); web ve mobil aynı paketi kullanır.
├── docs/backend-mobil-mimarisi.md   API, istemci ve mobil için ortak sözleşme
├── package.json          Kök: ortak komutlar, packageManager, pnpm ayarı
├── pnpm-workspace.yaml   Workspace tanımı (apps/*, packages/*)
├── pnpm-lock.yaml        Tek kilit dosyası
└── turbo.json            Turborepo görevleri
```

Web'in iç dokümanları `apps/web/docs` altındadır.

## Gereksinimler

- Node.js 22
- pnpm 10 (kökteki `packageManager` alanı sürümü sabitliyor): `corepack enable` yeterli.

```bash
corepack enable
pnpm install
```

## Komutlar

Kökten:

| Komut | Ne yapar |
| --- | --- |
| `pnpm dev:web` | Web sitesini geliştirme kipinde başlatır (http://localhost:3000) |
| `pnpm dev:api` | API'yi izleme kipinde başlatır (http://localhost:3001, Swagger: `/docs`; veritabanı kurulumu gerekmez) |
| `pnpm dev:mobile` | Expo geliştirme sunucusunu başlatır (Expo Go ya da emülatör; etkileşimli terminal ister) |
| `pnpm build` | Web ve API üretim derlemesi (mobilde derleme görevi yok, native derleme gerekmez) |
| `pnpm lint` | Web için ESLint, API için oxlint |
| `pnpm typecheck` | Web, API, istemci paketi ve mobil için tip denetimi |
| `pnpm test` | API (Vitest, gerçek PGlite), istemci paketi ve mobil birim testleri |
| `pnpm generate:api` | API'nin OpenAPI belgesini dışa aktarır (`apps/api/openapi.json`), ardından Orval istemcisini üretir |

Tek bir uygulamada çalışmak için: `pnpm --filter web <betik>` ya da `pnpm --filter mobile <betik>`.

### Web (`apps/web`)

`apps/web` içinde ya da `pnpm --filter web <betik>` ile:

- `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm typecheck`
- Birim ve içerik testleri: `npx tsx scripts/i18n.test.ts`, `paths.test.ts`, `seo-copy.test.ts`,
  `distance.test.ts`, `map.test.ts`, `turkish.test.ts` (ve diğer `scripts/*.test.ts`);
  `node --test scripts/vercel-ignore-build.test.mjs`
- Derleme sonrası yerel sunucuya karşı (`pnpm start -p 3200` açıkken):
  `VALIDATION_BASE_URL=http://127.0.0.1:3200 pnpm test:seo` ve `pnpm test:guides`
- API istemcisi: `@wangoh/api-client` bağımlılığı, `ApiProvider` (`src/lib/api/ApiProvider.tsx`) ve `NEXT_PUBLIC_API_URL`
  hazır; henüz hiçbir sayfaya bağlı değil. Sitenin kendi içeriği (SSG) bilinçli olarak API'ye taşınmadı.
- Ortam değişkenleri: `apps/web/.env.example`. Yayındaki diller `NEXT_PUBLIC_SITE_LOCALES`
  (varsayılan `tr,en,es`, bkz. `apps/web/next.config.ts`).

### API (`apps/api`)

NestJS 12 (ESM), Drizzle ORM, PostgreSQL (`DATABASE_URL`; yoksa dev/test'te PGlite). Ayrıntı: `apps/api/README.md`.

- Kimlik doğrulama: scrypt parola, 15 dk erişim belirteci (JWT) + dönen yenileme belirteçleri (yeniden
  kullanım tespiti), `user` ve `admin` rolleri, hesap silme, hız sınırı.
- İçerik: 5 kıta, 196 ülke, 45 seyahat ülkesi, 360 şehir, 358 rehber (tr/en/es); blog (44 tohum yazı, blok
  tabanlı gövde); görsel atıfları (Wikimedia CC BY / CC BY-SA). Tohum, web verisinden
  `apps/web/scripts/export-api-seed.ts` ve `export-blog-seed.ts` ile üretilir (`apps/api/seed/`).
- Oyunlar: bayrak, başkent ve harita oyunu; sunucu kontrollü oturum, sunucu ölçümlü süre ve puan; liderlik
  tabloları, kişisel istatistik, yönetici skor denetimi.
- Ortam değişkenleri: `apps/api/.env.example`. Production'da `JWT_ACCESS_SECRET` (en az 32 karakter)
  zorunludur; `SEED_ON_BOOT=false` iken ilk kurulumda `pnpm --filter api db:seed` çalıştırılmalıdır.
- API şeması değişince `pnpm generate:api` çalıştırıp `apps/api/openapi.json` ve `packages/api-client/src/generated`
  değişikliklerini birlikte commit'le (bir test openapi.json'ın güncelliğini denetler).

### Mobil (`apps/mobile`)

Expo SDK 57 (React Native 0.86, React 19.2.3), Expo Router, TypeScript. Sekmeler: Keşfet (kıta → ülke →
şehir rehberi), Blog, Oyunlar (bayrak, başkent, harita), Profil, Yönetim (yalnız admin). Uygulama içeriği
kodda tutmaz; her şey `@wangoh/api-client` kancalarıyla API'den gelir. Arayüz Türkçe.

- Başlatma: kökten `pnpm dev:mobile` (ya da `apps/mobile` içinde `pnpm start`); API adresi `EXPO_PUBLIC_API_URL`
  (varsayılan `http://localhost:3001`, Android emülatöründe `http://10.0.2.2:3001`)
- Bağımlılık eklerken `npx expo install <paket>` kullan (SDK ile uyumlu sürümü seçer)
- iOS `bundleIdentifier` ve Android `package`: `com.wangoh.app` (eski Capacitor uygulamasının kimliği)
- `ios/` ve `android/` klasörleri yok (Expo bunları gerektiğinde üretir ve `.gitignore`da)
- Doğrulananlar: tip denetimi, birim testler, web/android/ios paketleme, web önizlemede Playwright akışları.
  **Doğrulanmayanlar:** gerçek cihazda dokunma/klavye/güvenli alan, SecureStore, ekran okuyucu, mağaza derlemesi (EAS).

## Neden pnpm

Web (Next.js) React 19.2.4, mobil (Expo SDK 57) React 19.2.3 kullanıyor ve React Native
işleyicisi React'in sürümüyle birebir uyuşmak zorunda. npm bağımlılıkları kök `node_modules`
altında topladığı için iki React aynı ağaçta yaşıyor ve Expo'nun kendi denetimi
(`expo-doctor`, "duplicate dependencies") bunu hata olarak işaretliyor. pnpm her uygulamaya
kendi bağımlılık ağacını verir; web'in React sürümü mobile dayatılmaz ve tersi de geçerli.

Kökteki `pnpm.overrides` ayarı yalnız Expo araçlarının isteğe bağlı `react-dom` bağımlılığının
web'in `react-dom`una (19.2.4) bağlanmasını engeller; mobil uygulamada `react-dom` yoktur.

pnpm bağımlılıkları katı çözümlediği için web'in koddan içe aktardığı ama `package.json`da
olmayan paketler (`sharp`, `@types/geojson`, `@types/topojson-specification`, test için
`intl-messageformat` ve `@formatjs/icu-messageformat-parser`) `apps/web/package.json`a eklendi.
Sürümler önceki kilit dosyasındakilerle aynı.

## Yayın (Vercel)

Web, mevcut Vercel projesine, aynı alan adına ve aynı production dalına (`main`) yayınlanmaya
devam eder. Yeni proje açılmaz. Depo yapısı değiştiği için Vercel projesinde şu ayarlar
gerekir:

| Ayar (Project Settings) | Değer |
| --- | --- |
| General → Root Directory | `apps/web` |
| General → Include source files outside of the Root Directory in the Build Step | Açık |
| Framework Preset | Next.js (değişmez) |
| Node.js Version | 22.x |
| Install / Build / Ignored Build Step komutları | Panelde özel değer olmamalı; `apps/web/vercel.json` kullanılır |
| Production Branch, alan adları, ortam değişkenleri | Değişmez |

`apps/web/vercel.json` şunu tanımlar:

- `installCommand`: `pnpm install --frozen-lockfile --filter 'web...'` (yalnız web ve bağımlılıkları;
  Expo paketleri yayında kurulmaz)
- `buildCommand`: `pnpm run build` (`next build`)
- `ignoreCommand`: `node scripts/vercel-ignore-build.mjs`: yalnız `apps/mobile`, `apps/api`, dokümantasyon ve
  `.md` dosyası değişikliklerinde web derlemesini atlar. `package.json`, `pnpm-lock.yaml`,
  `pnpm-workspace.yaml`, `turbo.json`, `packages/*` ve `apps/web` altındaki her değişiklik derlemeyi tetikler.
  (Mobil bir bağımlılık güncellemesi kilit dosyasını değiştireceği için web derlemesini de
  tetikler; bu bilinçli.)

Geçiş sırası: Root Directory ayarını bu değişikliğin `main`'e birleşmesinden hemen önce (ya da
sonra) değiştirmek, ayar ile depo yapısı uyuşana kadar bir derlemenin başarısız olmasına yol
açar. Başarısız derleme canlı yayını değiştirmez (önceki başarılı yayın yayında kalır); ayar
düzeltilip yeniden dağıtılınca yayın sürer.

## API'nin yayını

API henüz hiçbir yere dağıtılmadı ve Vercel projesine bağlı değil (`apps/api` değişiklikleri web derlemesini
tetiklemez). Dağıtım için gereken: Node 22 ve PostgreSQL, `DATABASE_URL`, `JWT_ACCESS_SECRET`, `CORS_ORIGINS`,
`ADMIN_EMAIL`/`ADMIN_PASSWORD` (ilk yönetici), `ASSETS_BASE_URL`; derleme `pnpm --filter api build`, çalıştırma
`node dist/main.js`. Docker dosyası ve barındırma sağlayıcısı seçimi yapılmadı; dağıtım yolu doğrulanmadı.

## Notlar

- Eski mobil mimari (Capacitor ile web'i WebView'a gömen kabuk, `ios/`, `android/`, statik
  `build:app` çıktısı ve doğrulama betikleri) kaldırıldı.
- Görsel atıfları gerektiği yerde rehber sayfalarının sonunda gösterilir
  (`apps/web/src/components/ImageCredits.tsx`, veri: `apps/web/src/data/imageCredits.ts`).

## Lisans

MIT
