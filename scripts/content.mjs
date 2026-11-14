import {readFile,readdir,lstat,realpath} from 'node:fs/promises';
import path from 'node:path';
export function assert(value,message){if(!value)throw new Error(message);}
export const slug=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function https(value){try{return new URL(value).protocol==='https:';}catch{return false;}}
function date(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;}
export function validateArticle(a,folder){
 assert(a&&typeof a==='object'&&!Array.isArray(a),`${folder}: expected an article object`);
 assert(slug.test(folder)&&a.id===folder,`${folder}: id must match its folder slug`);
 assert(['draft','published'].includes(a.status),`${folder}: status must be draft or published`);
 assert(['briefings','prompt-lab'].includes(a.section),`${folder}: unknown section`);
 for(const key of ['title','summary','author','license','topic','format'])assert(typeof a[key]==='string'&&a[key].trim()&&a[key].length<=(key==='summary'?600:150),`${folder}: invalid ${key}`);
 assert(Array.isArray(a.tags)&&a.tags.length<=12&&a.tags.every(t=>typeof t==='string'&&t.trim()&&t.length<=50),`${folder}: invalid tags`);
 assert(Array.isArray(a.blocks),`${folder}: blocks must be an array`);
 assert(Array.isArray(a.sources)&&a.sources.every(s=>typeof s.label==='string'&&s.label.trim()&&https(s.url)),`${folder}: sources need labels and HTTPS URLs`);
 for(const b of a.blocks){
  assert(['paragraph','heading','list','callout','code'].includes(b.type),`${folder}: unsupported block type`);
  if(b.type==='list')assert(Array.isArray(b.items)&&b.items.length&&b.items.every(v=>typeof v==='string'),`${folder}: invalid list`);
  else assert(typeof b.text==='string'&&b.text.length<=20000,`${folder}: invalid block text`);
 }
 if(a.status==='draft')return;
 assert(date(a.published)&&date(a.updated)&&a.updated>=a.published,`${folder}: invalid publication/update dates`);
 if(a.updated>a.published)assert(typeof a.updateNote==='string'&&a.updateNote.trim(),`${folder}: substantive updates require an update note`);
 assert(a.blocks.length>=3&&a.sources.length>0,`${folder}: published articles need useful body content and sources`);
 for(const key of ['cover','deck','playback'])assert(typeof a[key]==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(a[key]),`${folder}: ${key} must be a local filename`);
 assert(/\.(png|webp|jpe?g)$/i.test(a.cover)&&/\.json$/i.test(a.deck)&&/\.html$/i.test(a.playback),`${folder}: use a raster cover, native JSON, and playback HTML`);
 assert(Number.isInteger(a.minutes)&&a.minutes>=1&&a.minutes<=120,`${folder}: invalid reading time`);
}
export async function loadContent(root){
 const config=JSON.parse(await readFile(path.join(root,'site.json'),'utf8'));
 assert(https(config.url)&&https(config.repository), 'Site URLs must use HTTPS');
 const entries=[];
 for(const dir of (await readdir(path.join(root,'content'),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
  if(!dir.isDirectory()||dir.name.startsWith('.'))continue;
  const folder=path.join(root,'content',dir.name),article=JSON.parse(await readFile(path.join(folder,'article.json'),'utf8'));
  validateArticle(article,dir.name);if(article.status!=='published')continue;
  for(const file of [article.cover,article.deck,article.playback]){
   const asset=path.join(folder,file),stat=await lstat(asset);
   assert(stat.isFile()&&!stat.isSymbolicLink()&&stat.size<=15*1024*1024,`${dir.name}: invalid/oversized asset ${file}`);
   assert(path.dirname(await realpath(asset))===await realpath(folder),`${dir.name}: asset escapes folder`);
  }
  const deck=JSON.parse(await readFile(path.join(folder,article.deck),'utf8'));
  assert(deck.kind==='presentation-studio-project'&&[2,3].includes(deck.schemaVersion)&&deck.meta?.id&&Array.isArray(deck.state?.slides)&&deck.state.slides.length,`${dir.name}: unsupported native deck`);
  assert(new Set(deck.state.slides.map(s=>s.id)).size===deck.state.slides.length,`${dir.name}: duplicate slide IDs`);
  const html=await readFile(path.join(folder,article.playback),'utf8');
  const embedded=html.match(/<script\b[^>]*\bid=["']project-config["'][^>]*>([\s\S]*?)<\/script>/i);
  assert(embedded,`${dir.name}: use a native Studio playback export`);
  const playback=JSON.parse(embedded[1]);
  assert(playback.playbackOnly===true&&playback.meta?.id===deck.meta.id&&JSON.stringify(playback.state?.slides?.map(s=>s.id))===JSON.stringify(deck.state.slides.map(s=>s.id)),`${dir.name}: playback does not match deck identity/slide order`);
  entries.push({...article,slideCount:deck.state.slides.length});
 }
 return {config,entries:entries.sort((a,b)=>b.published.localeCompare(a.published)||a.title.localeCompare(b.title))};
}
