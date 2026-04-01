import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Cascon — Shopify Agency & AI Media Studio',
  description:
    'Cascon is a Shopify agency and AI media studio built to help brands sell more and look better doing it.',
  openGraph: {
    title: 'Cascon — Shopify Agency & AI Media Studio',
    description:
      'Cascon is a Shopify agency and AI media studio built to help brands sell more and look better doing it.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cascon — Shopify Agency & AI Media Studio',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
