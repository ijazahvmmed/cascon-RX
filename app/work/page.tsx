import { projectHref } from '@/lib/content';
import PageIntro from '@/components/PageIntro';
import WorkClient from './WorkClient';
import JsonLd from '@/components/JsonLd';
import { allWorkCards } from '@/data/work';
import { SITE_URL } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata('/work', 'Shopify Store, Website & AI Media Projects', 'Explore Shopify and website projects for Finewares, Slept Club, Lumy Dates, Citysky Builders, Bagus and more. See Cascon’s work across India and the UAE.');
export default function WorkPage() {
  return <div className="interior-gradient"><PageIntro label="Selected work" path="/work" title={<>Good work.<br />Made to work.</>} description="A selection of Shopify stores, brand websites, product imagery and creative projects. Different businesses, connected by thoughtful design and a practical approach to growth." /><WorkClient />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Cascon selected projects', itemListElement: allWorkCards.map((project,index) => ({ '@type': 'ListItem', position: index + 1, name: project.name, url: SITE_URL + projectHref(project.name) })) }} />
  </div>;
}
