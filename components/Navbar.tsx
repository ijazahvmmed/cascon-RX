'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { mainNavLinks } from '@/data/navigation';
import { CAL_LINK } from '@/lib/constants';
import MorphButton from './MorphButton';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    if (currentY > 500) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    if (currentY > 100 && currentY > lastScrollY.current) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileSubmenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/';
  const isCasconPage = pathname === '/cascon';
  const showWhiteLogo = !scrolled && (isHomePage || isCasconPage);
  const showWhiteHamburger = !scrolled && (isHomePage || isCasconPage);

  return (
    <>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''} ${menuOpen ? styles.menuOpen : ''} ${showWhiteLogo ? styles.transparent : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} aria-label="Cascon Home">
            <Image
              src={(showWhiteLogo || menuOpen) ? '/cascon-white.png' : '/cascon-black.png'}
              alt="Cascon"
              width={60}
              height={60}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          <div className={styles.navLinks}>
            {mainNavLinks.map((link) => {
              if (link.href === '/services') {
                return (
                  <div key={link.href} className={styles.navItemWithDropdown}>
                    <Link
                      href={link.href}
                      className={`${styles.navLink} ${pathname.startsWith(link.href) ? styles.active : ''}`}
                    >
                      {link.label}
                    </Link>
                    <div className={styles.dropdownMenu}>
                      <Link href="/services#shopify" className={styles.dropdownItem}>Shopify Development</Link>
                      <Link href="/services#ai-media" className={styles.dropdownItem}>AI Media Production</Link>
                      <Link href="/services#performance-marketing" className={styles.dropdownItem}>Performance Marketing</Link>
                      <Link href="/services#automation" className={styles.dropdownItem}>Automation</Link>
                      <Link href="/services#seo-aeo" className={styles.dropdownItem}>SEO & AEO</Link>
                      <Link href="/services#content-strategy" className={styles.dropdownItem}>Content Strategy</Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className={styles.navRight}>
            <div className={styles.desktopBtn}>
              <MorphButton 
                href={CAL_LINK} 
                external 
                label="Contact" 
                size="sm" 
                variant={(showWhiteLogo || menuOpen) ? 'light' : 'dark'} 
              />
            </div>
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''} ${(showWhiteHamburger || menuOpen) ? styles.hamburgerWhite : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div className={styles.overlayInner}>
          <div className={styles.overlayContent}>
            {mainNavLinks.map((link, i) => {
              const isActive = pathname === link.href;
              if (link.href === '/services') {
                return (
                  <div key={link.href} className={styles.overlayLinkWrapperWithSub} style={{ transitionDelay: `${i * 0.05 + 0.1}s` }}>
                    <div className={styles.mobileLinkHeader}>
                      {isActive && <span className={styles.activeDot}>•</span>}
                      <Link
                        href={link.href}
                        className={`${styles.overlayLink} ${isActive ? styles.overlayLinkActive : ''}`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      <button
                        className={styles.submenuToggle}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMobileSubmenuOpen(!mobileSubmenuOpen);
                        }}
                        aria-label="Toggle services submenu"
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`${styles.toggleArrow} ${mobileSubmenuOpen ? styles.toggleArrowActive : ''}`}
                        >
                          <path
                            d="M1.5 2L6 6.5L10.5 2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className={`${styles.mobileSubmenu} ${mobileSubmenuOpen ? styles.mobileSubmenuOpen : ''}`}>
                      <Link href="/services#shopify" className={styles.mobileSubmenuLink} onClick={() => setMenuOpen(false)}>Shopify Development</Link>
                      <Link href="/services#ai-media" className={styles.mobileSubmenuLink} onClick={() => setMenuOpen(false)}>AI Media Production</Link>
                      <Link href="/services#performance-marketing" className={styles.mobileSubmenuLink} onClick={() => setMenuOpen(false)}>Performance Marketing</Link>
                      <Link href="/services#automation" className={styles.mobileSubmenuLink} onClick={() => setMenuOpen(false)}>Automation</Link>
                      <Link href="/services#seo-aeo" className={styles.mobileSubmenuLink} onClick={() => setMenuOpen(false)}>SEO & AEO</Link>
                      <Link href="/services#content-strategy" className={styles.mobileSubmenuLink} onClick={() => setMenuOpen(false)}>Content Strategy</Link>
                    </div>
                  </div>
                );
              }
              return (
                <div key={link.href} className={styles.overlayLinkWrapper} style={{ transitionDelay: `${i * 0.05 + 0.1}s` }}>
                  {isActive && <span className={styles.activeDot}>•</span>}
                  <Link
                    href={link.href}
                    className={`${styles.overlayLink} ${isActive ? styles.overlayLinkActive : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
            <div className={styles.overlayCta} style={{ transitionDelay: `${mainNavLinks.length * 0.05 + 0.15}s` }}>
              <Link href={CAL_LINK} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                Contact <span className={styles.contactArrowWrapper}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
