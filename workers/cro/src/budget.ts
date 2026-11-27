import { DurableObject } from 'cloudflare:workers';

export class ScanBudget extends DurableObject {
  async fetch(request: Request) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    const { visitor, merchant, preview } = await request.json<{visitor: string; merchant: string; preview?: boolean}>();
    if (![visitor, merchant].every(value => /^[a-f0-9]{64}$/.test(value))) {
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
      ['scan:' + dailyStart, dailyStart + period, 1200, 'daily'],
      ['site:' + dailyStart + ':' + merchant, dailyStart + period, 20, 'merchant'],
      ['ip:' + windowStart + ':' + visitor, windowStart + shortWindow, preview === true ? 30 : 6, 'visitor'],
    ];
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
      return null;
    });
    if (blocked) return Response.json(blocked, { status: 429, headers: { 'retry-after': String(blocked.retryAfter) } });
    return new Response(null, { status: 204 });
  }
}
