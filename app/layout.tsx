import { INDEXABLE } from '@/lib/indexing';
import type { Metadata } from 'next';
import Script from 'next/script';
import localFont from 'next/font/local';
import EnquiryAnalytics from '@/components/EnquiryAnalytics';
import MotionDirector from '@/components/MotionDirector';
import ContactPanel from '@/components/ContactPanel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MetaPixel from '@/components/MetaPixel';
import SmoothScroll from '@/components/SmoothScroll';
import JsonLd from '@/components/JsonLd';
import { organizationSchema } from '@/lib/seo';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, PLAUSIBLE_DOMAIN } from '@/lib/constants';
import 'lenis/dist/lenis.css';
import './globals.css';
import './navigation.css';
import './motion.css';
import './faq.css';
import './refinements.css';
import './content.css';
import './showcase.css';
import './assistant.css';

const geist = localFont({ src: './fonts/GeistVF.woff', variable: '--font-geist', weight: '100 900', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Shopify Agency in India & AI Media Studio | Cascon', template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: 'website', siteName: SITE_NAME, title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL, images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION, images: ['/opengraph-image'] },
  robots: { index: INDEXABLE, follow: INDEXABLE, googleBot: { index: INDEXABLE, follow: INDEXABLE, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION, other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : {} },
  icons: { icon: '/favicon.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-IN" className={geist.variable}><body>
    <a href="#main-content" className="skipLink">Skip to main content</a>
    <Navbar /><main id="main-content" tabIndex={-1}>{children}</main><Footer />
    <ContactPanel /><SmoothScroll /><MotionDirector /><MetaPixel isProduction={INDEXABLE} /><EnquiryAnalytics enabled={INDEXABLE} />
    <JsonLd data={organizationSchema} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL, publisher: { '@id': `${SITE_URL}/#organization` }, inLanguage: 'en-IN' }} />
    {INDEXABLE && <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="lazyOnload" />}
  </body></html>;
}
