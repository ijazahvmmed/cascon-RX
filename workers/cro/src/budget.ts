import { DurableObject } from 'cloudflare:workers';

import { scan } from './scan';
import { storeEntry, Rejection, fetcher } from './target';

import { enhance } from './advice';
import { inspectWidths, prepareCapture } from './viewport';

interface Resources {
  REPORT_CACHE?: KVNamespace;
  SCAN_BUDGET:DurableObjectNamespace;
  AI?:Ai;
  BROWSER?:BrowserRun;
  FREE_ENRICHMENT?:string;
}
async function bounded<T>(work:Promise<T>, fallback:T, ms:number) {
  let timer:ReturnType<typeof setTimeout> | undefined;
  try {return await Promise.race([work.catch(()=>fallback),new Promise<T>(resolve=>{timer=setTimeout(()=>resolve(fallback),ms);})]);}
  finally {if (timer !== undefined) clearTimeout(timer); }
}
export class ScanBudget extends DurableObject<Resources> {
  private async reserve(resource:'browser'|'ai') {
    const ledger=this.env.SCAN_BUDGET.get(this.env.SCAN_BUDGET.idFromName('enrichment-budget'));
    return ledger.fetch('https://internal/'+resource,{method:'POST'}).then(r=>r.ok,()=>false);
  }
  private flight?: Promise<string>;
  private async analyze(url:string, key:string) {
    const cache = this.env.REPORT_CACHE;
    if (!cache) throw new Error('Missing cache');
    const local = await this.ctx.storage.get<{expires:number;body:string}>('summary');
    if (local && local.expires > Date.now()) return local.body;
    const pause = await this.ctx.storage.get<number>('merchantPause');
    if (pause && pause > Date.now()) {
      throw new Rejection('store-limited', Math.ceil((pause - Date.now()) / 1000));
    }
    const enabled=this.env.FREE_ENRICHMENT === 'verified-free';
    let privateEvidence:unknown;
    let html='';
    const deadline = AbortSignal.timeout(17000);
    const read = fetcher(deadline);
    const reading = scan(storeEntry(url), deadline, read,undefined,
      enabled && this.env.BROWSER ? value=>{html=value;} : undefined, evidence=>{privateEvidence=evidence;});
    const original = await reading.catch(async error => {
      if (error instanceof Rejection && error.code === 'store-limited') {
        // If the merchant gave no time, wait at least a minute before fetching again.
        const seconds = Math.max(60, Math.min(error.retryAfter ?? 60, 2147483647));
        const until = Date.now() + seconds * 1000;
        await this.ctx.storage.put('merchantPause', until);
        await this.ctx.storage.setAlarm(until);
        throw new Rejection(error.code, seconds);
      }
      throw error;
    });
    const browserAllowed = Boolean(enabled && html && this.env.BROWSER && await this.reserve('browser'));
    const [viewports,enhanced]=await Promise.all([
      browserAllowed && this.env.BROWSER ?
        bounded((original.samples.some(sample => sample.status === 'blocked' || sample.status === 'rate limited')
          ? Promise.resolve(html) : prepareCapture(html,new URL(original.store),read))
          .then(page => inspectWidths(this.env.BROWSER!,page)),[],22500) : [],
      enabled && original.recommendations.length && this.env.AI && await this.reserve('ai') ?
        bounded(enhance(original,this.env.AI,'granite'),original,3500) : original
    ]);
    const screenshotStatus = viewports.some(view => view.screenshot) ? 'captured'
      : enabled && html && this.env.BROWSER && !browserAllowed ? 'capacity' : 'unavailable';
    const report = {...enhanced,viewports,screenshotStatus};
    const body = JSON.stringify(report);
    const expires = Date.now()+86400000;
    await this.ctx.storage.put({summary:{expires,body},review:{expires,evidence:privateEvidence}});
    await this.ctx.storage.setAlarm(expires);
    await cache.put(key,body,{expirationTtl:86400}).catch(() => {});
    return body;
  }
  async alarm() {
    const entry = await this.ctx.storage.get<{expires:number}>('summary');
    const pause = await this.ctx.storage.get<number>('merchantPause');
    if (pause && pause <= Date.now()) await this.ctx.storage.delete('merchantPause');
    if (entry && entry.expires <= Date.now()) await this.ctx.storage.delete(['summary','review']);
  }
  async fetch(request: Request) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    const path=new URL(request.url).pathname;
    if (path==='/review') {
      const review=await this.ctx.storage.get<{expires:number;evidence:unknown}>('review');
      return review && review.expires>Date.now() ? Response.json(review) : new Response(null,{status:404});
    }
    if (path==='/browser' || path==='/ai') {
      const day=Math.floor(Date.now()/86400000);
      const ok=this.ctx.storage.transactionSync(()=>{
        const sql=this.ctx.storage.sql;
        sql.exec('CREATE TABLE IF NOT EXISTS allowances (resource TEXT PRIMARY KEY, day INTEGER, used INTEGER)');
        const row=sql.exec<{day:number;used:number}>('SELECT day,used FROM allowances WHERE resource=?',path).toArray()[0];
        if(path==='/browser'){
          sql.exec('CREATE TABLE IF NOT EXISTS browser_slot (id INTEGER PRIMARY KEY, next INTEGER)');
          const slot=sql.exec<{next:number}>('SELECT next FROM browser_slot WHERE id=1').toArray()[0];
          if(slot && slot.next>Date.now()) return false;
          sql.exec('INSERT OR REPLACE INTO browser_slot VALUES(1,?)',Date.now()+30000);
        }
        const used=row?.day===day ? row.used : 0;
        // Keep the daily capture windows below ten minutes.
        if (used >= (path === '/browser' ? 24 : 60)) return false;
        sql.exec('INSERT OR REPLACE INTO allowances VALUES (?,?,?)',path,day,used+1);
        return true;
      });
      return new Response(null,{status:ok?204:429});
    }
    if (path === '/analyze') {
      const {url,cacheKey} = await request.json<{url:string;cacheKey:string}>();
      this.flight ??= this.analyze(url,cacheKey).finally(() => { this.flight = undefined; });
      try { return new Response(await this.flight); }
      catch (error) {
        if (error instanceof Rejection && error.code === 'store-limited') {
          return Response.json({error:error.code, retryAfter:error.retryAfter},{status:429});
        }
        return Response.json({error:error instanceof Rejection ? error.code : 'unavailable'},{status:422});
      }
    }
    if (path === '/release') {
      const grant = await request.text();
      this.ctx.storage.transactionSync(() => {
        const sql = this.ctx.storage.sql;
        const [slot] = sql.exec<{counter: string}>('SELECT counter FROM visitor_grants WHERE id = ?', grant).toArray();
        if (!slot) return;
        sql.exec('UPDATE counters SET n = n - 1 WHERE id = ? AND n > 0', slot.counter);
        sql.exec('DELETE FROM visitor_grants WHERE id = ?', grant);
      });
      return new Response(null, {status:204});
    }
    if (path !== '/reserve') return new Response(null, {status:404});
    const { visitor, merchant, network, preview } = await request.json<{visitor: string; network:string; merchant: string; preview?: boolean}>();
    if (![visitor, merchant, network].every(value => /^[a-f0-9]{64}$/.test(value))) {
      return new Response(null, { status: 400 });
    }
    const now = Date.now();
    const sql = this.ctx.storage.sql;
    const minute = 60_000;
    const period = 24 * 60 * minute;
    const dailyStart = Math.floor(now / period) * period;
    const shortWindow = 10 * minute;
    const windowStart = Math.floor(now / shortWindow) * shortWindow;
    const limits: [key: string, expiry: number, limit: number, scope: string][] = [
      ['day:' + dailyStart, dailyStart + period, 3000, 'daily'],
      ['scan:' + dailyStart, dailyStart + period, 600, 'daily'],
      ['site:' + dailyStart + ':' + merchant, dailyStart + period, 20, 'merchant'],
      ...(!preview ? [['visitor:' + dailyStart + ':' + visitor,dailyStart + period,3,'visitor'] as [string,number,number,string]] : []),
      ['ip:' + windowStart + ':' + network, windowStart + shortWindow, preview === true ? 30 : 6, 'network'],
    ];
    const grant = preview ? undefined : crypto.randomUUID();
    const blocked = this.ctx.storage.transactionSync(() => {
      sql.exec('CREATE TABLE IF NOT EXISTS counters (id TEXT PRIMARY KEY, n INTEGER NOT NULL, expiry INTEGER NOT NULL)');
      sql.exec('CREATE INDEX IF NOT EXISTS counters_expiry ON counters (expiry)');
      sql.exec('DELETE FROM counters WHERE expiry <= ?', now);
      for (const [key,expiry,limit,scope] of limits) {
        const count = sql.exec<{ n: number }>('SELECT n FROM counters WHERE id = ?', key).toArray()[0]?.n ?? 0;
        if (count >= limit) return { error: 'limited', scope, retryAfter: Math.ceil((expiry - now) / 1000) };
      }
      for (const [key,expiry] of limits) {
        sql.exec('INSERT INTO counters VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET n = n+1', key, expiry);
      }
      if (grant) {
        sql.exec('CREATE TABLE IF NOT EXISTS visitor_grants (id TEXT PRIMARY KEY, counter TEXT, expiry INTEGER)');
        sql.exec('DELETE FROM visitor_grants WHERE expiry <= ?', now);
        sql.exec('INSERT INTO visitor_grants VALUES (?, ?, ?)', grant, 'visitor:' + dailyStart + ':' + visitor, dailyStart + period);
      }
      return null;
    });
    if (blocked) return Response.json(blocked, { status: 429, headers: { 'retry-after': String(blocked.retryAfter) } });
    return new Response(null, { status: 204, headers: grant ? {'x-internal-grant':grant} : undefined });
  }
}
