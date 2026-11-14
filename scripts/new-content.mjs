import {mkdir,writeFile} from 'node:fs/promises';
import {slug} from './content.mjs';
const [id,section='prompt-lab']=process.argv.slice(2);
if(!slug.test(id||'')||!['briefings','prompt-lab'].includes(section))throw Error('Usage: npm run new-content -- kebab-case-id [prompt-lab|briefings]');
const folder=new URL(`../content/${id}/`,import.meta.url);
await mkdir(folder); // Never overwrite an existing entry.
const article={id,status:'draft',section,title:'Working title',summary:'Describe the reader outcome.',author:'Island Outpost',license:'Apache-2.0',topic:'Choose a topic',format:'Guide',tags:[],published:'',updated:'',minutes:5,cover:'cover.png',deck:'deck.json',playback:'playback.html',blocks:[{type:'heading',text:'Start here'},{type:'paragraph',text:'Draft the original explanation, examples, and limitations.'}],sources:[]};
await writeFile(new URL('article.json',folder),JSON.stringify(article,null,2)+'\n');
console.log(`Created draft ${id}. Add sources and native assets before requesting publication.`);
