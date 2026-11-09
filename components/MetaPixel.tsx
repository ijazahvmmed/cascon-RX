'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { FB_PIXEL_ID, pageview, trackEvent, trackCustomEvent } from '@/lib/fpixel';
import { CAL_LINK } from '@/lib/constants';
import { services } from '@/data/services';

export default function MetaPixel() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(!['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)); }, []);
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    if (!ready || lastPage.current === pathname) return;
    lastPage.current = pathname;
    pageview();
    if (pathname === '/services' || pathname === '/work') {
      trackEvent('ViewContent', { content_name: pathname === '/services' ? 'Cascon services' : 'Cascon selected work', content_category: pathname === '/services' ? 'Services' : 'Portfolio' });
    }
  }, [pathname, ready]);
  useEffect(() => {
    if (!ready) return;
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (href.startsWith('https://wa.me/')) {
        trackEvent('Contact', { contact_method: 'whatsapp' });
      } else if (href.startsWith('mailto:') || href.startsWith('tel:')) {
        trackEvent('Contact', { contact_method: href.startsWith('mailto:') ? 'email' : 'phone' });
      } else if (href.startsWith(CAL_LINK)) {
        // This is intent, not a completed booking. Lead/Schedule require confirmation.
        trackCustomEvent('BookingLinkClick', { placement: target.closest('footer') ? 'footer' : 'page' });
      } else if (target.dataset.aiProvider) {
        trackCustomEvent('AIOutboundClick', { provider: target.dataset.aiProvider });
      } else if (target.dataset.project) {
        trackCustomEvent('ProjectOutboundClick', { project_name: target.dataset.project });
      } else if (href.includes('#')) {
        const id = href.split('#')[1];
        const service = services.find(s => s.id === id);
        if (service) trackEvent('ViewContent', { content_name: service.name, content_category: 'Service interest' });
      }
    };
    const toggle = (event: Event) => {
      if (event.target instanceof HTMLDetailsElement && event.target.open && event.target.closest('.faq-list')) {
        trackCustomEvent('FAQExpand', { question: event.target.querySelector('summary')?.firstChild?.textContent?.trim() || '' });
      }
    };
    document.addEventListener('click', click);
    document.addEventListener('toggle', toggle, true);
    return () => { document.removeEventListener('click', click); document.removeEventListener('toggle', toggle, true); };
  }, [ready]);
  if (!enabled || !FB_PIXEL_ID || !/^\d+$/.test(FB_PIXEL_ID)) return null;
  return <Script id="meta-pixel-init" strategy="afterInteractive" onReady={() => setReady(true)} dangerouslySetInnerHTML={{ __html: `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','${FB_PIXEL_ID}');
  ` }} />;
}
