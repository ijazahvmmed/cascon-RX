import type { Metadata } from 'next';
import Image from 'next/image';
import ContentBlock from '@/components/ContentBlock';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import { CAL_LINK } from '@/lib/constants';
import styles from './cascon.module.css';

export const metadata: Metadata = {
  title: 'Cascon & Co.',
  description:
    'Cascon & Co. is our extended network of trusted freelancers and specialists.',
  openGraph: {
    title: 'Cascon & Co.',
    description: 'Cascon & Co. is our extended network of trusted freelancers and specialists.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cascon & Co.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/cascon',
  },
};

export default function CasconPage() {
  return (
    <InteriorHeroBg variant="dark">
      <div className={styles.inner}>
        <ScrollReveal>
          <h1 className={styles.title}>Cascon &amp; Co.</h1>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.featureImage}>
            <Image
              src="/images/pages/cascon.webp"
              alt="Cascon & Co. — our extended network"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              className={styles.image}
            />
          </div>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal>
            <ContentBlock title="For companies" id="companies">
              <p>
                Need specialist talent for a specific project? Cascon &amp; Co. is our curated network of freelancers and agencies we&apos;ve worked with and trust. We match you with the right people for the job — whether that&apos;s a Shopify developer, a 3D artist, a copywriter, or a performance marketer.
              </p>
              <p>
                You get the quality control and project management of working with Cascon, with access to a wider pool of talent. We handle coordination, quality checks, and delivery — you get results.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="For freelancers" id="freelancers">
              <p>
                We&apos;re always looking for talented freelancers to join our network. If you specialize in Shopify development, AI media production, performance marketing, SEO, content, or design — we want to hear from you.
              </p>
              <p>
                We don&apos;t micromanage. We send you briefs, you deliver great work, you get paid on time. Simple. Most of our freelance partners work with us on multiple projects over time.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="How it works">
              <p>
                For companies: tell us what you need, we recommend the right people, we manage the project. For freelancers: apply below, show us your work, and we&apos;ll reach out when we have a fit.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.cta}>
              <MorphButton href={CAL_LINK} label="Join our network" external />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </InteriorHeroBg>
  );
}
