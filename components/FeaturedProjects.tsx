'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { allWorkCards } from '@/data/work';
import { projectHref } from '@/lib/content';
import Icon from './Icon';
const names = ['Bagus', 'Finewares', 'Slept Club', 'Lumy Dates', 'Citysky Builders', 'Vibezon', 'Rewise', 'Hanbee'];
const projects = names.map(name => allWorkCards.find(project => project.name === name)!);
const titles: Record<string, string> = {
Bagus: 'A thoughtfully made store. For thoughtfully made things.',
Finewares: 'Everyday cookware. A considered shopping experience.',
'Slept Club': 'A fresh home for better rest.',
'Lumy Dates': 'A sweet spot for dates and gifting.',
'Citysky Builders': 'A clearer picture of a place to call home.',
Vibezon: 'A new perspective on everyday style.',
Rewise: 'Wellness, with a sharper digital presence.',
Hanbee: 'Little essentials. A world of personality.',
};
export default function FeaturedProjects() {
const track = useRef<HTMLDivElement>(null);
const [current, setCurrent] = useState(0);
const move = (direction: number) => {
const index = (current + direction + projects.length) % projects.length;
track.current?.scrollTo({ left: index * track.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
};
return <section className="feature-section shell featured-projects" aria-label="Projects in focus" aria-roledescription="carousel">
<div ref={track} className="featured-projects__track" tabIndex={0} aria-label="Swipe or use the arrow buttons to browse projects" onScroll={event => { const el = event.currentTarget; setCurrent(Math.round(el.scrollLeft / el.clientWidth)); }}>
{projects.map((project, i) => <article className="feature-panel" key={project.name} aria-roledescription="slide" aria-label={(i + 1) + ' of ' + projects.length + ': ' + project.name}>
<div className="feature-image" data-motion-static><Image src={project.image} alt={project.name + ' website and creative project'} fill sizes="(max-width: 640px) 84vw, 42vw" /></div>
<div className="feature-copy"><span className="eyebrow">In focus / {project.name}</span><h2 data-motion-static>{titles[project.name]}</h2><p data-motion-static>{project.description}</p><Link href={projectHref(project.name)} className="pill-button">Explore the project <Icon name="arrow-up-right" /></Link></div>
</article>)}
</div><div className="featured-projects__controls"><button type="button" onClick={() => move(-1)} aria-label="Previous featured project"><Icon name="arrow-right" /></button><span aria-live="polite" aria-atomic="true">{current + 1} / {projects.length}</span><button type="button" onClick={() => move(1)} aria-label="Next featured project"><Icon name="arrow-right" /></button></div>
</section>;
}
