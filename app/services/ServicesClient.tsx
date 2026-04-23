'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { services } from '@/data/services';
import { clients } from '@/data/clients';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import { CAL_LINK } from '@/lib/constants';
import styles from './ServicesClient.module.css';

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
    const visibleSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
            changed = true;
          } else {
            visibleSections.delete(entry.target.id);
            changed = true;
          }
        });

        if (changed) {
          const activeId = services.find((svc) => visibleSections.has(svc.id))?.id;
          if (activeId) {
            setActiveSection(activeId);
          }
        }
      },
      { rootMargin: '-20% 0px -40% 0px', threshold: 0 }
    );

    services.forEach((svc) => {
      const el = sectionRefs.current[svc.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={styles.lightSectionWrapper}>
        <div className={styles.bgContainer}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
        </div>

        {/* 1. HERO */}
        <section className={styles.heroSection}>
          <div className={styles.heroInner}>
            <ScrollReveal>
              <h1 className={styles.heroTitle}>We create, launch, <br/>and grow brands.</h1>
              <p className={styles.heroSubtitle}>
                Shopify development, AI media, performance marketing, automation, and SEO. Most clients use a few of these together. We act as your growth engine.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 2. SERVICES LIST */}
        <section className={styles.servicesGridSection}>
          <div className={styles.servicesGridInner}>
            {/* Sticky Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarSticky}>
                <span className={styles.sidebarLabel}>ALL SERVICES</span>
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
              </div>
            </aside>

            {/* Scrollable Blocks */}
            <div className={styles.serviceBlocks}>
              {services.map((svc) => (
                <section
                  key={svc.id}
                  id={svc.id}
                  ref={(el) => { sectionRefs.current[svc.id] = el; }}
                  className={styles.serviceRow}
                >
                  <ScrollReveal>
                    <div className={styles.serviceRowInner}>
                      <div className={styles.serviceRowText}>
                        <h2 className={styles.serviceTitle}>{svc.name}</h2>
                        <p className={styles.serviceDesc}>{svc.description}</p>
                        
                        <div className={styles.serviceExpertise}>
                          <span className={styles.expertiseLabel}>EXPERTISE INCLUDES</span>
                          <div className={styles.expertiseGrid}>
                            {svc.included.map((item) => (
                              <div key={item} className={styles.expertiseItem}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
                                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className={styles.serviceRowMedia}>
                        {svc.image.endsWith('.mp4') ? (
                          <video
                            src={svc.image}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={styles.mediaFrame}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Image
                            src={svc.image}
                            alt={svc.name}
                            fill
                            sizes="(max-width: 960px) 100vw, 50vw"
                            className={styles.mediaFrame}
                          />
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                </section>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WAYS TO WORK */}
        <section className={styles.collaborationSection}>
          <div className={styles.collabInner}>
            <ScrollReveal>
              <span className={styles.collabLabel}>COLLABORATION MODELS</span>
              <h2 className={styles.collabTitle}>
                Typically, we work in three different ways with our clients:
              </h2>
            </ScrollReveal>

            <div className={styles.collabCards}>
              {waysToWork.map((way, idx) => (
                <ScrollReveal key={idx} delay={0.1 * idx}>
                  <div className={styles.collabCard}>
                    <h3 className={styles.collabCardTitle}>{way.title}</h3>
                    <p className={styles.collabCardDesc}>{way.description}</p>
                    
                    {/* Visual checkmark styling mimicking the screenshot */}
                    <ul className={styles.collabCardList}>
                      <li>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17L4 12"/></svg>
                        Dedicated strategy
                      </li>
                      <li>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17L4 12"/></svg>
                        Full team access
                      </li>
                      <li>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17L4 12"/></svg>
                        Transparent reporting
                      </li>
                      <li>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17L4 12"/></svg>
                        Slack channel
                      </li>
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. DARK PANEL CTA */}
        <section className={styles.darkPanelSection}>
          <div className={styles.darkPanelInner}>
            <ScrollReveal>
              <div className={styles.darkPanelBox}>
                <div className={styles.dpTextRow}>
                  <div className={styles.dpLeft}>
                    <h2 className={styles.dpTitle}>From in-house to full house</h2>
                    <MorphButton href={CAL_LINK} label="Let's talk" variant="light" external />
                  </div>
                  <div className={styles.dpRight}>
                    <p>
                      The reality is most brands don&apos;t need a bloated agency roster. They need a team that operates like an internal growth arm, without the overhead.
                      <br/><br/>
                      Our partners trust us to handle their heaviest lifting across everything from platform migrations to global AI campaigns.
                    </p>
                  </div>
                </div>

                {/* Marquee inside the dark box */}
                <div className={styles.dpMarquee}>
                  <div className={styles.dpTrack}>
                    <div className={styles.dpSlide}>
                      {clients.map((c, i) => (
                        <div key={i} className={styles.dpTextLogo}>
                          {c.name}
                        </div>
                      ))}
                      {/* Repeat for seamless transition */}
                      {clients.map((c, i) => (
                        <div key={`dup-${i}`} className={styles.dpTextLogo}>
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </div>
    </>
  );
}
