# Google Maps listeleri — şablon

Paris ve diğer Fransa şehirlerindeki "Google Maps listesi" bölümünü başka şehirlere eklemek için.
Kod tarafı hazır: yeni şehir = 10 durak + 6 dilde durak adları + paylaşılan liste bağlantısı.

İlgili dosyalar:

- `src/content/maps-lists.ts` — şehir listeleri (`MAPS_LISTS`, anahtar `"ÜLKE:Şehir"`)
- `messages/{tr,en,es,de,ru,fr}.json` → `Guide.mapsPlaces` — durak adları
- `src/components/guide/GuideMapsList.tsx` — bölümün görünümü (değiştirmeye gerek yok)

---

## 1. Durakları seç (10 adet)

Kurallar:

1. **Her durak rehberin metninde geçmeli.** Rehberde anlatılmayan bir yeri listeye koymuyoruz.
2. **İlk ziyaret için seçki:** 5–6 ana simge (müze, anıt, bakış noktası), 2–3 semt/meydan/pazar,
   1–2 park veya sakin durak. Bir rota mantığı olsun.
3. **En fazla bir şehir dışı durak** (Versailles gibi). Varsa `note` ile "şehir dışında, tam gün"
   notu eklenir.
4. **Sıra:** rehberdeki gün planına ya da coğrafi kümelere göre (yakın yerler art arda).
5. **Google Maps sorgusu** yerin yerel/resmî adıyla yazılır: `"Musée du Louvre, Paris, France"`.
   Tıklayınca doğru yer açılmalı. Aynı adlı birden fazla yer çıkıyorsa semt veya şehir ekle.

## 2. Google Maps'te listeyi kur (Wangoh hesabı)

1. Google Maps → **Kaydedilenler** → **Yeni liste**.
2. Ad: `Wangoh · {Şehir} — 10 durak` (ör. `Wangoh · Roma — 10 durak`).
3. Açıklama: `wangoh.com {şehir} rehberinden seçilen ilk ziyaret durakları.`
4. 10 yeri **aynı sırayla** ekle (sorgudaki adı arat → Kaydet → listeyi seç).
5. Listeyi aç → **Paylaş** → **Bağlantıya sahip olan herkes görüntüleyebilir**.
   Ortak düzenlemeye **açma**.
6. Bağlantıyı kopyala (`https://maps.app.goo.gl/...`).

## 3. Koda ekle

### `src/content/maps-lists.ts` → `MAPS_LISTS`

```ts
"IT:Roma": {
  url: "https://maps.app.goo.gl/XXXXXXXX",   // 2. adımdaki bağlantı
  // note: "mapsRomeNote",                   // yalnız şehir dışı durak varsa
  stops: [
    { id: "colosseum", query: "Colosseo, Roma, Italy" },
    // … toplam 10 durak
  ],
},
```

Anahtar, rehberdeki Türkçe şehir adıdır (`"IT:Roma"`, `"TR:İstanbul"`, `"GB:Londra"`).

### `messages/*.json` → `Guide.mapsPlaces`

Her yeni `id` 6 dosyanın hepsine eklenir (tr, en, es, de, ru, fr). Eksik id varsa derleme
ve `npx tsx scripts/i18n.test.ts` hata verir.

Şehir dışı durak notu varsa `Guide.mapsXNote` anahtarı 6 dile eklenir ve
`maps-lists.ts`'teki `note` tipine yazılır.

### Kontrol

```bash
npx tsc --noEmit -p .
npx tsx scripts/i18n.test.ts
```

Sonra yerel önizlemede rehberin altındaki bölümü aç; 10 bağlantının her biri doğru yeri,
alttaki düğme Wangoh listesini açmalı.

---

## 4. Hazır örnek: Roma

Rehberde geçen yerlerden (Kolezyum, Forum ve Palatino, Pantheon, Trevi, Navona, Vatikan
Müzeleri, Aziz Petrus, Castel Sant'Angelo, Galleria Borghese, Trastevere). Şehir dışı durak yok.

```ts
"IT:Roma": {
  url: "",  // Google Maps listesi kurulunca
  stops: [
    { id: "colosseum", query: "Colosseo, Roma, Italy" },
    { id: "romanForum", query: "Foro Romano, Roma, Italy" },
    { id: "pantheon", query: "Pantheon, Roma, Italy" },
    { id: "trevi", query: "Fontana di Trevi, Roma, Italy" },
    { id: "navona", query: "Piazza Navona, Roma, Italy" },
    { id: "vaticanMuseums", query: "Musei Vaticani, Città del Vaticano" },
    { id: "stPeters", query: "Basilica di San Pietro, Città del Vaticano" },
    { id: "santAngelo", query: "Castel Sant'Angelo, Roma, Italy" },
    { id: "borghese", query: "Galleria Borghese, Roma, Italy" },
    { id: "trastevere", query: "Trastevere, Roma, Italy" },
  ],
},
```

| id | tr | en | es | de | ru | fr |
|---|---|---|---|---|---|---|
| colosseum | Kolezyum | Colosseum | Coliseo | Kolosseum | Колизей | Colisée |
| romanForum | Roma Forumu ve Palatino | Roman Forum and Palatine | Foro Romano y Palatino | Forum Romanum und Palatin | Римский форум и Палатин | Forum romain et Palatin |
| pantheon | Pantheon | Pantheon | Panteón | Pantheon | Пантеон | Panthéon |
| trevi | Trevi Çeşmesi | Trevi Fountain | Fontana di Trevi | Trevi-Brunnen | Фонтан Треви | Fontaine de Trevi |
| navona | Piazza Navona | Piazza Navona | Piazza Navona | Piazza Navona | Пьяцца Навона | Place Navone |
| vaticanMuseums | Vatikan Müzeleri | Vatican Museums | Museos Vaticanos | Vatikanische Museen | Музеи Ватикана | Musées du Vatican |
| stPeters | Aziz Petrus Bazilikası | St Peter's Basilica | Basílica de San Pedro | Petersdom | Собор Святого Петра | Basilique Saint-Pierre |
| santAngelo | Castel Sant'Angelo | Castel Sant'Angelo | Castillo de Sant'Angelo | Engelsburg | Замок Святого Ангела | Château Saint-Ange |
| borghese | Galleria Borghese | Borghese Gallery | Galería Borghese | Galleria Borghese | Галерея Боргезе | Galerie Borghèse |
| trastevere | Trastevere | Trastevere | Trastevere | Trastevere | Трастевере | Trastevere |

---

## 5. Hangi şehirlere önce? (mevcut rehberler, Ekim 2026)

Arama ve rezervasyon talebine göre (eDreams 2025 en çok aranan/rezerve edilen,
Euromonitor 2025, TÜİK, Google Türkiye 2025):

1. **Öncelik 1:** Roma, Londra, İstanbul, Barselona, Madrid, Tokyo, Bangkok, New York,
   Amsterdam, Milano, Lizbon, Antalya, Kapadokya
2. **Öncelik 2:** Venedik, Floransa, Atina, Prag, Viyana, Budapeşte, Seul, Dubrovnik,
   Napoli, Amalfi Kıyısı, Porto, Palma de Mallorca, Málaga, Santorini, Berlin, Kyoto
3. **Sonra:** diğer rehberler, talep sırasıyla
