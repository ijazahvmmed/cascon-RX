export default function BrandLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return <span className={`brand-logo ${className}`} aria-hidden="true">
    <svg className="brand-logo__symbol" viewBox="880 790 710 890" focusable="false"><image href={light ? '/cascon-white.png' : '/cascon-black.png'} width="2464" height="2464" /></svg>
    <span className="brand-logo__name">cascon<span>.</span></span>
  </span>;
}
