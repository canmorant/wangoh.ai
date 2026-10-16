# Wangoh: backend ve mobil uygulama mimarisi

Bu belge hem ekibin hem de depoda çalışan ajanların ortak sözleşmesidir. Kod yazarken burada yazanlar
kuraldır; belgenin dışına çıkman gerekiyorsa gerekçeni raporuna yaz.

## 1. Hedef

- `apps/api`: NestJS 12 ile REST API. Kimlik doğrulama (authentication) ve yetkilendirme (authorization),
  Swagger/OpenAPI entegrasyonu.
- `packages/api-client`: `apps/api/openapi.json` dosyasından **Orval** ile üretilen, **TanStack Query v5**
  kancaları (hooks) içeren ortak istemci. Web ve mobil aynı paketi kullanır.
- `apps/mobile`: Expo (React Native) uygulaması. Kıtalar, ülkeler, şehir rehberleri, blog yazıları ve
  oyunlar **yalnız API'den** gelir; mobilde içerik verisi tutulmaz.
- `apps/web`: Next.js sitesi. Şimdilik yalnız istemci kablolaması (bağımlılık, `ApiProvider`,
  `NEXT_PUBLIC_API_URL`); sitenin kendi statik içeriği (SSG, 1.254 sayfa) API'ye taşınmadı.
- Roller: `user` ve `admin`. Oyunlar giriş ister, puanlar kullanıcıya bağlıdır.

## 2. Depo düzeni

```
apps/api/                 NestJS 12 (ESM), paket adı "api"
  src/
    main.ts               sunucuyu başlatır (yalnız dinleme)
    bootstrap.ts          createApp(): ValidationPipe, helmet, CORS, Swagger, filtreler (test/openapi export de bunu kullanır)
    app.module.ts
    config/               ortam değişkeni doğrulama, tipli yapılandırma
    db/
      schema/*.ts         Drizzle şeması (TÜM tablolar)
      client.ts           pg (DATABASE_URL) ya da PGlite bağlantısı
      migrate.ts          açılışta migrasyon
      seed/index.ts       tohum yükleyici orkestratörü
    common/               guard'lar, dekoratörler, filtreler, sayfalama, lang yardımcıları
    auth/  users/         kimlik doğrulama, kullanıcılar
    content/              kıtalar, ülkeler, şehirler, rehberler
    blog/                 blog yazıları
    games/                oyun oturumları, puanlar, liderlik tabloları
    openapi/export.ts     derlenmiş uygulamadan openapi.json üretir
  drizzle/                drizzle-kit çıktısı (SQL migrasyonları, COMMIT'lenir)
  seed/                   tohum JSON dosyaları (COMMIT'lenir)
  test/                   e2e testleri ve yardımcılar
  openapi.json            üretilmiş sözleşme (COMMIT'lenir)
packages/api-client/      "@wangoh/api-client"
  orval.config.ts
  src/mutator.ts          fetch mutator + configureApiClient + token yenileme
  src/generated/          Orval çıktısı (COMMIT'lenir)
  src/index.ts
apps/mobile/              Expo Router uygulaması
  app/                    rotalar
  src/                    api kurulumu, auth, tema, bileşenler, özellikler
apps/web/                 mevcut site
```

Yol çözümleme: `src/db/migrate.ts` ve tohum yükleyici, `drizzle/` ve `seed/` klasörlerini
`new URL("../../drizzle", import.meta.url)` biçiminde, kendi konumuna göre çözer (hem `src/` altında
çalışırken hem `dist/` altında aynı derinlikte). `process.cwd()`'ye güvenme.

## 3. Teknoloji kararları

