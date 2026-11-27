const bytes = new TextEncoder();
const hex = (value: ArrayBuffer) => Array.from(new Uint8Array(value), n => n.toString(16).padStart(2,'0')).join('');

export async function identity(cookie: string, secret: string, now = Date.now()) {
  const key = await crypto.subtle.importKey('raw',bytes.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
  const token = cookie.match(/(?:^|;\s*)__Host-cro=([a-f0-9-]{36}\.\d{10}\.([a-f0-9]{64}))(?:;|$)/)?.[1];
  if (token) {
    const [id,expires,signature] = token.split('.');
    const valid = Number(expires) * 1000 > now && await crypto.subtle.verify('HMAC',key,
      Uint8Array.from(signature.match(/../g)!, pair => parseInt(pair,16)),bytes.encode(id+'.'+expires));
    if (valid) return {id};
  }
  const id = crypto.randomUUID();
  const payload = id + '.' + (Math.floor(now/1000)+2592000);
  const signed = payload + '.' + hex(await crypto.subtle.sign('HMAC',key,bytes.encode(payload)));
  return {id,cookie:'__Host-cro='+signed+'; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000'};
}

export async function challenge(secret: string, token: string, origin: string, ip: string, signal: AbortSignal) {
  if (!token || token.length > 2048) return false;
  const reply = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
    method:'POST',redirect:'manual',signal,body:new URLSearchParams({secret,response:token,remoteip:ip}),
  });
  if (!reply.ok) return false;
  const data = await reply.json<{success:boolean;hostname:string;action:string}>();
  return data.success && data.hostname === new URL(origin).hostname && data.action === 'cro_scan';
}
