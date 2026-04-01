'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      cursor.style.display = 'none';
      return;
    }

    const lerp = 0.15;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        cursor.style.opacity = '1';
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor]')) {
        cursor.classList.add(styles.hasText);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor]')) {
        cursor.classList.remove(styles.hasText);
      }
    };

    const animate = () => {
      // smooth following
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;
      // offset by 6px to center
      cursor.style.transform = `translate(${posRef.current.x - 6}px, ${posRef.current.y - 6}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor}>
      <div className={styles.cursorInner} />
    </div>
  );
}
