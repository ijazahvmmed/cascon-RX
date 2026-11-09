'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import Icon from './Icon';
import { CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/constants';
import { trackCustomEvent } from '@/lib/fpixel';

export default function ContactPanel() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { dialog.current?.close(); }, [pathname]);
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
  const close = () => dialog.current?.close();
  const show = () => { dialog.current?.showModal(); setOpen(true); trackCustomEvent('ContactPanelOpen', { placement: 'floating_button' }); };
  return <>
    <button className={`contact-fab ${open ? 'contact-fab--hidden' : ''}`} aria-label="Contact Cascon" aria-haspopup="dialog" aria-expanded={open} onClick={show}><Icon name="whatsapp" /><span>Let’s talk</span></button>
    <dialog ref={dialog} className="contact-dialog" data-lenis-prevent aria-labelledby="contact-panel-title" onClose={() => setOpen(false)} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
    }}>
      <div className="contact-dialog__top"><BrandLogo /><button className="icon-button" aria-label="Close contact panel" onClick={close}><Icon name="close" /></button></div>
      <span className="eyebrow">Good things start here</span>
      <h2 id="contact-panel-title">What’s on<br />your mind?</h2>
      <p>A store, a campaign, or just an idea.<br />We’d love to hear it.</p>
      <div className="contact-dialog__actions">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="contact-channel contact-channel--primary"><Icon name="whatsapp" /><span>WhatsApp us<small>Chat with our India team</small></span><Icon name="arrow-up-right" /></a>
        <a href={`mailto:${CONTACT_EMAIL}?subject=Let%E2%80%99s%20talk%20about%20a%20project`} className="contact-channel"><Icon name="mail" /><span>Email us<small>{CONTACT_EMAIL}</small></span><Icon name="arrow-up-right" /></a>
      </div>
      <div className="contact-dialog__links"><Link href="/services" onClick={close}>Explore services <Icon name="arrow-right" /></Link><Link href="/work" onClick={close}>View our work <Icon name="arrow-right" /></Link></div>
    </dialog>
  </>;
}
