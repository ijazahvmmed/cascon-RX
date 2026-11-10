'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { serviceMenu } from '@/data/service-menu';
import { animateServiceLink } from '@/lib/menu-motion';
import Icon from './Icon';

export default function ServicesMenu({ active, onOpenChange }: { active: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const openRef = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const disclosure = useRef<HTMLButtonElement>(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const previousPath = useRef(pathname);
  const change = useCallback((value: boolean) => {
    clearTimeout(timer.current);
    openRef.current = value;
    setOpen(value);
    if (value) { setVisible(true); onOpenChange(true); }
  }, [onOpenChange]);
  const finishClosing = useCallback(() => {
    if (!openRef.current) { setVisible(false); onOpenChange(false); }
  }, [onOpenChange]);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (previousPath.current !== pathname) { change(false); previousPath.current = pathname; }
  }, [pathname, change]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 980px)');
    const close = () => { if (!desktop.matches) { change(false); animation.current?.pause(0); finishClosing(); } };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, [change, finishClosing]);

  // The timeline survives direction changes. Re-entering during an exit plays
  // forward from the current frame rather than resetting the dropdown.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!visible || !el) return;
    const items = el.querySelectorAll('.services-mega__groups > div > p, .services-mega__groups li, .services-mega__footer');
    const tl = gsap.timeline({ paused: true, onReverseComplete: finishClosing });
    tl.fromTo(el, { autoAlpha: 0, y: -12, clipPath: 'inset(0 0 12% 0 round 16px)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0 round 16px)', duration: 0.46, ease: 'power3.out' }, 0)
      .fromTo(el.querySelector('.services-mega__story'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.04)
      .fromTo(el.querySelector('.services-mega__story > img'), { scale: 1.07 }, { scale: 1, duration: 0.68, ease: 'power3.out' }, 0)
      .fromTo(items, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.014, ease: 'power3.out' }, 0.1)
      .fromTo(disclosure.current?.querySelector('svg') || [], { rotation: 0 }, { rotation: 180, duration: 0.35, ease: 'power3.out' }, 0);
    animation.current = tl;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { if (reduced.matches) { tl.progress(openRef.current ? 1 : 0).pause(); if (!openRef.current) finishClosing(); } };
    reduced.addEventListener('change', preference);
    return () => { tl.kill(); animation.current = null; reduced.removeEventListener('change', preference); gsap.killTweensOf(el.querySelectorAll('[data-service-label], [data-service-icon]')); };
  }, [visible, finishClosing]);
  useLayoutEffect(() => {
    const el = panel.current, tl = animation.current;
    if (!visible || !el || !tl) return;
    if (open) el.removeAttribute('inert'); else el.setAttribute('inert', '');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tl.progress(open ? 1 : 0).pause();
      if (!open) finishClosing();
    } else if (open) tl.timeScale(1).play();
    else if (tl.progress() === 0) finishClosing();
    else tl.timeScale(1.6).reverse();
  }, [open, visible, finishClosing]);

  return <div className="services-nav" onMouseEnter={() => change(true)} onMouseLeave={() => { timer.current = setTimeout(() => change(false), 130); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) change(false); }} onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); change(false); disclosure.current?.focus(); } }}>
    <div className="services-nav__trigger"><Link href="/services" aria-current={active ? 'page' : undefined} onFocus={() => change(true)} onClick={() => change(false)}>Services</Link><button ref={disclosure} type="button" aria-label="Show services and specialisms" aria-expanded={open} aria-controls="services-mega-menu" onClick={() => change(!open)}><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.2" /></svg></button></div>
    <div ref={panel} id="services-mega-menu" className="services-mega" hidden={!visible} aria-hidden={!open} data-open={open} onClick={event => { if ((event.target as HTMLElement).closest('a')) change(false); }}>
      <Link href="/services" className="services-mega__story"><Image src="/images/work/finewares.png" alt="" fill sizes="260px" /><span className="services-mega__story-copy"><small>Cascon services</small><strong>A better store.<br />A bigger picture.</strong><span>Explore all services <Icon name="arrow-up-right" /></span></span></Link>
      <div className="services-mega__body"><div className="services-mega__groups">{serviceMenu.map(group => <div key={group.title}><p>{group.title}</p><ul>{group.items.map(item => <li key={item.href}><Link href={item.href} onPointerEnter={event => { if (event.pointerType === 'mouse') animateServiceLink(event.currentTarget, true); }} onPointerLeave={event => animateServiceLink(event.currentTarget, false)} onFocus={event => animateServiceLink(event.currentTarget, true)} onBlur={event => animateServiceLink(event.currentTarget, false)}><span className="services-mega__icon" data-service-icon><Icon name={item.icon} /></span><span data-service-label>{item.label}</span></Link></li>)}</ul></div>)}</div><div className="services-mega__footer"><span>Strategy, storefronts and creative. Connected.</span><Link href="/services">View every service <Icon name="arrow-right" /></Link></div></div>
    </div>
  </div>;
}
