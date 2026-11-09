const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('components/MetaPixel.tsx','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 } }).outputText;
function harness(host) {
  let slots=[], cursor=0, pending=[], dirty=false, output, path='/', events=[], handlers=new Map();
  const hooks = {
    useState(initial) { const id=cursor++; if (!(id in slots)) slots[id]=initial; return [slots[id], value=>{ if(slots[id]!==value){slots[id]=value;dirty=true;} }]; },
    useRef(initial) { const id=cursor++; if(!(id in slots))slots[id]={current:initial}; return slots[id]; },
    useEffect(callback,deps) { const id=cursor++; const old=slots[id]; if(!old || deps.some((v,i)=>!Object.is(v,old.deps[i]))){slots[id]={deps};pending.push(()=>{old?.cleanup?.();slots[id].cleanup=callback();});} },
  };
  class Element { constructor(href='',dataset={}){this.href=href;this.dataset=dataset;} closest(selector){return selector==='a[href]' ? this : null;} getAttribute(){return this.href;} }
  class Details extends Element { constructor(open){super();this.open=open;} closest(){return true;} querySelector(){return {firstChild:{textContent:'What does Cascon do?'}};} }
  const modules = {
    react: hooks, 'react/jsx-runtime': {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})},
    'next/navigation': {usePathname:()=>path}, 'next/script': {default:'Script'},
    '@/lib/fpixel': { FB_PIXEL_ID:'1234', pageview:()=>events.push(['track','PageView']), trackEvent:(n,p)=>events.push(['track',n,p]),trackCustomEvent:(n,p)=>events.push(['custom',n,p]) },
    '@/lib/constants': {CAL_LINK:'https://cal.com/cascon-haw2fz/15min'},
    '@/data/services': {services:[{id:'shopify',name:'Shopify Development'}]},
  };
  const context={exports:{},require:name=>{assert.ok(modules[name],name);return modules[name];},window:{location:{hostname:host}},document:{addEventListener:(name,handler)=>handlers.set(name,handler),removeEventListener:name=>handlers.delete(name)},Element,HTMLDetailsElement:Details};
  vm.runInNewContext(code,context);
  function render(){do{dirty=false;cursor=0;output=context.exports.default();const effects=pending;pending=[];effects.forEach(f=>f());}while(dirty);return output;}
  return {render, ready(){output.props.onReady();render();}, route(value){path=value;render();}, click(href,dataset){handlers.get('click')({target:new Element(href,dataset)});}, toggle(open){handlers.get('toggle')({target:new Details(open)});},events};
}
const local=harness('localhost');assert.equal(local.render(),null);assert.equal(local.events.length,0);
const site=harness('www.cascondigital.com');site.render();site.ready();site.render();assert.equal(site.events.filter(e=>e[1]==='PageView').length,1);
site.route('/services');site.render();assert.equal(site.events.filter(e=>e[1]==='PageView').length,2);assert.equal(site.events.filter(e=>e[1]==='ViewContent').length,1);
site.click('https://wa.me/918281663376');site.click('mailto:private@example.com');site.click('tel:+910000000000');site.click('https://cal.com/cascon-haw2fz/15min');site.click('https://example.com',{project:'Bagus'});site.click('https://chatgpt.com/',{aiProvider:'ChatGPT'});site.click('/services#shopify');site.toggle(false);site.toggle(true);
const eventNames=site.events.map(e=>e[1]);
for(const expected of ['Contact','BookingLinkClick','ProjectOutboundClick','FAQExpand','AIOutboundClick'])assert.ok(eventNames.includes(expected),expected);
assert.equal(eventNames.filter(n=>n==='Contact').length,3);assert.equal(eventNames.filter(n=>n==='FAQExpand').length,1);
assert.ok(site.events.some(e=>e[1]==='Contact' && e[2]?.contact_method==='whatsapp'));
assert.ok(!eventNames.some(n=>['Lead','Schedule','Purchase'].includes(n)));
assert.ok(!JSON.stringify(site.events).includes('private@example.com'));
console.log('PASS pixel initialization, route deduplication, local suppression, contact intent, service interest, portfolio clicks and FAQ events');
