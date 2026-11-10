import { projectHref } from '@/lib/content';
import Link from 'next/link';
import Icon from './Icon';
import { getImageProps } from 'next/image';
import { clients } from '@/data/clients';
import { clientLogos } from '@/data/client-logos';

export default function ClientLogoGrid() {
  return <ul className="client-logo-grid">{clients.map(client => {
    const logo = client.logoKey ? clientLogos[client.logoKey] : undefined;
    const imageSrc = logo ? getImageProps({ src: logo.src, alt: client.name, width: 200, height: 90 }).props.src : undefined;
    return <li key={client.name}><Link href={projectHref(client.name)} aria-label={`${client.name} — view our work`}>
      {logo ? <svg viewBox={logo.viewBox} className={`client-logo-image ${client.logoKey === 'hanbee' ? 'client-logo-image--original' : client.logoKey === 'clipston' ? 'client-logo-image--clipston' : logo.transparent ? 'client-logo-image--transparent' : ''}`} role="img" aria-label={`${client.name} logo`}><image href={imageSrc} width={logo.width} height={logo.height} /></svg> : <span className="client-logo-fallback">{client.name}</span>}
    </Link></li>;
  })}<li className="client-logo-cta"><Link href="/contact"><span>Your brand next?</span><Icon name="arrow-up-right" /></Link></li></ul>;
}
