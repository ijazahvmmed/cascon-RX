import Image from 'next/image';
import { toolkit } from '@/data/tools';
export default function Toolkit() {
  return <section className="toolkit" aria-labelledby="toolkit-title"><span className="eyebrow" id="toolkit-title">Platforms & tools</span><p>The right tools. Thoughtfully connected.</p>
    <ul className="toolkit-grid">{toolkit.map(tool => <li key={tool.name}><a href={tool.href} target="_blank" rel="noopener noreferrer"><Image src={tool.logo} alt="" width={110} height={32} className={tool.wide ? 'toolkit-logo toolkit-logo--wide' : 'toolkit-logo'} /><span>{tool.name}</span><small>{tool.detail}</small></a></li>)}</ul>
  </section>;
}
