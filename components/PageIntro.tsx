import ScrollReveal from './ScrollReveal';
import JsonLd from './JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export default function PageIntro({ label, title, description, path }: { label: string; title: React.ReactNode; description: string; path: string }) {
  return <header className="page-intro shell"><ScrollReveal><span className="eyebrow">{label}</span><h1>{title}</h1><p>{description}</p></ScrollReveal><JsonLd data={breadcrumbSchema(label, path)} /></header>;
}
