'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
}

export default function ScrollReveal({ children, className = '', threshold = 0.1, delay }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.revealVisible);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${styles.revealHidden} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
