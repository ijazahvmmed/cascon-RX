import Link from 'next/link';
import { notFound } from 'next/navigation';
import { insights } from '@/data/insights';
import { commercialServices } from '@/data/commercial-services';
import ContentIntro from '@/components/ContentIntro';
import ContentCta from '@/components/ContentCta';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
export function generateStaticParams() { return insights.map(a=>({slug:a.slug})); }
async function getInsight(params:Promise<{slug:string}>) { const {slug}=await params;const item=insights.find(a=>a.slug===slug);if(!item)notFound();return item; }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const a=await getInsight(params);return {...pageMetadata('/insights/'+a.slug,a.title,a.description),openGraph:{type:'article' as const,title:a.title,description:a.description,url:SITE_URL+'/insights/'+a.slug,images:[{url:'/opengraph-image',width:1200,height:630}]}}; }
export default async function InsightPage({params}:{params:Promise<{slug:string}>}) {
 const a=await getInsight(params),path='/insights/'+a.slug;
 return <div className="interior-gradient"><ContentIntro title={a.title} description={a.summary} label="Practical guide / Cascon" crumbs={[{name:'Insights',path:'/insights'},{name:a.title,path}]} /><div className="shell content-body"><article className="reading-layout"><aside className="article-navigation"><span className="eyebrow">In this guide</span><nav aria-label="Article contents">{a.sections.map(s=><Link href={'#'+s.id} key={s.id}>{s.title}</Link>)}</nav></aside><div className="reading-copy"><p className="article-reader">{a.reader}</p><p className="article-date">Updated <time dateTime="2026-11-10">10 November 2026</time></p>{a.sections.map(s=><section key={s.id} id={s.id}><h2>{s.title}</h2>{s.paragraphs.map(p=><p key={p}>{p}</p>)}{s.checks&&<dl className="guide-checks">{s.checks.map(([name,body])=><div key={name}><dt>{name}</dt><dd>{body}</dd></div>)}</dl>}</section>)}<aside className="source-notes" aria-label="Sources"><h2>References & further reading.</h2>{a.sources.map(([name,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</aside></div></article><section className="content-section related-content"><div><h2>Put the plan to work.</h2>{a.relatedServices.map(slug=><Link href={'/services/'+slug} key={slug}>{commercialServices.find(s=>s.slug===slug)!.name} →</Link>)}</div><div><h2>More practical guidance.</h2>{insights.filter(v=>v.slug!==a.slug).map(v=><Link href={'/insights/'+v.slug} key={v.slug}>{v.title} →</Link>)}</div></section><ContentCta /></div><JsonLd data={webPageSchema(path,a.title,a.description,{'@id':SITE_URL+path+'#article'})} /><JsonLd data={{'@context':'https://schema.org','@type':'Article','@id':SITE_URL+path+'#article',headline:a.title,description:a.description,url:SITE_URL+path,dateModified:'2026-11-10',author:{'@id':SITE_URL+'/#organization'},publisher:{'@id':SITE_URL+'/#organization'},mainEntityOfPage:{'@id':SITE_URL+path+'#webpage'}}} /></div>;
}
