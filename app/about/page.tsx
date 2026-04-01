import type { Metadata } from 'next';
import Image from 'next/image';
import ContentBlock from '@/components/ContentBlock';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import { CAL_LINK } from '@/lib/constants';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Cascon is a Shopify agency and AI media studio built to help brands sell more and look better doing it.',
  openGraph: {
    title: 'About — Cascon',
    description:
      'Cascon is a Shopify agency and AI media studio built to help brands sell more and look better doing it.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/about',
  },
};

export default function AboutPage() {
  return (
    <InteriorHeroBg variant="lilac">
      <div className={styles.inner}>
        <ScrollReveal>
          <h1 className={styles.title}>About Cascon</h1>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.featureImage}>
            <Image
              src="/images/pages/about.webp"
              alt="About Cascon — team and workspace"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
              className={styles.image}
            />
          </div>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal>
            <div className={styles.introText}>
              <p>
                Cascon started because we kept seeing the same gap — ecommerce brands with great products but stores that didn&apos;t convert, and content that didn&apos;t look the part. We built a two-pillar agency to fix both: Shopify development engineered for revenue, and AI media production that looks better than traditional shoots. Based in Coventry and Kochi, we work with brands across India, UK, UAE, and beyond.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="What we believe">
              <p>
                We believe that great ecommerce is a combination of engineering and aesthetics. A fast, well-structured store that looks mediocre won&apos;t sell. Beautiful content on a broken checkout won&apos;t convert. Both need to work together, and that&apos;s what we build.
              </p>
              <p>
                We also believe in shipping fast, iterating often, and being honest about what works. We don&apos;t pad timelines or oversell deliverables. If something isn&apos;t working, we say so and fix it.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="How we work">
              <p>
                We keep teams small and projects focused. Most engagements start with a conversation — we understand your product, your market, and your goals before proposing anything. Then we execute quickly, usually in 2-4 week cycles.
              </p>
              <p>
                Our structure is lean: a core team handles strategy, design, and development. We bring in specialists from our Cascon &amp; Co. network when needed. No layers, no handoffs, no delays.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="Where we're going">
              <p>
                We&apos;re building Cascon to be the default agency for ecommerce brands that need both a high-performing store and high-quality content. Not the biggest. Not the cheapest. The one that actually delivers.
              </p>
              <p>
                That means staying focused on Shopify and AI media, getting better at both every month, and working with brands we genuinely want to help grow.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.cta}>
              <MorphButton href={CAL_LINK} label="Get in touch" external />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </InteriorHeroBg>
  );
}
