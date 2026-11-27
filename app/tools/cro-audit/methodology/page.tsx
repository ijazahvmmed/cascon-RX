import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMetadata, webPageSchema } from '@/lib/seo';
import { categories } from '@/lib/cro/model';
import type { Category } from '@/lib/cro/model';
import { principles } from '@/lib/cro/principles';
import styles from '../scanner.module.css';

const path = '/tools/cro-audit/methodology';
const title = 'Ecommerce CRO Audit Methodology';
const description = 'See how the Cascon CRO scanner samples stores, scores clear evidence and separates automated findings from expert review.';
export const metadata = pageMetadata(path, title, description);

export default function MethodologyPage() {
  return <div className={styles.method}>
    <article className={styles.wrap}>
      <Link className={styles.back} href="/tools/cro-audit">← CRO scanner</Link>
      <h1>How the CRO scanner works</h1>
      <p className={styles.intro}>A rule-based review of public storefront HTML, with a clear boundary around what the evidence can establish.</p>
      <section>
        <h2>Pages sampled</h2>
        <p>The scanner reads the store entry page and samples one verified same-origin collection and one verified product when discoverable. The submitted URL is reduced to its origin. For larger pages the scanner reads a bounded HTML prefix and withholds findings that depend on missing content. Unavailable or ambiguous pages are reported separately. Only public page requests are made. The scanner spaces page requests and stops on access restrictions or rate limits. It does not load embedded assets or execute scripts, and never opens a cart or checkout or submits an order.</p>
      </section>
      <section>
        <h2>Evidence and scoring</h2>
        <p>Each rule can pass, fail, remain unknown or be outside the observed page’s scope. Weighted passes are divided by weighted assessed checks. High, medium and low priority checks weigh 3, 2 and 1. Unknown checks affect evidence coverage only. Optional offers do not affect the score by being absent.</p>
        <p>A category score requires at least two assessed checks and at least 60% of its applicable evidence weight. The overall score also requires a verified product page, at least 18 assessed checks and six scored categories. The report shows assessed and applicable counts alongside the result. Score thresholds describe evidence coverage and do not predict revenue, usability or performance.</p>
        <p>Recommendations are limited to three confirmed observations from distinct categories. Higher business priority weighs first, then confidence and implementation effort. Moderate confidence marks a static observation that merits checking in the rendered page.</p>
      </section>
      <section>
        <h2>Expert assessment</h2>
        <p>Visual hierarchy, real device behavior, checkout interaction, competitor comparison, a detailed roadmap and experiment design need an expert assessment. These are matters to investigate during a consultation.</p>
      </section>
      <section>
        <h2>120 principles</h2>
        <p>48 rules use public HTML when evidence supports a result. The other 72 are contextual consultation prompts. The same catalogue and applicability rules apply to every store.</p>
        <div className={styles.catalogue}>
          {(Object.keys(categories) as Category[]).map(category => <details key={category}>
            <summary>{categories[category]}</summary>
            <dl>{principles.filter(p => p.category === category).map(p => <div key={p.id}>
              <dt>{p.title} <span>{p.mode === 'automated' ? 'HTML rule' : 'Expert review'}</span></dt>
              <dd>{p.why} {p.change} <small>Effort {p.effort.toLowerCase()}</small></dd>
            </div>)}</dl>
          </details>)}
        </div>
      </section>
      <section>
        <h2>Privacy and availability</h2>
        <p>Reports remain in the current browser tab. A short-lived edge cache can reuse report summaries. Site analytics follow your consent settings and omit submitted addresses. Choosing a consultation passes your store address and a short summary to Cal.com. The PDF saves the same free summary shown on screen.</p>
        <p>Scan capacity is limited. Stores that require scripts or block automated access may return partial evidence or be unavailable. The scanner makes no claim about how often it works across all stores.</p>
        <Link className={styles.back} href="/tools/cro-audit">Run a free scan →</Link>
      </section>
    </article>
    <JsonLd data={webPageSchema(path, title, description)} />
    <JsonLd data={breadcrumbSchema(title,path)} />
  </div>;
}
