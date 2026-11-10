import Image from 'next/image';
import { toolkit } from '@/data/tools';
export default function Toolkit() {
return <section className="toolkit toolkit-marquee" aria-labelledby="toolkit-title"><div className="toolkit-marquee__intro"><span className="eyebrow">Platforms & tools</span><h2 id="toolkit-title">Big possibilities.<br />Thoughtfully connected.</h2><p>Shopify commerce. AI-assisted creative. Smarter development.<br className="desktop-break" /> We bring the right tools together to move your brand forward.</p></div>
<div className="toolkit-marquee__window" tabIndex={0} aria-label="Platforms and tools, scroll horizontally to explore"><div className="toolkit-marquee__track">{[0, 1].map(copy => <ul className="toolkit-marquee__group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{toolkit.map(tool => <li key={tool.name}><a href={tool.href} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined}><Image src={tool.logo} alt="" width={110} height={32} className={tool.wide ? 'toolkit-logo toolkit-logo--wide' : 'toolkit-logo'} /><span>{tool.name}</span><small>{tool.detail}</small></a></li>)}</ul>)}</div></div>
</section>;
}
