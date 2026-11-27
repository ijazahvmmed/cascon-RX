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
        <p>We look for a delivery time or a free-delivery statement with the item. For returns, we look for a return period or a statement that returns are unavailable. A policy link alone earns no credit for those answers.</p>
      </section>
      <section><h2>How to read the result</h2>
        <p>Each confirmed answer counts once. An unfinished price or description is marked for attention. If a page will not open or we cannot recognize the answer, it stays on the list to check. Once all seven answers are known, we show how many passed.</p>
        <p>The other store checks cover smaller details, such as whether a cart link has a name. Those details do not earn extra points on the shopping checklist. Optional discounts, gifts and special offers are always your choice.</p>
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
        <p>You can read and save the summary without giving us an email address. If you choose a consultation, we pass your store address and a short summary to the booking page.</p>
        <Link className={styles.back} href="/tools/cro-audit">Run a free scan</Link>
      </section>
    </article>
    <JsonLd data={webPageSchema(path, title, description)} />
    <JsonLd data={breadcrumbSchema(title,path)} />
  </div>;
}
