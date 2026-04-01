'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { services } from '@/data/services';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import { CAL_LINK } from '@/lib/constants';
import styles from './ServicesClient.module.css';

const partnerBadges = [
  { src: '/images/badges/shopifypartners.png', alt: 'Shopify Partners' },
  { src: '/images/badges/figma.png', alt: 'Figma' },
  { src: '/images/badges/higgsfield.png', alt: 'Higgsfield' },
  { src: '/images/badges/supermoney.png', alt: 'SuperMoney' },
];

const waysToWork = [
  {
    title: 'Project-based',
    description: 'Defined scope, clear deliverables, fixed price. Best for one-off builds, redesigns, and launches.',
  },
  {
    title: 'Retainer',
    description: 'Ongoing hours each month across development, content, and marketing. Best for brands that need consistent support.',
  },
  {
    title: 'Revenue share',
    description: 'We invest our time in exchange for a share of revenue. Best for early-stage brands with strong products and low budgets.',
  },
];

export default function ServicesClient() {
  const [activeSection, setActiveSection] = useState(services[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    services.forEach((svc) => {
      const el = sectionRefs.current[svc.id];
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(svc.id);
          }
        },
        { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
    <InteriorHeroBg variant="teal">
      {/* Hero */}
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>We made brands and grow brands.</h1>
        <p className={styles.heroSubline}>
          Selected projects across Shopify, AI media, performance marketing, and more.
        </p>
      </div>

      {/* Services content */}
      <div className={styles.servicesContent}>
        <div className={styles.servicesLayout}>
          {/* Sticky sidebar */}
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              {services.map((svc) => (
                <a
                  key={svc.id}
                  href={`#${svc.id}`}
                  className={`${styles.sidebarLink} ${activeSection === svc.id ? styles.sidebarActive : ''}`}
                >
                  {svc.name}
                </a>
              ))}
            </nav>
            <div className={styles.sidebarBadges}>
              {partnerBadges.map((badge) => (
                <Image
                  key={badge.alt}
                  src={badge.src}
                  alt={badge.alt}
                  width={80}
                  height={28}
                  className={styles.sidebarBadge}
                />
              ))}
            </div>
          </aside>

          {/* Scrollable blocks */}
          <div className={styles.serviceBlocks}>
            {services.map((svc) => (
              <section
                key={svc.id}
                id={svc.id}
                ref={(el) => { sectionRefs.current[svc.id] = el; }}
                className={styles.serviceBlock}
              >
                <ScrollReveal>
                  <div className={styles.serviceImageWrap}>
                    {svc.image.includes('vimeo.com') ? (
                      <iframe
                        src={svc.image}
                        className={styles.serviceImage}
                        style={{ border: 'none', width: '100%', height: '100%', objectFit: 'cover' }}
                        allow="autoplay; fullscreen"
                        loading="lazy"
                        title={svc.name}
                      />
                    ) : svc.image.endsWith('.mp4') ? (
                      <video
                        src={svc.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={styles.serviceImage}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Image
                        src={svc.image}
                        alt={svc.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className={styles.serviceImage}
                        priority={svc.id === services[0].id}
                      />
                    )}
                  </div>
                  <h2 className={styles.serviceTitle}>{svc.name}</h2>
                  <p className={styles.serviceDesc}>{svc.description}</p>
                  <div className={styles.includedSection}>
                    <h3 className={styles.includedTitle}>WHAT&apos;S INCLUDED</h3>
                    <div className={styles.includedGrid}>
                      {svc.included.map((item) => (
                        <div key={item} className={styles.includedItem}>
                          <span className={styles.bullet}>•</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Ways to work */}
      <section className={styles.waysSection} id="collaboration-models">
        <div className={styles.waysInner}>
          <ScrollReveal>
            <h2 className={styles.waysTitle}>
              You can work with Cascon in three different ways.
            </h2>
          </ScrollReveal>
          <div className={styles.waysGrid}>
            {waysToWork.map((way) => (
              <ScrollReveal key={way.title}>
                <div className={styles.wayCard}>
                  <h3 className={styles.wayCardTitle}>{way.title}</h3>
                  <p className={styles.wayCardDesc}>{way.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className={styles.collabCta}>
        <div className={styles.collabInner}>
          <div className={styles.collabCard}>
            <ScrollReveal>
              <div className={styles.collabCardContent}>
                <div className={styles.collabCardLeft}>
                  <h2 className={styles.collabCardTitle}>Built in-house to sell in-house.</h2>
                  <MorphButton href={CAL_LINK} label="Hire us" external variant="light" />
                </div>
                <div className={styles.collabCardRight}>
                  <p className={styles.collabCardDesc}>
                    We&apos;re currently taking on new projects for May 2026. Schedule a call to lock in your slot.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className={styles.collabLogoGrid}>
             {partnerBadges.map((badge) => (
               <Image key={badge.alt} src={badge.src} alt={badge.alt} width={120} height={40} className={styles.collabLogo} />
             ))}
          </div>
        </div>
      </section>
    </InteriorHeroBg>
    </>
  );
}
