'use client';

import { useEffect, useRef, useState } from 'react';

export default function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const setup = () => { setEnabled(!motion.matches && !connection?.saveData); setPlaying(false); };
    setup(); motion.addEventListener('change', setup);
    return () => motion.removeEventListener('change', setup);
  }, []);
  useEffect(() => {
    if (!enabled || !video.current) return;
    const el = video.current;
    if (!el.getAttribute('src')) el.src = window.matchMedia('(max-width: 640px)').matches ? '/vertical.mp4' : '/horizontal.mp4';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) void el.play().catch(() => {});
      else el.pause();
    });
    observer.observe(el);
    const visibility = () => { if (document.hidden) el.pause(); else if (window.scrollY < window.innerHeight) void el.play().catch(() => {}); };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); el.pause(); };
  }, [enabled]);
  return <>
    <picture className="hero-poster"><source media="(max-width: 640px)" srcSet="/images/hero/Ver_image.webp" />{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/hero/Hor_image.webp" alt="Creative product imagery by Cascon's AI media studio" fetchPriority="high" /></picture>
    {enabled && <video ref={video} className={`hero-video ${playing ? 'is-playing' : ''}`} muted loop playsInline preload="metadata" aria-hidden="true" onPlaying={() => setPlaying(true)} />}
  </>;
}
