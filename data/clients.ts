export interface Client {
  name: string; tags: string[]; region: string; image: string | null; externalUrl: string | null; logoKey?: string;
}
export const clients: Client[] = [
  { name: 'Finewares', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], region: 'INDIA', image: '/images/work/finewares.png', externalUrl: 'https://finewares.in/', logoKey: 'finewares' },
  { name: 'Slept Club', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], region: 'INDIA', image: '/images/work/slept.png', externalUrl: 'https://wearslept.com/', logoKey: 'slept' },
  { name: 'Lumy Dates', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], region: 'UAE', image: '/images/work/lumy.png', externalUrl: 'https://www.lumydates.com/', logoKey: 'lumy' },
  { name: 'Citysky Builders', tags: ['web-design', 'ai-photography', 'content'], region: 'INDIA', image: '/images/work/citysky.webp', externalUrl: 'https://www.cityskyhomes.com/', logoKey: 'citysky' },
  { name: 'Vibezon', tags: ['shopify', 'ai-media', 'cro'], region: 'INDIA', image: '/images/work/vibezon.jpg', externalUrl: 'https://vibezon.com/', logoKey: 'vibezon' },
  { name: 'Bagus', tags: ['shopify', 'ai-photography', 'content', 'seo-aeo'], region: 'INDIA', image: '/images/work/bagus.jpg', externalUrl: 'https://www.bagus.in/', logoKey: 'bagus' },
  { name: 'Car Supply', tags: ['shopify', 'ai-media', 'cro', 'seo-aeo'], region: 'INDIA', image: '/images/work/carsupply.jpg', externalUrl: 'https://mycarsupply.shop/', logoKey: 'carsupply' },
  { name: 'Hanbee', tags: ['shopify', 'ai-photography'], region: 'INDIA', image: '/images/work/hanbee.jpg', externalUrl: 'https://hanbeekids.in/', logoKey: 'hanbee' },
  { name: 'Reborn Co', tags: ['shopify', 'cro'], region: 'INDIA', image: '/images/work/reborn.jpg', externalUrl: 'https://thereborncompany.com/', logoKey: 'reborn' },
  { name: 'Rewise', tags: ['shopify', 'ai-photography', 'content', 'cro'], region: 'INDIA', image: '/images/work/rewise.jpg', externalUrl: 'https://myrewise.shop/', logoKey: 'rewise' },
  { name: 'Pinoy Grocers', tags: ['shopify', 'cro'], region: 'QATAR', image: null, externalUrl: null },
  { name: 'Mehndi Online', tags: ['shopify', 'cro'], region: 'INDIA', image: null, externalUrl: null },
  { name: 'Jerso', tags: ['shopify', 'cro'], region: 'INDIA', image: null, externalUrl: 'https://jerso.in/', logoKey: 'jerso' },
  { name: 'Clipston Elevators', tags: ['performance-marketing', 'ai-media'], region: 'UAE', image: null, externalUrl: 'https://clipstonelevator.com/', logoKey: 'clipston' },
  { name: 'Clipston Engineering', tags: ['performance-marketing'], region: 'UAE', image: null, externalUrl: null },
  { name: 'Benair HVAC', tags: ['performance-marketing', 'content'], region: 'UAE', image: null, externalUrl: 'https://www.benairgroup.com/', logoKey: 'benair' },
  { name: 'Pureline Fiberglass', tags: ['performance-marketing'], region: 'UAE', image: null, externalUrl: 'https://www.purelinefiberglass.com/', logoKey: 'pureline' },
];
export const featuredClients = clients.filter(c => c.image !== null);
