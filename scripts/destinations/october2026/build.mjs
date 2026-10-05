/** Reproducible editorial import: native TR/EN/ES copy, existing translation memory. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { countries } from './countries.mjs';
import { cities as ae } from './ae.mjs';
import { cities as eg } from './eg.mjs';
import { cities as ge } from './ge.mjs';
import { cities as bg } from './bg.mjs';
import { cities as mt } from './mt.mjs';
import { cities as cy } from './cy.mjs';
import { cities as ma } from './ma.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const read = p => JSON.parse(readFileSync(resolve(root, p), 'utf8'));
const write = (p, data) => writeFileSync(resolve(root, p), JSON.stringify(data, null, p.includes('/tm/') ? 1 : 2) + '\n');
const memories = Object.fromEntries(['en','es'].map(l => [l, read(`src/content/i18n/tm/${l}.json`)]));
const existing = Object.fromEntries(Object.entries(memories).map(([l, m]) => [l, Object.assign({}, ...Object.entries(m).filter(([g]) => g !== 'october2026').map(([,v]) => v))]));
const additions = { en:{}, es:{} };
function textKey(s) {
  let a=0xdeadbeef,b=0x41c6ce57;
  for(let i=0;i<s.length;i++){ const c=s.charCodeAt(i); a=Math.imul(a^c,2654435761); b=Math.imul(b^c,1597334677); }
  a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);
  b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);
  return (4294967296*(2097151&b)+(a>>>0)).toString(36);
}
function t(row) {
  if(!Array.isArray(row)||row.length!==3||row.some(v=>typeof v!=='string'||!v.trim())) throw Error(`Invalid native copy: ${JSON.stringify(row)}`);
  if (/\p{L}/u.test(row[0]) && !/^https?:\/\//.test(row[0])) {
    const key=textKey(row[0]);
    ['en','es'].forEach((l,i)=>{
      // Existing shared labels retain their established translations.
      if(existing[l][key]!==undefined) return;
      if(additions[l][key]!==undefined && additions[l][key]!==row[i+1]) throw Error(`Conflicting ${l} translation: ${row[0]}`);
      additions[l][key]=row[i+1];
    });
  }
  return row[0];
}
const allCities=[...ae,...eg,...ge,...bg,...mt,...cy,...ma];
const seo={guides:{en:{},es:{}},hubs:{en:{},es:{}}};
const hubs={};
const destinations=countries.map(c=>{
  for(const l of ['en','es']) seo.hubs[l][c.code]=[c.title[l==='en'?1:2],c.meta[l==='en'?1:2]];
  hubs[c.code]={
    seoTitle:t(c.title),seoDescription:t(c.meta),
    planningHeading:t(c.planning),essentialsHeading:t(c.essentialsHeading),citiesHeading:t(c.citiesHeading),
    cityGridIntro:t(c.grid),intro:c.intro.map(t),
    essentials:c.essentials.map(([title,body])=>({title:t(title),body:t(body)})),
    routeIdeas:c.routes.map(r=>({title:t(r.title),duration:t(r.duration),cities:r.cities,description:t(r.description)})),
  };
  return {name:c.name[0],...(c.shortName?{shortName:c.shortName}:{}),code:c.code,flag:c.flag,
    description:t(c.description),image:c.image,coordinates:c.coordinates,iata:c.iata,
    gateway:t(c.gateway),capital:t(c.capital),flightTime:c.flightTime,accent:c.accent,
    bestSeason:c.bestSeason,budget:c.budget,signature:t(c.signature),
    cities:allCities.filter(x=>x.code===c.code).map(x=>({name:t(x.name),description:t(x.card),image:x.image})),
  };
});
const headings=(names,suffix)=>t(names.map((n,i)=>suffix[i](n)));
const guides=allCities.map(c=>{
  const names=c.name;
  for(const l of ['en','es']) seo.guides[l][`${c.code}:${names[0]}`]=[c.title[l==='en'?1:2],c.meta[l==='en'?1:2]];
  return {
    city:names[0],countryCode:c.code,seoTitle:t(c.title),seoDescription:t(c.meta),h1:t(c.h1??c.title),lede:t(c.lede),
    quickFacts:[
      {label:t(['Önerilen süre','Suggested stay','Estancia recomendada']),value:t(c.days)},
      {label:t(['En uygun dönem','Best time to visit','Mejor época']),value:t(c.time)},
      {label:t(['Ulaşım yaklaşımı','Getting around','Cómo moverse']),value:t(c.transport)},
    ],
    sections:[
      {id:'ulasim',heading:headings(names,[n=>`${n} ulaşım rehberi`,n=>`Getting to and around ${n}`,n=>`Cómo llegar a ${n} y moverse`]),body:[t(c.arrival),t(c.movement)]},
      {id:'gezilecek-yerler',heading:headings(names,[n=>`${n} gezilecek yerler`,n=>`Things to do in ${n}`,n=>`Qué ver en ${n}`]),body:[t(c.overview)],subsections:c.sights.map(s=>({heading:t(s.name),body:[t(s.body)]}))},
      {id:'konaklama',heading:headings(names,[n=>`${n} nerede kalınır?`,n=>`Where to stay in ${n}`,n=>`Dónde alojarse en ${n}`]),body:[t(c.stay),...(c.neighbourhood?[t(c.neighbourhood)]:[])]},
      {id:'yeme-icme',heading:headings(names,[n=>`${n} ne yenir?`,n=>`What to eat in ${n}`,n=>`Qué comer en ${n}`]),body:[t(c.food)]},
      {id:'mevsim-butce',heading:headings(names,[n=>`${n} için mevsim ve bütçe planı`,n=>`${n}: weather and budget planning`,n=>`${n}: cuándo ir y presupuesto`]),body:[t(c.season),t(c.budget)]},
      {id:'yakin-rotalar',heading:headings(names,[n=>`${n} çevresinde rota önerileri`,n=>`Trips beyond ${n}`,n=>`Excursiones desde ${n}`]),body:[t(c.beyond)]},
    ],
    placesKind:'sights',places:c.sights.map(s=>({name:t(s.name),area:t(s.area),known:t(s.known),why:t(s.reason),tip:t(s.tip)})),
    itinerary:c.itinerary.map(([title,morning,afternoon,evening])=>({title:t(title),morning:t(morning),afternoon:t(afternoon),evening:t(evening)})),
    practicalHeading:headings(names,[n=>`${n} için pratik ipuçları`,n=>`Practical tips for ${n}`,n=>`Consejos para visitar ${n}`]),
    practicalTips:c.tips.map(([title,body])=>({title:t(title),body:t(body)})),
    faqs:c.faqs.map(([q,a])=>({q:t(q),a:t(a)})),
    relatedGuides:allCities.filter(x=>x.code===c.code&&x!==c).map(x=>({city:x.name[0],anchor:t(x.title),description:t(x.card)})),
    sources:c.sources.map(([name,url])=>({name:t(name),url})),
    volatileNote:t(['Bilet ücretleri, seferler ve ziyaret saatleri değişebilir. Rezervasyon öncesinde aşağıdaki resmî kaynaklardan güncel bilgiyi kontrol edin.','Admission prices, services and opening hours can change. Check the official sources below before booking.','Los precios, los servicios y los horarios pueden cambiar. Consulta las fuentes oficiales indicadas antes de reservar.']),
    reviewed:'2026-10-05',countryInfoOnHub:true,
  };
});
const dietary=allCities.map(c=>({countryCode:c.code,city:c.name[0],vegan:[],halal:[],researchNote:t(c.diet)}));
write('src/data/addedDestinations.json',destinations);
write('src/content/guides/addedDestinations.json',guides);
write('src/content/addedCountryHubs.json',hubs);
write('src/content/dietary/addedDestinations.json',dietary);
write('src/content/addedSeo.json',seo);
for(const l of ['en','es']){ memories[l].october2026=additions[l];write(`src/content/i18n/tm/${l}.json`,memories[l]); }
console.log(`${destinations.length} countries, ${guides.length} guides, ${Object.keys(additions.en).length} native translation pairs.`);
