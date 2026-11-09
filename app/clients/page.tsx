import PageIntro from '@/components/PageIntro';
import CaseCard from '@/components/CaseCard';
import MorphButton from '@/components/MorphButton';
import ClientLogoGrid from '@/components/ClientLogoGrid';
import { allWorkCards, newWorkCards } from '@/data/work';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/clients', 'Our Ecommerce & Website Clients', 'Meet Cascon’s clients in India and the UAE, including Finewares, Slept Club, Lumy Dates, Citysky Builders, Bagus, Rewise and Vibezon.');
const groups = [
  { id: 'established-brands', name: 'Established brands.', desc: 'A fresh perspective on what comes next. We help teams review an existing store, refine product journeys and connect creative production with their marketing plans.', names: ['Vibezon', 'Car Supply'] },
  { id: 'growing-brands', name: 'Growing brands.', desc: 'Make the next step a considered one. From a store redesign to consistent product imagery, we help ecommerce teams build on what is already working.', names: ['Bagus', 'Rewise'] },
  { id: 'new-brands', name: 'New brands.', desc: 'Start with a clear direction. We bring together Shopify setup, product presentation and the essentials a new brand needs before opening its store.', names: ['Hanbee', 'Reborn Co'] },
];
export default function ClientsPage() {
  return <div className="interior-gradient">
    <PageIntro label="Our clients" path="/clients" title={<>From a first idea.<br />To what comes next.</>} description="We work with ecommerce brands and businesses at different stages of their journey. Meet some of the teams we have partnered with on stores, websites, creative production and growth projects." />
    <section className="shell clients-logo-section" aria-label="Our client brands"><ClientLogoGrid /></section>
    <div className="shell">
      <section className="recent-clients"><div><span className="eyebrow">Recent collaborations</span><h2>Different worlds.<br />A shared ambition.</h2></div><div className="case-grid">{newWorkCards.map(work => <CaseCard key={work.name} {...work} />)}</div></section>
      {groups.map(group => <section key={group.id} id={group.id} className="client-group"><div><span className="eyebrow">Our collaborations</span><h2>{group.name}</h2><p>{group.desc}</p><MorphButton href="/work" label="Explore our work" /></div><div className="case-grid">{group.names.map(name => <CaseCard key={name} {...allWorkCards.find(work => work.name === name)!} />)}</div></section>)}
    </div>
  </div>;
}
