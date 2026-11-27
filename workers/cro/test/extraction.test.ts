import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';

async function fixture(worker: string) {
  const bundle = await build({ stdin:{ contents:worker,resolveDir:process.cwd(),loader:'js' },
    format:'esm', target:'es2022', bundle:true, write:false, external:['cloudflare:workers'] });
  return new Miniflare({ workers: [{
    config:{ name:'cro-fixture', compatibilityDate:'2026-11-24',
    manifest:{ mainModule:'index.js', modulesRoot:process.cwd(), modules:{
      'index.js':{ type:'esm', contents:bundle.outputFiles[0].text },
    } } },
  }] });
}

test('Cloudflare HTMLRewriter validates Shopify and WooCommerce fixture journeys', async () => {
  const worker = [
    "import { scan } from './src/scan';",
    "export default { async fetch(request) {",
    "const scenario = new URL(request.url).pathname;",
    "const woo = scenario === '/woo';",
    "const origin = new URL(woo ? 'https://woo.example.com' : 'https://shopify.example.com');",
    "const pdp = woo ? '/product/linen-bag/' : '/products/linen-bag';",
    "const collection = woo ? '/product-category/bags/' : '/collections/bags';",
    "const visited = [];",
    "const entry = new URL(new URL(request.url).searchParams.get('page') || '/', origin);",
    "try { const result = await scan(entry, new AbortController().signal, async url => {",
    "visited.push(url.pathname);",
    "const common = '<html lang=\"en\"><head><title>Fixture shop</title><meta name=\"description\" content=\"Linen accessories\"><meta name=\"viewport\" content=\"width=device-width\"><meta name=\"generator\" content=\"' + (woo ? 'WooCommerce' : 'Shopify') + '\"></head>';",
    "let html = '';",
    "if (url.pathname === '/') html = '<body><nav><a href=\"'+collection+'\">Bags</a><a href=\"/contact\">Contact</a><a href=\"/cart\">Cart</a></nav><main><h1>Linen shop</h1><a href=\"'+pdp+'\">Bag</a></main>';",
    "if (url.pathname === pdp) html = '<body class=\"'+(woo?'single-product':'template-product')+'\"><main><h1>Linen bag</h1><img class=\"product__media-image\" src=\"/bag.jpg\" width=\"600\" height=\"400\" alt=\"\"><button name=\"add-to-cart\">Add to cart</button><script type=\"application/ld+json\">'+JSON.stringify({'@type':'Product',image:'/bag.jpg',offers:{price:'30',priceCurrency:'USD'}})+'</script></main>';",
    "if (url.pathname === collection) html = '<body class=\"'+(woo?'tax-product_cat':'template-collection')+'\"><main><h1>Bags</h1><a href=\"'+pdp+'\">Linen bag</a></main>';",
    "if (url.pathname === '/') html += '<script src=\"/cdn-cgi/challenge-platform/scripts/jsd/api.js\"></script>';",
    "if (scenario === '/deep' && url.pathname === '/') html = html.replace(pdp, '/products/another-bag');",
    "if (!html) throw new Error('Unexpected request');",
    "if (scenario === '/challenge' && url.pathname === pdp) return {url, isPartial: () => false, document:new Response('<html><head><title>Verify you are human</title></head><body>Security check</body></html>',{headers:{'content-type':'text/html'}})};",
    "return {url, isPartial: () => false, document:new Response(common+html+'</body></html>',{headers:{'content-type':'text/html'}})};",
    "}); return Response.json({result, visited}); } catch (error) { return Response.json({error:error.code, visited},{status:422}); } } };",
  ].join('\n');
  const mf = await fixture(worker);
  try {
    for (const path of ['shopify','woo']) {
      const http = await mf.dispatchFetch('http://fixture.test/' + path);
      assert.equal(http.status,200);
      const { result, visited } = await http.json();
      assert.equal(result.platform,path === 'woo' ? 'WooCommerce' : 'Shopify');
      assert.deepEqual(result.samples.map(s=>s.status),['read','read','read']);
      assert.equal(visited.length,3);
      assert.ok(!visited.includes('/cart'));
      assert.ok(result.recommendations.some(r=>r.id==='product-image-alt'));
    }
    const submit = (path: string) => mf.dispatchFetch('http://fixture.test/deep?page=' + encodeURIComponent(path));
    for (const path of ['/products/linen-bag', '/collections/bags']) {
      const response = await submit(path);
      assert.equal(response.status, 200);
      const { result, visited } = await response.json();
      assert.ok(result.samples.some(sample => sample.path === path && sample.status === 'read'));
      assert.deepEqual(visited.slice(0, 2), ['/', '/collections/bags']);
    }
    const missing = await submit('/products/missing-bag');
    assert.equal(missing.status, 422);
    const rejected = await missing.json();
    assert.equal(rejected.error, 'unsampled');
    assert.equal(rejected.result, undefined);
    assert.deepEqual(rejected.visited, ['/', '/collections/bags']);
    const challenge = await mf.dispatchFetch('http://fixture.test/challenge');
    assert.equal(challenge.status, 200);
    const { result, visited } = await challenge.json();
    assert.deepEqual(result.samples.map(s => s.status), ['read', 'blocked', 'skipped']);
    assert.deepEqual(visited, ['/', '/products/linen-bag']);
  } finally { await mf.dispose(); }
});


test('two submissions to the Worker read the same storefront independently', async () => {
  const mf = await fixture(`
    import scanner from './src/index';
    let reads = 0;
    globalThis.fetch = async input => {
      const url = new URL(input);
      if (url.hostname === 'cloudflare-dns.com') {
        const Answer = url.searchParams.get('type') === '1' ? [{ type:1, data:'93.184.216.34' }] : [];
        return Response.json({ Status:0, Answer });
      }
      if (url.href !== 'https://shop.example.com/') throw new Error('Unexpected URL');
      reads++;
      if (reads > 1) return new Response(null, {status:403});
      return new Response('<html><body><main><h1>Shop</h1><a href="/cart">Cart</a></main></body></html>',
        {headers:{'content-type':'text/html'}});
    };
    const budget = { idFromName: () => 'test', get: () => ({ fetch: async () => new Response(null,{status:204}) }) };
    export default { async fetch(request, env, ctx) {
      return scanner.fetch(request, { ALLOWED_ORIGINS:'https://tool.example.com', SCAN_BUDGET:budget }, ctx);
    }};
  `);
  const submit = () => mf.dispatchFetch('http://localhost/scan', {
    method:'POST', headers:{ origin:'https://tool.example.com', 'content-type':'application/json' },
    body:JSON.stringify({ url:'https://shop.example.com' }),
  });
  try {
    const first = await submit();
    assert.equal(first.status, 200);
    assert.equal((await first.json()).samples[0].status, 'read');
    const second = await submit();
    assert.equal(second.status, 422);
    assert.deepEqual(await second.json(), {error:'denied'});
  } finally { await mf.dispose(); }
});
