import type { Metadata } from 'next';
import Image from 'next/image';

import ScrollReveal from '@/components/ScrollReveal';
import MorphButton from '@/components/MorphButton';
import { CAL_LINK } from '@/lib/constants';
import { clients } from '@/data/clients';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'Cascon is a global brand agency working with exciting companies.',
};

const values = [
  {
    title: 'Do it like its yours', // Matches screenshot typo deliberately or just 'Do it like it\'s yours'
    desc: 'Take ownership. We treat every store and asset like it belongs to us. No cutting corners, no half-baked solutions.'
  },
  {
    title: 'Impact over fancy',
    desc: 'If it doesn\'t drive conversions or elevate the brand, it\'s just noise. We build for revenue, not just for Dribbble.'
  },
  {
    title: '4 in 1',
    desc: 'Strategy, UI/UX, Development, and AI Media. You don\'t need four agencies when you have one that excels at all four.'
  },
  {
    title: 'From in-house to full-house',
    desc: 'We integrate deeply with your team. We don\'t act like external contractors; we act as your dedicated growth arm.'
  },
  {
    title: 'Shaped by tech',
    desc: 'We leverage AI for media generation and the latest headless stacks for Shopify. We stay ahead so you stay ahead.'
  }
];

const jobs = [
  { role: 'PR Executive', location: 'London / Remote', time: 'Fulltime' },
  { role: 'Art Director', location: 'Kochi', time: 'Fulltime' },
  { role: 'Graphic Designer', location: 'Coventry', time: 'Fulltime' },
  { role: 'Web Developer', location: 'Remote', time: 'Fulltime' },
  { role: 'Senior UX/UI', location: 'Remote', time: 'Contract' },
  { role: 'AI Media Artist', location: 'Kochi', time: 'Fulltime' },
];

export default function AboutPage() {
  return (
    <>
      <div className={styles.lightSectionWrapper}>
        <div className={styles.bgContainer}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
        </div>

        {/* 1. HERO & ABOUT US */}
        <section className={styles.heroSection}>
          <div className={styles.heroInner}>
            <ScrollReveal>
              <h1 className={styles.heroTitle}>
                We&apos;re building a <strong>benchmark agency</strong> to make the creative industry even more creative
              </h1>
            </ScrollReveal>

            <div className={styles.aboutGrid}>
              <div className={styles.aboutLeft}>
                <span className={styles.sectionLabel}>ABOUT US</span>
              </div>
              <div className={styles.aboutRight}>
                <ScrollReveal delay={0.1}>
                  <h2 className={styles.aboutHeadline}>
                    Cascon is a global brand agency working with some of the most exciting, fastest-growing companies in the world.
                  </h2>
                  <div className={styles.aboutDesc}>
                    <p>
                      We started Cascon because we kept seeing the same gap — ecommerce brands with great products but stores that didn&apos;t convert, and content that didn&apos;t look the part. We built a two-pillar agency to fix both: Shopify development engineered for revenue, and AI media production that looks better than traditional shoots.
                    </p>
                  </div>

                  <div className={styles.featuresGrid}>
                    <div className={styles.featureItem}>
                      <h4>Partners</h4>
                      <p>Shopify partners obsessed with engineering stores that scale, load fast, and convert predictably.</p>
                    </div>
                    <div className={styles.featureItem}>
                      <h4>End-to-End</h4>
                      <p>Strategy, UI/UX design, custom development, and seamless AI workflow integration.</p>
                    </div>
                    <div className={styles.featureItem}>
                      <h4>Animators</h4>
                      <p>Premium 3D product styling and conceptual animations delivered effortlessly without global shoots.</p>
                    </div>
                    <div className={styles.featureItem}>
                      <h4>Culture</h4>
                      <p>A lean, global network of elite developers and visual creators operating without red tape.</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 2. GALLERY MARQUEE */}
        <section className={styles.galleryStrip}>
          <div className={styles.galleryTrack}>
            <div className={styles.gallerySlide}>
              {[...clients, ...clients].map((client, idx) => {
                if (!client.image) return null;
                return (
                  <div key={`${client.name}-${idx}`} className={styles.galleryImgWrap}>
                    <Image src={client.image} alt={client.name} fill className={styles.gImg} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. VALUES */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesGrid}>
            <div className={styles.valuesLeft}>
              <span className={styles.sectionLabel}>VALUES</span>
              <h2 className={styles.valuesTitle}>This is how we operate</h2>
            </div>
            <div className={styles.valuesRight}>
              {values.map((v, i) => (
                <ScrollReveal key={i}>
                  <div className={styles.valueRow}>
                    <h3 className={styles.valueName}>{v.title}</h3>
                    <p className={styles.valueDesc}>{v.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. OFFICES */}
        <section className={styles.officesSection}>
          <div className={styles.officesGrid}>
            <ScrollReveal>
              <div className={styles.officeCard}>
                <div className={styles.officeImgWrap}>
                  <Image src="/images/pages/about.webp" alt="Coventry Office" fill className={styles.oImg} sizes="50vw" />
                </div>
                <div className={styles.officeMeta}>
                  <span className={styles.officeName}>COVENTRY</span>
                  <span className={styles.officeAddress}>Headquarters, UK<br />Est. 2023</span>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className={styles.officeCard}>
                <div className={styles.officeImgWrap}>
                  <Image src="/images/pages/about.webp" alt="Kochi Office" fill className={styles.oImg} sizes="50vw" />
                </div>
                <div className={styles.officeMeta}>
                  <span className={styles.officeName}>KOCHI</span>
                  <span className={styles.officeAddress}>Creative Hub, IN<br />Est. 2024</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>

      {/* 5. CAREERS / DARK MAP */}
      <section className={styles.careersMapSection}>
        <div className={styles.careersMapInner}>
          <ScrollReveal>
            <span className={styles.mapSmallLabel}>JOIN THE JOURNEY</span>
            <h2 className={styles.mapTitle}>
              You can find Cascon here. And here.<br />And here. And here. And here.
            </h2>
            <p className={styles.mapDesc}>
              We are always on the lookout for elite talent everywhere.<br />Discover the right position for you.
            </p>
            <div className={styles.mapBtnRow}>
              <MorphButton href={CAL_LINK} label="See all roles" variant="light" external />
            </div>
          </ScrollReveal>

          <div className={styles.jobsGrid}>
            {jobs.map((job, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <div className={styles.jobCard}>
                  <h4 className={styles.jobTitle}>{job.role}</h4>
                  <div className={styles.jobMeta}>
                    <span>{job.location}</span>
                    <span>{job.time}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Abstract map dots background */}
          <div className={styles.mapDots}>
            <span className={styles.dot} style={{ top: '20%', left: '45%' }} />
            <span className={styles.dot} style={{ top: '35%', left: '75%' }} />
            <span className={styles.dot} style={{ top: '50%', left: '30%' }} />
            <span className={styles.dot} style={{ top: '65%', left: '60%' }} />
            <span className={styles.dot} style={{ top: '80%', left: '40%' }} />
            <span className={styles.dot} style={{ top: '25%', left: '15%' }} />
          </div>
        </div>
      </section>
    </>
  );
}
