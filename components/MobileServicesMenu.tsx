'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { serviceMenu } from '@/data/service-menu';
import { animateServiceLink } from '@/lib/menu-motion';
import Icon from './Icon';

export default function MobileServicesMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const chevron = useRef<SVGSVGElement>(null);
  const openRef = useRef(false);
  const change = () => { openRef.current = !openRef.current; if (openRef.current) setVisible(true); setOpen(openRef.current); };
  useLayoutEffect(() => {
    const el = panel.current;
    if (!visible || !el) return;
    gsap.set(el, { height: 0 });
    gsap.set(el.querySelectorAll('[data-mobile-service-row]'), { autoAlpha: 0, y: 8 });
  }, [visible]);
  useLayoutEffect(() => {
    const el = panel.current;
    if (!visible || !el) return;
    const rows = el.querySelectorAll('[data-mobile-service-row]');
    if (open) el.removeAttribute('inert'); else el.setAttribute('inert', '');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { height: open ? 'auto' : 0 });
      gsap.set(rows, { autoAlpha: open ? 1 : 0, y: 0 });
      gsap.set(chevron.current, { rotation: open ? 180 : 0 });
      if (!open) setVisible(false);
      return;
    }
    // Tween from the current height/opacity, including halfway through a reversal.
    const tl = gsap.timeline();
    if (open) {
      tl.to(el, { height: el.scrollHeight, duration: 0.5, ease: 'power3.inOut', onComplete: () => { if (openRef.current) gsap.set(el, { height: 'auto' }); } }, 0)
        .to(rows, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.018, ease: 'power3.out' }, 0.1);
    } else {
      tl.to(rows, { autoAlpha: 0, y: -5, duration: 0.16, stagger: 0.006, ease: 'power2.in' }, 0)
        .to(el, { height: 0, duration: 0.38, ease: 'power3.inOut', onComplete: () => { if (!openRef.current) setVisible(false); } }, 0);
    }
    tl.to(chevron.current, { rotation: open ? 180 : 0, duration: 0.32, ease: 'power3.out' }, 0);
    return () => { tl.kill(); };
  }, [open, visible]);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => {
      const el = panel.current;
      if (!reduced.matches || !el) return;
      gsap.killTweensOf([el, chevron.current, ...Array.from(el.querySelectorAll('[data-mobile-service-row]'))]);
      gsap.set(el, { height: openRef.current ? 'auto' : 0 });
      gsap.set(el.querySelectorAll('[data-mobile-service-row]'), { autoAlpha: openRef.current ? 1 : 0, y: 0 });
      gsap.set(chevron.current, { rotation: openRef.current ? 180 : 0 });
      if (!openRef.current) setVisible(false);
    };
    reduced.addEventListener('change', preference);
    return () => reduced.removeEventListener('change', preference);
  }, []);
  return <div className="mobile-services"><Link href="/services" data-menu-link onClick={onNavigate}>Services</Link>
    <button type="button" className="mobile-services__toggle" data-menu-link aria-expanded={open} aria-controls="mobile-service-specialisms" onClick={change}>Explore specialisms<svg ref={chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.2" /></svg></button>
    <div ref={panel} id="mobile-service-specialisms" className="mobile-services__panel" hidden={!visible} aria-hidden={!open}><div className="mobile-services__body">{serviceMenu.map(group => <div className="mobile-services__group" key={group.title}><span data-mobile-service-row>{group.title}</span>{group.items.map(item => <Link data-mobile-service-row key={item.href} href={item.href} onClick={onNavigate} onPointerEnter={event => { if (event.pointerType === 'mouse') animateServiceLink(event.currentTarget, true); }} onPointerLeave={event => animateServiceLink(event.currentTarget, false)} onFocus={event => animateServiceLink(event.currentTarget, true)} onBlur={event => animateServiceLink(event.currentTarget, false)}><span className="mobile-services__icon" data-service-icon><Icon name={item.icon} /></span><span data-service-label>{item.label}</span></Link>)}</div>)}</div></div>
  </div>;
}
