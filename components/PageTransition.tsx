'use client';

import { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [pathname]); // Re-run animation when pathname changes

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
