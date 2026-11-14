import {appendFile,readFile,writeFile} from 'node:fs/promises';
const enabled=process.env.PAGES_ENABLED==='true'&&process.env.GITHUB_REF==='refs/heads/main';
const domain=process.env.PAGES_DOMAIN||'islandoutpost.dev';
if(enabled){
 if(!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain))throw Error('PAGES_DOMAIN must be a bare hostname');
 const config=JSON.parse(await readFile(new URL('../site.json',import.meta.url),'utf8'));
 if(new URL(config.url).hostname!==domain||new URL(config.url).pathname!=='/')throw Error('Align site.json.url with PAGES_DOMAIN before deployment');
 await writeFile(new URL('../dist/CNAME',import.meta.url),domain+'\n');
}
if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,`enabled=${enabled}\n`);
const message=enabled?`Validated site will deploy to https://${domain}.`:'Site build and checks completed. Deployment is disabled: choose GitHub Actions as the Pages source and set repository variable PAGES_ENABLED=true. Deployment also requires the main branch. See README for domain setup.';
console.log(message);
if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,message+'\n');
