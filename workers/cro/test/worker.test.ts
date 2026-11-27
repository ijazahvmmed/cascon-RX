import { assessment } from '../src/score';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDns, fetcher, isPublicIp, MAX_HTML_BYTES, publicUrl, Rejection, sampleUrl, storeEntry } from '../src/target';
import { evaluate } from '../src/evaluate';
import { verifies } from '../src/extract';
import type { DocumentEvidence } from '../src/extract';
import { type ShoppingCheck } from '../../../lib/cro/model';
import { principles } from '../../../lib/cro/principles';

const at = new URL('https://example.com/');
const signal = AbortSignal.timeout(5000);
const body = (text = '<html></html>') => new Response(text, { headers: { 'content-type': 'text/html; charset=utf-8' } });
const asFetch = (fn: (url: string | URL | Request, init?: RequestInit) => Promise<Response>) => fn as typeof fetch;
const time = '2026-11-27T04:00:00.000Z';
function evidence(override: Partial<DocumentEvidence> = {}): DocumentEvidence {
  return {
    url: at, platform: 'Shopify', visible: true, complete: true, blocked: false, title: 'Good store', description: true, headings: 1, lang: true,
    viewport: 'width=device-width, initial-scale=1', nav: true, main: true, search: false, sort: false,
    breadcrumbs: true, candidates: [], links: new Set(), detailLinks: new Set(),
    labels: { cart: [], checkout: [], purchase: [], quantity: [] }, insecureCart: false,
    insecureCheckout: false, payment: false, express: false, images: true, productImage: null,
    productSchema: false, productTemplate: false, collectionSchema: false, collectionTemplate: false,
    purchase: false, visiblePrice: false, offers: [], shipping: [], returns: [],
    comparisons: [], campaignDate: [], campaignInsecure: false, campaignSecure: false, ...override,
  };
}

test('has 120 unique principles and 48 backed checks across the 12 categories', () => {
  assert.equal(principles.length, 120);
  assert.equal(new Set(principles.map(p => p.id)).size, 120);
  assert.equal(principles.filter(p => p.mode === 'automated').length, 48);
});

test('preserves public page paths, strips query data and rejects unsafe inputs', () => {
  assert.equal(storeEntry(' Example.com/products/sale?token=a#part ').href, 'https://example.com/products/sale');
  for (const value of ['https://user@example.com', 'file:///etc/passwd', 'http://127.0.0.1', 'http://2130706433',
    'http://0x7f000001', 'http://[::ffff:127.0.0.1]', 'http://localhost', 'http://a.x.internal',
    'http://a.sslip.io', 'https://host.workers.dev', 'https://example.com:8080', 'https://example.com\\@evil.com', 'https://example.com.']) {
    assert.throws(() => storeEntry(value), Rejection, value);
  }
  assert.equal(sampleUrl('https://other.example.com/product/a', at), null);
  assert.equal(sampleUrl('/products/shoes?private=no#link', at)?.href,'https://example.com/products/shoes');
  assert.throws(() => storeEntry('https://example.com/checkout/order'), Rejection);
  assert.equal(sampleUrl('/checkout/order', at), null);
  assert.equal(sampleUrl('/%63art/test', at), null);
  assert.equal(sampleUrl('/pay/%2e%2e/cart/add', at), null);
});

test('DNS refuses public-private mixtures and catches rebinding before the next redirect hop', async () => {
  for (const [ip,type] of [['127.0.0.1',1],['169.254.169.254',1],['100.64.0.1',1],['192.0.0.1',1],
    ['::ffff:8.8.8.8',28],['::1',28],['fd00::1',28],['2001:db8::1',28],['2002:7f00:1::',28]] as const) assert.equal(isPublicIp(ip,type),false,ip);
  assert.equal(isPublicIp('142.250.190.78',1),true);
  assert.equal(isPublicIp('2606:4700::1111',28),true);
  const mixed = asFetch(async url => Response.json({ Status: 0, Answer: [
    { type: 1, data: '8.8.8.8' }, { type: 28, data: 'fd00::1' },
  ] }));
  await assert.rejects(checkDns('example.com',signal,mixed), error => (error as Rejection).code === 'blocked');
  let resolving = 0, fetching = 0;
  const read = fetcher(signal,asFetch(async () => {
    fetching++;
    return new Response(null,{ status: 302, headers: { location: '/catalog' } });
  }),async () => { if (++resolving > 1) throw new Rejection('blocked'); });
  await assert.rejects(read(at,at,true),Rejection);
  assert.equal(fetching,1);
});

test('validates redirects and does not follow a cross-host or transactional destination', async () => {
  for (const location of ['https://other.example.com/', 'http://example.com/', '/checkout', '/wp-json/test', 'https://127.0.0.1/', '/%63art']) {
    const calls: string[] = [];
    const read = fetcher(signal,asFetch(async (url,init) => {
      calls.push(String(url));
      assert.equal(init?.redirect,'manual');
      assert.equal(new Headers(init?.headers).has('cookie'),false);
      return new Response(null,{ status: 302, headers: { location } });
    }),async () => {});
    await assert.rejects(read(at,at,true),Rejection);
    assert.equal(calls.length,1);
  }
  const read = fetcher(signal,asFetch(async url => String(url).includes('www.') ? body() :
    new Response(null,{ status: 301, headers: { location: 'https://www.example.com/shop?secret=x' } })),async () => {});
  assert.equal((await read(at,at,true)).url.href,'https://www.example.com/shop');
  assert.throws(() => publicUrl('https://user:secret@example.com'),Rejection);
});

