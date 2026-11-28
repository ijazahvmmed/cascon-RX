import { WorkerEntrypoint } from 'cloudflare:workers';
import type { ScanError, ScanUpdate } from '../../../lib/cro/model';
import { ScanBudget } from './budget';
import { scan } from './scan';
import { merchantKey, Rejection, storeEntry } from './target';

import { identity, challenge } from './admission';
export { ScanBudget };
interface Env {
  VISITOR_SECRET?: string;
  TURNSTILE_SECRET?: string;
  REPORT_CACHE?: KVNamespace;
  LOCAL_PREVIEW?: string;
  STAGING_TEST_ORIGIN?: string;
  EGRESS_URL?: string;
  CRO_RELAY_SECRET?: string;
  ALLOWED_ORIGINS: string;
  SCAN_BUDGET: DurableObjectNamespace<ScanBudget>;
}
const reportNamespace = 'cro-9-';
const maximumInput = 4600;
const errors: Record<ScanError, number> = {
  verification: 403, invalid: 400, denied: 422, 'store-limited': 429, blocked: 422, unverified: 422, unsampled: 422,
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
    return { target:storeEntry(value.url), token:'token' in value && typeof value.token === 'string' ? value.token : '' };
  } catch { throw new Rejection('invalid'); }
  finally { deadline.removeEventListener('abort',abort); reader.releaseLock(); }
}

function headers(origin: string) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-expose-headers': 'x-cro-cache',
    'access-control-max-age': '600',
    'access-control-allow-credentials': 'true',
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
    'x-content-type-options': 'nosniff',
    'x-robots-tag': 'noindex, nofollow',
    vary: 'Origin',
  };
}

// Only a separately authorized staff service can bind this named entrypoint.
export class ConsultationReports extends WorkerEntrypoint<Env> {
  async read(store:string) {
    const key=reportNamespace + await hash(storeEntry(store).href);
    const owner=this.env.SCAN_BUDGET.get(this.env.SCAN_BUDGET.idFromName(key));
    const reply=await owner.fetch('https://internal/review',{method:'POST'});
    return reply.ok ? reply.json() : null;
  }
}
export default {
  async fetch(request, env) {
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
    if (env.EGRESS_URL && (!env.CRO_RELAY_SECRET ||
      request.headers.get('authorization') !== 'Bearer ' + env.CRO_RELAY_SECRET)) return reject('verification');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: defaults });
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...defaults, allow: 'POST, OPTIONS' } });
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') ?? '')) return reject('invalid');

    const deadline = AbortSignal.any([request.signal, AbortSignal.timeout(17_000)]);
    try {
      const {target,token} = await input(request, deadline);
      if (deadline.aborted) return reject('timeout');
      if (merchantKey(target) === merchantKey(url)) return reject('invalid');
      const ip = (env.EGRESS_URL ? request.headers.get('x-cro-client-ip') : request.headers.get('cf-connecting-ip')) ||
        (/^(localhost|127\.0\.0\.1)$/.test(url.hostname) ? 'local-dev' : '');
      if (!ip) return reject('busy');
      const preview = env.LOCAL_PREVIEW === 'true' && ['localhost','127.0.0.1'].includes(url.hostname);
      if (!preview && (!env.VISITOR_SECRET || env.VISITOR_SECRET.length < 32 || !env.TURNSTILE_SECRET || !env.REPORT_CACHE)) return reject('busy');
      if (!preview && !await challenge(env.TURNSTILE_SECRET!,token,origin,ip,deadline)) return reject('verification');
      const user = preview ? {id:ip,cookie:undefined} : await identity(request.headers.get('cookie') || '',env.VISITOR_SECRET!);
      const [network, visitor, merchant] = await Promise.all([
        hash(new Date().toISOString().slice(0,10) + '|' + ip), hash(user.id), hash(merchantKey(target)),
      ]);
      const responseHeaders = new Headers(defaults);
      if (user.cookie) responseHeaders.set('set-cookie',user.cookie);
      const stagingTest = origin === env.STAGING_TEST_ORIGIN;
      const limiter = env.SCAN_BUDGET.get(env.SCAN_BUDGET.idFromName(preview ? 'local-preview-v1' : 'public-scan-v1'));
      const allowance = await limiter.fetch('https://budget.internal/reserve', {
        method: 'POST', body: JSON.stringify({ network, visitor, merchant, preview, stagingTest }), signal: deadline,
      });
      if (allowance.status === 429) {
        const retryAfter = allowance.headers.get('retry-after');
        return new Response(allowance.body, {
          status: 429, headers: retryAfter ? { ...defaults, 'retry-after': retryAfter } : defaults,
        });
      }
      if (!allowance.ok) return reject('busy');
      if (!preview) {
        const grant = allowance.headers.get('x-internal-grant');
        async function release() {
          if (grant) await limiter.fetch('https://budget.internal/release', {method:'POST',body:grant});
        }
        try {
          const cacheKey = reportNamespace + await hash(target.href);
          const cached = await env.REPORT_CACHE!.get(cacheKey).catch(() => null);
          if (cached) {
            responseHeaders.set('x-cro-cache','hit');
            return new Response(cached,{headers:responseHeaders});
          }
          const owner = env.SCAN_BUDGET.get(env.SCAN_BUDGET.idFromName(cacheKey));
          const reply = await owner.fetch('https://internal/analyze',{method:'POST',body:JSON.stringify({url:target.href,cacheKey})});
          if (!reply.ok) await release();
          return new Response(reply.body,{status:reply.status,headers:responseHeaders});
        } catch (error) {
          await release();
          throw error;
        }
      }
      if (request.headers.get('accept') === 'application/x-ndjson') {
        const channel = new AbortController();
        const signal = AbortSignal.any([deadline, channel.signal]);
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            const send = (event: ScanUpdate) => {
              if (!channel.signal.aborted) controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
            };
            void scan(target, signal, undefined, (reading, path) => send({ reading, path }))
              .then(report => send({ report }))
              .catch(error => send({ error: deadline.aborted ? 'timeout' : error instanceof Rejection ? error.code : 'busy' }))
              .finally(() => { if (!channel.signal.aborted) controller.close(); });
          },
          cancel() { channel.abort(); },
        });
        return new Response(stream, { headers: { ...defaults, 'content-type': 'application/x-ndjson; charset=utf-8' } });
      }
      const report = await scan(target, deadline);
      return Response.json(report, { headers: defaults });
    } catch (error) {
      if (deadline.aborted) return reject('timeout');
      return reject(error instanceof Rejection ? error.code : 'busy');
    }
  },
} satisfies ExportedHandler<Env>;
