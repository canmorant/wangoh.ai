import { CityGuide } from "./types";

export const lasVegas: CityGuide = {
  city: "Las Vegas",
  countryCode: "US",
  seoTitle: "Las Vegas Gezi Rehberi: Strip, Oteller, Ulaşım ve 4 Gün",
  seoDescription:
    "Las Vegas'ta Strip ve Downtown farkı, Harry Reid ulaşımı, resort fee, park ve araç, gerçek restoranlar, Red Rock, dört günlük gezi planı ve bütçe ipuçları.",
  h1: "Las Vegas Gezi Rehberi",
  lede:
    "Las Vegas, kumar oynamayan ziyaretçi için de güçlü bir tasarım, eğlence, yemek ve çöl üssüdür. Şehri iyi gezmenin anahtarı, kısa görünen Strip mesafelerini gerçek yürüyüş süresiyle, ucuz görünen oteli zorunlu ücretlerle birlikte hesaplamaktır.",
  quickFacts: [
    { label: "Önerilen süre", value: "3–4 gün" },
    { label: "Havalimanı", value: "Harry Reid (LAS)" },
    { label: "Şehir içi", value: "Yürüyüş + Deuce + Monorail" },
    { label: "Doğa günü", value: "Red Rock için araç/tur" },
    { label: "Temel risk", value: "Sıcak ve gizli sanılan ek ücret" },
  ],
  sections: [
    {
      heading: "Las Vegas'ı anlamak: Strip bir cadde, tek mahalle değil",
      id: "sehri-anlamak",
      body: [
        "Las Vegas Boulevard üzerindeki **Strip**, dev otel-kumarhane komplekslerinin yaklaşık kuzey-güney koridorudur. Haritada yan yana görünen iki tesis arasında iç mekânı bulma, köprü, yürüyen bant ve kavşaklarla yarım saat geçebilir. 'Bir sonraki otel' ölçüsü şehir bloğu gibi çalışmaz; günlük planı kuzey, orta ve güney Strip kümeleriyle kurun.",
        "**Downtown**, Strip'in eski adı değildir; birkaç kilometre kuzeyde, Fremont Street Experience ve Arts District çevresindeki ayrı merkezdir. Daha küçük blok, eski neon ve bağımsız işletme hissi sunar. Strip'te kalıp Downtown'a yürümek pratik değildir; Deuce, taksi/rideshare veya uygun araç planlayın.",
        "Şehrin belediye sınırı ile turistik Las Vegas aynı harita değildir: Strip'in büyük kısmı Clark County'de bulunur. Ziyaretçi için bunun önemi, park, vergi, esrar ve kamusal alan kurallarında hangi resmî kurumun yetkili olduğunu doğru okumaktır. 'Las Vegas kuralı' diye dolaşan sosyal medya cümlesini işletme veya yerel yönetim sayfasıyla doğrulayın.",
      ],
    },
    {
      heading: "Strip deneyimi: otelleri tema parkı gibi seçmek",
      id: "strip",
      body: [
        "Bellagio fıskiyeleri, Conservatory, Caesars Palace pasajları, Venetian iç mekânı ve güneydeki mimari ikonlar yürüyerek görülebilir; hepsini tek günün kontrol listesine çevirmek benzer koridorlarda yorulmanıza yol açar. Her kümeye bir ana deneyim, bir yemek ve bir esnek durak koyun. Ücretsiz görünen gösterinin bakım veya hava nedeniyle iptal edilebileceğini unutmayın.",
        "Kumarhaneler dışarıdan daha büyük ve içeride yön duygusunu zayıflatacak biçimde tasarlanmıştır. Toplantı noktası olarak yalnız otel adını değil, belirli giriş, restoran veya rideshare alanını paylaşın. Çocuklarla geçiş mümkündür ama oyun alanında durmaları yasaktır; aile etkinliği ve havuz erişiminin yaş kurallarını tesisten okuyun.",
        "Sphere, büyük prodüksiyonlar, konserler, spor ve rezidans gösterileri için resmi bilet kanalını kullanın. Yeniden satış bileti koltuk görüşü, transfer gecikmesi ve ücret riski getirir. Gün batımı/akşam saatinde aynı bölgeye binlerce kişinin çıkacağını düşünerek yemekten gösteriye kâğıt üzerinde kısa değil, gerçek bir tampon bırakın.",
      ],
    },
    {
      heading: "Downtown, Fremont ve Arts District",
      id: "downtown",
      body: [
        "Fremont Street Experience, kapalı yaya alanı, büyük ekran gösterisi ve canlı eğlenceyle Strip'ten farklıdır. Kalabalık, yüksek ses ve sokak performansı deneyimin parçasıdır. Fotoğraf çektiren kostümlü performansçıyla ücretin kendiliğinden netleşeceğini varsaymayın; hizmetten önce konuşun.",
        "Neon Museum, şehrin tabela ve tasarım tarihini okumak için en anlamlı ücretli duraklardan biridir. Açık hava koleksiyonu sıcaklık ve gece ışığına göre farklı hissedilir; zamanlı bileti ve güncel erişim koşulunu resmî siteden alın. Mob Museum ise organize suç klişesini hukuk, toplum ve kolluk tarihiyle bağlama oturtur.",
        "Arts District, galeriler, vintage dükkânlar, bira ve bağımsız yemek için Fremont'tan ayrı bir koridordur. First Friday gibi etkinliklerde yol/park düzeni değişebilir. Downtown günü kurarken Neon Museum, Fremont ve Arts District'i haritada gerçek mesafeleriyle dizin; öğlen çöl sıcağında aralarını yürümeyi varsaymayın.",
      ],
    },
    {
      heading: "Harry Reid Havalimanı: terminal ve pickup ayrıntısı",
      id: "havalimani-ulasim",
      body: [
        "Harry Reid International (LAS), Strip'e çok yakın görünür fakat terminalden otele yaya erişim yoktur. Uçuşunuzun Terminal 1 mi Terminal 3 mü olduğunu doğrulayın; terminaller birbirine yürüyüşle bağlı değildir. Yanlış terminale giderseniz havalimanı içi shuttle ve ek süre gerekir.",
        "Rideshare pickup, resmî havalimanı bilgisinde Terminal 1 otoparkının 2. katında; Terminal 3'te valet seviyesindedir. Uygulamadaki sürücü piniyle terminal tabelasını eşleştirin. Taksi sırası ayrı ve düzenlidir; iki-üç kişi için rideshare surge fiyatıyla taksimetre/zone uygulamasını karşılaştırın.",
        "RTC toplu taşıması ekonomik ama bagaj ve otel durağına göre yavaş olabilir. Terminal 1'de 108, 109 ve Centennial Express (CX); Terminal 3'te CX bağlantısı bulunur. Güncel güzergâh ve transferi RTC planlayıcıda kontrol edin. Her otel 'airport shuttle' sunmaz; ücretsiz servis varsaymayın.",
        "Araç kiralama merkezi terminal dışında, shuttle ile ulaşılır. Red Rock veya bölge dışı rota dışında şehir günlerinde araca ihtiyacınız olmayabilir. Varışta kiralayıp otel parkına ücret ödemek yerine, doğa gününüz için mahalle/otel çevresindeki teslim noktalarını da fiyatlandırın.",
      ],
    },
    {
      heading: "Deuce, Monorail ve kısa görünmeyen yürüyüşler",
      id: "toplu-tasima",
      body: [
        "RTC'nin **Deuce** otobüsü Strip boyunca Downtown'a uzanan ziyaretçi omurgasıdır. Trafiğe bağlı olduğu için akşam yoğunluğunda harita süresini aşabilir. Bilet/pass seçenekleri ve araç takibi için rideRTC kullanışlıdır; ödeme ürünü ve geçerlilik alanını güncel RTC sayfasında teyit edin.",
        "Las Vegas Monorail, Strip'in doğu tarafında MGM Grand ile SAHARA arasındaki istasyonları bağlar. Havalimanına veya Downtown'a gitmez. Oteliniz batı tarafındaysa istasyona ulaşmak için dev kompleksin içinden ve üst geçitlerden yürümek gerekebilir; istasyon adını otel lobisiyle aynı nokta sanmayın.",
        "Monorail resmî saatleri günlere göre değişir ve sabah erken başlayıp gece geçe uzanır; kesin son treni seyahat günü kontrol edin. Birkaç doğu yakası oteli, kongre veya etkinlik zincirinde hızlıdır. Tek bir kısa yolculuk için istasyona erişim süresi Deuce veya yürüyüşten uzun olabilir.",
        "Yaya geçişinde geniş kavşakların üst köprüleri ve otel içi yönlendirme kullanılır. Asansör/yürüyen bant arızası erişilebilirlik ve sıcaklık sorununu büyütebilir. Su taşıyın, dışarıda en sıcak saatleri azaltın ve bir günde attığınız adımın 'arabasız şehir' göstergesi olmadığını bilin.",
      ],
    },
    {
      heading: "Nerede kalınır? Oda değil, toplam deneyim satın alırsınız",
      id: "nerede-kalinir",
      body: [
        "**Orta Strip**, ilk ziyaret ve farklı otellere yaya erişim için en dengeli; hafta sonu pahalı ve kalabalıktır. **Güney Strip**, havalimanı ve bazı aile/etkinlik tesisleri için pratik ama kuzeydeki duraklara uzaktır. **Kuzey Strip**, yeni kompleks ve Downtown yönüne yakınlık sağlayabilir; merkez gösterilerine erişim süresini ekleyin.",
        "**Downtown**, daha küçük ölçek, Fremont gece hayatı ve çoğu zaman farklı fiyat seviyesi sunar. Strip gösterilerine her gece gidecekseniz ulaşım masrafı avantajı silebilir. Havuz, gece kulübü ve restoran odaklı bir resortta tesis günü ayırmak; ucuz oda bulup her gün başka otele gitmekten daha anlamlı olabilir.",
        "Resort fee/mandatory destination fee hâlâ kritik maliyettir. FTC'nin 12 Mayıs 2025'te yürürlüğe giren ücret kuralı zorunlu ücreti fiyat gösteriminde daha baştan açıklamayı gerektirir; bu ücretin kaldırıldığı anlamına gelmez. Vergi, depozito, erken giriş, park ve isteğe bağlı ürünler ayrıca görünebilir.",
        "Check-in sırasında kartınıza oda toplamından yüksek geçici provizyon konabilir. Debit kart kullanımı kullanılabilir bakiyeyi günlerce azaltabilir; otelin incidentals tutarını ve iade süresini sorun. Minibar sensörü, odadaki ücretli su ve havuz/daybed koşullarını dokunmadan önce okuyun.",
      ],
    },
    {
      heading: "Otopark, kiralık araç ve çöl sürüşü",
      id: "araba-ve-park",
      body: [
        "Strip otellerinin park politikası markaya, sadakat seviyesine, etkinlik ve tarihe göre değişir. Eskiden ücretsiz olduğunu söyleyen bloga güvenmeyin; self-parking ve valet toplamını doğrudan tesisten kontrol edin. Bir otelde ödeme yapmak komşu otelin garajına veya tekrar girişe otomatik hak sağlamaz.",
        "Red Rock, Hoover Dam, Valley of Fire veya ulusal park yönünde araç esneklik sağlar. Kiralamada günlük fiyat yerine vergi, facility fee, sigorta, yakıt politikası, ek sürücü, one-way ve kart provizyonuyla toplamı karşılaştırın. Türkiye ehliyeti ve kiralama koşulunu şirketten yazılı teyit edin; uluslararası sürücü belgesi tek başına ehliyet değildir.",
        "Çölde yakıt, su, telefon kapsaması ve lastik basıncı şehir alışkanlığından daha kritik olabilir. Asfalt dışına kiralık sözleşme izin vermeyebilir. Yazın araçta insan veya hayvanı kısa süre bile bırakmayın; aracın klima çalışıyor olması mekanik arıza riskini ortadan kaldırmaz.",
        "Alkol veya esrar sonrası araç kullanmayın. Legal satış, her yerde tüketim anlamına gelmez; Las Vegas şehri kamusal tüketimin yasak olduğunu, yalnız lisanslı tüketim salonlarının istisna olabileceğini açıklar. Federal alanlar ve araç için ayrıca farklı kurallar bulunabilir.",
      ],
    },
    {
      heading: "Red Rock Canyon: rezervasyon penceresini kaçırmamak",
      id: "red-rock",
      body: [
        "Red Rock Canyon, Strip'e yakınlığına rağmen gerçek bir Mojave Çölü alanıdır. Bureau of Land Management, Scenic Drive için **1 Ekim–31 Mayıs arasında 08:00–17:00 girişlerinde zamanlı rezervasyon** ister. Kuralın yıl ve saat ayrıntısını seyahate yakın recreation.gov/BLM üzerinden doğrulayın.",
        "Scenic Drive tek yönlüdür; her manzara noktasında durmak ve kısa patika yürümek beklenenden uzun sürer. Gölgesiz parkur, yaz sıcaklığı ve ani sel riski ciddidir. Şehirde serin hissettiren sabah, kayada hızla ısınabilir. Yürüyüş sınıfınızı yalnız mesafeye göre değil, yükselti ve güneş maruziyetine göre seçin.",
        "Aracınız yoksa lisanslı tur, sürüş ve rezervasyon yükünü azaltır; fakat rota esnekliği ve yürüyüş süresini sınırlar. Rideshare ile tek yön gidip dönüş aracı bulmayı varsaymayın. Red Rock gününü gece geç gösteri sonrası çok erken kalkışla birleştirmek yerine dinlenme payı bırakın.",
      ],
    },
    {
      heading: "Las Vegas'ta yemek: büfe klişesinin iki tarafı",
      id: "ne-yenir",
      body: [
        "Las Vegas yemek sahnesi büfe, ünlü şef şubeleri, klasik steakhouse, Chinatown'daki bölgesel Asya mutfakları ve güçlü Meksika adresleri arasında yayılır. Strip içindeki marka restoran, markanın özgün şehirdeki deneyimiyle aynı olmayabilir; burada değer çoğu zaman servis, erişim ve gösteri öncesi lojistiktir.",
        "Chinatown, tek bir kapılı mahalle değil; Spring Mountain Road boyunca uzanan geniş bir ticari koridordur. Mekânlar arasında araç/rideshare gerekebilir. Lotus of Siam gibi yer için hangi konuma rezervasyon yaptığınızı kontrol edin. Tacos El Gordo'da farklı etler için ayrı sıra düzeni olabileceğinden çevrenizi izleyin.",
        "Klasik steakhouse fiyatında etiket kadar içecek, garnitür ve gratuity toplamı önemlidir. Büyük gruplarda automatic gratuity sık görülür; faturayı okumadan ikinci kez yüzde eklemeyin. Masa servisinde genel ABD geleneği vergi öncesi yüzde 15–20 olsa da service charge'ın personele nasıl dağıtıldığını işletmeden sorun.",
        "Büfeyi 'ucuz ve sınırsız' diye seçmeyin. Gün, servis dilimi, sıra ve içecek dahil olup olmadığı değeri değiştirir. Özel diyet/alergide açık büfe çapraz temas riskini personele sorun. Restoranın resmî sayfası yoksa otel dizini ve güncel telefon teyidi, eski bir influencer videosundan daha güvenlidir.",
      ],
    },
    {
      heading: "Sıcak, su ve gece ritmi",
      id: "mevsim",
      body: [
        "Yaz gündüz sıcaklığı yalnız rahatsızlık değil sağlık riskidir. Açık hava yürüyüşünü sabah/akşama alın, düzenli su ve elektrolit düşünün, alkolün susuzluğu artırdığını bilin. Otel içi klimalı bağlantı yararlı olsa da kompleksler arasında mutlaka dışarı çıkacağınız bölümler vardır.",
        "Kış gündüzü ılıman olabilir; gece çöl soğuğu şaşırtır. İlkbahar ve sonbahar açık hava için daha rahat, büyük etkinlik ve kongre fiyatlarına açıktır. Havuzun yıl boyu açık olduğunu, ısıtıldığını veya konaklamaya otomatik dahil olduğunu varsaymayın; tarih ve yaş kuralını otelden okuyun.",
        "Geceyi uzatmak şehrin doğasına uygun görünebilir, fakat ertesi sabah uçuşu veya çöl sürüşü dikkat ister. Gösteri, uzun akşam yemeği ve kulübü tek zaman çizgisine sıkıştırmayın. Mekân giriş kıyafeti, çanta boyutu ve yaş kimliği kuralları değişir; pasaport gibi kimliği güvenli taşıyın.",
      ],
    },
    {
      heading: "Bütçe, kumar ve güvenlik için net sınırlar",
      id: "guvenlik",
      body: [
        "Kumar oynayacaksanız kaybetmeyi göze aldığınız sabit tutarı önceden ayırın; ATM ve kredi erişimini planın parçası yapmayın. Ücretsiz içecek, bahşiş beklentisi ve oyun temposu harcamayı görünmez kılabilir. Oyunun kurallarını ve masa minimumunu oturmadan öğrenin; kaybı geri alma hedefi bütçe değildir.",
        "Kalabalıkta telefon/cüzdanı açık cepte taşımayın; otel koridoru ve otoparkta tabelalı, aktif güzergâhı kullanın. Rideshare için plaka, sürücü ve aracın uygulamayla eşleştiğini kontrol edin. Sokaktaki bilet, kulüp girişi veya 'ücretsiz VIP' teklifinde ödeme ve koşul net değilse uzaklaşın.",
        "Yetişkin eğlencesi, esrar ve açık alkol konusunda 'Vegas'ta her şey serbest' sözü yanlıştır. Tesis, ilçe, şehir ve federal alan kuralları farklıdır. Fotoğraf/video çekerken gösteri politikası ve başkalarının mahremiyetine uyun. Acil durumda 911; otel içi olayda güvenlik ekibi ve ön büro ilk bağlantı olabilir.",
      ],
    },
  ],
  places: [
    { name: "Lotus of Siam", area: "Flamingo Road / Red Rock", known: "Kuzey Tayland mutfağı", why: "Vegas'ın yemek kimliğinin Strip ünlü şeflerinden ibaret olmadığını gösteren, uzun ömürlü ve bölgesel menüsü güçlü bir kurumdur.", price: "Orta", tip: "Birden fazla konumu vardır; rezervasyonun adresini ve servis saatini resmî siteden teyit edin." },
    { name: "Golden Steer Steakhouse", area: "West Sahara", known: "1958'den beri klasik steakhouse", why: "Eski Vegas salonu, masa başı servis ve tarih duygusu için gidilir; yalnız büyük porsiyon et listesi değildir.", price: "Yüksek", tip: "Rezervasyon zor olabilir. Menü, kıyafet beklentisi ve iptal koşulunu doğrudan işletmeden okuyun." },
    { name: "Esther's Kitchen", area: "Arts District", known: "Mevsimsel İtalyan ve ekşi maya", why: "Downtown çevresindeki bağımsız, çağdaş yemek sahnesini otel komplekslerinden uzakta deneyimletir.", price: "Orta", tip: "Güncel Main Street adresini ve rezervasyonu resmî siteden doğrulayın; eski konum kayıtlarına dikkat edin." },
    { name: "Tacos El Gordo", area: "Strip / Charleston", known: "Tijuana usulü taco", why: "Adobada ve sakatat seçenekleriyle hızlı, canlı ve gösteri restoranlarından çok farklı bir Vegas öğünü sunar.", price: "Ekonomik", tip: "Yoğun saatte et türüne göre ayrı sıralar oluşabilir; doğru konum ve saat için resmî siteyi kontrol edin." },
    { name: "Peppermill Restaurant & Fireside Lounge", area: "Kuzey Strip", known: "Neonlu 24 saat Vegas estetiği", why: "Büyük Amerikan diner porsiyonunu ve eski Strip'in abartılı salon tasarımını tek durakta yaşatır.", price: "Orta", tip: "Restoran ve lounge yaş/servis düzeni farklı olabilir; güncel çalışma saatini aynı gün kontrol edin." },
    { name: "Barry's Downtown Prime", area: "Circa / Downtown", known: "Modern Downtown steakhouse", why: "Fremont gününü Strip'e dönmeden güçlü bir akşam yemeğiyle tamamlar; klasik steakhouse formunu çağdaş Downtown'a taşır.", price: "Yüksek", tip: "Etkinlik gününde Circa giriş ve yaş politikası etkili olabilir; restoran ve tesis koşullarını birlikte okuyun." },
  ],
  itinerary: [
    { title: "Orta Strip'i çözmek", morning: "Bellagio Conservatory ve çevre otellerini sakin saatte gezme; kompleksler arası gerçek süreyi ölçme.", afternoon: "Tek bir ücretli sergi/deneyim ve havuz/dinlenme; günün en sıcak saatini içeride geçirme.", evening: "Rezervasyonlu yemek, Bellagio çevresi ve önceden alınmış gösteri; mekânlar arasında tampon bırakın." },
    { title: "Güney ve kuzey Strip", morning: "Güney Strip mimarisi veya ilgiye göre müze; Monorail erişimini test etme.", afternoon: "Kuzey Strip/Sphere çevresi ya da resort günü; her oteli dolaşmak yerine bir ana etkinlik.", evening: "Chinatown yemeği veya kuzey Strip klasiği; dönüş pickup noktasını önceden belirleyin." },
    { title: "Downtown ve eski Vegas", morning: "Mob Museum veya Neon Museum için zamanlı ziyaret; sıcaklığa göre sıralamayı değiştirin.", afternoon: "Arts District dükkânları ve bağımsız öğle yemeği; etkinlik varsa yol kapanışını kontrol edin.", evening: "Fremont Street Experience ve Downtown akşamı; Strip oteline dönüşte Deuce süresi veya rideshare fiyatını karşılaştırın." },
    { title: "Red Rock Canyon", morning: "Mevsim gerekiyorsa zamanlı rezervasyonla erken Scenic Drive; seçilmiş kısa parkur ve bol su.", afternoon: "Manzara durakları, güvenli dönüş ve otelde dinlenme; en sıcak saatte uzun patikadan kaçının.", evening: "Esnek, yakın akşam yemeği. Uzun gösteriyi ancak sürücü dinlenmiş ve dönüş saati rahatsa ekleyin." },
  ],
  practicalHeading: "Las Vegas'ta geziyi belirgin biçimde kolaylaştıran bilgiler",
  practicalTips: [
    { title: "Resort fee kalkmadı", body: "2025 FTC kuralı zorunlu ücreti daha görünür toplamda göstermeyi gerektirir; tesis ücretinin artık alınmadığı anlamına gelmez." },
    { title: "Terminal 1 ve 3 yürüyüşle bağlı değil", body: "Uçuş ve pickup terminalini doğrulayın. Yanlış terminal, shuttle ve ciddi zaman kaybı demektir." },
    { title: "Rideshare katını bilin", body: "LAS resmî düzeninde T1 pickup otopark 2. kat, T3 pickup valet seviyesindedir; tabelayı uygulama piniyle eşleştirin." },
    { title: "Monorail havalimanına gitmez", body: "Doğu Strip otellerini bağlar; Downtown ve LAS için başka bağlantı gerekir." },
    { title: "Red Rock rezervasyon dönemi", body: "1 Ekim–31 Mayıs, 08:00–17:00 Scenic Drive girişi için zamanlı rezervasyon gerekir; güncel kuralı BLM'den doğrulayın." },
    { title: "Provizyonu check-in'de sorun", body: "Oda ücretine ek incidentals hold, özellikle debit kartta kullanılabilir bakiyeyi azaltabilir. Tutar ve serbest bırakma süresi otele göre değişir." },
    { title: "Kamusal esrar tüketimi yasak", body: "Yasal satın alma, sokakta veya araçta tüketim izni değildir. Yalnız lisanslı salonlar ve ilgili kurallar çerçevesinde hareket edin." },
    { title: "Suyu yürüyüşten önce alın", body: "Otel koridorları uzun, dış geçişler sıcak ve Strip üzerindeki küçük şişeler pahalı olabilir. Günün başında doldurulabilir şişe planlayın." },
  ],
  faqs: [
    { q: "Las Vegas için kaç gün yeterli?", a: "Üç gün Strip, Downtown ve bir gösteri için yeterli olabilir. Red Rock veya dinlenme/havuz günü eklenirse dört gün daha dengelidir." },
    { q: "Kumar oynamadan Las Vegas'a gidilir mi?", a: "Evet. Mimari, prodüksiyonlar, yemek, tasarım tarihi, havuzlar ve çöl rotaları güçlüdür. Yine de resortların kumarhane içi dolaşım mantığına hazırlıklı olun." },
    { q: "Las Vegas'ta araba gerekir mi?", a: "Strip ve Downtown için şart değildir; Deuce, Monorail ve rideshare yeterli olabilir. Red Rock ve bölgesel doğa için araç veya organize tur gerekir." },
    { q: "Resort fee ödememek mümkün mü?", a: "Zorunluysa rezervasyonun parçasıdır; 'tesisi kullanmadım' genellikle muafiyet yaratmaz. Üyelik/özel teklif koşulu dışında toplam fiyatı baştan karşılaştırın." },
    { q: "Havalimanından Strip'e Monorail var mı?", a: "Hayır. Monorail LAS'a gitmez. Taksi/rideshare veya otelinize uygun RTC otobüs bağlantısını kullanın." },
    { q: "Red Rock'a rideshare ile gidilir mi?", a: "Teknik olarak araç sizi bırakabilir, fakat dönüş aracı ve telefon kapsaması güvenilir değildir. Kiralık araç veya gidiş-dönüşü garanti eden tur daha emniyetli plandır." },
  ],
  relatedGuides: [
    { city: "Los Angeles", anchor: "Çöl rotasını Pasifik'e bağlayın", description: "Vegas eğlence ve doğa gününden, mahalle koridorları ile müze/sahil dengesine dayanan Los Angeles'a geçin." },
    { city: "San Francisco", anchor: "Batı rotasını kuzeye uzatın", description: "Strip'in büyük tesis ölçeğinden, toplu taşıma, yokuş ve körfez semtleriyle okunan kompakt bir şehre geçiş." },
  ],
  sources: [
    { name: "Harry Reid Airport — rideshare", url: "https://www.harryreidairport.com/taxi-and-ride-share/ride-share" },
    { name: "Harry Reid Airport — public bus", url: "https://www.harryreidairport.com/busses-shuttles/public-bus" },
    { name: "Las Vegas Monorail — route and hours", url: "https://www.lvmonorail.com/route-map/" },
    { name: "RTC — Strip and Downtown transit", url: "https://www.rtcsnv.com/ways-to-travel/transit-services/airport-transit-routes/" },
    { name: "BLM — Red Rock planning your visit", url: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon-national-conservation-area/planning-your-visit" },
    { name: "City of Las Vegas — marijuana laws", url: "https://www.lasvegasnevada.gov/News/Blog/Detail/marijuana-laws" },
    { name: "FTC — rule on unfair or deceptive fees", url: "https://www.ftc.gov/business-guidance/resources/rule-unfair-or-deceptive-fees-frequently-asked-questions" },
    { name: "Lotus of Siam", url: "https://lotusofsiamlv.com/" },
    { name: "Golden Steer", url: "https://goldensteer.com/" },
    { name: "Esther's Kitchen", url: "https://www.estherslv.com/" },
    { name: "Tacos El Gordo", url: "https://tacoselgordobc.com/" },
    { name: "Peppermill Las Vegas", url: "https://www.peppermilllasvegas.com/" },
    { name: "Barry's Downtown Prime", url: "https://www.barrysdowntownprime.com/" },
  ],
  volatileNote: "Resort/park ücretleri, gösteri ve havuz programları, transit tarifeleri, Red Rock rezervasyon kuralı ve restoran saatleri değişebilir; seyahate yakın resmî kanalları doğrulayın.",
  reviewed: "2026-08-09",
};
