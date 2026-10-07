import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import sharp from 'sharp';
const selected={hanoi:'File:Night skyline (4856119418).jpg',hue:'File:Meridian Gate, Hue (I).jpg','da-nang':'File:My Khe Beach Danang Coastline.jpg','hoi-an':'File:Hội An, Ancient Town, 2020-01 CN-01.jpg','ho-chi-minh-city':'File:Clock and exterior of Saigon Central Post Office.JPG','can-tho':'File:Ninh Kieu Quay.jpg'};
const clean=s=>s?.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').trim()??null;
const credits=[];const sources={};
for(const [key,title] of Object.entries(selected)){
 const u=new URL('https://commons.wikimedia.org/w/api.php');Object.entries({action:'query',format:'json',titles:title,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1280'}).forEach(([k,v])=>u.searchParams.set(k,v));
 const j=await(await fetch(u)).json();const info=Object.values(j.query.pages)[0].imageinfo?.[0];if(!info)throw Error(title);
 const m=info.extmetadata;const license=m.LicenseShortName?.value;if(!/^CC (BY|0)/.test(license))throw Error(`Unsupported license: ${license}`);
 const file=`/images/vietnam-${key}.avif`;
 if(!existsSync(`public${file}`)){const r=await fetch(info.thumburl??info.url);if(!r.ok)throw Error(`${key}: ${r.status}`);await sharp(Buffer.from(await r.arrayBuffer())).resize({width:1280,withoutEnlargement:true}).avif({quality:58,effort:4}).toFile(`public${file}`);}
 const preview=await sharp(`public${file}`).resize(20).webp({quality:40}).toBuffer();
 credits.push({file,artist:key==='hue'?'Supanut Arunoprayote':clean(m.Artist?.value),licenseName:license,licenseUrl:m.LicenseUrl?.value??null,sourceUrl:info.descriptionurl,attributionRequired:m.AttributionRequired?.value==='true',lqip:`data:image/webp;base64,${preview.toString('base64')}`});
 sources[key]={title,sourceUrl:info.descriptionurl,license,description:clean(m.ImageDescription?.value)};console.log(key,license);
}
const path='src/data/addedImageCredits.json';const previous=JSON.parse(readFileSync(path,'utf8')).filter(c=>!credits.some(v=>v.file===c.file));writeFileSync(path,JSON.stringify([...previous,...credits],null,2)+'\n');writeFileSync('scripts/destinations/vietnam2026/image-sources.json',JSON.stringify(sources,null,2)+'\n');
