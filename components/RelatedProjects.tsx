import { projectHref } from '@/lib/content';
import Link from 'next/link';
import { allWorkCards, moreWork } from '@/data/work';
export default function RelatedProjects({ service }: { service: string }) {
  const tag = service === 'content-strategy' ? 'content' : service;
  const related = [...allWorkCards, ...moreWork].filter(project => project.tags.includes(tag) || (tag === 'ai-media' && project.tags.includes('ai-photography'))).slice(0, 3);
  return <div className="related-projects"><span>Explore related work</span>{related.length ? related.map(project => <Link key={project.name} href={projectHref(project.name)}>{project.name}</Link>) : <Link href="/work">Browse our projects</Link>}</div>;
}
