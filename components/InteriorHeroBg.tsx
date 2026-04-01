'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './InteriorHeroBg.module.css';

interface InteriorHeroBgProps {
  variant?: 'default' | 'purple' | 'teal' | 'mint' | 'lilac' | 'peach' | 'dark';
  children: React.ReactNode;
}

export default function InteriorHeroBg({ variant = 'default', children }: InteriorHeroBgProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, ease: 'power3.out', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`${styles.heroBg} ${variant === 'dark' ? styles.dark : ''}`}>
      <div className={`${styles.bgContainer} ${variant === 'dark' ? styles.darkBg : ''}`}>
        <div className={`${styles.blob} ${styles.blob1} ${styles[`blob1_${variant}`]}`} />
        <div className={`${styles.blob} ${styles.blob2} ${styles[`blob2_${variant}`]}`} />
        <div className={`${styles.blob} ${styles.blob3} ${styles[`blob3_${variant}`]}`} />
      </div>
      <div ref={contentRef} style={{ position: 'relative', zIndex: 1, opacity: 0, willChange: 'opacity, filter, transform' }}>
        {children}
      </div>
    </div>
  );
}
