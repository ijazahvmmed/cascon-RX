'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import BrandLogo from './BrandLogo';
import Icon from './Icon';
import AIProviderLinks from './AIProviderLinks';
import { aiQuestion } from '@/data/ai';
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/constants';
import { trackCustomEvent } from '@/lib/fpixel';
import { getAssistantRequest, getServerAssistantRequest, requestAssistant, subscribeToAssistant, type AssistantView } from '@/lib/assistant';

function WhatsAppAction() {
  return <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="contact-channel contact-channel--primary"><Icon name="whatsapp" /><span>WhatsApp us<small>Chat with our India team</small></span><Icon name="arrow-up-right" /></a>;
}

export default function ContactPanel() {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AssistantView>('contact');
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const assistantRequest = useSyncExternalStore(subscribeToAssistant, getAssistantRequest, getServerAssistantRequest);
  const show = useCallback((nextView: AssistantView = 'contact', placement = 'floating_button') => {
    setView(nextView);
    if (!dialog.current?.open) dialog.current?.showModal();
    setOpen(true);
    trackCustomEvent('ContactPanelOpen', { placement, view: nextView });
  }, []);
  useEffect(() => {
    if (previousPath.current !== pathname) { dialog.current?.close(); previousPath.current = pathname; }
  }, [pathname]);
  useLayoutEffect(() => {
    if (assistantRequest) show(assistantRequest.view, assistantRequest.placement);
  }, [assistantRequest, show]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('cascon:contact', { detail: true }));
    return () => {
      document.body.style.overflow = previous;
      window.dispatchEvent(new CustomEvent('cascon:contact', { detail: false }));
    };
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    dialog.current?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !content.current) return;
    const context = gsap.context(() => {
      gsap.fromTo('[data-assistant-reveal]:not(h2)', { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.035, ease: 'power3.out' });
      gsap.fromTo(heading.current, { y: 9 }, { y: 0, duration: 0.34, ease: 'power3.out' });
    }, content);
    return () => context.revert();
  }, [open, view]);
  const close = () => dialog.current?.close();
  const chooseAI = () => { setView('ai'); trackCustomEvent('AIChooserOpen', { placement: 'contact_panel' }); };

  return <>
    <button className={'contact-fab ' + (open ? 'contact-fab--hidden' : '')} aria-label="Contact Cascon" aria-haspopup="dialog" aria-controls="contact-assistant-dialog" aria-expanded={open} onClick={() => requestAssistant()}><Icon name="sparkles" /><span>Let’s talk</span></button>
    <dialog ref={dialog} id="contact-assistant-dialog" className="contact-dialog" data-lenis-prevent data-view={view} aria-labelledby="contact-panel-title" aria-describedby="contact-panel-description" onClose={() => { setOpen(false); setView('contact'); }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
    }}>
      <div className="contact-dialog__top"><BrandLogo /><button type="button" className="icon-button" aria-label="Close contact panel" onClick={close}><Icon name="close" /></button></div>
      <div ref={content} className="assistant-view">
        {view === 'contact' ? <>
          <span className="eyebrow" data-assistant-reveal>Good things start here</span>
          <h2 ref={heading} id="contact-panel-title" tabIndex={-1} data-assistant-reveal>What’s on<br />your mind?</h2>
          <p id="contact-panel-description" data-assistant-reveal>A store, a campaign, or just an idea.<br />We’d love to hear it.</p>
          <div className="contact-dialog__actions" data-assistant-reveal><WhatsAppAction /><a href={'mailto:' + CONTACT_EMAIL + '?subject=Let%E2%80%99s%20talk%20about%20a%20project'} className="contact-channel"><Icon name="mail" /><span>Email us<small>{CONTACT_EMAIL}</small></span><Icon name="arrow-up-right" /></a><button type="button" className="contact-channel contact-channel--ai" onClick={chooseAI}><Icon name="sparkles" /><span>Ask AI about Cascon<small>Your question, already prepared</small></span><Icon name="arrow-right" /></button></div>
          <div className="contact-dialog__links" data-assistant-reveal><Link href="/services" onClick={close}>Explore services <Icon name="arrow-right" /></Link><Link href="/work" onClick={close}>View our work <Icon name="arrow-right" /></Link></div>
        </> : <>
          <button type="button" className="assistant-back" onClick={() => setView('contact')}><Icon name="arrow-right" />Contact options</button>
          <span className="eyebrow" data-assistant-reveal>Another perspective</span>
          <h2 ref={heading} id="contact-panel-title" tabIndex={-1} data-assistant-reveal>Ask your AI.</h2>
          <p id="contact-panel-description" data-assistant-reveal>Choose your AI. The question goes with you.</p>
          <div data-assistant-reveal><AIProviderLinks /></div>
          <details className="assistant-question" data-assistant-reveal><summary>View the prepared question<Icon name="arrow-right" /></summary><p>{aiQuestion}</p></details>
          <div className="assistant-primary" data-assistant-reveal><WhatsAppAction /></div>
          <p className="assistant-note" data-assistant-reveal>Opens in the app where supported, or on the web. Your chosen AI provides the answer.</p>
        </>}
      </div>
    </dialog>
  </>;
}
