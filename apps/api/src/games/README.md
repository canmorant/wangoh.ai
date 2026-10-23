# Oyunlar, puanlama ve liderlik tabloları

Sözleşme: [`docs/backend-mobil-mimarisi.md`](../../../../docs/backend-mobil-mimarisi.md) bölüm 8. Burası uygulama notlarıdır.

## Dosyalar

| Dosya | Görev |
| --- | --- |
| `scoring.ts` | Saf puanlama: hız/seri bonusu, haversine, harita puanı, koordinat doğrulama (`scoring.spec.ts`) |
| `rng.ts` | `Rng` türü, `crypto` tabanlı `cryptoRng`, testler için `seededRng`, `shuffle`, `sample` |
| `game-engine.ts` | Tür başına strateji (`flagQuizStrategy`, `capitalQuizStrategy`, `mapGuessStrategy`): tur kurma, cevap doğrulama, notlandırma, istemci görünümü (`game-engine.spec.ts`) |
| `games.service.ts` | Oturum yaşam döngüsü: başlat, geri yükle, cevapla, bitir (kilitler, zaman aşımı, tembel sona erdirme) |
| `leaderboards.service.ts` | Liderlik listesi, `/me`, sıra hesabı (`finish` da bunu kullanır) |
| `scores.service.ts` | `users/me/stats`, `users/me/scores`, yönetici puan listesi (`GET /v1/scores`) ve silme |
| `games.controller.ts`, `leaderboards.controller.ts`, `users-me.controller.ts`, `scores.controller.ts` | Uçlar (operationId: `gamesStartSession`, `gamesGetSession`, `gamesSubmitAnswer`, `gamesFinishSession`, `leaderboardsGet`, `leaderboardsMe`, `usersMeStats`, `usersMeScores`, `scoresList`, `scoresDelete`) |
| `games.runtime.ts` | `GameClock` (süre ölçümü) ve `GameRandom`: testler bunları `vi.spyOn` ile belirleyici yapar |
| `games.errors.ts`, `games.constants.ts` | Hata kodları (`GAME_*`) ve sabitler (tur sayıları, süreler, bonus katsayıları) |

## Tasarım kararları

- **Sır modeli:** hedef, koordinat, seçenekler ve verilen cevaplar yalnız `game_sessions.rounds` (jsonb) içinde durur ve
  oturum anında dondurulur (ülke adı çevirileri dahil). İstemciye giden her şey `GameStrategy.question/options` ile
  üretilen görünümdür; `StoredRound` hiçbir yanıta girmez. `GET` oturum yalnız tur sonuç özetini (`correct`, `points`,
  `timedOut`) verir, doğru cevabı değil. **Sınır:** `flag-quiz` sorusunda bayrağın kendisi sorudur, `flagUrl`/`flag`
  ülke kodunu taşır; `capital-quiz` ve `map-guess` kodu/koordinatı sorudan çıkarmaz. Ülke verisi (başkent, koordinat)
  zaten herkese açık `GET /v1/countries` uçlarında olduğundan bu bir "gizli veri" değil, sunucu kontrollü puanlama
  ve süre ölçümüdür: istemci puanı ya da süreyi belirleyemez.
- **Eşzamanlılık:** oturumu değiştiren her işlem sırayla (1) sahibinin `users` satırını `FOR NO KEY UPDATE`
  (`TokensService.lockUser`), (2) oturum satırını `FOR UPDATE` kilitler; kilit sırası `users → game_sessions → scores`,
  hesap silmeyle (`users FOR UPDATE`) kilitlenme olmaz. Sonuç: kullanıcı başına tür başına tek aktif oturum (veritabanı
  kısıtı olmadan), aynı tura çift cevapta tek kazanan, çift `finish`te tek puan satırı (`scores.session_id` unique ayrıca
  son savunma). Gerçek PostgreSQL kanıtı: `test/games-concurrency.e2e-spec.ts` (`TEST_DATABASE_URL` ile).
- **Süre ve sona erdirme:** süreyi sunucu ölçer (`round_started_at`, `GameClock`). Tur süresi 20 sn, ağ payı 3 sn;
  tur sayacının başlangıcından `elapsed > 23000 ms` (cevapsız turda `> 20000 ms`) zaman aşımıdır (0 puan, tur geçer). Oturum 30 dk; süresi dolan oturum ilk istekte `expired`
  yazılır (hata, işlem tamamlandıktan SONRA fırlatılır; yoksa geri alma işareti silerdi).
- **Başkasının oturumu 404:** olmayan oturumla aynı yanıt; 403 oturumun varlığını sızdırırdı.
- **Harita formülü:** web "Haritada Bul" ile aynı (`d ≤ 50 km` → 1000, sonra `exp(-(d-50)/1200)`); belgenin ilk taslağındaki
  `exp(-km/2000)` bırakıldı. `correct` = tur puanı ≥ 500. Hedef ülkenin merkez koordinatıdır (sınır verisi yok): büyük
  ülkelerde ülke içindeki bir nokta uzak sayılabilir.
