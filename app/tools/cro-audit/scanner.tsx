'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CAL_LINK } from '@/lib/constants';
import { trackCro } from '@/lib/cro/activity';
import { categories, sampleLabels } from '@/lib/cro/model';
import type { ScanError, ScanReport, Sample } from '@/lib/cro/model';
import styles from './scanner.module.css';

const pages = [
  { kind: 'homepage', label: 'Homepage', detail: 'Store entry and visible navigation' },
  { kind: 'product', label: 'Product page', detail: 'Product details, price and buy controls' },
  { kind: 'collection', label: 'Collection page', detail: 'Product links and browsing structure' },
] as const;

const errors: Record<ScanError, string> = {
  invalid: 'Enter a public storefront URL, such as a store homepage.',
  blocked: 'This address falls outside the scanner’s public storefront scope. Try the store’s main domain.',
  denied: 'The storefront declined automated access. A report could not be prepared.',
  'store-limited': 'The storefront is limiting requests. Try again later.',
  unavailable: 'The storefront could not be read within the scan limits. Try the public homepage or try again later.',
  unverified: 'The response did not contain enough storefront evidence to verify an ecommerce site.',
  busy: 'The scanner is temporarily unavailable. Try again later.',
  limited: 'The free scan limit has been reached. Try again later.',
  timeout: 'The store took too long to respond. Try again later.',
};
const worker = process.env.NEXT_PUBLIC_CRO_WORKER_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : '');

function ScanLoader({ ready }: { ready: boolean }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => setElapsed((performance.now() - started) / 1000), 100);
    return () => window.clearInterval(timer);
  }, []);
  return <div className={styles.loading}>
    <span className={styles.pixels} aria-hidden="true">{Array.from({ length: 9 }, (_, i) => (
      <i key={i} style={{ animationDelay: ((i % 3) + Math.abs(Math.floor(i / 3) - 1)) * 90 + 'ms' }} />
    ))}</span>
    <span role="status" className={styles.shimmer}>{ready ? 'Preparing your report' : 'Checking the storefront'}</span>
    <span className={styles.elapsed} aria-hidden="true">{elapsed.toFixed(1)}s</span>
  </div>;
}

function scopeStatus(report: ScanReport | null, kind: Sample['kind']) {
  const sample = report?.samples.find(s => s.kind === kind);
  return sample ? sampleLabels[sample.status] : '';
}

function consultationUrl(report: ScanReport) {
  const booking = new URL(CAL_LINK);
  const findingList = report.recommendations.map(item => item.title).join('. ');
  const score = report.overall.score === null ? 'score withheld' : report.overall.score + '/100';
  booking.searchParams.set('notes', [
    'Store: ' + report.store,
    'Cascon CRO assessment: ' + score + ' · ' + report.overall.assessed + ' checks assessed',
    findingList && 'Observed priorities: ' + findingList,
  ].filter(Boolean).join('\n'));
  booking.searchParams.set('utm_source', 'cascon_cro_audit');
  booking.searchParams.set('utm_medium', 'website');
  return booking.href;
}

