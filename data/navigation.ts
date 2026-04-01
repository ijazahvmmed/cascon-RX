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
  { href: '/careers', label: 'Careers' },
  { href: '/cascon', label: 'Cascon & Co.' },
];

export const footerColumns = {
  company: {
    title: 'Company',
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/careers', label: 'Careers' },
      { href: 'https://cal.com/cascon-haw2fz/15min', label: 'Contact', external: true },
    ] as NavLink[],
  },
  work: {
    title: 'Work',
    links: [
      { href: 'https://www.thevibezon.com/', label: 'Vibezon', external: true },
      { href: 'https://myrewise.shop/', label: 'Rewise', external: true },
      { href: 'https://www.bagus.in/', label: 'Bagus', external: true },
      { href: 'https://mycarsupply.shop/', label: 'Car Supply', external: true },
      { href: 'https://thereborncompany.com/', label: 'Reborn Co', external: true },
      { href: 'https://myhanbee.myshopify.com/', label: 'Hanbee', external: true },
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
      { href: '/cascon#freelancers', label: 'For freelancers' },
      { href: 'mailto:hello@wecascon.com', label: 'hello@wecascon.com', external: true },
    ] as NavLink[],
  },
  social: {
    title: 'Social',
    links: [
      { href: 'https://www.instagram.com/wearecascon', label: 'Instagram', external: true },
    ] as NavLink[],
  },
};
