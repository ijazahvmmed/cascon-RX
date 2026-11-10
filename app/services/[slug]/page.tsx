import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { commercialServices } from '@/data/commercial-services';
import { allWorkCards } from '@/data/work';
import { insights } from '@/data/insights';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import CaseCard from '@/components/CaseCard';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import { projectId } from '@/lib/links';
export function generateStaticParams() { return commercialServices.map(s => ({ slug: s.slug })); }
async function getService(params: Promise<{ slug: string }>) { const { slug } = await params; const service = commercialServices.find(s => s.slug === slug); if (!service) notFound(); return service; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const s = await getService(params); return pageMetadata('/services/' + s.slug, s.title, s.description); }
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = await getService(params), path = '/services/' + s.slug;
  const projects = allWorkCards.filter(p => s.projects.includes(projectId(p.name)));
  return <div className="interior-gradient"><ContentIntro title={s.title} label={s.name} description={s.intro} crumbs={[{ name: 'Services', path: '/services' }, { name: s.name, path }]} />
    <div className="shell content-body"><section className="content-feature"><div><span className="eyebrow">The right fit</span><h2>{s.summary}</h2><p>{s.fit}</p><Link className="context-link" href="/contact">Discuss the fit for your business →</Link></div><div className="service-visual"><Image src={s.image} alt={s.imageAlt} fill sizes="(max-width: 640px) 90vw, 43vw" /></div></section>
    <section className="content-section"><div className="section-heading"><span className="eyebrow">Scope & deliverables</span><h2>What the work can include.</h2></div><div className="detail-grid">{s.deliverables.map(([title,body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></section>
    <section className="content-section"><div className="section-heading"><span className="eyebrow">A shared process</span><h2>From the brief to the next decision.</h2></div><ol className="process-list">{s.steps.map(([title,body],i) => <li key={title}><span className="eyebrow">0{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
    <section className="content-section input-section"><h2>Bring these to the first conversation.</h2><ul className="input-list">{s.inputs.map(input => <li key={input}>{input}</li>)}</ul></section>
    {projects.length > 0 && <section className="content-section"><div className="section-heading"><span className="eyebrow">Relevant experience</span><h2>Selected work.</h2></div><div className="case-grid content-projects">{projects.slice(0,3).map(p => <CaseCard key={p.name} {...p} />)}</div></section>}
    <section className="content-section commercial-faq"><h2>Questions before you start.</h2><div>{s.faqs.map(([q,a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    <section className="content-section related-content"><div><h2>Connected services.</h2>{s.related.map(slug => { const item = commercialServices.find(v => v.slug === slug)!; return <Link key={slug} href={'/services/' + slug}>{item.name} →</Link>; })}</div>{s.insights.length > 0 && <div><h2>Useful before the brief.</h2>{s.insights.map(slug => { const item = insights.find(v => v.slug === slug)!; return <Link key={slug} href={'/insights/' + slug}>{item.title} →</Link>; })}</div>}</section>
    {s.sources.length > 0 && <aside className="source-notes" aria-label="Platform references"><span>Platform references</span>{s.sources.map(([name,url]) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</aside>}
    <ContentCta /></div><JsonLd data={webPageSchema(path,s.title,s.description,{ '@id': SITE_URL + path + '#service' })} /><JsonLd data={{ '@context': 'https://schema.org', '@type': 'Service', '@id': SITE_URL + path + '#service', name: s.name, serviceType: s.name, description: s.description, url: SITE_URL + path, provider: { '@id': SITE_URL + '/#organization' }, areaServed: ['India','United Arab Emirates'] }} /></div>;
}
