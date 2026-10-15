# Wangoh

Türkçe öncelikli seyahat rehberi sitesi (wangoh.com) ve onun bağımsız mobil uygulaması. Depo bir
[Turborepo](https://turborepo.dev) monorepo'sudur; paket yöneticisi pnpm.

```
.
├── apps/
│   ├── web/      Next.js 16 web sitesi (wangoh.com). Vercel'e buradan yayınlanır.
│   └── mobile/   React Native + Expo uygulaması. Web'den bağımsız; web arayüzünü
│                 göstermez (WebView ya da Capacitor yok). Şimdilik Expo'nun minimal
│                 TypeScript başlangıç projesi.
├── package.json          Kök: ortak komutlar, packageManager, pnpm ayarı
├── pnpm-workspace.yaml   Workspace tanımı (apps/*)
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
| `pnpm dev:mobile` | Expo geliştirme sunucusunu başlatır (Expo Go ya da emülatör; etkileşimli terminal ister) |
| `pnpm build` | Web sitesinin üretim derlemesi (mobilde derleme görevi yok, native derleme gerekmez) |
| `pnpm lint` | Web için ESLint |
| `pnpm typecheck` | Web ve mobil için tip denetimi |

Tek bir uygulamada çalışmak için: `pnpm --filter web <betik>` ya da `pnpm --filter mobile <betik>`.

### Web (`apps/web`)

`apps/web` içinde ya da `pnpm --filter web <betik>` ile:

- `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm typecheck`
- Birim ve içerik testleri: `npx tsx scripts/i18n.test.ts`, `paths.test.ts`, `seo-copy.test.ts`,
  `distance.test.ts`, `map.test.ts`, `turkish.test.ts` (ve diğer `scripts/*.test.ts`);
  `node --test scripts/vercel-ignore-build.test.mjs`
- Derleme sonrası yerel sunucuya karşı (`pnpm start -p 3200` açıkken):
  `VALIDATION_BASE_URL=http://127.0.0.1:3200 pnpm test:seo` ve `pnpm test:guides`
- Ortam değişkenleri: `apps/web/.env.example`. Yayındaki diller `NEXT_PUBLIC_SITE_LOCALES`
  (varsayılan `tr,en,es`, bkz. `apps/web/next.config.ts`).

### Mobil (`apps/mobile`)

Expo SDK 57 (React Native 0.86, React 19.2.3), TypeScript. Yalnızca Expo'nun başlangıç ekranı
var; ekran, navigasyon ve API entegrasyonu henüz yok.

- Başlatma: kökten `pnpm dev:mobile` (ya da `apps/mobile` içinde `pnpm start`)
- Bağımlılık eklerken `npx expo install <paket>` kullan (SDK ile uyumlu sürümü seçer)
- `app.json` içindeki `name`/`slug` yer tutucu (`mobile`); iOS `bundleIdentifier` ve Android
  `package` henüz tanımlı değil, ilk derlemeden (EAS ya da yerel) önce belirlenmeli
- `ios/` ve `android/` klasörleri yok (Expo bunları gerektiğinde üretir ve `.gitignore`da)

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
- `ignoreCommand`: `node scripts/vercel-ignore-build.mjs`: yalnız `apps/mobile`, dokümantasyon ve
  `.md` dosyası değişikliklerinde web derlemesini atlar. `package.json`, `pnpm-lock.yaml`,
  `pnpm-workspace.yaml`, `turbo.json` ve `apps/web` altındaki her değişiklik derlemeyi tetikler.
  (Mobil bir bağımlılık güncellemesi kilit dosyasını değiştireceği için web derlemesini de
  tetikler; bu bilinçli.)

Geçiş sırası: Root Directory ayarını bu değişikliğin `main`'e birleşmesinden hemen önce (ya da
sonra) değiştirmek, ayar ile depo yapısı uyuşana kadar bir derlemenin başarısız olmasına yol
açar. Başarısız derleme canlı yayını değiştirmez (önceki başarılı yayın yayında kalır); ayar
düzeltilip yeniden dağıtılınca yayın sürer.

## Notlar

- Eski mobil mimari (Capacitor ile web'i WebView'a gömen kabuk, `ios/`, `android/`, statik
  `build:app` çıktısı ve doğrulama betikleri) kaldırıldı.
- Görsel atıfları gerektiği yerde rehber sayfalarının sonunda gösterilir
  (`apps/web/src/components/ImageCredits.tsx`, veri: `apps/web/src/data/imageCredits.ts`).

## Lisans

MIT
