export interface WorkCard {
  name: string;
  description: string;
  tags: string[];
  image: string;
  externalUrl: string;
}

export interface MoreWorkItem {
  name: string;
  tags: string[];
  region: string;
}

export const workCards: WorkCard[] = [
  {
    name: 'Vibezon',
    description: "Men's fashion brand built on Shopify with AI media and CRO.",
    tags: ['shopify', 'ai-media', 'cro'],
    image: '/images/work/vibezon.jpg',
    externalUrl: 'https://www.thevibezon.com/',
  },
  {
    name: 'Rewise',
    description: 'Wellness brand with AI photography, content, and CRO.',
    tags: ['shopify', 'ai-photography', 'content', 'cro'],
    image: '/images/work/rewise.jpg',
    externalUrl: 'https://myrewise.shop/',
  },
  {
    name: 'Reborn Co',
    description: 'Shopify store build with conversion rate optimization.',
    tags: ['shopify', 'cro'],
    image: '/images/work/reborn.jpg',
    externalUrl: 'https://thereborncompany.com/',
  },
];

export const bagusBreakout: WorkCard = {
  name: 'Bagus',
  description: 'Artisan home decor brand — Shopify, AI photography, content, and SEO.',
  tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'],
  image: '/images/work/bagus.jpg',
  externalUrl: 'https://www.bagus.in/',
};

export const workCards2: WorkCard[] = [
  {
    name: 'Car Supply',
    description: 'Automotive accessories — Shopify, AI media, CRO, and SEO.',
    tags: ['shopify', 'ai-media', 'cro', 'seo-aeo'],
    image: '/images/work/carsupply.jpg',
    externalUrl: 'https://mycarsupply.shop/',
  },
  {
    name: 'Hanbee',
    description: 'Shopify store with AI product photography.',
    tags: ['shopify', 'ai-photography'],
    image: '/images/work/hanbee.jpg',
    externalUrl: 'https://myhanbee.myshopify.com/',
  },
];

export const moreWork: MoreWorkItem[] = [
  { name: 'Pinoy Grocers', tags: ['shopify', 'cro'], region: 'QATAR' },
  { name: 'Mehndi Online', tags: ['shopify', 'cro'], region: 'INDIA' },
  { name: 'Jerso', tags: ['shopify', 'cro'], region: 'INDIA' },
  { name: 'Clipston Elevators', tags: ['performance-marketing', 'ai-media'], region: 'UAE' },
  { name: 'Clipston Engineering', tags: ['performance-marketing'], region: 'UAE' },
  { name: 'Benair HVAC', tags: ['performance-marketing', 'content'], region: 'UAE' },
  { name: 'Pureline Fiberglass', tags: ['performance-marketing'], region: 'UAE' },
  { name: 'Antigravity', tags: ['automation'], region: 'INDIA' },
];