test('rejects bot gates and unexpected media, and bounds oversized decompressed streams', async () => {
  for (const response of [
    new Response('blocked',{ status: 403 }),
    new Response('blocked',{ headers: { 'cf-mitigated': 'challenge', 'content-type': 'text/html' } }),
    new Response('unknown',{ headers: { 'content-type': 'application/json' } }),
  ]) {
    const read = fetcher(signal,asFetch(async () => response),async () => {});
    await assert.rejects(read(at,at,true),Rejection);
  }
  const throttled = fetcher(signal, asFetch(async () => new Response(null, { status: 429 })), async () => {});
  await assert.rejects(throttled(at,at,true), error => (error as Rejection).code === 'store-limited');
  const chunks = new ReadableStream({ start(c) { c.enqueue(new Uint8Array(MAX_HTML_BYTES + 1)); c.close(); } });
  const read = fetcher(signal,asFetch(async () => new Response(chunks, { headers: { 'content-type':'text/html' } })),async () => {});
  const response = await read(at,at,true);
  assert.equal((await response.document.arrayBuffer()).byteLength,MAX_HTML_BYTES);
  assert.equal(response.isPartial(),true);
});

test('leaves product answers open on homepage-only evidence and excludes absent campaign tactics', () => {
  const home = evidence();
  const report = evaluate(home,{homepage:home},[{kind:'homepage',path:'/',status:'read'}],time);
  assert.ok(report.shopping.some(item => item.result === 'Could not confirm'));
  assert.equal(report.recommendations.length,0);
  assert.equal(report.categories.find(c=>c.category==='seasonal')?.assessed,0);
  assert.equal(report.categories.find(c=>c.category==='mobile')?.passed,3);
});

test('rejects misleading candidate types and applies the same calculation regardless of ownership', () => {
  assert.equal(verifies(evidence({url:new URL('/products/a',at)}),'product',true),false);
  const collection = evidence({collectionTemplate:true,candidates:[{path:'/products/a',kind:'product',quality:2}]});
  assert.equal(verifies(collection,'collection',true),true);
  const product = evidence({url:new URL('/products/a',at),platform:'Shopify',productSchema:true,
    purchase:true, productImage:{alt:false,sized:false}, offers:[
      {price:'100', priceCurrency:'INR'}, {price:'50',priceCurrency:'ZZZ', validFrom:'2026-11-28', validThrough:'2026-11-27'},
    ], insecureCart:true });
  const home = evidence({lang:false,viewport:'width=device-width, user-scalable=no',description:false});
  assert.equal(verifies(product,'product',true),true);
  const result = evaluate(home,{homepage:home,product,collection},[],time);
  assert.ok(result.recommendations.length>0 && result.recommendations.length<=3);
  assert.equal(new Set(result.recommendations.map(f=>f.category)).size,result.recommendations.length);
  const other = {...home,url:new URL('https://other.example.com')};
  assert.deepEqual(evaluate(other,{homepage:other,product,collection},[],time).overall,result.overall);
  assert.ok(result.recommendations.every(f=>f.evidence && f.change && f.why && f.confidence && f.effort));
});



test('prefix scans do not flag content missing beyond the byte limit', () => {
  const home = evidence({ complete:false, title:'', description:false, headings:0, viewport:null, main:true });
  const report = evaluate(home,{ homepage:home },[{kind:'homepage',path:'/',status:'partial'}],time);
  assert.equal(report.recommendations.length,0);
  assert.ok(report.shopping.some(item => item.result === 'Could not confirm'));
});


test('template features alone earn no product credit on a homepage-only scan', () => {
  const home = evidence({ candidates:[{kind:'product',path:'/products/a',quality:2}],
    links:new Set(['about','shipping','returns','contact','privacy','cart']), search:true });
  const report = evaluate(home, {homepage:home}, [], time);
  assert.equal(assessment(report).minimum,0);
  assert.equal(assessment(report).maximum,100);
  assert.equal(report.shopping.filter(item => item.result === 'Could not confirm').length,7);
  assert.equal(verifies(evidence({candidates:[],links:new Set(['cart'])}),'homepage'),false);
});

test('gives the earned points and possible final score for every combination of seven shopping answers', () => {
  for (let passed = 0; passed <= 7; passed++) {
    for (let issues = 0; issues <= 7 - passed; issues++) {
      const shopping = Array.from({ length: 7 }, (_, i): ShoppingCheck => ({
        title: String(i), detail: '', result: i < passed ? 'Confirmed' : i < passed + issues ? 'Needs attention' : 'Could not confirm',
      }));
      const score = assessment({ shopping });
      const open = 7 - passed - issues;
      assert.deepEqual([score.passed, score.issues, score.open], [passed, issues, open]);
      assert.equal(score.minimum, Math.round(100 * passed / 7));
      assert.equal(score.maximum, Math.round(100 * (7 - issues) / 7));
      assert.equal(score.partial, open > 0);
      assert.equal(score.minimum === score.maximum, !open);
    }
  }
});
