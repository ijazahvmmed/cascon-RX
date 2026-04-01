import type { Metadata } from 'next';
import Image from 'next/image';
import ContentBlock from '@/components/ContentBlock';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import { CAL_LINK } from '@/lib/constants';
import styles from './clients.module.css';

export const metadata: Metadata = {
  title: 'Clients',
  description:
    'Who we work with. From established ecommerce brands to early-stage startups.',
  openGraph: {
    title: 'Clients — Cascon',
    description: 'Who we work with. From established ecommerce brands to early-stage startups.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clients — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/clients',
  },
};

export default function ClientsPage() {
  return (
    <InteriorHeroBg variant="peach">
      <div className={styles.inner}>
        <ScrollReveal>
          <h1 className={styles.title}>Who we work with</h1>
        </ScrollReveal>

        <ScrollReveal>
          <div className={styles.featureImage}>
            <Image
              src="/images/pages/clients.webp"
              alt="Cascon clients — brands we work with"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              className={styles.image}
            />
          </div>
        </ScrollReveal>

        <div className={styles.content}>
          <ScrollReveal>
            <ContentBlock title="Established brands" id="established-brands">
              <p>
                Brands with existing revenue, established products, and repeat customers. They come to us for store redesigns, performance optimization, AI media upgrades, and scaling campaigns. These are the projects where small improvements — 10% faster load time, better product imagery, tighter conversion funnels — compound into significant revenue gains.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="Growing brands" id="growing-brands">
              <p>
                Brands past initial validation, scaling from their first few hundred orders to consistent daily sales. They need everything built properly the first time: a clean Shopify store, product photography that sells, and a marketing foundation they can scale on. We help them go from manual operations to automated, repeatable growth.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="New brands" id="new-brands">
              <p>
                Founders launching their first product or entering a new market. They need speed, clarity, and a partner who won&apos;t overcomplicate things. We help them launch fast with a conversion-ready store, strong product content, and a clear plan for first sales. Usually project-based, sometimes revenue share.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <ContentBlock title="Industries we work in" id="industries">
              <p>
                We&apos;ve worked across fashion, wellness, home decor, automotive accessories, kids wear, HVAC, elevators, engineering, fiberglass manufacturing, and grocery — primarily D2C ecommerce brands and B2B companies scaling their digital presence.
              </p>
            </ContentBlock>
          </ScrollReveal>

          <ScrollReveal>
            <div className={styles.cta}>
              <MorphButton href={CAL_LINK} label="Book a call" external />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </InteriorHeroBg>
  );
}
