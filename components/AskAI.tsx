'use client';
import Image from 'next/image';
import Icon from './Icon';
import { useEffect, useRef, useState } from 'react';
import { aiProviders, aiQuestion } from '@/data/ai';
import { trackCustomEvent } from '@/lib/fpixel';

export default function AskAI() {
  const ref = useRef<HTMLDetailsElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target) && ref.current) ref.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector('summary')?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(aiQuestion);
      setCopied(true); setCopyFailed(false);
      trackCustomEvent('AIQuestionCopy', { placement: 'faq' });
    } catch { setCopyFailed(true); }
  };
  return <details className="ask-ai" ref={ref}>
    <summary aria-label="Ask AI about Cascon"><svg className="ai-spark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z" fill="currentColor" /></svg><span>Ask AI about Cascon</span><svg className="ai-chevron" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="m1 1 5 5 5-5" stroke="currentColor" strokeWidth="1.2" /></svg></summary>
    <div className="ask-ai__panel" data-lenis-prevent>
      <button className="ask-ai__close" aria-label="Close AI chooser" onClick={() => { if (ref.current) ref.current.open = false; ref.current?.querySelector('summary')?.focus({ preventScroll: true }); }}><Icon name="close" /></button>
      <p>Another perspective?</p><span className="ask-ai__intro">Copy our question, choose your AI, then paste it into a new chat.</span>
      <button className="ask-ai__copy" onClick={copy}>{copied ? 'Question copied ✓' : 'Copy the question'}<Icon name={copied ? 'check' : 'copy'} /></button>
      <div className="ask-ai__providers">{aiProviders.map(provider => <a key={provider.name} href={provider.href} target="_blank" rel="noopener noreferrer" data-ai-provider={provider.name}><span className="ai-provider-mark" aria-hidden="true"><Image className="ai-provider-logo" src={provider.logo} alt="" width={22} height={22} /></span>{provider.name}<Icon name="arrow-up-right" className="ai-provider-arrow" /></a>)}</div>
      <span className="ask-ai__note">Opens an external AI service. Answers are provided by that service.</span>
      <span className="sr-only" role="status">{copied ? 'Question copied. Choose an AI service and paste it into a new chat.' : ''}</span>
      {copyFailed && <div className="ask-ai__fallback"><label htmlFor="ai-question">Copy this question manually</label><textarea id="ai-question" readOnly value={aiQuestion} onFocus={event => event.currentTarget.select()} /></div>}
    </div>
  </details>;
}
