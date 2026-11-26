export interface WorkCard {
  slug: string;
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
    slug: 'vibezon', name: 'Vibezon',
    description: "Men's fashion brand built on Shopify with AI media and CRO.",
    tags: ['shopify', 'ai-media', 'cro'],
    image: '/images/work/vibezon.jpg',
    externalUrl: 'https://vibezon.com/',
  },
  {
    slug: 'rewise', name: 'Rewise',
    description: 'Wellness brand with AI photography, content, and CRO.',
    tags: ['shopify', 'ai-photography', 'content', 'cro'],
    image: '/images/work/rewise.jpg',
    externalUrl: 'https://myrewise.shop/',
  },
  {
    slug: 'reborn-co', name: 'Reborn Co',
    description: 'Shopify store build with conversion rate optimization.',
    tags: ['shopify', 'cro'],
    image: '/images/work/reborn.jpg',
    externalUrl: 'https://thereborncompany.com/',
  },
];

export const bagusBreakout: WorkCard = {
  slug: 'bagus', name: 'Bagus',
  description: 'WooCommerce to Shopify migration for an artisan home decor brand.',
  tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'],
  image: '/images/work/bagus.jpg',
  externalUrl: 'https://www.bagus.in/',
};

export const workCards2: WorkCard[] = [
  {
    slug: 'car-supply', name: 'Car Supply',
    description: 'Automotive accessories store powered by Shopify, AI media, and conversion optimization.',
    tags: ['shopify', 'ai-media', 'cro', 'seo-aeo'],
    image: '/images/work/carsupply.jpg',
    externalUrl: 'https://mycarsupply.shop/',
  },
  {
    slug: 'hanbee', name: 'Hanbee',
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
  { slug: 'bekid', name: 'Bekid', description: 'An immersive 3D showroom inside a custom Shopify storefront for kidswear.', tags: ['shopify', 'web-design'], image: '/images/work/bekid-showroom.jpg', externalUrl: 'https://www.bekid.store/' },
  { slug: 'finewares', name: 'Finewares', description: 'Shopify development, AI photography, content and SEO & AEO for a cookware brand.', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], image: '/images/work/finewares.png', externalUrl: 'https://finewares.in/' },
  { slug: 'slept-club', name: 'WearSlept', description: 'Custom Shopify storefront for sleep accessories, launched in under seven days.', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], image: '/images/work/slept.png', externalUrl: 'https://wearslept.com/' },
  { slug: 'lumy-dates', name: 'Lumy Dates', description: 'Shopify development, AI photography, content and SEO & AEO for a premium dates and gifting brand.', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], image: '/images/work/lumy.png', externalUrl: 'https://www.lumydates.com/' },
  { slug: 'citysky-builders', name: 'Citysky Builders', description: 'A property website with AI photography and content for a home builder in Kerala.', tags: ['web-design', 'ai-photography', 'content'], image: '/images/work/citysky.webp', externalUrl: 'https://www.cityskyhomes.com/' },
];
export const allWorkCards: WorkCard[] = [...newWorkCards, bagusBreakout, ...workCards, ...workCards2];
