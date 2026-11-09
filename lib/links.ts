export function projectId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function serviceHref(tag: string) {
  const sections: Record<string, string> = {
    shopify: 'shopify', cro: 'shopify', 'ai-media': 'ai-media', 'ai-photography': 'ai-media',
    content: 'content-strategy', 'content-strategy': 'content-strategy', 'performance-marketing': 'performance-marketing',
    automation: 'automation', 'seo-aeo': 'seo-aeo',
  };
  return sections[tag] ? `/services#${sections[tag]}` : '/services';
}
