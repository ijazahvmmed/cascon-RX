import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Shopify development, AI media, performance marketing, automation, and SEO. Most clients use a few of these together.',
  openGraph: {
    title: 'Services — Cascon',
    description: 'Shopify development, AI media, performance marketing, automation, and SEO.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
