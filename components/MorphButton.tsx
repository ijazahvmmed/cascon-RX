import Link from 'next/link';
interface Props { href: string; label: string; external?: boolean; size?: 'sm' | 'md' | 'lg'; variant?: 'dark' | 'light' | 'outline'; className?: string }
function Arrow() { return <svg viewBox="0 0 16 12" fill="none"><path d="M1 6h13M9 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
export default function MorphButton({ href, label, external, variant = 'dark', className = '' }: Props) {
  const content = <><span className="action-fill" aria-hidden="true" /><span className="action-label">{label}</span><span className="arrow-dot" aria-hidden="true"><span className="action-arrow"><Arrow /><Arrow /></span></span></>;
  const classes = `text-action ${variant === 'light' ? 'action-light' : ''} ${className}`;
  return external || /^(https?:|mailto:|tel:)/.test(href)
    ? <a href={href} className={classes} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>{content}</a>
    : <Link href={href} className={classes}>{content}</Link>;
}
