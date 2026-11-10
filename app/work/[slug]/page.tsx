import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectProfiles } from '@/data/project-profiles';
import { allWorkCards } from '@/data/work';
import { commercialServices } from '@/data/commercial-services';
import { projectId } from '@/lib/links';
import { SITE_URL } from '@/lib/constants';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import CaseCard from '@/components/CaseCard';
import ServiceTag from '@/components/ServiceTag';
import JsonLd from '@/components/JsonLd';
export function generateStaticParams() { return projectProfiles.map(p => ({ slug: p.slug })); }
async function getProject(params: Promise<{ slug: string }>) { const { slug } = await params; const profile = projectProfiles.find(p => p.slug === slug); if (!profile) notFound(); const work = allWorkCards.find(p => projectId(p.name) === slug)!; return { profile, work }; }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { profile: p } = await getProject(params); return pageMetadata('/work/' + p.slug, p.name + ' — Website & Creative Project', p.intro + ' Explore the project scope and related Cascon services.'); }
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { profile: p, work } = await getProject(params), path = '/work/' + p.slug;
  const related = allWorkCards.filter(v => projectProfiles.some(k => k.name === v.name) && v.name !== p.name && v.tags.some(tag => work.tags.includes(tag))).slice(0,2);
  return <div className="interior-gradient"><ContentIntro title={p.name + '.'} description={p.intro} label={p.industry + ' / Project overview'} crumbs={[{ name:'Work',path:'/work' },{ name:p.name,path }]} /><div className="shell content-body">
    <figure className="project-figure"><div className="wide-image"><Image src={work.image} alt={p.name + ' brand imagery from its public website'} fill priority sizes="92vw" /></div><figcaption>Selected brand imagery. <a href={p.source} target="_blank" rel="noopener noreferrer" data-project={p.name}>Visit {p.name} ↗</a></figcaption></figure>
    <section className="content-section content-feature"><div><span className="eyebrow">The brand</span><h2>{p.industry}.</h2></div><div><p>{p.context}</p><ul className="case-tags">{work.tags.map(tag => <li key={tag}><ServiceTag tag={tag} /></li>)}</ul></div></section>
    <section className="content-section"><div className="section-heading"><span className="eyebrow">Cascon’s role</span><h2>The project scope.</h2></div><div className="detail-grid">{p.scope.map(([title,body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></section>
    {p.documentedDetails?.map(detail => <section className="content-section" key={detail.title}><h2>{detail.title}</h2><p>{detail.body}</p></section>)}
    {p.verifiedOutcomes && p.verifiedOutcomes.length > 0 && <section className="content-section"><h2>Documented outcomes.</h2>{p.verifiedOutcomes.map(outcome => <p key={outcome.evidenceUrl}>{outcome.statement} <a href={outcome.evidenceUrl} target="_blank" rel="noopener noreferrer">Supporting evidence ↗</a></p>)}</section>}
    <section className="content-section related-content"><div><h2>Explore the services.</h2>{p.services.map(slug => <Link key={slug} href={'/services/'+slug}>{commercialServices.find(s=>s.slug===slug)!.name} →</Link>)}</div><div><h2>See the brand.</h2><p>Explore the current website for its catalogue and presentation.</p><a className="context-link" href={p.source} target="_blank" rel="noopener noreferrer" data-project={p.name}>Visit {p.name} ↗</a></div></section>
    {related.length > 0 && <section className="content-section"><h2>Connected work.</h2><div className="case-grid content-projects related-project-grid">{related.map(v=><CaseCard key={v.name} {...v} />)}</div></section>}<ContentCta title="Have a similar brief in mind?" /></div>
    <JsonLd data={webPageSchema(path,p.name + ' project overview',p.intro,{ '@id': SITE_URL+path+'#overview' })} /><JsonLd data={{ '@context':'https://schema.org','@type':'CreativeWork','@id':SITE_URL+path+'#overview',name:p.name+' project overview',description:p.intro,url:SITE_URL+path,author:{ '@id':SITE_URL+'/#organization' },about:{ '@type':'Organization',name:p.name,url:p.source },image:SITE_URL+work.image }} /></div>;
}
