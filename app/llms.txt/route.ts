import { SITE_URL, CONTACT_EMAIL } from '@/lib/constants';
import { services } from '@/data/services';
import { allWorkCards } from '@/data/work';
export const dynamic = 'force-static';
export function GET() {
  const text = `# Cascon

> Cascon is a Shopify agency and AI media studio with teams in Bangalore, India and Dubai, United Arab Emirates. We work with ecommerce brands on Shopify development, conversion rate optimization, AI product imagery, marketing, automation and search discoverability.

Cascon provides services to ecommerce stores. Cascon is not a retail Shopify store.
Canonical website: ${SITE_URL}
Business email: ${CONTACT_EMAIL}
India phone: +91 82816 63376
UAE phone: +971 54 747 5998

## Primary pages
- [Home](${SITE_URL}/): Agency overview and selected projects.
- [Services](${SITE_URL}/services): Scope and deliverables for each service, collaboration models and FAQs.
- [Work](${SITE_URL}/work): Shopify, website and creative projects for ${allWorkCards.map(project => project.name).join(', ')}.
- [Clients](${SITE_URL}/clients): Examples of established, growing and new brands.
- [About](${SITE_URL}/about): Approach, capabilities and locations.
- [Contact](${SITE_URL}/contact): Business email, introductory call and office details.
- [Cascon & Co.](${SITE_URL}/cascon): Specialist project collaboration.

## Services
${services.map(s => `- [${s.name}](${SITE_URL}/services#${s.id}): ${s.description}`).join('\n')}

## Locations
- Bangalore: No. 33, 4th Floor, 1st Main, Ganganagar Gramatana, HMT Layout, CBI Road, Bangalore 560032, India.
- Dubai: Office #2220, 22nd Floor, Tower Plaza, Sheikh Zayed Road, Dubai, United Arab Emirates.

## Project enquiries
Pricing and delivery dates depend on the agreed scope. Contact Cascon for a quote. The site does not publish independently verified performance figures or guaranteed search rankings.

## Additional information
- [Full text overview](${SITE_URL}/llms-full.txt): Services and frequently asked questions in plain text.
- [Privacy policy](${SITE_URL}/privacy-policy)
- [Sitemap](${SITE_URL}/sitemap.xml)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
