import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './clients.module.css';

export const metadata: Metadata = {
  title: 'Clients',
  description:
    'We work with brands from launch to scale, to worldwide fame. From D2C innovators to global B2B mainstays.',
  openGraph: {
    title: 'Clients — Cascon',
    description: 'We work with brands from launch to scale, to worldwide fame.',
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

const SECTIONS = [
  {
    id: "established",
    title: "Established brands",
    className: styles.sectionEstablished,
    description: "Brands with existing revenue, established products, and repeat customers. They come to us for performance optimization, store redesigns, scaling campaigns. These are the projects where small improvements compound into significant revenue gains.",
    workLink: "/work",
    image: "/images/work/vibezon.jpg",
    overlayText: "VIBEZON",
    clientsText: "Some of our clients include",
    clients: [
      { name: "Vibezon", desc: "Clean, fast, and built to sell digital storefronts for modern men's fashion." },
      { name: "Car Supply", desc: "From store build to comprehensive SEO strategy ranking across competitive automotive niches." },
    ]
  },
  {
    id: "growing",
    title: "Growing brands",
    className: styles.sectionGrowing,
    description: "Brands past initial validation, scaling from their first hundred orders to consistent daily sales. They need everything built properly the first time: a clean Shopify store, product photography that sells, and a scalable marketing foundation.",
    workLink: "/work",
    image: "/images/work/rewise.jpg",
    overlayText: "REWISE",
    clientsText: "Some of our clients include",
    clients: [
      { name: "Rewise", desc: "AI product photography that elevates wellness brand aesthetics, delivered in days." },
      { name: "Bagus", desc: "Aesthetic excellence and visual identity upgrades designed to capture higher market shares." },
    ]
  },
  {
    id: "new",
    title: "New brands",
    className: styles.sectionNew,
    description: "Founders launching their first product or entering a new market. They need speed, clarity, and a partner who won't overcomplicate things. We help them launch fast with a conversion-ready store and a clear plan.",
    workLink: "/work",
    image: "/images/work/hanbee.jpg",
    overlayText: "HANBEE",
    clientsText: "Some of our clients include",
    clients: [
      { name: "Hanbee", desc: "Helping ambitious founders establish a conversion-ready store and scale effectively." },
      { name: "Reborn", desc: "Performance-focused website optimizations driving repeat customer purchases." },
    ]
  }
];

export default function ClientsPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.bgContainer}>
        <div className={`${styles.blob} ${styles.blobTop}`} />
        <div className={`${styles.blob} ${styles.blobMiddle}`} />
        <div className={`${styles.blob} ${styles.blobBottom}`} />
      </div>

      <header className={styles.hero}>
        <ScrollReveal>
          <div className={styles.heroContent}>
            <h1>We work with brands{'\n'}from launch, scale{'\n'}to worldwide fame.</h1>
            <p>From D2C innovators to global B2B mainstays, the brands we partner with span diverse industries. We adapt to specific needs, ensuring each brand&apos;s distinct voice and objectives are amplified through strategic and aesthetic excellence to elevate their market presence.</p>
          </div>
        </ScrollReveal>
      </header>

      {SECTIONS.map((section, index) => (
        <section key={section.id} className={`${styles.section} ${section.className}`}>
          <div className={styles.sectionInner}>
            <div className={styles.leftCol}>
              <ScrollReveal>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionDescription}>{section.description}</p>
                <Link href={section.workLink} className={styles.workLink}>
                  work <span aria-hidden="true">→</span>
                </Link>
              </ScrollReveal>
            </div>
            
            <div className={styles.rightCol}>
              <ScrollReveal delay={0.1}>
                <div className={styles.featureImageWrapper}>
                  <Image
                    src={section.image}
                    alt={`${section.overlayText} banner`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                    priority={index === 0}
                    className={styles.featureImage}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <h3 className={styles.clientsHeader}>{section.clientsText}</h3>
                <div className={styles.clientsGrid}>
                  {section.clients.map((client, i) => (
                    <div key={i} className={styles.clientCard}>
                      <div className={styles.clientLogo}>{client.name}</div>
                      <p className={styles.clientDesc}>{client.desc}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
