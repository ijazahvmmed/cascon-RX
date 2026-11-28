import { isIP } from 'node:net';

export const maxDuration = 55;
const allowedOrigins = new Set(['https://www.cascondigital.com', 'https://cascondigital.com']);
const maximumInput = 4600;
const baseHeaders = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' };

export async function POST(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  if (!allowedOrigins.has(origin)) return new Response(null, { status: 403, headers: baseHeaders });
  const secret = process.env.CRO_RELAY_SECRET?.trim();
  const worker = process.env.CRO_WORKER_URL?.trim();
  const ip = request.headers.get('x-vercel-forwarded-for')?.trim() ?? '';
  if (!secret || !worker || !isIP(ip)) return Response.json({ error: 'busy' }, { status: 503, headers: baseHeaders });
  if (!request.body || !/^application\/json(?:;|$)/i.test(request.headers.get('content-type') ?? '')) {
    return Response.json({ error: 'invalid' }, { status: 400, headers: baseHeaders });
  }
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  const reader = request.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximumInput) {
        await reader.cancel();
        return Response.json({ error: 'invalid' }, { status: 400, headers: baseHeaders });
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const visitor = request.headers.get('cookie')?.split(';')
    .map(cookie => cookie.trim()).find(cookie => cookie.startsWith('__Host-cro=')) ?? '';
  try {
    const result = await fetch(new URL('/scan', worker), {
      method: 'POST', redirect: 'manual', cache: 'no-store',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(45_000)]),
      headers: {
        authorization: 'Bearer ' + secret, origin, 'x-cro-client-ip': ip,
        'content-type': 'application/json', cookie: visitor,
      },
      body: Buffer.concat(chunks),
    });
    const headers = new Headers(baseHeaders);
    for (const key of ['content-type', 'retry-after', 'x-cro-cache', 'set-cookie']) {
      const value = result.headers.get(key);
      if (value) headers.set(key, value);
    }
    return new Response(result.body, { status: result.status, headers });
  } catch {
    return Response.json({ error: 'busy' }, { status: 503, headers: baseHeaders });
  }
}
