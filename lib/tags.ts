export function formatTag(tag: string) {
  return ({ all: 'All work', 'web-design': 'Web design', shopify: 'Shopify', 'ai-media': 'AI media', 'ai-photography': 'AI photography', content: 'Content', cro: 'CRO', 'seo-aeo': 'SEO & AEO', 'performance-marketing': 'Performance marketing', automation: 'Automation' } as Record<string, string>)[tag] || tag;
}
