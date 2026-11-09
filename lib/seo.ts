import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, SOCIAL } from './constants';

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: `${title} | ${SITE_NAME}` }, description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: { type: 'website', siteName: SITE_NAME, title, description, url: `${SITE_URL}${path}`, images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  };
}

export const organizationSchema = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/cascon-black.png`, email: CONTACT_EMAIL,
  description: 'Shopify development, conversion rate optimization, AI media production, performance marketing, automation, SEO and AEO for ecommerce brands in India and the UAE.',
  sameAs: [SOCIAL.instagram], areaServed: ['India', 'United Arab Emirates'],
  address: [
    { '@type': 'PostalAddress', streetAddress: 'No. 33, 4th Floor, 1st Main, Ganganagar Gramatana, HMT Layout, CBI Road', addressLocality: 'Bangalore', postalCode: '560032', addressCountry: 'IN' },
    { '@type': 'PostalAddress', streetAddress: 'Office #2220, 22nd Floor, Tower Plaza, Sheikh Zayed Road', addressLocality: 'Dubai', addressCountry: 'AE' },
  ],
  contactPoint: [{ '@type': 'ContactPoint', telephone: '+91-82816-63376', contactType: 'sales', areaServed: 'IN', availableLanguage: 'English' }],
};

export function breadcrumbSchema(name: string, path: string) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
  ] };
}
