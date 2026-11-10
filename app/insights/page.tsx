import Link from 'next/link';
import { insights } from '@/data/insights';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
export const metadata = pageMetadata('/insights','Practical Shopify & Ecommerce Guides','Useful guides for ecommerce founders evaluating Shopify CRO, redesigns and platform migrations. Read Cascon’s practical planning frameworks.');
export default function InsightsPage() {
 return <div className="interior-gradient"><ContentIntro title="Useful before the next step." description="Practical frameworks for ecommerce founders and the teams running their stores. Clearer questions, better briefs and a considered path to implementation." label="Insights" crumbs={[{name:'Insights',path:'/insights'}]} /><div className="shell content-body"><div className="insight-list">{insights.map(a=><article key={a.slug}><span className="eyebrow">Practical guide</span><h2><Link href={'/insights/'+a.slug}>{a.title} →</Link></h2><p>{a.summary}</p></article>)}</div><ContentCta /></div><JsonLd data={{ ...webPageSchema('/insights','Cascon insights','Practical Shopify and ecommerce planning guides.'),'@type':'CollectionPage',mainEntity:{ '@type':'ItemList',itemListElement:insights.map((a,i)=>({ '@type':'ListItem',position:i+1,name:a.title,url:SITE_URL+'/insights/'+a.slug })) } }} /></div>;
}
