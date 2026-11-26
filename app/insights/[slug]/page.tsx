import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { insights } from '@/data/insights';
import { commercialServices } from '@/data/commercial-services';
import { projectProfiles } from '@/data/project-profiles';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

type Props = { params: Promise<{ slug: string }> };
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const formatDate = (date: string) => dateFormat.format(new Date(date + 'T00:00:00Z'));
export function generateStaticParams() {
  return insights.map(({ slug }) => ({ slug }));
}
async function getInsight(params: Props['params']) {
  const { slug } = await params;
  const article = insights.find(item => item.slug === slug);
  if (!article) notFound();
  return article;
}
function sharingImage(article: (typeof insights)[number]) {
  return article.image ?? commercialServices.find(service => service.slug === article.relatedServices[0])?.image ?? '/opengraph-image';
}

export async function generateMetadata({ params }: Props) {
  const article = await getInsight(params);
  return pageMetadata('/insights/' + article.slug, article.seoTitle ?? article.title, article.description, {
    image: sharingImage(article),
    article: { publishedTime: article.published, modifiedTime: article.updated, authors: [article.author?.name ?? SITE_NAME] },
  });
}

export default async function InsightPage({ params }: Props) {
  const article = await getInsight(params);
  const path = '/insights/' + article.slug;
  const wordCount = [article.summary, ...article.sections.flatMap(section => [...section.paragraphs, ...(section.checks?.flat() ?? []), ...(section.table?.rows.flat() ?? [])])].join(' ').split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 220));
  const projects = article.relatedProjects?.flatMap(slug => projectProfiles.filter(project => project.slug === slug)) ?? [];
  const related = article.relatedArticles?.flatMap(slug => insights.filter(item => item.slug === slug)) ?? [];
  const byline = article.author ?? { name: SITE_NAME, profile: '/about#editorial' };
  const published = article.published;
  const updated = article.updated;
  const dataset = article.research?.dataset;
  return <div className="interior-gradient">
    <ContentIntro title={article.title} description={article.summary} label={article.category ?? 'Practical guide'}
      crumbs={[{ name: 'Insights', path: '/insights' }, { name: article.title, path }]} />
    <div className="shell content-body">
      <article className="reading-layout">
        <aside className="article-navigation"><span className="eyebrow">In this guide</span><nav aria-label="Article contents">
          {article.sections.map(section => <Link href={'#' + section.id} key={section.id}>{section.title}</Link>)}
          {article.research && <Link href="#research-method">Research methodology and findings</Link>}
        </nav></aside>
        <div className="reading-copy">
          <p className="article-date">By <Link href={byline.profile}>{byline.name}</Link> · {minutes} min read
            {published && <> · Published <time dateTime={published}>{formatDate(published)}</time></>}
            {updated && updated !== published && <> · Updated <time dateTime={updated}>{formatDate(updated)}</time></>}
            {article.reviewer && <> · Reviewed by <Link href={article.reviewer.profile}>{article.reviewer.name}</Link></>}
          </p>
          <p className="article-reader">{article.reader}</p>
          {article.sections.map(section => <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.table && <div className="guide-table" tabIndex={0} role="region" aria-label={section.title + ' comparison'}><table>
              <caption className="sr-only">{section.title}</caption>
              <thead><tr>{section.table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
              <tbody>{section.table.rows.map(([label, ...cells]) => <tr key={label}><th scope="row">{label}</th>{cells.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody>
            </table></div>}
            {section.checks && <dl className="guide-checks">{section.checks.map(([label, body]) => <div key={label}><dt>{label}</dt><dd>{body}</dd></div>)}</dl>}
            {section.image && <figure className="project-figure"><Image src={section.image.src} width={section.image.width} height={section.image.height} alt={section.image.alt} sizes="(max-width: 960px) 90vw, 65vw" /><figcaption>{section.image.caption}</figcaption></figure>}
            {section.link && <p><Link className="context-link" href={section.link[1]}>{section.link[0]} →</Link></p>}
          </section>)}
          {article.research && <section id="research-method"><h2>Research methodology.</h2><p>{article.research.methodology}</p><h3>Sample.</h3><p>{article.research.sample}</p>
            <h3>Findings.</h3>{article.research.findings.map(finding => <p key={finding}>{finding}</p>)}<h3>Limitations.</h3><p>{article.research.limitations}</p>
            {article.research.downloads.map(download => <p key={download.url}><a className="context-link" href={download.url}>{download.label} ↓</a></p>)}
            <h3>Version history.</h3>{article.research.versions.map(version => <p key={version.date}><time dateTime={version.date}>{formatDate(version.date)}</time> · {version.changes}</p>)}
          </section>}
          <aside className="source-notes" aria-label="Sources"><h2>References and further reading.</h2>{article.sources.map(([name, url]) => <a key={url} href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</aside>
        </div>
      </article>
      <section className="content-section related-content">
        <div><h2>Related services.</h2>{commercialServices.filter(service => article.relatedServices.includes(service.slug)).map(service => <Link href={'/services/' + service.slug} key={service.slug}>{service.name} →</Link>)}</div>
        {projects.length > 0 && <div><h2>Project examples.</h2>{projects.map(project => <Link href={'/work/' + project.slug} key={project.slug}>{project.name} case study →</Link>)}</div>}
        {related.length > 0 && <div><h2>More practical guidance.</h2>{related.map(item => <Link href={'/insights/' + item.slug} key={item.slug}>{item.title} →</Link>)}</div>}
      </section>
      <ContentCta title={article.cta} />
    </div>
    <JsonLd data={webPageSchema(path, article.title, article.description, { '@id': SITE_URL + path + '#article' })} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Article', '@id': SITE_URL + path + '#article',
      headline: article.title, description: article.description, url: SITE_URL + path,
      datePublished: published, dateModified: updated, articleSection: article.category,
      image: new URL(sharingImage(article), SITE_URL).href,
      author: article.author ? { '@type': 'Person', name: byline.name, url: new URL(byline.profile, SITE_URL).href } : { '@id': SITE_URL + '/#organization' },
      publisher: { '@id': SITE_URL + '/#organization' }, mainEntityOfPage: { '@id': SITE_URL + path + '#webpage' },
      ...(dataset ? { about: { '@id': SITE_URL + path + '#dataset' } } : {}),
      citation: article.sources.map(([, url]) => url),
    }} />
    {dataset && <JsonLd data={{
      '@context': 'https://schema.org', '@type': 'Dataset', '@id': SITE_URL + path + '#dataset',
      name: article.title, description: article.description, url: SITE_URL + path,
      identifier: `https://doi.org/${dataset.doi}`, sameAs: `https://doi.org/${dataset.doi}`,
      creator: { '@id': SITE_URL + '/#organization' }, datePublished: published,
      license: dataset.license, version: dataset.version, inLanguage: 'en-IN',
      distribution: { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: new URL(dataset.csv, SITE_URL).href },
      subjectOf: { '@id': SITE_URL + path + '#article' },
    }} />}
  </div>;
}
