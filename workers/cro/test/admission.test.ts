import { test } from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
import {identity} from '../src/admission';
import {applyAdvice} from '../src/advice';
import type {ScanReport} from '../../../lib/cro/model';

test('signed visitors expire and a modified cookie does not recover the old identity',async()=>{
  const secret='local-fake-signing-key'.repeat(2), now=1800000000000;
  const first=await identity('',secret,now), cookie=first.cookie!.split(';')[0];
  assert.equal((await identity(cookie,secret,now+1000)).id,first.id);
  assert.notEqual((await identity(cookie+'0',secret,now)).id,first.id);
  assert.notEqual((await identity(cookie,secret,now+31*86400000)).id,first.id);
});

test('model output can only select a reviewed follow-up',()=>{
  const report={recommendations:[{id:'mobile-zoom',page:'homepage',category:'mobile',change:'Allow zoom.'}],score:{minimum:71}} as ScanReport;
  assert.equal(applyAdvice(report,'["invent an issue"]'),report);
  const enhanced=applyAdvice(report,'["mobile"]');
  assert.equal(enhanced.score,report.score);
  assert.match(enhanced.recommendations[0].change,/phone/);
});

test('public admission coalesces cold requests, reuses a summary, and enforces the daily allowance',async()=>{
  const code=`
    import scanner,{ScanBudget} from './src/index';
    export {ScanBudget};
    let homes=0, pauses=0;
    globalThis.fetch=async(input,init)=>{
      const url=new URL(input);
      if(url.hostname==='challenges.cloudflare.com'){
        if(init.redirect!=='manual')throw new TypeError('Siteverify must use manual redirects');
        if(init.body.get('response')==='redirect')return new Response(null,{status:302});
        return Response.json({success:['valid','staging'].includes(init.body.get('response')),action:'cro_scan',hostname:init.body.get('response')==='staging'?'localhost':'tool.example.com'});
      }
      if(url.hostname==='cloudflare-dns.com')return Response.json({Status:0,Answer:url.searchParams.get('type')==='1'?[{type:1,data:'93.184.216.34'}]:[]});
      if(url.hostname==='pause-without-header.example.com')return new Response(null,{status:429});
      if(url.hostname==='paused.example.com'){pauses++;return new Response(null,{status:429,headers:{'retry-after':'300'}});}
      if(url.pathname==='/'){homes++;return new Response('<html><body><main><h1>Shop</h1><a href="/products/tote">Tote</a><a href="/cart">Cart</a></main></body></html>',{headers:{'content-type':'text/html'}});}
      return new Response(null,{status:403});
    };
    export default {async fetch(r,e,c){if(new URL(r.url).pathname==='/pauses')return Response.json(pauses);if(new URL(r.url).pathname==='/count')return Response.json(homes);return scanner.fetch(r,e,c);}};
  `;
  const bundle=await build({stdin:{contents:code,resolveDir:process.cwd()},bundle:true,format:'esm',write:false,external:['cloudflare:workers']});
  const mf=new Miniflare(convertV4MiniflareOptions({name:'admission',modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-11-24',kvNamespaces:['REPORT_CACHE'],
    durableObjects:{SCAN_BUDGET:{className:'ScanBudget',useSQLite:true}},
    bindings:{VISITOR_SECRET:'v'.repeat(40),TURNSTILE_SECRET:'fixture',ALLOWED_ORIGINS:'https://tool.example.com,http://localhost:3012',STAGING_TEST_ORIGIN:'http://localhost:3012'}}));
  const post=(token:string,cookie='',url='https://shop.example.com')=>mf.dispatchFetch('https://scanner.example.com/scan',{method:'POST',headers:{origin:token === 'staging' ? 'http://localhost:3012' : 'https://tool.example.com','content-type':'application/json',cookie,'cf-connecting-ip':(token === 'staging' || url.includes('pause-without-header')) ? '192.0.2.11' : '192.0.2.10'},body:JSON.stringify({url,token})});
  try{
    assert.equal((await post('bad')).status,403);
    assert.equal((await post('redirect')).status,403);
    const [first,parallel]=await Promise.all([post('valid'),post('valid')]);
    assert.equal(first.status,200);
    const report=await first.json();
    assert.deepEqual(await parallel.json(),report);
    assert.ok(report.score);assert.equal(report.review,undefined);
    const cookie=first.headers.get('set-cookie')!.split(';')[0];
    const paused=await post('valid',cookie,'https://paused.example.com');
    assert.equal(paused.status,429);
    assert.deepEqual(await paused.json(),{error:'store-limited',retryAfter:300});
    assert.equal((await post('valid',cookie,'https://paused.example.com')).status,429);
    assert.equal(await (await mf.dispatchFetch('https://scanner.example.com/pauses')).json(),1);
    const unannouncedPause = await post('valid',cookie,'https://pause-without-header.example.com');
    assert.equal(unannouncedPause.status,429);
    assert.deepEqual(await unannouncedPause.json(),{error:'store-limited',retryAfter:60});
    for(let i=0;i<2;i++)assert.deepEqual(await (await post('valid',cookie)).json(),report);
    assert.equal((await post('valid',cookie)).status,429);
    assert.equal(await (await mf.dispatchFetch('https://scanner.example.com/count')).json(),1);
    const privateTest = await post('staging',cookie);
    assert.equal(privateTest.status,200);
    assert.deepEqual(await privateTest.json(),report);
  }finally{await mf.dispose();}
});
