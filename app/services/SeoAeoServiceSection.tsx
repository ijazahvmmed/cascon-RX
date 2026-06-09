'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import styles from './CustomServices.module.css';

export default function SeoAeoServiceSection() {
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
      title: 'Foundation & Strategy',
      desc: 'Full technical SEO audit, keyword research and mapping, competitor gap analysis, site architecture review, AEO opportunity mapping',
    },
    {
      title: 'Content & On-Page Implementation',
      desc: 'Title tags, meta descriptions, heading structures, internal linking, landing page copy, SEO blog content production, schema markup',
    },
    {
      title: 'Technical SEO & Authority Building',
      desc: 'Core Web Vitals, crawlability, indexation, structured data, high-authority backlink acquisition, local SEO (Google Business Profile), AI citation building',
    },
    {
      title: 'Analytics, Monitoring & Continuous Improvement',
      desc: 'Monthly performance reporting, rank tracking, traffic and conversion analysis, ongoing optimisation, strategy adjustments based on data',
    },
  ];

  const faqs = [
    {
      q: 'How long does SEO take to show results?',
      a: 'SEO is a long-term asset, not a quick fix. You may see early positive movement in rankings within 3–4 months, but meaningful impact on traffic, leads, and sales typically happens between 6–12 months. Our programme structures are designed around this timeline — not shorter windows that set unrealistic expectations.',
    },
    {
      q: 'What\'s the difference between the E-commerce and Local SEO plans?',
      a: 'E-commerce SEO is built around product and category keywords — often hundreds or thousands of long-tail terms. Local SEO is focused on dominating a core set of high-intent service keywords in a specific geographic area. Different business models, different strategies.',
    },
    {
      q: 'Do you guarantee a #1 ranking?',
      a: 'No ethical agency can guarantee a specific ranking — Google\'s algorithm is complex, constantly updated, and proprietary. What we do guarantee is a transparent, data-driven process using industry best practices to meaningfully improve your visibility, attract qualified traffic, and increase rankings for the terms that matter to your business.',
    },
    {
      q: 'What is AEO and why does it matter?',
      a: 'AEO (AI Engine Optimisation) is the practice of optimising your content so it gets cited and recommended by AI tools like ChatGPT, Perplexity, and Google\'s AI Overviews. As more people use AI to answer purchase and research questions, being referenced in those answers is becoming as important as ranking on page one. We build for both.',
    },
    {
      q: 'How do I know whether I need the E-commerce or Local SEO plan?',
      a: 'Choose E-commerce SEO if your goal is to sell products directly through an online store. Choose Local SEO if your goal is to generate leads and enquiries for a service you deliver in a specific location. Not sure? Book a free audit and we\'ll tell you exactly what you need.',
    },
    {
      q: 'When should I go with the Custom/Enterprise plan?',
      a: 'When you need to target multiple cities, regions, or countries — or you\'re in a highly competitive national market — or your site has hundreds or thousands of pages requiring advanced technical SEO — or you want a full AEO strategy layered on top of traditional SEO.',
    },
    {
      q: 'What do you need from us to get started?',
      a: 'Three things: (1) access to your website backend (Shopify, WordPress, etc.), (2) access to Google Analytics and Search Console — we can help set these up if needed, and (3) a kickoff call to understand your business goals, audience, and competitive landscape.',
    },
  ];

  const checklistItems = [
    'Technical SEO Audit & Implementation',
    'Strategic Keyword Research & Mapping',
    'On-Page & Off-Page Optimisation',
    'High-Authority Link Building',
    'Local SEO',
    'AI Engine Optimisation (AEO)',
    'Schema Markup',
    'Comprehensive Performance Reporting',
  ];

  return (
    <div className={styles.customRow}>
      {/* 3A. HERO BLOCK */}
      <ScrollReveal>
        <div className={styles.heroBlock}>
          <span className={styles.eyebrow}>SEO & AEO</span>
          <h2 className={styles.titleH2}>Rank Higher. Get Found. Grow Revenue.</h2>
          <p className={styles.subtext}>
            Invisible online while your competitors take all the clicks? If you&apos;re not appearing on the first page of Google — and increasingly in AI search tools like ChatGPT and Perplexity — you&apos;re leaving serious revenue on the table. We build data-driven SEO and AEO strategies that put you in front of the right people and turn that traffic into real business.
          </p>
          <div className={styles.heroCta}>
            <MorphButton href="https://cal.com/cascon-haw2fz/15min" label="Get a Free Audit" external />
          </div>
        </div>
      </ScrollReveal>

      {/* 3B. PROFIT-DRIVEN SEO INTRO STRIP */}
      <ScrollReveal delay={0.1}>
        <div className={styles.roiStrip}>
          <div className={styles.roiLeft}>
            <div className={styles.roiLabel}>Profit-Driven SEO</div>
            <p className={styles.roiBody}>
              Our approach to SEO is simple: we care about your bottom line. We don&apos;t chase rankings for their own sake — we build a long-term organic asset that generates compounding returns. The goal isn&apos;t just more traffic. It&apos;s the right traffic — people actively searching for what you sell, ready to buy.
            </p>
            <div className={styles.checklistGrid}>
              {checklistItems.map((item, idx) => (
                <div key={idx} className={styles.checklistItem}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon}>
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 3C. TWO-COLUMN NARRATIVE */}
      <section className={styles.narrativeSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>Cascon</span>
          <h3 className={styles.titleH3}>How We Engineer Sustainable SEO Growth</h3>
        </ScrollReveal>
        <div className={styles.narrativeGrid}>
          <ScrollReveal delay={0.05}>
            <div className={styles.narrativeCol}>
              <h4>Building Your Digital Foundation</h4>
              <p>
                Long-term SEO success doesn&apos;t come from tricks or quick fixes. It comes from building a website that both search engines and real users genuinely trust.
              </p>
              <p>
                Our methodology combines <strong>Technical Excellence</strong> — ensuring your site is crawlable, fast, and structurally sound — with <strong>Strategic Content Creation</strong> that positions you as the definitive answer to your customers&apos; most important questions.
              </p>
              <p>
                That&apos;s how you build genuine authority. And genuine authority is what earns you lasting first-page rankings.
              </p>
              <p>
                Beyond traditional SEO, we also optimise for <strong>AI Engine Optimisation (AEO)</strong> — the emerging discipline of ensuring your brand is cited and recommended by AI tools like ChatGPT, Perplexity, and Google&apos;s AI Overviews. This is where search is heading, and we&apos;re already building for it.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className={styles.narrativeCol}>
              <h4>Certified Search Marketing Professionals</h4>
              <p>
                Our team lives and breathes search. We work daily across Google Analytics 4, Google Search Console, Ahrefs, SEMrush, and the emerging AI citation landscape. Every strategy is built on current data, tested hypotheses, and transparent reporting — not guesswork.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3D. PROCESS ACCORDION */}
      <section className={styles.processSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>What You Get</span>
          <h3 className={styles.titleH3}>What&apos;s Included in Our SEO & AEO Campaigns?</h3>
          <p className={styles.processIntro}>
            Our campaigns are structured, transparent, and built on a four-phase process designed for continuous improvement.
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

      {/* 3E. PRICING CARDS */}
      <section className={styles.pricingSection}>
        <ScrollReveal>
          <h3 className={styles.titleH3}>Find the Right SEO Plan for Your Business</h3>
        </ScrollReveal>

        <div className={`${styles.pricingGrid} ${styles.pricingGrid3Col}`}>
          {/* Card 1 */}
          <ScrollReveal delay={0.05} className={styles.pricingCardWrapper}>
            <div className={styles.pricingCard}>
              <span className={styles.cardTag}>6-Month Programme</span>
              <h4 className={styles.cardTitle}>E-commerce SEO</h4>
              <div className={styles.priceWrapper}>
                <span className={styles.priceValue}>From £399/month</span>
              </div>
              <p className={styles.cardBestFor}>
                Best for: Shopify and D2C brands selling products online
              </p>
              <div className={styles.pricingFeatures}>
                {[
                  'Unlimited targeted keywords',
                  'Single location + global keyword focus',
                  '25 SEO-focused blog posts across the programme',
                  'On-page SEO',
                  'Technical SEO',
                  'Off-page SEO & link building',
                  'Automation & retention integration',
                  'Monthly performance report',
                  'Dedicated support',
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
          <ScrollReveal delay={0.1} className={styles.pricingCardWrapper}>
            <div className={`${styles.pricingCard} ${styles.pricingPopular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <span className={styles.cardTag}>7-Month Programme</span>
              <h4 className={styles.cardTitle}>Local Service-Based SEO</h4>
              <div className={styles.priceWrapper}>
                <span className={styles.priceValue}>From £399/month</span>
              </div>
              <p className={styles.cardBestFor}>
                Best for: Service businesses targeting local or regional customers
              </p>
              <div className={styles.pricingFeatures}>
                {[
                  'Up to 50 targeted keywords',
                  'Single location + service keyword focus',
                  '25 SEO-focused blog posts across the programme',
                  'New SEO-optimised landing pages',
                  'On-page SEO',
                  'Technical SEO',
                  'Off-page SEO & link building',
                  'Google Business Profile (GBP) optimisation and A/B testing',
                  'Monthly performance report',
                  'Dedicated support',
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

          {/* Card 3 */}
          <ScrollReveal delay={0.15} className={styles.pricingCardWrapper}>
            <div className={styles.pricingCard}>
              <span className={styles.cardTag}>12-Month+ Programme</span>
              <h4 className={styles.cardTitle}>Custom / Enterprise SEO + AEO</h4>
              <div className={styles.priceWrapper}>
                <span className={styles.priceValue}>Custom Pricing</span>
              </div>
              <p className={styles.cardBestFor}>
                Best for: Established brands, multi-location businesses, and brands wanting to dominate AI search
              </p>
              <div className={styles.pricingFeatures}>
                {[
                  'Everything in standard packages, plus:',
                  'Unlimited keywords (50+)',
                  'Multiple location targeting',
                  'Advanced content strategy',
                  'Advanced technical SEO',
                  'Premium link building',
                  'AI Engine Optimisation (AEO) — structured for ChatGPT, Perplexity, and Google AI Overviews',
                  'Dedicated senior SEO strategist',
                  'Advanced competitor intelligence reporting',
                  'Year-long analysis and ongoing content optimisation',
                  'Monthly executive reports',
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
                <MorphButton href="https://cal.com/cascon-haw2fz/15min" label="Contact Us" external />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3F. DIFFERENTIATOR CARDS */}
      <section className={styles.diffSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>Creating Success</span>
          <h3 className={styles.titleH3}>What Makes Our SEO & AEO Campaigns So Effective?</h3>
        </ScrollReveal>
        <div className={styles.diffGrid}>
          <ScrollReveal delay={0.05} className={styles.diffCardWrapper}>
            <div className={styles.diffCard}>
              <h4>Holistic Strategy, Not a Checklist</h4>
              <p>
                We don&apos;t treat SEO as a list of tasks. We integrate technical optimisation, content strategy, link building, and AEO into a single cohesive engine — where every element compounds on the others. That&apos;s how organic traffic becomes a real business asset.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className={styles.diffCardWrapper}>
            <div className={styles.diffCard}>
              <h4>Full Transparency</h4>
              <p>
                You&apos;ll never be left guessing. We deliver clear, jargon-free monthly reports and make it a priority to explain what we&apos;re doing, why we&apos;re doing it, and how it&apos;s moving your bottom line. No black box.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className={styles.diffCardWrapper}>
            <div className={styles.diffCard}>
              <h4>Focused on Business Growth, Not Just Rankings</h4>
              <p>
                Rankings are a means to an end. Our real goal is growing your business — more leads, more calls, more sales. We track the metrics that actually matter, and we tie every SEO decision back to revenue.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3G. STATS BAR */}
      <section className={styles.statsSection}>
        <ScrollReveal>
          <span className={styles.eyebrow}>The Proof Is in the Rankings</span>
          <h3 className={styles.titleH3}>Why a Strategic SEO Campaign Changes Your Business</h3>
        </ScrollReveal>
        <div className={styles.statsGrid}>
          <ScrollReveal delay={0.05}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>93%</div>
              <div className={styles.statLabel}>Of all online experiences begin with a search engine. Your customers are looking for what you sell right now.</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>↑ 70%</div>
              <div className={styles.statLabel}>Average increase in qualified organic traffic for our clients within the first 6–12 months.</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5.7×</div>
              <div className={styles.statLabel}>Higher lead-to-close rate from organic SEO vs traditional outbound marketing.</div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3H. FAQ ACCORDION */}
      <section className={styles.faqSection}>
        <ScrollReveal>
          <h3 className={styles.titleH3}>FAQs About SEO & AEO</h3>
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
