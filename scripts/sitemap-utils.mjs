import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
export const productionOrigin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cascondigital.com').replace(/\/$/,'');
export const privatePrefixes = ['/api','/admin','/account','/preview'];
export const privatePath = route => privatePrefixes.some(prefix => route === prefix || route.startsWith(prefix+'/'));
export const sha = value => createHash('sha256').update(value).digest('hex');
export const decode = value => value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
export function attributes(tag) { return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1].toLowerCase(),decode(m[2])])); }
export function inspectHtml(html, headers) {
 const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(m=>attributes(m[0]));
 const canonicals=tags.filter(t=>t.rel?.split(/\s+/).includes('canonical')).map(t=>t.href);
 const noindex=/(?:^|[\s,:])(?:noindex|none)(?:$|[\s,])/i.test(headers.get('x-robots-tag') || '') || tags.some(t=>['robots','googlebot','bingbot'].includes(t.name?.toLowerCase()) && /(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(t.content || ''));
 const links=[...html.matchAll(/<a\b[^>]*>/gi)].map(m=>attributes(m[0]).href).filter(Boolean);
 return {canonicals,noindex,links};
}
export async function fetchPage(base, route, origin=productionOrigin) {
 const response=await fetch(base.replace(/\/$/,'')+(route || '/'),{redirect:'manual',signal:AbortSignal.timeout(20000)});
 if(response.status>=500) throw Error(route+' returned '+response.status);
 if(response.status!==200) return {path:route,status:response.status,indexable:false,reason:response.status>=300&&response.status<400?'redirect':'non-200'};
 if(!response.headers.get('content-type')?.includes('text/html')) return {path:route,status:200,indexable:false,reason:'not-html'};
 const html=await response.text(), info=inspectHtml(html,response.headers);
 if(info.noindex) return {path:route,status:200,indexable:false,reason:'noindex',...info,html};
 if(info.canonicals.length!==1) throw Error(route+' must declare exactly one canonical; found '+info.canonicals.length);
 const canonical=new URL(info.canonicals[0]);
 const expected=new URL(origin+(route || '/'));
 if(canonical.href!==expected.href) return {path:route,status:200,indexable:false,reason:'canonical-alias',...info,html};
 return {path:route,status:200,indexable:true,canonical:info.canonicals[0],...info,html};
}
export async function mapLimit(items, fn, concurrency=4) {
 const results=new Array(items.length);let cursor=0;
 await Promise.all(Array.from({length:Math.min(concurrency,items.length)},async()=>{while(cursor<items.length){const i=cursor++;results[i]=await fn(items[i],i);}}));return results;
}
export function parseSitemap(xml) {
 if(/<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error('Sitemap must not contain DTDs/entities');
 const validation=XMLValidator.validate(xml);if(validation!==true) throw Error('Invalid sitemap XML: '+JSON.stringify(validation));
 const parsed=new XMLParser({ignoreAttributes:false,parseTagValue:false,isArray:(_name,jpath)=>jpath==='urlset.url'}).parse(xml);
 if(parsed.urlset?.['@_xmlns']!=='http://www.sitemaps.org/schemas/sitemap/0.9') throw Error('Invalid sitemap namespace');
 return parsed.urlset.url || [];
}
export async function contentFingerprint(html, projectRoot, base) {
 const main=(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
 if(!main)throw Error('Missing main content');
 const text=decode(main.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi,'').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
 const links=[...main.matchAll(/<a\b[^>]*>/gi)].map(m=>attributes(m[0]).href).filter(Boolean);
 const images=[];
 for(const match of main.matchAll(/<(?:img|image|source)\b[^>]*>/gi)) {
  const attrs=attributes(match[0]);let src=attrs.src || attrs.href || attrs.srcset?.split(',')[0]?.trim().split(' ')[0];if(!src)continue;
  const url=new URL(src,base);if(url.pathname==='/_next/image')src=url.searchParams.get('url')||src;
  let assetHash=null, file=null;
  if(src.startsWith('/')&&!src.startsWith('//')) { file=path.resolve(projectRoot,'public','.'+new URL(src,base).pathname);const publicRoot=path.resolve(projectRoot,'public')+path.sep;if(!file.startsWith(publicRoot))throw Error('Asset outside public directory');try{assetHash=sha(await readFile(file));}catch{throw Error('Missing local asset '+src);} }
  images.push({src,alt:attrs.alt||'',assetHash,file});
 }
 const meta=[...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(m=>attributes(m[0])).filter(t=>t.rel==='canonical'||t.name==='description'||t.property?.startsWith('og:'));
 const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const fingerprint=sha(JSON.stringify({text,links,images:images.map(({file,...image})=>image),meta,schemas,title:html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]}));
 return {fingerprint,assets:images.map(i=>i.file).filter(Boolean)};
}
