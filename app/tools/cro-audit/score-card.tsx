'use client';

import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react';
import { assessment, categories, categoryResult, type CategoryResult, type ScanReport } from '@/lib/cro/model';
import styles from './score-card.module.css';

const outcomes = [
  { key: 'passed', label: 'Confirmed' },
  { key: 'issues', label: 'To fix' },
  { key: 'open', label: 'Still open' },
] as const;

function Counter({ value }: { value: number }) {
  const display = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = display.current;
    if (!node || !value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const fraction = Math.max(0, Math.min(1, (now - start) / 650));
      node.textContent = String(Math.round(value * (1 - (1 - fraction) ** 4)));
      if (fraction < 1) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <><span aria-hidden="true" ref={display}>{value}</span><span className={styles.srOnly}>{value}</span></>;
}

function ScorePlot({ score }: { score: ReturnType<typeof assessment> | null }) {
  const [active, setActive] = useState<string | null>(null);
  return <div className={styles.plot} aria-label="Shopping questions by outcome" role="group">
    {outcomes.map(({ key, label }, index) => {
      const count = score?.[key];
      const height = score && score.total ? 100 * score[key] / score.total : 0;
      return <button key={key} type="button" disabled={!score} className={styles.bar}
        data-tone={key} data-dim={Boolean(active && active !== key)} data-active={active === key}
        aria-label={score ? label + ', ' + count + ' of ' + score.total + ' questions' : label}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(key); }}
        onPointerLeave={event => { if (event.pointerType === 'mouse') setActive(null); }}
        onFocus={() => setActive(key)} onBlur={() => setActive(null)} onClick={() => setActive(key)}
        onKeyDown={event => { if (event.key === 'Escape') setActive(null); }}>
        <span className={styles.column} aria-hidden="true">
          <span className={styles.fill} style={{ height: height + '%' }}>
            {Array.from({ length: (count ?? 0) * 2 }, (_, row) =>
              <i key={row} className={styles.dotRow} style={{ '--delay': (row * 17 + index * 45) + 'ms' } as CSSProperties} />)}
          </span>
          {active === key && score && <span className={styles.tip}>{count} of {score.total}</span>}
        </span>
        <span className={styles.barLabel}><i className={styles.keyDot} aria-hidden="true" />{label}</span>
        <span className={styles.count}>{count ?? '—'}</span>
      </button>;
    })}
  </div>;
}

function AreaPlot({ areas }: { areas: CategoryResult[] }) {
  const [selected, setSelected] = useState<CategoryResult | null>(null);
  return <div className={styles.areas}>
    <ul className={styles.areaList}>
      {areas.map(area => <li key={area.category}>
        <button type="button" aria-pressed={selected?.category === area.category}
          aria-label={categories[area.category] + '. ' + categoryResult(area)}
          onFocus={() => setSelected(area)} onClick={() => setSelected(area)}>
          <span>{categories[area.category]}</span>
          <span className={styles.areaDots} aria-hidden="true">
            {area.applicable ? Array.from({ length: area.applicable }, (_, i) =>
              <i className={styles.keyDot} key={i} data-tone={i < area.passed ? 'passed' : i < area.assessed ? 'issues' : 'open'} />) : '—'}
          </span>
        </button>
      </li>)}
    </ul>
    <p className={styles.areaDetail} aria-live="polite">{selected
      ? categories[selected.category] + ' · ' + categoryResult(selected) : 'Select an area to see its checks.'}</p>
    <div className={styles.legend}>{outcomes.map(({ key, label }) =>
      <span key={key}><i className={styles.keyDot} data-tone={key} />{label}</span>)}</div>
  </div>;
}

export default function ScoreCard({ report, loading, headingRef }: {
  report: ScanReport | null; loading: boolean; headingRef: Ref<HTMLHeadingElement>;
}) {
  const [view, setView] = useState<'score' | 'areas'>('score');
  const score = report && assessment(report);
  const areas = view === 'areas' && Boolean(report);
  const value = areas && report ? report.overall.assessed : score?.minimum;
  const title = areas ? 'Store checks completed' : score?.label ?? 'Shopping score';
  return <section className={styles.card} aria-labelledby="cro-score-heading" data-clarity-mask="true">
    <div className={styles.cardHead}>
      <h2 id="cro-score-heading" ref={headingRef} tabIndex={-1} className={styles.label}>{title}</h2>
      {report && <div className={styles.views} role="group" aria-label="Chart view">
        <button type="button" aria-pressed={!areas} onClick={() => setView('score')}>Score</button>
        <button type="button" aria-pressed={areas} onClick={() => setView('areas')}>By area</button>
      </div>}
    </div>
    <div className={styles.number} data-score={areas ? undefined : score?.minimum}>
      {value === undefined ? '—' : <Counter key={view} value={value} />}
      <span className={styles.unit}> / {areas && report ? report.overall.applicable : 100}</span>
    </div>
    <p className={styles.description}>{areas ? 'Individual checks across the store.' : score ? score.detail :
      loading ? 'Your score will appear when the scan finishes.' : 'Enter your store address to see your score.'}</p>
    {areas && report ? <AreaPlot areas={report.categories} /> : <ScorePlot score={score} />}
  </section>;
}
