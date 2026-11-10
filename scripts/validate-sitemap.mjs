import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { productionOrigin, privatePath, parseSitemap, fetchPage, mapLimit } from './sitemap-utils.mjs';
export async function validateSitemap(base,{expected,requireDates=true}={}) {
 base=base.replace(/\/$/,'');const errors=[],warnings=[];
 const response=await fetch(base+'/sitemap.xml',{redirect:'manual',signal:AbortSignal.timeout(20000)});
 if(response.status!==200)throw Error('sitemap.xml returned '+response.status);
 if(!/xml/i.test(response.headers.get('content-type')||''))errors.push('Sitemap Content-Type must be XML');
 const xml=await response.text(), rows=parseSitemap(xml),seen=new Set(),paths=[];
 for(const row of rows){if(typeof row.loc!=='string')throw Error('Missing URL location');let url;try{url=new URL(row.loc);}catch{throw Error('Invalid absolute URL '+row.loc);}
  if(url.origin!==productionOrigin||url.protocol!=='https:'||url.search||url.hash||privatePath(url.pathname))errors.push('Non-canonical/private URL: '+row.loc);
  if(seen.has(url.href))errors.push('Duplicate URL: '+row.loc);seen.add(url.href);paths.push(url.pathname==='/'?'':url.pathname);
  if('changefreq'in row||'priority'in row)errors.push('Unsupported changefreq/priority present');
  if(!row.lastmod){if(requireDates)errors.push('Missing lastmod: '+row.loc);}else if(typeof row.lastmod!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(row.lastmod)||!Number.isFinite(Date.parse(row.lastmod))||(/^\d{4}-\d{2}-\d{2}$/.test(row.lastmod) ? row.lastmod > new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()) : Date.parse(row.lastmod)>Date.now()+300000))errors.push('Invalid/future lastmod: '+row.loc);
 }
 if(expected){const expectedSet=new Set(expected.map(e=>e.path));for(const path of expectedSet)if(!paths.includes(path))errors.push('Expected canonical page absent from published sitemap: '+(path||'/'));for(const path of paths)if(!expectedSet.has(path))errors.push('Unexpected sitemap URL: '+path);for(const row of rows){const path=new URL(row.loc).pathname;const entry=expected.find(e=>(e.path||'/')===path);if(entry&&row.lastmod&&row.lastmod!==entry.lastModified)errors.push('lastmod differs from recorded content date: '+path);}}
 const inspected=await mapLimit([...new Set([...paths,...(expected?.map(e=>e.path)||[])])],async path=>{try{const page=await fetchPage(base,path);if(!page.indexable)errors.push((path||'/')+' is not a canonical/indexable 200 page: '+page.reason+' ('+page.status+')');return{path:page.path,status:page.status,canonical:page.canonical||page.canonicals?.[0]||null,indexable:page.indexable,reason:page.reason||null};}catch(error){errors.push((path||'/')+': '+error.message);return{path,error:error.message};}});
 const robots=await fetch(base+'/robots.txt',{redirect:'manual',signal:AbortSignal.timeout(20000)});if(robots.status!==200)errors.push('robots.txt returned '+robots.status);const robotsText=await robots.text();if(!robotsText.includes('Sitemap: '+productionOrigin+'/sitemap.xml'))errors.push('robots.txt does not reference the production sitemap');
 return {checkedAt:new Date().toISOString(),base,sitemapUrl:base+'/sitemap.xml',canonicalSitemapUrl:productionOrigin+'/sitemap.xml',sitemapStatus:response.status,xmlValid:true,urlCount:rows.length,lastmodCount:rows.filter(row=>row.lastmod).length,robotsStatus:robots.status,pages:inspected,errors,warnings};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{const base=process.argv[2]||'http://localhost:3000';const manifest=JSON.parse(await readFile('data/sitemap-manifest.json','utf8'));const result=await validateSitemap(base,{expected:manifest.entries,requireDates:true});const reportIndex=process.argv.indexOf('--report');if(reportIndex!==-1)await writeFile(process.argv[reportIndex+1],JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({base,urlCount:result.urlCount,lastmodCount:result.lastmodCount,xmlValid:result.xmlValid,errors:result.errors},null,2));if(result.errors.length)process.exitCode=1;}catch(error){console.error(error);process.exitCode=1;}
}
