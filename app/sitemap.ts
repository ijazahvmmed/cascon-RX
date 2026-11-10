import type { MetadataRoute } from 'next';
import { INDEXABLE } from '@/lib/indexing';
import { getSitemapEntries } from '@/lib/sitemap';
// Native Next.js XML serialization; the build validates the content manifest against real responses.
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { return INDEXABLE ? getSitemapEntries() : []; }
