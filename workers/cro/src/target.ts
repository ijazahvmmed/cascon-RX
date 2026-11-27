import ipaddr from 'ipaddr.js';
import type { ScanError } from '../../../lib/cro/model';

export class Rejection extends Error {
  constructor(readonly code: ScanError) { super(code); }
}

const hostname = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{1,62}$/;
const reserved = /(?:^|\.)(?:localhost|local|internal|invalid|example|test|onion|arpa|home|lan|workers\.dev|trycloudflare\.com|nip\.io|sslip\.io|localtest\.me|lvh\.me)$/;
const unsafePath = /(?:^|\/)(?:admin|account|login|logout|checkout|cart|basket|wp-admin|wp-json|wp-login\.php|xmlrpc\.php|api|password|graphql|orders?)(?:\/|$)/i;
const safePath = /^\/(?:[a-z0-9._~-]+\/)*[a-z0-9._~-]*$/i;
const redirects = new Set([301, 302, 303, 307, 308]);
export const MAX_HTML_BYTES = 768 * 1024;

export function publicUrl(value: string, base?: URL) {
  if (!value || value.length > 2048 || /[\s\\\x00-\x1f\x7f]/u.test(value)) throw new Rejection('invalid');
  let url: URL;
  try { url = new URL(value, base); } catch { throw new Rejection('invalid'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port ||
    url.hostname.length > 253 || !hostname.test(url.hostname) || reserved.test(url.hostname) ||
    ipaddr.isValid(url.hostname)) throw new Rejection('invalid');
  return url;
}

export function storeEntry(value: string) {
  const raw = value.trim();
  const url = publicUrl(raw.includes('://') ? raw : 'https://' + raw);
  if (url.pathname === '/') return new URL(url.origin);
  const page = sampleUrl(url.href, url);
  if (!page) throw new Rejection('invalid');
  return page;
}

export function merchantKey(url: URL) { return url.hostname.replace(/^www\./, ''); }

export function sampleUrl(value: string, home: URL) {
  try {
    const candidate = publicUrl(value, home);
    if (candidate.origin !== home.origin || candidate.pathname === '/' ||
      !safePath.test(candidate.pathname) || unsafePath.test(candidate.pathname)) return null;
    candidate.search = '';
    candidate.hash = '';
    return candidate;
  } catch { return null; }
}

export function redirectUrl(location: string, current: URL, home: URL, homeFetch: boolean) {
  const url = publicUrl(location, current);
  if (merchantKey(url) !== merchantKey(home) ||
    (current.protocol === 'https:' && url.protocol !== 'https:') ||
    (!homeFetch && url.origin !== home.origin) || !safePath.test(url.pathname) || unsafePath.test(url.pathname)) {
    throw new Rejection('blocked');
  }
  url.search = '';
  url.hash = '';
  return url;
}

export function isPublicIp(text: string, type: number) {
  try {
    const ip = ipaddr.parse(text);
    if (ip.kind() === 'ipv4') {
      if (type !== 1 || ip.range() !== 'unicast') return false;
      const [a,b,c] = ip.toByteArray();
      return !(a === 192 && ((b === 0 && c === 0) || (b === 88 && c === 99)) || a >= 224 || a === 0);
    }
    const bytes = ip.toByteArray();
    return type === 28 && ip.range() === 'unicast' && (bytes[0] & 0xe0) === 0x20 &&
      !(bytes[0] === 0x20 && bytes[1] === 1 && bytes[2] < 2) &&
      !(bytes[0] === 0x3f && bytes[1] === 0xff);
  } catch { return false; }
}

type Transport = typeof fetch;

export async function checkDns(host: string, signal: AbortSignal, transport: Transport = fetch) {
  const replies = await Promise.all([1, 28].map(async type => {
    const url = new URL('https://cloudflare-dns.com/dns-query');
    url.searchParams.set('name', host);
    url.searchParams.set('type', String(type));
    const response = await transport(url, { headers: { accept: 'application/dns-json' }, signal, redirect: 'manual' });
    if (!response.ok) { void response.body?.cancel().catch(() => {}); throw new Rejection('unavailable'); }
    const packet = await response.json() as { Status?: number; Answer?: { type: number; data: string }[] };
    if (packet.Status !== 0) throw new Rejection('unavailable');
    return (packet.Answer ?? []).filter(answer => answer.type === 1 || answer.type === 28);
  }));
  const addresses = replies.flat();
  if (!addresses.length || addresses.some(address => !isPublicIp(address.data, address.type))) throw new Rejection('blocked');
}

export function fetcher(signal: AbortSignal, transport: Transport = fetch, resolve = checkDns) {
  let outbound = 0, lastPageRequest = 0, restricted = false;
  const delay = async () => {
    if (transport !== fetch) return;
    const remaining = 1100 - (Date.now() - lastPageRequest);
    if (remaining > 0) await new Promise<void>((resolve,reject) => {
      if (signal.aborted) { reject(signal.reason); return; }
      const timer = setTimeout(() => { signal.removeEventListener('abort',onAbort); resolve(); },remaining);
      function onAbort() { clearTimeout(timer); reject(signal.reason); }
      signal.addEventListener('abort',onAbort,{once:true});
    });
    signal.throwIfAborted();
    lastPageRequest = Date.now();
  };
  // Every hop is preflighted afresh. At connection time Workers' public-only egress is
  // the enforcement boundary, including when a DNS answer changes after preflight.
  return async (entry: URL, home: URL, homeFetch = false) => {
    let current = entry;
    for (let hop = 0; hop <= 2; hop++) {
      if (restricted) throw new Rejection('blocked');
      if (++outbound > 8) throw new Rejection('unavailable');
      try { await resolve(current.hostname, signal, transport); }
      catch (error) { throw error instanceof Rejection ? error : new Rejection('unavailable'); }
      await delay();
      const response = await transport(current, {
        redirect: 'manual', signal,
        headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': 'CasconCROAudit/1.0 (+https://www.cascondigital.com/tools/cro-audit/methodology)' },
      }).catch(() => { throw new Rejection('unavailable'); });
      restricted ||= response.status === 403 || response.status === 429 || response.headers.has('cf-mitigated');
      if (redirects.has(response.status)) {
        void response.body?.cancel().catch(() => {});
        const location = response.headers.get('location');
        if (hop === 2 || !location) throw new Rejection('blocked');
        current = redirectUrl(location, current, home, homeFetch);
        continue;
      }
      if (response.status !== 200 || response.headers.has('cf-mitigated') ||
        !/^(text\/html|application\/xhtml\+xml)(?:;|$)/i.test(response.headers.get('content-type')?.trim() ?? '') ||
        !response.body) {
        void response.body?.cancel().catch(() => {});
        if (response.status === 429) throw new Rejection('store-limited');
        if (restricted) throw new Rejection('denied');
        throw new Rejection('unavailable');
      }
      let size = 0, partial = false;
      const reader = response.body.getReader();
      const bounded = new ReadableStream<Uint8Array>({
        async pull(controller) {
          const chunk = await reader.read();
          if (chunk.done) { controller.close(); return; }
          const remainder = MAX_HTML_BYTES - size;
          if (chunk.value.byteLength > remainder) {
            partial = true;
            if (remainder) controller.enqueue(chunk.value.subarray(0,remainder));
            controller.close();
            void reader.cancel().catch(() => {});
            return;
          }
          size += chunk.value.byteLength;
          controller.enqueue(chunk.value);
        },
        cancel() { return reader.cancel(); },
      });
      // Only the bounded decompressed prefix reaches the extractor.
      return {
        url: current, isPartial: () => partial,
        document: new Response(bounded, { headers: { 'content-type': response.headers.get('content-type')! } }),
      };
    }
    throw new Rejection('blocked');
  };
}
