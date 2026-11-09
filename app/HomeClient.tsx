import Image from 'next/image';
import Link from 'next/link';
import ClientLogoGrid from '@/components/ClientLogoGrid';
import Toolkit from '@/components/Toolkit';
import Icon from '@/components/Icon';
import { services } from '@/data/services';
import { allWorkCards } from '@/data/work';
import { CONTACT_EMAIL } from '@/lib/constants';
import CaseCard from '@/components/CaseCard';
import MorphButton from '@/components/MorphButton';
import ScrollReveal from '@/components/ScrollReveal';
import HeroMedia from '@/components/HeroMedia';
import Faq from '@/components/Faq';

const allWork = allWorkCards;
const featured = ['Finewares', 'Slept Club', 'Lumy Dates', 'Citysky Builders', 'Bagus', 'Vibezon'].map(name => allWork.find(work => work.name === name)!);

export default function Home() {
  return <>
    <section className="home-hero" aria-labelledby="home-title">
      <HeroMedia /><div className="hero-shade" />
      <div className="hero-copy"><h1 id="home-title">Cascon is a Shopify agency working across design, AI media, marketing and ecommerce growth.</h1><div className="hero-locations"><Link href="/contact#bangalore"><Icon name="pin" /> Bangalore</Link><Link href="/contact#dubai"><Icon name="pin" /> Dubai</Link><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div></div>
    </section>
    <div className="home-gradient">
      <section className="home-statement shell"><ScrollReveal><h2>We’re building a <strong>benchmark agency</strong> to help ambitious brands look better. And sell more.</h2><MorphButton href="/about" label="About us" /></ScrollReveal></section>
      <section className="home-work shell" aria-label="Selected Shopify and creative projects"><div className="case-grid">{featured.map(work => <ScrollReveal key={work.name}><CaseCard {...work} /></ScrollReveal>)}</div><div className="center-action"><MorphButton href="/work" label="More work" /></div></section>
      <section className="home-clients shell" aria-labelledby="clients-title"><ScrollReveal><h2 id="clients-title">We work with <strong>ambitious brands</strong><br />in India, the UAE and beyond.</h2></ScrollReveal><ClientLogoGrid /><Toolkit /><div className="center-action"><MorphButton href="/clients" label="Our clients" /></div></section>
    </div>
    <section className="feature-section shell" aria-labelledby="feature-title"><ScrollReveal><div className="feature-panel"><div className="feature-image"><Image src="/images/work/bagus.jpg" alt="Bagus home decor Shopify project by Cascon" fill sizes="(max-width: 640px) 84vw, 42vw" /></div><div className="feature-copy"><span className="eyebrow">In focus / Bagus</span><h2 id="feature-title">A thoughtfully made store.<br />For thoughtfully made things.</h2><p>Shopify development, AI product photography and search foundations for an artisan home decor brand.</p><a href="https://www.bagus.in/" target="_blank" rel="noopener noreferrer" className="pill-button" data-project="Bagus">Explore the store <span aria-hidden="true">↗</span></a></div></div></ScrollReveal></section>
    <section className="home-services shell section-space"><ScrollReveal><h2>We build stores, content<br />and the connections<br />that help brands grow.</h2><p>Great ecommerce brings the whole picture together. From the first impression to the next order, we connect strategy, Shopify development and creative production.</p></ScrollReveal><ScrollReveal><span className="eyebrow">Services</span><ul>{services.map(service => <li key={service.id}><Link href={`/services#${service.id}`} className="service-link"><span className="service-link__label"><span className="service-link__text">{service.name}</span><span className="service-link__measure" aria-hidden="true">{service.name}</span></span></Link></li>)}</ul><MorphButton href="/services" label="All services" /></ScrollReveal></section>
    <section className="image-ribbon" aria-label="A closer look at our work">{featured.slice(0, 4).map((work, i) => <Link href="/work" key={work.name} className={`ribbon-image ribbon-${i}`}><Image src={work.image} alt={`${work.name} brand creative`} fill sizes="(max-width: 640px) 46vw, 25vw" /></Link>)}</section>
    <Faq />
  </>;
}
