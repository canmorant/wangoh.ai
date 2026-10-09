/** Native Vietnamese destination copy. Replaces only VN; preserves other destinations. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {country as c} from './country.mjs';
import hanoi from './hanoi.mjs';
import hue from './hue.mjs';
import daNang from './da-nang.mjs';
import hoiAn from './hoi-an.mjs';
import hcm from './ho-chi-minh-city.mjs';
import canTho from './can-tho.mjs';
import {l} from './shared.mjs';
import {dietaryPicks} from './dietary.mjs';
import {mapsSection} from './maps.mjs';
import {connections,connectionSources} from './connections.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const read=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const write=(p,data)=>writeFileSync(resolve(root,p),JSON.stringify(data,null,p.includes('/tm/')?1:2)+'\n');
const cities=[hanoi,hue,daNang,hoiAn,hcm,canTho];
for(const city of cities){city.sections.push(mapsSection(city.key));city.sections.push(connections[city.key]);city.sources.push(...(connectionSources[city.key]??[]));}
hanoi.sources.push({name:l('Türk Hava Yolları — Vietnam uçuş bilgileri','Turkish Airlines — Vietnam flight information','Turkish Airlines — información de vuelos a Vietnam'),url:'https://www.turkishairlines.com/uk-int/flights/country/vietnam/'});
daNang.sources.push({name:l('Sun World — Ba Na Hills ve Golden Bridge','Sun World — Ba Na Hills and Golden Bridge','Sun World — Ba Na Hills y Golden Bridge'),url:'https://sunworld.vn/en/banahills'});
const memory=Object.fromEntries(['en','es'].map(locale=>[locale,read(`src/content/i18n/tm/${locale}.json`)]));
const existing=Object.fromEntries(Object.entries(memory).map(([locale,groups])=>[locale,Object.assign({},...Object.entries(groups).filter(([key])=>key!=='vietnam2026').map(([,values])=>values))]));
const additions={en:{},es:{}};
function key(s){
 let a=0xdeadbeef,b=0x41c6ce57;
 for(let i=0;i<s.length;i++){const x=s.charCodeAt(i);a=Math.imul(a^x,2654435761);b=Math.imul(b^x,1597334677);}
 a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);
 b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);
 return (4294967296*(2097151&b)+(a>>>0)).toString(36);
}
function t(row){
 if(!Array.isArray(row)||row.length!==3||row.some(x=>typeof x!=='string'||!x.trim()))throw Error(`Invalid native row: ${JSON.stringify(row)}`);
 if(/\p{L}/u.test(row[0])&&!/^https?:\/\//.test(row[0]))for(const [i,locale] of ['en','es'].entries()){
  const hash=key(row[0]);if(existing[locale][hash]!==undefined)continue;
  if(additions[locale][hash]!==undefined&&additions[locale][hash]!==row[i+1])throw Error(`Conflicting native ${locale}: ${row[0]}`);
  additions[locale][hash]=row[i+1];
 }
 return row[0];
}
const hub={seoTitle:t(c.title),seoDescription:t(c.meta),planningHeading:t(c.planning),essentialsHeading:t(c.essentialsHeading),citiesHeading:t(c.citiesHeading),cityGridIntro:t(c.grid),intro:c.intro.map(t),essentials:c.essentials.map(([title,body])=>({title:t(title),body:t(body)})),routeIdeas:c.routes.map(r=>({title:t(r.title),duration:t(r.duration),cities:r.cities,description:t(r.description)}))};
const destination={name:c.name[0],code:c.code,flag:c.flag,description:t(c.description),image:c.image,coordinates:c.coordinates,iata:c.iata,gateway:t(c.gateway),capital:t(c.capital),flightTime:c.flightTime,accent:c.accent,budget:c.budget,bestSeason:'Bölgeye göre',signature:t(c.signature),cities:cities.map(x=>({name:t(x.name),description:t(x.card),image:`/images/vietnam-${x.key}.avif`}))};
const headings=city=>l(`${city.name[0]} gezilecek yerler`, `Things to do in ${city.name[1]}`, `Qué ver en ${city.name[2]}`);
const categories={
 hanoi:[l('Göl ve tapınak çevresi','Lake and temple surroundings','Lago y entorno del templo'),l('Eğitim mirası ve avlular','Educational heritage and courtyards','Patrimonio educativo y patios'),l('İmparatorluk ve arkeoloji','Imperial heritage and archaeology','Patrimonio imperial y arqueología')],
 hue:[l('Saraylar ve avlular','Palaces and courtyards','Palacios y patios'),l('Hanedan mezarları ve bahçeler','Royal tombs and gardens','Tumbas reales y jardines'),l('Pagoda ve nehir manzarası','Pagoda and river views','Pagoda y vistas del río')],
 'da-nang':[l('Şehir kıyısı ve sahil yürüyüşü','Urban beach and coastal walks','Playa urbana y paseos costeros'),l('Cham sanatı ve heykel','Cham art and sculpture','Arte y escultura cham'),l('Kayalık tepeler ve tapınaklar','Rocky hills and temples','Colinas rocosas y templos')],
 'hoi-an':[l('Eski liman sokakları ve köprü','Old port streets and bridge','Calles del antiguo puerto y puente'),l('Sebze bahçeleri ve kırsal yaşam','Vegetable gardens and rural life','Huertos y vida rural'),l('Sahil ve dinlenme','Beach and downtime','Playa y descanso')],
 'ho-chi-minh-city':[l('Tarih ve tanıklıklar','History and testimonies','Historia y testimonios'),l('Saray ve yakın tarih','Palace and recent history','Palacio e historia reciente'),l('Postane ve merkez sokakları','Post office and central streets','Correos y calles del centro')],
 'can-tho':[l('Nehirde ticaret ve sabah yaşamı','River trade and morning life','Comercio fluvial y vida matinal'),l('Nehir kıyısında şehir akşamı','An urban evening by the river','Atardecer urbano junto al río'),l('Tarihî ev ve aile yaşamı','Historic house and family life','Casa histórica y vida familiar')],
};
hoiAn.sources.push({name:l('Hoi An miras merkezi — tarihî yapılar','Hoi An heritage centre — monuments','Centro de patrimonio de Hoi An — monumentos'),url:'https://www.hoianworldheritage.org.vn/en/news/Monument.hwh'});
canTho.sources.push({name:l('Can Tho turizmi — Ong Tapınağı','Can Tho Tourism — Ong Temple','Turismo de Can Tho — Templo Ong'),url:'https://canthotourism.vn/en/chuaong'},{name:l('Can Tho turizmi — Munir Ansay','Can Tho Tourism — Munir Ansay','Turismo de Can Tho — Munir Ansay'),url:'https://canthotourism.vn/en/chuamuniransay'});
const guides=cities.map(city=>{
 const sections=city.sections.map(s=>({id:s.id,heading:t(s.heading),body:s.body.map(t)}));
 sections.splice(2,0,{id:'gezilecek-yerler',heading:t(headings(city)),body:[t(city.card)],subsections:city.sights.map(s=>({heading:t(s.name),body:[t(s.body)]}))});
 return {city:city.name[0],countryCode:'VN',seoTitle:t(city.title),seoDescription:t(city.meta),h1:t(city.title),lede:t(city.lede),quickFacts:[l('Önerilen süre','Suggested stay','Estancia recomendada'),l('En uygun dönem','Best time to visit','Mejor época'),l('Ulaşım yaklaşımı','Getting around','Cómo moverse')].map((label,i)=>({label:t(label),value:t(city.facts[i])})),sections,placesKind:'sights',places:city.sights.map((s,i)=>({name:t(s.name),area:t(s.area),known:t(categories[city.key][i]),why:t(s.why),tip:t(s.tip)})),itinerary:city.itinerary.map(day=>Object.fromEntries(Object.entries(day).map(([k,value])=>[k,t(value)]))),faqs:city.faqs.map(f=>({q:t(f.q),a:t(f.a)})),relatedGuides:cities.filter(x=>x!==city).map(x=>({city:x.name[0],anchor:t(x.title),description:t(x.card)})),sources:city.sources.map(s=>({name:t(s.name),url:s.url})),volatileNote:t(l('Bilet ücretleri, seferler ve ziyaret saatleri değişebilir. Rezervasyon öncesinde aşağıdaki resmî kaynaklardan güncel bilgiyi kontrol edin.','Admission prices, services and opening hours can change. Check the official sources below before booking.','Los precios, los servicios y los horarios pueden cambiar. Consulta las fuentes oficiales indicadas antes de reservar.')),reviewed:'2026-10-08',countryInfoOnHub:true};
});
const dietaryNotes=[
 l('Hanoi’de sebzeli görünen çorbanın et suyu, sosun balık ürünü içerebileceğini sorun. Yumurta kahvesi ve yoğunlaştırılmış süt vegan değildir. Chay ifadesini başlangıç kabul edip yumurta, süt ve sosları ayrı netleştirin. Helal uygunluğu için işletmenin güncel doğrulamasını isteyin.','In Hanoi, ask whether vegetable soups use meat stock and sauces contain fish products. Egg coffee and condensed milk are not vegan. Treat chay as a starting point, then clarify eggs, dairy and sauces. For halal suitability, request current verification from the business.','En Hanói, pregunta por caldo de carne y productos de pescado en sopas y salsas. Café con huevo y leche condensada no son veganos. Chay es un punto de partida: confirma huevo, lácteos y salsas. Para halal, pide verificación actual al local.'),
 l('Hue’nin küçük tabaklarında karides, et suyu ve fermente soslar bulunabilir. Sunumdan içerik çıkarmak yerine her tabağı ayrı sorun. Vegan tercihte yumurta ve sütü de belirtin; helal et veya hazırlama koşulu için güncel işletme doğrulaması alın.','Hue’s small dishes may contain shrimp, meat stock or fermented sauces. Ask about each dish rather than inferring ingredients from presentation. Specify eggs and dairy when requesting vegan food; check current business verification for halal meat and preparation.','Los pequeños platos de Hue pueden llevar camarón, caldo de carne o salsas fermentadas. Pregunta por cada plato. Para opciones veganas, especifica huevo y lácteos; comprueba verificación actual de carne y preparación halal.'),
 l('Da Nang’da mi Quang veya banh xeo adı tek başına içerik garantisi değildir; et, karides, yumurta ve sosu sorun. Sebze eşlikçileri ana yemeği vegan yapmaz. Helal uygunluk için kullanılan et ve hazırlama sürecini işletmenin güncel belgesiyle doğrulayın.','In Da Nang, the names mi Quang and banh xeo do not guarantee ingredients: check meat, shrimp, eggs and sauces. Vegetable accompaniments do not make a dish vegan. Confirm halal meat and preparation through the business’s current documentation.','En Da Nang, mi Quang y banh xeo no garantizan ingredientes: comprueba carne, camarón, huevo y salsas. Acompañamientos vegetales no hacen vegano el plato. Verifica carne y preparación halal con documentación actual del local.'),
 l('Hoi An’da cao lau ve beyaz gül mantısını et veya deniz ürünü açısından sorun; yalnız hamur ve yeşillik görünmesi yeterli değildir. Chay seçeneklerinde sos, yumurta ve sütü netleştirin. Helal uygunluk için güncel belge ve hazırlama koşullarını ayrıca doğrulayın.','In Hoi An, check cao lau and white rose dumplings for meat and seafood; dough and greens alone do not establish suitability. Clarify sauces, eggs and dairy in chay options. Verify current halal documentation and preparation arrangements separately.','En Hoi An, comprueba carne y marisco en cao lau y dumplings de rosa blanca. Masa y verduras no bastan. Aclara salsas, huevo y lácteos en opciones chay. Verifica por separado documentación y preparación halal.'),
 l('Ho Chi Minh City’de banh mi için ezme, et, yumurta ve sosu; çorbada kullanılan suyu ayrı sorun. Chay menülerinde yumurta ve süt bulunup bulunmadığını belirtin. Helal uygunluğu yalnız yemek adından çıkarmayın; işletmenin güncel doğrulamasına bakın.','In Ho Chi Minh City, ask separately about pâté, meat, eggs and sauces in banh mi and the stock used in soups. Clarify eggs and dairy on chay menus. Do not infer halal suitability from a dish name; check the business’s current verification.','En Ciudad Ho Chi Minh, pregunta por paté, carne, huevo y salsas del banh mi y caldo de las sopas. Aclara huevo y lácteos en menús chay. No deduzcas halal del nombre: consulta verificación actual del local.'),
 l('Can Tho’da hu tieu ve tekne kahvaltısının et suyu, et, deniz ürünü ve sos içeriğini önceden sorun. Vegan veya helal ihtiyacınızı tur rezervasyonunda belirtip hangi yemeğin sağlanacağını yazılı netleştirin; her teknenin aynı menüyü sunacağını varsaymayın.','In Can Tho, check the stock, meat, seafood and sauces in hu tieu and boat breakfasts beforehand. State vegan or halal needs when booking and confirm the actual meal in writing; boats do not all provide the same menu.','En Can Tho, consulta antes caldo, carne, marisco y salsas en hu tieu y desayunos a bordo. Indica necesidades veganas o halal al reservar y confirma comida por escrito: los barcos no ofrecen todos el mismo menú.'),
];
const translatedPick=pick=>({...pick,cuisine:t(pick.cuisine),area:t(pick.area),description:t(pick.description),why:t(pick.why),verification:{...pick.verification,sourceName:t(l(pick.verification.sourceName,pick.verification.sourceName,pick.verification.sourceName)),note:t(pick.verification.note)}});
dietaryNotes[5]=l(dietaryNotes[5][0]+' Can Tho için açık ve yeterince doğrulanmış bir helal restoran önerisi bulunamadı. Eski kaynaklardaki Lion City, 8 Ekim 2026 Google Maps kontrolünde kalıcı olarak kapalı göründüğü için listeye alınmadı.',dietaryNotes[5][1]+' No sufficiently verified open halal restaurant was found for a recommendation in Can Tho. Lion City, mentioned in older sources, was marked permanently closed on Google Maps when checked on 8 October 2026 and was excluded.',dietaryNotes[5][2]+' No se encontró un restaurante halal abierto y suficientemente verificado para recomendar en Can Tho. Lion City, citado en fuentes antiguas, figuraba como cerrado permanentemente en Google Maps el 8 de octubre de 2026 y se excluyó.');
const dietary=cities.map((city,i)=>({countryCode:'VN',city:city.name[0],vegan:dietaryPicks.filter(p=>p.city===city.name[0]&&p.category==='vegan').map(translatedPick),halal:dietaryPicks.filter(p=>p.city===city.name[0]&&p.category==='halal').map(translatedPick),researchNote:t(dietaryNotes[i])}));
const replace=(path,items,field)=>write(path,[...read(path).filter(x=>x[field]!=='VN'),...items]);
replace('src/data/addedDestinations.json',[destination],'code');
replace('src/content/guides/addedDestinations.json',guides,'countryCode');
replace('src/content/dietary/addedDestinations.json',dietary,'countryCode');
write('src/content/addedCountryHubs.json',{...read('src/content/addedCountryHubs.json'),VN:hub});
const seo=read('src/content/addedSeo.json');
for(const [i,locale] of ['en','es'].entries()){
 seo.hubs[locale].VN=[c.title[i+1],c.meta[i+1]];
 for(const city of cities)seo.guides[locale][`VN:${city.name[0]}`]=[city.title[i+1],city.meta[i+1]];
 memory[locale].vietnam2026=additions[locale];write(`src/content/i18n/tm/${locale}.json`,memory[locale]);
}
write('src/content/addedSeo.json',seo);

// Reviewable manuscripts, including the same native prose used on the site.
mkdirSync(resolve(root,'docs/vietnam-2026'),{recursive:true});
for(const [i,locale] of ['tr','en','es'].entries()){
 const out=[`# ${c.title[i]}`,...c.intro.map(row=>row[i]),`## ${c.essentialsHeading[i]}`,...c.essentials.flatMap(([title,body])=>[`### ${title[i]}`,body[i]]),`## ${c.planning[i]}`,...c.routes.flatMap(r=>[`### ${r.title[i]} — ${r.duration[i]}`,r.description[i]])];
 for(const city of cities){
  out.push(`\n---\n\n# ${city.title[i]}`,city.lede[i]);
  for(const [n,section] of city.sections.entries()){
   out.push(`## ${section.heading[i]}`,...section.body.map(row=>row[i]));
   if(n===1)out.push(`## ${headings(city)[i]}`,...city.sights.flatMap(s=>[`### ${s.name[i]}`,s.body[i],`${s.why[i]} ${s.tip[i]}`]));
  }
  out.push(`## ${['Gün gün rota','Day-by-day itinerary','Ruta día a día'][i]}`,...city.itinerary.flatMap(day=>[`### ${day.title[i]}`,`${day.morning[i]} → ${day.afternoon[i]} → ${day.evening[i]}`]),`## ${['Sık sorulan sorular','Frequently asked questions','Preguntas frecuentes'][i]}`,...city.faqs.flatMap(f=>[`### ${f.q[i]}`,f.a[i]]),`## ${['Beslenme notu','Dietary note','Nota alimentaria'][i]}`,dietaryNotes[cities.indexOf(city)][i],`## ${['Doğrulama kaynakları','Verification sources','Fuentes de verificación'][i]}`,...city.sources.map(s=>`- [${s.name[i]}](${s.url})`));
 }
 writeFileSync(resolve(root,`docs/vietnam-2026/${locale}.md`),out.join('\n\n')+'\n');
}
console.log(`VN: ${cities.length} native guides × 3 languages; ${Object.keys(additions.en).length} new translations. Other destinations preserved.`);
