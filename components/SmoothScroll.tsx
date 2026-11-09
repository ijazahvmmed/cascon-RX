'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export default function SmoothScroll() {
  const pathname = usePathname();
  const instance = useRef<Lenis | null>(null);
  useEffect(() => {
    let menuOpen = false, contactOpen = false;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setup = () => {
      gsap.ticker.remove(tick);
      instance.current?.destroy();
      instance.current = preference.matches ? null : new Lenis({
        lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false,
        stopInertiaOnNavigate: true, anchors: false,
      });
      instance.current?.on('scroll', ScrollTrigger.update);
      if (instance.current) gsap.ticker.add(tick);
      if (menuOpen || contactOpen || document.hidden) instance.current?.stop();
    };
    const tick = (seconds: number) => instance.current?.raf(seconds * 1000);
    setup();
    // One shared frame loop keeps scroll position and GSAP reveals in phase.
    gsap.ticker.lagSmoothing(0);
    preference.addEventListener('change', setup);
    const visibility = () => { if (document.hidden || menuOpen || contactOpen) instance.current?.stop(); else instance.current?.start(); };
    const menu = (event: Event) => { menuOpen = Boolean((event as CustomEvent<boolean>).detail); visibility(); };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('cascon:menu', menu);
    const contact = (event: Event) => { contactOpen = Boolean((event as CustomEvent<boolean>).detail); visibility(); };
    window.addEventListener('cascon:contact', contact);
    const anchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      // Prevent Next's second scroll; keep real hrefs and browser history intact.
      event.preventDefault();
      if (url.hash !== location.hash) history.pushState(null, '', url.pathname + url.search + url.hash);
      if (instance.current) {
        instance.current.resize();
        instance.current.scrollTo(window.scrollY, { immediate: true, force: true });
        instance.current.scrollTo(target, { force: true });
      } else target.scrollIntoView({ block: 'start' });
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    };
    document.addEventListener('click', anchor, true);
    return () => {
      gsap.ticker.remove(tick);
      instance.current?.destroy(); instance.current = null;
      preference.removeEventListener('change', setup);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('cascon:menu', menu);
      window.removeEventListener('cascon:contact', contact);
      document.removeEventListener('click', anchor, true);
    };
  }, []);
  useEffect(() => {
    let cancelled = false, frame = 0;
    const restore = () => {
      if (cancelled) return;
      instance.current?.resize();
      ScrollTrigger.refresh();
      const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
      if (target) {
        if (instance.current) {
          // Read the native position; Lenis can still hold the pre-navigation value.
          const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
          instance.current.scrollTo(window.scrollY + target.getBoundingClientRect().top - margin, { immediate: true, force: true });
        }
        else target.scrollIntoView({ block: 'start' });
      } else instance.current?.scrollTo(window.scrollY, { immediate: true, force: true });
    };
    frame = requestAnimationFrame(restore);
    // SplitText reflows when Geist finishes loading. Resolve deep links after that refresh.
    document.fonts.ready.then(() => {
      if (!cancelled) frame = requestAnimationFrame(() => { frame = requestAnimationFrame(restore); });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [pathname]);
  return null;
}
