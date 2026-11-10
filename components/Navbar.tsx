'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { mainNavLinks } from '@/data/navigation';
import BrandLogo from './BrandLogo';
import ServicesMenu from './ServicesMenu';
import MobileServicesMenu from './MobileServicesMenu';
import MorphButton from './MorphButton';

export default function Navbar() {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const menuAnimation = useRef<gsap.core.Timeline | null>(null);
  const menuOpen = useRef(false);
  menuOpen.current = open;
  const toggle = useRef<HTMLButtonElement>(null);
  const previousPath = useRef(pathname);
  const light = pathname === '/' && !solid && !menuVisible && !servicesOpen;

  useEffect(() => {
    let last = window.scrollY, frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        setSolid(y > 80);
        if (y < 80) setHidden(false);
        else if (Math.abs(y - last) > 4) { setHidden(y > last && y > 120); last = y; }
        frame = 0;
      });
    };
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      setOpen(false); setHidden(false); previousPath.current = pathname;
    }
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 980px)');
    const close = () => { if (desktop.matches) { setOpen(false); setMenuVisible(false); } };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('cascon:menu', { detail: menuVisible }));
    if (!menuVisible) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prior;
      window.dispatchEvent(new CustomEvent('cascon:menu', { detail: false }));
    };
  }, [menuVisible]);
  useEffect(() => {
    if (!open || !menuVisible) return;
    menu.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus({ preventScroll: true }); }
      if (event.key === 'Tab') {
        const items = [toggle.current, ...Array.from(menu.current?.querySelectorAll<HTMLElement>('a, summary, button') || [])].filter((item): item is HTMLElement => Boolean(item && !item.closest('[hidden], [inert]') && item.getClientRects().length));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [open, menuVisible]);
  useLayoutEffect(() => {
    const el = menu.current;
    if (!menuVisible || !el) return;
    const finish = () => { if (!menuOpen.current) setMenuVisible(false); };
    const tl = gsap.timeline({ paused: true, onReverseComplete: finish });
    tl.fromTo(el, { autoAlpha: 0, y: -12, clipPath: 'inset(0 0 6% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.46, ease: 'power3.out' }, 0)
      .fromTo(el.querySelectorAll('[data-menu-link]'), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.44, stagger: 0.04, ease: 'power3.out' }, 0.1);
    menuAnimation.current = tl;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { if (reduced.matches) { tl.progress(menuOpen.current ? 1 : 0).pause(); if (!menuOpen.current) finish(); } };
    reduced.addEventListener('change', preference);
    return () => { tl.kill(); menuAnimation.current = null; reduced.removeEventListener('change', preference); };
  }, [menuVisible]);
  useLayoutEffect(() => {
    const tl = menuAnimation.current;
    if (!menuVisible || !tl) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tl.progress(open ? 1 : 0).pause();
      if (!open) setMenuVisible(false);
    } else if (open) tl.timeScale(1).play();
    else if (tl.progress() === 0) setMenuVisible(false);
    else tl.timeScale(1.7).reverse();
  }, [open, menuVisible]);

  return <header className={`site-nav ${light ? 'site-nav--light' : ''} ${solid || servicesOpen ? 'site-nav--solid' : ''} ${hidden && !menuVisible && !servicesOpen ? 'site-nav--hidden' : ''} ${menuVisible ? 'site-nav--open' : ''}`}>
    <div className="site-nav__inner">
      <Link href="/" aria-label="Cascon home" className="site-nav__brand"><BrandLogo light={light || menuVisible} /></Link>
      <nav className="site-nav__links" aria-label="Main navigation">{mainNavLinks.map(link => link.href === '/services' ? <ServicesMenu key={link.href} active={pathname.startsWith('/services')} onOpenChange={setServicesOpen} /> : <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>{link.label}</Link>)}</nav>
      <MorphButton href="/contact" label="Contact" className="site-nav__contact" variant={light ? 'light' : 'dark'} />
      <button ref={toggle} className="site-nav__toggle" aria-label={open ? 'Close mobile menu' : 'Open mobile menu'} aria-expanded={open} aria-controls={menuVisible ? 'mobile-menu' : undefined} onClick={() => { if (open) setOpen(false); else { setHidden(false); setMenuVisible(true); setOpen(true); } }}><span /><span /></button>
    </div>
    {menuVisible && <div ref={menu} className={`site-menu ${!open ? 'site-menu--closing' : ''}`} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation" data-lenis-prevent>
      <nav aria-label="Mobile navigation">{mainNavLinks.map(link => link.href === '/services' ? <MobileServicesMenu key={link.href} onNavigate={() => setOpen(false)} /> : <Link key={link.href} href={link.href} data-menu-link aria-current={pathname === link.href ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>
      <div className="site-menu__contact" data-menu-link onClick={() => setOpen(false)}><MorphButton href="/contact" label="Contact" variant="light" /></div>
    </div>}
  </header>;
}