| Konu | Karar |
| --- | --- |
| Paket yöneticisi | pnpm 10 workspace; kurulum komutlarını `flock /tmp/wangoh-pnpm.lock pnpm ...` ile sarmala (paralel ajanlar) |
| API | NestJS 12, ESM (`"type": "module"`), Node ≥ 20, TS `nodenext` → göreli içe aktarmalarda `.js` uzantısı |
| Derleme | `nest build` (tsc). tsx/esbuild decorator metadata üretmez; çalıştırma ve OpenAPI dışa aktarma derlenmiş koddan |
| Test | Vitest 4 + supertest. Birim `*.spec.ts`, e2e `*.e2e-spec.ts` (`test/`) |
| Lint | oxlint (`apps/api`), web'de mevcut ESLint |
| Veritabanı | PostgreSQL. `DATABASE_URL` varsa node-postgres, yoksa PGlite (dev: `apps/api/.data/pglite`, test: bellek). PGlite tek süreçlidir: klasörü `<klasör>.lock` ile korunur, ikinci açılış hatayla reddedilir. `int8` (bigint) sonuçları (`count(*)`, `rank()`...) iki sürücüde de `number` döner; `numeric` dizgidir |
| ORM | Drizzle ORM (pg-core) + drizzle-kit migrasyonları |
| Doğrulama | class-validator + class-transformer, global `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })` |
| Swagger | `@nestjs/swagger`, `/docs` (UI) ve `/docs-json`; Bearer JWT şeması; `operationId` = `<Denetleyici><Metot>` (ör. `authLogin`, `contentListCountries`) |
| İstemci | Orval 8, `client: react-query`, fetch + özel mutator, `mode: tags-split`, TanStack Query v5 |
| Mobil | Expo SDK 57, RN 0.86, Expo Router, expo-secure-store (web önizlemede localStorage yedeği) |
| Tohum içerik | `apps/web` verisinden `apps/web/scripts/export-api-seed.ts` ile `apps/api/seed/*.json` |

Genel önek: tüm rotalar `/v1` altında (`app.setGlobalPrefix("v1")`), Swagger önek dışında (`/docs`).

## 4. Ortam değişkenleri

API (`apps/api/.env.example`):

| Değişken | Açıklama |
| --- | --- |
| `PORT` | varsayılan 3001 |
| `NODE_ENV` | development / test / production |
| `DATABASE_URL` | yoksa PGlite |
| `PGLITE_DIR` | varsayılan `.data/pglite`; `memory://` bellek. Klasörü aynı anda tek süreç açar |
| `JWT_ACCESS_SECRET` | production'da ZORUNLU, ≥ 32 karakter (belirteç imzalayan sunucu için; `db:seed` CLI'si istemez). dev/test'te sabit güvensiz varsayılan + uyarı |
| `ACCESS_TOKEN_TTL` | varsayılan `15m` |
| `REFRESH_TOKEN_TTL_DAYS` | varsayılan 30 |
| `CORS_ORIGINS` | virgülle ayrılmış; dev'de `localhost` kaynaklarına izin |
| `TRUST_PROXY` | ters vekil arkasında istemci IP'si için: `true`/`false`, atlama sayısı, `loopback`/`linklocal`/`uniquelocal` ya da virgülle ayrılmış IP/alt ağ listesi. Geçersiz değer açılışta Türkçe yapılandırma hatasıdır |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | ikisi de varsa açılışta idempotent admin oluşturur |
| `ASSETS_BASE_URL` | varsayılan `https://wangoh.com` (görsel/bayrak mutlak adresleri) |
| `SEED_ON_BOOT` | dev/test: `true`, production: `false`; tohum idempotent (upsert) |
| `MIGRATE_ON_BOOT` | varsayılan `true` |
| `SWAGGER_ENABLED` | varsayılan `true` |

Mobil: `EXPO_PUBLIC_API_URL` (varsayılan `http://localhost:3001`; Android emülatörü için `10.0.2.2`).
Web: `NEXT_PUBLIC_API_URL`.

## 5. Kimlik doğrulama ve yetkilendirme

- Kayıt her zaman `user` rolü verir. Admin yalnız `ADMIN_EMAIL`/`ADMIN_PASSWORD` ile oluşur ya da
  başka bir admin tarafından atanır. Son admin silinemez / `user`a düşürülemez / devre dışı bırakılamaz.
- Parola: scrypt (`node:crypto`), rastgele 16 bayt tuz, `timingSafeEqual`, biçim
  `scrypt$N$r$p$salt$hash`. 8–128 karakter. E-posta küçük harfe çevrilir ve kırpılır; benzersizlik
  `lower(email)` üzerinde.
- Erişim belirteci: JWT (HS256), `sub`, `iss`, `aud`, 15 dk. Rol belirteçten **değil** veritabanından
  okunur: global JWT guard her istekte kullanıcıyı yükler, silinmiş/devre dışı kullanıcıyı reddeder
  (rol düşürme ve devre dışı bırakma anında geçerli olur).
