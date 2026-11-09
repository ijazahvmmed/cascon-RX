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
    externalUrl: 'https://vibezon.com/',
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
  description: 'Artisan home decor brand featuring custom Shopify build, AI photography, and SEO.',
  tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'],
  image: '/images/work/bagus.jpg',
  externalUrl: 'https://www.bagus.in/',
};

export const workCards2: WorkCard[] = [
  {
    name: 'Car Supply',
    description: 'Automotive accessories store powered by Shopify, AI media, and conversion optimization.',
    tags: ['shopify', 'ai-media', 'cro', 'seo-aeo'],
    image: '/images/work/carsupply.jpg',
    externalUrl: 'https://mycarsupply.shop/',
  },
  {
    name: 'Hanbee',
    description: 'Shopify store with AI product photography.',
    tags: ['shopify', 'ai-photography'],
    image: '/images/work/hanbee.jpg',
    externalUrl: 'https://hanbeekids.in/',
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
];

export const newWorkCards: WorkCard[] = [
  { name: 'Finewares', description: 'Shopify development, AI photography, content and SEO & AEO for a cookware brand.', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], image: '/images/work/finewares.png', externalUrl: 'https://finewares.in/' },
  { name: 'Slept Club', description: 'Shopify, AI photography, content and search foundations for thoughtfully designed sleep essentials.', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], image: '/images/work/slept.png', externalUrl: 'https://wearslept.com/' },
  { name: 'Lumy Dates', description: 'Shopify development, AI photography, content and SEO & AEO for a premium dates and gifting brand.', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], image: '/images/work/lumy.png', externalUrl: 'https://www.lumydates.com/' },
  { name: 'Citysky Builders', description: 'A property website with AI photography and content for a home builder in Kerala.', tags: ['web-design', 'ai-photography', 'content'], image: '/images/work/citysky.webp', externalUrl: 'https://www.cityskyhomes.com/' },
];
export const allWorkCards: WorkCard[] = [...newWorkCards, bagusBreakout, ...workCards, ...workCards2];
