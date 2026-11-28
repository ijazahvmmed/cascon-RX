import { timingSafeEqual } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import * as http from 'node:http';
import * as https from 'node:https';
import { Readable } from 'node:stream';
import { isPublicIp, MAX_HTML_BYTES, publicUrl } from '@/workers/cro/src/target';

const types = {
  html: 'text/html,application/xhtml+xml',
  css: 'text/css',
  image: 'image/webp,image/jpeg,image/png',
};
const robots = { 'x-robots-tag': 'noindex, nofollow', 'cache-control': 'no-store' };

export async function POST(request: Request) {
  const secret = process.env.CRO_RELAY_SECRET;
  const actual = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from('Bearer ' + secret);
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return new Response(null, { status: 403, headers: robots });
  }
  let target: URL;
  let kind: keyof typeof types;
  try {
    const data = await request.json();
    if (typeof data?.url !== 'string' || !Object.hasOwn(types, data.kind)) throw new Error();
    target = publicUrl(data.url);
    kind = data.kind;
  } catch {
    return new Response(null, { status: 400, headers: robots });
  }

  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(6500)]);
  try {
    const addresses = await lookup(target.hostname, { all: true });
    if (!addresses.length || addresses.some(({ address, family }) => !isPublicIp(address, family === 4 ? 1 : 28))) {
      return new Response(null, { status: 422, headers: { ...robots, 'x-cro-egress-blocked': '1' } });
    }
    // The original hostname is retained for HTTP Host and TLS verification.
    // The connection uses only the validated address, with no second DNS lookup.
    const address = addresses.find(candidate => candidate.family === 4) ?? addresses[0];
    const client = target.protocol === 'https:' ? https : http;
    const upstream = await new Promise<http.IncomingMessage>((resolve, reject) => {
      const outgoing = client.request(target, {
        agent: false, family: address.family, signal,
        lookup: (_hostname, _options, callback) => callback(null, address.address, address.family),
        headers: {
          accept: types[kind], 'accept-encoding': 'identity',
          'user-agent': 'CasconCROAudit/1.0 (+https://www.cascondigital.com/tools/cro-audit/methodology)',
        },
      }, resolve);
      outgoing.once('error', reject);
      outgoing.end();
    });
    const headers = new Headers(robots);
    for (const key of ['location', 'content-type', 'retry-after', 'cf-mitigated']) {
      const value = upstream.headers[key];
      if (typeof value === 'string') headers.set(key, value);
    }
    const status = upstream.statusCode ?? 502;
    if (status !== 200 || (upstream.headers['content-encoding'] && upstream.headers['content-encoding'] !== 'identity')) {
      upstream.destroy();
      return new Response(null, { status: status === 200 ? 502 : status, headers });
    }
    const limit = (kind === 'html' ? MAX_HTML_BYTES : 192 * 1024) + 1;
    async function* bounded() {
      let remaining = limit;
      for await (const chunk of upstream) {
        yield (chunk as Buffer).subarray(0, remaining);
        remaining -= chunk.length;
        if (remaining <= 0) break;
      }
    }
    const body = Readable.toWeb(Readable.from(bounded())) as unknown as ReadableStream<Uint8Array>;
    return new Response(body, { headers });
  } catch {
    return new Response(null, { status: 502, headers: robots });
  }
}
