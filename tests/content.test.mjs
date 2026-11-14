import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,cp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateArticle,loadContent,escape} from '../scripts/content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const base=JSON.parse(await readFile(new URL('../content/anatomy-of-a-useful-prompt/article.json',import.meta.url),'utf8'));
test('published entries have matching native playback and complete assets',async()=>{
 const {entries}=await loadContent(root);assert.equal(entries.length,4);assert.ok(entries.every(a=>a.slideCount>=6));
});
test('metadata rejects URL changes, asset traversal, missing update evidence and unsafe sources',()=>{
 for(const change of [{id:'another-id'},{cover:'../cover.png'},{updated:'2026-11-14'},{sources:[{label:'Unsafe',url:'javascript:alert(1)'}]},{published:'2026-02-30'}])assert.throws(()=>validateArticle({...base,...change},base.id));
 assert.equal(escape('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('drafts need no exports and cannot enter the public catalog; mismatched playback fails',async()=>{
 const temp=await mkdtemp(path.join(os.tmpdir(),'outpost-content-'));
 try{
  await cp(path.join(root,'site.json'),path.join(temp,'site.json'));await mkdir(path.join(temp,'content'));
  const folder=path.join(temp,'content',base.id);await mkdir(folder);
  await writeFile(path.join(folder,'article.json'),JSON.stringify({...base,status:'draft'}));
  assert.deepEqual((await loadContent(temp)).entries,[]);
  for(const asset of ['deck.json','playback.html','cover.png'])await cp(path.join(root,'content',base.id,asset),path.join(folder,asset));
  await writeFile(path.join(folder,'article.json'),JSON.stringify(base));
  const html=await readFile(path.join(folder,'playback.html'),'utf8');
  await writeFile(path.join(folder,'playback.html'),html.replaceAll('outpost-anatomy-of-a-useful-prompt-v1','wrong-project'));
  await assert.rejects(loadContent(temp),/playback does not match/);
 }finally{await rm(temp,{recursive:true,force:true});}
});
