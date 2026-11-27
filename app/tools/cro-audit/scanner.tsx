'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CAL_LINK } from '@/lib/constants';
import { trackCro } from '@/lib/cro/activity';
import { type ScanError, type ScanReport } from '@/lib/cro/model';
import styles from './scanner.module.css';
import ScanTrace, { presentationMs, readStream, type PageRead } from './scan-trace';
import Verification from './verification';
import ScoreCard from './score-card';

const errors: Record<ScanError, string> = {
  verification: 'Please complete the visitor check and try again.',
  invalid: 'Enter a store address, such as https://your-store.com.',
  blocked: 'We could not open that address. Try the store homepage.',
  denied: 'The store did not let us open this page.',
  'store-limited': 'This store paused automated visits. You can try another store or come back later.',
  unavailable: 'We could not read this store. Try its homepage or come back later.',
  unsampled: 'We could not find that product or collection through the store. Try its homepage.',
  unverified: 'We could not tell that this is a shop. Try the main store address.',
  busy: 'The scanner is busy. Please try again later.',
  limited: 'The scanner has reached its limit. Please try again later.',
  timeout: 'The store took too long to open. Please try again later.',
};
const worker = process.env.NEXT_PUBLIC_CRO_WORKER_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : '');

function consultationUrl(report: ScanReport) {
  const booking = new URL(CAL_LINK);
  const findingList = report.recommendations.map(item => item.title).join('. ');
  const summary = report.score;
  const score = summary.label + ' ' + summary.value + '. ' + summary.detail;
  booking.searchParams.set('notes', [
    'Store: ' + report.store,
    'Cascon store check: ' + score + ' · ' + report.overall.assessed + ' checks completed',
    findingList && 'Observed priorities: ' + findingList,
  ].filter(Boolean).join('\n'));
  booking.searchParams.set('utm_source', 'cascon_cro_audit');
  booking.searchParams.set('utm_medium', 'website');
  return booking.href;
}

