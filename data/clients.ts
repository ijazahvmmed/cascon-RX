export interface Client {
  name: string;
  tags: string[];
  region: string;
  image: string | null;
  externalUrl: string | null;
}

export const clients: Client[] = [
  {
    name: 'Vibezon',
    tags: ['shopify', 'ai-media', 'cro'],
    region: 'INDIA',
    image: '/images/work/vibezon.jpg',
    externalUrl: 'https://www.thevibezon.com/',
  },
  {
    name: 'Bagus',
    tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'],
    region: 'INDIA',
    image: '/images/work/bagus.jpg',
    externalUrl: 'https://www.bagus.in/',
  },
  {
    name: 'Car Supply',
    tags: ['shopify', 'ai-media', 'cro', 'seo-aeo'],
    region: 'INDIA',
    image: '/images/work/carsupply.jpg',
    externalUrl: 'https://mycarsupply.shop/',
  },
  {
    name: 'Hanbee',
    tags: ['shopify', 'ai-photography'],
    region: 'INDIA',
    image: '/images/work/hanbee.jpg',
    externalUrl: 'https://myhanbee.myshopify.com/',
  },
  {
    name: 'Reborn Co',
    tags: ['shopify', 'cro'],
    region: 'INDIA',
    image: '/images/work/reborn.jpg',
    externalUrl: 'https://thereborncompany.com/',
  },
  {
    name: 'Rewise',
    tags: ['shopify', 'ai-photography', 'content', 'cro'],
    region: 'INDIA',
    image: '/images/work/rewise.jpg',
    externalUrl: 'https://myrewise.shop/',
  },
  {
    name: 'Pinoy Grocers',
    tags: ['shopify', 'cro'],
    region: 'QATAR',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Mehndi Online',
    tags: ['shopify', 'cro'],
    region: 'INDIA',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Jerso',
    tags: ['shopify', 'cro'],
    region: 'INDIA',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Clipston Elevators',
    tags: ['performance-marketing', 'ai-media'],
    region: 'UAE',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Clipston Engineering',
    tags: ['performance-marketing'],
    region: 'UAE',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Benair HVAC',
    tags: ['performance-marketing', 'content'],
    region: 'UAE',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Pureline Fiberglass',
    tags: ['performance-marketing'],
    region: 'UAE',
    image: null,
    externalUrl: null,
  },
  {
    name: 'Antigravity',
    tags: ['automation'],
    region: 'INDIA',
    image: null,
    externalUrl: null,
  },
];

export const featuredClients = clients.filter((c) => c.image !== null);
