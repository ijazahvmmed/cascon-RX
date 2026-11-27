import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';

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
    "const result = await scan(origin, new AbortController().signal, async url => {",
    "visited.push(url.pathname);",
    "const common = '<html lang=\"en\"><head><title>Fixture shop</title><meta name=\"description\" content=\"Linen accessories\"><meta name=\"viewport\" content=\"width=device-width\"><meta name=\"generator\" content=\"' + (woo ? 'WooCommerce' : 'Shopify') + '\"></head>';",
    "let html = '';",
    "if (url.pathname === '/') html = '<body><nav><a href=\"'+collection+'\">Bags</a><a href=\"/contact\">Contact</a><a href=\"/cart\">Cart</a></nav><main><h1>Linen shop</h1><a href=\"'+pdp+'\">Bag</a></main>';",
    "if (url.pathname === pdp) html = '<body class=\"'+(woo?'single-product':'template-product')+'\"><main><h1>Linen bag</h1><img class=\"product__media-image\" src=\"/bag.jpg\" width=\"600\" height=\"400\" alt=\"\"><button name=\"add-to-cart\">Add to cart</button><script type=\"application/ld+json\">'+JSON.stringify({'@type':'Product',image:'/bag.jpg',offers:{price:'30',priceCurrency:'USD'}})+'</script></main>';",
    "if (url.pathname === collection) html = '<body class=\"'+(woo?'tax-product_cat':'template-collection')+'\"><main><h1>Bags</h1><a href=\"'+pdp+'\">Linen bag</a></main>';",
    "if (!html) throw new Error('Unexpected request');",
    "if (scenario === '/challenge' && url.pathname === pdp) return {url, isPartial: () => false, document:new Response('<html><head><title>Verify you are human</title></head><body>Security check</body></html>',{headers:{'content-type':'text/html'}})};",
    "return {url, isPartial: () => false, document:new Response(common+html+'</body></html>',{headers:{'content-type':'text/html'}})};",
    "}); return Response.json({result, visited}); } };",
  ].join('\n');
  const bundle = await build({ stdin:{ contents:worker,resolveDir:process.cwd(),loader:'js' },
    format:'esm', target:'es2022', bundle:true, write:false });
  const mf = new Miniflare({ workers: [{
    config:{ name:'cro-fixture', compatibilityDate:'2026-11-24',
    manifest:{ mainModule:'index.js', modulesRoot:process.cwd(), modules:{
      'index.js':{ type:'esm', contents:bundle.outputFiles[0].text },
    } } },
  }] });
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
    const challenge = await mf.dispatchFetch('http://fixture.test/challenge');
    assert.equal(challenge.status, 200);
    const { result, visited } = await challenge.json();
    assert.deepEqual(result.samples.map(s => s.status), ['read', 'blocked', 'blocked']);
    assert.deepEqual(visited, ['/', '/products/linen-bag']);
  } finally { await mf.dispose(); }
});
