# İçerik modülü (kıtalar, ülkeler, şehirler, rehberler)

Sözleşme: [`docs/backend-mobil-mimarisi.md`](../../../../docs/backend-mobil-mimarisi.md) 6. bölüm. Tablolar:
`continents`, `countries`, `country_travel`, `cities`, `city_guides` (`src/db/schema/content.ts`). Tüm yollar `/v1` altındadır.

| operationId | Uç | Erişim |
| --- | --- | --- |
| `contentListContinents` | `GET /v1/continents` | public |
| `contentGetContinent` | `GET /v1/continents/:slug` | public |
| `contentListCountries` | `GET /v1/countries` (sayfalı; `continent`, `hasTravel`, `q`, `lang`) | public |
| `contentGetCountry` | `GET /v1/countries/:code` (ülke + seyahat + şehir özetleri) | public |
| `contentListCountryCities` | `GET /v1/countries/:code/cities` (sayfalı; `q`, `lang`) | public |
| `contentGetCity` | `GET /v1/countries/:code/cities/:slug` (şehir + rehber gövdesi) | public |
| `contentUpdateCountry` | `PATCH /v1/countries/:code` | admin |
| `contentCreateCity` | `POST /v1/countries/:code/cities` | admin, 201 |
| `contentUpdateCity` | `PATCH /v1/countries/:code/cities/:slug` | admin |
| `contentDeleteCity` | `DELETE /v1/countries/:code/cities/:slug` | admin, 204 |

## Okuma

- Okuma uçları `@Public()` ve başarılı yanıtta `Cache-Control: public, max-age=300` taşır (`ContentCacheInterceptor`). Başlık yalnız
  başarıda yazılır: bugün 404 olan bir kaynak sonradan eklenince önbellekte kalmaz.
- `lang=tr|en|es` (varsayılan `tr`). İstenen dilde çeviri yoksa ya da `completeLangs` içinde değilse **Türkçeye düşülür**; yanıt sunulan
  dili (`lang`) ve istenen dilin tam sunulup sunulmadığını (`complete`) söyler. Şehir ayrıntısında kart ve rehberin dili ayrı ayrı
  çözülür (`guide.lang`, `guide.complete`). Çeviri uydurulmaz: yarım çeviri hiç yazılmaz (tohumda yalnız tam diller bulunur).
- **Liste uçları büyük jsonb yüklemez.** SQL yalnız `translations -> 'tr'` ve `translations -> '<lang>'` nesnelerini seçer (`content.sql.ts`).
  Rehber gövdesi yalnız şehir ayrıntısında, seyahat metinleri ve hub yalnız ülke ayrıntısında gelir.
