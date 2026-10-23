# Blog modülü

Sözleşme: [`docs/backend-mobil-mimarisi.md`](../../../../docs/backend-mobil-mimarisi.md) 7. bölüm. Tablo: `blog_posts`
(`src/db/schema/blog.ts`). Tüm yollar `/v1/blog/posts` altındadır.

| operationId | Uç | Erişim |
| --- | --- | --- |
| `blogListPosts` | `GET /v1/blog/posts` | `@OptionalAuth` (anonim yayındakileri görür) |
| `blogGetPost` | `GET /v1/blog/posts/:slug` | `@OptionalAuth` |
| `blogCreatePost` | `POST /v1/blog/posts` | admin |
| `blogUpdatePost` | `PATCH /v1/blog/posts/:id` | admin (yayınlama/taslağa alma dahil) |
| `blogDeletePost` | `DELETE /v1/blog/posts/:id` | admin, 204 |

## Görünürlük politikası (`status`)

- Liste: varsayılan `status=published`. `status=draft|all` **yalnız yöneticiye** açıktır; parametre başkası için sessizce yok
  sayılmaz: oturumsuz istek **401 `AUTH_REQUIRED`**, yönetici olmayan kullanıcı **403 `FORBIDDEN`**. Yönetici `status`
  vermezse liste yine yayındakilerle sınırlıdır (herkese açık görünüm).
- Ayrıntı (`:slug`): yönetici `status` vermese de taslağı görür (`status=published` ile daraltabilir); diğerleri yalnız yayındakini.
  Taslak, anonim ya da kullanıcı için hiç olmayan slug ile **aynı 404 gövdesini** verir (varlığı sızmaz).
- `@OptionalAuth`: `Authorization` başlığı varsa geçerli olmalıdır (aksi 401).

## Yanıt biçimi

- Liste: `{ items: BlogPostSummary[], page, pageSize, total }`; kartta **gövde yok**. Ayrıntı: aynı alanlar + `body`.
- `lang` (`tr|en|es`, varsayılan `tr`): başlık, özet **ve** gövde birlikte seçilir. İstenen dilde çeviri yoksa ya da yarımsa
  (başlık/özet/gövdeden biri eksik, yalnız görünmez karakterden oluşuyor ya da **en/es gövdesi boş**) tamamı Türkçeye düşer;
  `lang` sunulan dili, `complete` istenen dilin tam sunulup sunulmadığını, `availableLangs` kullanılabilir çevirisi olan dilleri
  söyler. Böylece yönetici önce başlık/özeti çevirip gövdeyi sonra yazarsa yayındaki yazıda boş makale görünmez; gövde dolunca çeviri
  açılır. Boş gövde yalnız Türkçede (taslak) serbesttir ve olduğu gibi sunulur.
- `imageCredits` (YALNIZ ayrıntı ve yazma yanıtları; kartta yok): kapağın (`coverImage`) zorunlu görsel atfı `[{ imageUrl, author, licenseName, licenseUrl, sourceUrl }]`.
  Kapak sitenin kendi görseliyse (`<kaynak>/og/<ad>.jpg`, kaynak `ASSETS_BASE_URL` ya da `https://wangoh.com`) ve görsel atıf gerektiriyorsa (CC BY / CC BY-SA...) tek öğe;
  CC0/kamu malı, atıf kaydı olmayan görsel, başka sitenin görseli ve kapaksız yazı için boş dizi. `imageUrl` = `coverImage`. Veri `image_credits` tablosundadır
  (içerik modülü, `ImageCreditsService`; ayrıntı için `src/content/README.md` "Görsel atıfları").
