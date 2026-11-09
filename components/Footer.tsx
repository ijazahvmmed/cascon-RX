import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { footerColumns, type NavLink } from '@/data/navigation';
import { CONTACT_EMAIL, LOCATIONS, CAL_LINK } from '@/lib/constants';

function FooterLink({ link }: { link: NavLink }) {
  return link.external ? <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{link.label}</a> : <Link href={link.href}>{link.label}</Link>;
}
export default function Footer() {
  return <footer>
    <div className="footer-connect"><div className="shell"><div className="next-links">{[{ href: '/work', label: 'Work' }, { href: '/clients', label: 'Clients' }, { href: '/about', label: 'About us' }].map(link => <Link key={link.href} href={link.href}>{link.label}<span aria-hidden="true">→</span></Link>)}</div><div className="collab-row"><div><h2>Something in mind?</h2><p>Let’s make it happen.</p></div><a href={CAL_LINK} target="_blank" rel="noopener noreferrer" className="pill-button pill-outline">Work with us <span aria-hidden="true">↗</span></a></div></div></div>
    <div className="footer-offices shell"><h2>You made it<br />all the way here.<br />Let’s talk.</h2>{Object.entries(LOCATIONS).map(([key, location]) => <address key={key}><h3>{location.label}</h3><a href={location.mapUrl} target="_blank" rel="noopener noreferrer">{location.address}</a><a href={`tel:${location.phone.replace(/\s/g, '')}`}>{location.phone}</a><Link href={`/contact#${location.label.toLowerCase()}`} className="small-pill">Contact ↗</Link></address>)}</div>
    <div className="footer-base"><div className="footer-signature"><BrandLogo /><span>Shopify. Creative. Connected.<br />Bangalore · Dubai</span></div><div className="footer-columns">{Object.values(footerColumns).map(column => <div key={column.title}><h3>{column.title}<span aria-hidden="true">↗</span></h3><ul>{column.links.map(link => <li key={link.label}><FooterLink link={link} /></li>)}</ul></div>)}</div><div className="footer-bottom"><div><span>New business</span><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></div><div><span>Find us</span><span>Bangalore · Dubai</span></div><Link href="/privacy-policy">Privacy policy</Link><a href="/llms.txt">Information for AI</a><span>© {new Date().getFullYear()} Cascon.<br />All rights reserved.</span></div></div>
  </footer>;
}
