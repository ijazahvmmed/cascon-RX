import {execFileSync} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
import {models,advicePrompt,completion} from './src/advice.ts';
const account=process.argv[2];
if (!/^[a-f0-9]{32}$/.test(account)) throw Error('Supply the verified Free staging account ID');
const {token}=JSON.parse(execFileSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','auth','token','--json'],{encoding:'utf8'}));
const cases=[
  [['mobile-zoom','homepage','mobile'],['price-value','product','pricing']],
  [['collection-title','collection','collections']],
  [['home-heading','homepage','home'],['product-action','product','product']]
];
const results=[];
for(const model of Object.values(models)){
  for(const group of cases){
    const rows=group.map(([id,page,category])=>({id,page,category,allowed:category==='mobile'?['mobile',page]:[page,'skip']}));
    const start=Date.now();
    const reply=await fetch('https://api.cloudflare.com/client/v4/accounts/'+account+'/ai/run/'+model,{
      method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},
      signal:AbortSignal.timeout(20000),body:JSON.stringify({messages:advicePrompt(rows),temperature:0,max_tokens:160})});
    const json=await reply.json();let exact=false;
    try {exact=JSON.stringify(JSON.parse(completion(json.result)))===JSON.stringify(rows.map(r=>r.allowed[0]));}catch{}
    results.push({model,ids:rows.map(r=>r.id),http:reply.status,exact,ms:Date.now()-start});
    if(!reply.ok)break;
  }
}
await writeFile('model-benchmark.json',JSON.stringify(results,null,2));
console.table(results);
