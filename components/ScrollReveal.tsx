import type { ReactNode } from 'react';
export default function ScrollReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; threshold?: number; delay?: number }) {
  return <div className={className} data-reveal-block data-reveal-delay={delay}>{children}</div>;
}
