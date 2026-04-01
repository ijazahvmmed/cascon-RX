import type { Metadata } from 'next';
import MorphButton from '@/components/MorphButton';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.blobs} />
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>
          This page doesn&apos;t exist. Probably a good thing.
        </p>
        <MorphButton href="/" label="Go back home" />
        <p className={styles.small}>
          Or email us:{' '}
          <a href="mailto:hello@wecascon.com" className={styles.emailLink}>
            hello@wecascon.com
          </a>
        </p>
      </div>
    </div>
  );
}
