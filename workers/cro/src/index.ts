import type { ScanError } from '../../../lib/cro/model';
import { ScanBudget } from './budget';
import { scan } from './scan';
import { merchantKey, Rejection, storeEntry } from './target';

export { ScanBudget };
interface Env {
  ALLOWED_ORIGINS: string;
  SCAN_BUDGET: DurableObjectNamespace<ScanBudget>;
}
const maximumInput = 2300;
const reportCache = 20 * 60;
const errors: Record<ScanError, number> = {
  invalid: 400, blocked: 422, unverified: 422,
  unavailable: 502, timeout: 504, limited: 429, busy: 503,
};
const encoder = new TextEncoder();

async function hash(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, '0')).join('');
}

async function input(request: Request, deadline: AbortSignal) {
  if (!request.body || Number(request.headers.get('content-length')) > maximumInput) throw new Rejection('invalid');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: false });
  let bytes = 0, raw = '';
  const abort = () => { void reader.cancel().catch(() => {}); };
  deadline.addEventListener('abort',abort,{once:true});
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > maximumInput) { void reader.cancel().catch(() => {}); throw new Rejection('invalid'); }
      raw += decoder.decode(chunk.value, { stream: true });
    }
    const value: unknown = JSON.parse(raw + decoder.decode());
    if (typeof value !== 'object' || !value || !('url' in value) || typeof value.url !== 'string') throw new Rejection('invalid');
    return storeEntry(value.url);
  } catch { throw new Rejection('invalid'); }
  finally { deadline.removeEventListener('abort',abort); reader.releaseLock(); }
}

function headers(origin: string) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '600',
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex, nofollow',
    vary: 'Origin',
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin') ?? '';
    const defaults = headers(origin);
    const reject = (error: ScanError) => Response.json({ error }, { status: errors[error], headers: defaults });
    if (url.pathname !== '/scan' || url.search) {
      return new Response(null,{ status: 404, headers: { 'x-robots-tag': 'noindex' } });
    }
    if (!origin || !env.ALLOWED_ORIGINS?.split(',').map(x => x.trim()).includes(origin)) {
      return new Response(null,{ status: 403, headers: { 'x-robots-tag': 'noindex' } });
    }
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: defaults });
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...defaults, allow: 'POST, OPTIONS' } });
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') ?? '')) return reject('invalid');

    const deadline = AbortSignal.any([request.signal, AbortSignal.timeout(17_000)]);
    try {
      const target = await input(request, deadline);
      if (deadline.aborted) return reject('timeout');
      if (merchantKey(target) === merchantKey(url)) return reject('invalid');
      const ip = request.headers.get('cf-connecting-ip') ||
        (/^(localhost|127\.0\.0\.1)$/.test(url.hostname) ? 'local-dev' : '');
      if (!ip) return reject('busy');
      const [visitor, merchant, bucket] = await Promise.all([
        hash(new Date().toISOString().slice(0,10) + '|' + ip), hash(merchantKey(target)), hash(target.origin),
      ]);
      const key = new Request(new URL('/cache/cro-v1/' + bucket, url));
      const cached = await caches.default.match(key).catch(() => undefined);
      const limiter = env.SCAN_BUDGET.get(env.SCAN_BUDGET.idFromName('public-scan-v1'));
      const allowance = await limiter.fetch('https://budget.internal/reserve', {
        method: 'POST', body: JSON.stringify({ visitor, merchant, cacheHit: Boolean(cached) }), signal: deadline,
      });
      if (allowance.status === 429) return reject('limited');
      if (!allowance.ok) return reject('busy');
      if (cached) return new Response(cached.body, { headers: defaults });
      const report = await scan(target, deadline);
      const body = JSON.stringify(report);
      if (report.samples.every(sample => sample.status !== 'unavailable' && sample.status !== 'blocked')) {
        ctx.waitUntil(caches.default.put(key, new Response(body, {
          headers: { 'content-type': defaults['content-type'], 'cache-control': 'public, max-age=' + reportCache },
        })).catch(() => {}));
      }
      return new Response(body, { headers: defaults });
    } catch (error) {
      if (deadline.aborted) return reject('timeout');
      return reject(error instanceof Rejection ? error.code : 'busy');
    }
  },
} satisfies ExportedHandler<Env>;
