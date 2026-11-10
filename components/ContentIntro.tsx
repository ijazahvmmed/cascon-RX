import Breadcrumbs, { type Crumb } from './Breadcrumbs';
export default function ContentIntro({ title, description, label, crumbs }: { title: string; description: string; label: string; crumbs: Crumb[] }) {
  return <header className="page-intro content-intro shell"><Breadcrumbs items={crumbs} /><span className="eyebrow">{label}</span><h1>{title}</h1><p>{description}</p></header>;
}
