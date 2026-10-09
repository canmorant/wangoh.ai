import {readFileSync,writeFileSync} from 'node:fs';
import {mapsStops} from './maps.mjs';
const root=new URL('../../../',import.meta.url);
const progress=JSON.parse(readFileSync(new URL('docs/vietnam-2026/maps-progress.json',root),'utf8'));
const cityNames={hanoi:'Hanoi',hue:'Hue','da-nang':'Da Nang','hoi-an':'Hoi An','ho-chi-minh-city':'Ho Chi Minh City','can-tho':'Can Tho'};
for(const locale of ['tr','en','es','de','ru','fr']){
 const file=new URL(`messages/${locale}.json`,root);const data=JSON.parse(readFileSync(file,'utf8'));
 for(const rows of Object.values(mapsStops))for(const [id,names] of rows)data.Guide.mapsPlaces[id]=names[locale==='tr'?0:locale==='es'?2:1];
 writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
const entries=Object.entries(mapsStops).filter(([key])=>progress[key]?.url).map(([key,rows])=>`  ${JSON.stringify('VN:'+cityNames[key])}: {\n    url: ${JSON.stringify(progress[key].url)},\n    stops: [\n${rows.map(([id,,query])=>`      { id: ${JSON.stringify(id)}, query: ${JSON.stringify(query)} },`).join('\n')}\n    ],\n  },`).join('\n');
const file=new URL('src/content/maps-lists.ts',root);let code=readFileSync(file,'utf8');code=code.replace(/  \/\* BEGIN VIETNAM MAPS \*\/[\s\S]*?  \/\* END VIETNAM MAPS \*\/\n/,'');code=code.replace('  /* ------------------------------ Fransa ------------------------------ */',`  /* BEGIN VIETNAM MAPS */\n${entries}\n  /* END VIETNAM MAPS */\n  /* ------------------------------ Fransa ------------------------------ */`);writeFileSync(file,code);
console.log(`${Object.keys(cityNames).filter(key=>progress[key]?.url).length}/6 shared Maps lists registered; remaining lists must be completed before publishing.`);
