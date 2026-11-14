import {cp,mkdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const output=new URL('release/site/',root);
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
await cp(new URL('dist/',root),output,{recursive:true});
console.log(`Packaged static site: ${fileURLToPath(output)}`);
