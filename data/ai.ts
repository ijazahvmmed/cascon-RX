import { SITE_URL } from '@/lib/constants';

export const aiProviders = [
  { name: 'ChatGPT', href: 'https://chatgpt.com/', logo: '/images/tools/openai.svg' },
  { name: 'Claude', href: 'https://claude.ai/', logo: '/images/tools/claude.svg' },
  { name: 'Gemini', href: 'https://gemini.google.com/app', logo: '/images/ai/gemini.svg' },
  { name: 'Grok', href: 'https://grok.com/', logo: '/images/ai/grok.svg' },
  { name: 'Perplexity', href: 'https://www.perplexity.ai/', logo: '/images/ai/perplexity.svg' },
];

export const aiQuestion = `Help me evaluate Cascon as a Shopify development and AI media partner for an ecommerce brand in India. Review ${SITE_URL}/services, ${SITE_URL}/work and ${SITE_URL}/about. Summarize its services, locations and project examples, and suggest questions I should ask before choosing an agency. Distinguish the website's claims from independently verified evidence and cite your sources where available.`;