- Yenileme belirteci: 256 bit rastgele opak değer, veritabanında yalnız SHA-256 özeti. Her
  yenilemede döner (rotation). Aynı aileden kullanılmış bir belirteç yeniden gelirse ailenin tamamı
  iptal edilir (reuse detection). Çıkış, parola değişimi, hesap silme ve devre dışı bırakma ilgili
  belirteçleri iptal eder. Belirteç satırına dokunan her işlem önce sahibinin `users` satırını kilitler
  (kilit sırası `users` → `refresh_tokens`): eşzamanlı yenileme, çıkış ve yönetici işlemleri kilitlenmeye
  (deadlock) girmez ve aile iptali sürmekte olan bir yenilemenin yeni belirtecini kaçırmaz.
- Global guard'lar: `JwtAuthGuard` (varsayılan kapalı kapı), `@Public()` ile açılır; `RolesGuard`
  ve `@Roles("admin")`.
- Giriş: bilinmeyen e-postada da parola doğrulama süresi benzeri (sahte özet), genel hata mesajı.
- Hız sınırı (`@nestjs/throttler`): genel 120/dk, kimlik uç noktaları 10/dk. Helmet, CORS beyaz liste,
  gövde sınırı (varsayılan 100 kb; blog yönetimi için daha yüksek ayrı sınır), parola/belirteç asla
  loglanmaz.
- App Store gerekliliği: hesap oluşturma varsa uygulama içinden hesap silme olmalı → `DELETE /v1/users/me`.

### Uç noktalar

| Metot ve yol | Erişim |
| --- | --- |
| `POST /v1/auth/register` `{email, password, displayName}` → `{accessToken, refreshToken, expiresIn, user}` | public |
| `POST /v1/auth/login` `{email, password}` → aynı | public |
| `POST /v1/auth/refresh` `{refreshToken}` → yeni çift | public |
| `POST /v1/auth/logout` `{refreshToken}` → 204 | public (belirteç sahibi) |
| `GET /v1/auth/me` → kullanıcı | user |
| `PATCH /v1/users/me` `{displayName}`, `POST /v1/users/me/password` `{currentPassword, newPassword}`, `DELETE /v1/users/me` `{password}` | user |
| `GET /v1/users` (sayfalı, `q`, `role`), `GET /v1/users/:id`, `PATCH /v1/users/:id` `{role?, disabled?, displayName?}`, `DELETE /v1/users/:id` | admin |

Hata gövdesi her yerde aynı: `{ statusCode, code, message, details? }`. `message` Türkçe ve kullanıcıya
gösterilebilir, `code` makine okur (`AUTH_INVALID_CREDENTIALS`, `AUTH_EMAIL_TAKEN`,
`AUTH_TOKEN_INVALID`, `FORBIDDEN`, `VALIDATION_FAILED`, `NOT_FOUND`, `RATE_LIMITED`...). Üretimde iç
ayrıntı sızmaz. Doğrulama hatasında `details` en fazla 50 kayıttır. İstemci girdisi hiçbir zaman 500
üretmez: çok derin iç içe JSON (> 64 seviye), nesne başına > 500 anahtar, eşleşmemiş vekil karakter ve
yoldaki/sorgudaki `%00` ayrıştırıldıktan hemen sonra 400 `VALIDATION_FAILED` olur. Açılış hataları da
SQL parametresi (`ADMIN_EMAIL`, parola özeti) içermeden, temizlenmiş özetle yazılır.

## 6. İçerik (kıtalar, ülkeler, şehirler, rehberler)

Dil: `?lang=tr|en|es` (varsayılan `tr`). İstenen dilde çeviri yoksa ya da `complete_langs` içinde değilse
Türkçeye düşülür; yanıt hangi dilin sunulduğunu (`lang`) ve istenen dilin tam olup olmadığını
(`complete`) söyler. Çeviri uydurulmaz: web'deki mevcut çeviri verisi neyse o aktarılır.

Veri kaynağı (web): `apps/web/src/data/countries.ts` (dünya ülkeleri, ~195), `data/destinations.ts`
(öne çıkan 45 ülke + 360 şehir), `content/countryHubs.ts` (+ `addedCountryHubs.json`), `content/guides/*`
(358 şehir rehberi), `content/dietary`, `content/localized.ts` (en/es çevirileri), `content/regions.ts`.
Seçilen dilde "tam" (complete) olanlar o dil için aktarılır.

Tablolar (Drizzle şemasında; `translations` jsonb sütunları `{ tr: {...}, en?: {...}, es?: {...} }`):

- `continents`: `slug` pk (`africa|americas|asia|europe|oceania`), `position`, `translations` (`name`).
- `countries` (tüm dünya): `code` pk (ISO2), `iso3` unique, `continent_slug` fk, `subregion`, `flag`
  (emoji), `latitude`, `longitude`, `landlocked`, `borders` (ISO3 dizisi), `aliases` (kabul edilen
  yazımlar; oyun doğrulaması için), `capital` text[] (kaynak biçimiyle), `translations`
  (`name`, `officialName`), `has_travel` bool.
