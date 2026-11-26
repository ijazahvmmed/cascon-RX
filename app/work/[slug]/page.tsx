import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projectProfiles } from '@/data/project-profiles';
import { allWorkCards } from '@/data/work';
import { commercialServices } from '@/data/commercial-services';
import { insights } from '@/data/insights';
import { SITE_URL } from '@/lib/constants';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import CaseCard from '@/components/CaseCard';
import JsonLd from '@/components/JsonLd';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projectProfiles.map(({ slug }) => ({ slug }));
}

async function getProject(params: Props['params']) {
  const { slug } = await params;
  const profile = projectProfiles.find(project => project.slug === slug);
  const work = allWorkCards.find(project => project.slug === slug);
  if (!profile || !work) notFound();
  return { profile, work };
}

export async function generateMetadata({ params }: Props) {
  const { profile, work } = await getProject(params);
  return pageMetadata('/work/' + profile.slug, profile.seoTitle ?? profile.name + ' — Website & Creative Work',
    profile.description ?? profile.intro + ' Explore the project scope and related Cascon Digital services.',
    { image: work.image });
}

export default async function ProjectPage({ params }: Props) {
  const { profile, work } = await getProject(params);
  const path = '/work/' + profile.slug;
  const headline = profile.headline ?? profile.name + '.';
  const description = profile.description ?? profile.intro;
  const related = profile.relatedProjects
    ? profile.relatedProjects.flatMap(slug => allWorkCards.filter(project => project.slug === slug))
    : allWorkCards.filter(project => project.slug !== work.slug && projectProfiles.some(item => item.slug === project.slug)
      && project.tags.some(tag => work.tags.includes(tag))).slice(0, 2);
  const articles = profile.relatedArticles?.flatMap(slug => insights.filter(article => article.slug === slug)) ?? [];
  const entityId = SITE_URL + path + '#project';

  return <div className="interior-gradient">
    <ContentIntro title={headline} description={profile.intro}
      label={[profile.name, profile.industry, profile.status].filter(Boolean).join(' / ')}
      crumbs={[{ name: 'Work', path: '/work' }, { name: profile.name, path }]} />
    <article className="shell content-body">
      <figure className="project-figure">
        <div className="wide-image"><Image src={work.image} alt={profile.heroAlt ?? profile.name + ' portfolio imagery'} fill priority sizes="92vw" /></div>
        <figcaption>{profile.heroCaption ?? 'Selected brand imagery.'}{profile.source && <a href={profile.source} target="_blank" rel="noopener noreferrer" data-project={profile.name}>Visit {profile.name} ↗</a>}</figcaption>
      </figure>
      {profile.highlights?.length ? <dl className="detail-grid project-highlights">{profile.highlights.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : null}
      <section className="content-section content-feature"><h2>Context and challenge.</h2><p>{profile.context}</p></section>
      {profile.documentedDetails?.map(detail => <section className="content-section content-feature" key={detail.title}><h2>{detail.title}</h2><p>{detail.body}</p></section>)}
      {profile.gallery?.length ? <section className="content-section"><h2>Project gallery.</h2><div className="detail-grid">
        {profile.gallery.map(image => <figure className="project-figure" key={image.src}><Image {...{ src: image.src, width: image.width, height: image.height, alt: image.alt }} sizes="(max-width: 640px) 90vw, 45vw" /><figcaption>{image.caption}</figcaption></figure>)}
      </div></section> : null}
      <section className="content-section"><div className="section-heading"><span className="eyebrow">Cascon Digital’s role</span><h2>What we delivered.</h2></div>
        <div className="detail-grid">{profile.scope.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div>
      </section>
      {profile.timeline?.length ? <section className="content-section"><h2>Project timeline.</h2><dl className="guide-checks">{profile.timeline.map(item => <div key={item.milestone}><dt>{item.milestone}</dt><dd>{item.duration}</dd></div>)}</dl></section> : null}
      {(profile.outcomes?.length || profile.verifiedOutcomes?.length) ? <section className="content-section content-feature">
        <h2>Documented outcomes.</h2><div>
          {profile.outcomes?.map(statement => <p key={statement}>{statement}</p>)}
          {profile.verifiedOutcomes?.map(outcome => <p key={outcome.evidenceUrl}>{outcome.statement} <a className="context-link" href={outcome.evidenceUrl}>Supporting evidence ↗</a></p>)}
        </div>
      </section> : null}
      {profile.evidence?.length ? <aside className="source-notes"><h2>Supporting evidence.</h2>{profile.evidence.map(item => <a key={item.url} href={item.url}>{item.label} ↗</a>)}</aside> : null}
      <section className="content-section related-content">
        <div><h2>Related services.</h2>{commercialServices.filter(service => profile.services.includes(service.slug)).map(service => <Link key={service.slug} href={'/services/' + service.slug}>{service.name} →</Link>)}</div>
        {articles.length > 0 && <div><h2>Practical guides.</h2>{articles.map(article => <Link key={article.slug} href={'/insights/' + article.slug}>{article.title} →</Link>)}</div>}
      </section>
      {related.length > 0 && <section className="content-section"><h2>Connected work.</h2><div className="case-grid content-projects related-project-grid">{related.map(project => <CaseCard key={project.slug} {...project} />)}</div></section>}
      <ContentCta title="Have a similar project in mind?" />
    </article>
    <JsonLd data={webPageSchema(path, headline, description, { '@id': entityId })} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': entityId, name: headline, description,
      url: SITE_URL + path, author: { '@id': SITE_URL + '/#organization' }, about: { '@type': 'Organization', name: profile.name, url: profile.source },
      image: SITE_URL + work.image, datePublished: profile.published, dateModified: profile.updated,
      mainEntityOfPage: { '@id': SITE_URL + path + '#webpage' },
      mentions: profile.services.map(slug => ({ '@id': SITE_URL + '/services/' + slug + '#service' })),
    }} />
  </div>;
}
