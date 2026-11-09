import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://localhost:3000';
const canonical = 'https://www.cascondigital.com';
const paths = ['', '/work', '/services', '/clients', '/about', '/cascon', '/contact', '/privacy-policy'];
const titles = new Set();
const imageUrls = new Set();
const documents = new Map();
for (const path of paths) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path + ' must load');
  const html = await response.text();
  const document = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  documents.set(path || '/', document);
  for (const match of document.matchAll(/<(?:img|image)[^>]+(?:src|href)="([^"]+)"/g)) imageUrls.add(match[1].replaceAll('&amp;', '&'));
  assert.ok(!/Antigravity|Pause motion|Resume motion/i.test(document), path + ' contains a removed element');
  assert.ok(document.includes('https://wa.me/918281663376?text='), path + ' needs the WhatsApp contact link');
  if (['', '/work', '/clients'].includes(path)) for (const name of ['Finewares', 'Slept Club', 'Lumy Dates', 'Citysky Builders']) assert.ok(document.includes(name), path + ' missing ' + name);
  const title = document.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), path + ' needs a unique title');
  titles.add(title);
  assert.equal((document.match(/<h1\b/g) || []).length, 1, path + ' needs one visible H1');
  assert.ok(document.includes(`rel="canonical" href="${canonical}${path}"`), path + ' canonical mismatch');
  assert.ok(/<meta name="description" content="[^"]{30,}/.test(document), path + ' description missing');
  assert.ok(!/href="\/careers"|See all roles|Join our network/i.test(document), path + ' still links to hiring');
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert.ok(schemas.some(s => s['@type'] === 'Organization'));
  if (path === '' || path === '/services') {
    const faq = schemas.find(s => s['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 6);
    assert.equal((document.match(/<details class="faq-item">/g) || []).length, 6);
  }
  for (const schema of schemas) assert.ok(!JSON.stringify(schema).includes('cascon.systems'));
  console.log('PASS', path || '/', title);
}
const internalLinks = new Set();
for (const [path, document] of documents) {
  const ids = [...document.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, path + ' contains duplicate IDs');
  for (const match of document.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), new URL(path, base));
    if (url.origin !== new URL(base).origin) continue;
    internalLinks.add(url.pathname + url.hash);
  }
}
for (const target of internalLinks) {
  const url = new URL(target, base);
  const document = documents.get(url.pathname);
  if (!document) { assert.equal((await fetch(url)).status, 200, target); continue; }
  if (url.hash) assert.ok(document.includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), 'Missing anchor ' + target);
}
console.log('PASS', internalLinks.size, 'internal destinations and project/service anchors');
const robot = await (await fetch(base+'/robots.txt')).text();
assert.ok(robot.includes('OAI-SearchBot') && robot.includes(canonical+'/sitemap.xml'));
const sitemap = await (await fetch(base+'/sitemap.xml')).text();
assert.equal((sitemap.match(/<loc>/g)||[]).length, paths.length);
assert.ok(!sitemap.includes('/careers') && !sitemap.includes('cascon.systems'));
for (const path of ['/llms.txt','/llms-full.txt']) {
  const response = await fetch(base+path);
  assert.ok(response.headers.get('content-type').startsWith('text/plain'));
  const text = await response.text();
  assert.ok(text.includes(canonical+'/services') && !text.includes('cascon.systems'));
}
const careers = await fetch(base+'/careers', {redirect:'manual'});
assert.equal(careers.status, 308);
assert.equal(careers.headers.get('location'), '/about');
assert.equal((await fetch(base+'/missing-page')).status, 404);
console.log('PASS robots, sitemap, AI documents, careers redirect and 404');

for (const src of imageUrls) { const image = await fetch(new URL(src, base)); assert.equal(image.status,200,src); assert.ok(image.headers.get('content-type')?.startsWith('image/'),src); assert.ok((await image.arrayBuffer()).byteLength > 100,src+' is a placeholder'); }
const og = await fetch(base+'/opengraph-image'); assert.equal(og.status,200); assert.ok(og.headers.get('content-type').startsWith('image/png'));
console.log('PASS',imageUrls.size,'responsive image variants and social preview');
