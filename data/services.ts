export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  included: string[];
}

export const services: Service[] = [
  {
    id: 'shopify',
    name: 'Shopify Development',
    description:
      'Custom Shopify stores built for conversion. We handle everything from theme development to checkout optimization, migration, and ongoing support.',
    image: '/images/services/shopify-cro.webp',
    included: [
      'Custom theme development',
      'Store setup & configuration',
      'Checkout optimization',
      'Platform migration',
      'App integration',
      'Speed optimization',
      'Ongoing maintenance',
      'CRO audits',
    ],
  },
  {
    id: 'ai-media',
    name: 'AI Media Production',
    description:
      'Product photography, lifestyle shoots, and video content created with AI tools. Studio-quality output delivered in days, not weeks — at a fraction of the cost.',
    image: '/horizontal.mp4',
    included: [
      'AI product photography',
      'Lifestyle scene generation',
      'Model photography',
      'Video content',
      'Social media assets',
      'Brand consistency',
      'Rapid iteration',
      'Print-ready output',
    ],
  },
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    description:
      'Paid media campaigns across Meta, Google, and TikTok — built around your unit economics, not vanity metrics. We optimize for revenue, not impressions.',
    image: '/images/services/performance-marketing.webp',
    included: [
      'Meta Ads management',
      'Google Ads management',
      'TikTok Ads',
      'Campaign strategy',
      'Creative production',
      'Audience targeting',
      'Conversion tracking',
      'Monthly reporting',
    ],
  },
  {
    id: 'automation',
    name: 'Automation',
    description:
      'Workflow automation for ecommerce operations. From inventory syncing to customer comms — we reduce manual work so your team can focus on growth.',
    image: '/images/services/automation.webp',
    included: [
      'Email automation (Klaviyo)',
      'Inventory management',
      'Order processing',
      'Customer segmentation',
      'Abandoned cart flows',
      'Review collection',
      'Reporting dashboards',
      'Custom integrations',
    ],
  },
  {
    id: 'seo-aeo',
    name: 'SEO & AEO',
    description:
      'Search engine optimization and AI engine optimization. We help brands rank on Google and get cited by AI tools like ChatGPT and Perplexity.',
    image: '/videos/seo.mp4',
    included: [
      'Technical SEO audits',
      'On-page optimization',
      'Content strategy',
      'Link building',
      'Local SEO',
      'AI engine optimization',
      'Schema markup',
      'Performance tracking',
    ],
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    description:
      'Content planning and production for brands that want to build organic authority. Blog content, landing pages, email copy, and social media — all aligned to your growth goals.',
    image: '/horizontal.mp4',
    included: [
      'Content audits',
      'Editorial calendars',
      'Blog writing',
      'Landing page copy',
      'Email sequences',
      'Social media copy',
      'Brand voice guidelines',
      'Content performance tracking',
    ],
  },
];
