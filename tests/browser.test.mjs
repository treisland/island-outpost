import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {serve} from '../scripts/serve.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
test('read, search, switch themes and play a complete deck without downloading',async()=>{
 const server=await serve(root),base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch();
 try{
  await mkdir(new URL('../test-results/',import.meta.url),{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.screenshot({path:'test-results/home-light.png',fullPage:true});
  assert.equal(await page.locator('h1').count(),1);
  await page.locator('#theme').selectOption('dark');await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.screenshot({path:'test-results/home-dark.png',fullPage:true});
  await page.goto(base+'/presentations/');await page.locator('#search').fill('unknowns');
  // Search matches catalog metadata, not hidden article text.
  assert.equal(await page.locator('.card:visible').count(),0);await page.locator('#clear-filters').click();
  await page.locator('#search').fill('examples');assert.equal(await page.locator('.card:visible').count(),1);
  await page.reload();assert.equal(await page.locator('#search').inputValue(),'examples');
  await page.goto(base+'/prompt-lab/anatomy-of-a-useful-prompt/');
  await page.locator('.skip').focus();await page.keyboard.press('Enter');assert.ok(page.url().endsWith('#main'));
  assert.equal(await page.locator('h1').innerText(),'Give your prompts a clear structure');
  await page.locator('#presentation').scrollIntoViewIfNeeded();
  const frame=page.frameLocator('iframe');await frame.locator('#stage .slide.active').waitFor();
  const first=await frame.locator('#stage .slide.active').getAttribute('data-media-id');
  await frame.locator('#next').click();
  await page.waitForTimeout(150);
  assert.notEqual(await frame.locator('#stage .slide.active').getAttribute('data-media-id'),first);
  const download=page.waitForEvent('download');await page.getByRole('link',{name:'Download editable JSON'}).click();
  const file=await(await download).path();assert.equal(JSON.parse(await readFile(file,'utf8')).meta.id,'outpost-anatomy-of-a-useful-prompt-v1');
  await page.screenshot({path:'test-results/article-dark.png',fullPage:true});
  for(const url of ['/','/briefings/','/prompt-lab/','/presentations/','/about/','/prompt-lab/show-then-ask/','/prompt-lab/evaluate-the-answer/','/briefings/when-email-becomes-everyones-dependency/']){
   await page.setViewportSize({width:390,height:844});await page.goto(base+url);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,url+' must not overflow');
  }
  await page.goto(base);await page.locator('#theme').selectOption('light');await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
});