export default function Scanner() {
  const sitekey = process.env.NEXT_PUBLIC_CRO_TURNSTILE_SITE_KEY;
  const [token,setToken] = useState('');
  const [challengeKey,setChallengeKey] = useState(0);
  const [target, setTarget] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [report, setReport] = useState<ScanReport | null>(null);
  const [pendingReport, setPendingReport] = useState<ScanReport | null>(null);
  const [reads, setReads] = useState<PageRead[]>([]);
  const [started, setStarted] = useState(0);
  const [message, setMessage] = useState('');
  const [pdfError, setPdfError] = useState('');
  const [makingPdf, setMakingPdf] = useState(false);
  const active = useRef<AbortController | null>(null);
  const scoreHeading = useRef<HTMLHeadingElement>(null);
  const errorHeading = useRef<HTMLHeadingElement>(null);
  const engagement = useRef(new Set<string>());
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => {
    if (state === 'done' && scoreHeading.current) {
      const title = scoreHeading.current;
      title.focus({ preventScroll: true });
      const card = title.closest('section');
      if (card) {
        const bounds = card.getBoundingClientRect();
        if (bounds.top < 80 || bounds.bottom > window.innerHeight - 16) card.scrollIntoView({ block: 'center' });
      }
    }
    if (state === 'error') errorHeading.current?.focus();
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current || !target.trim()) return;
    setReport(null);
    setMessage('');
    setPdfError('');
    if (!worker) { setMessage(errors.busy); setState('error'); return; }
    const controller = new AbortController();
    active.current = controller;
    const start = performance.now();
    setStarted(start);
    setReads([]);
    setPendingReport(null);
    setState('loading');
    engagement.current.clear();
    const timer = window.setTimeout(() => controller.abort('timeout'), 40_000);
    try {
      const request = await fetch(new URL('/scan', worker), {
        method: 'POST', signal: controller.signal, cache: 'no-store', credentials: 'include',
        referrerPolicy: 'no-referrer',
        headers: { 'content-type': 'application/json', accept: 'application/x-ndjson' }, body: JSON.stringify({ url: target.trim(), token }),
      });
      const payload = request.headers.get('content-type')?.startsWith('application/x-ndjson')
        ? await readStream(request, event => {
            if (!controller.signal.aborted) setReads(previous => [...previous, event]);
          })
        : await request.json().catch(() => null);
      if (!request.ok || payload?.version !== 2 || !Array.isArray(payload.shopping) || !payload.shopping.length || !payload.score || !Array.isArray(payload.recommendations)) {
        const code = payload?.error as ScanError;
        const error = Object.hasOwn(errors, code) ? errors[code] :
          request.status === 429 ? errors.limited : errors.busy;
        if (controller.signal.aborted) return;
        const seconds = payload?.retryAfter;
        if ((code === 'limited' || code === 'store-limited') && Number.isInteger(seconds) && seconds > 0 && seconds <= 86400) {
          const reset = new Date(Date.now() + seconds * 1000).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit',
          });
          const limit = code === 'store-limited' ? 'This store paused automated visits.' : payload.scope === 'visitor' ? 'You have used your three free audits for today.' : payload.scope === 'network' ? 'Your network reached its ten-minute scan limit.' :
            payload.scope === 'merchant' ? 'This store reached its daily scan limit.' : 'The scanner reached its daily capacity.';
          setMessage(limit + ' You can scan again at ' + reset + ' (your local time).');
        } else {
          setMessage(error);
        }
        setState('error');
        return;
      }
      if (controller.signal.aborted) return;
      const result = payload as ScanReport;
      window.clearTimeout(timer);
      setPendingReport(result);
      const remaining = request.headers.get('x-cro-cache') === 'hit' ? 0 : Math.max(0, presentationMs - (performance.now() - start));
      if (remaining) await new Promise<void>(resolve => {
        const finish = () => {
          window.clearTimeout(reveal);
          controller.signal.removeEventListener('abort', finish);
          resolve();
        };
        const reveal = window.setTimeout(finish, remaining);
        controller.signal.addEventListener('abort', finish, { once: true });
      });
      if (controller.signal.aborted) return;
      setReport(result);
      setState('done');
      trackCro({ name: 'cro_scan_complete', coverage: result.shopping.some(item => item.result === 'Could not confirm') ? 'partial' : 'scored',
        sampled: String(result.samples.filter(page => page.status === 'read' || page.status === 'partial').length) });
    } catch (error) {
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
      setMessage(controller.signal.aborted ? errors.timeout :
        error instanceof Error && Object.values(errors).includes(error.message) ? error.message : errors.busy);
      setState('error');
    } finally {
      window.clearTimeout(timer);
      setToken('');
      setChallengeKey(previous => previous + 1);
      if (active.current === controller) active.current = null;
    }
  }

  function cancel() {
    active.current?.abort();
    active.current = null;
    setState('idle');
  }

  function engagementOnce(id: string, action: () => void) {
    if (engagement.current.has(id)) return;
    engagement.current.add(id);
    action();
  }

  async function downloadReport() {
    if (!report || makingPdf) return;
    setMakingPdf(true);
    setPdfError('');
    try {
      const { summaryPdf } = await import('@/lib/cro/summary-pdf');
      const bytes = await summaryPdf(report);
      const file = new Blob([new Uint8Array(bytes)],{ type: 'application/pdf' });
      const href = URL.createObjectURL(file);
      const download = document.createElement('a');
      download.href = href;
      download.download = 'cascon-cro-' + new URL(report.store).hostname + '.pdf';
      download.click();
      window.setTimeout(() => URL.revokeObjectURL(href),30_000);
    } catch {
      setPdfError('The PDF could not be created. Try again.');
    } finally {
      setMakingPdf(false);
    }
  }

  return <div className={styles.surface}>
    <div className={styles.wrap}>
      <section className={styles.hero} aria-labelledby="cro-title">
        <div className={styles.introColumn}>
          <p className={styles.kicker}>Cascon Digital <span>/</span> Store tools</p>
          <h1 id="cro-title">Free online store check</h1>
          <p className={styles.intro}>See what shoppers can find before they buy, from the item price to delivery and returns.</p>
          <form onSubmit={submit} className={styles.form} data-clarity-mask="true">
            <label htmlFor="cro-store">Store address</label>
            <div className={styles.inputRow}>
              <input id="cro-store" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}
                placeholder="https://your-store.com" maxLength={2048} required disabled={state === 'loading'} value={target}
                aria-describedby="cro-input-help" onChange={e => {
                  setTarget(e.target.value);
                  setReport(null);
                  setState('idle');
                  setMessage('');
                }} />
              <button className={styles.primary} disabled={state === 'loading' || Boolean(sitekey && !token)} type="submit">Scan store</button>
            </div>
            {sitekey && <Verification key={challengeKey} sitekey={sitekey} onToken={setToken} />}
            <p id="cro-input-help">Enter a store or product page. No email required. <Link href="/tools/cro-audit/methodology">About the score</Link></p>
          </form>
          {(state === 'loading' || report) && <div className={styles.progress}>
            <ScanTrace key={started} reads={reads} result={report ?? pendingReport} started={started} settled={Boolean(report)} />
            {state === 'loading' && <button type="button" onClick={cancel} className={styles.textAction}>Cancel scan</button>}
          </div>}
          {state === 'error' && <h2 ref={errorHeading} tabIndex={-1} role="alert" className={styles.error}>{message}</h2>}
        </div>
        <ScoreCard key={started} report={report} loading={state === 'loading'} headingRef={scoreHeading} />
      </section>

      {report && <section className={styles.result} data-cro-report="" data-clarity-mask="true" aria-labelledby="cro-report-title">
        <header className={styles.resultTop}>
          <div>
            <p className={styles.kicker}>{new URL(report.store).hostname}</p>
            <h2 id="cro-report-title">Your store results</h2>
            <p>Scanned <time dateTime={report.capturedAt}>{new Date(report.capturedAt).toLocaleString()}</time></p>
          </div>
          <div>
            <button className={styles.secondary} onClick={downloadReport} disabled={makingPdf} type="button">
              {makingPdf ? 'Preparing PDF' : 'Download summary PDF'}
            </button>
            {pdfError && <p role="alert" className={styles.error}>{pdfError}</p>}
          </div>
        </header>

        <details className={styles.trace}>
          <summary>What went into your score</summary>
          <ul className={styles.shoppingList}>
            {report.shopping.map(item => <li key={item.title}>
              <div><strong>{item.title}</strong><span>{item.result === 'Could not confirm' ? 'Still open' : item.result}</span></div>
              <p>{item.detail}</p>
            </li>)}
          </ul>
        </details>
        <section className={styles.recommendations}>
          <h3>Recommended next steps</h3>
          {report.recommendations.length === 0 ?
            <p>We did not find a change we could confidently recommend from these pages.</p> :
            report.recommendations.map(item => <details key={item.id} className={styles.trace}
              onToggle={e => { if (e.currentTarget.open) engagementOnce(item.id, () => trackCro({ name: 'cro_recommendation_engagement', rule: item.id })); }}>
              <summary>{item.title}</summary>
              <dl className={styles.finding}>
                <div><dt>What we found</dt><dd>{item.evidence} <span>{item.path}</span></dd></div>
                <div><dt>Why it matters</dt><dd>{item.why}</dd></div>
                <div><dt>Suggested change</dt><dd>{item.change}</dd></div>
                <div><dt>Planning the change</dt><dd>{item.priority} priority · {item.effort} effort · {item.confidence} confidence</dd></div>
              </dl>
            </details>)}
        </section>
        <section className={styles.expert}>
          <div><h3>A closer look at your store</h3><p>Have Cascon shop through your store, compare it with competitors and suggest what to change and test first.</p></div>
          <a className={styles.primary} data-cro-booking href={consultationUrl(report)} referrerPolicy="no-referrer"
            onClick={() => engagementOnce('consultation', () => trackCro({ name: 'enquiry_intent', channel: 'calendar', tool: 'cro-audit' }))}>
            Unlock full CRO audit
          </a>
        </section>
      </section>}

    </div>
  </div>;
}
