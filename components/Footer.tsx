'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { footerColumns } from '@/data/navigation';
import { CONTACT_EMAIL } from '@/lib/constants';
import type { NavLink } from '@/data/navigation';
import styles from './Footer.module.css';

function FooterLink({ link }: { link: NavLink }) {
  if (link.external || link.href.startsWith('mailto:') || link.href.startsWith('http')) {
    return (
      <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className={styles.footerLink}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={styles.footerLink}>
      {link.label}
    </Link>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <footer className={`${styles.footer} ${isHome ? styles.homeVariant : ''}`}>
      <div className={styles.footerInner}>
        {/* Top message */}
        <div className={styles.topMessage}>
          <p>
            They say no one reads the footer. If you&apos;re here, you might as well say{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.hiLink}>
              hi
            </a>
            .
          </p>
        </div>

        {/* Addresses */}
        <div className={styles.addresses}>
          <a
            href="https://maps.app.goo.gl/96Lyq4e7ddpVSaQA6"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.address}
          >
            <span className={styles.addressLabel}>COVENTRY</span>
            <span className={styles.addressText}>Coventry, West Midlands, CV1, UK</span>
          </a>
          <a
            href="https://maps.app.goo.gl/UiSin4CaNRrEMMmF6"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.address}
          >
            <span className={styles.addressLabel}>KOCHI</span>
            <span className={styles.addressText}>Ernakulam, Kochi, Kerala, India</span>
          </a>
        </div>

        {/* Footer columns */}
        <div className={styles.columns}>
          {Object.values(footerColumns).map((col) => (
            <div key={col.title} className={styles.column}>
              <h4 className={styles.columnTitle}>{col.title}</h4>
              <ul className={styles.columnLinks}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bottom */}
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.bottomEmail}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className={styles.bottomCenter}>
            <Link href="/privacy-policy" className={styles.bottomLink}>
              Privacy Policy
            </Link>
          </div>
          <div className={styles.bottomRight}>
            <span className={styles.copyright}>&copy; 2026 Cascon. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