- `author`: `{ displayName } | null`. Yazar silinirse yazı kalır, `author` null olur. E-posta/kimlik hiçbir yanıtta yoktur.
- Sıralama: `coalesce(publishedAt, createdAt)` yeniden eskiye, eşitlikte `slug` artan (tohum yazıları aynı tarihi paylaşır).
- Filtreler: `tag` (tam eşleşme, küçük harf), `country` (ISO2, büyük/küçük harf fark etmez), `q` (slug, Türkçe ve istenen dildeki
  başlık/özet; `%`, `_`, `\` sıradan karakterdir), `page`, `pageSize ≤ 100`.

## Yazma kuralları

- `slug`: `^[a-z0-9]+(-[a-z0-9]+)*$`, 3–120 karakter, benzersiz (çakışma **409 `BLOG_SLUG_TAKEN`**). Kırpılır ve küçük harfe çevrilir.
- `translations`: `tr` zorunlu; `en`/`es` isteğe bağlı. Her dilde `title` (≤ 200), `excerpt` (≤ 1000), `body` birlikte verilir.
  `PATCH`te gönderilen dil **bütün olarak** değişir, gönderilmeyenler korunur, `en`/`es` için `null` çeviriyi siler (`tr` silinemez).
- `title`/`excerpt` ve her metin bloğu görünür bir karakter taşımalıdır: yalnız boşluk ya da görünmez karakterden (sıfır genişlikli
  boşluk, yumuşak tire, kelime birleştirici, Hangul dolgusu, Braille boşluğu...) oluşan metin boş sayılır (400 `isNotEmpty`).
  Metnin içindeki ZWJ/ZWNJ (emoji dizileri, Farsça) etkilenmez.
- `coverImage`: yalnız https (ya da `null`). `countryCode`: var olan ülke (yoksa 400 `unknownCountry`) ya da `null`. `tags`: ≤ 20,
  `normalizeTag` ile normalleştirilir (`blog-tags.ts`: Unicode NFC, `İ` -> `i`, küçük harf; **yerel ayar kullanılmaz**, bu yüzden
  "IĞDIR" -> "iğdir" olur), tekrarlar atılır. `?tag=` süzgeci, tohum yükleyici ve yazma uçları aynı kuralı kullanır:
  `?tag=İstanbul`, `?tag=istanbul` ve `?tag=ISTANBUL` aynı yazıları bulur.
- **Yayın zamanı:** istemci `publishedAt` gönderemez. Yazı ilk kez `published` olduğunda atanır; taslağa almak ve yeniden yayınlamak
  özgün zamanı korur. Yayındaki yazının Türkçe gövdesi boş olamaz (taslak olabilir).
- Yazma uçları `BODY_LIMIT_LARGE` (varsayılan 1 MB) kullanır (`src/common/body-limit.ts`); diğer uçlar 100 kb kalır. Aşılırsa 413.

## Gövde blokları (`src/blog/blog-blocks.ts`)

Düz blok dizisi; HTML/Markdown yok. Doğrulama tek yerde (`validateBlocks`): yönetici uçları, tohum yükleyici ve testler aynısını kullanır.
Hata `details` alanı sorunlu bloğu gösterir: `translations.en.body.3.url`.

| Tür | Alanlar |
| --- | --- |
| `heading` | `level` (2 \| 3), `text` (≤ 200) |
| `paragraph` | `text` (≤ 10 000; satır sonu serbest) |
| `list` | `ordered`, `items` (1–100 madde, her biri ≤ 1000) |
| `quote` | `text` (≤ 2000), `cite?` (≤ 200) |
| `image` | `url` (**yalnız https**, ≤ 2048), `alt` (zorunlu, ≤ 300), `caption?` (≤ 500) |

Bilinmeyen tür ve bilinmeyen anahtar reddedilir. En çok 300 blok, bir çevirinin toplam metni ≤ 100 000 karakter. Metinlerde kontrol
karakterleri (NUL, ESC...), satır/paragraf ayırıcıları, çift yönlü metin kontrolleri ve BOM reddedilir (başlık/liste maddesinde
satır sonu da). Görsel adresinde (blok `url` ve `coverImage`) `javascript:`, `http:`, `data:`, `//host`, göreli yol, kimlik bilgisi
(`https://k@host`), boşluk, ters eğik çizgi ve görünmez/yön belirleyici karakterler (RLO, LRI, sıfır genişlikli boşluk...) reddedilir.

## Önbellek (`Cache-Control`)

Aynı adres oturuma göre farklı içerik verebildiğinden (`BlogCacheInterceptor`):

- `Authorization` başlıklı her istek ve her yazma: `private, no-store` (taslak içerebilecek yanıt ortak önbelleğe ya da başkasına gitmez);
- anonim başarılı okuma: `public, max-age=60, stale-while-revalidate=300` + `Vary: Authorization`;
- uç işleyicisine ulaşan hata yanıtları (taslağın 404'ü dahil): `private, no-store`.

Kapsam sınırı: önbellek başlıklarını bir interceptor koyar ve interceptor guard'lardan ile gövde ayrıştırıcıdan SONRA çalışır. Bu yüzden
uç işleyicisine hiç ulaşmayan yanıtlarda (bozuk belirteçli 401, yetkisiz 403, hız sınırı 429, 413, bozuk JSON 400, `/v1/blog/` altındaki
bilinmeyen yolun 404'ü) bu başlık yoktur. Bunlar taslak içeriği taşımaz ve önbelleğe girmeleri için açık bir başlık da yoktur.

## Tohum (`seedBlog`, `seed/blog-posts.json`)

- Dosya `apps/web/scripts/export-blog-seed.ts` ile üretilir (`npx tsx scripts/export-blog-seed.ts`; `--check` güncel mi diye bakar).
  Her öne çıkan ülke merkezi (`countryHubs`) için bir yazı: `<ülke-slug>-gezi-rehberi`, etiketler `["ülke-rehberi", <kıta>]`,
  kapak `https://wangoh.com/og/<ad>.jpg`. **Yayın tarihi yazılmaz**: hub verisinde böyle bir bilgi yok ve sabit bir tarih (ör. "Ocak 2026")
  hem uydurma olur hem de gövdedeki sonraki tarihli ifadelerle (EES, vize, FCDO notları) çelişirdi. Tarihsiz tohum yazısı, API'ye ilk
  yüklendiği anda yayınlanmış sayılır: `publishedAt` = yükleme zamanı (tek yüklemede hepsi eşit, sıra `slug`a göre). `--force`
  yeniden yüklemesi var olan `publishedAt` değerini korur. Dosyada açık bir `publishedAt` varsa (elle derlenmiş gerçek tarih) o kullanılır.
  Metin yalnız mevcut hub içeriğinden gelir;
  bir dil, hub ve ülke verisi o dilde tam çevrilmişse eklenir (tr, en, es).
  Yalnız ızgarada görünen öne çıkan ülkeler (44) için yazı üretilir: Svalbard (SJ) sitede bilerek gizli bir hedeftir
  (`apps/web/src/data/secret.ts`; ızgarada yok, kaydırmayı sallayınca açılır), hub'ı olsa da blogda ifşa edilmez.
- `seedBlog(db, { dir })` idempotenttir ve **yalnız eksik slug'ları ekler**: yönetici düzenlemeleri ezilmez. Bedeli: yönetici bir tohum
  yazısını silerse ya da slug'ını değiştirirse eski slug eksik sayılır ve sonraki tohum çalıştırmasında yeniden eklenir.
  `seedBlogPosts(db, { dir, force: true })` var olanları tohumla değiştirir (kimlik, oluşturulma zamanı, yazar ve yayın zamanı korunur) ve
  ayrıntılı sonuç döner. `runSeed(db, { force: true })` ve `pnpm --filter api db:seed --force` blog tohumuna da `force` iletir: web hub içeriği
  güncellenip `export-blog-seed.ts` yeniden çalıştırıldıysa dağıtılmış veritabanındaki yazılar bu komutla yenilenir (yönetici düzenlemeleri
  ve yönetici eklediği en/es çevirileri de ezilir).
- Tohum yükleyici etiketleri yazma uçlarıyla aynı kuralla normalleştirir (`normalizeTag`), başlık/özeti ve bloklarını aynı doğrulayıcıyla
  denetler (görünmez karakterden oluşan metin geçersiz).
- Bağlı ülkesi veritabanında olmayan yazı (içerik tohumu yok) atlanır ve loglanır; geçersiz yazı da atlanıp loglanır. Dosya/klasör yoksa sessizce atlanır.
- Tohum yazılarının yazarı yoktur (`author: null`).

## Bilinen sınırlar

- Tohum eşlemesi `slug` üzerindendir. Yönetici bir tohum yazısının `slug`ını değiştirir ya da yazıyı silerse eski `slug` eksik sayılır ve sonraki
  tohum çalıştırmasında aynı ülke için ikinci bir yazı eklenir (sözleşmedeki tasarım takası). Bunu kalıcı çözmek için tohum yazılarını
  `slug`dan bağımsız bir anahtarla (ör. `blog_posts.seed_key`) işaretlemek gerekir; bu bir şema değişikliğidir (alan görevleri şemayı değiştirmez).
- Etiket küçük harfe çevirmesi yerel ayarsızdır: Türkçe "Iğdır" -> "iğdır" olur ("ığdır" değil). Etiketler dil bağımsız tanımlayıcıdır; bu
  seçim İngilizce "IT" gibi etiketlerin "ıt"ye dönüşmesini önler.

## Testler

`pnpm --filter api exec vitest run src/blog test/blog`. PGlite tek bağlantı olduğundan satır kilidi (`SELECT ... FOR UPDATE`) ve
güncelleme/silme yarışı yalnız gerçek PostgreSQL'de sınanır: `TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres` ile
`test/blog-concurrency.e2e-spec.ts` (satır ayrı bir bağlantıda kilitlenir, istekler kilide takılınca bırakılır; kayıp güncelleme, PATCH/DELETE
yarışı, aynı `slug` ile eşzamanlı oluşturma) ve `test/blog-seed.e2e-spec.ts`teki eşzamanlı tohum testi anlam kazanır.
Güncelleme yanıtının işlem içinde okunduğu PGlite'ta da `test/blog.e2e-spec.ts` ("eşzamanlı silme") ile sınanır.
