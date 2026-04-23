import type { Metadata } from 'next';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Cascon. Learn how we collect, use, and protect your information.',
  openGraph: {
    title: 'Privacy Policy — Cascon',
    description: 'Privacy Policy for Cascon. Learn how we collect, use, and protect your information.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — Cascon',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cascon.systems/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.effective}>Effective Date: March 2026</p>
        <p className={styles.company}>
          Cascon | cascon.systems | hello@wecascon.com
        </p>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              We collect minimal information to provide our services effectively. This may include:
            </p>
            <ul>
              <li>
                <strong>Contact information</strong> you voluntarily provide when booking a call
                or sending an email (name, email address, company name).
              </li>
              <li>
                <strong>Usage data</strong> collected through Plausible Analytics, which is
                privacy-first and cookieless. This includes page views, referral sources,
                browser type, and country — all without identifying individual users.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>2. How We Use It</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to inquiries and schedule meetings via Cal.com</li>
              <li>Understand how visitors use our website to improve the experience</li>
              <li>Communicate about our services when requested</li>
            </ul>
            <p>
              We do not sell, share, or distribute your personal information to third
              parties for marketing purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Cookies</h2>
            <p>
              We use <strong>Plausible Analytics</strong>, which is a privacy-first,
              cookieless analytics platform. Plausible does not use cookies, does not
              collect personal data, and is fully compliant with GDPR, CCPA, and PECR
              without requiring a cookie consent banner.
            </p>
            <p>
              Our website does not set any first-party or third-party tracking cookies.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li>
                <strong>Cal.com</strong> — for scheduling meetings. When you book a call,
                Cal.com may collect your name and email address. See{' '}
                <a href="https://cal.com/privacy" target="_blank" rel="noopener noreferrer">
                  Cal.com&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Plausible Analytics</strong> — for privacy-friendly website analytics.
                No personal data is collected. See{' '}
                <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer">
                  Plausible&apos;s Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to any personal data we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Withdraw consent for communications at any time</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p>
              Since we use cookieless analytics and collect minimal data, most of these
              rights are automatically satisfied by our approach.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or your data, contact us
              at:{' '}
              <a href="mailto:hello@wecascon.com">hello@wecascon.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
