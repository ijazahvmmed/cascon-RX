'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { clients } from '@/data/clients';
import { services } from '@/data/services';
import { CAL_LINK, CONTACT_EMAIL } from '@/lib/constants';
import CaseCard from '@/components/CaseCard';
import TestimonialSlider from '@/components/TestimonialSlider';
import MorphButton from '@/components/MorphButton';
import ScrollReveal from '@/components/ScrollReveal';
import CharacterReveal from '@/components/CharacterReveal';
import styles from './HomeClient.module.css';
import gsap from 'gsap';


const featuredOrder = ['Bagus', 'Rewise', 'Reborn Co', 'Car Supply', 'Vibezon', 'Hanbee'];
const featuredClients = featuredOrder
  .map((name) => clients.find((c) => c.name === name))
  .filter((c): c is NonNullable<typeof c> => c !== undefined && c.image !== null);

const allClientNames = clients.map((c) => c.name);
const marqueeNames = [...allClientNames, ...allClientNames]; // duplicate for seamless loop

const partnerBadges = [
  { src: '/images/badges/shopifypartners.png', alt: 'Shopify Partners' },
  { src: '/images/badges/figma.png', alt: 'Figma' },
  { src: '/images/badges/higgsfield.png', alt: 'Higgsfield' },
  { src: '/images/badges/supermoney.png', alt: 'SuperMoney' },
];

const serviceNames = services.slice(0, 5);

