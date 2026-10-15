@apps/web/AGENTS.md

# Wangoh çalışma notları

- Kullanıcı Türkçe yazar; Türkçe yanıt ver. Onay sorma: commit, push ve yayın dahil işi bitir, sonra raporla. Yine de push'tan önce derle ve testleri çalıştır, çünkü `main` doğrudan canlıya gider.
- Depo bir Turborepo monorepo (pnpm workspaces): `apps/web` Next.js web sitesi, `apps/mobile` bağımsız React Native + Expo uygulaması. Web arayüzü Expo'ya gömülmez; WebView ve Capacitor kullanılmaz. Web işlerinde `apps/mobile`a dokunma. Sunucuya özel route'lar `route.web.ts`.
- Restoran, puan, adres, fiyat, saat gibi bilgileri asla uydurma. Çerez ve yasal metinlerde hata olmasın.
- Aşağıdaki yollar, aksi belirtilmedikçe `apps/web` köküne göredir.

## Yayın

- Vercel, GitHub `canmorant/wangoh.ai` `main` dalını 1–2 dakikada otomatik yayınlar. Vercel projesinin Root Directory ayarı `apps/web` olmalı; kurulum ve derleme komutları `apps/web/vercel.json`da (README → Yayın). Push: `git push origin HEAD:main && git push origin HEAD`.
- Canlı JS parçaları `/_next/static/immutable/chunks/` altında.
- `apps/web/scripts/vercel-ignore-build.mjs` yalnız `apps/mobile` ve dokümantasyon değişikliklerinde web derlemesini atlar; kök yapılandırma ve bağımlılık dosyaları (package.json, pnpm-lock.yaml, pnpm-workspace.yaml, turbo.json) ve `apps/web` değişiklikleri derlemeyi tetikler.

## Diller

- Canlı: tr, en, es (`next.config.ts` → `NEXT_PUBLIC_SITE_LOCALES` varsayılanı). de/ru/fr hazırlanıyor ama yayında değil; bir dil tamamen çevrilip kontrol edilmeden yayına alınmaz.
- Arayüz metinleri `messages/*.json` (tip kaynağı tr). İçerik çevirileri `src/content/i18n/tm/<dil>.json`; `npx tsx scripts/content-i18n.ts status|extract|merge`.
- Kodda iç bağlantılar hep Türkçe yol; `@/i18n/navigation` bunları `/en/france/paris`, `/es/francia/paris` gibi yerelleştirir (`src/i18n/paths.ts`, `src/proxy.ts`, `src/i18n/slugs.gen.ts`).
- İngilizce/İspanyolca SEO katmanı: `src/content/guides/seo.en.ts`, `seo.es.ts`, `src/content/countryHubs.seo.en.ts`, `countryHubs.seo.es.ts`, şablon bayrakları `src/content/guides/templates/en.ts`, `es.ts`. Fabrikalara dokunurken Türkçe rehber çıktısı bayt bayt aynı kalmalı.

## Komutlar ve testler

- Paket yöneticisi pnpm 10 (`corepack enable` yeter). Kurulum: kökte `pnpm install`.
- Kökten: `pnpm dev:web`, `pnpm dev:mobile`, `pnpm build` (web), `pnpm lint` (web), `pnpm typecheck` (web ve mobil).
- Web (`apps/web` içinde, ya da kökten `pnpm --filter web <betik>`): `npx tsc --noEmit -p .`, `npx eslint .`
- `npx tsx scripts/i18n.test.ts`, `npx tsx scripts/paths.test.ts`, `npx tsx scripts/seo-copy.test.ts`, `npx tsx scripts/distance.test.ts`, `npx tsx scripts/map.test.ts`, `npx tsx scripts/turkish.test.ts` (`apps/web` içinden)
- Derleme sonrası yerel sunucuya karşı (`apps/web` içinde, `pnpm start -p 3200` ile): `VALIDATION_BASE_URL=http://127.0.0.1:3200 pnpm test:seo` ve `pnpm test:guides`
- Mobil (`apps/mobile`): bağımlılık eklerken `npx expo install <paket>`; `pnpm typecheck`.

## Google Maps listeleri

- Şablon ve öncelik sırası: `docs/google-maps-listeleri.md`; kayıt `src/content/maps-lists.ts`. Liste bağlantısı (maps.app.goo.gl) kullanıcının Wangoh Google hesabında elle kurulur; bağlantı gelmeden şehir yayına alınmaz.
