import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import { CAL_LINK } from '@/lib/constants';
import styles from './careers.module.css';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Cascon. We are looking for independent execution-focused minds.',
};

const jobs = [
  { category: 'Creative & UI/UX', title: 'Graphic Designer', link: 'mailto:hello@wecascon.com' },
];

const freelanceJobs = [
  { category: 'Freelance / Remote', title: 'Freelance: Public Relations (PR)', link: 'mailto:hello@wecascon.com' },
  { category: 'Freelance / Remote', title: 'Freelance: Front-end Developer', link: 'mailto:hello@wecascon.com' },
];

const nextSteps = [
  'Application',
  'Interview with People Operations',
  'Interview with Director Level',
  'Case exercise',
  'Final discussion',
  'Decision'
];

export default function CareersPage() {
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
              <h1 className={styles.heroTitle}>Career-curious? Let's talk.</h1>
              <p className={styles.heroSubtitle}>
                We're a fast-paced, execution-heavy agency that values independence. Most communication happens async, most decisions happen fast.
              </p>
              <div className={styles.heroBtns}>
                <MorphButton href="#positions" label="Current positions" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 2. OUR VALUES */}
        <section className={styles.valuesSection}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionLeft}>
              <span className={styles.sectionLabel}>WORK AT CASCON</span>
              <h2 className={styles.sectionTitle}>Our values</h2>
            </div>
            <div className={styles.sectionRight}>
              <ScrollReveal>
                <div className={styles.grid2x2}>
                  <div className={styles.valueItem}>
                    <h4>Do it like it's yours</h4>
                    <p>Take ownership. We treat every store and asset like it belongs to us. No cutting corners, no half-baked solutions.</p>
                  </div>
                  <div className={styles.valueItem}>
                    <h4>Impact over fancy</h4>
                    <p>If it doesn't drive conversions or elevate the brand, it's just noise. We build for revenue, not just for Dribbble.</p>
                  </div>
                  <div className={styles.valueItem}>
                    <h4>Honest communication</h4>
                    <p>If something's broken, say so. If you're stuck, ask. If you disagree, explain why. No politics, no games.</p>
                  </div>
                  <div className={styles.valueItem}>
                    <h4>Independence</h4>
                    <p>You don't wait to be told what to do — you figure it out, do it, and ask for feedback after. We trust people to manage their output.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 3. OFFICES */}
        <section className={styles.officesSection}>
          <div className={styles.officesInner}>
            <ScrollReveal>
              <div className={styles.officesRow}>
                <div className={styles.officeCard}>
                  <div className={styles.officeImgWrap}>
                    <Image src="/images/pages/careers.webp" alt="Coventry Office" fill className={styles.oImg} sizes="50vw" />
                  </div>
                  <div className={styles.officeMeta}>
                    <span className={styles.officeName}>COVENTRY</span>
                    <span className={styles.officeAddress}>Headquarters, UK</span>
                  </div>
                </div>
                <div className={styles.officeCard}>
                  <div className={styles.officeImgWrap}>
                    <Image src="/images/pages/careers.webp" alt="Kochi Office" fill className={styles.oImg} sizes="50vw" />
                  </div>
                  <div className={styles.officeMeta}>
                    <span className={styles.officeName}>KOCHI</span>
                    <span className={styles.officeAddress}>Creative Hub, IN</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 4. PRINCIPLES */}
        <section className={styles.principlesSection}>
          <div className={styles.principlesGrid}>
            <div className={styles.principlesLeft}>
              <span className={styles.sectionLabel}>CORE CASCON ETHOS</span>
              <h2 className={styles.sectionTitle}>The Cascon Principles</h2>
            </div>
          </div>
          <ScrollReveal delay={0.1}>
            <div className={styles.cardsRow}>
              <div className={styles.principleCard}>
                <h3>Independent Execution</h3>
                <p>We do not micromanage. You are expected to grab a brief, understand the objective, and deliver high-tier work on your own schedule.</p>
              </div>
              <div className={styles.principleCard}>
                <h3>No pure strategists - all execution, all the time</h3>
                <p>Strategy is useless if it's not implemented. Everyone here, from designers to developers, spends 90% of their time actively building.</p>
              </div>
              <div className={styles.principleCard}>
                <h3>Concept is nothing without execution</h3>
                <p>You can have the best idea in the world, but if the final export is sloppy, it doesn't matter. We pride ourselves on the last 10% of polish.</p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 5. NEXT STEPS */}
        <section className={styles.stepsSection}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionLeft}>
              <span className={styles.sectionLabel}>INTERVIEW PROCESS</span>
              <h2 className={styles.sectionTitle}>Your likely next steps</h2>
            </div>
            <div className={styles.sectionRight}>
              <ScrollReveal>
                <div className={styles.accordionList}>
                  {nextSteps.map((step, idx) => (
                    <div key={idx} className={styles.accordionItem}>
                      <span>{step}</span>
                      <span className={styles.accordionIcon}>+</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 6. OPEN POSITIONS */}
        <section id="positions" className={styles.openPositionsSection}>
          <div className={styles.sectionGrid}>
            <div className={styles.sectionLeft}>
              <span className={styles.sectionLabel}>OPEN ROLES</span>
              <h2 className={styles.sectionTitle}>It's meant to be</h2>
            </div>
            <div className={styles.sectionRight}>
              <div className={styles.filterRow}>
                <button className={styles.filterBtnActive}>All</button>
                <button className={styles.filterBtn}>London (Hybrid)</button>
                <button className={styles.filterBtn}>Remote</button>
                <button className={styles.filterBtn}>Marketing</button>
              </div>
              <ScrollReveal delay={0.1}>
                <div className={styles.jobsGrid}>
                  {jobs.map((job, idx) => (
                    <div key={idx} className={styles.lightJobCard}>
                      <span className={styles.jobCat}>{job.category}</span>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <MorphButton href={job.link} label="Read more" />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>

      {/* 7. FREELANCERS (DARK) */}
      <section className={styles.freelancersSection}>
        <div className={styles.freelancersInner}>
          <ScrollReveal>
            <span className={styles.darkLabel}>GLOBAL HUB</span>
            <h2 className={styles.darkTitle}>Freelancers</h2>
            <p className={styles.darkDesc}>
              We maintain a global network of elite freelance talent. If you specialize in Shopify development, UI/UX, or AI media generation, we want to hear from you.
              <br/><br/>
              Submit your portfolio and we'll reach out when a project fits.
            </p>
          </ScrollReveal>
          
          <div className={styles.freelancerJobsGrid}>
            {freelanceJobs.map((job, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className={styles.darkJobCard}>
                  <span className={styles.darkJobCat}>{job.category}</span>
                  <h3 className={styles.darkJobTitle}>{job.title}</h3>
                  <MorphButton href={job.link} label="Read more" variant="light" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
