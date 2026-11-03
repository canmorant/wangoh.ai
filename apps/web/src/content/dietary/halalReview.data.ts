/**
 * Helal kayıtlarının web kanıtıyla denetimi (2026-11-03). OTOMATİK ÜRETİLDİ, elle düzenleme.
 * Gerekçe: Nice'teki Le Cèdre işletmesi helal olmadığını bildirdi; tüm helal kayıtlar arama kanıtıyla tarandı.
 *  - remove: işletme bulunamadı, helal olduğuna dair hiçbir kaynak yok ya da kayıt yanlış şehirde.
 *  - downgrade: yalnız dizin/yorum kaynağı var; "restoran doğruladı"/"sertifikalı" iddiası düşürülür.
 * Kayıt sayısı: 256. Uygulama: halalReview.ts.
 */
export interface HalalReviewEntry {
  countryCode: string;
  city: string;
  name: string;
  action: "remove" | "downgrade";
  /** GUCLU | ZAYIF | KANIT_YOK | SORUNLU | BULUNAMADI (denetim sonucu). */
  result: string;
  reason: string;
  sources: string[];
}

export const HALAL_REVIEW: readonly HalalReviewEntry[] = [
  {
    "countryCode": "AE",
    "city": "Abu Dabi",
    "name": "Meylas",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Restoranın kendi sitesinde ve Visit Abu Dhabi listesinde helal sertifikası ya da et tedariki ifadesi bulunamadı; Visit Abu Dhabi yalnızca genel olarak Emirati mutfağının varsayılan olarak helal olduğunu söylüyor (Meylas'a özel değil). Etihad rehberi alkol servisi olmadığını yazıyor. Kayıttaki 'tüm etler helal sertifika",
    "sources": [
      "https://visitabudhabi.ae/en/where-to-go/dining-and-restaurants/meylas",
      "https://meylas.com/en/",
      "https://etihad.com/en/abu-dhabi/dining-and-nightlife/meylas-abu-dhabi",
      "https://visitabudhabi.ae/en/things-to-do/culture/emirati-culture/food-and-coffee"
    ]
  },
  {
    "countryCode": "AE",
    "city": "Dubai",
    "name": "Al Fanar Restaurant & Cafe",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Markanın kendi blogu (Yas Mall şubesi yazısında) 'tüm yemekler helal' diyor; Al Seef şubesi sayfasında ve Michelin kaydında helal ifadesi görülmedi, sertifika bulunamadı. Al Seef şubesi kendi sitesinde 'Al Fanar Seafood Market Al Seef' adıyla geçiyor (konsept farkı olabilir). Kayıttaki Visit Dubai sayfası WebFetch ile ",
    "sources": [
      "https://www.alfanarrestaurant.com/al-seef-dubai",
      "https://www.alfanarrestaurant.com/post/where-to-eat-authentic-emirati-food-in-abu-dhabi",
      "https://guide.michelin.com/ca/en/dubai-emirate/dubai/restaurant/al-fanar"
    ]
  },
  {
    "countryCode": "AL",
    "city": "Berat",
    "name": "Homemade Food Lili",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran Berat'ta mevcut (HappyCow, Lonely Planet, In Your Pocket kayıtları var) ama hiçbir kaynak helal olduğunu söylemiyor; HappyCow sayfasındaki '(Halal)' etiketi başka bir işletmenin (Rus Traditional Food) adının yanında duruyor. Menüde ev yapımı şarap ve rakı geçiyor (tek başına sorun değil); bir rehber genel olar",
    "sources": [
      "https://happycow.net/reviews/lili-homemade-food-berat-144751",
      "https://www.inyourpocket.com/berat/homemade-food-lili_173999v",
      "https://www.milehacker.com/travel/albania/central-albania/berat/best-restaurants-in-berat-food-dining-local-cuisin/"
    ]
  },
  {
    "countryCode": "AL",
    "city": "Himarë",
    "name": "Taverna Lefteri",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Spile semtindeki Taverna Lefteri mevcut (1998'den beri, deniz ürünleri ve Yunan mutfağı, ızgara ahtapot öne çıkıyor) ama hiçbir sonuçta helal sertifika, helal et ya da helal menü ifadesi yok.",
    "sources": [
      "https://himara.net/taverna-lefteri",
      "https://himara.net/taverna-lefteri/find-us",
      "https://himara.pages.dev/blog/taverna-lefteri-review"
    ]
  },
  {
    "countryCode": "AL",
    "city": "Krujë",
    "name": "Kroi",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kale girişine yakın Kroi restoranı mevcut (pizza, dana bonfile, kuzu; Akdeniz/yerel mutfak, Google 4.5) ama hiçbir kaynak helal olduğunu söylemiyor, domuz/alkol politikasına dair bilgi de yok. Adres bilgisi (Rruga Kala) bir otel listesinden geliyor.",
    "sources": [
      "https://silvertraveladvisor.com/reviews/kroi-restaurant/",
      "https://hotels.webbanve.net/hotel/al/kroi.en-gb.html",
      "https://stay.albaniavisit.com/hotel-kroi-near-castle-entrance-castle-and-town-view/"
    ]
  },
  {
    "countryCode": "AL",
    "city": "Sarandë",
    "name": "Taverna Laberia",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Taverna Labëria Sarandë'de aile işletmesi geleneksel Arnavut restoranı olarak listeleniyor ama hiçbir kaynak helal demiyor; halal rehberleri Sarandë için başka mekânları (ör. Lezet Hotel & Restaurant) öneriyor. Uyarı: bir Wanderlog kaydı mekânın ızgara etlerini 'kuzu ve domuz' diye anlatıyor, ancak o kayıt Gjirokastër'",
    "sources": [
      "https://wanderlog.com/place/details/2704249/taverna-labëria",
      "https://wanderlog.com/place/details/4827161/taverna-labëria",
      "https://albaniavisit.com/halal-guide/"
    ]
  },
  {
    "countryCode": "AL",
    "city": "Theth",
    "name": "Bujtina Polia",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Theth'te restoranlı bir misafirhane olarak birçok listede var ama hiçbirinde helal ifadesi yok (helal kahvaltı seçeneği geçen Bujtina Berishta ve Shpjia e Gjyshit başka işletmeler).",
    "sources": [
      "https://thethi-guide.com/accomodation/bujtina-polia",
      "https://destinia.com/en/hotels/europe/albania/shkoder/theth/bujtina-polia/ho-1832323"
    ]
  },
  {
    "countryCode": "AL",
    "city": "Tiran",
    "name": "Oda",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Oda geleneksel Arnavut restoranı olarak mevcut (tave kosi, fërgesë, köfte, ızgara et, kuzu) ama hiçbir kaynak helal demiyor. Gerçek konumu Blloku değil: Yeni Pazar (Pazari i Ri) yakınında dar bir sokakta, Rruga Riza Jasa, Tiranë 1008; sitedeki 'Blloku / merkez' semtindeki 'Blloku' kısmı yanlış, 'merkez' kısmı makul.",
    "sources": [
      "https://adventurealbania.com/es/restaurantes-tirana/",
      "https://www.myglobalviewpoint.com/restaurants-in-tirana-for-traditional-albanian-food/",
      "https://www.albania-spirit.com/pl/guides/najlepsze-restauracje-tirana/"
    ]
  },
  {
    "countryCode": "AR",
    "city": "Bariloche",
    "name": "Jauja",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Bariloche'de Jauja restoranı var (Fodor's: makarna ve et/balık/av eti, yerel halkın tercihi) ama hiçbir kaynak helal demiyor. Helados Jauja ayrı bir dondurmacı.",
    "sources": [
      "https://www.fodors.com/world/south-america/argentina/the-lake-district/places/bariloche/restaurants",
      "https://au.trip.com/restaurant/argentina/san-carlos-de-bariloche/detail/restaurante-jauja-19915307"
    ]
  },
  {
    "countryCode": "AR",
    "city": "Buenos Aires",
    "name": "Al-Zein",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Al Zein/Al Zain Levanten restoranı var ama Buenos Aires helal rehberlerinde (HalalSpy, TableJourney) yok, hiçbir kaynak helal demiyor; Zabihah'taki 'Al Zein' ABD Georgia'daki başka işletme. Adres kaynaklarda çelişiyor: Av. Federico Lacroze 1660 (Palermo olarak listeli) ya da Arce 488 (Las Cañitas).",
    "sources": [
      "https://mapthemeal.com/buenos-aires/palermo/al-zein/",
      "https://halalspy.com/halal-food-guide/americas/buenos-aires/",
      "https://tablejourney.com/argentina/buenos-aires/dietary/halal/"
    ]
  },
  {
    "countryCode": "AR",
    "city": "El Calafate",
    "name": "La Zaina",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "El Calafate'de La Zaina (Patagonya mutfağı, şarap ağırlıklı, Malbec'te pişmiş kuzu ile ünlü) bulundu; hiçbir kaynak helal ya da helal et belirtmiyor.",
    "sources": [
      "https://elcalafate.tur.ar/restaurant/la-zaina-restaurant-en.htm",
      "https://wanderlog.com/place/details/1180489/la-zaina-cocina-patagnica",
      "https://thatch.co/places/179689/la-zaina-restaurant"
    ]
  },
  {
    "countryCode": "AR",
    "city": "El Chaltén",
    "name": "La Tapera",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "El Chaltén'de La Tapera (ızgara et, ev yapımı makarna, glütensiz menü) bulundu; hiçbir kaynak helal ya da helal et belirtmiyor.",
    "sources": [
      "https://www.welcomeargentina.com/elchalten/la-tapera.html",
      "https://wanderlog.com/place/details/1163011",
      "https://www.atly.com/gluten-free/location/LaTapera"
    ]
  },
  {
    "countryCode": "AR",
    "city": "Mendoza",
    "name": "El Sultán",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Mendoza'da 'El Sultán' adlı bir restoran bulunamadı; çıkan sonuçların hepsi İspanya (Córdoba, Granada, Sevilla) ve Fransa'daki aynı adlı mekânlar. Sorguda 'halal' kelimesi vardığı için bu, mekânın kapalı olduğunun kanıtı değil; talimat gereği ikinci arama yapılmadı.",
    "sources": []
  },
  {
    "countryCode": "AR",
    "city": "Puerto Iguazú",
    "name": "La Mamma Pastas",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "La Mamma Pastas and Salsas Puerto Iguazú merkezinde Bonpland sokağında ev yapımı ravioli, gnocchi ve makarna sunan bir yer; hiçbir kaynakta helal ya da domuzsuz mutfak ifadesi yok.",
    "sources": [
      "https://wanderlog.com/place/details/1180729/la-mamma-pastas-and-salsas",
      "https://www.kupibilet.ru/gid/argentina/puerto-iguasu/la-mamma-pastas-and-salsas"
    ]
  },
  {
    "countryCode": "AR",
    "city": "Salta ve Jujuy",
    "name": "Dubai",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Salta'da 'Dubai Cocina Árabe' (Wanderlog'da 'Comidas Arabes Dubai') adlı Arap mutfağı restoranı bulundu, kebap yorumları var; ancak hiçbir kaynakta helal et ya da helal sertifika ifadesi yok. Arap mutfağı olması helal olduğunu kanıtlamaz.",
    "sources": [
      "https://wanderlog.com/place/details/3231362/comidas-arabes-dubai",
      "https://www.welcomeargentina.com/salta/comidas.html"
    ]
  },
  {
    "countryCode": "AR",
    "city": "Ushuaia",
    "name": "Kuar",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kuar Ushuaia'da Beagle Kanalı kıyısında Av. Perito Moreno 2232 adresinde mevcut (Patagonya kuzusu, centolla, füme ürünler, peynir, deniz ürünleri); hiçbir kaynakta helal ya da helal et ifadesi yok. Aynı grubun 'Kuar 1900' adlı ayrı bir mekânı da var (San Martín 471).",
    "sources": [
      "https://www.welcomeargentina.com/usahuaia/kuar-restaurant.html",
      "https://www.cvent.com/venues/ushuaia/restaurant/kuar-restaurant/venue-0f6c06a5-65ea-43c7-b7c7-92511da33c81"
    ]
  },
  {
    "countryCode": "AT",
    "city": "Graz",
    "name": "Himalaya Masala",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Graz turizm sitesi Himalaya Masala'yı Hint-Nepal mutfağı (kuzu, tavuk, karides, vejetaryen; öğle büfesi yaklaşık 13 euro) olarak listeliyor, HappyCow yorumu da helalden söz etmiyor; helal iddiası yalnız Prag'daki başka bir Himalaya için çıkıyor. Adres Grazbachgasse 35, 8010 Graz; sitedeki 'Lend / merkez' semtiyle uyumu",
    "sources": [
      "https://www.graztourismus.at/en/food-drinks-shopping/restaurant-guide/himalaya-masala_gad_1948",
      "https://www.happycow.net/reviews/himalaya-masala-graz-285143"
    ]
  },
  {
    "countryCode": "AT",
    "city": "Linz",
    "name": "Ayam Zaman",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Landstraße 32'de Suriye mutfağı restoranı olarak mevcut (Yukarı Avusturya turizm sayfası helal etiketi vermiyor, yalnız vejetaryen dostu diyor); SwipeIn'deki helal ifadesi genel topluluk rozeti gibi görünüyor, restorana özgü olduğundan emin olunamadı. Zabihah'ta Linz kaydı yok; hiçbir kaynak net olarak helal demiyor. T",
    "sources": [
      "https://www.upperaustria.com/en/oesterreich-gastronomie/detail/430007161/restaurant-ayam-zaman.html",
      "https://www.swipein.restaurant/en/restaurant/restaurant-ayam-zaman-linz-oberosterreich"
    ]
  },
  {
    "countryCode": "AT",
    "city": "Wachau Vadisi",
    "name": "Alte Schiffstation Melk",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada 'Alte Schiffstation' adlı Melk restoranı hiçbir sonuçta çıkmadı; Melk için SwipeIn helal listesinde de yok (orada başka işletmeler var: Wachauerhof, H1 Melk, Zur Post). Varlığı ve helal durumu doğrulanamadı (bir tek arama yapıldı, işletme dizinlerde bulunmuyor olabilir).",
    "sources": [
      "https://www.swipein.restaurant/en/place/melk/category/halal"
    ]
  },
  {
    "countryCode": "BA",
    "city": "Jajce",
    "name": "Restoran Divan",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Jajce'de 'Restoran Divan' adlı bir kayıt bulunamadı; çıkan Divan kayıtları ABD, Yunanistan gibi başka ülkelerdeki farklı işletmeler, Jajce'den yalnız ilgisiz Restoran Jajce Bingo çıktı. Restoranın hiç olmadığı ya da kapandığı kesinleşmedi (ikinci arama yapılamadı).",
    "sources": []
  },
  {
    "countryCode": "BA",
    "city": "Mostar",
    "name": "Tima-Irma",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Tima-Irma, Mostar'da et ızgara (ćevapi, kuzu) ağırlıklı ulusal mutfak restoranı; bir Airbnb sayfası bira/şarap servisi olduğunu gösteriyor (tek başına sorun değil), Restaurant Guru onu 'barbekü, Doğu Avrupa' olarak etiketliyor, helal diyen hiçbir kaynak yok.",
    "sources": [
      "https://www.inyourpocket.com/bosnia-herzegovina/mostar/venues/tima-irma",
      "https://de.restaurantguru.com/Mostar",
      "https://www.airbnb.com/things-to-do/places/1486694"
    ]
  },
  {
    "countryCode": "BA",
    "city": "Trebinje",
    "name": "Ćevabdžinica Kastel",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Ćevabdžinica Kastel, Stari grad 57, Trebinje'de işkembe/sakatat ızgarasıyla tanınan bir restoran; helal diyen kaynak yok. N1 haberi, Trebinje'nin ilk helal restoranının Stari Grad'daki Vakıf Evi'nde (sertifikasyon sürecinde) açıldığını yazıyor; haber tarihi görülmedi ve Kastel'e dair doğrudan bir ifade değil.",
    "sources": [
      "https://www.tourismbih.com/?p=47135",
      "https://n1info.ba/english/news/bosnian-town-of-trebinje-getting-its-first-halal-restaurant/"
    ]
  },
  {
    "countryCode": "BA",
    "city": "Una Milli Parkı",
    "name": "Sofra",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Sofra, Bihać'ta Bosanska caddesinde geleneksel Bosna mutfağı sunan bir restoran (Tourism BiH, In Your Pocket). Yalnız In Your Pocket'ın test/staging kopyası gibi görünen bir sayfasında 'helal seçenekler' ifadesi geçiyor; bu zayıf ve dolaylı olduğundan KANIT_YOK seçildi (sınırda vaka, ikinci arama yapılamadı).",
    "sources": [
      "https://inyourpocket.com/bihac/sofra_161496v",
      "https://www.tourismbih.com/?p=42713"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Anvers",
    "name": "Finjan",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Finjan, Graaf van Hoornestraat 1'de 1994'ten beri açık Lübnan sokak lezzetleri restoranı (Le Fooding, Mapstr); menüde falafel, humus gibi vejetaryen ağırlıklı ürünler var. Hiçbir kaynak helal olduğunu söylemiyor, Zabihah'ın Anvers helal listesinde de yok.",
    "sources": [
      "https://lefooding.com/en/restaurants/finjan",
      "https://mapstr.com/place/j8KGYUgFOIg"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Ardenler",
    "name": "Le Karawa",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Le Karawa, Grand'Rue 42, Durbuy'da bir restoran; yorumlar burger ve bifteği övüyor, helal geçen hiçbir kaynak yok. Bir Tripadvisor sayfasında 'jambonneau' (domuz incik) fotoğraf başlığı görüldü ama menüde olduğu kesin değil.",
    "sources": [
      "https://wanderlog.com/place/details/2745873",
      "https://www.tripadvisor.com/--d2668697.html"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Brugge",
    "name": "The Olive Tree",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "The Olive Tree, Wollestraat 3'te Yunan/Akdeniz mutfağı sunan bir restoran; bira, şarap ve kokteyl servisi var. TableJourney'in Brugge helal sayfasında yer almıyor (orada Taboulé listeli), helal diyen kaynak bulunamadı.",
    "sources": [
      "https://wanderlog.com/place/details/500623/the-olive-tree-brugge",
      "https://tablejourney.com/belgium/bruges/dietary/halal/",
      "https://intravel.net/bruges/restaurants-cafes/the-olive-tree-restaurant"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Brüksel",
    "name": "L'Express",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "L'Express adlı Lübnan/kebap restoranı Rue des Chapeliers 8, 1000 Bruxelles'te (Grand-Place yakını, Mapstr'a göre 2023'te açılmış); Ixelles'te değil ama sitedeki 'merkez' ifadesiyle uyumlu. Helal olduğunu söyleyen hiçbir kaynak yok; HalalTrip'teki kaydın bu işletme olduğu da doğrulanamadı.",
    "sources": [
      "https://mapstr.com/place/VTljTVnVUEg",
      "https://intravel.net/brussels/restaurants-cafes/lexpress"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Dinant",
    "name": "Le Jardin de Fiorine",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Rue Georges Cousot 3, Dinant'ta Fransız/Belçika mutfağı sunan, Gault&Millau'da geçen bir restoran. Hiçbir kaynak helal olduğunu söylemiyor; Dinant için halal dizinlerinde yalnız otel kayıtları çıktı.",
    "sources": [
      "https://wanderlog.com/place/details/2720819/le-jardin-de-fiorine",
      "https://joinpearl.co/restaurants/dinant/le-jardin-de-fiorine",
      "https://rankeat.fr/restaurants/le-jardin-de-fiorine-dinant"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Leuven",
    "name": "Kebab Company",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Yalnız bir şirket sicil kaydı bulundu: Kebab Company (ÖZHAN Solutions), 3010 Leuven (Kessel-Lo posta kodu), 2014'te kurulmuş; restoranın kendi sayfası, menüsü ya da helal beyanı bulunamadı. Sicil adresi restoran adresi olmayabilir.",
    "sources": [
      "https://busibee.be/en/0545984096-ozhan-solutions"
    ]
  },
  {
    "countryCode": "BE",
    "city": "Liège",
    "name": "O'Kebap",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Liège'de O'Kebap şubesi bulunamadı; yalnız zincirin Esch-sur-Alzette ve Marseille şubeleri Zabihah'ta çıktı. Şubenin hiç olmadığı ya da kapandığı kesinleşmedi (ikinci arama yapılamadı).",
    "sources": [
      "https://zabihah.com/restaurants/cb1a717e-7767-11ef-95ae-6045bdeb9f57/okebap-esch-sur-alzette-district-de-luxembourg",
      "https://www.zabihah.com/restaurants/cb1a8a03-7767-11ef-95ae-6045bdeb9f57/okebap-marseille-provence-alpes-cte-dazur"
    ]
  },
  {
    "countryCode": "BG",
    "city": "Plovdiv",
    "name": "Mayrigos (Cuma Camii Yanı)",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Plovdiv'de Lübnan ve Ermeni ev yemekleri sunan 'Mayriges' adlı bir restoran var (Konstantin Stoilov 14; bir yorumcu Cami ve Eski Şehir yakını diyor); hiçbir kaynak helal olduğunu söylemiyor, listelemeler alkol (şarap, bira) servis edildiğini gösteriyor. Kayıttaki 'Şark ve Türk ızgaraları' mutfağı bu restoranla uyuşmuyo",
    "sources": [
      "https://wanderlog.com/place/details/3048114/mayriges-lebanese-cuisine",
      "https://tripaligner.com/countries/bulgaria-5/destinations/plovdiv-5290/places/mayriges-9715840",
      "https://spinach.guide/venues/mayriges-105067/",
      "https://halalspy.com/halal-food-guide/europe/bulgaria/"
    ]
  },
  {
    "countryCode": "BG",
    "city": "Sofya",
    "name": "Restaurant Türk (Banyabaşı Camii yanı)",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Banya Bashi Camii çevresinde bu adla bir restoran üç ayrı aramada (Latin ve Kiril yazımıyla) bulunamadı; çıkan en yakın adlar TM Turkish Restaurant (Yuri Venelin), Le Bistro ve Ege Türk. HalalSpy rehberi 116 Knyaginya Maria Luiza Blvd'de 'Ikram Halal Restaurant'ı anıyor ama aynı rehber başka yerde adresini Tsar Simeon ",
    "sources": [
      "https://halalspy.com/halal-food-guide/europe/sofia/",
      "https://www.visitsofia.bg/en/cityinfrastructure/what-to-see/temples/mosque-banya-bashi",
      "https://www.zabihah.com/restaurants/ca287c4d-7767-11ef-95ae-6045bdeb9f57/tm-sofia-sofia-city-province"
    ]
  },
  {
    "countryCode": "BG",
    "city": "Varna",
    "name": "Kervan Halal Grill",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "3 aramada (İngilizce, Bulgarca, 'halal grill pide' varyantları) Varna'da bu adla bir işletme çıkmadı; 'Kervan' sonuçları Seul, Londra, Amsterdam, ABD gibi başka şehirlere ait. Kayıttaki kaynak (visit.varna.bg) WebFetch ile erişilemedi, dolayısıyla orada listeleniyor mu doğrulanamadı.",
    "sources": []
  },
  {
    "countryCode": "BR",
    "city": "Florianópolis",
    "name": "Damasco",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Florianópolis'te 'Damasco' adlı bir Arap restoranı bulunamadı; çıkanlar başka şehirlerdeki farklı işletmeler (ör. Córdoba'daki Restaurante Damasco). Florianópolis'ten yalnız Restaurante Dubai ve Bread Pide çıktı, ikisinde de helal bilgisi yok. Restoranın hiç olmadığı kesinleşmedi (ikinci arama yapılamadı).",
    "sources": []
  },
  {
    "countryCode": "BR",
    "city": "Lençóis Maranhenses",
    "name": "A Canoa",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Arama özeti, Barreirinhas'ta Avenida Beira Rio'daki bir seyahat blogunda 'A Canoa' ve 'Barlavento' restoranlarının geçtiğini söylüyor (kaynak URL'si özette açık değil, en yakın aday blog listelendi); helal ifadesi hiçbir yerde yok. Barreirinhas'ta onaylı helal restoran da bulunamadı.",
    "sources": [
      "https://www.360meridianos.com/onde-comer-barreirinhas-lencois-maranhenses/"
    ]
  },
  {
    "countryCode": "BR",
    "city": "Manaus ve Amazon",
    "name": "Almanara",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Almanara bilinen bir Arap mutfağı zinciri ama şubeleri São Paulo, Campinas ve Alphaville'de; Manaus'ta Almanara bulunamadı. Hiçbir sonuç helal sertifikasından söz etmiyor.",
    "sources": [
      "https://www.guiadasemana.com.br/sao-paulo/restaurantes/estabelecimento/almanara-centro",
      "https://www.casamentos.com.br/restaurante-casamento/restaurante-e-churrascaria-almanara--e198176"
    ]
  },
  {
    "countryCode": "BR",
    "city": "Recife ve Olinda",
    "name": "Saj",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Brezilya'daki Saj Arap restoranı São Paulo (Pinheiros, Vila Madalena), Brasília ve Curitiba'da var; Recife'de bulunamadı. Arama özeti, Saj Vila Madalena için bir Wanderlog yorumunda 'helal servis etmiyorlar' dendiğini belirtiyor (doğrudan teyit edilmedi).",
    "sources": [
      "https://www.guiadasemana.com.br/sao-paulo/restaurantes/estabelecimento/saj-pinheiros",
      "https://www.guiadasemana.com.br/sao-paulo/restaurantes/estabelecimento/saj-vila-madalena",
      "https://gironews.com/food-service/primeiro-ponto-fora-sp-52861/",
      "https://extensionembed.wanderlog.com/place/details/1345587"
    ]
  },
  {
    "countryCode": "BR",
    "city": "Rio de Janeiro",
    "name": "Amir",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Amir'in Tripadvisor kaydı 'We DON'T have HALAL FOOD!' (Helal yemeğimiz yok) diyor; bir Wanderlog yorumcusu da duvarlarda Mekke görselleri olmasına rağmen helal servis edilmediğini yazıyor. Copacabana'da Rua Ronald de Carvalho 55'te Orta Doğu mutfağı. Alternatif olarak Zabihah'ta sertifikalı helal diye geçen Restaurante",
    "sources": [
      "https://www.tripadvisor.com.au/Restaurant_Review-g303506-d941683-Reviews-Amir-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html",
      "https://www.tripadvisor.co.nz/Restaurant_Review-g303506-d941683-Reviews-Amir-Rio_de_Janeiro_State_of_Rio_de_Janeiro.html",
      "https://www.zabihah.com/restaurants/cb0b3b15-7767-11ef-95ae-6045bdeb9f57/restaurante-baghdad-rio-rio-de-janeiro"
    ]
  },
  {
    "countryCode": "BR",
    "city": "Salvador",
    "name": "Arabesco",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Arabesco yalnız São Paulo'da bulundu (Suriye-Lübnan mutfağı, Av. Paulista 1765, Cerqueira César); Salvador/Barra'da Arabesco bulunamadı. Hiçbir kaynak helal demiyor.",
    "sources": [
      "https://www.baressp.com.br/restaurantes/arabes/arabesco-paulista",
      "https://www.guiadasemana.com.br/sao-paulo/restaurantes/estabelecimento/arabesco-cerqueira-cesar"
    ]
  },
  {
    "countryCode": "BR",
    "city": "São Paulo",
    "name": "Halim",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Halim, Paraíso'da Rua Doutor Rafael de Barros 56'da 1970'lerden beri bilinen bir Arap mutfağı restoranı (kibe, esfiha); BaresSP, Apontador ve Wanderlog'da kayıtlı. Hiçbir kaynakta helal kesim, sertifika veya helal ifadesi yok.",
    "sources": [
      "https://baressp.com.br/restaurantes/arabes/halim",
      "https://www.apontador.com.br/local/sp/sao_paulo/comida_arabe/3L2V56NV/halim.html",
      "https://wanderlog.com/place/details/1896431/halim"
    ]
  },
  {
    "countryCode": "CA",
    "city": "Banff",
    "name": "Masala Authentic Indian Cuisine",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Banff'ta 229 Bear Street'te Hint restoranı; Zabihah 'kısmen helal, alkol servisi var' diyor (sahip, kuzu etini Calgary'deki Central Halal Meat'ten aldığını yazmış), aynı sayfadaki bir ziyaretçi yorumu ise personelin 'helal yemek servis etmiyoruz, kısmen bile' dediğini aktarıyor. Kaynaklar çelişkili; en iyi ihtimalle ya",
    "sources": [
      "https://www.zabihah.com/biz/Banff/Masala/SiD5d9KGDw",
      "https://www.zabihah.com/restaurants/cad2b250-7767-11ef-95ae-6045bdeb9f57/masala-banff-ab",
      "https://www.banfflakelouise.com/dining-nightlife/masala-authentic-indian-cuisine"
    ]
  },
  {
    "countryCode": "CA",
    "city": "Jasper",
    "name": "The Raven Bistro",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Jasper'da Patricia Street'te Akdeniz füzyon bistrosu; tanıtımında deniz ürünleri, sığır, domuz ve av eti kullanıldığı yazıyor. Tek helal ifadesi OpenTable'ın yapay zekâ yorum özeti (kanıt sayılmaz); restoranın kendi beyanı ya da sertifika yok, domuz eti servis ediliyor (özet kaynaklı bilgi).",
    "sources": [
      "https://www.opentable.co.uk/r/the-raven-bistro-jasper",
      "https://fodors.fodors.com/world/north-america/canada/alberta/jasper-national-park/restaurants/reviews/the-raven-bistro-s662357"
    ]
  },
  {
    "countryCode": "CA",
    "city": "Niagara Şelaleleri",
    "name": "The Kasbah Mediterranean",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Restoranın kendi sitesi (thekasbah.ca) helal beyanını yalnız burgerler için yapıyor ('All of our meat is AAA. Our beef, chicken, and lamb are halal (burgers)'), ana menüde domuz souvlaki ve gyro tabağında domuz şiş yer alıyor, alkol de servis ediliyor. Zabihah ise yönetim beyanıyla 'tüm et helal' diyor; kaynaklar çeliş",
    "sources": [
      "https://thekasbah.ca/",
      "https://thekasbah.ca/contact/",
      "https://thekasbah.ca/wp-content/uploads/2026/01/The-Kasbah-Main-Menu.pdf",
      "https://app.zabihah.com/restaurants/cb41e775-7767-11ef-95ae-6045bdeb9f57/the-kasbah-mediterranean-qsine-niagara-falls-on"
    ]
  },
  {
    "countryCode": "CA",
    "city": "Yukon",
    "name": "Turkish Kebab House",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki aramada Whitehorse'ta bu adla bir restoran bulunamadı; 'Turkish Kebab House' kayıtları yalnız başka şehirlerde (ör. Calgary, Zabihah). Whitehorse'taki kebap/şavurma işletmeleri Kebabery (302 Wood St) ve Garlic A GoGo Mediterranean ToGo olarak çıkıyor, ikisi de farklı adlı ve helal olduğu doğrulanmadı. Küçük işletme",
    "sources": [
      "https://www.yukon-news.com/business/kebabery-aims-to-break-the-wood-street-curse-6973329",
      "https://startpage.mapquest.com/ca/yukon/garlic-a-gogo-mediterranean-togo-498755834",
      "https://www.zabihah.com/restaurants/08dd3fee-3b69-4c8e-806c-5aa2519c2b44/turkish-kebab-calgary-ab"
    ]
  },
  {
    "countryCode": "CH",
    "city": "Bern",
    "name": "Restaurant Damas",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Bern'de Restaurant Damas adlı bir kayıt çıkmadı; Damas adı Montréal'de (Zabihah) ve Falstaff'ta Kreis 5 için (Zürih'e işaret ediyor) geçiyor. Bern istasyonu çevresindeki helal kayıtlar başka işletmelere (Rao Bazar, Shalimar, Kings Kebap) ait. Yalnız 1 sorgu yapılabildi (ortak arama bütçesi doldu), yeniden kontrol öneri",
    "sources": [
      "https://www.falstaff.com/en/restaurants/damas",
      "https://app.zabihah.com/restaurants/cb336c8c-7767-11ef-95ae-6045bdeb9f57/damas-montral-qc",
      "https://zabihah.com/restaurants/ca3ccdb5-7767-11ef-95ae-6045bdeb9f57/rao-bazar-bern-canton-of-bern"
    ]
  },
  {
    "countryCode": "CH",
    "city": "Lozan",
    "name": "Istanbul Grill",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Istanbul Grill & More Lausanne'da (Flon, Rue des Côtes-de-Montbenon 20; Sallaz'ta da şube) Türk restoranı olarak bulundu; Lausanne Tourisme helal demiyor, tek helal işareti Swipein uygulamasındaki şablon bir rozet ve sayfa metni genel platform metni. Sertifika ya da restoranın kendi beyanı görülmedi; Zabihah'taki helal",
    "sources": [
      "https://www.swipein.restaurant/en/restaurant/istanbul-grill-more-quartier-du-flon-lausanne",
      "https://www.lausanne-tourisme.ch/en/explore/istanbul-grill-and-more/",
      "https://flon.ch/en/locataires/cat/1/subcat/1/istanbul-grill-more/1/"
    ]
  },
  {
    "countryCode": "CH",
    "city": "St. Moritz",
    "name": "Banfi's",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Banfi's, St. Moritz'te (Via dal Bagn 5, Bad) İtalyan/Akdeniz/uluslararası mutfaklı bar-restoran olarak bulundu; turizm sayfaları helal demiyor, tek işaret Swipein uygulamasındaki kullanıcı kaynaklı genel diyet rozeti ve sayfa restoranın kendi tutumunu belirtmiyor. Domuz/alkol politikası bilinmiyor, barı var.",
    "sources": [
      "https://www.swipein.restaurant/en/restaurant/banfis-st-moritz-graubunden",
      "https://www.stmoritz.com/en/directory/restaurants/banfis-restaurant",
      "https://www.pontresina.ch/en/guide/restaurants-bars/banfis-restaurant"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Chengdu",
    "name": "Chengdu Huangcheng Mosque Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Bu adla bir restoran bulunamadı; sonuçlar yalnız Huangcheng Camii (Qingyang) ve çevresindeki başka adlı helal restoranları (Huangcheng Islam Restaurant, Tianfanglou, Huangchengba Beef Restaurant) gösteriyor, bunlar rehber/blog kaynaklı ve doğrulanmadı. Kayıttaki ad genel/camiden türetilmiş görünüyor.",
    "sources": [
      "https://islamichina.com/halal-restaurants/tianfanglou-restaurant-detail.html",
      "https://www.chinahighlights.com/chengdu/restaurants/muslim-restaurants.htm",
      "https://wildgreatwall.com/halal-restaurants-in-chengdu-china/"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Chongqing",
    "name": "Yilan Lanzhou Beef Noodles",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "'Yilan Lanzhou Beef Noodles' Chongqing'de bulunamadı (Çince yazım 伊兰兰州牛肉面 tahminimle arandı, zayıf eşleşme). Çıkan tek helal kaydı farklı bir işletme olan 'Zheng Zong Lan Zhou La Mian' (Zabihah), bu kayda atfedilmedi.",
    "sources": [
      "https://www.zabihah.com/restaurants/cb320a77-7767-11ef-95ae-6045bdeb9f57/zheng-zong-lan-zhou-la-mian-chongqing-chongqing-shi"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Dali",
    "name": "Dali Muslim Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Bu adla bir restoran bulunamadı; ad genel görünüyor. Dali Eski Şehir için rehberlerde başka adlı helal yerler var (Cangfeng Muslim Restaurant, Yi Bo Luo Restaurant, Shandao Restaurant), HalalTrip'in Dali Eski Şehir sayfası ise 'helal restoran bulunamadı' diyor; bunlar doğrulanmadı.",
    "sources": [
      "https://www.islamichinatravel.com/destination-guide/dali/dali-halal-restaurants/cangfeng-muslim-restaurant/",
      "https://www.halaltrip.com/city-guide-details/143/dali-ancient-town",
      "https://www.yunnanexploration.com/category/yunnan-muslim-travel/halal-restaurant-in-yunnan"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Guangzhou",
    "name": "Xinyue Muslim Restaurant",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca dizin ve gezi sitelerinde helal: Zabihah (personel sözlü teyit, tüm yiyecek 'certified halal' yazıyor, yalnızca 3 yorum, alkol servisi var), Muslim2China, Wild Great Wall, Traveloka. Sertifikalandırıcı kaydı veya restoranın kendi sayfası bulunamadı. Zabihah adresi 76 Tianhe North Road (Tianhe), NovaCircle (oto",
    "sources": [
      "https://zabihah.com/restaurants/ca1444af-7767-11ef-95ae-6045bdeb9f57/xinyue-muslim-guangzhou-guangdong",
      "https://muslim2china.com/halal-food-china/Xinyue-Muslim-Restaurant-462.html",
      "https://wildgreatwall.com/halal-foods-and-restaurants-in-guangzhou/",
      "https://www.novacircle.com/spots/asia/china/guangdong-province/tianhe-district-municipality/guangzhou/xinyue-muslim-restaurant-dfba1c"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Guilin ve Yangshuo",
    "name": "Guilin Islam Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Chongshan Road'da bu adla bir restoran bulunamadı. Camiyle aynı adreste (1 Chongshan Rd) Endian Halal Restaurant ve Baiji Halal Wonton var; Zabihah'ta 'Islamic Hotel' (伊珍香清真饭店, 37 Xicheng Road, tüm yemekler helal denmiş) var ama farklı sokakta ve kayıtla aynı işletme olduğu doğrulanamadı.",
    "sources": [
      "https://www.islamichinatravel.com/destination-guide/guilin/guilin-halal-restaurants/baiji-halal-wonton-restaurant/",
      "https://zabihah.com/restaurants/ca9b5dbb-7767-11ef-95ae-6045bdeb9f57/islamic-hotel-guilin-guangxi",
      "https://www.chinahighlights.com/guilin/restaurants.htm"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Hangzhou",
    "name": "Phoenix Mosque Muslim Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Bu adla bir restoran bulunamadı; ad genel/camiden türetilmiş görünüyor. Rehberlerde Phoenix Camii çevresi için başka adlar var (Dongyishun Muslim Restaurant, Laomajia Mianguan), doğrulanmadı.",
    "sources": [
      "https://www.topchinatravel.com/china-food-restaurant/popular-muslim-restaurants-in-hangzhou.htm",
      "https://www.ehangzhou.gov.cn/2023-10/11/c_287177.htm"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Harbin",
    "name": "Harbin Mosque Muslim Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Bu adla bir işletme bulunamadı; Daowai Camii (Harbin Camii) mevcut ve çevresinde çok sayıda 'qingzhen' (helal) lokanta olduğu söyleniyor, ama çıkan somut isimler Laorenyi ve Dongfang Muslim Restaurant; kayıttaki ad genel bir tanım gibi duruyor, belirli bir işletmeye bağlanamadı.",
    "sources": [
      "https://wanderlog.com/place/details/8419298/daowai-mosque",
      "https://islamichina.com/harbin/harbin-travel-tips.html",
      "https://www.idntimes.com/food/dining-guide/restoran-halal-di-harbin-00-z5hk4-96wpbj"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Kunming",
    "name": "Yilan Yuan",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Üç aramada (İngilizce, Çince yazım varyantları 伊兰园/依兰园, tam ad eşleşmesi) Kunming'de Yilan Yuan adlı bir restoran bulunamadı. En yakın isim 伊天园 / Yitianyuan (Yi Tian Yuan) adlı Kunming helal Hui zinciri, ancak bu farklı bir ad; aynı işletme olduğu doğrulanamadı, eşleştirme yapılmadı.",
    "sources": [
      "https://www.yunnanexploration.com/?p=51364",
      "https://muslim2china.com/halal-food-china/Yitianyuan-Muslim-Restaurant-969.html"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Lijiang",
    "name": "Lijiang Muslim Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Arama 'Lijiang Muslim Restaurant' adıyla bir işletme göstermedi; çıkan dizinler Muslim Garden, Yipin Loulan, Crescent Pavilion (Shuhe) gibi başka adlı Müslüman restoranlarını listeliyor. Ad genel bir tanım olduğundan hangi işletmenin kastedildiği ve Dayan dış kapısında olup olmadığı doğrulanamadı.",
    "sources": [
      "https://www.yunnanexploration.com/?p=63549"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Nanjing",
    "name": "Ma Xiang Xing",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Restoran gerçek ve köklü: The Nanjinger ve Çince kaynaklar onu 1845'e dayanan bir Müslüman/Qingzhen (清真) lokantası olarak, Çince tabela adıyla 清真马祥兴菜馆 diye anıyor; ayrıca Jiangsu eyaleti somut olmayan kültürel miras listesinde olduğu yazılıyor. Ancak resmî liste, restoranın kendi sitesi veya sertifikalandırıcı kaydı do",
    "sources": [
      "https://thenanjinger.com/visiting-nanjing/nanjing-guides/where-are-all-the-halal-restaurants-in-nanjing/",
      "https://thenanjinger.com/visiting-nanjing/nankinish-delights/ma-xiangxing-a-century-long-journey-of-culinary-innovation/",
      "https://lxs.cncn.com/81419/n538588",
      "https://www.maigoo.com/brand/9438.html"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Suzhou",
    "name": "Suzhou Muslim Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Arama 'Suzhou Muslim Restaurant' adıyla bir işletme göstermedi; dizinler Beijiang, Xiyu Diyipan, Loulan, Mo Jiang Nan, Qiao Mian Lang gibi başka adlı helal/Müslüman restoranlarını listeliyor. Ad genel bir tanım olduğundan Gusu semtindeki hangi işletmenin kastedildiği doğrulanamadı.",
    "sources": [
      "https://topchinatravel.com/china-food-restaurant/muslim-halal-restaurants-in-suzhou.htm",
      "https://www.islamichinatravel.com/destination-guide/suzhou/suzhou-halal-restaurants/mo-jiang-nan-restaurant/"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Xi'an",
    "name": "Lao Mi Jia Paomo",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran-özel bir helal beyanı bulunamadı: HalalTrip, HalalSpy, Zabihah ve Muslim2China'da araması yapılan 'Lao Mi Jia' için sonuç çıkmadı. Gezi rehberleri onu Müslüman Mahallesi'nde bir paomo (bayat ekmekli koyun çorbası) yeri olarak anıyor ve mahalledeki lokantaların varsayılan olarak Qingzhen (helal) olduğunu yazıyo",
    "sources": [
      "https://www.chinaxiantour.com/xian-attractions/muslim-quarter",
      "https://halalspy.com/halal-food-guide/asia/china/",
      "https://www.halaltrip.com/city-guide-details/779/xian/",
      "https://www.sina.cn/news/article/nimevat3844119.html"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Zhangjiajie",
    "name": "Wulingyuan Muslim Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Arama özetine göre bir Zhangjiajie yemek dizini 'Wulingyuan Halal Muslim Restaurant' ve 'Wulingyuan Damashige Muslim Restaurant' adlarını adres, menü veya saat vermeden anıyor; adıyla doğrulanabilir bir işletme, adres ya da güncel kayıt bulunamadı. Bir başka kaynak (Howard Johnson Neodalle Resort) Wulingyuan'da otel iç",
    "sources": [
      "https://www.visitaroundchina.com/Travel_Zhangjiajie/570.html",
      "https://www.wyndhamhotels.com/hojo/zhangjiajie-china/howard-johnson-zhangjiajie-neodalle-resort/overview"
    ]
  },
  {
    "countryCode": "CN",
    "city": "Şanghay",
    "name": "Hong Chang Xing",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah (iki kayıt, 'all food certified halal'), SmartShanghai, Muslim2China, Travel China Guide ve Shanghai Daily arşivi helal diyor; Çince haberlerde Şanghay'ın en eski Müslüman (清真) koyun eti hotpot'u olarak 1891'e dayandırılıyor. Hepsi dizin/yazı kaynağı; restoranın kendi sayfası veya sertifikalandırıcı kaydı bulun",
    "sources": [
      "https://www.zabihah.com/restaurants/ca8d990c-7767-11ef-95ae-6045bdeb9f57/hong-chang-xing-shanghai-shanghai-shi",
      "https://www.zabihah.com/restaurants/ca8a961d-7767-11ef-95ae-6045bdeb9f57/hong-chang-xing-huangpu-shanghai-shi",
      "https://www.smartshanghai.com/venue/14224/hong_changxing_yunnan_nan_lu",
      "https://muslim2china.com/halal-food-china/Hong-Chang-Xing-Restaurant-509.html"
    ]
  },
  {
    "countryCode": "CY",
    "city": "Baf",
    "name": "Samisen & Lebanese Halal House",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Üç sorguda (Visit Cyprus alan adı filtresi dahil) 'Lebanese Halal House' diye bir işletme bulunamadı; 'Samisen' adıyla yalnız Coral Bay'deki (57 Coral Beach Avenue, Peyia) Japon teppanyaki restoranı 'Samisen Japanese Restaurant' ile Paphos'ta eski bir 'Samisen Asian Cuisine' kaydı çıkıyor. Girdideki Visit Cyprus kaynağ",
    "sources": [
      "https://www.visitcyprus.com/discover-cyprus/gastronomy/samisen-japanese-restaurant/",
      "https://tripaligner.com/countries/cyprus-30/destinations/paphos-6551/places/samisen-japanese-teppanyaki-restaurant-1482931",
      "https://halalspy.com/halal-food-guide/europe/paphos/"
    ]
  },
  {
    "countryCode": "CY",
    "city": "Gazimağusa",
    "name": "Aspava Restaurant Gazimağusa",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Aspava Restaurant & Bar, Gazimağusa'da kebap evi olarak mevcut (Wanderlog, Airbnb yerel rehberi) ama hiçbir kaynak helal olduğunu söylemiyor; visitncy.com aramasında kayıt çıkmadı. Bulunan kayıtlar Liman Yolu Sokak (eski şehir) adresini veriyor, sitedeki 'Salamis Yolu' ile uyuşmuyor (başka şube olabilir); adında 'Bar' ",
    "sources": [
      "https://wanderlog.com/place/details/2726848",
      "https://www.airbnb.com/things-to-do/places/1158173",
      "https://www.visitncy.com/discover/kyrenia-harbour/"
    ]
  },
  {
    "countryCode": "CY",
    "city": "Girne",
    "name": "Niazi's Restaurant",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Niazi's Girne Kordonboyu'nda köklü bir kebap/ızgara restoranı (Fodor's, Lonely Planet, kendi sitesi niazis.com); helal iddiası yalnız halalspy.com rehberinde ('katı helal kurallar') var. Restoranın kendi sitesi helal demiyor, menüde helal etiketi yok (yalnız yerel, serbest dolaşan hayvan eti diyor); Lonely Planet başlı",
    "sources": [
      "https://halalspy.com/halal-food-guide/europe/cyprus/",
      "https://niazis.com/about/",
      "https://niazis.com/",
      "https://www.fodors.com/world/europe/cyprus/places/northern-cyprus/restaurants"
    ]
  },
  {
    "countryCode": "CY",
    "city": "Larnaka",
    "name": "Abu Dany Lebanese Halal Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "'Abu Dany Lebanese Halal Restaurant' adlı işletme iki sorguda ve Visit Cyprus Larnaka listesinde bulunamadı. En yakın kayıt 'Falafel Abu Dany': şehir merkezinde (Grigori Afxentiou 2) küçük, vejetaryen bir falafel dükkânı; helal beyanı yok, Finikoudes'te değil ve 'tüm et çeşitleri helal sertifikalı' tarifiyle uyuşmuyor,",
    "sources": [
      "https://wanderlog.com/place/details/1467308/falafel-abu-dany",
      "https://www.happycow.net/reviews/falafel-abu-dany-larnaca-320274",
      "https://www.visitcyprus.com/wp-content/uploads/2026/04/GASTRONOMY_LARNAKA_8.4.2026_EN.pdf"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Bohemya İsviçresi",
    "name": "Taj Mahal Děčín",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Firmy.cz'de Děčín bölgesi sayfalarında 'Taj Mahal' adlı bir Hint restoranı görünüyor ama adres belirsiz (komşu kayıt Ústí nad Labem'de) ve Děčín'deki işletmeyle eşleştirilemedi; hiçbir kaynak helal demiyor.",
    "sources": [
      "https://www.firmy.cz/stitek/indicka-restaurace/kraj-ustecky/decin/1683-hrensko",
      "https://www.atly.com/gluten-free/location/IndianRestaurantTajMahal1"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Brno",
    "name": "Anatolia Kebap",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Brno'da Anatolia Kebap adlı bir kayıt çıkmadı; Zabihah'taki Anatolia kayıtları başka şehirlerde. Halalspy Çekya rehberi Brno'da resmen sertifikalı, kalıcı helal restoran bulunmadığını söylüyor.",
    "sources": [
      "https://halalspy.com/halal-food-guide/europe/czech-republic/"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Karlovy Vary",
    "name": "Istanbul Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Karlovy Vary'de Istanbul Kebab kaydı çıkmadı; çıkan Zabihah kayıtları Prag'daki şubeler ve başka ülkelerdeki işletmeler.",
    "sources": [
      "https://www.zabihah.com/biz/Prague/Istanbul-Kebab/xDaJ6gykzV"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Kutná Hora",
    "name": "Istanbul Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Kutná Hora'da Istanbul Kebab kaydı çıkmadı; tüm Istanbul Kebab sonuçları Prag ve Nitra'daki (Slovakya) işletmeler. Kutná Hora yalnız turizm sayfalarında geçiyor.",
    "sources": [
      "https://www.zabihah.com/restaurants/ca2ae901-7767-11ef-95ae-6045bdeb9f57/istanbul-kebab-ii-prague-hlavn-msto-praha"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Olomouc",
    "name": "Istanbul Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Olomouc'ta Istanbul Kebab kaydı çıkmadı. Zabihah'ta Olomouc için Smile Kebab (halal tabelası olduğu belirtiliyor, tek yorum 2020) ve Your Kebab (helal bilgisi yok) var; bunlar farklı işletmeler, doğrulanmadı.",
    "sources": [
      "https://www.zabihah.com/restaurants/cbc2a011-7767-11ef-95ae-6045bdeb9f57/smile-kebab-olomouc-olomouck-kraj",
      "https://www.zabihah.com/restaurants/cbc2a5c3-7767-11ef-95ae-6045bdeb9f57/your-kebab-olomouc-olomouck-kraj"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Plzeň",
    "name": "Antalya Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Plzeň'de náměstí Republiky çevresinde Antalya Kebab bulunamadı (yakında 'Alanya Kebab' adlı farklı bir işletme var, helal bilgisi yok). Šternberk'teki bir Antalya Kebab 'maso není halal' diyor; farklı şube olduğu için bu kayda atfedilmedi, SORUNLU sayılmadı.",
    "sources": [
      "https://www.slevomat.cz/akce/1103077-kebab-s-sebou-plneny-hovezim-masickem",
      "https://www.zabihah.com/restaurants/cb5de51a-7767-11ef-95ae-6045bdeb9f57/antalya-kebap-liberec-libereck-kraj"
    ]
  },
  {
    "countryCode": "CZ",
    "city": "Český Krumlov",
    "name": "Babylon Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "In Your Pocket Český Krumlov'da Rybářská 6'da 'Babylon' adlı bir restoran listeliyor; hiçbir kaynak helal olduğunu söylemiyor, Zabihah/Halalbooking sonuçları başka ülkelerdeki Babylon'lar ya da otel kayıtları.",
    "sources": [
      "https://inyourpocket.com/cesky-krumlov/Babylon_33382v",
      "https://www.expats.cz/directory/listing/thebabylonrestaurantbar-1"
    ]
  },
  {
    "countryCode": "DE",
    "city": "Dresden",
    "name": "Sindbad",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Dresden'de Lübnan/Orta Doğu mutfağı olarak Sindbad bulundu (dizinlerde Hübnerstraße 13, 01069) ama hiçbir kaynak helal et demiyor; yalnız Freizeitmonster'daki, başka restoranlarda da aynen geçen şablon 'halal options' ifadesi var, bu kanıt sayılmaz. Dizinlerdeki adres/posta kodu Neustadt ile uyuşmuyor (Neustadt posta k",
    "sources": [
      "https://tripaligner.com/countries/germany-22/destinations/dresden-10380/places/sindbad-1352411",
      "https://www.reviewhero.io/de/libanesisches-restaurant/dresden"
    ]
  },
  {
    "countryCode": "DE",
    "city": "Kara Orman",
    "name": "Damasko's",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Freiburg'da Suriye mutfağı Damasko's bulundu (Friedrichring 3, Europaplatz şubesi dahil); et yemekleri ve kebap servis ediyor, vegan/vejetaryen/koşer seçenekleri var ama hiçbir kaynak helal et ya da sertifika belirtmiyor. Freiburg helal rehberleri ve Zabihah'ta Damasko's yok.",
    "sources": [
      "https://www.speisekarte.de/freiburg-im-breisgau/restaurant/damaskos_europaplatz/bewertung",
      "https://speisekarte.menu/restaurants/freiburg/damaskos",
      "https://speisekarte.menu/restaurants/freiburg/damaskos-2/menu"
    ]
  },
  {
    "countryCode": "DE",
    "city": "Nürnberg",
    "name": "Sultan",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Nürnberg'de Sultan adlı kebapçı/imbiss bulundu (Ludwigstraße'de, Sultan Imbiss & Döner); ancak hiçbir kaynak helal olduğunu söylemiyor, Zabihah'ta Nürnberg Sultan kaydı yok. Hangi Sultan'ın sitedeki kayıt olduğu ve Altstadt'ta olup olmadığı doğrulanamadı.",
    "sources": [
      "https://speisekarte.menu/restaurants/nuernberg/sultan-12",
      "https://autoreserve.com/en/restaurants/F7Uvq6hqmqrVCKcV7dep",
      "https://intravel.net/nuremberg/restaurants-cafes/sultan"
    ]
  },
  {
    "countryCode": "DK",
    "city": "Aalborg",
    "name": "Sam's Barbeque",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Wolt Aalborg'da ızgara ve pizza mekânı olarak listeliyor, Wanderlog yorumları yalnız yemek ve nakit ödemeyi anıyor; hiçbir kaynak helal demiyor. Zabihah'ta kaydı yok (Aalborg'daki helal kayıt Kebabistan, farklı işletme).",
    "sources": [
      "https://wolt.com/en/dnk/aalborg/brand/sams-barbeque",
      "https://wanderlog.com/place/details/3504459/sams-barbeque"
    ]
  },
  {
    "countryCode": "DK",
    "city": "Bornholm",
    "name": "Det Røde Pakhus",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Rønne'de Michelin Plate'li, yerel Bornholm malzemeli modern Danimarka mutfağı restoranı; Michelin ve VisitDenmark sayfalarında helal ile ilgili hiçbir ifade yok. Helal kanıtı bulunamadı.",
    "sources": [
      "https://www.visitdenmark.com/denmark/explore/restaurant-det-rode-pakhus-gdk1154737",
      "https://guide.michelin.com/en/capital-region/ronne/restaurant/det-rode-pakhus"
    ]
  },
  {
    "countryCode": "DK",
    "city": "Odense",
    "name": "Istanbul Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki aramada Odense'de bu adla bir restoran bulunamadı. En yakın sonuçlar farklı işletmeler: Restaurant Bergama (Vesterbro 11, Zabihah'ta helal, alkol servisi var) ve merkezden yaklaşık 2,5 km uzakta 'Istanbul Pizza og Barbeque'. Bu işletmelerden hiçbiri kayıtla aynı olduğu doğrulanmadan kayda atfedilmemeli.",
    "sources": [
      "https://www.zabihah.com/restaurants/cb1bb757-7767-11ef-95ae-6045bdeb9f57/bergama-odense-syddanmark",
      "https://tw.trip.com/restaurant/odense-10416/2/"
    ]
  },
  {
    "countryCode": "DK",
    "city": "Ribe",
    "name": "Kammerslusen",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kammerslusen Ribe ApS gerçek bir restoran/otel (Kammerslusevej 11, 6760 Ribe); VisitDenmark ve diğer listelerde mutfağı Ribe Marsk'ın yerel lezzetlerinden ilham alan bir restoran olarak anlatılıyor, helal ile ilgili hiçbir ifade yok. Semt: kaynaklar yeri Vadi Denizi Milli Parkı ile Ribe arasındaki Ribe Marsk'ta tarif e",
    "sources": [
      "https://www.visitdenmark.com/denmark/plan-your-trip/restaurant-kammerslusen-ribe-gdk610606",
      "https://www.enprimeurclub.com/restaurants/kammerslusen-ribe-restaurant"
    ]
  },
  {
    "countryCode": "DK",
    "city": "Roskilde",
    "name": "Shawarma Grill-House",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Roskilde şubesi (Hestetorvet 3, 4000 Roskilde) listelerde var ama helal ile ilgili ifade yok. Helal kaydı yalnız Kopenhag şubesi (Frederiksberggade) için Zabihah'ta var ve orada bile 'sözlü güvence, ek kanıt yok' notu düşülmüş; bu Roskilde için geçerli sayılamaz.",
    "sources": [
      "https://www.enprimeurclub.com/restaurants/shawarma-grillhouse-roskilde-restaurant",
      "https://wanderlog.com/place/details/2336810",
      "https://www.zabihah.com/restaurants/ca3d67ea-7767-11ef-95ae-6045bdeb9f57/shawarma-kobenhavn-hovedstaden"
    ]
  },
  {
    "countryCode": "DK",
    "city": "Skagen",
    "name": "Green's Pub",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Green's Pub og Café, Skagen limanında özel biralarıyla bilinen bir pub/kafe; VisitDenmark ve diğer sayfalarda helal ile ilgili hiçbir ifade yok. Alkol servisi tek başına SORUNLU sayılmadı, ama helal kanıtı bulunamadı.",
    "sources": [
      "https://www.visitdenmark.com/denmark/plan-your-trip/greens-pub-og-cafe-gdk698098",
      "https://toppenafdanmark.dk/en/greens-pub-cafe/"
    ]
  },
  {
    "countryCode": "EG",
    "city": "Hurgada",
    "name": "Al Halaka Fish Market Restaurant",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Hurghada'da El Mina Camii/balık pazarı yakınında 'Al Halaka (El Halaka) Fish Restaurant' olarak mevcut (Arrival Guides, Wanderlog), semt uyumlu; ancak hiçbir kaynak helal ya da alkolsüz olduğunu yazmıyor. egypt.travel aramasında kayıt çıkmadı, girdideki 'Kızıldeniz Valiliği' kaynağı doğrulanamadı. Tam sokak adresi doğr",
    "sources": [
      "https://www.arrivalguides.com/en/Travelguide/egyptregion/dining/al-halaka-hurghada-6301",
      "https://wanderlog.com/place/details/1406282/al-halaka-fish-restaurant",
      "https://www.turpravda.org/places/eg/hurgada/Restoran_El_Halaka_Fish-s7907",
      "http://egypt.travel/en/regions/red-sea/hurghada-city"
    ]
  },
  {
    "countryCode": "EG",
    "city": "Kahire",
    "name": "Farahat",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Farahat, Al-Azhar caddesinde (Al Gamaliyah, Khan el-Khalili yakını) ızgara ve içi doldurulmuş güvercin ile ünlü köklü bir lokanta (Cairo360, Wanderlog, Tripadvisor), semt uyumlu; fakat hiçbir kaynak helal kesim ya da alkolsüz olduğunu belirtmiyor, egypt.travel aramasında da kayıt çıkmadı.",
    "sources": [
      "https://www.cairo360.com/article/restaurants/farahat-delicious-stuffed-pigeon-in-cairo",
      "https://wanderlog.com/place/details/1540074/farahat",
      "https://www.tripadvisor.co.uk/RestaurantsNear-g294201-d308884-Khan_Al_Khalili-Cairo_Cairo_Governorate.html"
    ]
  },
  {
    "countryCode": "EG",
    "city": "Luksor",
    "name": "Al-Sahaby Lane Restaurant",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Luksor'da Nefertiti Hotel çatısında, çarşı ile Karnak yolu arasındaki sokakta gerçekten var (Lonely Planet, Trip.com, booked.ai); kaynaklar alkol servisi olmadığını yazıyor ama hiçbir kaynak helal et/kesim beyan etmiyor. egypt.travel aramasında kayıt çıkmadı.",
    "sources": [
      "https://www-lonelyplanet-com-6c06.imagizer.com/egypt/nile-valley/luxor/restaurants/as-sahaby-lane/a/poi-eat/1136415/355253",
      "https://sa.trip.com/travel-guide/luxor-410-restaurant/Al%20Sahaby%20Lane%20Restaurant-23870852",
      "https://booked.ai/restaurants/al-sahaby-lane-restaurant",
      "https://wareontheglobe.com/2019/10/04/al-sahaby-lane-a-fun-dinner-in-luxor-egypt/"
    ]
  },
  {
    "countryCode": "EG",
    "city": "Şarm el-Şeyh",
    "name": "Fares Seafood",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Fares Seafood'un Eski Pazar (Old Market) şubesi var, uygun fiyatlı deniz ürünleriyle tanınıyor (Fodor's, easyJet, Lonely Planet); bir listede alkol servisi yok yazıyor, ancak hiçbir kaynak helal sertifikalı et/deniz ürünü beyan etmiyor ve egypt.travel aramasında kayıt çıkmadı. Telefon numaraları kaynaklarda çelişiyor.",
    "sources": [
      "https://fodors.fodors.com/world/africa-and-middle-east/egypt/the-sinai-peninsula-and-red-sea-coast/restaurants/reviews/fares-s895544",
      "https://www.easyjet.com/en/traveller/egypt/sharm-el-sheikh/best-restaurants-in-sharm-el-sheikh",
      "https://www.booked.ai/restaurants/fares-seafood"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Alicante",
    "name": "Al Medina",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki aramada Alicante'de Merkez'de Fas/Lübnan mutfağı sunan helal bir Al Medina bulunamadı. Gastroranking'de Alicante için bir 'Al Medina' kaydı var ama İspanyol mutfağı olarak ve helal ifadesi olmadan görünüyor; spain.info helal rehberinin 'Al Medina' kaydı ise Sevilla'da (San Roque 13, 'full halal, pork-free, self-dec",
    "sources": [
      "https://gastroranking.es/r/al-medina_40704/",
      "https://issuu.com/spain.info/docs/andalusia_for_muslim_travelers/s/29290467",
      "https://tripaligner.com/countries/spain-39/destinations/alacant-alicante-4342/places/kaf-restaurante-halal-21303552"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Barcelona",
    "name": "Bismillah Kebabish",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah (iki kayıt: Joaquín Costa 22 ve 30, 'all food certified halal', alkol yok), Halal Barcelona rehberi ve Salir ('Halal geleneğine göre hazırlanmış ürünler') helal diyor; Time Out sadece yorum veriyor. Tamamı dizin/yorum kaynağı; restoranın kendi sayfası veya sertifika kaydı bulunamadı. Semt El Raval ile uyumlu.",
    "sources": [
      "https://www.zabihah.com/restaurants/cacdc32a-7767-11ef-95ae-6045bdeb9f57/bismillah-raval-kebabish-barcelona-catalunya",
      "https://www.zabihah.com/restaurants/cb826552-7767-11ef-95ae-6045bdeb9f57/bismillah-kebabish-barcelona-catalunya",
      "https://halalbarcelona.github.io/restaurants.html",
      "https://www.salir.com/bismillah-kebabish-barcelona-neg-135572.html"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Bilbao",
    "name": "Taj Mahal Bilbao",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Üç aramada (helal, Abando, Bizkaia varyantları) Bilbao'da Taj Mahal adlı bir Hint restoranı bulunamadı; çıkan Taj Mahal kayıtları Madrid, Barselona, Sevilla, Valencia, A Coruña gibi başka şehirlerde. Bilbao'nun Abando semtinde yalnızca Namaste, India Town, Old India, Buddha Palace gibi farklı isimli Hint lokantaları gö",
    "sources": [
      "https://spinach.guide/venues/namaste-restaurante-12642/",
      "https://www.salir.com/restaurantes-indios-en-bilbao-art-1565.html"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Gran Canaria",
    "name": "El Sultán",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Las Palmas de Gran Canaria'da El Sultán adlı bir restoran bulunamadı; çıkan El Sultán kayıtları Sevilla, Córdoba ve Granada'daki başka işletmeler, Las Palmas'taki tek Lübnan sonucu ise farklı bir işletme olan El Coto Libanés. Yalnız 1 sorgu yapılabildi (ortak arama bütçesi doldu), kanıt yokluğu kesin değil, yeniden kon",
    "sources": [
      "https://www.zabihah.com/biz/Sevilla/El-Sultan/DvAFXf9ync",
      "https://www.zabihah.com/restaurants/ca322186-7767-11ef-95ae-6045bdeb9f57/el-sultan-crdoba-andaluca",
      "https://spinach.guide/venues/restaurante-el-coto-libanes-12989/"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Ibiza",
    "name": "Shamarkanda",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Shamarkanda, Sant Joan de Labritja'da (Ibiza) bahçe restoranı olarak bulundu; menüsü Meksika, Japon ve Orta Doğu etkili dünya mutfağı, hiçbir kaynak helal demiyor, kokteyl menüsü alkol servisine işaret ediyor. Çıkan Zabihah helal kaydı Granada'daki Samarkanda'ya ait (farklı işletme); Welcome to Ibiza'daki 22 Ekim 2026 ",
    "sources": [
      "https://gastroranking.es/r/shamarkanda_181222/",
      "https://www.ibiza-spotlight.com/restaurants/Shamarkanda",
      "https://welcometoibiza.com/agenda-ibiza/lifestyle/closing-de-shamarkanda-ibiza/",
      "https://www.zabihah.com/restaurants/cbe6338c-7767-11ef-95ae-6045bdeb9f57/samarkanda-granada-andaluca"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Madrid",
    "name": "Alzahra",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Madrid şehir turizm sitesi (esmadrid.com) Alzahra'yı Centro Cultural Islámico (M-30 Camii) içinde, menüsünde 'İslami geleneğe uygun olarak alkol ve domuz bulunmayan' bir Orta Doğu/Kuzey Afrika restoranı olarak tanıtıyor; HalalSpy da helal servis ettiğini yazıyor. Resmî sayfada 'helal' sözcüğü ya da sertifika doğrudan g",
    "sources": [
      "https://www.esmadrid.com/en/restaurants/alzahra",
      "https://www.esmadrid.com/en/halal-travel-madrid",
      "https://halalspy.com/halal-food-guide/europe/madrid/"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Málaga",
    "name": "Al-Yamal",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah ('all food certified halal', bir sorun bildirimi incelemede), TripAligner ve HalalSpy ('owner-declared' yani işletme beyanı) helal diyor; spain.info Andalusia rehberi sonuçlarında Al-Yamal bulunamadı. Andalucia.org resmî sayfası 1983'ten beri Málaga'nın ilk Arap restoranı olduğunu söylüyor ama helal iddiası gör",
    "sources": [
      "https://www.zabihah.com/restaurants/ca216b4e-7767-11ef-95ae-6045bdeb9f57/al-yamal-malaga-andalucia",
      "https://halalspy.com/halal-food-guide/europe/malaga/",
      "https://tripaligner.com/countries/spain-39/destinations/malaga-1533/places/restaurante-al-yamal-1003901",
      "https://www.andalucia.org/en/malaga-where-to-eat-al-yamal"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Palma de Mallorca",
    "name": "Layla Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Palma'da Santa Catalina'da Layla Restaurant adlı bir Lübnan restoranı bulunamadı; en yakın sonuç Restaurante Libanés Rotana (Santa Catalina), ki farklı bir işletme ve helal bilgisi yalnız TripAligner'da var. Yalnız 1 sorgu yapılabildi (ortak arama bütçesi doldu), yeniden kontrol önerilir.",
    "sources": [
      "https://tripaligner.com/countries/spain-39/destinations/palma-2408/places/restaurante-libanes-rotana-2149456",
      "https://majorcadailybulletin.com/food-and-drink/food-and-drink/2022/10/01/106405/mallorca-restaurant-review-restaurante-rotana-palma.html"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Salamanca",
    "name": "Taj Mahal Salamanca",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Salamanca'da Taj Mahal adlı bir Hint restoranı hiçbir sonuçta çıkmadı; Taj Mahal kayıtları Barselona, Palma, Alcúdia ve Salzburg'daki başka işletmelere ait. Yalnız 1 sorgu yapılabildi (ortak arama bütçesi doldu), yeniden kontrol önerilir.",
    "sources": [
      "https://www.zabihah.com/restaurants/caec431e-7767-11ef-95ae-6045bdeb9f57/taj-mahal-barcelona-catalonia",
      "https://www.mallorca.com/es/directorio/empresa/taj-mahal-restaurante-indio-indian-restaurant-palma-fdytgwyw"
    ]
  },
  {
    "countryCode": "ES",
    "city": "San Sebastián",
    "name": "Tandoori Mashala",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "San Sebastián için 'tandoori mashala' adıyla yalnızca bir menü toplayıcı sayfası bulundu; oradaki bir yorumcu San Sebastián'da helal Hint yemeği bulmakta zorlandığını ve restoranı arayınca personelin kibar olduğunu yazıyor, restoranın helal olduğunu söyleyen bir kaynak yok. Zabihah vb. dizinlerde kaydı çıkmadı, adres/s",
    "sources": [
      "https://meniu.menu/restaurants/san-sebastian-2/tandoori-mashala/f/feedback-recenzii"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Sevilla",
    "name": "Al Wadi",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "spain.info Andalusia rehberinin 'Where to enjoy halal food in Seville' bölümünde Katedral yakınında Orta Doğu restoranı olarak listeleniyor; Halalspy, Tablejourney ve Salir de helal diyor, birinde 'yetkili dinî makam onaylı helal et' iddiası var. Rehberdeki etiket metnini ('full halal/pork-free') doğrudan görüp doğrula",
    "sources": [
      "https://issuu.com/spain.info/docs/andalusia_for_muslim_travelers/s/29290467",
      "https://halalspy.com/halal-food-guide/europe/seville/",
      "https://tablejourney.com/spain/seville/dietary/halal/",
      "https://gastroranking.es/r/al-wadi_201112/"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Tenerife",
    "name": "Al Amir",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Costa Adeje'de Al Amir adlı bir Lübnan restoranı bulunamadı; Tenerife'de yalnız Puerto de la Cruz'da (kuzey kıyı) Al Amir Libanés & Shisha çıktı, hiçbir kaynak helal demiyor ve aynı işletme olup olmadığı belirsiz. Yalnız 1 sorgu yapılabildi (ortak arama bütçesi doldu), yeniden kontrol önerilir.",
    "sources": [
      "https://wanderlog.com/place/details/453310",
      "https://spinach.guide/venues/al-amir-libanes-shisha-9887/",
      "https://www.teneriffa-news.com/en/restaurant-en/tenerife/costa-adeje/restaurants"
    ]
  },
  {
    "countryCode": "ES",
    "city": "Valencia",
    "name": "Balansiya",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah ('all food certified halal', 'halal sertifikası dosyada' notu), Valencia Bonita blogu, Salir ve Tablejourney helal Fas/Endülüs restoranı diyor; sertifikalandırıcı adı veya belgesi görülemedi, holavalencia.net balansiya.com adresini anıyor ama resmî site doğrulanamadı. Adres Paseo de las Facultades 3 (üniversite",
    "sources": [
      "https://www.zabihah.com/restaurants/ca22c50c-7767-11ef-95ae-6045bdeb9f57/balansiya-valencia-comunidad-valenciana",
      "https://www.valenciabonita.es/2018/06/15/balansiya-restaurante-arabe-un-precioso-restaurante-andalusi-y-halal-en-valencia/",
      "https://www.salir.com/balansiya-valencia-neg-5144.html",
      "https://tablejourney.com/spain/valencia/dietary/balansiya-valencia/"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Finlandiya Göller Bölgesi",
    "name": "Muikkuterassi",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Savonlinna Kauppatori'nda, Original Sokos Hotel Seurahuone'nin çatı terası olarak çalışan, kızarmış muikku (Saimaa balığı) odaklı bir balık restoranı; Visit Savonlinna ve Visit Finland sayfaları dahil hiçbir kaynak helal demiyor. Helal ile ilgili tek sonuç farklı bir tesis (Hotelli Salpa).",
    "sources": [
      "https://visitsavonlinna.fi/en/shops/restaurant-muikkuterassi-2/",
      "https://www.visitfinland.com/de/produkt/fccb0aca-ff52-4396-9877-7aa46f55826a/muikkuterassi-restaurant-and-roof-top-terrace-lake-saimaa/"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Inari ve Saariselkä",
    "name": "Restaurant Aanaar",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Wilderness Hotel Juutua bünyesinde, Saarikoskentie 2, Inari'de bir Sami/Lapland yöresel fine-dining restoranı (Time Out'a göre 5 yemekli menü 98 euro); kaynaklar vegan seçenekleri anıyor, hiçbiri helal demiyor. Adres Inari'de, Saariselkä'ya yaklaşık bir saatlik mesafede olarak aktarılıyor.",
    "sources": [
      "https://wildernesshotels.fi/wilderness-hotel-juutua/restaurant-aanaar",
      "https://laplandnorth.fi/en/company/restaurant-aanaar/",
      "https://www.timeout.com/finland/restaurants/aanaar"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Porvoo",
    "name": "Hanna-Maria",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Vanha Porvoo'da, Välikatu 6'da geleneksel Kuzey mutfağı sunan bir öğle yemeği restoranı; hiçbir kaynak helal demiyor ve Zabihah'ın Finlandiya sonuçlarında yalnız Helsinki/Espoo kayıtları çıkıyor. TripAligner kaydında 'Serves Alcohol' etiketi var (alkol tek başına sorun değil, not düşüldü).",
    "sources": [
      "https://fonecta.fi/profiili/restaurant-hanna-maria/2638592",
      "https://tripaligner.com/countries/finland-31/destinations/porvoo-14512/places/hanna-maria-1787977"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Rovaniemi",
    "name": "Ravintola Roka",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Rovaniemi merkezinde, Ainonkatu 3'te Fin ürünleri ve uluslararası etkileri harmanlayan küçük bir bistro; Visit Rovaniemi, Visit Finland ve yorum sayfalarında helal bilgisi yok. Genel bir Laponya helal rehberi de bu restorandan söz etmiyor.",
    "sources": [
      "https://www.visitrovaniemi.fi/eat-and-drink/roka/",
      "https://www.visitfinland.com/en/product/b6d65c78-a668-47a2-88b2-1a3acec5bb9d/ravintola-roka/"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Tampere",
    "name": "Baba's Kitchen",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Tullintori, Tullikatu 6'da Lübnan-Türk mutfağı sunan, vegan seçenekleriyle öne çıkan bir restoran (intravel, HappyCow, Spinach); hiçbir kaynakta helal beyanı, sertifika ya da et tedarik bilgisi yok ve Zabihah'ta kaydı çıkmadı.",
    "sources": [
      "https://intravel.net/tampere/restaurants-cafes/babas-kitchen",
      "https://www.happycow.net/reviews/babas-kitchen-tampere-284566",
      "https://spinach.guide/venues/baba-s-kitchen-108414/"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Turku",
    "name": "Delhi Darbar",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Turku'da Hämeenkatu 8'de, 2008'den beri açık bir Hint restoranı olarak doğrulandı (Spinach, Funnelfeedr, Wanderlog). Hiçbir kaynak Turku şubesinin helal olduğunu söylemiyor; Zabihah'ta çıkan helal kayıtlar Dushanbe, Chicago, Dar es Salaam gibi başka şehirlerdeki aynı adlı işletmelere ait.",
    "sources": [
      "https://spinach.guide/venues/delhi-darbar-108187/",
      "https://funnelfeedr.com/en/company/fi/delhi-darbar-oy-29041017",
      "https://app.wanderlog.com/place/details/2692939"
    ]
  },
  {
    "countryCode": "FI",
    "city": "Åland Adaları",
    "name": "Kvarter5",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Mariehamn'da Norragatan'daki Hotel Pommern'in restoranı olarak bulundu (yerel ve uluslararası mutfak; yorumlarda geyik tartarı, Arctic char). Helal olduğuna dair hiçbir kaynak yok; alkol servisi muhtemel ama doğrudan doğrulanmadı.",
    "sources": [
      "https://wanderlog.com/place/details/2713652/kvarter5",
      "https://www.arrivalguides.com/en/Travelguide/ALAND/dining/kvarter5-122612"
    ]
  },
  {
    "countryCode": "FR",
    "city": "Bordo",
    "name": "Le Rajistan",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran 44 Quai Richelieu'de, Hint-Pakistan mutfağı olarak geçiyor (Cityzeum, Spinach, eat-list); hiçbir Le Rajistan sayfasında helal ifadesi yok. Aramada çıkan helal iddiaları Le Rajwal (17 rue des Faussets) gibi başka işletmelere ait. Adres Pont de Pierre ile Cours Alsace-Lorraine arası görünüyor; 'Saint-Michel' sem",
    "sources": [
      "https://www.cityzeum.com/le-rajistan",
      "https://spinach.guide/venues/le-rajistan-44561/",
      "https://www.eat-list.fr/bordeaux-33000/restaurant-indien-3/rajistan-180756",
      "https://tablejourney.com/france/bordeaux/dietary/halal/"
    ]
  },
  {
    "countryCode": "FR",
    "city": "Strazburg",
    "name": "Au Cèdre",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Restoranın kendi sitesinde 'Mezzé Vegetarien & Vegan Cuisine Méditerranéenne Halal' başlığında helal kelimesi geçiyor ama bu vejetaryen/vegan mezeyi anlatan belirsiz bir ifade, et için helal beyanı ya da sertifika görülmedi (Lebonbon da et tedarikini belirtmiyor); Mon Resto Halal'de bu restoran için net kayıt bulunamad",
    "sources": [
      "https://au-cedre.com/",
      "https://www.lebonbon.fr/strasbourg/cuisine-du-monde/au-cedre-le-restaurant-libanais-incontournable-a-strasbourg/",
      "https://fr.mappy.com/poi/538fe996e4b05da9bc404ef8",
      "https://mon-resto-halal.com/restaurants/categorie/libanais"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Belfast",
    "name": "Nora's Palace",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca dizinler helal diyor: Belfast Müslüman topluluk dizini, Family Friendly UK, Uber Eats helal kategorisi ve Zabihah ('Nora's Place' adıyla; sözlü güvence ile 'sertifikalı' ifadesi aynı sayfada çelişiyor). Restoranın kendi sitesi ya da sertifikalandırıcı kaydı bulunamadı. Adres Amelia Street, şehir merkeziyle uyu",
    "sources": [
      "https://nimfa-belfast.pages.dev/halal-directory",
      "https://familyfriendlyuk.co.uk/restaurants/noras-palace-belfast",
      "https://www.zabihah.com/restaurants/cb9b8172-7767-11ef-95ae-6045bdeb9f57/noras-place-belfast-county-antrim",
      "https://www.hygienescore.co.uk/business/noras-palace-bt2-7gs"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Brighton",
    "name": "Lavash",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca yerel dizinler (Restaurants Brighton helal rehberi, ThatsUp vb.) helal olarak listeliyor; restoranın kendi ifadesi, menüsü ya da sertifikası bulunamadı. Gardner Street (North Laine) ve North Street olmak üzere iki şube var, sonuçlar şubeleri karıştırıyor.",
    "sources": [
      "https://restaurantsbrighton.co.uk/halal-restaurants-brighton/",
      "https://restaurantsbrighton.co.uk/lavash-restaurant-brighton/",
      "https://thatsup.co.uk/brighton/restaurant/lavash-gardner-street-brighton",
      "https://thatsup.co.uk/brighton/restaurant/lavash-north-street-brighton"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Cambridge",
    "name": "Bedouin",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah (yönetici onaylı helal, ek kanıt yok; sözlü güvence notu var) ve HalalSpy helal diyor; Family Friendly UK ise helal işaretlemiyor, yani dizinler birbiriyle çelişiyor. Çoğu rehber alkol servis edilmediğini yazıyor ama bir dizinde 'Wine and Beer' etiketi var. Restoranın kendi sitesi ya da sertifika kaydı bulunama",
    "sources": [
      "https://www.zabihah.com/restaurants/ca14a70e-7767-11ef-95ae-6045bdeb9f57/bedouin-cambridge-cambridgeshire",
      "https://halalspy.com/halal-food-guide/uk/cambridge/",
      "https://familyfriendlyuk.co.uk/restaurants/bedouin-cambridge",
      "https://restaurantsforkings.com/city/cambridge/bedouin.html"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Cardiff",
    "name": "Shaam Nights",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah (sahipler Müslüman, tedarikçilerin helal sertifikalarını verdiği belirtiliyor), TripAligner ve bir üniversite rehberi menünün tamamen helal olduğunu yazıyor; ancak restoranın kendi sitesi ya da sertifikalandırıcı kaydı görülmedi. Alkol servis edilmiyor deniyor.",
    "sources": [
      "https://www.zabihah.com/restaurants/cb29b955-7767-11ef-95ae-6045bdeb9f57/shaam-nights-cardiff-south-wales",
      "https://tripaligner.com/countries/united-kingdom-34/destinations/cardiff-2331/places/shaam-nights-3985296",
      "https://residencelife.cardiff.ac.uk/story/13039079/the-best-restaurants-in-cardiff",
      "https://cardiffjournalism.co.uk/thecardiffian/?p=2856"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Cotswolds",
    "name": "Koloshi",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Koloshi, Charlton Kings (Cheltenham) London Road üzerinde bar da içeren Hint fine dining restoranı; Visit Cheltenham ve SquareMeal sayfalarında helal bilgisi yok. Helal diyen hiçbir kaynak bulunamadı.",
    "sources": [
      "https://visitcheltenham.com/eating-out/koloshi-p2555263",
      "https://www.squaremeal.co.uk/restaurant/koloshi-restaurant-and-bar"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Glasgow",
    "name": "Turkiye EFES",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Visit Glasgow'un helal restoranlar sayfası Türkiye EFES'i listeliyor, ancak arama özetinde restoranın kendisinin helal olduğunu açıkça belirten bir cümle görülmedi; sayfa metni teyit edilirse GUCLU'ya yükseltilebilir. TripAligner ve Intravel helal etiketi veriyor; tanıtım blogları mekânı 'cocktail bar' olarak anıyor (a",
    "sources": [
      "https://www.visitglasgow.com/eat-drink/restaurants/halal-restaurants",
      "https://list.co.uk/eat-drink/turkiye-efes-167",
      "https://tripaligner.com/countries/united-kingdom-34/destinations/glasgow-11979/places/turkiye-efes-restaurant-17544119",
      "https://intravel.net/glasgow/restaurants-cafes/turkiye-efes-restaurant"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Lake District",
    "name": "Jaan Indian Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Windermere'de Victoria Street'te helal köri ve biryani sunduğunu yazan tek kaynak HalalSpy rehberi; Zabihah, Hardens, Sally's Cottages Hint restoran listeleri ve FSA hijyen aramasında 'Jaan' adlı bir işletme bulunamadı (Sally's Cottages aynı sokakta Lake Raj adlı farklı bir Hint restoranı gösteriyor). Varlığı ve açık o",
    "sources": [
      "https://halalspy.com/halal-food-guide/uk/lake-district/",
      "https://www.sallyscottages.co.uk/guides/indian-restaurants-lake-district",
      "https://www.hygienescore.co.uk/windermere",
      "https://www.hardens.com/restaurants/Windermere/indian/"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Liverpool",
    "name": "Fozia's Kashmiri Restaurant",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca Deliveroo 'ev yapımı helal Keşmir, Pakistan ve Hint yemekleri' diyor; Zabihah kaydı ya da sertifika bulunamadı. Restoran Lodge Lane'deki tezgahtan 155-157 Picton Road (L15 4LG) adresine taşınmış, ayrıca 35 Renshaw Street (Grand Central) şubesi var; Kensington'da bir adres bulunamadı. FSA kaydındaki işletme adı",
    "sources": [
      "https://deliveroo.co.uk/menu/liverpool/fairfield/fozias",
      "https://www.foodhygieneratings.org.uk/fozias-kashmiri-kitchen-l15-4lg",
      "https://ymliverpool.com/restaurant-review-fozias-at-the-grand-central/55337",
      "https://www.inkl.com/news/lodge-lane-street-food-venue-announces-its-sad-closure-after-having-an-absolute-ball"
    ]
  },
  {
    "countryCode": "GB",
    "city": "Oxford",
    "name": "Antep Kitchen",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "TripAligner helal etiketi veriyor ve HalalSpy Oxford rehberi Cowley Road'daki başlıca helal seçenekler arasında sayıyor; restoranın kendi helal beyanı ya da sertifikalandırıcı kaydı bulunamadı. Adres Cowley Road ile uyumlu.",
    "sources": [
      "https://tripaligner.com/countries/united-kingdom-34/destinations/oxford-171/places/antep-kitchen-14947327",
      "https://halalspy.com/halal-food-guide/uk/oxford/",
      "https://www.opentable.co.uk/r/antep-kitchen-oxfordshire"
    ]
  },
  {
    "countryCode": "GB",
    "city": "York",
    "name": "Middle Feast",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca Zabihah, Middle Feast'i helal listeliyor (helal tabelası ve 'tüm yemekler sertifikalı' notu; aynı adreste bir başka Zabihah kaydında helal derecesi yok). Adres 13 Lendal; sitedeki Coney Street'te bir restoran bulunamadı (17 Coney Street kiralık ticari mülk olarak çıktı), aynı şehir merkezinde ama farklı sokak.",
    "sources": [
      "https://www.zabihah.com/restaurants/cbe6efea-7767-11ef-95ae-6045bdeb9f57/middle-feast-york-north-yorkshire",
      "https://app.zabihah.com/search?q=York"
    ]
  },
  {
    "countryCode": "GE",
    "city": "Batum",
    "name": "Karabak Halal Restaurant",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Batum'da 'Restaurant Karabak / Karabak Turkish Fastfood' adlı Türk lokantası var (Wanderlog, Restaurant Guru 'Turkish, Halal' etiketi, Foursquare); helal iddiası yalnızca bu toplayıcılardan, sertifika ya da restoranın kendi beyanı görülmedi; Acara turizm kaynağı doğrulanamadı. Adres kaynaklarda Chavchavadze St. 34 ya d",
    "sources": [
      "https://wanderlog.com/place/details/1248186/restaurant-karabak",
      "https://restaurantguru.com/Batumi",
      "https://lv.foursquare.com/sarac_erol/list/batum",
      "https://www.lametayel.co.il/pois/wgqr0"
    ]
  },
  {
    "countryCode": "GE",
    "city": "Kazbegi",
    "name": "Kazbegi Halal Corner",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek sorguda Kazbegi/Stepantsminda'da 'Kazbegi Halal Corner' adlı bir işletme bulunamadı. Çıkan tek helal ipucu Maharajah Palace (Hint/helal, Alexander Kazbegi Sk.); bir gezi rehberi bölgede helal etin yaygın olmadığını yazıyor. Girdideki georgia.travel kaynağı genel bir sayfa; ikinci sorgu yapılamadı.",
    "sources": [
      "https://www.madloba.info/en/stepantsminda/restaurants/maharajah-palace/"
    ]
  },
  {
    "countryCode": "GE",
    "city": "Tiflis",
    "name": "Ali Baba Halal Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "3 aramada Gorgasali Meydanı / Eski Tiflis'te bu adla bir restoran bulunamadı. Tek yakın eşleşme Wolt'taki 'LLC Halal Ali Baba Shawarma' (Fattoom adlı şavurma yeri, 23 Ilori St.), Eski Tiflis'te değil ve restoran değil, farklı bir işletme; kayıttaki 'Gürcistan Müslümanları İdaresi rehberi' kaynağı da georgia.travel adre",
    "sources": [
      "https://wolt.com/en/geo/tbilisi/restaurant/fattoom"
    ]
  },
  {
    "countryCode": "GR",
    "city": "Atina",
    "name": "Mirch",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Ermou Caddesi'nde (115, Monastiraki yakını) küçük bir Hint restoranı olarak anılıyor (bir kaynak Exarchia, bir başkası Plaka diyor, adres çelişkili); menüde souvlaki de var ve hiçbir kaynak helal olduğunu söylemiyor. Helalspy'ın Atina rehberi Monastiraki/Plaka'da özel helal restoran olmadığını belirtiyor.",
    "sources": [
      "https://www.expatexchange.com/rg/54399/mirch",
      "https://mapthemeal.com/athens/exarchia/mirch",
      "https://halalspy.com/halal-food-guide/europe/athens/"
    ]
  },
  {
    "countryCode": "GR",
    "city": "Korfu",
    "name": "Tandoori Bites",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "'The Tandoori Bites' Korfu şehrinde (Ethnikis Antistaseos 14) tavuk, kuzu ve vejetaryen yemekli bir Hint restoranı olarak kayıtlı; Greeka, TripAligner ve Wanderlog'da helal etiketi yok. Zabihah'taki helal Tandoori Bites kayıtları ABD'deki işletmeler, bu restoranla ilgisi yok.",
    "sources": [
      "https://greeka.com/ionian/corfu/eat-drink/restaurants/town/the-tandoori-bites",
      "https://tripaligner.com/countries/greece-2/destinations/kerkyra-58/places/the-tandoori-bites-12567680",
      "https://wanderlog.com/place/details/1682957/the-tandoori-bites"
    ]
  },
  {
    "countryCode": "GR",
    "city": "Meteora",
    "name": "Taverna Gardenia",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kastraki köyünün ana caddesinde 1998'den beri aile işletmesi bir taverna olarak anılıyor; HappyCow'a göre et servis ediyor ve bira/şarap var, vejetaryen yemekleri öne çıkıyor. Hiçbir kaynak helal olduğunu söylemiyor.",
    "sources": [
      "https://www.happycow.net/reviews/taverna-gardenia-kastraki-472984",
      "https://spinach.guide/venues/taverna-gardenia-244882/",
      "https://wanderlog.com/place/details/1909690"
    ]
  },
  {
    "countryCode": "GR",
    "city": "Rodos",
    "name": "Marrakech",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Rodos Eski Şehir'de Marrakech adlı bir restoran sonuçlarda çıkmadı (yalnız başka ülkelerdeki Marrakech kayıtları geldi); tek sorguyla bulunamadı. Halalspy Rodos rehberi Eski Şehir için başka isimler (Mezza Lebanese Cuisine, Zaytouna, SAFFRON) anıyor, bunlar doğrulanmadı.",
    "sources": [
      "https://halalspy.com/halal-food-guide/europe/rhodes/"
    ]
  },
  {
    "countryCode": "GR",
    "city": "Selanik",
    "name": "Falafel Taste Middle East",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "HappyCow ve Spinach Guide'da Selanik'te et servis eden, vegan seçenekli bir Orta Doğu restoranı olarak kayıtlı (Agora Modiano şubesinde bira/şarap var); hiçbir kaynak helal olduğunu söylemiyor. Adres kaynaklar arasında çelişkili (Mitropoleos 108 / Vasileos Irakleiou 33), o yüzden yazılmadı.",
    "sources": [
      "https://happycow.net/reviews/falafel-taste-middle-east-thessaloniki-86086",
      "https://spinach.guide/venues/falafel-taste-middle-east-96843/",
      "https://happycow.net/reviews/falafel-taste-agora-modiano-thessaloniki-328096"
    ]
  },
  {
    "countryCode": "HR",
    "city": "Hvar",
    "name": "Dalmatino",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Hvar'da Ul. Sveti Marak 1'de Dalmaçya biftek ve balık restoranı olarak bulundu (Frommer's, Gault&Millau); menüde şarap ve rakija geçiyor. Helal olduğuna dair hiçbir kaynak yok.",
    "sources": [
      "https://www.frommers.com/destinations/hvar/restaurants/dalmatino",
      "https://hr.gaultmillau.com/en/restaurants/dalmatino"
    ]
  },
  {
    "countryCode": "HR",
    "city": "Istria",
    "name": "Epulon",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Pula'da Epulonova 3'te Hotel Galija'ya bağlı, şarap odaklı 'Epulon Food & Wine' olarak bulundu (Time Out, TripAligner); İstriya tapasları, trüflü makarna ve deniz ürünleri sunuyor. Helal olduğunu söyleyen hiçbir kaynak yok; helal dizinlerinde de adı geçmedi.",
    "sources": [
      "https://www.timeout.com/croatia/restaurants/epulon-food-wine",
      "https://tripaligner.com/countries/croatia-9/destinations/pula-4171/places/epulon-food-wine-14093415"
    ]
  },
  {
    "countryCode": "HR",
    "city": "Plitvice Gölleri",
    "name": "Restaurant Degenija",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Plitvice yakınında Rakovica'daki Hotel Degenija'nın restoranı; menüsü et ağırlıklı ve kaynak özetlerinde pršut (domuz jambonu), kulen ve süt domuzu/kuzu şiş geçiyor, yani domuz eti servis ediliyor. Helal olduğuna dair hiçbir kaynak yok (özet kaynaklı bilgi, menü sayfası doğrudan okunamadı).",
    "sources": [
      "https://www.lika-destination.hr/gastronomy/gastro/281/hotel-restaurant-degenija",
      "https://www.timeout.com/croatia/restaurants/restoran-degenija"
    ]
  },
  {
    "countryCode": "HR",
    "city": "Split",
    "name": "Kantun Paulina",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Split'te Matošića 1'de uzun soluklu bir ćevapi büfesi olarak doğrulandı (Total Croatia News, In Your Pocket); ćevapi, tavuk göğsü ve dana köfte sunuyor. Helal olduğuna dair hiçbir kaynak yok.",
    "sources": [
      "https://total-croatia-news.com/?p=15364",
      "https://inyourpocket.com/croatia/split/venues/kantun-paulina"
    ]
  },
  {
    "countryCode": "HR",
    "city": "Zadar",
    "name": "Harbor CookHouse",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Zadar'da Obala kneza Branimira 6a'da 'Harbor Cookhouse & Club' olarak bulundu (kuru olgunlaştırılmış biftek, kılıç balığı; In Your Pocket, Gault&Millau). Helal olduğuna dair hiçbir kaynak yok.",
    "sources": [
      "https://inyourpocket.com/croatia/zadar/venues/harbor-cookhouse-club",
      "https://hr.gaultmillau.com/en/restaurants/harbor-cookhouse-club"
    ]
  },
  {
    "countryCode": "HR",
    "city": "Šibenik",
    "name": "Bava Dining",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Šibenik'te Eski Şehir ile deniz arasındaki bir meydanda 'Bistro Bava' (deniz ürünleri ve modern Akdeniz mutfağı) olarak bulundu; bir yorum pancetta (domuz) sarılı ahtapot yemeğini öne çıkarıyor, yani domuz ürünü servis ediliyor. Helal olduğunu söyleyen kaynak yok, Hırvatistan helal rehberlerinde (Doha News) adı geçmiyo",
    "sources": [
      "https://inyourpocket.com/croatia/sibenik/venues/bistro-bava",
      "https://theculturetrip.com/europe/croatia/articles/the-10-best-restaurants-in-sibenik-croatia",
      "https://dohanews.co/your-guide-to-the-best-halal-food-in-croatia/"
    ]
  },
  {
    "countryCode": "HU",
    "city": "Balaton Gölü",
    "name": "Mamma Mia Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Balatonalmádi veya Siófok'ta 'Mamma Mia Kebab' adlı bir işletme bulunamadı; en yakın sonuç Balatonfüred'deki 'Mamma Mia Gyorsétterem' (fast food) olup helal bilgisi içermiyor ve aynı işletme olduğu doğrulanamadı. Deliveroo'daki helal etiketli 'Mamma Mia' İngiltere'ye ait, ilgisiz.",
    "sources": []
  },
  {
    "countryCode": "HU",
    "city": "Debrecen",
    "name": "Aladdin Gyros",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran 'Aladdin Gyros Bár' adıyla Wolt'ta var (Piac utca 10, 4026 Debrecen); et ve soslar kendi baharat karışımıyla hazırlanıyor deniyor ama hiçbir sayfa helal demiyor. Aynı aramada Debrecen'de helal diyen başka işletmeler (The Kitchen, Guszta Kebab) çıktı, bu kayıt onlardan biri değil.",
    "sources": [
      "https://wolt.com/en/hun/debrecen/restaurant/aladdin-gyros-br"
    ]
  },
  {
    "countryCode": "HU",
    "city": "Eger",
    "name": "Kebab Club",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Eger'de 'Kebab Club' adlı bir işletme kaydı çıkmadı; Wolt Eger listesinde başka kebap yerleri (Istanbul Kebab, Gyros és Kebab Ház) görünüyor, helal ibaresi yok. Arama tek sorguyla sınırlı olduğundan kesin kapanış değil, ama doğrulanabilir hiçbir kayıt yok.",
    "sources": [
      "https://wolt.com/en/hun/eger"
    ]
  },
  {
    "countryCode": "HU",
    "city": "Pécs",
    "name": "Sultan Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Pécs'te 'Sultan Kebab' adlı bir işletme çıkmadı; sonuçlar yalnız ABD, Fransa (Limoges) ve Birleşik Krallık'taki aynı adlı başka işletmelerle ilgili. Arama tek sorguyla sınırlı olduğundan kesin kapanış değil, ama doğrulanabilir hiçbir kayıt yok.",
    "sources": []
  },
  {
    "countryCode": "HU",
    "city": "Sopron",
    "name": "Ottoman Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Sopron'da 'Ottoman Kebab' adlı bir işletme çıkmadı; yalnız Almanya ve Panama'daki başka 'Ottoman' adlı yerler ile Sopron'da alakasız bir büfe (Anger Büfé, helal ibaresi yok) çıktı. Arama tek sorguyla sınırlı olduğundan kesin kapanış değil, ama doğrulanabilir hiçbir kayıt yok.",
    "sources": []
  },
  {
    "countryCode": "HU",
    "city": "Szeged",
    "name": "Taj Mahal",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Szeged Turizm sayfasında 'Taj Mahal Indian Restaurant' olarak kayıtlı (Gutenberg u. 12, her gün 11:00-22:00, Hint/Pakistan mutfağı) ama hiçbir kaynak helal demiyor; helal ibareli 'Taj Mahal' sonuçları başka ülkelerdeki (Lübeck, Pittsburgh, Tokorozawa) işletmelere ait ve bu kayda uygulanamaz.",
    "sources": [
      "https://szegedtourism.hu/en/taj-mahal-indian-restaurant"
    ]
  },
  {
    "countryCode": "HU",
    "city": "Szentendre",
    "name": "Török Kávézó",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Szentendre'de 'Török Kávézó' adlı güncel bir işletme çıkmadı; tek eşleşme 1950-60'lardan kalma Budapeşte'deki bir kafenin arşiv fotoğrafı. Szentendre için helal diyen hiçbir restoran da bulunamadı.",
    "sources": []
  },
  {
    "countryCode": "ID",
    "city": "Canggu",
    "name": "Warung Dandelion",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Jalan Pantai Batu Bolong No.10'da, bahçeli geleneksel Balinese evinde, gurbetçi ve sörfçülere hitap eden bir kafe/restoran olarak anlatılıyor; helal beyanı ya da sertifika kaydı yok. Domuz eti ya da alkol servisine dair kaynak da görmedim; yalnız helal kanıtı yok.",
    "sources": [
      "https://www.airbnb.com/things-to-do/places/1068407",
      "https://co.hoteles.com/go/indonesia/best-canggu-restaurants"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Labuan Bajo",
    "name": "Taman Laut Handayani",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Labuan Bajo'da deniz ürünleri restoranı olarak var (Jl. Ande Bole No.9, Wanderlog'a göre) ama hiçbir kaynak helal olduğunu söylemiyor; balık/deniz ürünü kendiliğinden helal olsa da mutfak ve alkol politikası hakkında kayıt yok. Indonesia.travel sayfası Kupang adresi veriyor, farklı bir işletme olabilir. LPPOM'un Labuan",
    "sources": [
      "https://wanderlog.com/place/details/3052185/taman-laut-handayani-seafood-restaurant-labuan-bajo",
      "https://indonesia.travel/uk/en/travel-ideas/taman-laut-handayani"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Lombok",
    "name": "El Bazar Cafe & Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kuta Lombok'ta (Jl. Raya Kuta No.5) var; Akdeniz/Orta Doğu/İspanyol ve biftek-deniz ürünü menüsü, bir kaynak menüsünün 'şaraba ağırlıklı' olduğunu yazıyor. Lombok varsayılan-helal bölge olsa da alkol merkezli mekân işareti olduğundan VARSAYILAN_HELAL verilmedi; hiçbir kaynak helal demiyor, domuz bilgisi de yok.",
    "sources": [
      "https://wanderlog.com/place/details/43533/el-bazar-cafe--restaurant",
      "https://www.booked.ai/restaurants/el-bazar-cafe-restaurant"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Nusa Penida",
    "name": "Warung Jukung",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Nusa Penida'da kıyıda, deniz manzaralı aile işletmesi deniz ürünü/Endonezya/vejetaryen restoranı olarak kayıtlı, ama hiçbir kaynak helal demiyor (helal diye çıkan 'The Tamban Jukung' farklı bir konaklama tesisi). Semt kaynaklar arasında tutarsız: bir video kaydı Batununggul diyor, bir rehber Batumulapan; kesin çelişki ",
    "sources": [
      "https://navi-savi.com/videos/51512-warung-jukung"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Raja Ampat",
    "name": "Raja Ampat Dive Lodge Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Mansuar Adası'ndaki Raja Ampat Dive Lodge'un kahvaltı/öğle/akşam servis eden tek restoranı, yerel mutfak ve deniz ürünü sunuyor; ayrı bir restoran değil otel restoranı. HalalBooking helal yemek ve alkolsüz alan bilgisini 'veri beklemede' gösteriyor, başka hiçbir kaynak helal demiyor.",
    "sources": [
      "https://halalbooking.com/en/raja-ampat-dive-lodge/p/422890",
      "https://dinogo.com/hotels/320368-raja-ampat-diving-resort"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Tana Toraja",
    "name": "Rimiko Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Rantepao'da Jl. Andi Mappanyukki No.115 adresinde böyle bir restoran var (Wanderlog, Lonely Planet, Spinach Guide); menüsü vejetaryen dostu, ayrıca et ve balık yemekleri var. Hiçbir kaynak helal olduğunu söylemiyor; Tana Toraja varsayılan-helal istisnasının dışında olduğu için KANIT_YOK.",
    "sources": [
      "https://wanderlog.com/place/details/2684140/rimiko-restaurant",
      "https://www-lonelyplanet-com-57e2.imagizer.com/indonesia/sulawesi/rantepao/restaurants/rimiko-restoran/a/poi-eat/1215154/356616",
      "https://spinach.guide/venues/rimiko-restaurant-189786/"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Toba Gölü",
    "name": "Rohana's Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Tuk Tuk bölgesinde pirinç tarlaları arasında sakin, ev yemeği ve vejetaryen seçenekli bir yer olarak anılıyor (Wanderlog yorumları), fakat hiçbir sonuçta helal ifadesi yok. Aynı aramada Tuk Tuk için helal olarak anılan alternatif: Rumah Makan Islam Mami Tempo (Wanderlog yorumları, ayrıca doğrulanmadı).",
    "sources": [
      "https://wanderlog.com/place/details/2683269/rumah-makan-islam-mami-tempo"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Ubud",
    "name": "Warung Makan Bu Rus",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Eatbook.sg'nin Ubud rehberi ve restoran sayfası Warung Makan Bu Rus'un helal sertifikalı bir mekân olmadığını açıkça yazıyor; nasi campur ile tanınan sıradan bir Bali warung'u. Menüde domuz/lard ifadesi sonuçlarda doğrulanmadı, yani sorun helal güvencesinin olmaması.",
    "sources": [
      "https://eatbook.sg/warung-makan-bu-rus/",
      "https://eatbook.sg/ubud-food-guide/"
    ]
  },
  {
    "countryCode": "ID",
    "city": "Uluwatu",
    "name": "Warung Solo Via",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Warung Solo Via var: HappyCow'da Ungasan şubesi vegan ağırlıklı büfe olarak, Spinach Guide'da Endonezya büfesi olarak listeli; helal sertifikası ya da beyanı yok. Bali istisnası (Uluwatu/Pecatu) nedeniyle varsayılan-helal uygulanamaz; Pecatu adresi doğrulanamadı.",
    "sources": [
      "https://www.happycow.net/reviews/warung-solo-via-ungasan-307593",
      "https://spinach.guide/venues/warung-solo-via-188859/"
    ]
  },
  {
    "countryCode": "IT",
    "city": "Amalfi Kıyısı",
    "name": "Kasai Amalfi Coast",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kasai, Praiano'da (Via Umberto I, 84; 2021'de açılmış) restoran olarak bulundu; yorumlarda deniz tarağı, trüf makarna, kalamar ve kuzu yemeği geçiyor ama hiçbir kaynakta helal sertifikası, helal et ya da helal politikası yok (diyet bilgisi yalnız glütenle ilgili).",
    "sources": [
      "https://summerinitaly.com/guide/kasai-restaurant",
      "https://www.findmeglutenfree.com/biz/kasai/4919513592758272"
    ]
  },
  {
    "countryCode": "IT",
    "city": "Floransa",
    "name": "Crown of India",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran gerçek (Via Faenza 102/104r, Santa Maria Novella yakını) ama hiçbir kaynak helal olduğunu net söylemiyor: Dinnersite'ta 'Halal' etiketi var fakat başka restoranın başlığı altında olduğu için hangi işletmeye ait olduğu belirsiz; restoranın kendi sitesi helal yerine 'her diyete uygun seçenek' diyor. Kayıttaki Ha",
    "sources": [
      "https://en.dinnersite.nl/restaurant/ristorante-indiano-crown-of-india-r632629",
      "https://www.italia.it/en/toscana/firenze/where-to-eat/crown-of-india--ristorante-indiano-a-firenze",
      "https://crownofindia.elisa.supporthost.eu/",
      "https://www.zabihah.com/restaurants/ca859a0d-7767-11ef-95ae-6045bdeb9f57/zafferano-firenze-toscana"
    ]
  },
  {
    "countryCode": "IT",
    "city": "Milano",
    "name": "Aladino",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah ('all food certified halal'), TripAligner ve HalalSpy ('Aladino Halal' etiketi, shawarma ve ızgara) helal diyor; hepsi dizin kaynağı, sertifika kaydı ve restoranın kendi sayfası bulunamadı. Alkol konusunda çelişki var: Zabihah 'alcohol served', Wanderlog yorumu menüde alkol olmadığını söylüyor. Adres Via Achill",
    "sources": [
      "https://www.zabihah.com/restaurants/caa8b6e4-7767-11ef-95ae-6045bdeb9f57/aladino-milano-lombardia",
      "https://tripaligner.com/countries/italy-15/destinations/milano-3769/places/ristorante-aladino-1607080",
      "https://halalspy.com/halal-food-guide/europe/milan/",
      "https://milanosegreta.co/en/best-lebanese-restaurants-milan/"
    ]
  },
  {
    "countryCode": "IT",
    "city": "Napoli",
    "name": "Taj Mahal Napoli",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca Zabihah tam helal, alkolsüz ve 'helal sertifikası dosyada' diyor (dizin beyanı, sözlü teyit); başka helal kaynağı yok, Stars and Stripes yorumu vasat. Bulunan Taj Mahal Via San Giacomo 25/26'da (Quartieri Spagnoli); Piazza Garibaldi çevresinde bu adla bir restoran bulunamadı.",
    "sources": [
      "https://www.zabihah.com/restaurants/cbdc900f-7767-11ef-95ae-6045bdeb9f57/taj-mahal-napoli-campania",
      "https://tripaligner.com/countries/italy-15/destinations/napoli-805/places/taj-mahal-ristorante-indiano-8616307",
      "https://www.stripes.com/living/europe_travel/after_hours/2022-04-14/good-service,-kitschy-decor-dont-make-enough-for-return-visit-to-taj-mahal-5597641.html"
    ]
  },
  {
    "countryCode": "IT",
    "city": "Roma",
    "name": "Himalaya's Kashmir",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah (sözlü teyit, tam helal, alkolsüz), TripAligner, HalalSpy ve Eating Europe helal listeliyor; hepsi dizin/rehber kaynağı, sertifika veya restoranın kendi sayfası bulunamadı. italia.it resmî kaydı var ama helal ifadesi doğrulanamadı (sayfa araçta erişilemedi, italia.it'te arama sonuç vermedi). Adres Esquilino ile",
    "sources": [
      "https://www.zabihah.com/restaurants/ca1ea231-7767-11ef-95ae-6045bdeb9f57/himalayas-kashmir-roma-lazio",
      "https://tripaligner.com/countries/italy-15/destinations/roma-2121/places/himalaya-s-kashmir-ristorante-indiano-795692",
      "https://halalspy.com/halal-food-guide/europe/rome/",
      "https://www.eatingeurope.com/blog/essential-halal-restaurants-in-rome-lazio/"
    ]
  },
  {
    "countryCode": "IT",
    "city": "Venedik",
    "name": "SKK Mediterranea",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "'SKK Mediterranea Halal' / 'SKK Shock Kebab Italy' olarak Zabihah ('fully halal', sertifika mekanda görünür deniyor), Trip101 ve Bonjour Venise listeliyor; HalalSpy yalnızca 'Halal-declared' (işletme beyanı) diyor. Hepsi dizin/rehber kaynağı. Adres Campo Manin 4253 (San Marco, Rialto yakını); sitedeki 'Cannaregio' ile ",
    "sources": [
      "https://www.zabihah.com/restaurants/cad09ccc-7767-11ef-95ae-6045bdeb9f57/skk-shock-kebab-italy-venezia-veneto",
      "https://halalspy.com/halal-food-guide/europe/venice/",
      "https://trip101.com/article/halal-restaurants-in-venice",
      "https://bonjourvenise.fr/en/?p=2104"
    ]
  },
  {
    "countryCode": "JP",
    "city": "Hiroshima",
    "name": "Okonomiyaki & Teppanyaki Jirokichi",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Jirokichi gerçek bir izakaya tarzı okonomiyaki/teppanyaki yeri (Tabelog, byFood, Get Hiroshima; Tomiya Building 2F, 9-26 Nakamachi, Naka-ku, semt uyumlu) ve vegan menüsüyle biliniyor; hiçbir kaynak helal olduğunu söylemiyor. Hiroshima'da helal okonomiyaki sunan yerler başka işletmeler (Teppanyaki MeiMei, Zicon); kayıtt",
    "sources": [
      "https://ssl.tabelog.com/en/hiroshima/A3401/A340115/34019226/",
      "https://byfood.com/restaurant/jirokichi-7409",
      "https://gethiroshima.com/features/new-okonomiyaki-and-izakaya-nightspot-for-vegans-in-hiroshima/",
      "https://www.halalmedia.jp/?p=40307"
    ]
  },
  {
    "countryCode": "JP",
    "city": "Kobe",
    "name": "Halal Kobe Beef Nagomi",
    "action": "remove",
    "result": "GUCLU",
    "reason": "Kyoto Halal Council kaydı var ama işletme Kobe/Sannomiya'da değil (Osaka Nipponbashi / Tokyo Sendagi); Kobe rehberinde yanlış şehir.",
    "sources": [
      "https://halal.kyoto.jp/client",
      "https://www.halalfoodinjapan.com/restaurant/Osaka/AREAL3142/AREAM3150/R10065/",
      "https://halalmedia.jp/archives/38696/halal-kobe-beef-nagomi-osaka-new-menu/",
      "https://www.halalmedia.jp/?p=27782"
    ]
  },
  {
    "countryCode": "JP",
    "city": "Okinawa",
    "name": "Okinawa Halal Kitchen",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İngilizce ve Japonca iki aramada Nakagusuku'da 'Okinawa Halal Kitchen' adlı bir işletme bulunamadı; Okinawa helal rehberleri (byFood, Halal Media, halalfoodinjapan) bu adı anmıyor. Yakın bölgede listelenen helal yerler başka adlı (Turkish Rokanta Kerebekki Nishihara, Istanbul Kebab House Chatan).",
    "sources": [
      "https://www.byfood.com/okinawa-halal-restaurants",
      "https://www.halalmedia.jp/?p=31222"
    ]
  },
  {
    "countryCode": "JP",
    "city": "Osaka",
    "name": "Halal Restaurant Matsuri",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Matsuri (Japanese Food Restaurant Matsuri) Fukushima-ku, Osaka'da (3-27-17 Yoshino) gerçek; Halal Media ve Groovy Japan 'helal restoran/helal mutfak' diyor, ancak Halal Media'nın açılış yazısı 'helal sertifikalı değiller ve alkol servis ediyorlar' notunu içeriyor, 2023 rehberi ise 'helal sertifikalı malzeme' diyor. Res",
    "sources": [
      "https://halalmedia.jp/archives/13227/long-awaited-halal-takoyaki-is-here-matsuri/2/",
      "https://halalmedia.jp/archives/31327/matsuri_started_halal_kitchen/",
      "https://groovyjapan.com/en/iman_en30",
      "https://japanactivity.com/osaka-halal-muslim-friendly-food-guide"
    ]
  },
  {
    "countryCode": "JP",
    "city": "Tokyo",
    "name": "PANGA",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Halal Media, byFood ve diğer rehberler yakiniku PANGA'nın (Taito/Shin-Okachimachi, 3-27-9) Japan Halal Foundation (Okachimachi Camii) sertifikalı, tüm et ve soslarının helal olduğunu aktarıyor, alkol servisi var; ancak JHF'nin birincil kaydını ya da restoranın kendi sitesini okuyamadım (TableCheck wagyu-panga.jp adresi",
    "sources": [
      "https://halalmedia.jp/archives/11919/halal-yakiniku-review-panga/2",
      "https://www.byfood.com/restaurant/halal-wagyu-yakiniku-panga-1123",
      "https://www.tablecheck.com/yakiniku-panga-okachimachi",
      "https://www.japanesefoodguide.com/?p=991"
    ]
  },
  {
    "countryCode": "KR",
    "city": "Busan",
    "name": "Cappadocia",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Geumjeong-gu'da (Namsan-dong, Busan Al-Fatah Camii yakını) Türk kebap restoranı; helal iddiası Trip101, Tripfez, Pelago gibi gezi blogları/rehberlerinden geliyor. KTO Müslüman dostu listesi onu yalnızca 'Self Certified' (işletme beyanı) olarak gösteriyor, Visit Busan sayfası 'Müslüman ziyaretçiler için uygun' diyor ama",
    "sources": [
      "https://english1.visitkorea.or.kr/e_book/access/ecatalogt.jsp?callmode=normal&catimage=&eclang=ko&Dir=706&um=s&start=6",
      "https://www.visitbusan.net/en/index.do?menuCd=DOM_000000302003001000&uc_seq=2203&lang_cd=en",
      "https://trip101.com/article/halal-restaurants-in-korea",
      "https://www.pelago.com/ja/articles/halal-food-in-busan"
    ]
  },
  {
    "countryCode": "KR",
    "city": "Gyeongju",
    "name": "Taj Mahal in Korea",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek sorguda Gyeongju'da 'Taj Mahal in Korea' adlı bir Hint restoranı bulunamadı; Zabihah'ta Gyeongju için yalnız Curry Hut (Wonhyo-ro) çıktı, Taj Mahal adlı helal kayıtlar Daejeon ve Cheonan'da. Girdideki KTO PDF'ine erişilemedi ve ikinci (Korece) sorgu arama bütçesi bittiği için yapılamadı; KTO listesinde gerçekten ye",
    "sources": [
      "https://www.zabihah.com/restaurants/cb5a869c-7767-11ef-95ae-6045bdeb9f57/curry-hut-gyeongju-gyeongsangbuk-do"
    ]
  },
  {
    "countryCode": "KR",
    "city": "Incheon",
    "name": "Aladdin Kebab",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Yalnızca KTO Müslüman dostu restoran rehberinde 'Aladdin Kebab / Incheon / 032-832-6003' satırı görüldü; açıklama, helal kategorisi, adres ya da semt (Yeonsu/Songdo) görülmedi, başka hiçbir kaynakta bulunamadı. Aynı bölgede helal olarak listelenen işletmeler başka adlı (Yahala, Arabesque).",
    "sources": [
      "https://english1.visitkorea.or.kr/e_book/access/ecatalogt.jsp?callmode=normal&catimage=&eclang=ko&Dir=868&um=s&start=16",
      "https://english.visitkorea.or.kr/enu/ATR/SI_ENG_muslim.jsp?gotoPage=31"
    ]
  },
  {
    "countryCode": "KR",
    "city": "Sokcho",
    "name": "Miga",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Sokcho'da 41 Sinheung 2-gil adresinde, kurutulmuş Alaska morinası (hwangtae) yemekleriyle bilinen bir Miga listeleme sitelerinde bulundu; helal ya da Müslüman dostu olduğunu söyleyen hiçbir kaynak yok (helal etiketli Miga'lar Kanada ve İngiltere'deki başka işletmeler). Adres Sokcho şehir merkezinde görünüyor, Seoraksan",
    "sources": [
      "https://korea-now.pages.dev/restaurants/gangwon-miga"
    ]
  },
  {
    "countryCode": "MA",
    "city": "Fes",
    "name": "Palais Bab Sahra",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Fes el-Bali'de Boujloud yakınında 'Riad Fes Palais Bab Sahra Suites & Cooking Workshops' adlı bir riad/restoran var (ViaMichelin, Expedia, Wanderlog); yalnızca ViaMichelin otel kaydı 'vejetaryen ve helal seçenekler' diyor, bu bir seçenek beyanı, restoranın helal olduğu ya da sertifika değil. Alkolsüz olduğuna dair kayn",
    "sources": [
      "https://www.viamichelin.fr/cartes-plans/hotels/poi/fes-30110-37e41a2a",
      "https://wanderlog.com/place/details/4777181/restaurant-bab-sahra-fes",
      "https://www.expedia.com.au/Fes-Hotels-Restaurant-Palais-Bab-Sahra-Fes.h98509002.Hotel-Information"
    ]
  },
  {
    "countryCode": "MA",
    "city": "Marakeş",
    "name": "Al Fassia Aguedal",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Restoran/butik otel gerçek ve ünlü (Tripadvisor, Fodor's, Gayot), Route de l'Ourika üzerindeki Agdal turistik bölgesinde; Guéliz'deki Al Fassia ayrı bir kardeş şube. Hiçbir kaynak helal ya da 'helal sertifikalı' demiyor; Gayot sayfasında yalnızca 'Moroccan wine' yazılı bir fotoğraf başlığı var (alkol servisi kesin deği",
    "sources": [
      "https://www.tripadvisor.com.au/Restaurant_Review-g293734-d788994-Reviews-Al_Fassia_Aguedal_Restaurant-Marrakech_Marrakech_Safi.html",
      "https://www.gayot.com/restaurants/al-fassia-aguedal-restaurant-marrakech-morocco/",
      "https://societe24.com/ma/en/restauration/marrakech-safi/marrakech/al-fassia-aguedal"
    ]
  },
  {
    "countryCode": "MA",
    "city": "Şefşavan",
    "name": "Restaurant Beldi Bab Ssour",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "Restoran gerçek ve medinada, adres Rue El Kharrazin No:5 (Fodor's ve Tripadvisor tutarlı), semt uyumlu. Hiçbir kaynak helal ya da alkolsüz olduğunu belirtmiyor; Fas'ta bu tür yerlerin helal olması beklenir ama bu bir tahmin, kanıt değil.",
    "sources": [
      "https://www.fodors.com/world/africa-and-middle-east/morocco/tangier-and-the-mediterranean/restaurants/reviews/restaurant-beldi-bab-ssour-292744930",
      "https://www.tripadvisor.com/ShowUserReviews-g304013-d6879116-r504217094-Restaurant_Beldi_Bab_Ssour-Chefchaouen_Tanger_Tetouan_Al_Hoceima.html"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Budva",
    "name": "Taste of Asia",
    "action": "remove",
    "result": "SORUNLU",
    "reason": "Budva'daki Taste of Asia Popa Jola Zeca'da bir Tay restoranı; hiçbir kaynak helal demiyor, bir yorumcu domuz kıymalı mantı yediğini yazmış (hangi listeleme sitesinde olduğu arama özetinden kesin ayrılamadı), alkol/bar servisi var. Arama sonucundaki 'Taste of Asia Halal' University City'deki başka bir işletme.",
    "sources": [
      "https://wanderlog.com/place/details/1196436/taste-of-asia",
      "https://www.happycow.net/reviews/taste-of-asia-budva-294625",
      "https://www.livetheworld.com/activities/montenegro/thai-restaurant-taste-of-asia-budva"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Cetinje",
    "name": "Konoba Korzo",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran PlanPlus'ta Cetinje'de Njegoševa 24 adresiyle yerel mutfak olarak listeli, Wanderlog yorumları var; hiçbir kaynakta helal ifadesi yok.",
    "sources": [
      "https://www.planplus.rs/crna-gora/cetinje/nacionalni-restorani",
      "https://wanderlog.com/place/details/4201451/konoba-korzo"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Durmitor",
    "name": "Podgora",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran Podgora Žabljak'ta (Božidara Žugića bb) bölgesel dizinde ve Wanderlog'da var (Durmitor Steak, ızgara sebze, dolma biber, baklava); hiçbir kaynak helal olduğunu söylemiyor, Halalbooking sonuçları yalnız yakındaki konaklamalarla ilgili.",
    "sources": [
      "https://www.planplus.rs/crna-gora/zabljak/nacionalni-restorani",
      "https://wanderlog.com/place/details/2719281"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Herceg Novi",
    "name": "Taverna Galija",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Taverna Galija Herceg Novi'de Šetalište Pet Danica 76'da listeli, Wanderlog'da yorumları var; hiçbir kaynak helal demiyor. Halalbooking'deki 'Hotel Galija' kaydı ayrı bir işletme ve 500 m çevredeki helal yemek seçeneklerini anlatıyor, bu restoranı değil.",
    "sources": [
      "https://wanderlog.com/place/details/2318807/taverna-galija",
      "https://www.planplus.rs/crna-gora/herceg-novi/restorani/2"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Kotor",
    "name": "Tanjga Family Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Izgara ve biftek ağırlıklı, 25 yılı aşkın aile işletmesi olarak listeleniyor (Wanderlog, TripAligner); hiçbir kaynakta helal ifadesi yok. Wanderlog 'Eski Şehir'in hemen dışında' diyor, sitedeki 'Stari Grad' ile tam örtüşmüyor ama açık çelişki saymadım; TripAligner'da benzer ad Budva altında da çıkıyor, aynı işletme olu",
    "sources": [
      "https://tripaligner.com/countries/montenegro-3/destinations/budva-7103/places/steak-bbq-house-tanjga-19103828"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Perast",
    "name": "Armonia",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran Armonia Perast'ta kıyıda deniz ürünü/Akdeniz mutfağı olarak HappyCow, Wanderlog ve TripAligner'da listeli; alkol servisi var, helal ifadesi yok. Halalbooking'in Heritage Grand Perast sayfası yalnız 500 m çevredeki helal seçenekleri anlatıyor, Armonia'yı adıyla anmıyor.",
    "sources": [
      "https://happycow.net/reviews/restaurant-armonia-perast-405079",
      "https://wanderlog.com/place/details/1266409/restoran-armonia",
      "https://tripaligner.com/countries/montenegro-3/destinations/dobrota-7120/places/restaurant-armonia-2308130"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Podgorica",
    "name": "Byblos",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Byblos Podgorica'da Kralja Nikole 36'da bir Lübnan restoranı (Tivat/Porto Montenegro'da da şubesi var); bulunan hiçbir kaynak helal demiyor, helal çıkan Byblos kayıtları Berlin, Paris, Los Angeles gibi başka işletmelere ait. Restoranın kendi sitesine (byblos.me) bakılamadı, çünkü ikinci arama bütçe dolduğu için yapılam",
    "sources": [
      "https://www.myguidemontenegro.com/restaurants/byblos",
      "https://www.planplus.rs/crna-gora/restoran-byblos/91635"
    ]
  },
  {
    "countryCode": "ME",
    "city": "Ulcinj",
    "name": "Restaurant Lovac",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Lonely Planet'te Velika Plaža/Ada Bojana bölümünde 'Lovac' adlı balık, biftek ve pizza/makarna sunan bir restoran var; helal ifadesi hiçbir kaynakta yok. Aramada geçen tek helal ibaresi Seafront Apartments adlı farklı bir tesise ait.",
    "sources": [
      "https://www.lonelyplanet.com/pois/1611582",
      "https://app.wanderlog.com/place/details/2727235"
    ]
  },
  {
    "countryCode": "MT",
    "city": "Gozo",
    "name": "Al Qantara Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Üç sorguda (visitgozo.com alan adı filtresi dahil) 'Al Qantara' adlı bir restoran Victoria/Gozo'da bulunamadı; Gozo ve Victoria restoran listelerinde de geçmiyor. Girdideki 'Visit Gozo' kaynağında kayıt çıkmadı, helal tedarik beyanı da hiçbir yerde yok.",
    "sources": [
      "https://visitgozo.com/tag/gozo-food/",
      "https://www.wanderlust.co.uk/content/where-to-eat-best-restaurants-gozo/"
    ]
  },
  {
    "countryCode": "MT",
    "city": "Valletta",
    "name": "Ali Baba Restaurant",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Ali Baba, Gżira'da (9 Ponsonby Street) Lübnan restoranı olarak gerçekten var (MaltaToday, Lonely Planet); helal iddiası yalnız Zabihah (sahipleri Müslüman, topluluk onaylı) ve Halal Gems dizinlerinde, resmî sertifika kaydı yok; visitmalta.com aramasında kayıt çıkmadı. Zabihah şarap listesi olduğunu da yazıyor (alkol te",
    "sources": [
      "https://www.zabihah.com/biz/Gzira/Ali-Baba/NeJhmU3fuQ",
      "https://halalgems.com/?p=6050",
      "https://www.maltatoday.com.mt/gourmet/restaurants/23936/ali-baba-lebanese-heaven-on-a-plate-20130114",
      "https://www-lonelyplanet-com-6c06.imagizer.com/malta/sliema-around/restaurants/ali-baba/a/poi-eat/1598937/1340962"
    ]
  },
  {
    "countryCode": "MX",
    "city": "Chiapas",
    "name": "Al Sultán",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "San Cristóbal de las Casas'ta 'Al Sultán' adıyla bir restoran bulunamadı; çıkan Al Sultan kayıtları ABD'de (Zabihah, Maryland ve Garden City). 'Restaurante El Sultán' adlı helal kebap/mansaf iddialı bir Wanderlog/Mapstr kaydı çıktı ama şehri doğrulanamadı, eşleştirilemedi.",
    "sources": [
      "https://wanderlog.com/place/details/4097048/restaurante-el-sultán",
      "https://mapstr.com/place/URFPTdNIJag"
    ]
  },
  {
    "countryCode": "MX",
    "city": "Mérida",
    "name": "Pita Mediterranean Cuisine",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Mérida'da Santa Lucía/merkezde 'Pita Mediterráneo' adlı Akdeniz mutfağı (humus, falafel, somonlu pita, vegan seçenekler) bulundu (pos.do, Midcity Beat); ad birebir aynı olmadığı için eşleşme büyük olasılıkla doğru ama kesin değil. Hiçbir kaynak helal demiyor; Zabihah'taki Pita Mediterranean kayıtları ABD şubeleri.",
    "sources": [
      "https://pos.do/pt/merida/restaurant/pita-mediterraneo",
      "https://midcitybeat.com/?p=108902"
    ]
  },
  {
    "countryCode": "MX",
    "city": "Oaxaca",
    "name": "Mini Taj",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "pos.do'da Oaxaca merkezinde Santos Degollado 512'de vegan seçenekli bir Hint restoranı olarak 'MiniTaj' listeli; helal et ya da helal beyanı hiçbir kaynakta yok. Çıkan helal Taj kayıtları başka şehirlerdeki işletmeler.",
    "sources": [
      "https://pos.do/pt/oaxaca/restaurant/minitaj"
    ]
  },
  {
    "countryCode": "MX",
    "city": "San Miguel de Allende",
    "name": "Turk Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Aramada San Miguel de Allende'de 'TURK Mediterranean Street Food' adlı, falafel ağırlıklı, vejetaryen/vegan dostu bir mekan çıktı (Wanderlog); hiçbir kaynak helal olduğunu söylemiyor. Helal sonuçları (Zabihah) başka şehirlerdeki işletmelere ait.",
    "sources": [
      "https://wanderlog.com/place/details/1296690/turk-mediterranean-street-food"
    ]
  },
  {
    "countryCode": "MX",
    "city": "Tulum",
    "name": "Laylo Tulum",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Laylo Tulum, HappyCow ve Spinach.guide'da vegan/bitki bazlı bir mekan olarak listeleniyor; helal iddiası ya da sertifikası yok. Ad benzerliği nedeniyle çıkan Layla Tulum ayrı bir butik otel/restoran ve onda da helal bilgisi yok.",
    "sources": [
      "https://happycow.net/reviews/laylo-tulum-163694?page=2",
      "https://spinach.guide/venues/laylo-219050/"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Delft",
    "name": "Hanno Groots Café",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Delft'te Doelenplein 7'de tapas ve dünya mutfağı sunan bir grand café (HappyCow, Wanderlog, Liza). Helal olduğunu söyleyen hiçbir kaynak yok; bar etiketi ve içecek yorumları alkol servisine işaret ediyor.",
    "sources": [
      "https://www.happycow.net/reviews/hanno-groots-cafe-delft-213943",
      "https://www.liza.nl/en/86817361/hanno-groots-cafe",
      "https://wanderlog.com/place/details/2242351/hanno-groots-café"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Eindhoven",
    "name": "Antep Sofrası",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek sorguda Eindhoven'da Antep Sofrası bulunamadı; bu adla Amsterdam (Borneostraat, geçici kapalı), Aachen ve Vénissieux kayıtları çıktı. thisiseindhoven.com'un helal yemek sayfası sonuçlarda geldi ama içeriğini okuyamadım (WebFetch yok) ve ikinci sorgu yapılamadı; yeniden kontrol önerilir.",
    "sources": [
      "https://foodle.pro/restaurants/amsterdam/antep-sofrasi-restaurant",
      "https://www.thisiseindhoven.com/en/see-and-do/food-and-drinks/halal-food-in-eindhoven"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Giethoorn",
    "name": "Grand Café Fanfare",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Giethoorn merkezinde, 1958 yapımı Fanfare filminin mekânı olan, Hollanda mutfağı ve yerel bira sunan bir grand café (Dagjeweg, Hopsa). Helal olduğuna dair hiçbir kaynak yok; alkol servisi var.",
    "sources": [
      "https://www.dagjeweg.nl/tip/9946/Grandcaf%C3%A9-Fanfare-Giethoorn",
      "https://hopsa.io/en/attractions/netherlands,food-drink,grand-cafe-fanfare-aa58550349"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Haarlem",
    "name": "Bosphorus Haarlem",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek sorguda Haarlem'de 'Bosphorus Haarlem' adlı bir restoran bulunamadı (Bosphorus adlı kayıtlar Toronto, Guangzhou, Cary gibi başka şehirlerde). Zabihah'ta Haarlem'de helal listelenen farklı işletmeler var (Moda, Mahzen) ama bunlar girdideki kayıt değil; ikinci sorgu yapılamadı.",
    "sources": [
      "https://app.zabihah.com/restaurants/cb9ec7be-7767-11ef-95ae-6045bdeb9f57/moda-haarlem-noord-holland",
      "https://app.zabihah.com/restaurants/cb1c6987-7767-11ef-95ae-6045bdeb9f57/mahzen-haarlem-noord-holland"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Keukenhof ve Lisse",
    "name": "Restaurant Den Ouden Heere",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Lisse'de Heereweg 207a'da kokteyl, bira ve şarap sunan, Fransız mutfaklı bir lounge ve restoran (booked.ai, Wanderlog, Trip.com). Helal olduğuna dair hiçbir kaynak yok; alkol servisi belirgin.",
    "sources": [
      "https://www.booked.ai/restaurants/restaurant-den-ouden-heere",
      "https://app.wanderlog.com/place/details/1158285",
      "https://au.trip.com/travel-guide/foods/Lisse-1891-restaurant/Restaurant%20Den%20Ouden%20Heere-19573250"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Lahey",
    "name": "Saray",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek sorguda Den Haag'da 'Saray' adlı bir Türk restoranı bulunamadı; helal listelenen Saray'lar Cape Town, Oslo, Cardiff, Richmond Hill gibi başka şehirlerde. Den Haag'da Molenstraat'taki 'Istanbul' ayrı bir işletme; ikinci sorgu yapılamadı.",
    "sources": [
      "https://app.zabihah.com/restaurants/caa73871-7767-11ef-95ae-6045bdeb9f57/istanbul-den-haag-zuid-holland",
      "https://www.waterfront.co.za/food_and_drinks/saray-turkish-restaurant"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Leiden",
    "name": "Taratoer",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Leiden'de Van der Waalsstraat 3'te çoğunlukla vejetaryen Lübnan mutfağı sunan bir restoran olarak bulundu (Spinach, 5.0 puan, 103 yorum). Helal olduğunu ya da olmadığını söyleyen hiçbir kaynak yok; menü ağırlıklı vejetaryen olsa da helal güvencesi (alkol dahil) için kanıt görülmedi.",
    "sources": [
      "https://spinach.guide/venues/taratoer-234542/"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Maastricht",
    "name": "Levantini",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Maastricht'te Boschstraat 85'te Akdeniz tarzı vejetaryen restoran olarak bulundu (Leadstal, HappyCow). Helal iddiası taşıyan hiçbir kaynak yok; Zabihah sonuçlarında kaydı da görünmedi.",
    "sources": [
      "https://www.leadstal.com/sb/levantini",
      "https://happycow.net/reviews/levantini-maastricht-218506"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Texel",
    "name": "Bij Jef",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Den Hoorn'da Herenstraat 34'te Michelin rehberinde yer alan bölgesel ve modern mutfak restoranı (yerel kuzu, kabuklu deniz ürünleri; texel.net). Helal olduğuna dair hiçbir kaynak yok.",
    "sources": [
      "https://guide.michelin.com/en/noord-holland/den-hoorn/restaurant/bij-jef",
      "https://texel.net/en/company/restaurant-bij-jef"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Utrecht",
    "name": "Kasap Utrecht",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek sorguda Kanaalstraat'ta 'Kasap Utrecht' adlı bir restoran bulunamadı; sokakta Türk kasapları olduğu yazılıyor ama adı geçen bir işletme yok (Orkide, Kanaalstraat 66, Türk lokantası; helal durumu belirtilmiyor). Kasap ya da büfe olabilir, doğrulanamadı; ikinci sorgu yapılamadı.",
    "sources": [
      "https://www.inyourpocket.com/netherlands/utrecht/venues/orkide",
      "https://www.zabihah.com/halal-restaurants/utrecht-utrecht-nl"
    ]
  },
  {
    "countryCode": "NL",
    "city": "Zaanse Schans",
    "name": "De Hoop op d'Swarte Walvis",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Zaanse Schans'ta Kalverringdijk 15'te üç tarihi binada yer alan özel bir restoran olarak doğrulandı (zaanseschans.com). Helal olduğuna dair hiçbir kaynak yok.",
    "sources": [
      "https://www.zaanseschans.com/en/?p=8992"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Bergen",
    "name": "Pasha Restaurant",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Bergen'de 'Pasha Restaurant' kaydı çıkmadı; çıkan Pasha kayıtları başka şehirlerde (Karlstad/İsveç, Houston, Londra vb.). Bergen'deki bir işletmeyi doğrulayamadım; var olup indekslenmemiş olması mümkün ama kanıt yok.",
    "sources": [
      "https://wanderlog.com/place/details/2720931/pasha-restaurant",
      "https://www.zabihah.com/restaurants/ca343ff3-7767-11ef-95ae-6045bdeb9f57/pasha-karlstad-vrmland-county"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Flåm",
    "name": "Ægir BrewPub",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "İşletme Flåm'da gerçekten var (Ægir Bryggeri brewpub/gastropub), ancak arama sonuçlarında helal et, helal sertifika ya da helal menü ifadesi yok. Menüde kendi biralarının marinasyon ve soslarda kullanıldığı, tam alkol servisi yapıldığı belirtiliyor; tek başına alkol SORUNLU sayılmadı ama helal güvencesi yok.",
    "sources": [
      "https://www.visitnorway.no/listings/aegir-gastropub/120869/"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Geirangerfjord",
    "name": "Westerås Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Westerås Gard Restaurant (Geiranger) mevcut, sezonluk (Mayıs-Eylül) çalışıyor. Halalbooking'deki Westerås Gard sayfasında helal-dostu verisi 'beklemede' olup bir hüküm vermiyor; MileHacker'daki 'Halal & Kosher' başlığı altında restoranın helal servis ettiğine dair bir ifade yok. Yorumlarda somon ve dana entrecote geçiy",
    "sources": [
      "https://halalbooking.com/en/wester%C3%A5s-gard/p/462869",
      "https://www.fjordnorway.com/en/food-and-drink/westeras-gard---restaurant-3g2wcmtpqqookw1ky6ktvw",
      "https://www.visitnorway.com/listings/westeras-gard-restaurant/280778/"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Lofoten",
    "name": "Restaurant Gammelbua",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Restoran Reine'de (Reineveien 165); geleneksel balık yemekleri (boknafesk, mølje, balina eti) sunuyor, vegan/vejetaryen seçenek var. Hiçbir kaynakta helal et ya da sertifika ifadesi yok. Sitedeki 'Henningsvær / Reine' semtinden yalnız Reine doğru, Henningsvær değil.",
    "sources": [
      "https://visitlofoten.com/en/food-and-drink/restaurant/restaurant-gammelbua/",
      "https://www.visitnorway.com/listings/gammelbua-restaurant/502011/",
      "https://nordnorge.com/en/aktivitet/gammelbua-in-reine-is-your-go-to-restaurant-for-traditional-local-dishes/"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Stavanger",
    "name": "Istanbul Pizza & Kebab",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Pedersgata'da Istanbul Kebab, Pizza og Grill (atly/findmeglutenfree: Pedersgata 20) ve FjordNorway rehberinde Istanbul Pizza og Kebab (Pedersgata 24 veya 8, kaynaklar çelişiyor) adıyla bir işletme var, muhtemelen aynısı. İki aramada da bu işletme için helal et ya da sertifika ifadesi çıkmadı; helal dizin girdileri yaln",
    "sources": [
      "https://www.atly.com/gluten-free/location/Istanbul-Kebab-Pizza-og-Grill",
      "https://www.fjordnorway.com/en/inspiration/the-best-places-for-lunch-in-pedersgata-in-stavanger"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Tromsø",
    "name": "Cous Restaurant",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Cous Restaurant AS Tromsø'de mevcut; menüde pizza, makarna, dana ve kuzu yemekleri ile Tunus kuskusu var. Hiçbir kaynakta helal iddiası yok; Zabihah'ın Tromsø girdileri arasında da yok.",
    "sources": [
      "https://tripaligner.com/countries/norway-32/destinations/tromso-69039/places/cous-restaurant-as-12869878"
    ]
  },
  {
    "countryCode": "NO",
    "city": "Trondheim",
    "name": "Istanbul Döner Chef",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Trip.com'a göre Olav Tryggvasons gate 5, Trondheim 7011'de küçük bir Türk lokantası; iki aramada helal et ya da sertifika ifadesi çıkmadı. Aynı caddedeki 1001 Natt (no. 23) için helal teyidi var ama o başka bir işletme.",
    "sources": [
      "https://uk.trip.com/restaurant/trondheim-1522-detail/istanbul-doner-chef-34925081.html",
      "https://wanderlog.com/place/details/1356669"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Gdańsk",
    "name": "Marmaris Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki aramada Gdańsk'ta Marmaris Kebab adlı bir işletme bulunamadı; Marmaris Kebab/Marmaris girdileri başka şehirlerde (Edinburgh, 's-Hertogenbosch, Brest). TableJourney'de Gdańsk için helal listelenenler Zahir Kebab (Targ Rybny 11) ve Czeburek and Kebab (Świętojańska 47/48), bunlar farklı işletmeler ve doğrulanmadı.",
    "sources": [
      "https://tablejourney.com/poland/gdansk/dietary/halal/",
      "https://tablejourney.com/poland/gdansk/cuisine/street-food/"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Kraków",
    "name": "Sami Am Am",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Airbnb yerel rehberindeki Sami Am Am girdisi (ul. Świętego Wawrzyńca 27, Kazimierz) 'kalıcı olarak kapalı' işaretli, yorumlar 2014-2016 tarihli. Kapanış tek bir toplayıcıya dayanıyor, tarihi belli değil, başka kaynakla teyit edilemedi; helal iddiası da hiçbir kaynakta yok.",
    "sources": [
      "https://www.airbnb.gy/things-to-do/places/363493"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Lublin",
    "name": "Habibi Kebab",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Lublin'de iki olası adres var: Nadbystrzycka 20 (kebap sıralaması, öğrenci kebapçısı) ve Habiby Kebab yazımıyla Doktora Witolda Chodźki 17 (intravel); aynı işletme olup olmadığı belirsiz. Hiçbir kaynakta Lublin şubesi için helal ifadesi yok; helal sertifikalı Habibi girdileri Varşova'ya ait.",
    "sources": [
      "https://rankingpro.pl/ranking-kebabow-lublin/",
      "https://intravel.net/lublin/restaurants-cafes/habiby-kebab"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Poznań",
    "name": "Sultan Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Poznań'da Sultan Kebab adıyla işletme bulunamadı (çıkanlar ABD, Kore, Belçika ve Fransa'daki Sultan Kebab'lar). Poznań'ın helal listelenen kebapçısı 'Turkish Kebab (Halal)' (Święty Marcin 45) farklı bir adla duruyor, aynı işletme olduğu doğrulanamadı. Bu kayıt için yalnız bir sorgu yapılabildi (arama bütçesi bitti).",
    "sources": [
      "https://visitpoznan.pl/en/turkish-kebab-halal-en"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Toruń",
    "name": "Royal India",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Toruń'da Royal India adlı Hint restoranı var (bir seyahat listesinde ul. Prosta 19, Stare Miasto olarak geçiyor; köri, biryani, tandoori). Helal et ya da sertifika ifadesi hiçbir kaynakta yok; Zabihah'taki Royal India girdileri başka şehirlere ait. Bu kayıt için yalnız bir sorgu yapılabildi.",
    "sources": [
      "https://www.wingontravel.com/discovery/restaurant-34949488"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Wrocław",
    "name": "Istanbul Kebab",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Wrocław Stare Miasto'da 'Istanbul Kebab' kaydı çıkmadı; sonuçlar Prag, Cape Town, Roma gibi başka şehirlerdeki aynı adlı işletmelere ait. Wrocław için helal veya varlık kanıtı yok.",
    "sources": [
      "https://www.zabihah.com/restaurants/ca1199a1-7767-11ef-95ae-6045bdeb9f57/istanbul-kebab-prague-hlavn-msto-praha",
      "https://halalbooking.com/en/puro-wroc%C5%82aw-stare-miasto/p/457862"
    ]
  },
  {
    "countryCode": "PL",
    "city": "Zakopane",
    "name": "Samanta Halal",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "'Samanta' Zakopane'de Krupówki'de bir pastane/kafe (Cukiernia Samanta) olarak geçiyor ve helal ifadesi yok. Ayrı bir işletme olan 'Zakopane Halal Restaurant' (Krupówki 50 B, TripAligner, yalnız yaz sezonu) çıktı; adı farklı ve Samanta ile bağı doğrulanmadı. 'Samanta Halal' adıyla bir restoran bulunamadı.",
    "sources": [
      "https://www.atly.com/gluten-free/location/Cukiernia-%22Samanta%22",
      "https://tripaligner.com/countries/poland-28/destinations/zakopane-4670/places/zakopane-halal-restaurant-14520818"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Algarve",
    "name": "Taco y Tequilla",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Faro'da Meksika mutfağı, margarita/tekila odaklı bir restoran olarak yorumlarda geçiyor (HappyCow yorumunda personelin tekila ikram ettiği anlatılıyor); helal et ya da sertifika bilgisi hiçbir kaynakta yok. Alkol-merkezli mekan, helal iddiası için uygun değil.",
    "sources": [
      "https://www.happycow.net/contact/abuse/review/82873",
      "https://halalspy.com/halal-food-guide/europe/faro/"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Azor Adaları",
    "name": "Indian Hut",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Ponta Delgada'da 'Indian Hut' kaydı çıkmadı; çıkan helal Indian Hut kayıtları ABD'de (Orlando, Bensalem). Ponta Delgada için varlık veya helal kanıtı yok.",
    "sources": [
      "https://www.zabihah.com/restaurants/cb56a7fd-7767-11ef-95ae-6045bdeb9f57/indian-hut-orlando-fl",
      "https://halalbooking.com/en/octant-ponta-delgada/p/113881"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Coimbra",
    "name": "Aqil Food",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada 'Aqil Food' Coimbra için hiçbir sonuç vermedi; ne işletme ne helal kaydı bulundu. Yalnız ibis Coimbra Centro otel sayfası 500 m çevrede helal gıda olduğunu söylüyor, işletme adı geçmiyor.",
    "sources": [
      "https://halalbooking.com/en/ibis-coimbra-centro/p/89165"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Lizbon",
    "name": "Zam Zam",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Lizbon/Mouraria'da 'Zam Zam' restoranı çıkmadı; Zam Zam kayıtları Berlin, Paris, Singapur vb. başka şehirlerde. Lizbon helal rehberi Mouraria için başka işletmeleri (ör. Taste of Pakistan) listeliyor, Zam Zam'ı değil.",
    "sources": [
      "https://www.eatingeurope.com/blog/halal-food-in-lisbon/",
      "https://www.zabihah.com/restaurants/ca805899-7767-11ef-95ae-6045bdeb9f57/zam-zam-paris-le-de-france"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Madeira",
    "name": "Indian Palace",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Funchal'da Estrada Monumental 197 adresinde Indian Palace adlı Hint restoranı gluten-free/vegan/genel dizinlerde listeli; hiçbir kaynak helal olduğunu söylemiyor. Zabihah'ın Funchal helal listesinde (Delhi Darbar, India Gate, Babilonia vb.) yer almıyor.",
    "sources": [
      "https://www.atly.com/gluten-free/location/IndianPalace",
      "https://spinach.guide/venues/indian-palace-40212/",
      "https://www.zabihah.com/halal-restaurants/funchal-madeira-pt"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Porto",
    "name": "Mendi",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Mendi, Porto'da Avenida da Boavista 1430 (Boavista semti, Baixa değil) adresinde 1997'den beri tandoori ağırlıklı Hint restoranı; TripAligner/HappyCow/TableJourney vejetaryen-vegan seçenek belirtiyor, helal iddiası veya sertifikası yok.",
    "sources": [
      "https://tablejourney.com/portugal/porto/casual-dining/mendi-indian-boavista/",
      "https://www.happycow.net/reviews/mendi-porto-88930",
      "https://tripaligner.com/countries/portugal-38/destinations/porto-9551/places/mendi-1027670"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Sintra",
    "name": "Taj Palace",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Sintra'da 'Taj Palace' kaydı çıkmadı; aynı ad Faro (HalalSpy) ve Portimão'da (Zabihah, kısmi helal) geçiyor, yani kayıt yanlış şehirle eşleşmiş olabilir. Sintra'da Zabihah'ta tam helal listelenen farklı bir işletme (Bengal Tandoori) çıktı; bu doğrulanmış bir öneri değil, yalnız ipucu.",
    "sources": [
      "https://halalspy.com/halal-food-guide/europe/faro/",
      "https://www.zabihah.com/restaurants/cbb9bdec-7767-11ef-95ae-6045bdeb9f57/bengal-tandoori-sintra-lisboa"
    ]
  },
  {
    "countryCode": "PT",
    "city": "Évora",
    "name": "Indian Palace Évora",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Évora'da bu adla bir restoran bulunamadı; sonuçlar yalnız ABD, Avusturya, Ermenistan, Danimarka gibi başka ülkelerdeki 'India Palace' kayıtlarıydı (çoğu Zabihah). Bu, kesin kapanış kanıtı değil, yalnız tek aramanın bulamadığı anlamına gelir; helal iddiasını destekleyen hiçbir kaynak yok.",
    "sources": []
  },
  {
    "countryCode": "RS",
    "city": "Demir Kapı",
    "name": "Čarobna Ribica",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki sorguda da Donji Milanovac'ta bu adla bir restoran çıkmadı; yalnız adı farklı Lepenska Ribica (Kapetana Miše 38) bulundu, aynı işletme olduğuna dair bir kanıt yok. Helal bilgisi de yok.",
    "sources": [
      "https://uk.trip.com/restaurant/country/donji-milanovac/detail/lepenska-ribica-46254387"
    ]
  },
  {
    "countryCode": "RS",
    "city": "Kopaonik",
    "name": "Bombay",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki sorguda da Kopaonik/Konaci'de Bombay adlı bir restoran çıkmadı; Kopaonik restoran dizininde de bu ad yok. Helal bilgisi de yok.",
    "sources": [
      "https://www.planplus.rs/kopaonik/restorani"
    ]
  },
  {
    "countryCode": "RS",
    "city": "Niş",
    "name": "Istanbul Doner",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki sorguda da Niş'te Istanbul Doner adlı bir işletme çıkmadı; çıkan Istanbul Doner kayıtları başka ülkelerdeki işletmeler. Niş için helal bilgisi de yok.",
    "sources": []
  },
  {
    "countryCode": "RS",
    "city": "Novi Sad",
    "name": "Taverna Sat",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kej žrtava racije 2'de pizzeria ve restoran olarak kayıtlı (Vojvodina turizm sayfası); helal kaydı veya beyanı hiçbir kaynakta yok.",
    "sources": [
      "https://vojvodina.travel/en/restaurant-taverna-sat-novi-sad"
    ]
  },
  {
    "countryCode": "RS",
    "city": "Subotica",
    "name": "Bates",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Vuka Karadžića 17'de Sırp-Macar mutfağı (ızgara et, balık, gulaş) servis eden restoran; hiçbir kaynakta helal geçmiyor.",
    "sources": [
      "https://vojvodinaonline.com/en/catering/restaurant-bates-subotica/",
      "https://uk.trip.com/restaurant/serbia/subotica/detail/bates-19840221"
    ]
  },
  {
    "countryCode": "RS",
    "city": "Tara Milli Parkı",
    "name": "Kafe Alija",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Bajina Bašta'da 'Kafe Alija' adıyla hiçbir kayıt bulamadım. Yalnız tek sorgu yapılabildi: ikinci sorgu, oturumun WebSearch bütçesi dolduğu için çalışmadı; bu yüzden 'kesin yok' değil, 'bulunamadı'.",
    "sources": []
  },
  {
    "countryCode": "RS",
    "city": "Zlatibor",
    "name": "Kafana Ljubiš",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Zlatibor (Čajetina) bölgesinde Zelenkada 5 adresli geleneksel kafana; dana eti, alabalık ve ev yapımı rakıyla anılıyor. Zabihah ve Halalbooking'de kayıtlı değil, hiçbir kaynakta helal geçmiyor.",
    "sources": [
      "https://www.planplus.rs/kafana-ljubis/147272",
      "https://rs.gaultmillau.com/en/restaurants/kafana-ljubis"
    ]
  },
  {
    "countryCode": "RU",
    "city": "Baykal Gölü",
    "name": "Khinkalnaya",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Irkutsk'ta 'Хинкальная' adlı belirli bir mekân ya da helal olduğuna dair kayıt çıkmadı (sonuçlar alakasız: köy maddeleri, bir üretici kartı). Ad genel bir sözcük (hinkali evi) olduğu için tek işletmeye bağlanamadı; helal kanıtı yok.",
    "sources": []
  },
  {
    "countryCode": "RU",
    "city": "Kaliningrad",
    "name": "Shafran",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada (Шафран Калининград) ne bu adlı restoran ne de şehirde bir helal mekân anıldı; Kaliningrad restoran dizinlerinde (restoclub, komandirovka, sputnik8) 'Шафран' görünmedi. Kesin kapanış kanıtı değil, yalnız bulunamadı.",
    "sources": []
  },
  {
    "countryCode": "RU",
    "city": "Kazan",
    "name": "Halal Cafe",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Ad genel bir sözcük ('halal kafe'); tek aramada 'Halal Cafe' adlı belirli bir işletme doğrulanamadı. Vakhitovsky'de 2GIS'te Suyumbike civarında 'halyal kafe-stolovaya' ve başka halal kafeler (Azu, Medina Food) anılıyor ama hiçbiri site kaydındaki adla eşleştirilemedi. Business Gazeta, tabelada 'halal' yazmasının sertif",
    "sources": [
      "https://2gis.ru/firm/2956015536649042"
    ]
  },
  {
    "countryCode": "RU",
    "city": "Murmansk",
    "name": "Halal House",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Murmansk'ta 'Halal House' adlı bir mekân bulunamadı; bu adla yalnız Soçi'de (Culture Trip listesi) ve ABD'de (Zabihah) kayıt çıktı. Bir Murmansk kafesi yorumcusu şehirde helal yemek eksikliğinden şikayet ediyor. Kesin kapanış kanıtı değil.",
    "sources": [
      "https://theculturetrip.com/europe/russia/articles/the-best-halal-restaurants-in-sochi"
    ]
  },
  {
    "countryCode": "RU",
    "city": "Soçi",
    "name": "Kavkaz Halal",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Soçi'de 'Kavkaz Halal' adıyla bir mekân çıkmadı. En yakın sonuç, restoclub'ta Soçi'de iki şubesi olan 'Zam-zam' (doğu/helal mutfaklı ucuz kafe) ama bu site kaydındaki işletme değil; Kafkas mutfağı sonuçlarının çoğunda helal belirtilmemiş.",
    "sources": [
      "https://www.restoclub.ru/ekb/chain/zam-zam"
    ]
  },
  {
    "countryCode": "RU",
    "city": "St. Petersburg",
    "name": "Beirut",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Peterburg2.ru dizininde 'Kafe Beyrut' (ul. Stremyannaya 11, Merkez ilçe; Doğu/Lübnan/Türk ve İsrail mutfağı) bulundu, ancak hiçbir kaynakta helal beyanı ya da sertifika yok; dizin güncel olmayabilir ve bu kaydın site kaydıyla aynı işletme olduğu kesin değil. Semt (Tsentralny) uyumlu.",
    "sources": [
      "https://peterburg2.ru/restplaces/kafe-beyrut-13201.html"
    ]
  },
  {
    "countryCode": "RU",
    "city": "Vladivostok",
    "name": "Kebab House",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Tek aramada Vladivostok'ta Svetlanskaya'da 'Kebab House' bulunamadı; sonuçlar başka şehir/ülkelerdeki aynı adlı yerlerdi (Habarovsk'taki Kebab House kapalı olarak işaretli, Moskova, Tiflis, Lizbon vb.). Genel bir ad olduğu için tek işletmeye bağlanamadı; helal kanıtı yok.",
    "sources": []
  },
  {
    "countryCode": "SE",
    "city": "Abisko",
    "name": "Brasserie Fjällköket",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Brasserie Fjällköket, Abisko Mountain Lodge'daki restoran olarak bulundu (av eti ve balık ağırlıklı, vegan dostu); hiçbir kaynak helal demiyor. Halalbooking'in Abisko Turiststation sayfası 'mülkte ve yakında helal yemek yok' diyor, Hotell Fjället (Björkliden) sayfasındaki helal bilgisi ise bu restorana ait değil ve 've",
    "sources": [
      "https://www.falstaff.com/en/restaurants/brasserie-fjaellkoeket",
      "https://www.enprimeurclub.com/restaurants/brasserie-fj-llk-ket-p-abisko-mountain-lodge-abisko",
      "https://www.plantspack.com/place/brasserie-fjallkoket",
      "https://halalbooking.com/en-us/abisko-turiststation-stf/p/482228"
    ]
  },
  {
    "countryCode": "SE",
    "city": "Dalarna",
    "name": "Dala Wärdshus",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Dala Wärdshus, Falun'da değil Rättvik'te (Hantverksbyn, Siljan Gölü kıyısı, Rättvik merkezine yaklaşık 3,2 km) bir han/otel olarak çıkıyor; Booking vejetaryen, vegan, glütensiz ve sütsüz seçenekleri listeliyor ama helal yok, barı var. Helal olduğunu söyleyen hiçbir kaynak bulunamadı.",
    "sources": [
      "https://sp.booking.com/hotel/se/dalawardshus-hantverksbyn.en-gb.html",
      "https://www.frommers.com/destinations/rattvik/hotels/dala-wrdshus"
    ]
  },
  {
    "countryCode": "SE",
    "city": "Gotland",
    "name": "Ali's Kök",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Visby'de Ali's Kök adlı bir restoran hiçbir sonuçta çıkmadı (Halalbooking Visby otel sayfaları ve Time Out Visby listesi dahil); 'Kök' adıyla çıkan helal kayıt Göteborg'daki Saray Grill & Kök (farklı işletme). Yalnız 1 sorgu yapılabildi (ortak arama bütçesi doldu), yeniden kontrol önerilir.",
    "sources": [
      "https://halalbooking.com/en-us/kalk-hotel/p/48002",
      "https://www.timeout.com/sweden/restaurants/the-best-restaurants-in-visby-2026",
      "https://www.zabihah.com/restaurants/cae71bd3-7767-11ef-95ae-6045bdeb9f57/saray-kk-gothenburg-vstra-gtalands-ln"
    ]
  },
  {
    "countryCode": "SE",
    "city": "Kiruna",
    "name": "Annis Grill",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kiruna'da 'Annis' adlı restoran (ren geyiği, geyik ve yaban öküzü souvas menüsü) bulundu; Wanderlog ve Trip.com sayfaları helal demiyor, bir yorumcu 'pulled pork bao' siparişini anıyor, yani domuz servis ediyor olabilir (tek yorum, menü görülmedi). Halalbooking'in Scandic Kiruna sayfası yalnızca çevrede helal yemek old",
    "sources": [
      "https://wanderlog.com/place/details/2707982",
      "https://tw.trip.com/travel-guide/foods/Kiruna-49702-restaurant/Annis-35008705",
      "https://halalbooking.com/en-us/scandic-kiruna/p/482634"
    ]
  },
  {
    "countryCode": "SE",
    "city": "Malmö",
    "name": "Laziza",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Laziza, Malmö'de Baltzarsgatan (merkez) ve Dockan'da şubeleri olan bir Lübnan restoran grubu (Hyllie ve Lund'da da şube haberi var); Möllevången'de şubesi çıkmadı. Hiçbir kaynak helal demiyor, çıkan tek Möllevångstorget helal kaydı farklı bir işletmeye (Indian Express 2) ait.",
    "sources": [
      "https://www.verdictfoodservice.com/news/laziza-third-restaurant-hyllie-sweden/",
      "https://thatsup.co.uk/malmo/restaurant/laziza-dockan/",
      "https://www.dagensps.se/weekend/restaurang/topplistan-malmos-basta-falafel/",
      "https://www.zabihah.com/restaurants/7133b3ab-44b3-4563-8777-53bc836152a2/indian-express-2-malm-sweden"
    ]
  },
  {
    "countryCode": "SE",
    "city": "Uppsala",
    "name": "Jalla",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Jalla, Uppsala'da Stora Torget'te kebap, shawarma ve pizza servis eden bir yer olarak bulundu; hiçbir kaynak helal olduğunu söylemiyor, Zabihah'ın Uppsala listesinde de yok (orada helal diye geçenler başka restoranlar).",
    "sources": [
      "https://thatsup.co.uk/uppsala/restaurant/jalla/",
      "https://wanderlog.com/place/details/3509545/restaurang-jalla",
      "https://www.zabihah.com/subregion/504b0981-9f3a-11ef-956c-6045bdeb9f57/uppsala"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Bled Gölü",
    "name": "Maharaja",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İki sorguda da Bled'de Maharaja adlı bir işletme çıkmadı; Slovenya'da çıkan Maharaja Ljubljana'da (Vodnikova cesta 35 civarı, Wolt listesi). HalalTrip'in kendi Bled rehberi de Bled'de özel helal restoran olmadığını söylüyor.",
    "sources": [
      "https://www.halaltrip.com/city-guide-details/892/bled/",
      "https://wolt.com/en/svn/ljubljana/restaurant/maharaja-indijska-restavracija/items/lamb-dishes-14"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Bohinj",
    "name": "Restaurant Triglav",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "HappyCow'a göre Stara Fužina 23'te (Apartmaji Triglav içinde) et servis eden bir restoran olarak kayıtlı; hiçbir kaynak helal olduğunu söylemiyor. Halalbooking'deki aynı adresli Aparthotel Triglav sayfasında helal verisi 'beklemede' görünüyor. HalalTrip aramasında Bohinj hiç çıkmadı.",
    "sources": [
      "https://happycow.net/reviews/restaurant-triglav-bohinj-bohinjsko-jezero-351456",
      "https://halalbooking.com/en/aparthotel-triglav/p/93431",
      "https://www.halaltrip.com/city-guide-details/892/bled/"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Kranjska Gora",
    "name": "Lačni Kekec",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Bölgenin turizm sayfası kranjska-gora.si onu kömür ızgaralı bir dağ snack bar olarak tanıtıyor; hiçbir sonuç helal demiyor. HalalTrip aramasında Kranjska Gora çıkmadı.",
    "sources": [
      "https://kranjska-gora.si/en/cuisine/mountain-snack-bar-lacni-kekec-hungry-kekec",
      "https://www.24ur.com/novice/slovenija/lacni-kekec-v-kranjski-gori-se-predstavlja-z-osvezeno-ponudbo.html"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Ljubljana",
    "name": "Abi Falafel",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Visit Ljubljana'ya göre Trubarjeva cesta 40'ta falafel, şiş kebap, humus servis eden bir Orta Doğu takeaway'i; hiçbir listede helal ibaresi yok, et kaynağı belirtilmemiş. Aynı sokakta Šeherezada (Trubarjeva 31) bir listede tamamen helal et diye geçiyor, istenirse alternatif olarak ayrıca incelenebilir.",
    "sources": [
      "https://www.visitljubljana.com/en/poi/abi-falafel",
      "https://www.halaltrip.com/city-guide-details/891/ljubljana/",
      "https://www.visitljubljana.com/it/poi/seherezada"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Maribor",
    "name": "Baščaršija",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Poštna ulica 8'de Boşnak bir çiftin işlettiği Etno Hiša Baščaršija olarak kayıtlı (Boşnak mutfağı); helal dediği hiçbir kaynak bulamadım. HalalTrip'in kendi Maribor rehberi şehirde onaylı helal restoran bulunmadığını yazıyor, yani sitedeki kaynak da bu kaydı desteklemiyor.",
    "sources": [
      "https://www.visitmaribor.si/en/what-to-do/wine-and-culinary/providers/5613-bascarsija",
      "https://inyourpocket.com/slovenia/maribor/venues/etno-hisa-bascarsija",
      "https://www.halaltrip.com/city-guide-details/894/maribor/"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Piran",
    "name": "Sarajevo '84",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Portorož turizm sayfasına göre Tomšičeva ulica 43, Piran'da Boşnak ćevapi/ızgara restoranı; menüde bira, şarap ve sert içki var, helal beyanı hiçbir kaynakta yok.",
    "sources": [
      "https://www.portoroz.si/en/gastronomy/restaurants-and-taverns/obj/15101-sarajevo-84/",
      "https://www.portoroz.si/en/objects/sarajevo-84"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Postojna ve Predjama",
    "name": "Restaurant Erasmus",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kazarje 10, Postojna'da Epicenter otel içinde; Dalmaçya, Macar, Sloven, İtalyan ve Çin karışık menü, alkol servisi var. Helal ibaresi hiçbir kaynakta yok.",
    "sources": [
      "https://wanderlog.com/place/details/7754691/restavracija-erasmus",
      "https://travelpal.ai/destinations/europe/slovenia/postojna/restavracija-erasmus-kazarje-10"
    ]
  },
  {
    "countryCode": "SI",
    "city": "Soča Vadisi",
    "name": "Topli Val",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kobarid'de Trg svobode 1'de (Hotel Hvala) deniz ürünü ve et servis eden bir restoran olarak kayıtlı; hiçbir kaynakta helal geçmiyor.",
    "sources": [
      "https://www.theworlds50best.com/discovery/Establishments/Slovenia/Kobarid/Topli-Val.html",
      "https://si.gaultmillau.com/en/restaurants/restavracija-topli-val"
    ]
  },
  {
    "countryCode": "SJ",
    "city": "Longyearbyen",
    "name": "Restaurant Polfareren",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Svalbard Hotell içinde, ren geyiği ve balina gibi av/deniz etlerine dayalı à la carte Nordik restoran; resmî Visit Svalbard/VisitNorway sayfalarında helal geçmiyor, bir otel listesinde sayılan diyet seçenekleri arasında da helal yok. Alkol notu girdideki kayıttan geliyor, aramada ayrıca teyit etmedim.",
    "sources": [
      "https://en.visitsvalbard.com/food-and-drink/restaurants/polfareren",
      "https://www.visitnorway.com/listings/polfareren-restaurant-svalbard-hotell/189638"
    ]
  },
  {
    "countryCode": "SJ",
    "city": "Ny-Ålesund",
    "name": "Kongsfjordbutikken",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Kings Bay'in işlettiği, haftada iki gün kısa saatlerle açık küçük bir mağaza (hijyen ürünü, hediyelik, atıştırmalık, alkol); gıda yelpazesi tarif edilmiyor ve helal ürün ya da sertifika bilgisi hiçbir kaynakta yok. Restoran değil, mağaza.",
    "sources": [
      "https://kingsbay.no/kongsfjordbutikken/",
      "https://nyalesundresearch.no/daily-life-in-ny-alesund/"
    ]
  },
  {
    "countryCode": "TH",
    "city": "Ayutthaya",
    "name": "Usman Steak Halal",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "İngilizce ve Tayca iki sorguda Ayutthaya'da 'Usman Steak Halal' adlı işletme bulunamadı; 'Usman' sonuçları Bangkok Sukhumvit 22'deki Usman Thai Food'a (helal Tay mutfağı, steak değil) ait. Ayutthaya'nın turizm sitesi helal olarak Wanida Halal Food'u, rehberler Kruta Steak'i listeliyor. Girdideki kaynak (chula.ac.th) do",
    "sources": [
      "https://www.zabihah.com/biz/Watthana/Usman-Thai-Food/VI3NU02lie",
      "https://go.ayutthaya.go.th/restaurants/wanida-halal-food/",
      "https://wanderlog.com/place/details/4716878/kruta-steak",
      "https://www.chula.ac.th/en/highlight/185916/"
    ]
  },
  {
    "countryCode": "TH",
    "city": "Bangkok",
    "name": "Al-Rahaman",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Al-Rahaman, Bang Rak'ta (Si Phraya / Soi Charoen Krung 43) Hint-Bangladeş tarzı Müslüman restoranı olarak Time Out, Intravel ve Wongnai'de var; Wongnai helal restoran diyor, bir rehber katı alkolsüz politika yazıyor, ama CICOT/Halal Route kaydı ya da restoranın kendi beyanı bulunamadı. Adres kaynaklar arasında farklı (",
    "sources": [
      "https://www.timeout.com/bangkok/restaurants/al-rahaman",
      "https://intravel.net/bangkok/restaurants-cafes/al-rahaman",
      "https://www.wongnai.com/listings/halal-restaurants-bangkok",
      "https://asiakingtravel.com/blog/halal-thai-food-bangkok.html"
    ]
  },
  {
    "countryCode": "TH",
    "city": "Chiang Mai",
    "name": "Khao Soi Islam",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Khao Soi Islam, Chang Khlan'da (Charoen Prathet Soi 1, Ban Haw Müslüman mahallesi) mevcut; Zabihah ve Visit Thailand Today helal restoran olarak listeliyor, fakat kendi sitesi/sosyal hesabı ya da CICOT kaydı bulunamadı. Saatler kaynaklarda çelişiyor.",
    "sources": [
      "https://www.zabihah.com/restaurants/ca058826-7767-11ef-95ae-6045bdeb9f57/khao-soi-islam-chang-khlan-chiang-mai",
      "https://www.zabihah.com/biz/onYKHxg7UJ",
      "https://www.visitthailandtoday.com/top-lists/best-khao-soi-chiang-mai",
      "https://holidify.com/pages/halal-food-in-chiang-mai-1856.html"
    ]
  },
  {
    "countryCode": "TH",
    "city": "Koh Samui",
    "name": "Roti Otin",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Roti Otin yalnız Atly'de 'Baan Poon Garden & Roti Otin' adıyla roti menülü bir mekân olarak çıkıyor; helal ya da Müslüman işletmesi beyanı yok, adres 'Ko Samui District' olarak veriliyor (Bo Phut doğrulanamadı) ve Bo Phut helal rehberinde (Samui Villa) geçmiyor. Girdideki Chula kaynağı bu restoranı doğrulamıyor.",
    "sources": [
      "https://www.atly.com/location/Baan-Poon-Garden-Roti-Otin",
      "https://www.samui-villa.com/guide/?p=3403",
      "https://halalspy.com/halal-food-guide/asia/koh-samui/"
    ]
  },
  {
    "countryCode": "TH",
    "city": "Krabi",
    "name": "Asama Halal Thai Food",
    "action": "remove",
    "result": "KANIT_YOK",
    "reason": "Asama Halal Thai Food yalnız Wanderlog'da (Krabi) yorum sayfası olarak çıkıyor; adında 'Halal' geçse de hiçbir kaynak metninde helal beyanı, CICOT belgesi ya da mutfak ayrımı yok, Ao Nang adresi ve açılış saati doğrulanamadı. Tayca sorguda da başka kaynak çıkmadı.",
    "sources": [
      "https://wanderlog.com/place/details/2842694/asama-halal-thai-food",
      "https://www.travelfish.org/eatandmeet/thailand/southern_thailand/krabi/ao_nang/eat"
    ]
  },
  {
    "countryCode": "TH",
    "city": "Phuket",
    "name": "Kusuma Seafood",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Kusuma Seafood, Phuket helal rehberlerinde (Wanderlog, Hotels.com, Halalspy) helal Tay/Malay deniz ürünleri restoranı olarak geçiyor; bir rehber menüyü 'sahip beyanlı' (üçüncü taraf sertifikası değil) diye niteliyor, CICOT belgesi görülmedi. Adres kaynaklarda çelişiyor (Patong ve Kamala), bir rehberde şarap listesi ola",
    "sources": [
      "https://wanderlog.com/place/details/59384/kusuma-seafood-restaurant",
      "https://www.hoteles.com/go/thailand/best-phuket-halal-restaurants",
      "https://halalspy.com/halal-food-guide/asia/patong/"
    ]
  },
  {
    "countryCode": "TR",
    "city": "Muğla",
    "name": "Sultan Sofrası",
    "action": "remove",
    "result": "BULUNAMADI",
    "reason": "Muğla/Menteşe'de bu adla bir restoran arama sonuçlarında çıkmadı; yalnız Almanya'daki (Erlenbach am Main) bir Sultan Sofrası çıktı. Tek sorguyla bulunamadı (kapandığı kanıtlanmış değil), helal kanıtı da yok.",
    "sources": [
      "https://halalbooking.com/en/halal-resorts-mugla/l/83",
      "https://www.zabihah.com/restaurants/ca52a406-7767-11ef-95ae-6045bdeb9f57/sultan-sofrasi-erlenbach-am-main-bayern"
    ]
  },
  {
    "countryCode": "TR",
    "city": "İstanbul",
    "name": "Buhara Kebab House",
    "action": "downgrade",
    "result": "KANIT_YOK",
    "reason": "'Sultanahmet Buhara Kebab House' Nuruosmaniye Cd. No:7'de (Alemdar, Fatih) kebap/İskender restoranı olarak mevcut (Trip.com, Wanderlog, Time Out); hiçbir kaynakta helal sertifikası ya da helal beyanı yok, gimdes.com aramasında kayıt çıkmadı. Bulunan helal beyanı farklı bir işletmeye (Buhara Hotel) ait; alkol politikası",
    "sources": [
      "https://nz.trip.com/restaurant/t%C3%BCrkiye/istanbul/detail/Sultanahmet%20Buhara%20Kebab%20House%20Restaurant-17094315",
      "https://wanderlog.com/place/details/732866",
      "https://halalbooking.com/en/buhara-hotel/p/64612",
      "https://gimdes.com/"
    ]
  },
  {
    "countryCode": "US",
    "city": "Chicago",
    "name": "Hummus Grill",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Yalnızca Atly adlı toplayıcı, Chicago şubesini 'Zabiha Halal' olarak listeliyor; restoranın kendi sitesi ya da sertifika kaydı bulunamadı. Aynı adreste Zabihah'ta eski kiracı 'Ameer Kabob' adıyla bir helal kaydı var (2016 tarihli yorumlar), yani o kayıt bu işletmeye ait olmayabilir. Adres 744 N Damen Ave (Wicker Park/B",
    "sources": [
      "https://www.atly.com/location/HummusGrillChicago",
      "https://www.toasttab.com/local/order/hummus-grill-744-north-damen",
      "https://www.zabihah.com/restaurants/cb2670bc-7767-11ef-95ae-6045bdeb9f57/ameer-kabob-chicago-il",
      "https://mapthemeal.com/chicago/wicker-park-bucktown/hummus-grill/"
    ]
  },
  {
    "countryCode": "US",
    "city": "Los Angeles",
    "name": "Urban Skillet",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah (sahipler helal olduğunu teyit etmiş, et el kesimi ve tedarikçi onaylı), MapQuest ('100% Zabiha halal') ve Culture Trip '%100 helal' diyor; restoranın kendi sitesi ya da sertifikalandırıcı kaydı doğrulanamadı. Bir Zabihah yorumcusu sahiplik ve menünün yakın zamanda değiştiğini belirtiyor. Adres North Hollywood ",
    "sources": [
      "https://www.zabihah.com/restaurants/cb3e0fbc-7767-11ef-95ae-6045bdeb9f57/urban-skillet-los-angeles-ca",
      "https://startpage.mapquest.com/us/california/urban-skillet-367170535",
      "https://theculturetrip.com/north-america/usa/california/articles/the-best-halal-restaurants-in-los-angeles"
    ]
  },
  {
    "countryCode": "US",
    "city": "Miami",
    "name": "Shah's of Kabob",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Zabihah Sunset Drive şubesi için sahiplerin Müslüman olduğunu, helal durumu teyit ettiklerini ve alkol servis edilmediğini yazıyor; Uber Eats helal kategorisinde listeliyor. Restoranın kendi sitesi ya da sertifika kaydı bulunamadı. Zabihah'ta ayrıca 6669 SW 59th Pl adresli ikinci, çelişkili bir kayıt var.",
    "sources": [
      "https://www.zabihah.com/restaurants/cbd9554b-7767-11ef-95ae-6045bdeb9f57/shahs-of-kabob-south-miami-fl",
      "https://zabihah.com/restaurants/cb7c3f32-7767-11ef-95ae-6045bdeb9f57/shahs-of-kabob-south-miami-fl",
      "https://ubereats.com/store/shahs-of-kabob-south-miami/R4-1Pbt2ReCTGbnnNK8fDA"
    ]
  },
  {
    "countryCode": "VN",
    "city": "Da Nang",
    "name": "Lazeez Indian Restaurant",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Lazeez Indian Halal Restaurant, Phạm Văn Đồng (An Hải, Sơn Trà) üzerinde gerçekten var; Da Nang Visitor Center, Wanderlog ('Lazeez Indian Restaurant Halal 100') ve HalalSpy ('yüzde 100 helal sertifikalı') listeliyor, ancak bunlar dizin/toplayıcı; belge ya da belgelendirici kurum adı görülmedi ve restoranın kendi sitesi",
    "sources": [
      "https://danangvisitorcenter.com/nha-hang/nazare-indian-beach-restaurant-bar",
      "https://wanderlog.com/place/details/9134016/lazeez-indian-restaurant-halal-100",
      "https://halalspy.com/halal-food-guide/asia/danang/"
    ]
  },
  {
    "countryCode": "VN",
    "city": "Hoi An",
    "name": "Baba’s Kitchen",
    "action": "downgrade",
    "result": "ZAYIF",
    "reason": "Pickyourtrail'in Hoi An Hint restoranları rehberi Baba's Kitchen'ı Phan Chu Trinh'de 'Veg/Vegan/Halal/Gluten-free options' (helal seçenekli) olarak listeliyor; Foursquare 115 Phan Chu Trinh adresini doğruluyor. Restoranın kendi sitesi (babas.kitchen) araçta erişilemedi; sertifika veya et tedariki bilgisi bulunamadı, 'h",
    "sources": [
      "https://pickyourtrail.com/blog/indian-restaurants-in-hoi-an",
      "https://foursquare.com/top-places/hoi-an/best-places-wine"
    ]
  }
];
