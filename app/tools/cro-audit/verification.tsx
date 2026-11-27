'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import styles from './scanner.module.css';

type Widget = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  remove(id: string): void;
};

export default function Verification({sitekey, onToken}: {sitekey: string; onToken: (value: string) => void}) {
  const element = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<'checking' | 'interactive' | 'verified' | 'error'>('checking');
  useEffect(() => {
    const api = (window as Window & {turnstile?: Widget}).turnstile;
    if (!api || !ready || !element.current) return;
    const id = api.render(element.current, {
      sitekey,
      action: 'cro_scan',
      theme: 'light',
      appearance: 'interaction-only',
      size: window.matchMedia('(max-width: 350px)').matches ? 'compact' : 'normal',
      callback: (token: string) => { onToken(token); setState('verified'); },
      'before-interactive-callback': () => setState('interactive'),
      'expired-callback': () => { onToken(''); setState('checking'); },
      'error-callback': () => { onToken(''); setState('error'); },
    });
    return () => api.remove(id);
  }, [sitekey, onToken, ready]);

  return <div className={styles.verification} data-state={state}>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      onReady={() => setReady(true)} onError={() => setState('error')} />
    <span className={styles.verificationStatus} role="status">
      {state === 'verified' ? 'Visitor verified' : state === 'interactive' ? 'Complete the visitor check to scan'
        : state === 'error' ? 'Visitor check unavailable. Refresh to try again.' : 'Checking your browser…'}
    </span>
    <div ref={element} aria-label="Visitor verification" />
  </div>;
}
