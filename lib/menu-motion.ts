import gsap from 'gsap';

export function animateServiceLink(link: HTMLElement, entering: boolean) {
  const label = link.querySelector('[data-service-label]');
  const icon = link.querySelector('[data-service-icon]');
  const active = entering || link.matches(':focus-visible');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (label) gsap.to(label, { x: reduced ? 0 : active ? 4 : 0, fontWeight: active ? 550 : 300, duration: reduced ? 0 : 0.28, ease: 'power3.out', overwrite: 'auto' });
  if (icon) gsap.to(icon, { y: reduced ? 0 : active ? -1 : 0, scale: reduced ? 1 : active ? 1.04 : 1, duration: reduced ? 0 : 0.32, ease: 'power3.out', overwrite: 'auto' });
}
