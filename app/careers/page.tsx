import type { Metadata } from 'next';
import Image from 'next/image';
import ContentBlock from '@/components/ContentBlock';
import ScrollReveal from '@/components/ScrollReveal';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import styles from './careers.module.css';

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Join Cascon. We are looking for independent execution-focused minds.',
  openGraph: {
    title: 'Careers — Cascon',
    description: 'Join Cascon. We are looking for independent execution-focused minds.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/careers',
  },
};

export default function CareersPage() {
  return (
    <InteriorHeroBg variant="mint">
      <div className={styles.inner}>
        <ScrollReveal>
          <h1 className={styles.title}>Working at Cascon</h1>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.featureImage}>
            <Image
              src="/images/pages/careers.webp"
              alt="Careers at Cascon"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              className={styles.image}
            />
          </div>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal>
            <ContentBlock title="What the work looks like">
              <p>
                Fast-paced, execution-heavy, and collaborative. We don&apos;t do standups for the sake of standups. We ship work, review it together, and move on to the next thing. Most communication happens async, most decisions happen fast.
              </p>
              <p>
                You&apos;ll work across real client projects from day one — Shopify builds, AI media production, marketing campaigns, and internal tooling. The variety is high and the learning curve is steep, but that&apos;s the point.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="What we expect">
              <p>
                Independence. You don&apos;t wait to be told what to do — you figure it out, do it, and ask for feedback after. We trust people to manage their own time and output.
              </p>
              <p>
                Clean work. Whether it&apos;s code, copy, or creative — the standard is high. We&apos;d rather ship one thing well than five things half-done.
              </p>
              <p>
                Honest communication. If something&apos;s broken, say so. If you&apos;re stuck, ask. If you disagree, explain why. No politics, no games.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="Who tends to do well here">
              <p>
                People who are naturally curious, move fast, care about quality, and don&apos;t need constant supervision. People who&apos;d rather build something real than sit in meetings talking about building something.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.openRole}>
              <h2 className={styles.roleTitle}>Open role: Growth Operator</h2>
              <p className={styles.roleDesc}>
                We&apos;re looking for someone who can manage client accounts, run marketing campaigns, coordinate with freelancers, and keep projects moving. You need to be organized, fast, and comfortable making decisions.
              </p>
              <a href="mailto:hello@wecascon.com" className={styles.roleLink}>
                Apply → hello@wecascon.com
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </InteriorHeroBg>
  );
}
