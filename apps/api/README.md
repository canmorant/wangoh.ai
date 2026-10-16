# Wangoh API

NestJS 12 (ESM) ile yazılmış REST API. Kimlik doğrulama ve yetkilendirme, Drizzle ORM (PostgreSQL ya da
yerel PGlite), Swagger/OpenAPI. Mobil uygulama (`apps/mobile`) ve web (`apps/web`) `openapi.json` üzerinden
üretilen ortak istemciyi (`packages/api-client`) kullanır. Ortak sözleşme: [`docs/backend-mobil-mimarisi.md`](../../docs/backend-mobil-mimarisi.md).

- Node ≥ 20, pnpm 10 (kökte `corepack enable`).
- Tüm rotalar `/v1` altındadır. Swagger önek dışındadır: `/docs` (arayüz), `/docs-json` (belge).
- Veritabanı: `DATABASE_URL` varsa PostgreSQL (node-postgres), yoksa PGlite (dosya tabanlı, kurulum gerektirmez).

## Kurulum ve çalıştırma

```bash
pnpm install                    # kökte
pnpm dev:api                    # kökten: turbo → apps/api'de `pnpm dev`
# ya da
pnpm --filter api dev           # nest start --watch, varsayılan http://localhost:3001
```

Yerelde hiçbir ayar gerekmez: veritabanı `apps/api/.data/pglite` altında oluşur, migrasyonlar ve (varsa) tohum
açılışta uygulanır. `apps/api/.env` varsa geliştirme kolaylığı için okunur (`.env.example`'ı kopyalayın); gerçek
ortam değişkenleri her zaman önceliklidir. Üretimde değişkenler platformdan gelir.

| Komut (`pnpm --filter api <betik>`) | Açıklama |
| --- | --- |
| `dev` / `start:dev` | `nest start --watch` (aynı şey; `turbo run dev` bunu çağırır) |
| `build` | `nest build` → `dist/` (tsc). Çalıştırma ve OpenAPI dışa aktarma derlenmiş koddan yapılır |
| `start` / `start:prod` | `nest start` / `node dist/main.js` |
| `typecheck` | `tsc --noEmit` (kaynak + testler) |
| `lint` | `oxlint` (`src`, `test`) |
| `test` | `vitest run`: `src/**/*.spec.ts` ve `test/**/*.e2e-spec.ts` birlikte (gerçek PGlite, mock yok) |
| `db:generate` | `drizzle-kit generate`: şema değişince yeni SQL migrasyonu üretir (`drizzle/`, commit'lenir) |
| `db:seed` | Derlenmiş koddan migrasyon + tohum yükler (`pnpm build` sonrası; DATABASE_URL ya da PGlite). Sunucu gibi `apps/api/.env`i okur; belirteç imzalamadığından production'da `JWT_ACCESS_SECRET` istemez. Sunucu aynı PGlite klasörünü açıkken çalışmaz (aşağıda "PGlite tek süreç") |
| `openapi:export` | `nest build` sonrası `node dist/openapi/export.js` → `openapi.json` (commit'lenir) |

İstemciyi yeniden üretmek için kökte: `pnpm generate:api` (önce `openapi:export`, sonra Orval).

## Ortam değişkenleri

Doğrulama `src/config/env.ts` içindedir; geçersiz değer varsa süreç tüm sorunları listeleyen net bir hatayla
açılışta çöker.

| Değişken | Varsayılan | Açıklama |
| --- | --- | --- |
| `PORT` | `3001` | Dinlenen port |
| `NODE_ENV` | `development` | `development` / `test` / `production` |
| `DATABASE_URL` | yok | Yoksa PGlite. `postgres://...` |
| `PGLITE_DIR` | `.data/pglite` | PGlite klasörü; `memory://` bellek içi. Klasörü aynı anda tek süreç açabilir (`<klasör>.lock`) |
| `JWT_ACCESS_SECRET` | dev/test: güvensiz sabit | **Production'da zorunlu, ≥ 32 karakter** (dev varsayılanı production'da da reddedilir) |
| `ACCESS_TOKEN_TTL` | `15m` | `15m`, `1h`, `900` (sn); 1 sn – 1 gün |
| `REFRESH_TOKEN_TTL_DAYS` | `30` | 1–365 |
| `CORS_ORIGINS` | boş | Virgülle ayrılmış izinli kaynaklar. Production dışında `localhost`/`127.0.0.1` her zaman serbest |
| `TRUST_PROXY` | `false` | Ters vekil arkasında istemci IP'si (hız sınırı için kritik). `1` (atlama sayısı), `loopback`/`linklocal`/`uniquelocal`, virgülle ayrılmış IP/alt ağ listesi (`10.0.0.0/8, 192.168.0.0/16`) ya da `true`. Geçersiz değer (`yes`, `-1`, `10.0.0.0/33`...) diğer hatalarla birlikte açılışta Türkçe `ConfigError` listesine girer. Güvenmediğiniz zincirde `true` kullanmayın: IP sahteciliği sınırı atlatır |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | yok | İkisi birlikte verilirse açılışta idempotent admin oluşturulur (yalnız biri verilirse açılış hatayla durur) |
| `ASSETS_BASE_URL` | `https://wangoh.com` | Görsel/bayrak mutlak adresleri |
| `SEED_ON_BOOT` | dev/test `true`, production `false` | Tohum yükleme (idempotent upsert) |
| `MIGRATE_ON_BOOT` | `true` | Açılışta migrasyon |
| `SWAGGER_ENABLED` | `true` | `/docs` ve `/docs-json` |
| `BODY_LIMIT`, `BODY_LIMIT_LARGE` | `100kb`, `1mb` | JSON gövde sınırı; büyük sınır `/v1/blog/posts` altındaki POST/PUT/PATCH içindir |
| `RATE_LIMIT_ENABLED` | `true` | Hız sınırı anahtarı (testlerde kapalı gelir) |

## Veritabanı

- Şema: `src/db/schema/*.ts` (users, refresh_tokens, continents, countries, country_travel, cities, city_guides,
  blog_posts, game_sessions, scores). **Tek migrasyon** `drizzle/0000_init.sql`. Alan görevleri şemayı değiştirmez.
- `src/db/client.ts`: `createDatabase()` node-postgres ya da PGlite döner; ikisi de aynı Drizzle arayüzünü
  (`Database` tipi) sunar. Nest'te `@Inject(DATABASE) db: Database`. Ham SQL sonucu için `rowsOf()`.
  **PGlite tek bağlantıdır:** `db.transaction(async (tx) => ...)` içinde dış `db` yerine hep `tx` kullanın.
- **`int8` (bigint) iki sürücüde de `number`:** `count(*)`, `sum(...)::bigint`, `rank() over (...)` ve `int8[]` sonuçları PGlite'ta
  sayı, node-postgres'te varsayılan olarak dizgidir (`"1"`). `createDatabase` pg ayrıştırıcısını PGlite'a hizalar (`parseInt8`):
  güvenli tamsayı aralığında `number`, dışında `bigint` (JSON'a çevirmeden önce dönüştürün). `numeric` (`avg(...)`) iki sürücüde
  de dizgidir; sayı gerekiyorsa `::float8` ya da `Number(...)` kullanın. `test/db-types.e2e-spec.ts` ikisini de sınar.
- **PGlite tek süreç:** PGlite tek kullanıcılıdır; aynı klasörü iki süreç açarsa hata vermez, son kapanan diğerinin yazılarını
  ezerdi (ör. `pnpm dev` açıkken `pnpm db:seed`). Bu yüzden klasörün yanına `<klasör>.lock` (pid'li) yazılır, ikinci açılış net
  hatayla reddedilir; sahibi ölmüş bayat kilit devralınır, kilit `close()`ta ve çıkışta silinir. `memory://` kilit istemez.
  Bayat bir kilit yanlışlıkla yaşıyormuş gibi görünürse (ör. kapsayıcıda pid yeniden kullanımı) dosyayı silin.
- `src/db/migrate.ts`: migrasyon klasörünü `import.meta.url`'e göre çözer (`process.cwd()` kullanılmaz). node-postgres'te
  birden çok örnek aynı anda açılırsa danışma kilidi (advisory lock) migrasyonları sıraya dizer.
  Migrasyon, bağlantı sağlayıcısında uygulanır: hiçbir modül tablolar hazır olmadan örneklenmez.
- Açılış sırası: migrasyon → idempotent admin → `SEED_ON_BOOT` ise `runSeed(db, { dir })`
  (`src/db/seed/index.ts`: önce `seedContent`, sonra `seedBlog`; `dir` varsayılanı `apps/api/seed`).
- `users.token_version` ve `refresh_tokens.token_version` sözleşmedeki şemaya eklenmiş iki sütundur (aşağıda anlatılır).

### Admin bootstrap

`ADMIN_EMAIL`/`ADMIN_PASSWORD` varsa açılışta: hesap yoksa oluşturulur; zaten admin ise dokunulmaz (parola ezilmez);
aynı e-postayla `user` rolünde biri varsa **yalnız `ADMIN_PASSWORD` o hesabın parolasıyla eşleşirse** yükseltilir.
E-postalar doğrulanmadığından, adresi önceden kayıt edip yükseltilmeyi bekleyen birinin yetki kazanmasını önler.

## Kimlik doğrulama akışı

| Uç nokta | Erişim | Not |
| --- | --- | --- |
| `POST /v1/auth/register` | public | Her zaman `user`. 201 `{accessToken, refreshToken, expiresIn, user}` |
| `POST /v1/auth/login` | public | Aynı yanıt. Yanlış parola/bilinmeyen e-posta aynı 401 (sahte özetle süre eşitlenir) |
| `POST /v1/auth/refresh` | public | Belirteç döner (rotation): yeni çift verir, gönderilen tek kullanımlıktır |
| `POST /v1/auth/logout` | public | Belirtecin ailesini iptal eder; her durumda 204 |
| `GET /v1/auth/me` | user | |
| `PATCH /v1/users/me`, `POST /v1/users/me/password`, `DELETE /v1/users/me` | user | Parola değişimi 204 döner ve **tüm oturumları kapatır** (istemci yeniden giriş ister). Hesap silme parola ister (App Store) |
| `GET /v1/users`, `GET/PATCH/DELETE /v1/users/:id` | admin | Liste sayfalıdır (`page`, `pageSize ≤ 100`, `q`, `role`); `q`'daki `%`, `_`, `\` kaçırılır |
| `GET /v1/health` | public | Veritabanı bağlantısını da sınar |

- **Parola:** scrypt (`node:crypto`), 16 bayt rastgele tuz, `timingSafeEqual`, biçim `scrypt$N$r$p$tuz$özet`
  (varsayılan N=2^15, r=8, p=3). Parametreler özetin içindedir; maliyet artırılsa bile eski özetler doğrulanır.
  8–128 karakter, NFKC normalize edilir. E-posta kırpılır ve küçük harfe çevrilir; benzersizlik `lower(email)` üzerindedir.
- **Erişim belirteci:** JWT (HS256 sabit; `alg: none` ve başka algoritmalar reddedilir), `sub`, `iss`, `aud`, `jti`, `ver`,
  15 dk. **Rol belirteçte yoktur**: global `JwtAuthGuard` her istekte kullanıcıyı veritabanından yükler. Silinmiş/devre
  dışı kullanıcı ve rol değişikliği anında etkilidir. `ver`, `users.token_version` ile eşleşmelidir; parola değişimi
  bunu artırdığı için eski erişim belirteçleri 15 dk beklemeden düşer. Çıkış yalnız yenileme ailesini iptal eder;
  o ana kadar verilmiş erişim belirteci süresi dolana kadar (en çok 15 dk) geçerli kalır.
- **Yenileme belirteci:** 256 bit rastgele opak değer; veritabanında yalnız SHA-256 özeti. Her yenilemede döner.
  Talep atomiktir (`UPDATE ... WHERE used_at IS NULL`), aynı belirteçle eşzamanlı isteklerden yalnız biri kazanır.
  **Kullanılmış belirteç yeniden gelirse ailenin tamamı iptal edilir** (reuse detection). Bu sert kuralın bedeli:
  yanıtı alamayıp aynı belirteçle yeniden deneyen istemci oturumunu kaybeder; istemci yenilemeyi tek uçuşlu yapmalıdır.
  `refresh_tokens.token_version` parola değişimiyle yarışan yenilemelerin değişimden sonra yeni oturum üretmesini engeller.
- **Son admin koruması:** son *aktif* admin silinemez, `user`'a düşürülemez, devre dışı bırakılamaz, kendini silemez
  (409 `LAST_ADMIN`). Aktif admin satırları sabit sırayla `FOR UPDATE` ile kilitlenir; iki admin aynı anda birbirini düşüremez.
- **Kilit sırası (`users` -> `refresh_tokens`):** belirteç satırına dokunan her işlem (yenileme, giriş, çıkış, yeniden kullanım
  tespiti, parola değişimi, devre dışı bırakma, silme) önce sahibinin `users` satırını kilitler (`TokensService.lockUser`,
  `FOR NO KEY UPDATE`; silme `FOR UPDATE`). Sıra ters olursa yenilemenin `INSERT`ü FK denetimi için kullanıcıda `FOR KEY SHARE`
  ister, yöneticinin `FOR UPDATE`iyle karşılıklı bekler ve PostgreSQL "deadlock detected" ile birini 500'e düşürürdü. Aynı kilit
  işlemleri kullanıcı başına sıraya dizdiği için çıkış ve yeniden kullanım tespiti, sürmekte olan bir yenilemenin henüz işlenmemiş
  yeni belirtecini kaçırmaz (aile iptali kilit alındıktan SONRA, güncel görüntüyle çalışır). Yeni bir belirteç işlemi yazarken
  aynı sırayı koruyun. PGlite tek bağlantı olduğundan bunlar yalnız gerçek PostgreSQL'de görülür: `test/postgres-concurrency.e2e-spec.ts`.
- **Devre dışı bırakma** tüm yenileme belirteçlerini iptal eder; mevcut erişim belirteci anında 401 `AUTH_ACCOUNT_DISABLED` alır.
  Yanlış mevcut parola (şifre değişimi, hesap silme) **403** döner, 401 değil: istemci 401'i "oturum bitti" sayıp çıkış yapar.
- **Hız sınırı** (`@nestjs/throttler`, bellekte; çok örnekli dağıtımda örnek başına sayılır): genel IP başına 120/dk; kimlik uçları
  (`register`, `login`, `refresh`, `logout`, parola değişimi, hesap silme: `@StrictThrottle()`) IP başına 10/dk, tek ortak kova.
  Aşılırsa 429 `RATE_LIMITED` + `Retry-After`. Hesap bazlı kilitleme yoktur (aşağıda "Bilinen sınırlar").
- **HTTP:** Helmet (API için `default-src 'none'`, `/docs` için gevşetilmiş CSP), CORS beyaz liste (çerez/kimlik bilgisi yok),
  gövde sınırı, `x-powered-by` kapalı. Parola/belirteç/gövde/sorgu dizgisi asla loglanmaz; sunucu hataları yalnız temizlenmiş özet
  (SQL parametreleri olmadan) ve yığın çerçeveleriyle loglanır.

## Hata gövdesi

Her yerde aynı: `{ statusCode, code, message, details? }`. `message` Türkçe ve gösterilebilir, `code` makine okur.
Çerçevenin İngilizce/girdi yansıtan mesajları kullanılmaz. Beklenmeyen hata 500 `INTERNAL_ERROR`: hiçbir ortamda iç ayrıntı
dönmez (ayrıntı yalnız sunucu günlüğünde, SQL parametreleri olmadan). Doğrulama hatasında `details` = `[{ field, code, message }]`
(`field` noktalı yol; bilinmeyen alan `whitelistValidation`), **en fazla 50 kayıt** (`MAX_ERROR_DETAILS`).

### Girdi sınırları (kimliksiz istekler 500 üretmemeli)

Gövde ayrıştırıldıktan hemen sonra, doğrulama borusundan ÖNCE (`src/common/request-guards.ts`) denetlenir; ihlalde 400
`VALIDATION_FAILED` ve tek kayıtlı `details` döner:

- JSON derinliği en fazla 64 kapsayıcı (`maxDepth`): class-transformer/class-validator özyinelemelidir, binlerce seviye yığın taşırırdı.
- Nesne başına en fazla 500 anahtar (`maxKeys`): her bilinmeyen anahtar ayrı hata üretir, 100 kb'a ~9500 anahtar sığar.
- Eşleşmemiş vekil karakter (`\ud800` gibi, anahtar ya da değerde; `isWellFormed`): `validator.js` `isEmail` içinde `encodeURI`
  `URIError` fırlatırdı. Geçerli vekil çifti (emoji) kabul edilir.
- Yolda ya da sorgu dizgisinde `%00` (NUL): PostgreSQL metinde NUL kabul etmez (`invalid byte sequence`), `q`/`slug`/`tag` gibi
  dizgi parametreleri 500 olurdu. `%2500` sıradan metindir. JSON gövde alanları için `@NoNullBytes()` kullanın (aşağıda).

Kodlar: `VALIDATION_FAILED`, `BAD_REQUEST`, `NOT_FOUND`, `FORBIDDEN`, `CONFLICT`, `RATE_LIMITED`, `PAYLOAD_TOO_LARGE`,
`INTERNAL_ERROR`, `SERVICE_UNAVAILABLE`, `AUTH_REQUIRED` (belirteç yok), `AUTH_INVALID_CREDENTIALS`, `AUTH_EMAIL_TAKEN`,
`AUTH_TOKEN_INVALID`, `AUTH_ACCOUNT_DISABLED`, `LAST_ADMIN` (`src/common/errors.ts`).

## Swagger / OpenAPI

- Arayüz `http://localhost:3001/docs`, belge `http://localhost:3001/docs-json`. Bearer şeması adı `bearer`.
- `operationId` = `<DenetleyiciAdıSonekSiz><MetotAdıBüyükHarfle>`: `AuthController.login` → `authLogin`,
  `ContentController.listCountries` → `contentListCountries` (Orval kanca adları buradan çıkar). Benzersizlik test edilir.
- **`openapi.json` commit'lenir.** Sözleşme değişince `pnpm --filter api openapi:export` çalıştırıp commit edin. e2e testi
  (`test/openapi.e2e-spec.ts`) commit edilen dosyayı üretilen belgeyle bayt bayt karşılaştırır; güncel değilse test kırılır.
  Üretim ortamdan bağımsızdır (env yok sayılır, PGlite bellek, anahtarlar sıralı) ve deterministiktir.
- **Swagger CLI eklentisi kullanılmıyor, DTO'larda açık `@ApiProperty` yazılır.** Eklenti ESM'de çalışıyor, ama yalnız `nest build`
  sırasında devreye girer; vitest (oxc) çalıştırmaz. Denendi: eklenti belgeye `minLength` gibi çıkarımlar ekliyor, `nest build`
  çıktısı ile testte üretilen belge ayrışıyor ve güncellik testi imkânsızlaşıyor. Açık `@ApiProperty({ type: ... })` iki yolda aynı belgeyi verir.
- **Kural:** korumalı denetleyici/metotlara `@ApiBearerAuth()` yazın, `@Public()` olanlara yazmayın (test tüm modüller için denetler).
  Hata yanıtları için `@ApiErrors(400, 401, 403...)`, sayfalı yanıt için `class XPageDto extends PaginatedDto(XDto) {}`.

## Dizin yapısı

```
src/
  main.ts            yalnız dinler (.env okur, createApp çağırır)
  bootstrap.ts       createApp(): ValidationPipe, Helmet, CORS, trust proxy, gövde sınırı, Swagger, /v1 öneki
  app.module.ts      AppModule.register(config): modüller, global guard'lar (hız sınırı → JWT → rol), hata filtresi
  paths.ts           drizzle/, seed/, openapi.json yolları (import.meta.url'e göre)
  config/            ortam doğrulama (loadConfig), .env yükleme (dotenv), APP_CONFIG
  db/                schema/*.ts, client.ts, migrate.ts, admin-bootstrap.ts, seed/{index,cli}.ts, db.module.ts
  common/            decorators, guards, filters, errors, validation, validators, request-guards, startup-error, pagination, lang, like, pipes, transforms, api-docs
  auth/  users/      kimlik doğrulama, kullanıcılar
  content/ blog/ games/   alan görevleri (boş iskelet: modül + tohum imzası)
  health/            GET /v1/health
  openapi/           document.ts (üretim), export.ts (dosyaya yazar)
drizzle/             SQL migrasyonları (commit)     openapi.json   üretilmiş sözleşme (commit)
test/                e2e testleri ve helpers/
```

## Alan görevleri için sözleşme (content / blog / games)

- Modül iskeletleri hazır ve `AppModule`'e bağlı: `ContentModule`, `BlogModule`, `GamesModule`. Tohum imzaları sabit:
  `seedContent(db, { dir })` ve `seedBlog(db, { dir })` (`Promise<void>`, idempotent upsert, `dir` yoksa sessizce atla).
  `app.module.ts` ve `src/db/schema/*` başkasının dosyasıdır; eksik sütun için "schemaRequest" yazın.
- DB: `@Inject(DATABASE) private readonly db: Database`. Tarih sütunları `Date`, yanıtta `.toISOString()`.
- Erişim: varsayılan **kapalı**. Herkese açık uç `@Public()`; oturum varsa kullanıcıyı tanıyan ama anonime de açık uç
  (ör. blogda yöneticinin taslakları görmesi) `@OptionalAuth()`; yönetici ucu `@Roles("admin")`; kullanıcı `@CurrentUser() user: AuthUser`.
  `@OptionalAuth()` uçlarda `Authorization` başlığı varsa belirteç geçerli olmak zorundadır (aksi 401, istemci yeniler).
- **DTO kuralı:** JSON gövdede "isteğe bağlı ama null olamaz" alanlar için `@IsOptional()` değil `@IsOptionalNotNull()` kullanın
  (`common/validators.ts`). `@IsOptional()` `null`'ı da doğrulamadan geçirir; servis `dto.x !== undefined` ile yama kurunca `null`
  `NOT NULL` sütuna gider ve 400 yerine 500 olur. Veritabanına yazılan ya da aramada kullanılan serbest metin alanlarına
  `@NoNullBytes()` ekleyin (PostgreSQL `text`/`jsonb` NUL kabul etmez). Sorgu dizgisi parametreleri için URL denetimi zaten var.
- Girdi: `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })` globaldir, **örtük dönüştürme kapalı**: sayılar için
  `@Type(() => Number)`, mantıksal sorgu değeri için `@ToBoolean()` (`common/transforms.ts`). Sayfalama `PaginationQueryDto`
  (`page`, `pageSize ≤ 100`), `pageWindow()`, `toPage()`. `?lang=tr|en|es`: `LangField()`/`LangQueryDto`; çeviri seçimi
  `resolveTranslation(translations, completeLangs, lang)` → `{ lang, complete, value }` (Türkçeye düşer). Yol kimliği için
  `@Param("id", uuidParam())`. Arama için `containsIlike(column, term)` (joker kaçırma dahil).
- Hata: `throw AppException.notFound("...")`, `.conflict(msg, code)`, `.badRequest(...)`, `.forbidden(...)`, `.validation(details)`.
  Mesajlar Türkçe ve iç ayrıntısız olmalı. Benzersizlik ihlali için `isUniqueViolation(err, "dizin_adı")` (pg ve PGlite).
- Hız sınırı: kimlik/parola tahmin yüzeyi olan uçlara `@StrictThrottle()`.
- Büyük gövde: `/v1/blog/posts` öneki `BODY_LIMIT_LARGE` kullanır; başka yol gerekiyorsa `src/common/body-limit.ts`.
- PGlite tek bağlantıdır: işlem içinde `tx` kullanın; uzun CPU işlerini (hash) işlem dışında yapın.

## Testler

`pnpm --filter api test`: birim (`src/**/*.spec.ts`) ve e2e (`test/**/*.e2e-spec.ts`), **gerçek PGlite, mock yok**.

```ts
import { bearer, createAdmin, createTestApp, registerUser, type TestApp } from "./helpers/index.js";

let t: TestApp;
beforeAll(async () => { t = await createTestApp(); });   // her dosya kendi bellek içi veritabanını açar
afterAll(() => t.close());

it("...", async () => {
  const { accessToken } = await registerUser(t.http);     // gerçek kayıt; { user, accessToken, refreshToken, email, password }
  const admin = await createAdmin(t);                     // veritabanına admin yazar, gerçek girişle belirteç alır
  await t.http.get("/v1/users").set(bearer(admin.accessToken)).expect(200);
});
```

- `createTestApp({ rateLimit?, config?, extraModules? })`: uygulama boş bir yerel porta dinler (`t.url`), `t.http` supertest
  istemcisi, `t.db` aynı Drizzle arayüzü. Tohum yüklenmez, **hız sınırı kapalıdır** (açmak için `rateLimit: true` ya da özel
  sınırlar), scrypt ucuzdur (N=1024). Test verisini kendiniz kurun; başka modülün tohumuna bağlanmayın.
- Yardımcılar: `registerUser`, `loginUser`, `createAdmin`, `uniqueEmail`, `bearer`, `findUserRow`; belirteç yardımcıları
  `signAccessToken` (geçerli ya da bilerek bozuk), `unsignedToken`, `decodeJwt`, `expireRefreshToken`; `ProbeModule`
  (koruma dekoratörlerini sınayan test denetleyicisi, `extraModules` ile eklenir).
- **Gerçek PostgreSQL ile çalıştırma (isteğe bağlı):** `TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres pnpm --filter api test`.
  Her `createTestApp` geçici bir veritabanı açar ve siler; `test/postgres-concurrency.e2e-spec.ts` (gerçek paralel bağlantılarda
  son admin yarışı, eşzamanlı yenileme, parola değişimiyle yarışan yenileme, yenileme/giriş/çıkış ile yönetici devre dışı bırakma-silme
  arasında kilitlenme ve aile iptali yarışları, eşzamanlı migrasyon) ve `test/db-types.e2e-spec.ts`in node-postgres kolu yalnız bu kipte
  çalışır. Kilit yarışları belirleyici olsun diye süresi dolmuş bir `refresh_tokens` satırını ayrı bağlantıda kilitleyip `purgeExpired`
  adımını bekletir.
- **Derlenmiş çalıştırma yolu:** `test/entrypoints.e2e-spec.ts` kaynağı geçici bir klasöre derler (`tsc`, çalışma ağacındaki `dist/` ve
  `.env`e dokunmaz) ve `node dist/main.js` ile `node dist/db/seed/cli.js`i gerçek süreç olarak çalıştırır: yapılandırma/açılış hatası
  çıktısı ve çıkış kodları (SQL parametresi sızıntısı dahil), `.env` önceliği, SIGTERM ve PGlite kilidi. Birkaç saniye derleme ekler.
- Yetki sınırı değiştiğinde `test/rbac.e2e-spec.ts`, sözleşme değiştiğinde `test/openapi.e2e-spec.ts` kırılır: bu tasarım gereğidir.

## Bilinen sınırlar

- Hız sınırı bellekte ve IP bazlıdır: çok örnekli dağıtımda örnek başına sayılır (paylaşımlı depo gerekir); hesap bazlı
  deneme sınırı/kilitleme yok (dağıtık parola tahminine karşı sonraki adım).
- E-posta doğrulaması ve parola sıfırlama ("parolamı unuttum") bu sürümde yok; bu yüzden admin bootstrap yükseltmesi parola eşleşmesi ister.
- Çıkış erişim belirtecini sunucuda geçersiz kılmaz (en çok 15 dk). Parola değişimi ve devre dışı bırakma kılar.
- PGlite yalnız geliştirme/test içindir ve tek süreçlidir (kilit dosyasıyla korunur); üretimde `DATABASE_URL` ile PostgreSQL kullanın.