export default function Scanner() {
  const [target, setTarget] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [report, setReport] = useState<ScanReport | null>(null);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [pdfError, setPdfError] = useState('');
  const [makingPdf, setMakingPdf] = useState(false);
  const active = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const engagement = useRef(new Set<string>());
  useEffect(() => () => active.current?.abort(), []);
  useEffect(() => { if (state === 'done' || state === 'error') heading.current?.focus(); }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current || !target.trim()) return;
    setReport(null);
    setMessage('');
    setPdfError('');
    if (!worker) { setMessage(errors.busy); setState('error'); return; }
    const controller = new AbortController();
    active.current = controller;
    const started = performance.now();
    setReady(false);
    setState('loading');
    engagement.current.clear();
    const timer = window.setTimeout(() => controller.abort('timeout'), 21_000);
    try {
      const request = await fetch(new URL('/scan', worker), {
        method: 'POST', signal: controller.signal, cache: 'no-store', credentials: 'omit',
        referrerPolicy: 'no-referrer',
        headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url: target.trim() }),
      });
      const payload = await request.json().catch(() => null);
      if (!request.ok || payload?.version !== 1 || !Array.isArray(payload.recommendations)) {
        const code = payload?.error as ScanError;
        const error = Object.hasOwn(errors, code) ? errors[code] :
          request.status === 429 ? errors.limited : errors.busy;
        throw new Error(error);
      }
      if (controller.signal.aborted) return;
      const result = payload as ScanReport;
      const remaining = 1600 - (performance.now() - started);
      if (remaining > 0) {
        setReady(true);
        await new Promise<void>(resolve => window.setTimeout(resolve, remaining));
        if (controller.signal.aborted) return;
      }
      setReport(result);
      setState('done');
      trackCro({ name: 'cro_scan_complete', coverage: result.overall.score === null ? 'partial' : 'scored',
        sampled: String(result.samples.filter(page => page.status === 'read' || page.status === 'partial').length) });
    } catch (error) {
      if (controller.signal.aborted && controller.signal.reason !== 'timeout') return;
      setMessage(controller.signal.aborted ? errors.timeout :
        error instanceof Error && Object.values(errors).includes(error.message) ? error.message : errors.busy);
      setState('error');
    } finally {
      window.clearTimeout(timer);
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
          <p className={styles.kicker}>Cascon Digital <span>/</span> Conversion tools</p>
          <h1 id="cro-title">Free ecommerce CRO audit</h1>
          <p className={styles.intro}>Check your storefront’s public HTML. Get a readiness assessment and up to three evidence-backed improvements.</p>
          <form onSubmit={submit} className={styles.form} data-clarity-mask="true">
            <label htmlFor="cro-store">Storefront URL</label>
            <div className={styles.inputRow}>
              <input id="cro-store" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}
                placeholder="https://your-store.com" maxLength={2048} required disabled={state === 'loading'} value={target}
                aria-describedby="cro-input-help" onChange={e => setTarget(e.target.value)} />
              <button className={styles.primary} disabled={state === 'loading'} type="submit">Scan store</button>
            </div>
            <p id="cro-input-help">Free summary. No email required.</p>
          </form>
          {state === 'loading' && <div className={styles.progress}><ScanLoader ready={ready} /><button type="button" onClick={cancel} className={styles.textAction}>Cancel scan</button></div>}
          {state === 'error' && <h2 ref={heading} tabIndex={-1} role="alert" className={styles.error}>{message}</h2>}
        </div>
        <aside className={styles.scope} aria-label="Pages the scanner samples">
          <div className={styles.scopeTop}><h2>Scan scope</h2><span>Public HTML</span></div>
          <ol className={styles.scopeRows}>
            {pages.map((page, i) => <li key={page.kind}>
              <span className={styles.pageNumber} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div><strong>{page.label}</strong><p>{page.detail}</p></div>
              <span className={styles.scopeState}>{scopeStatus(report,page.kind)}</span>
            </li>)}
          </ol>
          <Link className={styles.methodLink} href="/tools/cro-audit/methodology">Scoring notes</Link>
        </aside>
      </section>

      {report && <section className={styles.result} data-cro-report="" data-clarity-mask="true" aria-labelledby="cro-report-title">
        <header className={styles.resultTop}>
          <div>
            <p className={styles.kicker}>{report.platform} · {new URL(report.store).hostname}</p>
            <h2 id="cro-report-title" ref={heading} tabIndex={-1}>Conversion readiness</h2>
          </div>
          <div>
            <button className={styles.secondary} onClick={downloadReport} disabled={makingPdf} type="button">
              {makingPdf ? 'Preparing PDF' : 'Download summary PDF'}
            </button>
            {pdfError && <p role="alert" className={styles.error}>{pdfError}</p>}
          </div>
        </header>

        <div className={styles.scoreBox}>
          <div><p>Overall assessment</p><strong>{report.overall.score === null ? 'Score withheld' : report.overall.score + ' / 100'}</strong></div>
          <p>{report.overall.assessed} of {report.overall.applicable} applicable checks were assessed. {report.overall.score === null && 'More evidence is needed for an overall score.'}</p>
        </div>

        <details className={styles.trace} open>
          <summary>Scan evidence</summary>
          <ul>{report.samples.map(sample => <li key={sample.kind}>
            <span>{pages.find(page => page.kind === sample.kind)?.label}</span>
            <span>{sampleLabels[sample.status]}{sample.path ? ' · ' + sample.path : ''}</span>
          </li>)}</ul>
          {report.samples.some(sample => sample.status === 'rate limited' || sample.status === 'blocked') &&
            <p className={styles.sampleNote}>The store limited automated access. The report uses the pages it could read. Missing evidence carries no score penalty.</p>}
        </details>
        <section className={styles.categorySection}>
          <h3>Category results</h3>
          <ul className={styles.categoryGrid}>{report.categories.map(category => <li key={category.category}>
            <strong>{categories[category.category]}</strong>
            <span>{category.score === null ? 'Insufficient evidence' : category.score + ' / 100'}</span>
            <small>{category.applicable > 0 ? category.assessed + ' of ' + category.applicable + ' assessed' : 'No applicable checks'}</small>
          </li>)}</ul>
        </section>
        <section className={styles.recommendations}>
          <h3>Recommended next steps</h3>
          {report.recommendations.length === 0 ?
            <p>The scan found no recommendation with enough evidence to show here. Check the sample and coverage to see what was assessed.</p> :
            report.recommendations.map(item => <details key={item.id} className={styles.trace}
              onToggle={e => { if (e.currentTarget.open) engagementOnce(item.id, () => trackCro({ name: 'cro_recommendation_engagement', rule: item.id })); }}>
              <summary>{item.title}</summary>
              <dl className={styles.finding}>
                <div><dt>Observed evidence</dt><dd>{item.evidence} <span>{item.path}</span></dd></div>
                <div><dt>Why it matters</dt><dd>{item.why}</dd></div>
                <div><dt>Suggested change</dt><dd>{item.change}</dd></div>
                <div><dt>Priority, effort and confidence</dt><dd>{item.priority} priority · {item.effort} effort · {item.confidence} confidence</dd></div>
              </dl>
            </details>)}
        </section>
        <section className={styles.expert}>
          <div><h3>Expert CRO audit</h3><p>Get a visual UX review, competitor analysis, a prioritized implementation roadmap and an experimentation strategy.</p></div>
          <a className={styles.primary} data-cro-booking href={consultationUrl(report)} referrerPolicy="no-referrer"
            onClick={() => engagementOnce('consultation', () => trackCro({ name: 'enquiry_intent', channel: 'calendar', tool: 'cro-audit' }))}>
            Unlock full CRO audit
          </a>
        </section>
      </section>}

    </div>
  </div>;
}
