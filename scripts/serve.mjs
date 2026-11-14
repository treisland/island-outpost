import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function serve(root,port=0){
 const base=path.resolve(root);
 const server=http.createServer(async(req,res)=>{try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(base,'.'+pathname);
  if(file!==base&&!file.startsWith(base+path.sep))throw Error('Outside root');
  if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  const data=await readFile(file);
  const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}});
 return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const server=await serve(fileURLToPath(new URL('../dist/',import.meta.url)),Number(process.env.PORT||4173));
 console.log(`Island Outpost: http://127.0.0.1:${server.address().port}`);
}