export default function HomeClient() {
  const [activeService, setActiveService] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const heroContent = heroRef.current;
    const pill = locationRef.current;
    if (!heroContent || !pill) return;

    const ctx = gsap.context(() => {
      // Smooth blur reveal for entire hero content
      gsap.fromTo(
        heroContent,
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'power3.out', delay: 0.1 }
      );

      // Location pill specific animation
      gsap.fromTo(
        pill,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
      );
    });

    return () => ctx.revert();
  }, []);

  // Video playback detection
  useEffect(() => {
    const handlePlaying = () => {
      setIsVideoPlaying(true);
    };

    const desktopVideo = desktopVideoRef.current;
    const mobileVideo = mobileVideoRef.current;

    if (desktopVideo) desktopVideo.addEventListener('playing', handlePlaying);
    if (mobileVideo) mobileVideo.addEventListener('playing', handlePlaying);

    // Fail-safe: Reveal after 2.5s anyway
    const timer = setTimeout(() => {
      setIsVideoPlaying(true);
    }, 2500);

    return () => {
      if (desktopVideo) desktopVideo.removeEventListener('playing', handlePlaying);
      if (mobileVideo) mobileVideo.removeEventListener('playing', handlePlaying);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* ===== 1. HERO ===== */}
      <section className={styles.hero}>
        {/* Immediate Load Layer (Images) */}
        <div 
          className={styles.heroImage} 
          style={{ opacity: isVideoPlaying ? 0 : 1 }}
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/hero/Hor_image.webp" />
            <img src="/images/hero/Ver_image.webp" alt="Hero background" className={styles.heroImg} />
          </picture>
        </div>

        {/* Desktop video */}
        <div className={styles.videoDesktop}>
          <video
            ref={desktopVideoRef}
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/horizontal.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Mobile video */}
        <div className={styles.videoMobile}>
          <video
            ref={mobileVideoRef}
            className={styles.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/vertical.mp4" type="video/mp4" />
          </video>
        </div>


        <div className={styles.heroOverlay} />
        <div className={styles.heroContent} ref={heroRef} style={{ opacity: 0, willChange: 'opacity, filter, transform' }}>
          <h1 className={styles.heroTitle}>
            <CharacterReveal text="We are Cascon. Creative artists who build brands that sell." />
          </h1>
          <div className={styles.locationContainer} ref={locationRef} style={{ opacity: 0 }}>
            <a href={CAL_LINK} target="_blank" rel="noopener noreferrer" className={styles.pill}>
              <svg width="9" height="11" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.pillIcon}><path d="M5 0C2.23858 0 0 2.23858 0 5C0 8.25 5 12 5 12C5 12 10 8.25 10 5C10 2.23858 7.76142 0 5 0ZM5 7C3.89543 7 3 6.10457 3 5C3 3.89543 3.89543 3 5 3C6.10457 3 7 3.89543 7 5C7 6.10457 6.10457 7 5 7Z" fill="currentColor"/></svg>
              COVENTRY
            </a>
            <a href={CAL_LINK} target="_blank" rel="noopener noreferrer" className={styles.pill}>
              <svg width="9" height="11" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.pillIcon}><path d="M5 0C2.23858 0 0 2.23858 0 5C0 8.25 5 12 5 12C5 12 10 8.25 10 5C10 2.23858 7.76142 0 5 0ZM5 7C3.89543 7 3 6.10457 3 5C3 3.89543 3.89543 3 5 3C6.10457 3 7 3.89543 7 5C7 6.10457 6.10457 7 5 7Z" fill="currentColor"/></svg>
              KOCHI
            </a>
            <span className={styles.pillDivider} />
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.emailLink}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>


      {/* ===== LIGHT SECTION WRAPPER ===== */}
      <div className={styles.lightSectionWrapper}>
        <div className={styles.bgContainer}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
          <div className={`${styles.blob} ${styles.blob4}`} />
        </div>

        {/* ===== 2. ABOUT STATEMENT ===== */}
        <section className={styles.aboutStatement}>
          <ScrollReveal>
            <div className={styles.aboutInner}>
              <h2 className={styles.aboutTitle}>
                <CharacterReveal text="We're building Cascon to be the agency " />
                <strong><CharacterReveal text="that actually ships" /></strong>
                <CharacterReveal text=", Shopify stores and AI media done properly." />
              </h2>
              <MorphButton href="/about" label="About us" />
            </div>
          </ScrollReveal>
        </section>

        {/* ===== 3. CASE STUDIES GRID ===== */}
        <section className={styles.caseStudies}>
          <div className={styles.caseInner}>
            <div className={styles.caseGrid}>
              {featuredClients.map((client) => (
                <CaseCard
                  key={client.name}
                  name={client.name}
                  description={`${client.tags.join(' · ')}`}
                  tags={client.tags}
                  image={client.image!}
                  externalUrl={client.externalUrl!}
                />
              ))}
            </div>
            <div className={styles.caseCtaWrap}>
              <MorphButton href="/work" label="See All Work" />
            </div>
          </div>
        </section>

        {/* ===== 4. CLIENTS MARQUEE ===== */}
        <section className={styles.clientsMarquee}>
          <div className={styles.marqueeInner}>
            <ScrollReveal>
              <h2 className={styles.marqueeTitle}>
                We work with brands building and scaling their business, including:
              </h2>
            </ScrollReveal>
            <div className={styles.marqueeTrack}>
              <div className={styles.marqueeSlide}>
                {marqueeNames.map((name, i) => (
                  <span key={`${name}-${i}`} className={styles.marqueeName}>
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div className={styles.partnersRow}>
              <span className={styles.partnersLabel}>OUR PARTNERS</span>
              <div className={styles.partnerLogos}>
                {partnerBadges.map((badge) => (
                  <Image
                    key={badge.alt}
                    src={badge.src}
                    alt={badge.alt}
                    width={160}
                    height={32}
                    className={styles.partnerLogo}
                    priority
                  />
                ))}
              </div>
            </div>

            <div className={styles.clientsCta}>
              <Link href="/clients" className={styles.clientsLink}>
                Our clients
              </Link>
              <Link href="/clients" className={styles.circleBtn} aria-label="View all clients">
                →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== 5. TESTIMONIALS ===== */}
        <TestimonialSlider />

        {/* ===== 6. SERVICES SECTION ===== */}
        <section className={styles.servicesSection}>
          <div className={styles.servicesInner}>
            <ScrollReveal>
              <div className={styles.servicesLeft}>
                <h2 className={styles.servicesTitle}>
                  We build Shopify stores and AI media that actually perform.
                </h2>
                <p className={styles.servicesDesc}>
                  Because it makes sense to offer them together — most ecommerce brands need both a store that converts and content that sells. We do both under one roof.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className={styles.servicesRight}>
                <span className={styles.servicesLabel}>SERVICES</span>
                <ul className={styles.servicesList}>
                  {serviceNames.map((svc, i) => (
                    <li key={svc.id}>
                      <Link
                        href={`/services#${svc.id}`}
                        className={`${styles.serviceItem} ${i === activeService ? styles.serviceItemActive : ''}`}
                        onMouseEnter={() => setActiveService(i)}
                      >
                        <span className={styles.serviceNameLight}>{svc.name}</span>
                        <span className={styles.serviceNameBold}>{svc.name}</span>
                        <span className={styles.serviceArrow}>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <MorphButton href="/services" label="All services" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== 8. CAREERS CTA ===== */}
        {/* We place careers inside lightSectionWrapper to maintain background consistency until locations */}
        <section className={styles.careersCta}>
          <div className={styles.careersInner}>
            <ScrollReveal>
              <div className={styles.careersBadge}>
                <span className={styles.badgeDot} />
                Open position
              </div>
              <h3 className={styles.careersRole}>Growth Operator</h3>
              <div className={styles.careersLinks}>
                <Link href="/work">Work</Link>
                <Link href="/clients">Clients</Link>
                <Link href="/about">About us</Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* ===== 7. LOCATIONS ===== */}
      <section className={styles.locationsSection}>
        <div className={styles.locationsInner}>
          <ScrollReveal>
            <h2 className={styles.locationsTitle}>
              You can work with Cascon from here. And here. And here. And here. And here.
            </h2>
            <p className={styles.locationsDesc}>
              We work across time zones and markets, usually where the work needs to happen.
            </p>
            <MorphButton href="/cascon" label="Read more" variant="light" />
          </ScrollReveal>
          <div className={styles.mapDots}>
            <span className={styles.dot} style={{ top: '30%', left: '45%' }} />
            <span className={styles.dot} style={{ top: '45%', left: '65%' }} />
            <span className={styles.dot} style={{ top: '55%', left: '35%' }} />
            <span className={styles.dot} style={{ top: '40%', left: '55%' }} />
            <span className={styles.dot} style={{ top: '60%', left: '50%' }} />
          </div>
        </div>
      </section>

      {/* ===== 9. COLLABORATION CTA ===== */}
      <section className={styles.collabCta}>
        <div className={styles.collabInner}>
          <ScrollReveal>
            <h2 className={styles.collabTitle}>Want to work together?</h2>
            <p className={styles.collabDesc}>We can start with a conversation.</p>
            <MorphButton href={CAL_LINK} label="Hire us" external variant="light" />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
