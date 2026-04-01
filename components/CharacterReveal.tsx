'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CharacterRevealProps {
  text: string;
  className?: string;
}

export default function CharacterReveal({ text, className = '' }: CharacterRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('.charReveal');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Track GSAP context for unmount cleanup
    const ctx = gsap.context(() => {});
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ctx.add(() => {
            gsap.fromTo(
              chars,
              {
                opacity: 0,
                y: 10,
                filter: isMobile ? 'none' : 'blur(12px)',
              },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)', 
                duration: 1.2,
                ease: 'power2.out',
                stagger: 0.02,
                clearProps: isMobile ? '' : 'filter', // remove inline filter so it doesn't linger
              }
            );
          });
          observer.disconnect(); // Disconnect observer after running once
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      ctx.revert(); // Kill GSAP instances
    };
  }, []);

  return (
    <span ref={containerRef} className={className} style={{ display: 'inline' }}>
      {text.split(' ').map((word, wordIdx) => (
        <span key={wordIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIdx) => (
            <span
              key={charIdx}
              className="charReveal"
              style={{
                display: 'inline-block',
                opacity: 0, // prevent FOUC
                willChange: 'opacity, transform, filter'
              }}
            >
              {char}
            </span>
          ))}
          {/* Add a space after the word, unless it's the last word */}
          {wordIdx < text.split(' ').length - 1 && (
            <span style={{ display: 'inline' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
