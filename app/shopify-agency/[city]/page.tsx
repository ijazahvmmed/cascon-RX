import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cityPages } from '@/data/locations';
import { commercialServices } from '@/data/commercial-services';
import { allWorkCards } from '@/data/work';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import CaseCard from '@/components/CaseCard';
import PricingTiers from '@/components/PricingTiers';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import { SITE_URL, SITE_NAME, LOCATIONS, CONTACT_EMAIL } from '@/lib/constants';

export function generateStaticParams() { return cityPages.map(c => ({ city: c.slug })); }
async function getCity(params: Promise<{ city: string }>) { const { city } = await params; const page = cityPages.find(c => c.slug === city); if (!page) notFound(); return page; }
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) { const c = await getCity(params); return pageMetadata('/shopify-agency/' + c.slug, c.title, c.description); }

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const c = await getCity(params), path = '/shopify-agency/' + c.slug;
  const office = c.office ? LOCATIONS[c.office] : undefined;
  const projects = c.projects.flatMap(slug => allWorkCards.filter(project => project.slug === slug));
  const business = {
    '@context': 'https://schema.org', '@type': office ? 'ProfessionalService' : 'Service', '@id': SITE_URL + path + '#business',
    name: office ? `${SITE_NAME} ${c.city}` : SITE_NAME, url: SITE_URL + path, email: CONTACT_EMAIL,
    image: SITE_URL + '/cascon-black.png', ...(office ? { parentOrganization: { '@id': SITE_URL + '/#organization' } } : { provider: { '@id': SITE_URL + '/#organization' }, serviceType: 'Shopify and ecommerce website development' }),
    description: c.description, priceRange: c.tiers[0][2].split(/\s[–-]\s/)[0] + '+',
    areaServed: office ? [{ '@type': 'City', name: c.city }, { '@type': 'Country', name: c.country }] : [{ '@type': 'State', name: c.region }],
    ...(office ? { telephone: office.phone, hasMap: office.mapUrl, address: { '@type': 'PostalAddress', streetAddress: office.address.split('\n').slice(0, -2).join(', '), addressLocality: c.city, addressRegion: c.region, addressCountry: c.countryCode } } : {}),
  };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
  return <div className="interior-gradient"><ContentIntro title={c.title} label={`${c.city} / ${c.country}`} description={c.intro} crumbs={[{ name: 'Services', path: '/services' }, { name: c.city, path }]} />
    <div className="shell content-body">
      <section className="content-section"><div className="section-heading"><span className="eyebrow">{c.city} market</span><h2>{c.marketTitle}</h2><p>{c.marketIntro}</p></div><div className="detail-grid">{c.market.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div></section>
      {projects.length > 0 && <section className="content-section"><div className="section-heading"><span className="eyebrow">Client work</span><h2>{c.workHeading}</h2><p>{c.projectsIntro}</p></div><div className="case-grid content-projects">{projects.slice(0, 3).map(p => <CaseCard key={p.name} {...p} />)}</div>{c.otherClients && <p className="city-note">{c.otherClients}</p>}</section>}
      <section className="content-section"><div className="section-heading"><span className="eyebrow">Pricing</span><h2>Typical Shopify build prices in {c.city}.</h2><p>{c.pricingIntro}</p></div><PricingTiers tiers={c.tiers} currencies={c.currencies} autoDetect={false} /></section>
      <section className="content-section input-section"><div><span className="eyebrow">{office ? 'Visit us' : 'How we work'}</span><h2>{office ? `Our ${c.city} office.` : `Working with ${c.region} teams.`}</h2></div>{office ? <address className="city-office"><p>{office.address.split('\n').map(line => <span key={line}>{line}<br /></span>)}</p><p><a href={'tel:' + office.phone.replace(/\s/g, '')}>{office.phone}</a><br /><a href={'mailto:' + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p><a className="context-link" href={office.mapUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a></address> : <div className="city-office"><p>{c.officeNote}</p><Link className="context-link" href="/contact">Book a call with the team →</Link></div>}</section>
      <section className="content-section commercial-faq"><h2>Questions from {c.city} brands.</h2><div>{c.faqs.map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="content-section related-content"><div><h2>Services for {c.city}.</h2>{c.services.map(slug => { const s = commercialServices.find(v => v.slug === slug)!; return <Link key={slug} href={'/services/' + slug}>{s.name} →</Link>; })}</div><div><h2>Other locations.</h2>{cityPages.filter(v => v.slug !== c.slug).map(v => <Link key={v.slug} href={'/shopify-agency/' + v.slug}>{v.title} →</Link>)}</div></section>
      <ContentCta /></div>
    <JsonLd data={webPageSchema(path, c.title, c.description, { '@id': SITE_URL + path + '#business' })} /><JsonLd data={business} /><JsonLd data={faqSchema} /></div>;
}
