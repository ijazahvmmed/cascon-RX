'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { testimonials } from '@/data/testimonials';
import MorphButton from './MorphButton';
import styles from './TestimonialSlider.module.css';
import gsap from 'gsap';

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);

  const next = useCallback(() => {
    setActive((currentActive) => {
      setPrev(currentActive);
      return (currentActive + 1) % testimonials.length;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setActive((currentActive) => {
      setPrev(currentActive);
      return (currentActive - 1 + testimonials.length) % testimonials.length;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {});
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ctx.add(() => {
            gsap.fromTo(
              '.slideImageAnim',
              { x: -30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, clearProps: 'all' }
            );
            gsap.fromTo(
              '.slideContentAnim',
              { x: 30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.8, delay: 0.2, clearProps: 'all' }
            );
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  const handleDotClick = (i: number) => {
    if (i !== active) {
      setPrev(active);
      setActive(i);
    }
  };

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.inner}>
        <div 
          className={styles.slider}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {testimonials.map((t, i) => {
            const isPrev = i === prev;
            const isActive = i === active;
            return (
              <div
                key={i}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''} ${
                  isPrev ? styles.slideOutgoing : ''
                }`}
              >
                <div className={`${styles.slideImage} slideImageAnim`}>
                  <Image
                    src={t.image}
                    alt={t.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.image}
                  />
                </div>
                <div className={`${styles.slideContent} slideContentAnim`}>
                  <blockquote className={styles.quote}>{t.quote}</blockquote>
                  <div className={styles.attribution}>
                    <span className={styles.name}>{t.name}</span>
                    <span className={styles.title}>{t.title}</span>
                  </div>
                  <MorphButton href={t.ctaUrl} label={t.cta} external />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.navContainer}>
          <button 
            className={`${styles.arrowBtn} ${styles.mobileArrow}`} 
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button 
            className={`${styles.arrowBtn} ${styles.mobileArrow}`} 
            onClick={next}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