- Ülke listesi sırası: `hasTravel=true` ise destinasyon sırası (`country_travel.position`), aksi halde istenen dildeki ad (katlanmış).
- **Arama (`q`)**: `ILIKE` Türkçe için yanlıştır (PGlite'ta `'Isparta' ILIKE 'ısparta'` eşleşmez) ve yerel ayara bağlıdır. Bu yüzden iki taraf
  da aynı tabloyla katlanır (`i ı İ I → i`, `ç→c`, `ş→s`, `ğ→g`, `ö→o`, `ü→u`, öteki Latin aksanlar da) ve düz `LIKE` ile karşılaştırılır
  (`search.ts`: `foldSearch` JS, `foldSql` SQL; ikisinin aynı sonuç verdiği `test/content-search.e2e-spec.ts` ile sınanır). `%`, `_`, `\`
  düz karakterdir. Ülkede ad (tr/en/es), resmî ad ve başkent; şehirde ad (tr/en/es) ve slug aranır. Terim 100 karakterle sınırlıdır.
- **Ülke çevirisi dil başına yalnız `name` ister** (`countries` tablosunda `complete_langs` yok): `officialName` ve `subregion` sunulan dilde
  yoksa `null` döner; Türkçe değer onların yerine konmaz (aksi halde bir nesnede iki dil karışır, `lang` yalanlaşır). Tohumdaki 196 ülkenin üç
  dili de tamdır; `null` yalnız yöneticinin eklediği kısmi bir dilde görünür.
- **Rehber paragraflarında `**kalın**`**: `sections[].body[]` ve `sections[].subsections[].body[]` satır içi `**kalın**` işaretlemesi taşır
  (tohumda 4.978 metin; web `<strong>` çizer). Başka işaretleme yoktur ve işlenmez. Düz metin çizen istemci (RN `Text`) `**` ayraçlarını
  ayıklamalı ya da kalın parçaları ayrı çizmelidir. Web'in bölme kuralı: `text.split(/(\*\*[^*]+\*\*)/)`. Üç metindeki tek `*` (ör. `*pet nit noi*`) düz
  karakterdir. Kaynak verideki dört gezi planı metninde (en 3, es 1: NL ve ID `itinerary[].afternoon`) kalıntı `**` vardır; web de aynı metni
  olduğu gibi gösterir, API düzeltmez.
- **PostgreSQL veritabanı UTF8 olmalı.** Arama ve ad sıralaması `translate()` ile katlar; `SQL_ASCII` kümede (ör. `initdb --locale=C` varsayılanı)
  çok baytlı harfler bayt bayt işlenir, `q=türkiye` sonuç vermez ve hiçbir hata çıkmaz. Açılışta kodlama denetlenir ve UTF8 değilse uyarı yazılır
  (`encoding.ts`, `ContentModule.onModuleInit`; açılışı engellemez). PGlite her zaman UTF8'dir.
- Görseller: veritabanında web yolu (`/images/<ad>.avif`) saklanır; yanıtta mutlak JPEG adresi gelir:
  `${ASSETS_BASE_URL}/og/<ad>.jpg` (web'in `/og` rotası AVIF'i 1200×630 JPEG'e çevirir; eski Android AVIF çözemez). https ile başlayan harici
  görsel olduğu gibi döner. Bayrak: `${ASSETS_BASE_URL}/flags/<iso2 küçük>.svg` (`assets.ts`).
- Şehir `slug`ı web'in `slugify(Türkçe ad)` çıktısıdır (`slug.ts`, `apps/web/src/lib/slug.ts` ile aynı); web adresleriyle (`/japonya/tokyo`)
  birebir eşleşir. Rehberdeki `relatedGuides[].slug` ve hub `routeIdeas[].cityLinks` yanıtta üretilir (Türkçe şehir adından slug'a).
- `:code` büyük/küçük harf fark etmez (`fr` → `FR`), `:slug` küçük harfe çevrilir; biçim bozuksa 400, kayıt yoksa 404.

## Yazma (yalnız admin)

- `PATCH /countries/:code` ve `PATCH /countries/:code/cities/:slug`: çeviri alanları **dil başına birleştirilir** (gönderilmeyen alan ve dil
  korunur); `en`/`es` için `null` o dili siler, Türkçe silinemez. Doğrulanmış sınıflarla (`dto/*.dto.ts`) gelir: bilinmeyen alan 400,
  uzunluk sınırı, boş metin, NUL karakteri, URL alanlarında yalnız https (`sources[].url`, `dietary...sourceUrl`, `officialUrl`), görselde
  yalnız `/images/<ad>.avif` ya da https.
- `completeLangs`: verilmezse korunur (çevirisi silinen dil düşer). Bir dili tam işaretlemek için o dilde zorunlu alanların hepsi dolu olmalı
  (şehirde ad+açıklama, seyahatte `description, signature, gateway, capital, bestSeason, flightTime, budget` ve Türkçede varsa `hub`,
  rehberde `seoTitle, seoDescription, h1, lede, quickFacts, sections, places, itinerary, faqs, reviewedAt`); aksi 400 `VALIDATION_FAILED`.
- Yanıttan alınan hub ya da rehber olduğu gibi geri yazılabilir: yanıta özgü `cityLinks` ve `relatedGuides[].slug` yok sayılır.
- **Şehrin Türkçe adı bağlantı anahtarıdır.** Hub rotaları (`hub.routeIdeas[].cities`) ve rehberin `relatedGuides[].city` alanı şehre Türkçe
  adıyla bağlanır (tüm dillerde; `cityLinks` ve `relatedGuides[].slug` yanıtta bu adla çözülür). Bu yüzden ad ülkede **benzersizdir** (ekleme ve
  yeniden adlandırmada çakışma 409 `CITY_NAME_TAKEN`; çakışmayan bir slug ile bile) ve Türkçe ad değişince aynı ülkenin hub rotaları ile tüm
  rehberleri aynı işlemde yeni adla güncellenir (`renameReferences`), bağlantılar kopmaz. Şehir silinirse onu anan metinler kalır, bağlantı
  üretilmez (`cityLinks`'ten düşer, `relatedGuides[].slug` `null` olur). Şehir/ülke yazmaları ülke satırını `FOR NO KEY UPDATE` ile kilitler
  (ad denetimi ile ekleme arasına ikinci bir istek giremez); `db:seed --force` yönetici düzenlemesiyle eşzamanlı çalıştırılmamalıdır.
- **Metinler NFC'ye çevrilir** (`decorators.ts` `Text`/`TextList`): ayrışık Unicode ("I" + U+0307) birleşik "İ" olarak saklanır; aksi halde ad arama
  terimiyle eşleşmez ve aynı ad iki kayıt olarak girilebilirdi. `reviewedAt` ve `dietary...lastVerified` takvimde var olan bir gün olmalıdır
  (`2026-13-45`, `0000-00-00`, `2025-02-29` 400; `dates.ts`). Nesne dizisi alanlarının her elemanı düz nesne olmalıdır: `[[]]` ve `[[nesne]]`
  400 `VALIDATION_FAILED` (aksi halde hub'a yazılan `routeIdeas: [[]]` o dilde ülke ayrıntısını kalıcı 500 yapar).
- `POST /countries/:code/cities`: `slug` verilmezse Türkçe addan türetilir; ülkede benzersiz olmalı (409 `SLUG_TAKEN`; adres önce denetlenir,
  sonra Türkçe ad: 409 `CITY_NAME_TAKEN`; eşzamanlı ikiz isteklerde tek kazanan). Ülke yoksa 404. `position` verilmezse sona eklenir. Rehber isteğe bağlıdır.
- `DELETE .../cities/:slug`: şehir ve rehberi (`ON DELETE CASCADE`) silinir. Not: tohum yeniden çalışırsa silinen **tohum** şehirleri eksik
  sayılıp geri eklenir.
- Gövde sınırı varsayılan 100 kb'tır (`BODY_LIMIT`); gerçek verideki en büyük tek dilli rehber gövdesi ~30 KB'tır. Bir rehberin üç dilini
  tek istekte göndermeyin; dil başına ayrı `PATCH` yeterlidir.

## Tohum

`seed/*.json` dosyaları `apps/web/scripts/export-api-seed.ts` ile web verisinden üretilir (elle düzenlenmez):

```bash
cd apps/web && npx tsx scripts/export-api-seed.ts          # yaz
cd apps/web && npx tsx scripts/export-api-seed.ts --check  # diskteki tohum güncel mi? (farklıysa çıkış kodu 1)
cd apps/web && npx tsx scripts/export-api-seed.test.ts     # sayılar, bütünlük, tr/en/es tutarlılığı
```

- Sayılar: 5 kıta, 196 ülke (dünya + Svalbard), 45 seyahat ülkesi, 360 şehir, 358 rehber (Pyramiden ve Barentsburg'un rehberi yok).
- Bir dil **yalnız o içerik o dilde tam çevrilmişse** yazılır (`complete_langs`); web'in çeviri katmanında olmayan hiçbir metin eklenmez.
- **Kıta:** seyahat içeriği olan 45 ülkede kıta, web'in rehber bölgesidir (`content/regions.ts`); öteki 151 ülkede dünya verisinin kıtası
  (`data/countries.ts`). Fark yalnız Türkiye'de: iki kıtaya yayıldığı için dünya verisinde Asya, sitenin rehber dizininde Avrupa'dır; API web
  ile aynı gruplamayı sunar (`GET /v1/continents` `travelCountryCount`: Avrupa 30, Asya 8, Amerika 5, Afrika 2). `subregion` coğrafi kalır
  (Türkiye: Batı Asya).
- **Adlar:** `countries.name` dünya listesinin (`data/countries.ts`) adıdır; 44 seyahat ülkesinde destinasyon adıyla aynıdır. Çek Cumhuriyeti'nde
  web'in destinasyon sayfası "Çek Cumhuriyeti" (adres `/cek-cumhuriyeti`), dünya listesi "Çekya" der: API `name: "Çekya"`, `officialName: "Çek
  Cumhuriyeti"` döner. Ülkeler API'de ISO koduyla (`:code`) anılır; Türkçe adı web slug'ına çevirmek desteklenen bir kullanım değildir.
  Destinasyonlardaki `shortName` (ör. ABD için "Amerika") kart başlıkları içindir, aktarılmaz.
- **Svalbard (`SJ`)** web'de ana sayfa ızgarasında gizli bir rotadır ama rehberleri ve sayfası vardır; şehirleri ve seyahat satırı için `countries`
  tablosunda satırı gerekir, bu yüzden `hasTravel=true` listesinin 45. (son) öğesi olarak herkese açık döner. `countries` tablosu oyun havuzu
  olduğundan SJ oyunlarda da çıkar; bayrağı Norveç'inkiyle (`NO`) aynı çizimdir, bu yüzden bayrak sorusunda ikisi aynı seçenekler arasındaysa
  belirsiz kalır (20.000 benzetilmiş bayrak oyununun 118'inde, yaklaşık %0,6, böyle bir tur çıktı). Çözüm oyun havuzunda (`games`) SJ'yi dışlamaktır; içerik modülü ve şema bunu
  ifade etmez.
- `seedContent(db, { dir, force? })` (`content.seed.ts`): sırayla `continents → countries → country_travel → cities → city_guides`, tek işlemde,
  toplu eklemeyle. Varsayılan **yalnız eksik satırları ekler** (`ON CONFLICT DO NOTHING`): yöneticinin sonradan yaptığı düzenlemeler yeniden
  açılışta ezilmez. `force: true` ya da `pnpm --filter api db:seed --force` mevcut satırları tohumdaki değerlere döndürür (upsert; şehir
  kimlikleri ve yöneticinin eklediği şehirler korunur). Klasör yoksa hata verilmeden atlanır ama `Seed` günlüğüne uyarı yazılır
  (`seed/` klasörü yalnız `dist/` kopyalayan bir imajda eksik kalırsa `db:seed` "başarılı" görünür, API 0 ülkeyle açılırdı); tek tek dosyalar isteğe
  bağlıdır. Bozuk dosya Türkçe, dosya ve alan adıyla bildirilir ve hiçbir şey yazılmaz.
- Tüm tohum PGlite'a birkaç saniyede yüklenir (makine yüküne bağlı; testlerde duvar saati sınırı yoktur). `test/content-real-seed.e2e-spec.ts`
  sayıları ve bütünlüğü doğrular.

## Testler

- `test/fixtures/seed`: küçük elle yazılmış tohum (3 kıta, 6 ülke, 2 öne çıkan, 4 şehir, 2 rehber; en/es kısmen tam). Davranış testleri
  yalnız bunu kullanır (`test/helpers/content-fixture.ts`): `content`, `content-admin`, `content-seed`, `content-search`, `content-contract`.
- `test/content-integrity.e2e-spec.ts` (fixture): iç içe dizi bypass'ı, takvim tarihleri, NFC, şehir adı anahtarı (yeniden adlandırma, çakışma,
  çözülemeyen bağlantı), yanıta fazladan alan sızmaması, tekrarlı `completeLangs`.
- `test/content-postgres.e2e-spec.ts`: yalnız gerçek PostgreSQL'de (`TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres`): şehir/ülke
  satırı kilitleri (eşzamanlı rehber yazımı, ikiz ad), yeniden adlandırma ile birlikte yazmalarda kilitlenme olmaması, SQL_ASCII uyarısı.
  PGlite tek bağlantı olduğundan bu yarışlar orada görünmez.
- `test/content-real-seed.e2e-spec.ts`: gerçek tohum; yalnız sayılar, bütünlük ve veri ↔ DTO uyumu (varsayılan akışta çalışır; süre sınırı yok).
