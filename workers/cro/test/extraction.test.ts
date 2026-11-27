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
    "if (scenario === '/challenge' && url.pathname === pdp || scenario === '/closed-collection' && url.pathname === collection) return {url, isPartial: () => false, document:new Response('<html><head><title>Verify you are human</title></head><body>Security check</body></html>',{headers:{'content-type':'text/html'}})};",
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
    for (const [scenario, path] of [['challenge','/products/linen-bag'],['closed-collection','/collections/bags']]) {
      const attempted = await mf.dispatchFetch('http://fixture.test/' + scenario + '?page=' + encodeURIComponent(path));
      assert.equal(attempted.status,200);
      const partial = await attempted.json();
      assert.deepEqual(partial.visited,['/',path]);
      assert.ok(partial.result.samples.some(s => s.path === path && s.status === 'blocked'));
      assert.equal(partial.result.shopping[1].result,'Could not confirm');
    }
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
      return new Response('<html><body><main><h1>Shop</h1><a href="/products/tote">Tote</a><a href="/cart">Cart</a></main></body></html>',
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


test('only the local launch setting and loopback host select preview quotas', async () => {
  const mf = await fixture(`
    import scanner from './src/index';
    export default { async fetch(request) {
      const origin = 'https://tool.example.com';
      const enabled = request.headers.get('x-test-config') === 'preview';
      const budget = {
        idFromName: name => name,
        get: name => ({ fetch: async (_, init) => Response.json({
          error:'limited', scope:'visitor', retryAfter:60, name, preview:JSON.parse(init.body).preview
        }, {status:429, headers:{'retry-after':'60'}}) }),
      };
      return scanner.fetch(request,{LOCAL_PREVIEW: enabled ? 'true' : undefined,
        ALLOWED_ORIGINS:origin, SCAN_BUDGET:budget});
    }};
  `);
  try {
    for (const [host, enabled, preview] of [
      ['localhost', true, true], ['localhost', false, false], ['tool.example.com', true, false],
    ] as const) {
      const response = await mf.dispatchFetch('https://' + host + '/scan', {
        method:'POST', headers:{origin:'https://tool.example.com', 'content-type':'application/json',
          'cf-connecting-ip':'192.0.2.1', 'x-test-config':enabled ? 'preview' : 'public'},
        body:JSON.stringify({url:'https://shop.example.com', preview:true}),
      });
      assert.equal(response.status,429);
      assert.equal(response.headers.get('retry-after'),'60');
      assert.deepEqual(await response.json(), { error:'limited', scope:'visitor', retryAfter:60,
        name:preview ? 'local-preview-v1' : 'public-scan-v1', preview });
    }
  } finally { await mf.dispose(); }
});


test('homepage answers require named destinations, a matching item price and explicit store terms', async () => {
  const mf = await fixture(`
    import { extract } from './src/extract';
    import { shoppingChecks } from './src/shopping';
    export default { async fetch(request) {
      const home = await extract(new Response(await request.text()), new URL('https://merchant.example.com/en'), 'homepage');
      return Response.json(shoppingChecks(home, undefined, '/products/bag'));
    }};
  `);
  async function run(html: string) {
    const reply = await mf.dispatchFetch('http://fixture.test/', {method:'POST', body:'<body><main>' + html + '</main></body>'});
    assert.equal(reply.status,200);
    return (await reply.json() as {result:string}[]).map(answer => answer.result === 'Confirmed');
  }
  const link = '<a href="/products/bag">Linen bag</a>';
  const price = '<span class="price">$42</span>';
  const listing = (html: string) => '<article class="product-card">' + html + '</article>';
  const visible = listing(link + price) + '<p>Free shipping on orders over $50.</p><p>30-day returns</p>' +
    '<a href="https://help.merchant.example.com/en">Contact us</a>';
  try {
    assert.deepEqual(await run(visible), [true,false,true,false,true,true,true]);
    assert.equal((await run('<p>Delivery fee: $5.00 per order.</p>'))[4],true);
    assert.equal((await run('<p>Shipping options on orders over $50.</p>'))[4],false);
    assert.deepEqual(await run('<div hidden>' + visible + '</div><blockquote><p>30-day returns</p></blockquote>' +
      '<a href="https://help.merchant.example.com.other.test/">Contact us</a><a href="/returns">Return policy</a>' +
      '<a href="/products/bag"></a><p>Is shipping free?</p>'), Array(7).fill(false));
    assert.equal((await run(listing(link + '<a href="/products/shoes">Shoes</a>' + price)))[2],false);
    assert.equal((await run(listing('<a href="/products/shoes">Shoes</a>' + price)))[2],false);
    assert.equal((await run(listing(link + '<span class="price price--compare">$65</span>')))[2],false);
    assert.equal((await run(listing(link + '<span class="price">You save $12</span>')))[2],false);
    assert.equal((await run(listing(link + '<span class="price">-$12</span>')))[2],false);
  } finally { await mf.dispose(); }
});

test('shopping scores track what an item page actually tells shoppers', async () => {
  const mf = await fixture(`
    import { extract } from './src/extract';
    import { shoppingChecks } from './src/shopping';
    export default { async fetch(request) {
      const origin = new URL('https://merchant.example.com/');
      const home = await extract(new Response('<main><a href="/contact">Contact us</a></main>'), origin);
      const product = await extract(new Response(await request.text()), new URL('/products/bag',origin));
      return Response.json(shoppingChecks(home, product));
    }};
  `);
  const run = async (html: string) => {
    const reply = await mf.dispatchFetch('http://fixture.test/', {method:'POST', body:'<body><main>' + html + '</main></body>'});
    assert.equal(reply.status,200);
    return (await reply.json()) as {title:string;result:string}[];
  };
  const details = '<div class="product__description">A linen bag with an inside pocket and a 40 cm strap.</div>';
  const price = '<span class="price">$42</span>';
  const buy = '<button name="add">Add to cart</button>';
  const policies = '<p>Ships in 3 days.</p><p>Returns within 30 days.</p>';
  const wrap = (body: string) => '<section class="product__info-container">' + body + '</section>';
  try {
    const bare = await run(wrap('<h1>Bag</h1><meta itemprop="price" content="42"><a href="/shipping">Shipping policy</a>'));
    assert.equal(bare.filter(check => check.result === 'Confirmed').length,2);
    const misleading = await run(wrap('<div hidden>' + details + price + policies + '</div>' +
      '<aside>' + price + '</aside><button name="add" disabled>Add to cart</button><del>' + price + '</del>'));
    assert.deepEqual(misleading,bare);
    const unfinished = await run(wrap('<div class="product__description">Coming soon</div><span class="price">TBD</span>'));
    assert.equal(unfinished.filter(check => check.result === 'Needs attention').length,2);
    const complete = await run(wrap(details + price + buy + policies));
    assert.deepEqual(complete.map(check => check.result), Array(7).fill('Confirmed'));
    const customLayout = await run('<article class="product type-product">' + details + '<del>$50</del>' + price + buy + policies + '</article>');
    assert.deepEqual(customLayout,complete);
    const extras = await run('<article class="product type-product"><table><tr><td><span class="price">$50</span></td></tr></table>' +
      '<p>We do not offer free shipping.</p><p>Is delivery free?</p><button name="add" class="disabled">Add to cart</button></article>');
    assert.deepEqual(extras,bare);
    const templateOnly = await run(
      '<div itemprop="description">Our company sends orders all around the world.</div>' +
      wrap('<div class="product__summary"><h1>Shopping bag</h1><span class="price">You save $12</span>' +
        '<fieldset disabled><button name="add">Add to cart</button></fieldset></div>')
    );
    assert.deepEqual(templateOnly,bare);
    const saving = await run(wrap('<span class="price">You save <span class="woocommerce-Price-amount">$12</span></span>'));
    assert.equal(saving[2].result,'Could not confirm');
    const combinedPrice = await run(wrap('<span class="price">Was $60, now $42</span>'));
    assert.equal(combinedPrice[2].result,'Confirmed');
    const inputBuy = await run(wrap('<input type="submit" name="add" value="Add to bag"/>'));
    assert.equal(inputBuy[3].result,'Confirmed');
    const oldPrice = '<del><span class="price">$60</span></del>';
    const announced = (text: string) => '<span class="screen-reader-text">' + text + '</span>';
    const sale = await run(wrap(oldPrice + announced('Original price was: $60. Current price is: $42.')));
    assert.equal(sale.find(check => check.title === 'See the item price')?.result,'Confirmed');
    const expired = await run(wrap(oldPrice + announced('Original price was: $60.')));
    assert.equal(expired.find(check => check.title === 'See the item price')?.result,'Could not confirm');
    const withoutMarketing = await run(wrap(details + price + buy + policies + '<p>Gift wrapping available</p>'));
    assert.deepEqual(complete,withoutMarketing);
  } finally { await mf.dispose(); }
});
