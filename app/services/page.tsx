import Image from 'next/image';
import Link from 'next/link';
import PageIntro from '@/components/PageIntro';
import MorphButton from '@/components/MorphButton';
import Faq from '@/components/Faq';
import RelatedProjects from '@/components/RelatedProjects';
import JsonLd from '@/components/JsonLd';
import { services } from '@/data/services';
import { SITE_URL, CAL_LINK } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/services', 'Shopify Development, CRO, AI Media & SEO Services', 'Shopify development, CRO, AI product photography, performance marketing, automation, SEO and AEO for ecommerce brands in India and the UAE.');
const images: Record<string,string> = { 'ai-media': '/images/work/hanbee.jpg', 'seo-aeo': '/images/work/carsupply.jpg', 'content-strategy': '/images/work/rewise.jpg' };
export default function ServicesPage() {
  return <div className="interior-gradient">
    <PageIntro label="Services" path="/services" title={<>From the first impression.<br />To the next order.</>} description="Shopify stores, creative production and the systems behind ecommerce growth. Choose a focused service or bring the pieces together with one team in India and the UAE." />
    <div className="shell"><nav className="service-links" aria-label="Explore our services">{services.map(s => <Link key={s.id} href={`#${s.id}`}>{s.name}</Link>)}</nav>
    {services.map((service,i) => <section key={service.id} id={service.id} className="service-row"><div><span className="eyebrow">0{i+1} / Our services</span><h2>{service.name}</h2><p>{service.description}</p><ul className="included-list">{service.included.map(item => <li key={item}>{item}</li>)}</ul><MorphButton href={CAL_LINK} label="Talk about your project" external /><RelatedProjects service={service.id} /></div><div className="service-visual"><Image src={images[service.id] || service.image} alt={`${service.name} for ecommerce brands by Cascon`} fill sizes="(max-width: 640px) 92vw, 48vw" /></div></section>)}
    <section id="collaboration-models" className="editorial-row"><div><span className="eyebrow">How we work together</span><h2>The right fit.<br />From the start.</h2></div><ul><li><h3>A defined project.</h3><p>A clear brief, scope, quote and milestones. A good fit for a store launch, redesign, migration or creative campaign.</p></li><li><h3>An ongoing collaboration.</h3><p>A shared plan for recurring improvements, creative production or marketing support, with priorities reviewed together.</p></li></ul></section></div>
    <Faq />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: services.map((s,i) => ({ '@type': 'ListItem', position: i+1, item: { '@type': 'Service', name: s.name, description: s.description, url: `${SITE_URL}/services#${s.id}`, provider: { '@id': `${SITE_URL}/#organization` }, areaServed: ['India','United Arab Emirates'] } })) }} />
  </div>;
}
