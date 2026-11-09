export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const mainNavLinks: NavLink[] = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/clients', label: 'Clients' },
  { href: '/about', label: 'About' },
  { href: '/cascon', label: 'Cascon & Co.' },
];

export const footerColumns = {
  company: {
    title: 'Company',
    links: [
      { href: '/', label: 'Home' },
      { href: '/#faq', label: 'FAQs' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ] as NavLink[],
  },
  work: {
    title: 'Work',
    links: [
      { href: '/work#finewares', label: 'Finewares' },
      { href: '/work#slept-club', label: 'Slept Club' },
      { href: '/work#lumy-dates', label: 'Lumy Dates' },
      { href: '/work#citysky-builders', label: 'Citysky Builders' },
      { href: '/work#bagus', label: 'Bagus' },
      { href: '/work', label: 'All projects' },
    ] as NavLink[],
  },
  clients: {
    title: 'Clients',
    links: [
      { href: '/clients#established-brands', label: 'Established brands' },
      { href: '/clients#growing-brands', label: 'Growing brands' },
      { href: '/clients#new-brands', label: 'New brands' },
      { href: '/clients', label: 'All clients' },
    ] as NavLink[],
  },
  services: {
    title: 'Services',
    links: [
      { href: '/services#collaboration-models', label: 'Collaboration models' },
      { href: '/services#shopify', label: 'Shopify' },
      { href: '/services#ai-media', label: 'AI Media' },
      { href: '/services#performance-marketing', label: 'Performance Marketing' },
      { href: '/services#automation', label: 'Automation' },
      { href: '/services#seo-aeo', label: 'SEO & AEO' },
      { href: '/services#content-strategy', label: 'Content Strategy' },
    ] as NavLink[],
  },
  cascon: {
    title: 'Cascon & Co.',
    links: [
      { href: '/cascon#companies', label: 'For companies' },
      { href: 'mailto:info@cascondigital.com', label: 'info@cascondigital.com', external: true },
    ] as NavLink[],
  },
  social: {
    title: 'Social',
    links: [
      { href: 'https://www.instagram.com/wearecascon', label: 'Instagram', external: true },
    ] as NavLink[],
  },
};
