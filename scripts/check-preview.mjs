import assert from 'node:assert/strict';
const base=process.argv[2]||'http://localhost:3000';
for(const path of ['/','/services/shopify-development']) {const response=await fetch(base+path);assert.equal(response.status,200);assert.match(response.headers.get('x-robots-tag')||'',/noindex/);const html=await response.text();assert.ok(!html.includes('src="https://plausible.io/js/script.js"'),'Preview must not load production analytics');for(const name of ['robots','googlebot'])assert.ok(html.includes('<meta name="'+name+'" content="noindex'),path+' '+name);}
const robots=await(await fetch(base+'/robots.txt')).text();assert.ok(robots.includes('Disallow: /'));assert.ok(!robots.includes('Sitemap:'));
const sitemap=await(await fetch(base+'/sitemap.xml')).text();assert.ok(!sitemap.includes('<loc>'));
console.log('PASS non-production HTTP responses: noindex headers, robots/googlebot metadata, restricted robots and empty sitemap');
