'use client';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { allWorkCards, moreWork } from '@/data/work';
import CaseCard from '@/components/CaseCard';
import ServiceTag from '@/components/ServiceTag';
import { formatTag } from '@/lib/tags';
import { projectId, serviceHref } from '@/lib/links';

const tags = ['all', 'shopify', 'web-design', 'ai-media', 'ai-photography', 'content', 'cro', 'seo-aeo', 'performance-marketing', 'automation'];
export default function WorkClient() {
  const [active, setActive] = useState('all');
  useEffect(() => {
    const reset = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="/work#"]') : null;
      if (link) {
        // Restore the target before Next and Lenis resolve the same-page anchor.
        flushSync(() => setActive('all'));
      }
    };
    document.addEventListener('click', reset, true);
    return () => document.removeEventListener('click', reset, true);
  }, []);
  const visible = allWorkCards.filter(work => active === 'all' || work.tags.includes(active));
  const more = moreWork.filter(work => active === 'all' || work.tags.includes(active));
  const count = visible.length + more.length;
  return <div className="shell work-area">
    <div className="work-filters" role="group" aria-label="Filter work by service">{tags.map(tag => <button key={tag} aria-pressed={active === tag} onClick={() => setActive(tag)}>{formatTag(tag)}</button>)}</div>
    <p className="work-status" role="status">{count} {count === 1 ? 'project' : 'projects'} · {formatTag(active)}</p>
    <h2 className="sr-only">Selected projects</h2>
    <div className="case-grid">{visible.map(item => <CaseCard key={item.name} {...item} sizes="(max-width: 640px) 90vw, 45vw" />)}</div>
    {!count && <div className="work-empty"><h2>Let’s make the next one.</h2><p>We haven’t published a project in this category yet.</p><Link href={serviceHref(active)}>Explore {formatTag(active).toLowerCase()} services <span aria-hidden="true">→</span></Link></div>}
    {more.length > 0 && <section className="more-work"><h2>And there’s more.</h2><div className="more-work-grid">{more.map(item => <article key={item.name} className="more-work-item" id={projectId(item.name)}><h3>{item.name}</h3><span>{item.region}</span><ul className="case-tags">{item.tags.map(tag => <li key={tag}><ServiceTag tag={tag} /></li>)}</ul></article>)}</div></section>}
  </div>;
}
