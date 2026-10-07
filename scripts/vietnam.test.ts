/** Vietnam publication coverage: native articles, cross-links and factual separation. */
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {countries} from '../src/data/destinations';
import {localizedCountry,localizedGuide,localizedHub,localizedDietary,cityPageLocales,countryPageLocales} from '../src/content/localized';
import {regionOf} from '../src/content/regions';
import {creditFor} from '../src/data/imageCredits';

const names=['Hanoi','Hue','Da Nang','Hoi An','Ho Chi Minh City','Can Tho'];
const country=countries.find(c=>c.code==='VN');assert(country);
assert.deepEqual(country.cities.map(c=>c.name),names);
assert.equal(regionOf(country),'asia');
assert.deepEqual(countryPageLocales(country),['tr','en','es']);
const titles=new Set<string>();let pages=0;
for(const locale of ['tr','en','es'] as const){
 const hub=localizedHub('VN',locale);assert(hub?.complete);
 assert(localizedCountry(country,locale).complete);
 assert(hub.value.routeIdeas.every(route=>route.cities.every(city=>names.includes(city))));
 assert(hub.value.essentials?.length);pages++;
 for(const city of country.cities){
  const result=localizedGuide('VN',city.name,locale);assert(result?.complete,`${locale}:${city.name}`);
  const guide=result.value;
  assert.deepEqual(cityPageLocales(country,city.name),['tr','en','es']);
  assert.equal(guide.placesKind,'sights','Sightseeing must not appear under restaurant cards');
  assert(!guide.sections.find(section=>section.id==='yeme-icme')?.subsections?.length);
  assert.equal(new Set(guide.sections.map(section=>section.id)).size,guide.sections.length);
  assert(guide.sources?.length&&guide.sources.every(source=>source.url.startsWith('https://')));
  assert(guide.relatedGuides?.every(link=>link.city!==city.name&&names.includes(link.city)));
  assert.equal(guide.relatedGuides?.length,5);
  const article=[guide.lede,...guide.sections.flatMap(section=>[...section.body,...(section.subsections?.flatMap(sub=>sub.body)??[])]),...guide.faqs.map(faq=>faq.a)].join(' ');
  assert(article.split(/\s+/).length>=600,`${locale}:${city.name}: substantial native article`);
  assert(guide.seoTitle.length<=60&&guide.seoDescription.length>=120&&guide.seoDescription.length<=160);
  assert(!titles.has(`${locale}:${guide.seoTitle}`));titles.add(`${locale}:${guide.seoTitle}`);
  const dietary=localizedDietary('VN',city.name,locale);assert(dietary?.complete);
  assert.equal(dietary.value.vegan.length+dietary.value.halal.length,0,'Do not fabricate verified restaurants');
  assert(existsSync(`public${city.image}`));const credit=creditFor(city.image);assert(credit?.licenseName&&credit.sourceUrl&&credit.lqip);
  pages++;
 }
}
assert.equal(pages,21);
console.log('Vietnam: 6 cities, 21 complete TR/EN/ES pages; links, sources, native bodies and licensed imagery verified.');
