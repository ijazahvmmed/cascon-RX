import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/api/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot', 'Claude-User'], allow: '/', disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
