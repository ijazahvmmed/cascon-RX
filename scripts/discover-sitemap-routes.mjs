export function normalizeRoute(value) { const parts=value.split('/').filter(Boolean).filter(v=>!/^\([^)]*\)$/.test(v));return '/'+parts.join('/'); }
export function discoverRoutes(appPaths,prerender,{isPrivate=()=>false}={}) {
 const routes=new Map();
 for(const key of Object.keys(appPaths)) {
  if(!key.endsWith('/page')||key.split('/').some(p=>p.startsWith('_')||p.startsWith('@')))continue;
  const route=normalizeRoute(key.slice(0,-5));
  if(isPrivate(route))continue;
  if(!route.includes('[')) {if(routes.has(route==='/'?'':route))throw Error('Duplicate public route '+route);routes.set(route==='/'?'':route,key);}
  else {const generated=Object.entries(prerender.routes).filter(([,info])=>normalizeRoute(info.srcRoute||'')===route);if(!generated.length)throw Error('Dynamic public route '+route+' needs generateStaticParams so its indexable records can be discovered.');for(const [url] of generated)routes.set(url==='/'?'':url,key);}
 }
 return routes;
}
