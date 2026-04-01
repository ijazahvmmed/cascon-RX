'use client';

import Link from 'next/link';
import styles from './MorphButton.module.css';

interface MorphButtonProps {
  href: string;
  label: string;
  external?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light' | 'outline';
}

export default function MorphButton({
  href,
  label,
  external = false,
  variant = 'dark',
}: MorphButtonProps) {
  const btnClass = `${styles.morphBtn} ${variant === 'light' ? styles.light : ''}`;
  const inner = (
    <>
      <span className={styles.label}>{label}</span>
      <span className={styles.icon}>→</span>
    </>
  );

  if (external || href.startsWith('http') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className={btnClass}
        data-cursor="Click"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={btnClass} data-cursor="Click">
      {inner}
    </Link>
  );
}
