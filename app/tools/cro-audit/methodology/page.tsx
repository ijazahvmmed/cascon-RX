import Link from 'next/link';
import { categories, type Category } from '@/lib/cro/model';
import { principles } from '@/lib/cro/principles';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMetadata, webPageSchema } from '@/lib/seo';
import styles from '../scanner.module.css';

const path = '/tools/cro-audit/methodology';
const title = 'How the store checklist works';
const description = 'See what Cascon checks on your store and how to read your results.';
export const metadata = pageMetadata(path, title, description);

export default function MethodologyPage() {
  return <div className={styles.method}>
    <article className={styles.wrap}>
      <Link className={styles.back} href="/tools/cro-audit">CRO scanner</Link>
      <h1>How the store checklist works</h1>
      <p className={styles.intro}>Can a shopper find an item, understand the price and see how to buy it?</p>
      <section><h2>What we look for</h2>
        <p>We start on your homepage and follow store links to one product and one collection when we can. We check for a way to reach the product, its description, its price, an add-to-cart button, delivery terms, return terms and a way to contact the store.</p>
        <p>If an item page will not open, we can still confirm a visible item link and a selling price shown alongside it on the homepage. We check that both belong to the same item.</p>
        <p>We also look for a delivery time or charge, a return period or a no-returns statement. A stated fee and a free-delivery offer both answer the shipping question. Your report says where we found each answer. When these details are unclear, we also check linked delivery and return policies if the store allows the visit. The report links to the page behind each verified answer.</p>
      </section>
      <section><h2>How the score works</h2>
        <p>The seven questions share 100 points equally. We round the total to the nearest whole point. A confirmed answer earns its share. An unfinished price or description can count as a problem. If we cannot see the answer, its points stay open.</p>
        <p>For example, six confirmed answers earn 86 points. If the seventh answer is still open, the possible score is 86–100. If we find a problem with that answer, the finished score is 86 out of 100.</p>
        <p>The “By area” view shows individual details, such as whether a cart link has a name. These sit outside the seven-question score. Discounts, gifts and special offers are optional.</p>
      </section>
      <section><h2>What takes a closer look</h2>
        <p>Someone needs to try the store to judge how easy it feels on a phone or how checkout works. Understanding sales takes real customer and order information. The free scan never places an order.</p>
      </section>
      <details className={styles.trace}>
        <summary>Questions for a hands-on review</summary>
        <div className={styles.catalogue}>
          {(Object.keys(categories) as Category[]).map(category => <details key={category}>
            <summary>{categories[category]}</summary>
            <ul>{principles.filter(p => p.mode === 'expert' && p.category === category).map(p =>
              <li key={p.id}>{p.title}</li>)}</ul>
          </details>)}
        </div>
      </details>
      <section><h2>Your report</h2>
        <p>You can receive three free reports per day. Your allowance resets at midnight UTC. A store that declines a visit does not use one of your three reports. We reuse results for up to 24 hours.</p>
        <p>You can read and save the summary without giving us an email address. If you choose a consultation, we pass your store address and a short summary to the booking page.</p>
        <Link className={styles.back} href="/tools/cro-audit">Run a free scan</Link>
      </section>
    </article>
    <JsonLd data={webPageSchema(path, title, description)} />
    <JsonLd data={breadcrumbSchema(title,path)} />
  </div>;
}
