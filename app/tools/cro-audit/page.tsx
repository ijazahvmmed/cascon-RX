import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/constants';
import { breadcrumbSchema, pageMetadata, webPageSchema } from '@/lib/seo';
import Scanner from './scanner';

const path = '/tools/cro-audit';
const title = 'Free Ecommerce CRO Audit';
const description = 'Get a free shopping score for your online store. See how it handles product details, pricing, delivery and returns, plus up to three changes to consider.';
export const metadata = pageMetadata(path, title, description);

export default function CroAuditPage() {
  const software = {
    '@type': 'WebApplication', '@id': SITE_URL + path + '#app', name: title, url: SITE_URL + path,
    applicationCategory: 'BusinessApplication', operatingSystem: 'Any', isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': SITE_URL + '/#organization' },
  };
  return <>
    <JsonLd data={webPageSchema(path, title, description, software)} />
    <JsonLd data={breadcrumbSchema(title, path)} />
    <Scanner />
  </>;
}
