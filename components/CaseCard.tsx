import Image from 'next/image';
import { projectId } from '@/lib/links';
import Icon from './Icon';
import ServiceTag from './ServiceTag';

export default function CaseCard({ name, description, tags, image, externalUrl }: { name: string; description?: string; tags: string[]; image: string; externalUrl: string }) {
  return <article className="case-card" id={projectId(name)}>
    <a href={externalUrl} target="_blank" rel="noopener noreferrer" data-project={name} className="case-project-link">
      <div className="case-image"><Image src={image} alt={`${name} website project in Cascon’s portfolio`} fill sizes="(max-width: 640px) 92vw, (max-width: 960px) 46vw, 43vw" /><span className="case-open"><Icon name="arrow-up-right" /></span></div>
      <div className="case-info"><h3>{name}</h3>{description && <p>{description}</p>}</div>
    </a>
    <ul className="case-tags" aria-label={`Explore services for ${name}`}>{tags.map(tag => <li key={tag}><ServiceTag tag={tag} /></li>)}</ul>
  </article>;
}
