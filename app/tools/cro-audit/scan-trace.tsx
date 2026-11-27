'use client';

import { useEffect, useState } from 'react';
import { sampleLabels } from '@/lib/cro/model';
import type { PageKind, ScanReport, ScanUpdate } from '@/lib/cro/model';
import styles from './scanner.module.css';

export const presentationMs = 18_000;
export type PageRead = Extract<ScanUpdate, { reading: PageKind }>;
const labels = { homepage: 'Homepage', product: 'Product page', collection: 'Collection page' };

export async function readStream(response: Response, onRead: (event: PageRead) => void) {
  if (!response.body) throw new Error('Empty scan response');
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let pending = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      pending += value ?? '';
      const lines = pending.split('\n');
      pending = lines.pop() ?? '';
      for (const line of lines) {
        const update: ScanUpdate = JSON.parse(line);
        if ('reading' in update) onRead(update);
        else if ('report' in update) return update.report;
        else if ('error' in update) return update;
      }
      if (done) throw new Error('Incomplete scan response');
    }
  } finally { reader.releaseLock(); }
}

export default function ScanTrace({ reads, result, started, settled }: {
  reads: PageRead[]; result: ScanReport | null; started: number; settled: boolean;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  useEffect(() => {
    if (settled) return;
    const tick = () => setElapsed(performance.now() - started);
    tick();
    const timer = window.setInterval(tick, 120);
    return () => window.clearInterval(timer);
  }, [settled, started]);
  const open = manualOpen ?? !settled;
  const rows: { title: string; detail: string }[] = result ? result.samples.map(sample => ({
    title: labels[sample.kind], detail: [sampleLabels[sample.status], sample.path].filter(Boolean).join(' · '),
  })) : reads.map(read => ({ title: labels[read.reading], detail: 'Opening ' + read.path }));
  if (result) {
    const summary = result.score;
    rows.push({ title: 'Other checks', detail: result.overall.passed + ' passed out of ' + result.overall.assessed + ' checks.' },
      { title: summary.label, detail: summary.value + '. ' + summary.detail });
    if (result.viewports) rows.push({title:'Screen sizes',detail:result.viewports.length ?
      result.viewports.map(v => v.width+'px: '+(v.headingInView === null ? 'heading unconfirmed' : v.headingInView ? 'heading in view' : 'heading outside view')).join(' · ') + '. Based on the saved page with built-in styles.' :
      'Screen sizes were not inspected.'});
    const first = result.recommendations[0];
    if (first) rows.push({ title: first.title, detail: first.evidence });
  }
  const visible = result && !settled ? Math.min(rows.length, 1 + Math.floor(elapsed / (presentationMs / rows.length))) : rows.length;
  const title = settled ? 'Scan details' : result ? 'Checking what we found' : 'Opening store pages';
  return <div className={styles.scanTrace} data-clarity-mask="true">
    <button type="button" className={styles.loading} aria-label={title} aria-expanded={open} aria-controls="cro-trace-rows"
      onClick={() => setManualOpen(!open)}>
      {!settled && <span className={styles.pixels} aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ animationDelay: ((i % 3) + Math.floor(i / 3)) * 90 + 'ms' }} />)}
      </span>}
      <span role="status" className={settled ? undefined : styles.shimmer}>{title}</span>
      {!settled && <span className={styles.elapsed} aria-hidden="true">{(elapsed / 1000).toFixed(1)}s</span>}
      <span aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
    <div id="cro-trace-rows" hidden={!open}>
      <ol className={styles.steps} aria-label="Scan activity">
        {!rows.length && <li><span className={styles.spin} aria-hidden="true" />Opening the store</li>}
        {rows.slice(0, visible).map((row, index) => <li key={row.title + index + Boolean(result)}>
          <span aria-hidden="true" className={!result && index === visible - 1 ? styles.spin : styles.traceDot} />
          <span>{row.title}<small>{row.detail}</small></span>
        </li>)}
      </ol>
    </div>
  </div>;
}
