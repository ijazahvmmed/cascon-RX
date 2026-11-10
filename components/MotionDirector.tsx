'use client';
import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create('cascon-reveal', '0.22,1,0.36,1');

export default function MotionDirector() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    let disposed = false;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const splits: SplitText[] = [];
      const ctx = gsap.context(() => {
        // SplitText preserves emphasis and reflows its masks when the font or viewport changes.
        document.querySelectorAll<HTMLElement>('main h1, main h2:not(.eyebrow, .sr-only), footer h2').forEach(heading => {
          if (heading.closest('.legal-page, .not-found, [data-motion-static]')) return;
          const accessibleText = heading.innerText.replace(/\s+/g, ' ').trim();
          const split = SplitText.create(heading, {
            type: 'lines,words', mask: 'lines', linesClass: 'reveal-line',
            wordsClass: 'reveal-word', autoSplit: true, deepSlice: true, aria: 'auto',
            onSplit: self => {
              // Keep explicit line breaks readable in the accessible heading name.
              heading.setAttribute('aria-label', accessibleText);
              return gsap.fromTo(self.words,
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.76, stagger: { amount: 0.2 }, ease: 'cascon-reveal',
                scrollTrigger: { trigger: heading, start: 'top 90%', once: true, fastScrollEnd: true },
              });
            },
          });
          splits.push(split);
        });

        gsap.utils.toArray<HTMLElement>('main .case-image, main .wide-image, main .service-visual, main .feature-image').forEach((image, i) => {
          if (image.hasAttribute('data-motion-static')) return;
          gsap.fromTo(image, { clipPath: 'inset(0% 0% 18% 0%)', opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.76,
              delay: image.closest('.case-grid') ? (i % (innerWidth >= 980 ? 3 : 1)) * 0.055 : 0,
              ease: 'cascon-reveal', clearProps: 'clipPath,opacity',
              scrollTrigger: { trigger: image, start: 'top 94%', once: true, fastScrollEnd: true },
            });
        });
        gsap.utils.toArray<HTMLElement>('.hero-locations, .page-intro p, .contact-hero > p, .editorial-row p, .home-services p, .feature-copy p, [data-reveal-block] > .text-action').forEach(element => {
          if (element.hasAttribute('data-motion-static')) return;
          gsap.fromTo(element, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: element.classList.contains('hero-locations') ? 0.25 : 0.08, ease: 'cascon-reveal', clearProps: 'transform,opacity', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
        const hero = document.querySelector('.home-hero');
        if (hero) gsap.to(hero.querySelectorAll('.hero-poster, .hero-video'), { yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      });
      document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
      return () => { ctx.revert(); splits.forEach(split => split.revert()); };
    });
    return () => { disposed = true; media.revert(); };
  }, [pathname]);
  return null;
}
