'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import styles from './CustomServices.module.css';

export default function ShopifyServiceSection() {
  const [activeProcess, setActiveProcess] = useState<number | null>(0); // Default open first
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleProcess = (index: number) => {
    setActiveProcess(activeProcess === index ? null : index);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const processItems = [
    {
      title: 'Strategy & Design',
      desc: 'Brand discovery, competitor analysis, user journey mapping, Figma mockups, mobile-first design, conversion-led layout decisions',
    },
    {
      title: 'Development & Feature Build',
      desc: 'Custom theme development or advanced theme customisation, checkout optimisation, app integration, speed optimisation, CRO implementation',
    },
    {
      title: 'Integrations & Launch Readiness',
      desc: 'Payment gateway setup, third-party app configuration (Klaviyo, review apps, loyalty tools), SEO technical foundation, QA and cross-device testing',
    },
    {
      title: 'Handover, Training & Ongoing Support',
      desc: 'Full store walkthrough, team training, Slack access, optional monthly maintenance retainer',
    },
  ];

  const faqs = [
    {
      q: 'What types of Shopify projects do you take on?',
      a: 'We handle everything from full custom builds to store redesigns, platform migrations, CRO audits, speed optimisation, and ongoing development retainers. If it\'s Shopify, we can work on it.',
    },
    {
      q: 'How long does a Shopify build take?',
      a: 'A Shopify Launchpad redesign typically takes 2–3 weeks. A full custom build ranges from 6–12 weeks, depending on the scope of design, integrations, and features required.',
    },
    {
      q: 'Can you migrate my store from WooCommerce, Wix, or another platform?',
      a: 'Yes. We handle full platform migrations including products, customer data, and order history — with minimal downtime and zero data loss.',
    },
    {
      q: 'Do you offer ongoing support after launch?',
      a: 'Yes. All projects include a full handover and training session. We also offer monthly support and development retainers from £59/month for brands that want consistent help post-launch.',
    },
    {
      q: 'Can you build for dropshipping or print-on-demand?',
      a: 'Absolutely. We\'ve built stores for dropshipping and POD brands, including full supplier integrations (e.g. Printful, CJ Dropshipping), automated order fulfilment, and high-trust brand design.',
    },
    {
      q: 'How do you handle multi-currency and international selling?',
      a: 'We build multi-market stores using Shopify Markets — with automatic currency conversion, localised checkout, and multi-language support. We make your store feel local wherever your customer is.',
    },
    {
      q: 'How do you collaborate across time zones?',
      a: 'With offices in Dubai (UAE) and Kochi (India), we\'re built for global collaboration. Work progresses around the clock — you review decisions at the end of your day and wake up to tangible progress. All project communication runs through a shared Slack channel.',
    },
    {
      q: 'How does a new Shopify store actually start getting sales?',
      a: 'The store launch is step one. Every site we build is founded on CRO principles and has a solid technical SEO foundation. We also offer performance marketing, SEO, and email automation as add-ons — so you have a complete growth engine, not just a website.',
    },
  ];

  const clientPills = [
    { name: 'Custom Theme Development', href: null },
    { name: 'SEO & AEO', href: '#seo-aeo' },
    { name: 'Performance Marketing', href: '#performance-marketing' },
    { name: 'Automation & Retention', href: '#automation' },
    { name: 'AI Media Production', href: '#ai-media' },
    { name: 'Content Strategy', href: '#content-strategy' },
  ];

  return (
    <div className={styles.customRow}>
      {/* 2A. HERO BLOCK */}
      <ScrollReveal>
        <div className={styles.heroBlock}>
          <span className={styles.eyebrow}>Shopify Development</span>
          <h2 className={styles.titleH2}>Turn Your Product Into a High-Converting Shopify Store</h2>
          <p className={styles.subtext}>
            Struggling with a slow store, low conversions, or a theme that&apos;s killing sales? We build and optimize Shopify stores engineered from the ground up to convert visitors into customers — and keep them coming back.
          </p>
          <div className={styles.heroCta}>
            <MorphButton href="https://cal.com/cascon-haw2fz/15min" label="Get a Free Audit" external />
          </div>
        </div>
      </ScrollReveal>

      {/* 2B. ROI INTRO STRIP */}
      <ScrollReveal delay={0.1}>
        <div className={styles.roiStrip}>
          <div className={styles.roiLeft}>
            <div className={styles.roiLabel}>Results-Driven Shopify Builds</div>
            <p className={styles.roiBody}>
              Our work with you is built on one thing: results. We measure our success by your revenue — not deliverables ticked off a list.
            </p>
          </div>
          <div className={styles.roiPills}>
            {clientPills.map((pill, idx) => (
              pill.href ? (
                <Link key={idx} href={pill.href} className={styles.roiPill}>
                  {pill.name}
                </Link>
              ) : (
                <span key={idx} className={styles.roiPill}>
                  {pill.name}
                </span>
              )
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 2C. TWO-COLUMN NARRATIVE */}
      <section className={styles.narrativeSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>Cascon</span>
          <h3 className={styles.titleH3}>How We Engineer Your Store for Revenue</h3>
        </ScrollReveal>
        <div className={styles.narrativeGrid}>
          <ScrollReveal delay={0.05}>
            <div className={styles.narrativeCol}>
              <h4>Building Your High-Performance Shopify Store</h4>
              <p>
                The secret to a profitable Shopify store isn&apos;t a good-looking theme. It&apos;s a deliberate digital asset with a strategy behind every pixel.
              </p>
              <p>
                While most agencies ship a modified template and call it done, we engineer a seamless buying experience — from the moment someone lands on your page to the moment they check out.
              </p>
              <p>
                We combine sharp <strong>UI design</strong> with a deep understanding of how your customer actually shops. We reduce friction, build trust, and create the conditions for conversion — turning cold traffic into loyal buyers and repeat customers.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className={styles.narrativeCol}>
              <h4>Certified Shopify Partners</h4>
              <p>
                Our team doesn&apos;t just use Shopify — we know it inside out. As certified <strong>Shopify Partners</strong>, we bring real platform depth to every build. That means your store isn&apos;t just visually polished. It&apos;s technically solid, fast, scalable, and built to grow alongside your brand.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2D. PROCESS ACCORDION */}
      <section className={styles.processSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>What You Get</span>
          <h3 className={styles.titleH3}>What&apos;s Included in a Cascon Shopify Build?</h3>
          <p className={styles.processIntro}>
            When you work with Cascon, you get a full-service build — everything from strategy to post-launch support.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className={styles.accordionList}>
            {processItems.map((item, idx) => (
              <div key={idx} className={styles.accordionItem}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => toggleProcess(idx)}
                  aria-expanded={activeProcess === idx}
                >
                  <div className={styles.accordionTitleContainer}>
                    <span className={styles.accordionNumber}>0{idx + 1}</span>
                    <span>{item.title}</span>
                  </div>
                  <span className={`${styles.accordionIcon} ${activeProcess === idx ? styles.accordionIconActive : ''}`}>
                    +
                  </span>
                </button>
                <div
                  className={`${styles.accordionContent} ${activeProcess === idx ? styles.accordionContentActive : ''}`}
                >
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 2E. PRICING CARDS */}
      <section className={styles.pricingSection}>
        <ScrollReveal>
          <h3 className={styles.titleH3}>Shopify Build Packages</h3>
        </ScrollReveal>

        <div className={`${styles.pricingGrid} ${styles.pricingGrid2Col}`}>
          {/* Card 1 */}
          <ScrollReveal delay={0.05} className={styles.pricingCardWrapper}>
            <div className={styles.pricingCard}>
              <span className={styles.cardTag}>Theme Redesign</span>
              <h4 className={styles.cardTitle}>Shopify Launchpad</h4>
              <div className={styles.priceWrapper}>
                <span className={styles.priceValue}>From £599</span>
              </div>
              <p className={styles.cardBestFor}>
                Best for: Brands with a live store that needs a full visual and performance overhaul
              </p>
              <div className={styles.pricingFeatures}>
                {[
                  'Complete store redesign using a premium Shopify theme',
                  'Single-market setup',
                  'Speed optimisation',
                  'App integrations (unlimited)',
                  'Basic on-page SEO foundation',
                  'Store walkthrough & team handover',
                  'Optional monthly support from £59/month',
                ].map((feature, i) => (
                  <div key={i} className={styles.featureItem}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className={styles.pricingCta}>
                <MorphButton href="https://cal.com/cascon-haw2fz/15min" label="Get Started" external />
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal delay={0.15} className={styles.pricingCardWrapper}>
            <div className={`${styles.pricingCard} ${styles.pricingPopular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <span className={styles.cardTag}>Custom Cascon Theme</span>
              <h4 className={styles.cardTitle}>Shopify Custom Build</h4>
              <div className={styles.priceWrapper}>
                <span className={styles.priceValue}>From £999</span>
              </div>
              <p className={styles.cardBestFor}>
                Best for: New brands and scaling stores that need a fully custom, conversion-optimised build
              </p>
              <div className={styles.pricingFeatures}>
                {[
                  'Multi-market Shopify setup',
                  'Full custom theme — designed and built by Cascon',
                  'Checkout optimisation',
                  'POS integration',
                  'Unlimited app integrations',
                  'Custom third-party integrations',
                  'Automation & retention setup (Klaviyo flows)',
                  'Strategic sales channel configuration',
                  'Page speed optimisation',
                  'Dedicated account manager',
                  'Optional monthly support from £59/month',
                ].map((feature, i) => (
                  <div key={i} className={styles.featureItem}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.featureIcon}>
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className={styles.pricingCta}>
                <MorphButton href="https://cal.com/cascon-haw2fz/15min" label="Get Started" external />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2F. DIFFERENTIATOR CARDS */}
      <section className={styles.diffSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>What You Get</span>
          <h3 className={styles.titleH3}>What Makes Our Shopify Builds So Effective?</h3>
        </ScrollReveal>
        <div className={styles.diffGrid}>
          <ScrollReveal delay={0.05} className={styles.diffCardWrapper}>
            <div className={styles.diffCard}>
              <h4>Strategic, Conversion-Led Design</h4>
              <p>
                A beautiful store is just the starting point. Every project begins with a proper discovery — your brand, your audience, your funnel. We map the full user journey and build a shopping experience that removes friction and drives decisions. The result is a store that looks great and actually sells.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className={styles.diffCardWrapper}>
            <div className={styles.diffCard}>
              <h4>Real Shopify Expertise</h4>
              <p>
                How do you know your store is built to last? Our team are certified Shopify Partners who&apos;ve built and scaled stores across fashion, wellness, automotive, food, and more. We write clean, scalable code and implement only what genuinely serves your goals.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className={styles.diffCardWrapper}>
            <div className={styles.diffCard}>
              <h4>A Real Growth Partnership</h4>
              <p>
                We don&apos;t hand over a store and disappear. You get a dedicated account manager, full team training, and ongoing access to our team as your brand scales. We&apos;re not a vendor — we&apos;re your growth team.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2G. STATS BAR */}
      <section className={styles.statsSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>The Proof Is in the Numbers</span>
          <h3 className={styles.titleH3}>Why a Strategic Shopify Build Changes Everything</h3>
        </ScrollReveal>
        <div className={styles.statsGrid}>
          <ScrollReveal delay={0.05}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>↑ 75%</div>
              <div className={styles.statLabel}>Average conversion rate improvement after a Cascon UI/UX overhaul</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>↑ 40%</div>
              <div className={styles.statLabel}>Lift in average order value (AOV) through strategic upsells and personalised journey design</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Of stores we build are fully optimised for mobile commerce from day one</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2H. FAQ ACCORDION */}
      <section className={styles.faqSection}>
        <ScrollReveal>
          <h3 className={styles.titleH3}>FAQs About Our Shopify Development</h3>
        </ScrollReveal>

        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`${styles.faqItem} ${activeFaq === idx ? styles.faqItemActive : ''}`}
            >
              <button
                className={styles.faqHeader}
                onClick={() => toggleFaq(idx)}
                aria-expanded={activeFaq === idx}
              >
                <span className={styles.faqQuestion}>{faq.q}</span>
                <span className={`${styles.faqIcon} ${activeFaq === idx ? styles.faqIconActive : ''}`}>
                  +
                </span>
              </button>
              <div
                className={`${styles.faqContent} ${activeFaq === idx ? styles.faqContentActive : ''}`}
              >
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