- **Liderlik:** kullanıcı başına dönemdeki en iyi puan; sıra `rank()` (eşit puan aynı sıra), liste sırası (puan, ilk
  ulaşma anı, kullanıcı kimliği). Yanıtta kullanıcı kimliği/e-posta yok; `isMe` SQL'de hesaplanır. Devre dışı bırakılan
  kullanıcılar liste, sıra (`rank`, `finish` yanıtındaki dahil) ve oyuncu sayısından çıkar (`NOT_DISABLED`, `NOT EXISTS`);
  puanlar silinmez, hesap yeniden etkinleştirilince geri döner.
- **Tur sayacı ve geri bildirim payı:** ilk turun sayacı oturum oluşunca, sonraki turlarınki cevap anı + `FEEDBACK_GRACE_MS` (çoktan
  seçmeli 2 sn, harita 5 sn; `games.constants.ts`) sonra başlar: `round_started_at` ve `nextRound.startedAt` gelecekte olabilir. Geçen süre
  `max(0, cevap − round_started_at)`: pay içinde cevap 0 ms (tam hız bonusu), zaman aşımı sınırları (20 sn / 20 + 3 sn) aynı başlangıçtan
  ölçülür. Pay oturum ömrünü (`expires_at`, 30 dk) uzatmaz. `durationMs` artık gerçek duvar saatidir (oturum başı → son cevabın
  `answeredAt`'ı); eski "tur sürelerinin toplamı" pay içinde cevaplanan turları 0 sayıp `maxDurationMs` ile hile aramayı körleştirirdi. Takas:
  soru cevap yanıtıyla hemen geldiğinden pay içinde okuyan oyuncu ek düşünme süresi kazanır (tur başına en çok ≈ 7 hız puanı; tavan 1850 aynı).
- **`serverNow` (tur görünümü):** her tur görünümü (`round` / `nextRound` / `GET` oturumdaki `round`) yanıtın üretildiği sunucu saatini
  `serverNow` olarak taşır (`roundView`, `GameClock`): istemci kalan süreyi `deadlineAt - serverNow`, turun başlamasına kalanı
  `max(0, startedAt - serverNow)` ile aygıt saatinden bağımsız hesaplar (farkı yerel monotonik zamanlayıcıya uygular). `startedAt - serverNow`:
  cevap yanıtındaki `nextRound`te ≈ pay (belirleyici saatte tam), ilk turda ve payı geçmiş turda ≤ 0. Mevcut alanlar değişmedi (geriye uyumlu);
  `serverNow` tur görünümünü üreten yanıtın anıdır, bu yüzden aynı tur iki yanıtta yalnız `serverNow`da farklıdır.
- **Hız bonusu yuvarlaması:** `50 * (15000 - ms) / 15000` tam sayı bölümüyle hesaplanır. `1 - ms / 15000` kayan noktada tam
  .5 sonuçları (8250 ms → 22,5; toplam 7 süre) aşağı düşürüyordu; belgedeki `round(...)` yukarı yuvarlar (`scoring.spec.ts`).
- **Temizlik (yalnız başlatan kullanıcının kayıtları):** (1) 7 günden eski bitmemiş oturumlar silinir (terk/süresi dolmuşlar
  ve başka türde hiç dokunulmamış, çoktan süresi dolmuş `active` satırlar); (2) terk edilmiş/süresi dolmuş kayıtlardan yalnız
  en yeni `MAX_STALE_SESSIONS_PER_USER` (20) tutulur. Böylece bir hesap art arda başlatmayla satır sayısını (her biri birkaç KB
  `rounds`) 7 gün boyunca sınırsız şişiremez (önceden dakikada ~120 başlatma = IP başına ~350 KB/dk). Puanlı `finished` oturumlar
  (ve FK kademesiyle puanları) bu yolla hiç silinmez. **Sınır:** hiç geri dönmeyen kullanıcının en çok 20 terk + tür başına bir
  etkin satırı kalır (kullanıcı başına sınırlı); kullanıcıdan bağımsız süreli bir temizleyici yoktur. Bunun için `schemaRequests`:
  `game_sessions (started_at) WHERE status <> 'finished'` kısmi dizini (genel süpürme taraması tabloyu gezmesin).

## Hile müdahalesi ve bilinen sınırlar

- **Yönetici akışı:** liderlikteki görünen ad → `GET /v1/users?q=<ad>` → `GET /v1/scores?userId=…` (puan kimliği, `durationMs`,
  `userDisabled`) → `DELETE /v1/scores/:id` ve/veya `PATCH /v1/users/:id {disabled:true}` (devre dışı kullanıcı liderlikten düşer).
  `GET /v1/scores?maxDurationMs=2000` insanın ulaşamayacağı hızdaki oyunları (bot) toplu bulur: sunucu her turun süresini ölçüp
  `durationMs`e yazar.
- **Artık risk (oyun tasarımı sınırı, kapatılmadı):** doğru cevaplar herkese açık içerik uçlarından türetilebilir
  (`GET /v1/countries`: ad→kod, başkent, koordinat; bayrak sorusunda `flagUrl`/`flag` kodu taşır). Bu yüzden bir bot, tur başına
  birkaç yüz ms bekleyerek kusursuz puan alabilir (flag/capital 1850, harita 5000; ölçüm: 52-205 ms'de tamamlanan oyunlar). Tur başına
  bir "insan alt süresi" bilerek eklenmedi: bekleyen bot için etkisizdir, belgedeki 0 ms → 50 hız bonusunu ve belirleyici testleri
  bozar. Önlem tespit + müdahaledir (yukarıdaki akış); önleme için cevap bilgisini içerik uçlarından ayırmak (opak bayrak adresleri,
  opak seçenek kimlikleri) ya da hesap/IP başına oyun hız sınırı ürün kararı gerektirir.
- **`finish` yanıtı:** `rank` canlıdır (başkası aradan geçerse yinelenen çağrıda değişebilir); `scoreId`, puan ve `isPersonalBest` sabittir.

## Verimlilik (gerçek PostgreSQL 16, 100 bin kullanıcı, 800 bin puan, varsayılan `work_mem`)

Ölçüm: derlenmiş servisler gerçek PostgreSQL 16'ya karşı, sıcak önbellekle; kullanıcı başına ~8 puan, puanlar son 30 güne yayılı.

| Sorgu | Süre (sıcak) | Plan |
| --- | --- | --- |
| Tek tür, tüm zamanlar, ilk 20 | ≈ 190-230 ms | `scores_game_type_score_idx` ile türün 200 bin satırı → `DISTINCT ON` → `rank()` → ilk 20 |
| Tek tür, `week` / `day` | ≈ 90 / 35 ms | aynı, `created_at` süzgeciyle |
| `overall`, tüm zamanlar / `week` / `day` | ≈ 670 / 330 / 150 ms | tür başına ayrı `DISTINCT ON` + `UNION ALL` |
| `/me` tek tür (en kötü durum: en düşük puan) | ≈ 80 ms | en iyi: `scores_user_game_type_idx`; sıra: `scores_game_type_score_idx` aralığı; toplam oyuncu: dizin-yalnız tarama |
| `/me` `overall` | ≈ 500-680 ms | `overall` tablosunun tamamı |
| `finish` sırası (toplam oyuncu sayılmaz) | 1-60 ms | puan yükseldikçe daha az satır |
| Puan geçmişi sayfası | ≈ 1 ms | `scores_user_game_type_idx` |

`overall` önce tek `DISTINCT ON (user_id, game_type)` ile yazılmıştı; bu sorgu tüm tabloyu kullanıcıya göre sıralıyor ve
aynı veride ≈ 1,1 sn sürüyordu. Tür başına kola bölmek (her kol kendi dizinini tarar) ≈ 3 kat hızlandırdı (`work_mem` artırmak fark etmedi).
Devre dışı süzgeci (`NOT EXISTS` ile `users`) aynı veride, `EXPLAIN ANALYZE` ile (paylaşılan makine, ± birkaç on ms) ölçüldü: 0 ve 1000 (%1) devre
dışı kullanıcıyla tek tür listesi ≈ aynı (144 → 145 ms ve 233 → 200 ms), `/me` sıra ve toplam sayımları ≈ +5-10 ms (`Hash`/`Merge Anti Join`,
`users` üzerinde tek `Seq Scan`; `scores` tarafı aynı dizin taramasıdır). Tam liste türün bölümünü bir kez tarar; küçük/orta tablolarda ms düzeyindedir. Anonim liste HTTP düzeyinde 15 sn
önbelleğe alınabilir (`Cache-Control: public, max-age=15`). Çok büyük tablolar için (şemaya dokunulmadı, `schemaRequests`):
kullanıcı başına en iyiyi tutan bir özet tablo (`user_game_bests`) ve/veya `scores (game_type, created_at)` dizini; ayrıca
`game_sessions (user_id, game_type) WHERE status = 'active'` kısmi benzersiz dizini tek aktif oturum kuralını veritabanı
düzeyinde de bağlar.

## Testler

- Birim: `scoring.spec.ts`, `game-engine.spec.ts`.
- e2e (gerçek PGlite, mock yok): `test/games.e2e-spec.ts` (akışlar, hatalar, sızıntı, süre, hesap silme, temizlik ve satır sınırı),
  `test/leaderboards.e2e-spec.ts` (sıralama, eşitlik, dönemler, overall, referans modelle rastgele karşılaştırma, admin silme,
  devre dışı kullanıcılar), `test/games-admin.e2e-spec.ts` (yönetici puan listesi ve hile müdahalesi akışı),
  `test/games-contract.e2e-spec.ts` (gerçek yanıtların üretilen OpenAPI şemasına uyumu; `test/helpers/openapi-check.ts`),
  `test/games-stats.e2e-spec.ts` (istatistik, geçmiş, `users/me` rota çakışması). `test/games-concurrency.e2e-spec.ts` yalnız
  `TEST_DATABASE_URL` ile çalışır. Ortak yardımcılar: `test/helpers/games.ts` (ülke fixture'ı, `playThrough`, `insertScore`).
