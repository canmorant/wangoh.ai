import type {
  DestinationDietaryGuide,
  DietaryRestaurant,
  HalalVerificationStatus,
  VeganServiceLevel,
  VerificationSourceType,
} from "./types";

const LAST_VERIFIED = "2026-08-12";

type SourceKey = keyof typeof SOURCES;

const SOURCES = {
  happycow: {
    name: "HappyCow güncel vegan restoran dizini",
    url: "https://www.happycow.net/",
    type: "vegan-directory" as const,
  },
  plantsPack: {
    name: "Plants Pack tam vegan mekân dizini",
    url: "https://www.plantspack.com/vegan-places",
    type: "vegan-directory" as const,
  },
  japanHalal: {
    name: "JNTO Müslüman gezgin kaynakları",
    url: "https://www.japan.travel/en/my/muslim-guide/useful-links/",
    type: "official-tourism" as const,
  },
  kyotoHalal: {
    name: "Kyoto Muslim Friendly Council",
    url: "https://halal.kyoto.jp/client/",
    type: "certifier" as const,
  },
  hfsaa: {
    name: "Halal Food Standards Alliance of America",
    url: "https://www.hfsaa.org/chapters/",
    type: "certifier" as const,
  },
  halalThai: {
    name: "Thailand Halal Route / CICOT kaynakları",
    url: "https://www.chula.ac.th/en/highlight/185916/",
    type: "official-tourism" as const,
  },
  halalItaly: {
    name: "HalalSpy İtalya 2026 saha rehberi",
    url: "https://halalspy.com/halal-food-guide/europe/italy/",
    type: "specialist-directory" as const,
  },
  halalFrance: {
    name: "Ma Table Halal güncel Fransa dizini",
    url: "https://matablehalal.com/",
    type: "specialist-directory" as const,
  },
  visitKorea: {
    name: "Korea Tourism Organization Müslüman Dostu Restoranlar",
    url: "https://english.visitkorea.or.kr/public/asis/upload/Muslim-friendly_restaurants.pdf",
    type: "official-tourism" as const,
  },
  visitSpain: {
    name: "Turespaña Müslüman Gezginler Rehberi 2026",
    url: "https://www.spain.info/gcc/en/halal-tourism/",
    type: "official-tourism" as const,
  },
  turkeyVegan: {
    name: "Plants Pack Türkiye tam vegan mekân dizini",
    url: "https://www.plantspack.com/vegan-places/turkey/fully-vegan",
    type: "vegan-directory" as const,
  },
  gimdes: {
    name: "GİMDES güncel helal sertifika araması",
    url: "https://www.gimdes.com/SertifikaAra",
    type: "certifier" as const,
  },
  visitLondon: {
    name: "Visit London helal menü sunan restoranlar",
    url: "https://www.visitlondon.com/things-to-do/food-and-drink/restaurant/other-restaurant/halal",
    type: "official-tourism" as const,
  },
  halalBritain: {
    name: "Halal Tourism Britain",
    url: "https://www.halaltourismbritain.com/",
    type: "specialist-directory" as const,
  },
  fruene: {
    name: "Fruene resmî vegan seçenek açıklaması",
    url: "https://fruene.no/en/contact/",
    type: "restaurant" as const,
  },
  halalSvalbard: {
    name: "HalalTrip Longyearbyen Müslüman gezgin rehberi",
    url: "https://www.halaltrip.com/city-guide-details/614/longyearbyen/",
    type: "specialist-directory" as const,
  },
  kingsBay: {
    name: "Kings Bay Ny-Ålesund konaklama ve yemek bilgileri",
    url: "https://kingsbay.no/accommodations-meals-and-shop/",
    type: "official-tourism" as const,
  },
} satisfies Record<string, { name: string; url: string; type: VerificationSourceType }>;

type PickInput = Omit<DietaryRestaurant, "category" | "lastVerified" | "verification"> & {
  status: VeganServiceLevel | HalalVerificationStatus;
  source: SourceKey;
  verificationNote: string;
};

const makePick = (category: "vegan" | "halal", input: PickInput): DietaryRestaurant => {
  const { status, source, verificationNote, ...restaurant } = input;
  const evidence = SOURCES[source];
  return {
    ...restaurant,
    category,
    lastVerified: LAST_VERIFIED,
    verification: {
      status,
      sourceName: evidence.name,
      sourceUrl: evidence.url,
      sourceType: evidence.type,
      note: verificationNote,
    },
  };
};

const vegan = (input: PickInput) => makePick("vegan", input);
const halal = (input: PickInput) => makePick("halal", input);

const guide = (
  countryCode: string,
  city: string,
  veganPick: PickInput,
  halalPick: PickInput,
  researchNote?: string
): DestinationDietaryGuide => ({
  countryCode,
  city,
  vegan: [vegan(veganPick)],
  halal: [halal(halalPick)],
  ...(researchNote ? { researchNote } : {}),
});

const commonVeganNote =
  "Mekânın bitki bazlı kapsamı dizinde kontrol edildi; menü ve çalışma gününü rezervasyon öncesi yeniden doğrulayın.";
const commonHalalNote =
  "Bağımsız güncel bir sertifika kaydı bulunmadığı için işletmeden et tedarikini, ortak mutfağı ve alkol politikasını yeniden teyit edin.";

const v = (
  name: string,
  cuisine: string,
  area: string,
  description: string,
  why: string,
  status: VeganServiceLevel = "fully-vegan",
  source: SourceKey = "happycow"
): PickInput => ({
  name,
  cuisine,
  area,
  description,
  why,
  status,
  source,
  verificationNote: commonVeganNote,
});

const h = (
  name: string,
  cuisine: string,
  area: string,
  description: string,
  why: string,
  status: HalalVerificationStatus,
  source: SourceKey,
  verificationNote = commonHalalNote
): PickInput => ({
  name,
  cuisine,
  area,
  description,
  why,
  status,
  source,
  verificationNote,
});

