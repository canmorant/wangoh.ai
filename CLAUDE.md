@AGENTS.md

# Wangoh çalışma notları

- Kullanıcı Türkçe yazar; Türkçe yanıt ver. Onay sorma: commit, push ve yayın dahil işi bitir, sonra raporla. Yine de push'tan önce derle ve testleri çalıştır, çünkü `main` doğrudan canlıya gider.
- Mobil uygulamaya (Capacitor, `ios/`, `android/`, `npm run build:app`) dokunma; yalnız web sitesi. Sunucuya özel route'lar `route.web.ts`.
- Restoran, puan, adres, fiyat, saat gibi bilgileri asla uydurma. Çerez ve yasal metinlerde hata olmasın.

## Yayın

- Vercel, GitHub `canmorant/wangoh.ai` `main` dalını 1–2 dakikada otomatik yayınlar. Push: `git push origin HEAD:main && git push origin HEAD`.
- Canlı JS parçaları `/_next/static/immutable/chunks/` altında.

## Diller

- Canlı: tr, en, es (`next.config.ts` → `NEXT_PUBLIC_SITE_LOCALES` varsayılanı). de/ru/fr hazırlanıyor ama yayında değil; bir dil tamamen çevrilip kontrol edilmeden yayına alınmaz.
- Arayüz metinleri `messages/*.json` (tip kaynağı tr). İçerik çevirileri `src/content/i18n/tm/<dil>.json`; `npx tsx scripts/content-i18n.ts status|extract|merge`.
- Kodda iç bağlantılar hep Türkçe yol; `@/i18n/navigation` bunları `/en/france/paris`, `/es/francia/paris` gibi yerelleştirir (`src/i18n/paths.ts`, `src/proxy.ts`, `src/i18n/slugs.gen.ts`).
- İngilizce/İspanyolca SEO katmanı: `src/content/guides/seo.en.ts`, `seo.es.ts`, `src/content/countryHubs.seo.en.ts`, `countryHubs.seo.es.ts`, şablon bayrakları `src/content/guides/templates/en.ts`, `es.ts`. Fabrikalara dokunurken Türkçe rehber çıktısı bayt bayt aynı kalmalı.

## Testler

- `npx tsc --noEmit -p .`, `npx eslint .`
- `npx tsx scripts/i18n.test.ts`, `npx tsx scripts/paths.test.ts`, `npx tsx scripts/seo-copy.test.ts`
- Derleme sonrası yerel sunucuya karşı: `VALIDATION_BASE_URL=http://127.0.0.1:3200 npm run test:seo` ve `npm run test:guides`

## Google Maps listeleri

- Şablon ve öncelik sırası: `docs/google-maps-listeleri.md`; kayıt `src/content/maps-lists.ts`. Liste bağlantısı (maps.app.goo.gl) kullanıcının Wangoh Google hesabında elle kurulur; bağlantı gelmeden şehir yayına alınmaz.
