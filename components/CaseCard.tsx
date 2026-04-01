'use client';

import Image from 'next/image';
import styles from './CaseCard.module.css';

interface CaseCardProps {
  name: string;
  description?: string;
  tags: string[];
  image: string;
  externalUrl: string;
}

export default function CaseCard({ name, description, tags, image, externalUrl }: CaseCardProps) {
  return (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      data-cursor="View"
      data-tags={tags.join(',')}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={image}
          alt={`${name} — Cascon project`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
