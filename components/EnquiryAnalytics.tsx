'use client';
import { useEffect } from 'react';
import { CAL_LINK } from '@/lib/constants';
import { contactIntent, sourceType } from '@/lib/analytics';
type Properties = Record<string,string>;
type Plausible = ((name: string, options?: { props?: Properties }) => void) & { q?: unknown[][] };
declare global { interface Window { plausible?: Plausible; } }
export default function EnquiryAnalytics({ enabled = true }: { enabled?: boolean }) {
  useEffect(() => {
    if (!enabled || ['localhost','127.0.0.1','[::1]'].includes(location.hostname)) return;
    if (!window.plausible) { const queued: Plausible = (name, options) => { (queued.q ||= []).push([name,options]); }; window.plausible = queued; }
    // Only a public path and a broad referral category are retained. No queries or contact details.
    let landing = { path: location.pathname, source: sourceType(document.referrer,location.search) };
    try {
      const stored = sessionStorage.getItem('cascon:landing');
      if (stored) { const parsed = JSON.parse(stored); if (typeof parsed.path === 'string' && /^\/[a-z0-9/-]*$/i.test(parsed.path) && ['organic-search','ai-referral','other-referral','direct','paid-campaign','campaign'].includes(parsed.source)) landing = parsed; }
      else sessionStorage.setItem('cascon:landing',JSON.stringify(landing));
    } catch { /* Measurement still works without storage. */ }
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link) return;
      const intent = contactIntent(link.getAttribute('href') || '',CAL_LINK);
      if (intent) window.plausible?.(intent.event,{ props: { channel:intent.channel,landing_path:landing.path,source_type:landing.source,content_path:location.pathname } });
    };
    document.addEventListener('click',click);
    return () => document.removeEventListener('click',click);
  },[enabled]);
  return null;
}
