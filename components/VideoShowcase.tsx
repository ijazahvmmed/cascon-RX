'use client';
import { useEffect, useRef, useState } from 'react';
import { studioFilms } from '@/data/studio-films';
import MorphButton from './MorphButton';

const wrap = (value: number, length: number) => ((value % length) + length) % length;

export default function VideoShowcase() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const root = section.current, viewport = rail.current, strip = track.current;
    if (!root || !viewport || !strip) return;
    const cards = Array.from(strip.children) as HTMLLIElement[];
    const videos = Array.from(strip.querySelectorAll('video'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let staticLayout = reduced.matches || Boolean(connection?.saveData);
    let width = 0, cardWidth = 0, stride = 0, length = 0, radius = 0, offset = 0;
    let frame = 0, previousTime = 0, inView = false, focused = false, stopped = false, disposed = false;
    const concealed = cards.map(() => false);
    const visibleVideos = new Set<HTMLVideoElement>();
    const queued = new Set<HTMLVideoElement>();
    const starting = new Set<HTMLVideoElement>();
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let playbackTimer: ReturnType<typeof setTimeout> | undefined;

    const shouldPlay = (video: HTMLVideoElement) => !disposed && !staticLayout && !document.hidden && inView && visibleVideos.has(video);
    // Stagger decoder startup while keeping only onscreen portfolio films active.
    const drain = () => {
      if (playbackTimer) timers.delete(playbackTimer);
      playbackTimer = undefined;
      const video = queued.values().next().value as HTMLVideoElement | undefined;
      if (!video) return;
      queued.delete(video);
      if (shouldPlay(video) && video.paused) {
        video.muted = true;
        starting.add(video);
        void video.play().catch(() => {}).finally(() => {
          starting.delete(video);
          if (!shouldPlay(video)) video.pause();
        });
      }
      if (queued.size) {
        playbackTimer = setTimeout(drain, 100);
        timers.add(playbackTimer);
      }
    };
    const requestPlay = (video: HTMLVideoElement) => {
      if (!shouldPlay(video) || !video.paused || starting.has(video)) return;
      queued.add(video);
      if (!playbackTimer) { playbackTimer = setTimeout(drain, 60); timers.add(playbackTimer); }
    };
    const pauseVideos = () => { queued.clear(); videos.forEach(video => video.pause()); };
    const measure = () => {
      const gap = parseFloat(getComputedStyle(strip).columnGap) || 0;
      cardWidth = cards[0].offsetWidth;
      stride = cardWidth + gap;
      const nextLength = stride * cards.length;
      if (length) offset = offset / length * nextLength;
      length = nextLength;
      width = viewport.clientWidth;
      radius = Math.max(width / 2 * 1.1, 2.2 * cardWidth);
      strip.style.perspective = Math.round(radius * 1.35) + 'px';
      strip.style.perspectiveOrigin = width / 2 + 'px 50%';
      cards.forEach(card => { card.style.visibility = ''; });
      concealed.fill(false);
    };
    // Map every moving card onto the same cylinder. Perspective creates the
    // continuous bend; wrapping happens beyond either visible edge.
    const draw = () => {
      const center = width / 2;
      cards.forEach((card, index) => {
        const naturalX = index * stride;
        const angle = (wrap(naturalX - offset + 1.5 * stride, length) - 1.5 * stride + cardWidth / 2 - center) / radius;
        if (Math.abs(angle) > 1.3) {
          if (!concealed[index]) {
            concealed[index] = true;
            card.style.visibility = 'hidden';
            card.style.transform = 'translate3d(' + (2 * width - naturalX).toFixed(0) + 'px,0,0)';
          }
          return;
        }
        const x = center + radius * Math.sin(angle) - cardWidth / 2;
        const z = radius * (1 - Math.cos(angle));
        if (concealed[index]) { concealed[index] = false; card.style.visibility = ''; }
        card.style.transform = 'translate3d(' + (x - naturalX).toFixed(2) + 'px,0,' + z.toFixed(2) + 'px) rotateY(' + (-angle).toFixed(4) + 'rad)';
      });
    };
    const tick = (time: number) => {
      const delta = previousTime ? Math.min(time - previousTime, 100) / 1000 : 0;
      previousTime = time;
      offset = wrap(offset + stride / 4.5 * delta, length);
      draw();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
    const resume = () => {
      if (!frame && inView && !staticLayout && !document.hidden && !focused && !stopped) frame = requestAnimationFrame(tick);
    };
    const clearGeometry = () => {
      cards.forEach(card => { card.style.transform = ''; card.style.visibility = ''; });
      concealed.fill(false);
      strip.style.perspective = '';
      strip.style.perspectiveOrigin = '';
    };
    const preferences = () => {
      staticLayout = reduced.matches || Boolean(connection?.saveData);
      setStaticMode(staticLayout);
      stop();
      pauseVideos();
      if (staticLayout) clearGeometry();
      else { viewport.scrollLeft = 0; measure(); draw(); resume(); visibleVideos.forEach(requestPlay); }
    };
    preferences();
    const resize = new ResizeObserver(() => { if (!staticLayout) { measure(); draw(); } });
    resize.observe(viewport);
    const sectionObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView) { resume(); visibleVideos.forEach(requestPlay); }
      else { stop(); pauseVideos(); }
    });
    sectionObserver.observe(root);
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) { visibleVideos.add(video); requestPlay(video); }
        else { visibleVideos.delete(video); queued.delete(video); video.pause(); }
      });
    }, { threshold: 0 });
    videos.forEach(video => videoObserver.observe(video));
    const ready = (event: Event) => { (event.currentTarget as HTMLVideoElement).dataset.ready = ''; };
    videos.forEach(video => video.addEventListener('playing', ready));
    const visibility = () => {
      if (document.hidden) { stop(); pauseVideos(); }
      else { resume(); visibleVideos.forEach(requestPlay); }
    };
    const focus = () => { focused = true; stop(); };
    const blur = (event: FocusEvent) => { if (!viewport.contains(event.relatedTarget as Node)) { focused = false; resume(); } };
    const key = (event: KeyboardEvent) => {
      if (staticLayout || event.target !== viewport) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        offset = wrap(offset + (event.key === 'ArrowRight' ? stride : -stride), length);
        draw();
      } else if (event.code === 'Space') {
        event.preventDefault(); stopped = !stopped;
        if (stopped) stop(); else { focused = false; resume(); }
      }
    };
    viewport.addEventListener('focusin', focus);
    viewport.addEventListener('focusout', blur);
    viewport.addEventListener('keydown', key);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', preferences);
    connection?.addEventListener('change', preferences);
    return () => {
      disposed = true; stop(); pauseVideos(); timers.forEach(clearTimeout);
      resize.disconnect(); sectionObserver.disconnect(); videoObserver.disconnect(); clearGeometry();
      videos.forEach(video => video.removeEventListener('playing', ready));
      viewport.removeEventListener('focusin', focus); viewport.removeEventListener('focusout', blur); viewport.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', preferences); connection?.removeEventListener('change', preferences);
    };
  }, []);

  return <section ref={section} className="video-showcase" aria-labelledby="studio-title" data-static={staticMode || undefined}>
    <div className="video-showcase__intro shell"><span className="studio-badge"><i aria-hidden="true" /> AI video studio</span><h2 id="studio-title">Studio-grade video, made with AI.<br />Delivered in days, not weeks.</h2><p>Product films, fashion lookbooks and social-first content, generated and art-directed by our AI media team for brands that need to look premium at speed.</p></div>
    <p id="studio-keyboard-help" className="sr-only">Focus the reel to stop its movement. Use the left and right arrow keys to browse, or Space to stop or resume the reel.</p>
    <div ref={rail} className="video-showcase__rail" tabIndex={0} role="group" aria-label="AI video portfolio" aria-describedby="studio-keyboard-help">
      <ul ref={track} className="video-showcase__track">{studioFilms.map(film => <li className="video-showcase__card" key={film.id}><div className="video-showcase__media" style={{ backgroundImage: 'url(' + film.poster + ')' }}><video src={film.src} poster={film.poster} preload="none" muted playsInline loop disablePictureInPicture controls={staticMode} tabIndex={staticMode ? 0 : -1} aria-label={film.category + ': ' + film.title} /></div></li>)}</ul>
    </div>
    <div className="center-action"><MorphButton href="/services/ai-video-production" label="Explore AI media" /></div>
  </section>;
}
