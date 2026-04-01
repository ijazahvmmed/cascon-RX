'use client';

import { useState } from 'react';
import { workCards, bagusBreakout, workCards2, moreWork } from '@/data/work';
import CaseCard from '@/components/CaseCard';
import InteriorHeroBg from '@/components/InteriorHeroBg';
import ScrollReveal from '@/components/ScrollReveal';
import Image from 'next/image';
import styles from './WorkClient.module.css';

const allTags = ['all', 'shopify', 'ai-media', 'ai-photography', 'content', 'cro', 'seo-aeo', 'performance-marketing', 'automation'];

export default function WorkClient() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterCards = (tags: string[]) => {
    if (activeFilter === 'all') return true;
    return tags.includes(activeFilter);
  };

  return (
    <>
      {/* Hero */}
      <InteriorHeroBg variant="purple">
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>We build. We grow.</h1>
          <p className={styles.heroSubline}>
            Selected projects across Shopify, AI media, performance marketing, and more.
          </p>
          <div className={styles.filters}>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.filterBtn} ${activeFilter === tag ? styles.filterActive : ''}`}
                onClick={() => setActiveFilter(tag)}
                aria-pressed={activeFilter === tag}
              >
                {tag === 'all' ? 'All' : tag}
              </button>
            ))}
          </div>
        </div>
      </InteriorHeroBg>

      {/* Work grid row 1 */}
      <section className={styles.workSection}>
        <div className={styles.workInner}>
          <div className={styles.workGrid}>
            {workCards.filter((c) => filterCards(c.tags)).map((card) => (
              <CaseCard
                key={card.name}
                name={card.name}
                description={card.description}
                tags={card.tags}
                image={card.image}
                externalUrl={card.externalUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bagus breakout */}
      {filterCards(bagusBreakout.tags) && (
        <section className={styles.breakout}>
          <div className={styles.breakoutInner}>
            <ScrollReveal>
              <div className={styles.breakoutContent}>
                <h2 className={styles.breakoutTitle}>{bagusBreakout.name}</h2>
                <p className={styles.breakoutDesc}>{bagusBreakout.description}</p>
                <div className={styles.breakoutTags}>
                  {bagusBreakout.tags.map((tag) => (
                    <span key={tag} className={styles.breakoutTag}>{tag}</span>
                  ))}
                </div>
                <a
                  href={bagusBreakout.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.breakoutLink}
                >
                  Visit site →
                </a>
              </div>
            </ScrollReveal>
            <div className={styles.breakoutImage}>
              <Image
                src={bagusBreakout.image}
                alt={`${bagusBreakout.name} — Cascon project`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className={styles.breakoutImg}
              />
            </div>
          </div>
        </section>
      )}

      {/* Work grid row 2 */}
      <section className={styles.workSection}>
        <div className={styles.workInner}>
          <div className={styles.workGrid2}>
            {workCards2.filter((c) => filterCards(c.tags)).map((card) => (
              <CaseCard
                key={card.name}
                name={card.name}
                description={card.description}
                tags={card.tags}
                image={card.image}
                externalUrl={card.externalUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* More work */}
      <section className={styles.moreWork}>
        <div className={styles.moreWorkInner}>
          <ScrollReveal>
            <h2 className={styles.moreWorkTitle}>More work</h2>
          </ScrollReveal>
          <div className={styles.moreWorkGrid}>
            {moreWork.filter((m) => filterCards(m.tags)).map((item) => (
              <ScrollReveal key={item.name}>
                <div className={styles.moreWorkItem}>
                  <h3 className={styles.moreWorkName}>{item.name}</h3>
                  <span className={styles.moreWorkRegion}>{item.region}</span>
                  <div className={styles.moreWorkTags}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.moreWorkTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
