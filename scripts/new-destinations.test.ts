/** New editorial destinations: native content, route coverage and factual separation.
 * Run: NEXT_PUBLIC_SITE_LOCALES=tr,en,es npx tsx scripts/new-destinations.test.ts
 */
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {countries} from '../src/data/destinations';
import {GUIDES} from '../src/content/guides';
import {localizedCountry, localizedGuide, localizedHub, localizedDietary, cityPageLocales, countryPageLocales} from '../src/content/localized';
import {buildCityCardData} from '../src/content/cityCardData';
import {destinationDictionary} from '../src/content/i18n/destinations';
import {textKey} from '../src/content/i18n/core';
import {regionOf} from '../src/content/regions';
import {creditFor} from '../src/data/imageCredits';
import {slugify} from '../src/lib/slug';
const expected:Record<string,string[]>={AE:['Dubai','Abu Dabi'],EG:['Kahire','Luksor','Hurgada','Şarm el-Şeyh'],GE:['Tiflis','Batum','Kazbegi'],BG:['Sofya','Plovdiv','Varna'],MT:['Valletta','Gozo'],CY:['Girne','Gazimağusa','Baf','Larnaka'],MA:['Marakeş','Fes','Şefşavan']};
let pages=0;
const titles=new Set<string>();
const wordCounts:Record<string,number[]>={tr:[],en:[],es:[]};
for(const [code,names] of Object.entries(expected)){
 const country=countries.find(c=>c.code===code);assert(country,code);
 assert.deepEqual(country.cities.map(c=>c.name),names,`${code}: requested places`);
 assert.deepEqual(countryPageLocales(country),['tr','en','es'],`${code}: published languages`);
 assert(regionOf(country));
 for(const locale of ['tr','en','es'] as const){
  const hub=localizedHub(code,locale);assert(hub?.complete,`${code}/${locale}: complete hub`);
  assert(localizedCountry(country,locale).complete,`${code}/${locale}: cards and place names`);
  assert(hub.value.essentials?.length===4);assert(hub.value.routeIdeas.length===2);
  for(const route of hub.value.routeIdeas)assert(route.cities.every(c=>names.includes(c)));
  assert(hub.value.seoTitle.length<=60);
  assert(hub.value.seoDescription.length>=120&&hub.value.seoDescription.length<=160,`${code}/${locale}: description length`);
  assert(!titles.has(`${locale}:${hub.value.seoTitle}`));titles.add(`${locale}:${hub.value.seoTitle}`);pages++;
  const cards=buildCityCardData(locale);assert(cards.hubs[code]?.intro);
  for(const city of country.cities){
   const result=localizedGuide(code,city.name,locale);assert(result?.complete,`${code}:${city.name}/${locale}`);
   const guide=result.value;
   assert.equal(GUIDES.filter(g=>g.countryCode===code&&g.city===city.name).length,1);
   assert.deepEqual(cityPageLocales(country,city.name),['tr','en','es']);
   assert.equal(guide.placesKind,'sights');assert(guide.places?.length===3);
   const food=guide.sections.find(s=>s.id==='yeme-icme');assert(food);assert(!food.subsections?.length,'Sightseeing cards must not appear as restaurants');
   assert(guide.sections.length===8&&guide.itinerary&&guide.itinerary.length>=2&&[3,4].includes(guide.faqs.length));
   assert(guide.sections.some(s=>s.id==='gezi-planlama'&&s.body.length>=3));
   assert(guide.sections.some(s=>s.id==='mahalle-yasami'&&s.body.length>=2));
   assert.equal(new Set(guide.sections.map(s=>s.id)).size,guide.sections.length,'Section anchors must be unique');
   assert(guide.sources?.length&&guide.sources.every(s=>s.url.startsWith('https://')));
   assert(guide.countryInfoOnHub);assert(localizedDietary(code,city.name,locale)?.complete);
   assert(guide.seoTitle.length<=60&&guide.seoDescription.length>=120&&guide.seoDescription.length<=160);
   assert(!titles.has(`${locale}:${guide.seoTitle}`));titles.add(`${locale}:${guide.seoTitle}`);
   const article=[guide.lede,...guide.sections.flatMap(s=>[...s.body,...(s.subsections?.flatMap(ss=>ss.body)??[])]),...guide.faqs.map(f=>f.a)].join(' ');
   const words=article.trim().split(/\s+/).length;wordCounts[locale].push(words);assert(words>=700,`${code}:${city.name}/${locale}: ${words} words`);
   if(code==='CY')assert(!/işgal|occupation|ocupaci[oó]n|recognition|tanınma|reconocimiento|siyasi|politic|pol[ií]tic|KKTC|TRNC/i.test(article),'Cyprus copy must stay within travel topics');
   assert(!cards.missingGuides.includes(`${code}:${city.name}`));
   assert(existsSync(`public${city.image}`));const credit=creditFor(city.image);assert(credit?.sourceUrl&&credit.licenseName&&credit.lqip);assert(!/FAL/.test(credit.licenseName));
   if(locale!=='tr')assert(destinationDictionary(locale)[textKey(city.name)],'Search labels are translated');
   assert(slugify(city.name));pages++;
  }
 }
}
assert.equal(pages,84);
console.log(`7 countries, 21 destinations, ${pages} complete TR/EN/ES pages; cards, regions, dietary notes and image credits checked.`);
for(const [locale,counts] of Object.entries(wordCounts))console.log(`${locale}: article bodies ${Math.min(...counts)}–${Math.max(...counts)} words (excluding itineraries, tips and cards).`);
