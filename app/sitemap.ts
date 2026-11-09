import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/about', '/work', '/services', '/clients', '/cascon', '/contact', '/privacy-policy'].map(path => ({ url: `${SITE_URL}${path}` }));
}
