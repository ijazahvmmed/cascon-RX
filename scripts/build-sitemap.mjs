import { readFile, writeFile, rename, stat, access } from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { spawn, execFileSync } from 'node:child_process';
import { productionOrigin, privatePath, fetchPage, mapLimit, sha, contentFingerprint } from './sitemap-utils.mjs';
import { discoverRoutes } from './discover-sitemap-routes.mjs';
import { validateSitemap } from './validate-sitemap.mjs';
const root=process.cwd(), manifestFile=path.join(root,'data/sitemap-manifest.json');
const previous=JSON.parse(await readFile(manifestFile,'utf8'));
const indexable=process.env.SITE_INDEXABLE!=='false' && process.env.NODE_ENV!=='development' && (!process.env.VERCEL_ENV||process.env.VERCEL_ENV==='production');
async function save(data) {const temp=manifestFile+'.tmp';await writeFile(temp,JSON.stringify(data,null,2)+'\n');await rename(temp,manifestFile);}
const appPaths=JSON.parse(await readFile(path.join(root,'.next/server/app-paths-manifest.json'),'utf8'));
const prerender=JSON.parse(await readFile(path.join(root,'.next/prerender-manifest.json'),'utf8'));
const candidates=new Map();
for(const [route,key] of discoverRoutes(appPaths,prerender,{isPrivate:privatePath})) {
 let source=null;
 for(const ext of ['tsx','ts','jsx','js','mdx']) {const file=path.join(root,'app',key.slice(1)+'.'+ext);try{await access(file);source=file;break;}catch(error){if(error.code!=='ENOENT')throw error;}}
 if(!source)throw Error('Missing content source for '+route);
 candidates.set(route,source);
}
const exclusions=[];for(const route of candidates.keys())if(privatePath(route)){exclusions.push({path:route,reason:'private-route-policy'});candidates.delete(route);}
if(!indexable){await save({...previous,origin:productionOrigin,entries:[],excluded:[{path:'/',reason:'non-production-environment'}]});console.log('Sitemap: non-indexable build, no public URLs.');process.exit(0);}
const sourceCache=new Map(), dateCache=new Map();
const nonEditorial = new Set(['components/EnquiryAnalytics.tsx','components/MetaPixel.tsx','components/MotionDirector.tsx','components/SmoothScroll.tsx','components/ScrollReveal.tsx','lib/analytics.ts','lib/fpixel.ts','lib/indexing.ts']);
const modificationDay = value => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
const normalize=value=>value.toString().replace(/\r\n/g,'\n');
let gitAvailable=true;try{execFileSync('git',['rev-parse','--is-inside-work-tree'],{cwd:root,stdio:'ignore'});}catch{gitAvailable=false;}
async function sourceDate(file) {
 if(dateCache.has(file))return dateCache.get(file);
 if(!gitAvailable)throw Error('Changed content has no trusted date without Git. Build locally and commit data/sitemap-manifest.json with the content.');
 const rel=path.relative(root,file).split(path.sep).join('/'), current=await readFile(file);let committed=null;
 try{committed=execFileSync('git',['show','HEAD:'+rel],{cwd:root,stdio:['ignore','pipe','ignore'],maxBuffer:30*1024*1024});}catch{/* New/untracked content. */}
 let date,basis;
 if(committed!==null && (/\.(tsx?|jsx?|mjs|json|mdx)$/.test(file) ? sha(normalize(committed))===sha(normalize(current)) : sha(committed)===sha(current))) {const value=execFileSync('git',['log','-1','--format=%cI','--',rel],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();if(!value)throw Error('Missing Git date for '+rel);date=new Date(value).toISOString();basis='git-content-commit';}
 else {date=(await stat(file)).mtime.toISOString();basis='modified-working-tree-source';}
 if(!Number.isFinite(Date.parse(date))||Date.parse(date)>Date.now()+300000)throw Error('Invalid/future content modification date for '+rel);
 const result={date,basis};dateCache.set(file,result);return result;
}
async function sourceGraph(file,seen=new Set()) {
 if(nonEditorial.has(path.relative(root,file).split(path.sep).join('/')) || seen.has(file))return seen;seen.add(file);
 let text=sourceCache.get(file);if(text===undefined){text=await readFile(file,'utf8');sourceCache.set(file,text);}
 for(const match of text.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
 const spec=match[1];if(!spec.startsWith('@/')&&!spec.startsWith('.'))continue;
 const base=spec.startsWith('@/')?path.join(root,spec.slice(2)):path.resolve(path.dirname(file),spec);
 if(/\.(css|scss|woff|png|jpe?g|webp|svg)$/.test(base))continue;
 for(const suffix of ['','.ts','.tsx','.js','.jsx','.mjs','.json','/index.ts','/index.tsx']){const candidate=base+suffix;try{if((await stat(candidate)).isFile()){await sourceGraph(candidate,seen);break;}}catch(error){if(error.code!=='ENOENT'&&error.code!=='ENOTDIR')throw error;}}
 }
 return seen;
}
const port=await new Promise(resolve=>{const server=net.createServer();server.listen(0,'127.0.0.1',()=>{const {port}=server.address();server.close(()=>resolve(port));});});
const child=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{cwd:root,windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,NODE_ENV:'production'}});
let serverLog='';child.stdout.on('data',data=>{serverLog=(serverLog+data).slice(-6000);});child.stderr.on('data',data=>{serverLog=(serverLog+data).slice(-6000);});
const cleanup=()=>{if(child.exitCode===null)child.kill();};process.once('exit',cleanup);process.once('SIGTERM',()=>{cleanup();process.exit(143);});
const base='http://127.0.0.1:'+port;
try {
 let ready=false;for(let attempt=0;attempt<100;attempt++){if(child.exitCode!==null)throw Error('Validation server stopped: '+serverLog);try{const r=await fetch(base+'/robots.txt',{signal:AbortSignal.timeout(1000)});if(r.ok){ready=true;break;}}catch{}await new Promise(resolve=>setTimeout(resolve,200));}if(!ready)throw Error('Validation server did not start: '+serverLog);
 const pages=await mapLimit([...candidates],async([route,source])=>({...await fetchPage(base,route),source}));
 const entries=[],history={...previous.history};
 for(const page of pages) {
  if(!page.indexable){exclusions.push({path:page.path,reason:page.reason,status:page.status});continue;}
  const {fingerprint,assets}=await contentFingerprint(page.html,root,base), old=history[page.path];
  let record=old;
  if(!old || old.fingerprint!==fingerprint) {
   const sources=await sourceGraph(page.source);for(const asset of assets)sources.add(asset);
   const dates=await Promise.all([...sources].map(async file=>({source:path.relative(root,file).split(path.sep).join('/'),...await sourceDate(file)})));
   dates.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));if(!dates.length)throw Error('No dated content source for '+page.path);
   if(old && Date.parse(dates[0].date)<=Date.parse(old.sourceModifiedAt||old.lastModified))throw Error('Rendered content changed without a newer verified editorial source date: '+page.path+'. Review external/dynamic content instead of inventing lastmod.');
   record={fingerprint,lastModified:modificationDay(dates[0].date),sourceModifiedAt:dates[0].date,dateBasis:dates[0].basis,dateSource:dates[0].source};history[page.path]=record;
  }
  entries.push({path:page.path,lastModified:record.lastModified});
 }
 entries.sort((a,b)=>a.path.localeCompare(b.path));exclusions.sort((a,b)=>a.path.localeCompare(b.path));
 const pageMap=new Map(pages.filter(p=>p.indexable).map(p=>[p.path||'/',p]));const seen=new Set(['/']),queue=['/'];
 while(queue.length){const route=queue.shift();for(const href of pageMap.get(route)?.links||[]){let url;try{url=new URL(href,productionOrigin+route);}catch{continue;}if(url.origin!==productionOrigin)continue;const dest=url.pathname==='/'?'/':url.pathname;if(pageMap.has(dest)&&!seen.has(dest)){seen.add(dest);queue.push(dest);}}}
 for(const entry of entries)if(!seen.has(entry.path||'/'))throw Error('Indexable page is orphaned: '+entry.path+'. Add a contextual HTML link before release.');
 await save({version:1,origin:productionOrigin,entries,history,excluded:exclusions});
 const result=await validateSitemap(base,{expected:entries,requireDates:true});
 await writeFile(path.join(root,'docs/sitemap-build-validation.json'),JSON.stringify(result,null,2)+'\n');
 if(result.errors.length)throw Error(result.errors.join('\n'));
 console.log('PASS sitemap build gate: '+entries.length+' canonical/indexable pages, '+exclusions.length+' exclusions, accurate content dates, valid XML and crawl discovery.');
} finally {cleanup();process.removeListener('exit',cleanup);}
