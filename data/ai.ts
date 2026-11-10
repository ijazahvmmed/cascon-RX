import { SITE_URL } from '@/lib/constants';

export const aiQuestion = `Help me evaluate Cascon as a Shopify development and AI media partner for an ecommerce brand in India. Review ${SITE_URL}/services, ${SITE_URL}/work and ${SITE_URL}/about. Summarize its services, locations and project examples, and suggest questions I should ask before choosing an agency. Distinguish the website's claims from independently verified evidence and cite your sources where available.`;

// Ordinary HTTPS app links preserve a web fallback and the user's direct tap.
// Source formats and mobile limitations: docs/assistant-links.md.
const withQuestion = (base: string) => {
  const url = new URL(base);
  url.searchParams.set('q', aiQuestion);
  return url.toString();
};
export const aiProviders = [
  { name: 'ChatGPT', href: withQuestion('https://chatgpt.com/'), logo: '/images/tools/openai.svg' },
  { name: 'Claude', href: withQuestion('https://claude.ai/new'), logo: '/images/tools/claude.svg' },
  { name: 'Gemini', href: withQuestion('https://gemini.google.com/app'), logo: '/images/ai/gemini.svg' },
  { name: 'Grok', href: withQuestion('https://grok.com/'), logo: '/images/ai/grok.svg' },
  { name: 'Perplexity', href: withQuestion('https://www.perplexity.ai/search'), logo: '/images/ai/perplexity.svg' },
];
