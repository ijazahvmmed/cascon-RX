import Image from 'next/image';
import PageIntro from '@/components/PageIntro';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/about', 'About our Shopify & Creative Agency', 'Meet Cascon, a Shopify agency and AI media studio in Bangalore and Dubai. We bring store development, creative production and ecommerce marketing together.');
const values = [
  ['Treat it like our own.', 'We take responsibility for the details, from a mobile product page to the final campaign asset. Clear briefs and careful reviews keep the work moving.'],
  ['Make the useful beautiful.', 'Good design should help people understand your products and find their next step. We bring the brand and the buying journey together.'],
  ['Think across the whole journey.', 'Strategy, design, development and content work better together. We connect the work so your team has fewer handoffs to manage.'],
  ['Stay curious. Keep improving.', 'We use new tools where they solve a real problem, then measure and refine the work against the goals we agreed with you.'],
];
export default function AboutPage() {
  return <div className="interior-gradient">
    <PageIntro label="About us" path="/about" title={<>Built for brands<br />with somewhere to go.</>} description="Cascon brings Shopify development and creative production together. From Bangalore and Dubai, we work with ecommerce teams that want a considered store, distinctive content and a clear plan for growth." />
    <div className="shell"><div className="wide-image"><Image src="/images/work/bagus.jpg" alt="Bagus Shopify and creative project by Cascon" fill sizes="92vw" priority /></div>
    <section className="editorial-row"><span className="eyebrow">A connected approach</span><div><h2>One team.<br />The bigger picture.</h2><p style={{ marginTop: 30 }}>A store is one part of your brand’s experience. Product imagery, useful information, acquisition and everyday operations all shape what happens before and after a customer buys.</p><p>We work across Shopify development, conversion rate optimization, AI media, paid marketing, SEO, AEO and automation. You can bring us in for a focused project or connect several services around a shared brief.</p><MorphButton href="/services" label="What we do" /></div></section>
    <section className="editorial-row"><div><span className="eyebrow">Our way of working</span><h2>A little care<br />goes a long way.</h2></div><div>{values.map(([title, description]) => <ScrollReveal key={title}><div className="value-item"><h3>{title}</h3><p>{description}</p></div></ScrollReveal>)}</div></section>
    <section className="editorial-row"><span className="eyebrow">Bangalore · Dubai</span><div><h2>Close to your team.<br />Wherever you are.</h2><p style={{ marginTop: 30 }}>Our locations in India and the UAE connect us with brands across markets. We agree on milestones, communication and responsibilities at the start, so you always know where the project stands.</p><MorphButton href="/contact" label="Let’s talk" /></div></section></div>
  </div>;
}