export const DIETARY_GUIDES: DestinationDietaryGuide[] = [
  // Japonya — vegan kapsamı HappyCow; helal statüleri JNTO ve yerel resmî rehberlerle çapraz kontrol edildi.
  guide("JP", "Tokyo",
    v("Saido", "Yaratıcı Japon mutfağı", "Jiyugaoka", "Mevsimsel Japon tabaklarını tamamen bitki bazlı yorumlayan sakin bir restoran.", "Sushi ve kaiseki hissini hayvansal ürün kullanmadan yaşamak isteyenler için Tokyo'nun en güçlü özel-ama-rahat seçimlerinden."),
    h("PANGA", "Yakiniku ve wagyu", "Taito / Okachimachi", "Müslüman gezginlere yönelik helal wagyu ve masa başı ızgara deneyimi sunan aile işletmesi.", "Japonya'da bulunması zor helal yakiniku deneyimini merkezî bir konumda sunduğu için.", "restaurant-confirmed", "japanHalal", "İşletme helal et kullandığını beyan ediyor; güncel sertifika, sos içerikleri ve alkol servisini siparişten önce sorun.")
  ),
  guide("JP", "Osaka",
    v("MERCY Vegan Factory", "Japon ve dünya mutfağı", "Chuo", "Köri, ramen, gyoza ve tatlıları kapsayan geniş, tamamen vegan menülü gündelik lokanta.", "Yerel tatları tek tabakta denemek isteyen ilk kez gelenler için menüsü açıklayıcı ve kapsamlı."),
    h("Halal Restaurant Matsuri", "Japon ev yemekleri", "Fukushima", "Ramen, okonomiyaki ve takoyaki gibi Osaka klasiklerini helal uyarlamalarla sunan restoran.", "Sokak lezzetlerini tek mutfakta ve açık bir helal beyanıyla deneyebilmek için.", "restaurant-confirmed", "japanHalal", "Restoran helal uygunluğunu beyan ediyor; güncel sertifika kapsamını ve alkol bulunup bulunmadığını yeniden doğrulayın.")
  ),
  guide("JP", "Kyoto",
    v("Vegan Izakaya NIJIYA", "Japon izakaya", "Nakagyo", "Küçük tabaklar, sake eşleşmeleri ve ev yapımı tatlılarla tamamen vegan izakaya.", "Kyoto akşamını klasik izakaya düzeninde ama çapraz bulaşma kaygısı olmadan yaşatmasıyla öne çıkıyor."),
    h("YOSHIYA Arashiyama", "Japon mutfağı", "Arashiyama", "Arashiyama gezi hattında Müslüman dostu set menüler hazırlayan köklü Japon restoranı.", "Bambu Ormanı ve Togetsukyo rotasından sapmadan yerel bir öğün planlamak için pratik.", "halal-options", "kyotoHalal", "Müslüman dostu menü Kyoto'nun resmî programında yer alıyor; ön rezervasyon, mutfak ayrımı ve alkol servisini teyit edin.")
  ),
  guide("JP", "Hiroshima",
    v("Vegan Peace Otemachi", "Japon ve füzyon", "Otemachi", "Barış Parkı yakınında bitki bazlı ana yemekler ve tatlılar hazırlayan tamamen vegan kafe-restoran.", "Anıtlar çevresindeki yoğun gezi gününde dengeli, sakin ve kolay ulaşılır bir öğün olduğu için."),
    h("Okonomiyaki & Teppanyaki Jirokichi", "Hiroshima okonomiyaki", "Naka", "Hiroshima'nın resmî çeşitlilik rehberinde tüm menüsü helal olarak tanıtılan teppanyaki adresi.", "Şehrin simge yemeğini, et ve sos içeriği konusunda daha açık bir çerçevede denemek için.", "restaurant-confirmed", "japanHalal", "Hiroshima'nın resmî rehberi menünün tamamını helal olarak tanıtıyor; ziyaret günü işletmeden güncel uygulamayı teyit edin.")
  ),
  guide("JP", "Nara",
    v("Onwa", "Japon ev yemekleri", "Takabatake", "Sebze, tahıl ve fermente ürünleri yaratıcı tabaklarda buluşturan tamamen vegan küçük restoran.", "Nara Parkı çevresinde acele etmeden yenebilecek, özenli sunuma sahip bir öğle yemeği için."),
    h("Honolu Premier Nara Sanjo", "Helal ramen ve wagyu", "Sanjo-dori", "Mart 2026'da açılan, helal sertifikalı ramen ve Japon yemekleri sunan merkezî restoran.", "Nara'da sınırlı olan açıkça belgelenmiş helal Japon mutfağı seçeneklerinden biri olması nedeniyle.", "certified-halal", "japanHalal", "İşletmenin 2026 açılış duyurusu helal sertifikalı ramen beyan ediyor; sertifikanın güncel kopyasını yerinde kontrol edin.")
  ),
  guide("JP", "Sapporo",
    v("Holistic Bio Cafe Veggy Way", "Japon kafe mutfağı", "Maruyama", "Bitki bazlı ramen, pirinç tabakları ve tatlılar sunan tamamen vegan kafe.", "Hokkaido ürünlerini daha hafif bir mutfakla birleştiren, kahvaltıdan akşamüstüne esnek bir durak."),
    h("Watan Sapporo Halal Food", "Japon ve Asya mutfağı", "Kita", "Sapporo Müslüman dostu haritasında yer alan, helal odaklı gündelik restoran.", "İstasyon çevresinden erişilebilen pratik bir sıcak yemek alternatifi sunduğu için.", "muslim-friendly", "japanHalal", "Yerel Müslüman dostu haritada listeleniyor; resmî sertifika, mutfak ayrımı ve alkol durumunu işletmeden sorun.")
  ),
  guide("JP", "Kobe",
    v("Modernark Pharm Cafe", "Doğal ve makrobiyotik", "Sannomiya", "Vejetaryen tabanlı menüsünde belirgin vegan ana yemekler ve tatlılar bulunan uzun soluklu kafe.", "Liman ile Kitano arasındaki rotada rahat bir avlu atmosferi ve güçlü vegan seçenekler sunduğu için.", "vegan-options"),
    h("Halal Kobe Beef Nagomi", "Kobe eti teppanyaki", "Sannomiya", "Helal Kobe eti deneyimine odaklanan rezervasyonlu teppanyaki restoranı.", "Kobe'nin simge ürününü, tedarik ve hazırlama süreci açıkça helal çerçevede sunan özel bir deneyim için.", "certified-halal", "kyotoHalal", "Helal programında sertifikalı seçenek olarak listeleniyor; sertifika geçerliliğini, içecek listesini ve rezervasyon şartını yeniden kontrol edin.")
  ),
  guide("JP", "Okinawa",
    v("Gajimaru", "Okinawa ve füzyon", "Chatan", "Ada sebzeleriyle renkli kaseler, sandviçler ve tatlılar hazırlayan tamamen vegan restoran.", "Okinawa'ya özgü ürünleri plaj gününe uygun, hafif ama doyurucu tabaklarda denemek için."),
    h("Okinawa Halal Kitchen", "Fast food ve biryani", "Nakagusuku", "Okinawa Camii yakınında 2026'da açılan, kendisini yüzde yüz helal olarak tanımlayan paket servis ağırlıklı mutfak.", "Adada açık helal beyanı ve alkolsüz gündelik menü arayanlar için doğrudan bir seçenek.", "restaurant-confirmed", "japanHalal", "İşletme yüzde yüz helal olduğunu beyan ediyor; üçüncü taraf sertifikası görünmediğinden güncel belgeyi ve mutfak uygulamasını sorun.")
  ),

  // Amerika Birleşik Devletleri
  guide("US", "New York",
    v("Spicy Moon", "Vegan Sichuan", "West Village", "Mapo tofu, dan dan eriştesi ve dim sum'u tamamen vegan hazırlayan canlı Sichuan restoranı.", "New York'un bitki bazlı sahnesinde paylaşmaya uygun, baharat seviyesi ayarlanabilen karakterli bir akşam yemeği."),
    h("FARIDA", "Orta Asya", "Midtown", "Özbek, Kazak ve Uygur klasiklerini helal etle sunan Manhattan restoranı.", "Turistik merkezlere yakınken plov, mantı ve ızgaraları tek masada denemek için.", "restaurant-confirmed", "hfsaa", "Restoran kendisini helal olarak tanımlıyor; HFSAA dizininde güncel sertifika kaydını ve alkol politikasını ayrıca kontrol edin.")
  ),
  guide("US", "Los Angeles",
    v("Crossroads Kitchen", "Bitki bazlı Akdeniz", "West Hollywood", "Sebze merkezli küçük tabaklar, makarna ve tatlıları şık bir servisle sunan tamamen vegan restoran.", "Özel bir akşam için Los Angeles'ın rafine bitki bazlı mutfağını güçlü bir servis standardıyla deneyimlemek üzere."),
    h("Urban Skillet", "Helal Amerikan füzyon", "North Hollywood", "Burger, cheesesteak ve Kore esintili sokak yemeklerini yüzde yüz helal beyanıyla sunan gündelik adres.", "Hızlı servis ile yaratıcı füzyon menüyü bir araya getirdiği ve açık et tedariki beyanı sunduğu için.", "restaurant-confirmed", "hfsaa", "İşletme yüzde yüz helal beyanında bulunuyor; güncel tedarikçiyi ve varsa ortak ekipmanı şubeden teyit edin.")
  ),
  guide("US", "Miami",
    v("PLANTA Queen", "Vegan Asya füzyon", "Coconut Grove", "Sushi, noodle ve küçük tabaklardan oluşan tamamen bitki bazlı, enerjik bir menü.", "Grup yemeğinde paylaşmaya uygun menüsü ve Coconut Grove yürüyüşüne kolay eklenmesi nedeniyle."),
    h("Shah's of Kabob", "İran ızgara", "South Miami", "Kebap, pilav ve mezeleri helal et beyanıyla hazırlayan aile işletmesi.", "Gösterişsiz serviste iyi marine edilmiş ızgaralar ve cömert porsiyonlar arayanlar için.", "restaurant-confirmed", "hfsaa", "Restoran helal et kullandığını beyan ediyor; HFSAA Miami bölümünden güncel sertifika ve alkol durumunu kontrol edin.")
  ),
  guide("US", "Chicago",
    v("Alice & Friends' Vegan Kitchen", "Vegan Asya-Amerikan", "Edgewater", "Mantıdan noodle'a, comfort food tabaklarından tatlıya uzanan tamamen vegan mutfak.", "Geniş menüsü farklı damak zevklerine hitap ettiği için özellikle karışık gruplarda güvenli bir seçim."),
    h("Hummus Grill", "Akdeniz ve Levant", "Near North", "Kendisini yüzde yüz helal olarak tanıtan; kebap, shawarma ve mezeler sunan gündelik restoran.", "Merkezî konumda hızlı, anlaşılır ve paylaşmaya uygun bir helal öğün için.", "restaurant-confirmed", "hfsaa", "İşletme yüzde yüz helal beyanında bulunuyor; HFSAA/HMS kaydını ve içecek politikasını ziyaret öncesi teyit edin.")
  ),
  guide("US", "San Francisco",
    v("Shizen", "Vegan sushi", "Mission District", "Japon teknikleriyle sebze, mantar ve fermente tatları öne çıkaran tamamen vegan sushi bar.", "Bitki bazlı sushinin yalnızca ikame ürünlerden ibaret olmadığını gösteren yaratıcı omakase yaklaşımı için."),
    h("Old Mandarin Islamic Restaurant", "Çin Müslüman mutfağı", "Outer Sunset", "Kuzey Çin'in erişte, kuzu ve wok yemeklerini helal odaklı menüyle sunan köklü restoran.", "San Francisco'da nadir bulunan Çin Müslüman mutfağını paylaşmalı tabaklarla deneyimlemek için.", "restaurant-confirmed", "hfsaa", "Uzun süredir helal restoran olarak listeleniyor; güncel sertifikayı, sos içeriklerini ve alkol servisini işletmeden doğrulayın.")
  ),
  guide("US", "Las Vegas",
    v("Chef Kenny's Vegan Dim Sum", "Vegan Çin ve pan-Asya", "Chinatown", "Dim sum, sushi ve wok yemeklerinden oluşan tamamen vegan geniş bir menü.", "Strip dışına kısa bir yolculukla paylaşmaya uygun ve şehirde az rastlanan vegan dim sum deneyimi için."),
    h("The Halal Guys", "Amerikan helal sokak yemeği", "Spring Valley", "Tavuk veya gyro etini pilav, salata ve imza soslarla sunan hızlı servis zinciri.", "Geç saate kalan planlarda standardize, hızlı ve açıkça helal beyan edilen bir öğün alternatifi olduğu için.", "restaurant-confirmed", "hfsaa", "Marka helal et beyan ediyor; Las Vegas şubesinin güncel tedarikini ve şube durumunu siparişten önce teyit edin.")
  ),

  // Tayland
  guide("TH", "Bangkok",
    v("Veganerie Concept", "Vegan Tay ve dünya mutfağı", "Phrom Phong", "Tay klasikleri, kaseler, burgerler ve kapsamlı tatlı seçkisi sunan tamamen vegan restoran.", "İlk kez vegan Tay mutfağı deneyenler için açık menüsü, merkezi konumu ve geniş gün aralığı nedeniyle."),
    h("Al-Rahaman", "Hint ve Tay Müslüman mutfağı", "Bang Rak", "Haroon Camii çevresinde biryani, köri ve tandoor yemekleriyle bilinen Müslüman işletmesi.", "Bangkok'un tarihî Müslüman mahallesinde karakterli, gösterişsiz ve baharatı güçlü bir öğün için.", "restaurant-confirmed", "halalThai", "Müslüman işletmesi ve helal beyanı güncel dizinlerde yer alıyor; CICOT kaydı ile alkol politikasını yine de kontrol edin.")
  ),
  guide("TH", "Chiang Mai",
    v("Pure Vegan Heaven – Old Town", "Vegan Tay ve füzyon", "Eski Şehir", "Renkli kaseler, Tay yemekleri, kahvaltı ve tatlılardan oluşan tamamen vegan menü.", "Tapınak gezileri arasında hem yerel lezzet hem de hafif kahvaltı arayanlar için esnek bir durak."),
    h("Khao Soi Islam", "Kuzey Tayland Müslüman mutfağı", "Chang Khlan", "Helal sokak çevresinde khao soi, biryani ve sığır satayıyla bilinen köklü lokanta.", "Chiang Mai'nin imza erişte yemeğini domuz ürünü kaygısını azaltan Müslüman mutfağında denemek için.", "restaurant-confirmed", "halalThai", "TAT ve yerel Müslüman rehberlerinde helal adres olarak geçiyor; güncel CICOT belgesini ve içecek politikasını teyit edin.")
  ),
  guide("TH", "Phuket",
    v("Vegan Table", "Vegan Tay ve uluslararası", "Phuket Old Town", "Köri, noodle, burger ve tatlıları tamamen bitki bazlı hazırlayan samimi şehir restoranı.", "Old Town yürüyüşünde yerel baharatları açık vegan etiketlerle deneyebilmek için."),
    h("Kusuma Seafood", "Güney Tayland deniz ürünleri", "Patong", "Müslüman işletmesi olarak bilinen, deniz ürünleri ve Tay usulü wok yemekleri sunan restoran.", "Patong'da grupça sipariş verilebilen geniş deniz ürünü seçkisi ve açık helal kimliği için.", "restaurant-confirmed", "halalThai", "Helal rehberlerinde Müslüman işletmesi olarak listeleniyor; CICOT sertifikasını, sosları ve alkol politikasını güncel olarak sorun.")
  ),
  guide("TH", "Krabi",
    v("Plant-erian", "Vegan Tay ve Batı", "Ao Nang", "Tay yemekleri, burger, makarna ve smoothie sunan tamamen vegan kafe-restoran.", "Ao Nang çevresinde 2026 yorumlarıyla etkinliği görülen, geniş menülü ender tam vegan adreslerden."),
    h("Asama Halal Thai Food", "Helal Tay", "Ao Nang", "Köri, deniz ürünleri ve Güney Tayland tabakları sunan Müslüman işletmesi.", "Plaj hattına yakın, yerel yemekleri açık helal beyanıyla ve makul tempoda denemek için.", "restaurant-confirmed", "halalThai", "Andaman helal rotalarında ve güncel dizinlerde yer alıyor; CICOT belgesini ve mutfak ayrımını işletmeden yeniden doğrulayın.")
  ),
  guide("TH", "Koh Samui",
    v("Halapua by Kapuhala", "Vegan Sicilya-Asya füzyon", "Lamai", "Sicilya ile Samui ürünlerini tadım düzeninde buluşturan tamamen bitki bazlı restoran.", "Ada akşamını sıradan bir kafe öğününden daha özel, rezervasyonlu bir deneyime çevirmek için."),
    h("Roti Otin", "Tay Müslüman kahvaltısı", "Bo Phut", "Roti, köri ve çay eşleşmeleriyle öne çıkan Müslüman işletmesi küçük lokanta.", "Koh Samui'de sınırlı olan açık helal seçenekler arasında yerel ve bütçe dostu bir kahvaltı sunması nedeniyle.", "restaurant-confirmed", "halalThai", "Müslüman işletmesi olarak dizinlerde yer alıyor; şube durumunu, CICOT kaydını ve çalışma saatini ziyaret günü teyit edin.")
  ),
  guide("TH", "Ayutthaya",
    v("Youta Jay Vegetarian Food", "Tay jay mutfağı", "Naraesuan", "Hazır sıcak yemekler ve erişteleri yumurta, balık ve et olmadan sunan sade jay lokantası.", "Tren istasyonu-feribot-tarihî ada hattında hızlı, yerel ve bütçe dostu bir vegan öğün için."),
    h("Usman Steak Halal", "Tay ve ızgara", "Ayutthaya merkezi", "TAT'nin güncel Salam Routes rehberinde öğle yemeği durağı olarak önerilen helal restoran.", "Tapınak rotasına kolay eklenen, aileler ve gruplar için anlaşılır ızgara menüsü sunduğu için.", "restaurant-confirmed", "halalThai", "TAT 2026 rehberinde helal adıyla listeleniyor; CICOT sertifika numarasını ve alkol politikasını işletmeden doğrulayın.")
  ),

  // İtalya
  guide("IT", "Roma",
    v("Romeow Cat Bistrot", "Vegan İtalyan", "Ostiense", "Mevsimsel makarna, yaratıcı ana yemek ve pastaları tamamen bitki bazlı sunan bistro.", "Klasik İtalyan tekniklerini modern sunumla görmek ve sakin bir uzun öğle yemeği yapmak için."),
    h("Himalaya's Kashmir", "Pakistan ve Hint", "Esquilino", "Köri, tandoor ve biryani çeşitleriyle uzun süredir hizmet veren helal beyanlı restoran.", "Termini çevresinde geniş menü, paylaşmalı servis ve geç saat planlarına uygunluğu nedeniyle.", "restaurant-confirmed", "halalItaly", "Güncel İtalya helal rehberinde yer alıyor; resmî sertifika, et tedarikçisi ve alkol servisini restoranla teyit edin.")
  ),
  guide("IT", "Venedik",
    v("La Tecia Vegana", "Vegan organik İtalyan", "Dorsoduro / Santa Marta", "Ravioli, patlıcan lazanya ve tiramisù gibi İtalyan yemeklerini tamamen vegan sunan organik restoran.", "Venedik'teki ender tam vegan akşam yemeği deneyimi; 2026 menüsü güncel ve rezervasyon gerektiriyor."),
    h("SKK Mediterranea", "Akdeniz ve kebap", "Cannaregio", "Kebap, falafel ve ızgaraları helal et beyanıyla sunan gündelik restoran.", "Tarihî adada helal seçeneğin sınırlı olduğu bir bölgede ulaşılabilir sıcak yemek alternatifi olduğu için.", "restaurant-confirmed", "halalItaly", "Güncel helal rehberlerinde listeleniyor; üçüncü taraf sertifika, ortak mutfak ve alkol servisini yerinde kontrol edin.")
  ),
  guide("IT", "Floransa",
    v("Tripperia Vegana TAN8", "Vegan Toskana sokak yemeği", "Santa Croce", "Floransa'nın lampredotto geleneğini bitki bazlı sandviç ve 'vegan işkembe' yorumlarıyla sunan küçük tezgâh.", "Şehrin yerel sokak yemeği karakterini vegan bir fikirle, hızlı ve özgün biçimde deneyimlemek için."),
    h("Crown of India", "Hint", "Santa Maria Novella", "Köri, tandoor ve biryani sunan, helal et kullandığını belirten merkezî restoran.", "Tren istasyonu ve tarihî merkez arasında grupça paylaşılabilen geniş menü arayanlar için.", "restaurant-confirmed", "halalItaly", "İşletme/dizin beyanı helal et yönünde; sertifika kapsamını, kuzu-tavuk tedarikini ve alkol servisini sorun.")
  ),
  guide("IT", "Milano",
    v("Linfa", "Vegan çağdaş İtalyan", "Porta Venezia", "Makarna, pizza ve yaratıcı tabakları rafine sunumla hazırlayan tamamen vegan restoran.", "Milano'nun tasarım duygusunu bitki bazlı İtalyan mutfağıyla birleştiren özel bir akşam için."),
    h("Aladino", "Lübnan", "Via Padova", "Izgara et, meze ve fırın yemekleri sunan helal beyanlı Lübnan restoranı.", "Kalabalık masalara uygun mezeleri ve Via Padova'nın çok kültürlü yemek sahnesini deneyimlemek için.", "restaurant-confirmed", "halalItaly", "2026 İtalya helal rehberinde öne çıkıyor; güncel sertifika ve alkol politikasını işletmeden yeniden teyit edin.")
  ),
  guide("IT", "Amalfi Kıyısı",
    v("Pizzeria Donna Stella", "Napoli pizzası", "Amalfi merkezi", "Vegan peynir, vegan pesto ve bitki bazlı pizza seçenekleri bulunan limon ağaçlı avlu pizzacısı.", "Tam vegan restoranın sınırlı olduğu kıyıda, açıkça tanımlanmış birden fazla vegan pizza seçeneği sunduğu için.", "vegan-options"),
    h("Kasai Amalfi Coast", "Japon ve Akdeniz füzyon", "Praiano", "Deniz ürünü ağırlıklı menüsünde Müslüman misafir için önceden bildirildiğinde uyarlama yapabildiğini belirten restoran.", "Kıyıda belgeli helal restoran açığı sürerken, ön iletişimle deniz ürünü/vegan seçenek planlanabilen bir adres olması nedeniyle.", "verification-recommended", "halalItaly", "Bağımsız helal sertifikası bulunamadı; bu yalnızca ön görüşme gerektiren bir seçenek. Alkol, mirin, sos ve ortak mutfağı yazılı teyit etmeden helal kabul etmeyin."),
    "Amalfi Kıyısı'nda güncel, bağımsız biçimde sertifikalanmış bir helal restoran bulunamadı; öneri yalnızca ön teyitli alternatif olarak işaretlendi."
  ),
  guide("IT", "Napoli",
    v("'O Grin", "Vegan Napoli ev yemekleri", "Centro Storico", "Makarna, risotto, burger ve tatlıları günlük hazırlayan tamamen vegan küçük lokanta.", "Tarihî merkezde hızlı, ekonomik ve yerel malzemeye dayalı öğle yemeği için."),
    h("Taj Mahal Napoli", "Hint ve Pakistan", "Piazza Garibaldi", "Biryani, köri ve tandoor yemekleri sunan helal beyanlı restoran.", "Garibaldi ulaşım düğümüne yakın, geniş ve kolay anlaşılır bir menü sunduğu için.", "restaurant-confirmed", "halalItaly", "Güncel helal dizinlerinde yer alıyor; sertifika, et tedariki ve alkol politikasını siparişten önce doğrulayın.")
  ),

  // Fransa
  guide("FR", "Paris",
    v("Le Potager de Charlotte", "Vegan Fransız", "9. arrondissement", "Fransız tekniklerini mevsimsel sebze, bakliyat ve yaratıcı soslarla tamamen vegan yorumlayan restoran.", "Paris'te özel bir akşamı ağır taklit ürünler yerine ürün odaklı, dengeli bir menüyle geçirmek için."),
    h("Le Confidentiel", "Fransız ve dünya mutfağı", "8. arrondissement", "Et yemeklerini helal beyanıyla sunan, rezervasyonlu ve şık servisli restoran.", "Paris'te yalnız kebap değil, Fransız tarzı bir akşam yemeği arayanlar için.", "restaurant-confirmed", "halalFrance", "Helal restoran dizinlerinde yer alıyor; AVS/ARGML benzeri güncel sertifikayı ve alkol servisini doğrudan teyit edin.")
  ),
  guide("FR", "Nice",
    v("Koko Green", "Vegan Akdeniz füzyon", "Vieux Nice", "Mevsimsel sebze tabakları, brunch ve tatlıları tamamen bitki bazlı hazırlayan samimi restoran.", "Eski Şehir içinde sebze odaklı, renkli ve iyi dengelenmiş bir öğle yemeği için."),
    h("Le Cèdre", "Lübnan", "Jean Médecin çevresi", "Meze, ızgara ve fırın yemekleri sunan helal et beyanlı Lübnan restoranı.", "Vejetaryenlerle et yiyenlerin aynı masada kolayca paylaşabileceği geniş meze düzeni için.", "restaurant-confirmed", "halalFrance", "Dizin ve işletme beyanı helal et yönünde; resmî belgeyi, alkolü ve ortak ızgarayı yeniden doğrulayın.")
  ),
  guide("FR", "Lyon",
    v("Against the Grain", "Vegan kafe ve comfort food", "Croix-Rousse", "Sandviç, brunch, günlük tabak ve pastaları tamamen vegan sunan mahalle kafesi.", "Croix-Rousse yürüyüşünde rahat, yaratıcı ve gün ortasına uygun bir bitki bazlı mola için."),
    h("L'Authentik", "Helal Fransız", "Vieux Lyon", "Et ve kümes hayvanlarının sertifikalı olduğunu belirten Fransız bistrosu.", "Klasik kebap hattının dışında soslu et ve bistro tabağı arayanlar için.", "restaurant-confirmed", "halalFrance", "2026 rehberi tüm etlerin sertifikalı olduğunu aktarıyor; sertifikayı ve alkol servisini restoranda güncel olarak kontrol edin.")
  ),
  guide("FR", "Marsilya",
    v("Hododa", "Vegan organik kafe", "Le Panier", "Dönüşümlü öğle tabakları, kahvaltı ve fırın ürünleri sunan tamamen vegan kafe.", "Eski Liman ile Le Panier arasında sakin, mevsimsel ve iyi kahveli bir mola vermek için."),
    h("Chez Yassine", "Tunus", "Noailles", "Kuskus, lablabi ve ızgaraları helal et beyanıyla sunan gösterişsiz Tunus lokantası.", "Noailles pazar çevresinde güçlü baharatlı, bütçe dostu ve yerel ritimli bir öğün için.", "restaurant-confirmed", "halalFrance", "İşletme ve uzman dizinlerde helal olarak geçiyor; et tedarikçisi, sertifika ve alkol politikasını yeniden sorun.")
  ),
  guide("FR", "Bordo",
    v("Monkey Mood", "Vegan Asya füzyon", "Saint-Pierre", "Asya esintili küçük tabaklar, noodle ve tatlıları tamamen vegan hazırlayan restoran.", "Şarap kentinde sebze odaklı, yaratıcı ve paylaşmalı bir akşam menüsü arayanlar için."),
    h("Le Rajistan", "Hint", "Saint-Michel", "Köri, tandoor ve biryani sunan; helal et kullandığını belirten restoran.", "Merkezde baharat seviyesi ayarlanabilen ve vejetaryen seçenekleri de güçlü bir grup yemeği için.", "restaurant-confirmed", "halalFrance", "Uzman dizinlerde helal et beyanıyla listeleniyor; sertifikayı, alkol servisini ve ortak mutfağı işletmeden teyit edin.")
  ),
  guide("FR", "Strazburg",
    v("Harmonie Bowl & Juice", "Vegan kafe", "Krutenau", "Kaseler, tuzlu krepler, içecek ve tatlıları tamamen bitki bazlı sunan renkli kafe.", "Tarihî merkez yürüyüşünde hafif ama doyurucu bir öğle yemeği ve net alerjen iletişimi için."),
    h("Au Cèdre", "Lübnan", "Grande Île çevresi", "Meze ve ızgaraları helal et beyanıyla sunan Lübnan restoranı.", "Katedral çevresinden kolay ulaşım ve sebze ağırlıklı paylaşmalı tabak çeşitliliği için.", "restaurant-confirmed", "halalFrance", "Dizin/işletme beyanı helal et yönünde; güncel sertifika, ortak ızgara ve alkol durumunu doğrulayın.")
  ),

  // Güney Kore
  guide("KR", "Seul",
    v("Plant Cafe & Kitchen", "Vegan dünya mutfağı", "Itaewon", "Kaseler, burger, makarna ve tatlıları tamamen vegan hazırlayan uzun soluklu restoran.", "Seul'ün uluslararası mahallesinde geniş menü, anlaşılır İngilizce iletişim ve güvenilir bitki bazlı seçenek için."),
    h("EID Halal Korean Food", "Helal Kore", "Itaewon", "Bulgogi, bibimbap ve tavuk yemeklerini helal sertifika çerçevesinde sunan Kore restoranı.", "Müslüman gezginlerin Kore ev yemeklerini açık bir helal sınıflandırmayla deneyebileceği en bilinen adreslerden.", "certified-halal", "visitKorea", "KTO'nun helal sertifikalı kategorisinde yer alıyor; KMF sertifikasının güncel geçerliliğini ziyaret günü kontrol edin.")
  ),
  guide("KR", "Busan",
    v("Vegenarang", "Vegan Kore", "Suyeong", "Bibimbap, erişte, kızartma ve ev yemeklerini tamamen bitki bazlı hazırlayan sakin restoran.", "Deniz ürünleri ağırlıklı Busan mutfağına karşı yerel dokuyu koruyan kapsamlı bir vegan alternatif olduğu için."),
    h("Cappadocia", "Türk", "Geumjeong", "Busan şehrinin Müslüman dostu rehberinde helal sınıfında yer alan, cami yakınındaki Türk restoranı.", "Busan Al-Fatah Camii yanında pide, kebap ve çorbayı açık helal çerçevede bulmak için.", "restaurant-confirmed", "visitKorea", "KTO/Busan kaynaklarında helal veya işletme beyanlı olarak sınıflandırılıyor; mevcut sertifika ve alkol durumunu teyit edin.")
  ),
  guide("KR", "Jeju Adası",
    v("Loving Hut Seogwipo", "Vegan Kore", "Seogwipo", "Tofu, patlıcanlı pirinç ve Kore ev yemeklerini tamamen vegan sunan küçük restoran.", "Ada turunda yerel lezzetleri balık sosu ve et suyu olmadan deneyebilmek için."),
    h("Wardah Restaurant", "Yemen ve Orta Doğu", "Jeju City", "Mandi, haneeth ve Arap çayıyla bilinen, Visit Jeju'nun Müslüman dostu seçkisindeki restoran.", "Jeju'daki Müslüman topluluğuyla bağı ve açık helal odağı sayesinde güvenli bir başlangıç noktası olduğu için.", "restaurant-confirmed", "visitKorea", "Visit Jeju tarafından helal-dostu olarak listeleniyor; KMF sertifikası ile alkol politikasını güncel olarak sorun.")
  ),
  guide("KR", "Gyeongju",
    v("Sugyeongsa", "Kore füzyon", "Hwangnidan-gil", "Et de servis eden mutfakta ayrı vegan set menüsü, lotuslu pilav ve perilla eriştesi hazırlayan restoran.", "2026'da güncel yorumlarla doğrulanan, yerel tatlara odaklı tam bir vegan set sunduğu için.", "vegan-options"),
    h("Taj Mahal in Korea", "Hint", "Gyeongju merkezi", "KTO'nun güncel Müslüman dostu restoran listesinde yer alan köri ve tandoor restoranı.", "Saray ve tümülüs rotası sonrası, açık sınıflandırmalı sıcak bir yemek alternatifi sunduğu için.", "muslim-friendly", "visitKorea", "KTO listesinde Müslüman dostu olarak geçiyor; bu sertifikalı anlamına gelmez. Helal et, ortak mutfak ve alkolü sorun.")
  ),
  guide("KR", "Incheon",
    v("Taehwawon", "Kore-Çin", "Chinatown", "Et de sunan restoranın ayrı menüsünde vegan erişte, tofu ve sebze yemekleri bulunuyor.", "Incheon Chinatown'da vegan seçeneklerin sınırlı olduğu bir bölgede 2026 yorumlarıyla etkinliği görülen güçlü alternatif.", "vegan-options"),
    h("Aladdin Kebab", "Türk ve Orta Doğu", "Yeonsu / Songdo", "KTO listesinde Müslüman işletmesi tarafından beyanlı kategoride yer alan kebap ve ızgara restoranı.", "Songdo Central Park çevresinde helal odaklı, hızlı ve doyurucu bir öğün için.", "restaurant-confirmed", "visitKorea", "KTO'da self-certified olarak listeleniyor; üçüncü taraf sertifikası varsaymayın, et tedariki ve alkolü işletmeden teyit edin.")
  ),
  guide("KR", "Sokcho",
    v("Cho Jejene Sigtag", "Kore ev yemekleri", "Joyang", "Et de sunan mutfakta menüde açıkça işaretlenmiş acılı tofu, pirinç ve yan yemeklerden oluşan vegan tabak.", "Sokcho'daki çok sınırlı vegan sahnede Temmuz 2026 tarihli yorumlarla güncel ve doyurucu bir yerel seçenek.", "vegan-options"),
    h("Miga", "Kore", "Seoraksan", "KTO tarafından helal menüsü bulunan ve domuzsuz olarak sınıflandırılan, kurutulmuş pollack setleri sunan restoran.", "Seoraksan yürüyüşü çevresinde resmî turizm kaynağında açık sınıflandırması olan nadir seçeneklerden.", "halal-options", "visitKorea", "Bazı helal yemekler sunulur ve alkol satılabilir; mutfak tamamen helal değildir. Siparişi, sosları ve hazırlama alanını teyit edin.")
  ),

  // İspanya — Turespaña rehberi ülke çapındaki helal seçenekleri doğrular; sertifikası açık olmayan kartlar temkinli etiketlenir.
  guide("ES", "Barcelona", v("Roots & Rolls", "Vegan Asya füzyon", "Eixample", "Sushi, bao ve sıcak Asya tabaklarını tamamen vegan hazırlayan restoran.", "Paylaşımlı menüsü ve yaratıcı sunumuyla özel bir akşamı kolaylaştırdığı için."), h("Bismillah Kebabish", "Pakistan ızgara", "El Raval", "Izgara, köri ve biryani sunan Müslüman işletmesi gündelik lokanta.", "Raval'da uygun bütçeli, hızlı ve doyurucu bir helal öğün için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "Madrid", v("Mudrá", "Vegan dünya mutfağı", "Chueca", "Pizza, sushi ve yaratıcı tabaklardan oluşan tamamen bitki bazlı menü.", "Şık ama rahat bir ortamda farklı mutfaklardan paylaşmalı tabaklar denemek için."), h("Alzahra", "Arap ve Akdeniz", "Mezquita M-30", "Madrid İslam Kültür Merkezi bünyesinde Arap ve Akdeniz yemekleri sunan restoran.", "Cami ziyaretiyle birleştirilebilen, toplulukla doğrudan bağı olan pratik seçenek.", "restaurant-confirmed", "visitSpain", "Kültür merkezi bağlantısı güçlü bir kanıt olsa da güncel sertifika ve servis ayrıntılarını teyit edin.")),
  guide("ES", "Sevilla", v("Veganí", "Vegan tapas", "Casco Antiguo", "Endülüs esintili tapas, burger ve tatlıları tamamen vegan hazırlayan küçük restoran.", "Sevilla'nın tapas ritmini bitki bazlı paylaşım düzeniyle yaşamak için."), h("Al Wadi", "Lübnan ve Fas", "Santa Cruz", "Meze, tajin ve ızgara sunan helal beyanlı merkezî restoran.", "Alcázar çevresinde kolay ulaşım ve güçlü vejetaryen-meze dengesi için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "Valencia", v("Khambú", "Vegan comfort food", "El Carme", "Burger, bocadillo ve tapasları tamamen vegan sunan canlı restoran.", "Turia ve tarihî merkez rotasında doyurucu, hızlı ve net etiketli menü için."), h("Balansiya", "Endülüs ve Akdeniz", "Ciutat Vella", "Endülüs mirasından ilham alan, helal et beyanlı rafine restoran.", "Valencia'da tarih anlatısını yemekle birleştiren daha özel bir helal akşam için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "Málaga", v("MIMO Vegan", "Vegan Akdeniz", "Centro", "Tapas, brunch ve tatlıları tamamen bitki bazlı sunan merkezî kafe-restoran.", "Müze ve liman yürüyüşü arasında yaratıcı, hafif bir öğün için."), h("Al-Yamal", "Fas", "Centro Histórico", "Tajin, kuskus ve pastilla sunan helal beyanlı Fas restoranı.", "Málaga'nın Endülüs bağını geleneksel baharatlar ve sakin servisle hissetmek için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "Granada", v("Hicuri", "Vegan İspanyol ve dünya", "Realejo", "Tapas, günlük tabaklar ve tatlıları tamamen vegan hazırlayan renkli restoran.", "Elhamra sonrası Realejo'da geniş menülü, güvenilir bir bitki bazlı akşam için."), h("Restaurante Arrayanes", "Fas", "Albaicín", "Kuskus, tajin ve çorbaları helal et beyanıyla sunan geleneksel restoran.", "Albaicín'in Mağrip mirasını atmosferi güçlü bir sofrada deneyimlemek için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "Bilbao", v("Bohemian Lane", "Vegan kafe ve pastane", "Casco Viejo", "Sandviç, günlük tabak ve pastaları tamamen vegan sunan küçük kafe.", "Eski Şehir'de kahve-tatlı molasını güvenli ve samimi bir vegan menüyle yapmak için."), h("Taj Mahal Bilbao", "Hint", "Abando", "Köri ve tandoor çeşitlerinde helal et kullandığını belirten restoran.", "Guggenheim–merkez hattında baharat seviyesi ayarlanabilir geniş menü için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "Córdoba", v("La Libélula", "Vegan ve vejetaryen kafe", "Judería", "Günlük sebze tabakları, tost ve tatlılarda belirgin vegan seçenekler sunan kafe.", "Mezquita çevresinde sakin, öğle saatine uygun ve ürün odaklı bir mola için.", "vegan-focused"), h("Noor", "Endülüs yüksek mutfağı", "Cañero", "Paco Morales'in Endülüs tarihini çağdaş tadım menülerine taşıyan, Turespaña'nın helal mutfak örneği olarak gösterdiği restoran.", "Helal seyahatte gastronomiyi ana deneyime dönüştüren, rezervasyon gerektiren özel bir masa için.", "halal-options", "visitSpain", "Turespaña helal haute cuisine olarak anıyor; menü dönemi, et sertifikası, alkol ve eşleşmeleri rezervasyonda yazılı teyit edin.")),
  guide("ES", "Alicante", v("Bodhi Green", "Vejetaryen dünya mutfağı", "Centro", "Vejetaryen mutfakta geniş ve açık işaretli vegan kaseler, burgerler ve tatlılar sunan restoran.", "Farklı tercihlere sahip gruplarda veganların tek seçeneğe sıkışmaması için.", "vegan-focused"), h("Al Medina", "Fas ve Lübnan", "Centro", "Meze, kuskus ve ızgaraları helal beyanıyla sunan restoran.", "Sahil ve kale rotası sonrasında paylaşmalı, sebze seçeneği de güçlü bir masa için.", "restaurant-confirmed", "visitSpain")),
  guide("ES", "San Sebastián", v("Garraxi Taberna", "Vejetaryen Bask", "Egia", "Vejetaryen tabanlı mutfakta belirgin vegan pintxos ve ana yemekler sunan mahalle lokantası.", "Pintxos kültürünü sebze odaklı ve gündelik bir ortamda denemek için.", "vegan-focused"), h("Tandoori Mashala", "Hint ve Pakistan", "Amara", "Köri, tandoor ve biryani sunan helal et beyanlı restoran.", "Deniz ürününe alternatif, sıcak ve paylaşmaya uygun bir helal öğün için.", "verification-recommended", "visitSpain")),
  guide("ES", "Toledo", v("Street & Soul", "Vegan seçenekli kafe", "Casco Histórico", "Kaseler, tostlar ve bitki bazlı uyarlamalar sunan modern kafe.", "Yokuşlu eski şehir turunda hafif ve açıkça konuşulabilir bir öğle molası için.", "vegan-options"), h("Alqahira Rincón de Oriente", "Orta Doğu", "Casco Histórico", "Falafel, meze ve ızgara sunan helal beyanlı küçük restoran.", "Toledo'nun üç kültür rotasında Orta Doğu lezzetlerine ayrılmış samimi bir durak için.", "verification-recommended", "visitSpain")),
  guide("ES", "Salamanca", v("Café Atelier", "Vejetaryen kafe", "Centro", "Vejetaryen menüsünde vegan sandviç, günlük tabak ve tatlılar sunan kafe.", "Üniversite bölgesinde erişilebilir fiyatlı ve açık bitki bazlı seçenekler için.", "vegan-focused"), h("Taj Mahal Salamanca", "Hint", "Centro", "Köri ve tandoor çeşitlerinde helal et beyan eden restoran.", "Plaza Mayor çevresinde vejetaryen seçeneği de bol bir grup yemeği için.", "verification-recommended", "visitSpain")),
  guide("ES", "Palma de Mallorca", v("Ca n'Ela Vegan", "Vegan Mallorca ve Akdeniz", "Old Town", "Mevsimsel ada ürünleriyle tamamen vegan günlük menüler hazırlayan aile işletmesi.", "Mallorca mutfağının yerel ürünlerini ev sıcaklığında deneyimlemek için."), h("Layla Restaurant", "Lübnan", "Santa Catalina", "Meze ve ızgaralarda helal et kullandığını belirten restoran.", "Palma merkezinde geniş meze seçkisi ve farklı diyetlere uygun grup masası için.", "verification-recommended", "visitSpain")),
  guide("ES", "Ibiza", v("Wild Beets", "Vegan ve çiğ mutfak", "Santa Gertrudis", "Organik kaseler, yaratıcı ana yemekler ve tatlılar sunan bitki bazlı restoran.", "Gece hayatı dışında adanın wellness ve yerel ürün yüzünü görmek için.", "vegan-focused"), h("Shamarkanda", "Akdeniz ve dünya", "Sant Joan yolu", "Müslüman misafirler için ön talepte helal et seçeneği sorulabilen büyük bahçeli restoran.", "Adada sınırlı helal altyapıda rezervasyon öncesi yazılı teyit alınabilecek bir alternatif olduğu için.", "verification-recommended", "visitSpain", "Kalıcı helal sertifika bulunamadı; yalnızca yazılı ön teyit, ayrılmış hazırlık ve alkolsüz siparişle değerlendirin."), "Ibiza'da güncel, bağımsız sertifikalı restoran kanıtı sınırlı; öneri ön teyit gerektiriyor."),
  guide("ES", "Tenerife", v("BuenaVida 100% Vegan", "Vegan Kanarya ve dünya", "Puerto de la Cruz", "Kanarya ürünleri, burger ve tatlıları tamamen vegan hazırlayan restoran.", "Adanın kuzeyinde yerel ürünle doyurucu bir tam vegan menü bulmak için."), h("Al Amir", "Lübnan", "Costa Adeje", "Meze ve ızgaralarda helal et beyan eden Lübnan restoranı.", "Güney sahilinde ailece paylaşılabilen, sebze seçeneği güçlü bir akşam için.", "verification-recommended", "visitSpain")),
  guide("ES", "Gran Canaria", v("Bioloco", "Vegan comfort food", "Las Palmas / Vegueta", "Burger, tapas ve tatlıları tamamen vegan sunan hareketli restoran.", "Vegueta yürüyüşünü doyurucu, net etiketli bir bitki bazlı akşamla tamamlamak için."), h("El Sultán", "Lübnan ve Suriye", "Las Palmas", "Meze, shawarma ve ızgaralarda helal et beyan eden restoran.", "Başkentte ulaşımı kolay, hızlı ve paylaşmaya uygun bir helal öğün için.", "verification-recommended", "visitSpain")),

  // Türkiye — ülke geneline dair varsayım yapılmaz; sertifika bulunmayan işletmeler açıkça yeniden teyit statüsündedir.
  guide("TR", "İstanbul", v("Vegan İstanbul Kitchen", "Vegan Türk ev yemekleri", "Beyoğlu", "Mantı, dolma, günlük tencere yemeği ve tatlıları tamamen vegan hazırlayan küçük lokanta.", "Türk ev yemeklerini bitki bazlı ve samimi bir servisle denemek için.", "fully-vegan", "turkeyVegan"), h("Buhara Kebab House", "Türk ızgara", "Sultanahmet", "Kebap ve testi yemeklerinde helal et kullandığını açıkça belirten turistik merkez restoranı.", "Tarihî Yarımada rotasında helal beyanı bulunan kapsamlı bir menü için.", "restaurant-confirmed", "gimdes", "İşletme helal et beyan ediyor; GİMDES/TSE kapsamını, tedarikçiyi ve alkol politikasını doğrudan teyit edin.")),
  guide("TR", "Antalya", v("LEVEL Vegan & Gluten Free", "Vegan ve glütensiz dünya mutfağı", "Kaleiçi", "Kaseler, makarna, çorba ve tatlıları tamamen vegan ve glütensiz hazırlayan restoran.", "Kaleiçi'nde 2026 yorumlarıyla güncelliği görülen geniş menülü güvenli bir durak.", "fully-vegan", "turkeyVegan"), h("Hasan Antalya Restaurant", "Türk ızgara", "Muratpaşa", "Kebap, pide ve tencere yemekleri sunan merkezî aile restoranı.", "Yerel mutfağı geniş bir menüde denemek için güçlü aday; helal kapsamı önceden sorulmalı.", "verification-recommended", "gimdes")),
  guide("TR", "İzmir", v("Gibi Vegan", "Vegan Türk sokak yemeği", "Bostanlı", "Yüksek proteinli tabaklar, yerel sokak yemekleri ve tatlıları tamamen vegan sunan küçük restoran.", "2026 yorumlarıyla güncel, özenli ve Karşıyaka gününe kolay eklenen bir seçim.", "fully-vegan", "turkeyVegan"), h("Topçu Restoran", "İzmir köfte ve ızgara", "Alsancak", "İzmir köfte ve klasik ızgaralarıyla bilinen köklü restoran.", "Merkezde yerel bir et yemeği isteyenler için; helal tedarik belgesi görülmeden kesin kabul edilmemeli.", "verification-recommended", "gimdes")),
  guide("TR", "Muğla", v("The Stardust", "Vegan seçenekli kafe", "Akyaka", "Tofu şiş, kaseler ve vegan tatlı seçenekleri bulunan modern kafe.", "Akyaka'da tam vegan restoranın sınırlı olduğu sahnede birden fazla belirgin seçenek sunduğu için.", "vegan-options", "turkeyVegan"), h("Sultan Sofrası", "Muğla ev yemekleri", "Menteşe", "Tencere yemekleri, kebap ve zeytinyağlılar sunan yerel lokanta.", "Bölgesel mutfağı karışık bir seçkide denemek için; et tedariki mutlaka teyit edilmeli.", "verification-recommended", "gimdes")),
  guide("TR", "Bodrum", v("Nazik Ana", "Türk ev yemekleri", "Bodrum Çarşı", "Dolma, mercimek, fasulye ve ıspanaktan talep üzerine vegan karışık tabak hazırlayan lokanta.", "Çarşı içinde yerel zeytinyağlıları tek tabakta ve malzemeyi konuşarak denemek için.", "vegan-options", "turkeyVegan"), h("Kuytu Bahçe Bodrum", "Türk ve Akdeniz", "Bodrum merkez", "Izgara ve mezeleri bahçe ortamında sunan yerel restoran.", "Et yerine sade meze ve deniz ürünüyle planlanabilen bir aday; yine de helal uygunluğu teyitli değildir.", "verification-recommended", "gimdes", "Restoran için helal sertifika bulunamadı. Et tedariki, alkol, soslar ve ortak ızgarayı yazılı olarak teyit etmeden helal kabul etmeyin."), "Bodrum'da güncel bağımsız helal restoran sertifikası bulunamadı; kart ihtiyatlı yemek planlama adayıdır."),
  guide("TR", "Fethiye", v("Litea", "Vegan Türk ve Akdeniz", "Yeşilüzümlü", "Yerel ürünlerle günlük tabak, meze ve tatlı hazırlayan yüzde yüz vegan bahçe restoranı.", "Bölgenin ender tam vegan adresinde sürdürülebilir, ev yapımı bir öğün için.", "fully-vegan", "turkeyVegan"), h("Mozaik Bahçe", "Hatay mutfağı", "Fethiye merkezi", "Meze, kebap ve Hatay yemekleri sunan popüler aile restoranı.", "Baharatlı bölgesel mutfağı paylaşmalı tabaklarla denemek için; helal et tedariki yazılı teyit edilmeli.", "verification-recommended", "gimdes")),
  guide("TR", "Marmaris", v("Sünger Butik Cafe", "Vegan seçenekli kafe", "Tepe", "Falafel kasesi, porridge ve bitkisel sütlü kahve gibi belirgin vegan seçenekler sunan kafe.", "Haziran 2026 yorumu bulunan, merkezde kahvaltıdan akşama kullanılabilen bir seçenek olduğu için.", "vegan-options", "turkeyVegan"), h("Taj Mahal Marmaris", "Hint", "Siteler", "Köri, biryani ve tandoor sunan; helal et talebinin önceden sorulabildiği restoran.", "Sahil hattında baharatı ayarlanabilir, vejetaryen seçeneği de geniş bir grup yemeği için.", "verification-recommended", "gimdes")),
  guide("TR", "Kapadokya", v("Kaira", "Vegan seçenekli Kapadokya mutfağı", "Göreme", "Ayrı vegan menüsünde testi sebze, falafel, nohut dürüm ve makarna sunan mağara otel restoranı.", "Göreme'de yerel testi sunumunu vegan biçimde ve net bir ayrı menüyle denemek için.", "vegan-options", "turkeyVegan"), h("Pumpkin Göreme", "Anadolu mutfağı", "Göreme", "Günlük set menüler ve testi yemekleri sunan rezervasyonlu küçük restoran.", "Menü içeriğini önceden konuşmaya elverişli küçük servis yapısı nedeniyle; helal statüsü teyitsizdir.", "verification-recommended", "gimdes")),
  guide("TR", "Ankara", v("Vegan Taş Fırın", "Vegan Türk fırın yemekleri", "Kavaklıdere", "Pide, lahmacun, içli köfte ve pizzayı tamamen vegan hazırlayan restoran.", "2026 yorumlarıyla güncel, klasik taş fırın lezzetlerini bitki bazlı sunan özgün menüsü için.", "fully-vegan", "turkeyVegan"), h("Hacı Arif Bey", "Anadolu kebap", "Kavaklıdere", "Kebap, pide ve tencere yemekleriyle bilinen köklü restoran.", "Başkent merkezinde klasik bir kebap sofrası için; güncel helal belge görülmeden kesin etiketlenmemeli.", "verification-recommended", "gimdes")),
  guide("TR", "Bursa", v("Meze Bursa", "Vegan seçenekli Türk mutfağı", "Osmangazi", "Geleneksel zeytinyağlı ve vegan mezeleri bulunan yerel restoran.", "Tam vegan seçeneklerin az olduğu şehirde Bursa merkezine yakın doğal bitki bazlı tabaklar için.", "vegan-options", "turkeyVegan"), h("Kebapçı İskender", "Bursa İskender kebabı", "Heykel", "Bursa'nın imza yemeğini sunan tarihî marka restoranı.", "Özgün İskender deneyimi için; et ve tereyağı tedarikine dair güncel helal belge mutlaka sorulmalı.", "verification-recommended", "gimdes")),
  guide("TR", "Çanakkale", v("Bordo Bina", "Vejetaryen kafe", "Merkez", "Mercimek burger, pesto sandviç ve makarna gibi vegan seçenekleri olan bahçeli kafe.", "Şehir merkezinde sakin atmosfer ve birden fazla doyurucu vegan öğün sunduğu için.", "vegan-focused", "turkeyVegan"), h("Yalova Restaurant", "Balık ve deniz ürünleri", "Kordon", "Balık ve zeytinyağlılarıyla bilinen köklü sahil restoranı.", "Et yerine sade deniz ürünü seçilebilen bir aday; alkol ve hazırlama süreci nedeniyle ön teyit şart.", "verification-recommended", "gimdes", "Helal sertifika bulunamadı ve alkol servis edilebilir. Balığın sosunu, kızartma yağını ve ortak mutfağı açıkça sorun.")),
  guide("TR", "Trabzon", v("Viya Kitap Kafe Yemek", "Vegan seçenekli kafe", "Ortahisar", "Falafel dürüm, sebzeli dürüm ve veganlaştırılabilen makarnalar sunan kitap kafe.", "Vegan kavramını bilen personeli ve merkezî konumuyla Trabzon'daki sınırlı seçenekler içinde öne çıktığı için.", "vegan-options", "turkeyVegan"), h("Tarihi Kalkanoğlu Pilavcısı", "Karadeniz pilavı", "Ortahisar", "Kavurma, pilav ve hoşaf sunan tarihî esnaf lokantası.", "Şehrin özgün esnaf yemeği deneyimi için; etin helal tedarik belgesi ziyaret öncesi teyit edilmeli.", "verification-recommended", "gimdes")),
  guide("TR", "Mardin", v("JB Vegan", "Vegan fast casual", "Artuklu", "Falafel, burger ve karışık tabakları tamamen vegan sunan küçük işletme.", "Mardin'deki çok sınırlı tam vegan seçenekler arasında açık ürün kapsamı sunduğu için; saatini önceden sorun.", "fully-vegan", "turkeyVegan"), h("Cercis Murat Konağı", "Mardin ve Süryani", "Eski Mardin", "Yöresel Mardin yemeklerini tarihî konakta sunan restoran.", "Yerel mutfağın geniş bir panoraması için; alkol ve et tedariki nedeniyle helal varsayılmamalı.", "verification-recommended", "gimdes", "Alkol servisi ve şarapla pişen yemekler olabilir; güncel helal et belgesi, her yemeğin içeriği ve ortak mutfak yazılı teyit edilmelidir.")),
  guide("TR", "Gaziantep", v("Eşter", "Suriye ve Levant", "Şehitkamil", "Falafel, humus ve sebze yemeklerinden oluşan belirgin vegan seçenekler sunan Suriye restoranı.", "Et ağırlıklı şehir mutfağında bakliyat temelli, baharatlı ve doyurucu bir alternatif için.", "vegan-options", "turkeyVegan"), h("İmam Çağdaş", "Gaziantep kebap ve baklava", "Şahinbey", "Kebap ve baklavasıyla bilinen tarihî şehir lokantası.", "Gaziantep'in imza yemeklerini tek adreste denemek için; sertifika ve tedarik teyidi gerekir.", "verification-recommended", "gimdes")),
  guide("TR", "Şanlıurfa", v("Lolaz Dürümçü", "Vejetaryen bakliyat dürümü", "Eyyübiye", "Fasulye ve sebze temelli yöresel lolaz dürümü hazırlayan vejetaryen küçük dükkân.", "Urfa'da nadir, yerel ve doğal olarak bitki bazlı sokak öğünlerinden birini denemek için.", "vegan-focused", "turkeyVegan"), h("Çulcuoğlu Baklava Restaurant", "Urfa kebap", "Haliliye", "Kebap, patlıcan kebabı ve yöresel tatlılar sunan geniş restoran.", "Aile ve grup masasına uygun Urfa seçkisi için; etin helal kaynağı belgeyle doğrulanmalı.", "verification-recommended", "gimdes")),
  guide("TR", "Eskişehir", v("OMM INN", "Vegan Akdeniz ve füzyon", "Odunpazarı", "Kahvaltıdan pizzaya ve tatlıya uzanan tamamen vegan menüyü müze yanında sunan restoran.", "Odunpazarı gezi rotasında tasarım, sanat ve kapsamlı vegan mutfağı bir araya getirdiği için.", "fully-vegan", "turkeyVegan"), h("Abdüsselam Balaban Kebap", "Eskişehir balaban kebabı", "Merkez", "Şehrin balaban kebabı geleneğini sunan köklü lokanta.", "Yerel imza yemeğini denemek için; et tedariki ve tereyağına dair güncel helal belge sorulmalı.", "verification-recommended", "gimdes")),
  guide("TR", "Konya", v("Burgercin", "Vegan seçenekli fast food", "Otogar çevresi", "Menüsünde vegan burger seçeneği bulunan gündelik sokak yemeği noktası.", "Tam vegan restoranın çok sınırlı olduğu Konya'da açıkça sipariş edilebilen doyurucu bir seçenek için.", "vegan-options", "turkeyVegan"), h("Somatçı Fihi Ma Fih", "Selçuklu ve Mevlevi mutfağı", "Meram", "Tarihî tarifleri set düzeninde sunan, rezervasyonlu küçük restoran.", "Konya mutfak mirasını anlatı eşliğinde denemek için; her menünün helal uygunluğu ayrıca teyit edilmeli.", "verification-recommended", "gimdes")),
  guide("TR", "Kaş", v("Refresh Vegan Kitchen", "Vegan füzyon", "Kaş merkez", "Vegan döner, falafel, kimbap ve kaseleri tamamen bitki bazlı sunan küçük avlu restoranı.", "Kaş merkezde açık, çeşitli ve tam vegan bir menüyle akşam yemeği için.", "fully-vegan", "turkeyVegan"), h("Zaika Ocakbaşı", "Türk ızgara", "Kaş merkez", "Ocakbaşı ızgaraları ve mezeleriyle bilinen merkezî restoran.", "Klasik ızgara deneyimi için; turistik bölgede helal varsayımı yapmadan tedarik belgesi sorulmalı.", "verification-recommended", "gimdes")),
  guide("TR", "Alanya", v("Cozy Alanya", "Vegan seçenekli Türk ve dünya", "Damlataş", "Ayrı vegan menüsünde kebap, lazanya, burger ve bitkisel tatlılar sunan restoran.", "Mayıs 2026 yorumlarıyla etkinliği ve ayrı hazırlama talebine yaklaşımı görülen kapsamlı seçenek olduğu için.", "vegan-options", "turkeyVegan"), h("Mezze Grill Ocakbaşı", "Türk ızgara", "Alanya merkez", "Kebap, pide ve mezeler sunan popüler ocakbaşı.", "Merkezde geniş bir yerel menü için; helal et tedarikçisi ve alkol politikası önceden teyit edilmeli.", "verification-recommended", "gimdes")),

  // Birleşik Krallık
  guide("GB", "Londra", v("Mildreds Soho", "Vegan dünya mutfağı", "Soho", "Britanya comfort food'dan köri ve burgerlere uzanan tamamen vegan menülü köklü restoran.", "West End planında karışık gruplara hitap eden geniş ve güvenilir bir bitki bazlı menü için."), h("Berenjak Borough", "İran", "Borough Market", "Kebap ve küçük İran tabaklarında helal et seçenekleri sunan yoğun restoran.", "Borough Market çevresinde rafine ama rahat bir İran sofrası için.", "halal-options", "visitLondon", "Bazı etler helal olabilir; alkol servis edilir. Hangi etlerin güncel olarak helal olduğunu ve ortak ızgarayı rezervasyonda sorun.")),
  guide("GB", "Edinburgh", v("Sora Lella", "Vegan İtalyan", "Tollcross", "Roma usulü makarna, pizza ve tatlıları tamamen vegan hazırlayan küçük trattoria.", "Edinburgh'da sıcak, samimi ve klasik İtalyan lezzetlerine odaklı bir akşam için."), h("Dishoom Edinburgh", "Bombay-İran kafe", "St Andrew Square", "Menüsünde helal kuzu ve tavuk bilgisi şubeden teyit edilebilen popüler restoran.", "Merkezde kahvaltıdan geceye uzanan servis ve paylaşmalı tabaklar için.", "halal-options", "halalBritain", "Alkol ve helal olmayan ürünler aynı tesiste bulunabilir; güncel helal et listesini ve çapraz temas riskini şubeden sorun.")),
  guide("GB", "Manchester", v("Wholesome Junkies", "Vegan comfort food", "Northern Quarter", "Burger, kanat ve yüklü patatesleri tamamen vegan hazırlayan enerjik restoran.", "Manchester'ın yaratıcı mahalle ritmine uyan, doyurucu ve eğlenceli bir bitki bazlı öğün için."), h("Etci Mehmet", "Türk steakhouse", "City Centre", "Helal et kullandığını belirten, steak ve ocakbaşı yemeklerine odaklı restoran.", "Özel gün veya kalabalık grup için et odaklı geniş menü ve gösterişli servis arayanlara.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Liverpool", v("The Vibe", "Vegan brunch ve dünya", "Ropewalks", "Kahvaltı, kaseler, burger ve tatlıları tamamen vegan sunan renkli kafe.", "Merkezde güne güçlü başlamak ya da müzeler arasında rahat bir öğle yemeği için."), h("Fozia's Kashmiri Restaurant", "Keşmir ve Pakistan", "Kensington", "Ev tipi köri, karahi ve ızgaraları helal beyanıyla sunan aile işletmesi.", "Turistik merkezin dışında, karakterli ve paylaşmalı bir yerel topluluk yemeği için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Oxford", v("Green Routes Cafe", "Vegan brunch", "East Oxford", "Kahvaltı tabakları, sandviç ve tatlıları tamamen vegan sunan mahalle kafesi.", "Kolej merkezinin kalabalığından çıkıp güçlü kahveyle sakin bir bitki bazlı brunch yapmak için."), h("Antep Kitchen", "Türk", "Cowley Road", "Ocakbaşı, pide ve mezeleri helal et beyanıyla sunan canlı restoran.", "Oxford'un çok kültürlü Cowley Road hattında geniş, paylaşmaya uygun bir menü için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Cambridge", v("Thrive", "Vegan kafe", "Norfolk Street", "Günlük tabak, burger ve tatlıları tamamen vegan sunan topluluk odaklı kafe.", "Şehir merkezine yakın, çalışma veya uzun öğle molasına uygun sakin bir seçenek için."), h("Bedouin", "Kuzey Afrika", "Mill Road", "Tajin, kuskus ve ızgaralarda helal et beyan eden atmosferik restoran.", "Cambridge'in bağımsız yemek hattında baharatlı ve paylaşmalı bir akşam için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Bath", v("OAK", "Vejetaryen mevsimsel", "North Parade", "Sebze odaklı küçük tabaklarda güçlü vegan seçenekler sunan zarif restoran.", "Bath'in tarihî merkezinde ürün kalitesi yüksek, uzun bir öğle yemeği için.", "vegan-focused"), h("Bandook", "Hint", "Milsom Place", "Modern Hint küçük tabaklarında helal et seçenekleri sorulabilen restoran.", "Merkezde çağdaş servis ve paylaşmalı menü arayanlar için.", "halal-options", "halalBritain", "Menünün tamamı helal varsayılmamalı; etleri, alkolü ve ortak mutfağı rezervasyonda teyit edin.")),
  guide("GB", "York", v("El Piano", "Vegan dünya mutfağı", "Grape Lane", "Bakliyat, tahıl ve sebze tabaklarını tamamen vegan ve glütensiz odakla sunan köklü restoran.", "Minster çevresinde doyurucu, sade ve farklı alerjenleri iyi anlatan bir öğün için."), h("Middle Feast", "Orta Doğu", "Coney Street", "Shawarma, falafel ve ızgaraları helal beyanıyla sunan hızlı servis restoranı.", "Tarihî merkezde hızlı, bütçe dostu ve açık menülü bir öğün için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Glasgow", v("Stereo", "Vegan pub ve füzyon", "City Centre", "Tapas, burger ve günlük yemekleri tamamen vegan sunan müzik mekânı-restoran.", "Glasgow'un bağımsız müzik kültürünü doyurucu bir bitki bazlı akşamla birleştirmek için."), h("Turkiye EFES", "Türk", "Merchant City", "Kebap, pide ve mezelerde helal et beyan eden merkezî restoran.", "Merchant City akşamında paylaşmalı mezeler ve ocakbaşı için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Belfast", v("Jumon", "Vegan Asya", "Fountain Street", "Köri, noodle ve küçük tabakları tamamen vejetaryen; menünün çoğunu vegan sunan restoran.", "Şehir merkezinde baharatlı, paylaşmalı ve yaratıcı bir akşam yemeği için.", "vegan-focused"), h("Nora's Palace", "Orta Doğu", "City Centre", "Izgara, shawarma ve mezeleri helal et beyanıyla sunan restoran.", "Belfast merkezinde hızlı ve ailece paylaşmaya uygun bir sıcak yemek için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Brighton", v("Bonsai Plant Kitchen", "Vegan Güneydoğu Asya", "Brighton merkez", "Küçük tabak ve wok yemeklerini tamamen vegan, yoğun Asya aromalarıyla hazırlayan restoran.", "Brighton'ın yaratıcı yemek sahnesinde özel ve paylaşmalı bir akşam için."), h("Lavash", "Türk ve Orta Doğu", "North Laine", "Dürüm, ızgara ve mezelerde helal et beyan eden hızlı servis restoranı.", "İstasyon-sahil hattında pratik ve açık bir menü için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Bristol", v("Koocha Mezze Bar", "Vegan İran ve Orta Doğu", "Stokes Croft", "Meze, kebap ve tatlıları tamamen vegan sunan renkli bar-restoran.", "Kalabalık bir masada paylaşmaya uygun, güçlü baharatlı tabaklar için."), h("Urban Tandoor", "Hint", "Old City", "Köri ve tandoor yemeklerinde helal et beyan eden popüler restoran.", "Eski şehir akşamında geniş seçenek ve baharat seviyesi kontrolü için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "Cardiff", v("Luna's Vegan Corner", "Vegan Akdeniz", "Roath", "Burger, makarna ve Akdeniz tabaklarını tamamen vegan hazırlayan mahalle restoranı.", "Merkez dışında samimi servis ve geniş porsiyonlu bir bitki bazlı akşam için."), h("Shaam Nights", "Suriye", "City Road", "Izgara, pilav ve mezeleri helal beyanıyla sunan süslü salon restoranı.", "Cardiff'in çok kültürlü City Road hattında aile ve grup yemeği için.", "restaurant-confirmed", "halalBritain")),
  guide("GB", "İskoçya Highlands", v("The Wildcat", "Vegan kafe", "Fort William", "Kahvaltı, çorba, sandviç ve tatlıları tamamen vegan sunan sosyal girişim kafe.", "Highlands rotasının ana ulaşım düğümünde güvenilir ve sıcak bir bitki bazlı mola için."), h("Dunalastair Hotel Suites", "İskoç ve uluslararası", "Kinloch Rannoch", "Ön talepte helal yemek hazırlayabildiği bildirilen uzak bölge otel restoranı.", "Highlands'da bağımsız helal restoran çok azken önceden planlanabilen bir seçenek olması nedeniyle.", "verification-recommended", "halalBritain", "En az 48 saat önce yazılı teyit alın; tedarikçi, ayrı hazırlama, sos ve alkolü sorun. Walk-in helal menü varsaymayın."), "Highlands'da helal restoran altyapısı çok sınırlı; öneri yalnızca önceden yazılı teyitle kullanılmalı."),
  guide("GB", "Cotswolds", v("The Organic Farm Shop Café", "Organik çiftlik mutfağı", "Cirencester", "Çiftlik ürünleriyle hazırlanan menüde belirgin vegan kahvaltı ve öğle seçenekleri sunan kafe.", "Kırsal rotada yerel ürün, iyi malzeme şeffaflığı ve birden fazla bitki bazlı seçenek için.", "vegan-options"), h("Koloshi", "Hint", "Charlton Kings", "Köri ve tandoor yemeklerinde helal et seçeneği önceden sorulabilen restoran.", "Cotswolds'un doğu ucunda sınırlı helal sahne için planlanabilir bir akşam alternatifi.", "verification-recommended", "halalBritain", "Menünün tamamı için sertifika kanıtı bulunamadı; helal et, ortak mutfak ve alkolü yazılı teyit edin."), "Cotswolds'da bağımsız sertifikalı seçenek kanıtı sınırlı; ön teyit gerekiyor."),
  guide("GB", "Lake District", v("Fellini's", "Vejetaryen Akdeniz", "Ambleside", "Vejetaryen menüsünde çok sayıda açık vegan makarna, köri ve tatlı sunan restoran.", "Göl yürüyüşü sonrası tam bir akşam yemeği ve farklı diyetlere uygun geniş seçenek için.", "vegan-focused"), h("Jaan Indian Restaurant", "Hint ve Pakistan", "Windermere", "Köri, biryani ve tandoor yemeklerinde helal et sunduğu bildirilen restoran.", "Lake District'te helal seçeneğin en sınırlı olduğu bölgelerden birinde merkezî alternatif olduğu için.", "restaurant-confirmed", "halalBritain", "2026 uzman rehberi helal yemek sunduğunu aktarıyor; sertifikayı, hangi etlerin helal olduğunu ve alkolü restoranla teyit edin.")),

  // Svalbard — sertifikalı helal restoran bulunmadığı ve Ny-Ålesund'da halka açık restoran olmadığı açıkça belirtilir.
  guide("SJ", "Longyearbyen", v("Fruene", "Kafe ve pastane", "Lompensenteret", "Resmî açıklamasında yumurta, et ve süt ürünü içermeyen yiyecek ve kek seçenekleri sunduğunu belirten merkezî kafe.", "Longyearbyen'in sınırlı sahnesinde işletmenin kendi sayfasından doğrulanabilen vegan seçenekler sunduğu için.", "vegan-options", "fruene"), h("Restaurant Polfareren", "Nordik ve uluslararası", "Svalbard Hotell", "Balık ve önceden konuşulabilen bitki bazlı tabaklarla plan yapılabilecek otel restoranı.", "Adada sertifikalı helal restoran bulunmadığı için yalnızca içerikleri önceden yazılı teyit edilebilecek bir yemek planlama alternatifi olarak.", "verification-recommended", "halalSvalbard", "Helal sertifikası veya helal et doğrulaması bulunamadı; alkol servis edilir. Yalnızca sade balık ya da vegan içerikleri, sosları ve ortak mutfağı yazılı teyit ederek değerlendirin."), "Longyearbyen'de doğrulanmış helal restoran bulunamadı; katı helal gereksiniminde sertifikalı paketli gıda getirmek ve öz hazırlık yapmak en güvenli plandır."),
  guide("SJ", "Ny-Ålesund", v("Kings Bay Service Building Mess", "Araştırma istasyonu yemekhanesi", "Servicebygget", "Yerleşimde kalan araştırmacı ve kayıtlı ziyaretçilere sabit saatlerde toplu öğün sunan tek yemek hizmeti.", "Halka açık restoran bulunmayan Ny-Ålesund'da vegan gereksinimi ancak konaklama kaydı sırasında mutfakla önceden planlanabildiği için.", "vegan-options", "kingsBay"), h("Kongsfjordbutikken", "Kiosk ve öz hazırlık", "Ny-Ålesund merkezi", "Kısıtlı atıştırmalık ve temel ürün sunan yerleşim dükkânı; restoran veya helal satış noktası değildir.", "Helal yemek hizmeti bulunmadığında yalnızca etiketli paketli ürünleri kontrol ederek yedek plan yapılabilecek tek perakende noktası olduğu için.", "verification-recommended", "kingsBay", "Helal sertifikalı restoran ya da ürün garantisi yoktur. Erişim ve stok sınırlıdır; Longyearbyen'den sertifikalı paketli gıda getirin ve Kings Bay ile önceden yazılı plan yapın."), "Ny-Ålesund'da halka açık restoran yoktur. Yemekhane kayıtlı araştırmacı ve konaklayan ziyaretçilere hizmet verir; vegan veya helal gereksinimi rezervasyondan önce Kings Bay ile planlanmalıdır.")
];