- `country_travel` (öne çıkan ülkeler): `country_code` pk/fk, `image`, `accent`, `budget`, `iata`,
  `position`, `translations` (`description`, `signature`, `gateway`, `capital`, `bestSeason`, `flightTime`,
  `hub` = ülke sayfası içeriği), `complete_langs` text[].
- `cities`: `id` uuid, `country_code` fk, `slug`, `position`, `image`, `translations` (`name`, `description`),
  unique (`country_code`, `slug`), `complete_langs`.
- `city_guides`: `city_id` pk/fk, `translations` (rehber gövdesi, isteğe bağlı `dietary`),
  `complete_langs`, `reviewed`.

Görsel adresleri: API mutlak adres döner (`imageUrl`). Web görselleri AVIF olduğundan (Android'de eski
sürümler AVIF çözemez) mobil için JPEG varyantı kullanılır: `${ASSETS_BASE_URL}/og/<ad>.jpg`
(web'in `/og` rotası). Bayrak: `flagUrl` = `${ASSETS_BASE_URL}/flags/<iso2>.svg` ve emoji `flag`.

Uç noktalar (GET'ler public, yazma admin):

- `GET /v1/continents`, `GET /v1/continents/:slug`
- `GET /v1/countries` (sayfalı; `continent`, `q`, `hasTravel`, `lang`), `GET /v1/countries/:code`
  (ayrıntı + varsa seyahat bilgisi + şehir özeti), `GET /v1/countries/:code/cities`
- `GET /v1/countries/:code/cities/:slug` (şehir + rehber)
- Admin: `PATCH /v1/countries/:code`, `PATCH /v1/countries/:code/cities/:slug`,
  `POST /v1/countries/:code/cities`, `DELETE /v1/countries/:code/cities/:slug` (çeviri alanlarını
  birleştirerek günceller; doğrulanmış şemayla).

## 7. Blog

- `blog_posts`: `id` uuid, `slug` unique, `status` (`draft|published`), `author_id` (nullable fk, silinince null),
  `cover_image`, `tags` text[], `country_code` (nullable fk), `translations`
  (`title`, `excerpt`, `body`), `published_at`, `created_at`, `updated_at`.
- `body` düz **blok dizisi** (HTML/Markdown yok; mobilde güvenle ve yerel bileşenlerle çizilir):
  `{type:"heading", level:2|3, text}`, `{type:"paragraph", text}`, `{type:"list", ordered, items[]}`,
  `{type:"quote", text, cite?}`, `{type:"image", url, alt, caption?}`. Sunucu doğrular (bilinmeyen tür,
  aşırı uzunluk, `javascript:` vb. url reddedilir; yalnız https).
- Public: `GET /v1/blog/posts` (yalnız `published`; `lang`, `tag`, `country`, `q`, sayfalı),
  `GET /v1/blog/posts/:slug`. Admin: aynı uçlar `status=all|draft` ile taslakları da görür;
  `POST /v1/blog/posts`, `PATCH /v1/blog/posts/:id`, `DELETE /v1/blog/posts/:id`,
  yayınlama `PATCH ... {status:"published"}` (ilk yayında `published_at` atanır).
- Tohum yazılar mevcut sitedeki ülke sayfası metinlerinden türetilir (başlık, özet, giriş
  paragrafları, rota fikirleri, önemli bilgiler). Yeni bilgi uydurulmaz.

## 8. Oyunlar ve puanlama

Tüm oyunlar sunucu kontrollüdür: doğru cevaplar istemciye oturum bitmeden gitmez, puanı **sunucu**
hesaplar, süreyi **sunucu** ölçer (istemcinin bildirdiği süre kullanılmaz). Oyun uçları giriş ister.

Oyun türleri (`gameType`): `flag-quiz` (bayraktan ülke), `capital-quiz` (ülkeden başkent), `map-guess`
(ülkeyi haritada işaretle). Her oyun 10 tur (`map-guess` 5 tur). Havuz: `countries` tablosu;
`capital-quiz` yalnız başkenti olan ülkeler; `map-guess` ülke merkez koordinatı (`latitude`/`longitude`).
Çoktan seçmeli oyunlarda 4 seçenek, yanlış seçenekler aynı kıtadan öncelikli.

Tablolar:

- `game_sessions`: `id` uuid, `user_id` fk (cascade), `game_type`, `status`
  (`active|finished|abandoned|expired`), `rounds` jsonb (sunucu sırrı: hedefler, seçenekler, verilen
  cevaplar), `current_round`, `round_started_at`, `score`, `correct_count`, `started_at`, `finished_at`,
  `expires_at` (başlangıç + 30 dk).
- `scores`: `id` uuid, `user_id` fk (cascade), `game_type`, `session_id` unique fk, `score`,
  `correct_count`, `rounds_total`, `duration_ms`, `created_at`; dizinler (`game_type`, `score desc`),
  (`user_id`, `game_type`).

Akış:

1. `POST /v1/games/:gameType/sessions` → `{sessionId, gameType, roundsTotal, expiresAt, round}` (ilk tur;
   aynı türde önceki aktif oturum `abandoned` olur).
2. `POST /v1/games/sessions/:id/answers` `{roundIndex, answer}` (`answer`: ülke kodu ya da `{lat,lng}`) →
   `{correct, correctAnswer, points, score, nextRound | null}`. Sırası bozuk `roundIndex` → 409; zaman aşımı
   (tur başına 20 sn + 3 sn ağ payı) → 0 puan, `correct:false`.
3. `POST /v1/games/sessions/:id/finish` (tüm turlar cevaplanınca; yoksa 409) → `{score, correctCount,
   roundsTotal, rank, personalBest, isPersonalBest}`; `scores`a tek satır yazar. İdempotent.
4. `GET /v1/games/sessions/:id` (yalnız sahibi; devam eden oturumu geri yükler).

Puan:

- Çoktan seçmeli: doğruysa `100 + hız bonusu`, hız bonusu = `round(50 * max(0, 1 - ms / 15000))`; art arda
  doğrularda seri bonusu `min(50, 10 * (seri - 1))` (seri bu turu da sayar). Yanlış: 0 ve seri sıfırlanır.
- `map-guess`: mesafe haversine ile km; `points = round(1000 * exp(-km / 2000))` (en fazla 1000/tur).
  Web'deki harita oyununun formülü (`apps/web` altında `distance` testi/kodu) farklıysa o formül
  esas alınır ve belgelenir.
- Toplam puanlar tek oturumda sınırlıdır (çoktan seçmeli ≤ 2000, `map-guess` ≤ 5000).

Liderlik ve istatistik:

- `GET /v1/leaderboards/:gameType?period=all|week|day&limit=` (public; kullanıcı başına **en iyi** tek
  oyun puanı; yalnız `displayName`, e-posta asla) ve `gameType=overall` (kullanıcının oyun türü başına en
  iyilerinin toplamı). `GET /v1/leaderboards/:gameType/me` → sıram ve en iyim.
- `GET /v1/users/me/stats` (oyun türü başına oynama, en iyi, toplam, ortalama, son oynama),
  `GET /v1/users/me/scores` (sayfalı geçmiş).
- Admin: `DELETE /v1/scores/:id` (hileli puanı sil).

## 9. API istemcisi (`@wangoh/api-client`)

- TS kaynağı olarak tüketilir (`exports["."] = "./src/index.ts"`), derleme adımı yok. Web `next.config.ts`
  içinde `transpilePackages`, Metro doğrudan okur.
- `pnpm --filter @wangoh/api-client generate` = Orval; girdi `../../apps/api/openapi.json`; çıktı
  `src/generated` (commit'lenir). Kökte `pnpm generate:api` önce OpenAPI'yi dışa aktarır sonra üretir.
- Üretilen kancalar 2xx'te **doğrudan `T` verisini** döndürür; 2xx dışı durumda mutator `ApiError`
  fırlatır (`status`, `code`, `message`, `details`).
- Sabit arayüz:

```ts
export interface ApiClientConfig {
  baseUrl: string;                                           // sonda "/" yok, yollar /v1 ile başlar
  getAccessToken: () => string | null | Promise<string | null>;
  getRefreshToken: () => string | null | Promise<string | null>;
  onTokensRefreshed: (t: { accessToken: string; refreshToken: string }) => void | Promise<void>;
  onAuthFailure: () => void;                                 // yenileme başarısız → oturumu kapat
  fetch?: typeof fetch;
}
export function configureApiClient(config: ApiClientConfig): void;
export class ApiError extends Error { status: number; code?: string; details?: unknown }
export function apiFetch<T>(url: string, init?: RequestInit): Promise<T>;  // Orval mutator
```

- 401 gelince (kimlik uçları hariç) tek uçuşlu (single-flight) yenileme; başarılıysa istek bir kez
  yeniden denenir, başarısızsa `onAuthFailure()`.
- `lang` her sorguya açıkça geçirilir; sorgu anahtarları Orval'ın ürettiği anahtarlardır (elle anahtar yok).

## 10. Mobil uygulama

- Expo Router, sekmeler: **Keşfet** (kıtalar → ülkeler → şehir ayrıntısı), **Blog**, **Oyunlar**,
  **Profil**; admin kullanıcıda ek **Yönetim** sekmesi (kullanıcılar, blog yazıları).
- Arayüz dili Türkçe. Marka: lacivert `#0a0e1a`, altın `#c8a45e`; karanlık tema ağırlıklı.
- Oturum belirteçleri `expo-secure-store` (web önizlemede `localStorage`); `configureApiClient` uygulama
  açılışında bir kez kurulur. Oturum açmadan Keşfet ve Blog okunabilir; Oyunlar ve Profil giriş ister.
- Boş/yükleniyor/hata durumları her ekranda ele alınır. Güvenli alan (safe area), klavye, erişilebilirlik
  etiketleri, 44 pt dokunma hedefi.
- İçerik verisi, ülke listesi, başkent, bayrak gibi bilgiler mobil kodda **yazılmaz**.

## 11. Çalışma kuralları (ajanlar için)

- **Git:** `git add/commit/stash/checkout/reset` ÇALIŞTIRMA. Commit'leri orkestratör atar. Çalışma dalı
  `feat/backend-and-mobile-app`. Push yok.
- **Dosya sahipliği:** yalnız kendi görev alanındaki dosyaları değiştir. Başkasının alanında sorun
  bulursan düzeltme; raporuna yaz. Paylaşılan dosyalar (kök `package.json`, `pnpm-workspace.yaml`,
  `turbo.json`, `apps/api/src/db/schema/*`, `app.module.ts`) yalnız o dosyanın sahibi olan görevce değişir.
- **Şema:** tüm tablolar temel görevde tanımlanır ve tek migrasyonda (`drizzle/0000_*.sql`) çıkar. Alan
  görevleri (content, blog, games) şemayı DEĞİŞTİRMEZ; eksik bulursa raporuna "schemaRequest" olarak yaz.
- **Bağımlılık kurma:** `flock /tmp/wangoh-pnpm.lock pnpm --filter <paket> add ...`. Mobilde
  `npx expo install` (yine `flock` içinde). Kilit dosyasını (`pnpm-lock.yaml`) elle düzenleme.
  Geçici "module not found" görürsen bir kez yeniden dene.
- **Uydurma yok:** restoran, puan, adres, fiyat, saat, çeviri uydurulmaz. Veri mevcut web içeriğinden
  gelir. Yasal/çerez metinlerine dokunma.
- **Dil:** kod ve API alan adları İngilizce; kullanıcıya görünen metinler (mobil arayüz, API hata
  mesajları) Türkçe; kod yorumları kısa ve Türkçe, yalnız "neden"i anlatır.
- **DTO/SQL kuralları:** JSON gövdede "isteğe bağlı ama null olamaz" alanlarda `@IsOptional()` değil
  `@IsOptionalNotNull()` (`common/validators.ts`); serbest metin alanlarına `@NoNullBytes()`. `count(*)` gibi
  ham `int8` ifadeleri iki sürücüde de `number` döner, `avg(...)` (`numeric`) dizgidir. Belirteç satırına
  dokunan yeni kod önce `TokensService.lockUser` ile kullanıcıyı kilitler.
- **Testler:** her alan görevi kendi testlerini yazar (e2e, gerçek PGlite bellek veritabanı, mock yok).
  Test verisini kendi kurar (ortak yardımcı: `apps/api/test/helpers`); başka modülün tohumuna bağlanmaz.
- **Kanıt:** "çalışıyor" demeden önce komutu çalıştır (derleme, tip denetimi, lint, test) ve çıktıyı
  raporla. Başarısız olanı gizleme.
- **Port çakışması:** test sunucuları için rastgele/boş port; dev sunucusunu (3001, 3200, 8081) başka
  görevlerin kullandığını varsay, kullandığını bitirince kapat.
- Web'e (`apps/web/src`, içerik) dokunma; yalnız bu belgede açıkça yazılan web dosyaları (kablolama,
  `scripts/export-api-seed.ts`, vercel-ignore betiği) istisnadır.
