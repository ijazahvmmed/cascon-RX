import type { Metadata } from 'next';
import { CONTACT_EMAIL, LOCATIONS } from '@/lib/constants';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import styles from './contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Cascon. We respond within 24 hours.',
  openGraph: {
    title: 'Contact — Cascon',
    description: 'Get in touch with Cascon. We respond within 24 hours.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/contact',
  },
};

export default function ContactPage() {
  return (
    <InteriorHeroBg variant="peach">
      <div className={styles.inner}>
        <h1 className={styles.title}>Get in touch</h1>

        <div className={styles.emailSection}>
          <a href={`mailto:${CONTACT_EMAIL}`} className={styles.emailLink}>
            {CONTACT_EMAIL}
          </a>
          <span className={styles.responseTime}>Average response: &lt; 24h</span>
        </div>

        <div className={styles.locationGrid}>
          <div className={styles.locationCard}>
            <span className={styles.locationLabel}>{LOCATIONS.coventry.label}</span>
            <span className={styles.locationAddress}>{LOCATIONS.coventry.address}</span>
            {LOCATIONS.coventry.phone && (
              <a href={`tel:${LOCATIONS.coventry.phone.replace(/\s+/g, '')}`} className={styles.phoneLink}>
                {LOCATIONS.coventry.phone}
              </a>
            )}
            <a
              href={LOCATIONS.coventry.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewMap}
            >
              View Map →
            </a>
          </div>
          <div className={styles.locationCard}>
            <span className={styles.locationLabel}>{LOCATIONS.bangalore.label}</span>
            <span className={styles.locationAddress}>{LOCATIONS.bangalore.address}</span>
            {LOCATIONS.bangalore.phone && (
              <a href={`tel:${LOCATIONS.bangalore.phone.replace(/\s+/g, '')}`} className={styles.phoneLink}>
                {LOCATIONS.bangalore.phone}
              </a>
            )}
            <a
              href={LOCATIONS.bangalore.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewMap}
            >
              View Map →
            </a>
          </div>
        </div>
      </div>
    </InteriorHeroBg>
  );
}
