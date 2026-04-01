import type { Metadata } from 'next';
import WorkClient from './WorkClient';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects across Shopify, AI media, performance marketing, and more.',
  openGraph: {
    title: 'Work — Cascon',
    description: 'Selected projects across Shopify, AI media, performance marketing, and more.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/work',
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
