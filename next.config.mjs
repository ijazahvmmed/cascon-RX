import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const preview = process.env.SITE_INDEXABLE === 'false' || process.env.NODE_ENV === 'development' || (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
    return preview ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }] : [];
  },
  outputFileTracingIncludes: { '/sitemap.xml': ['./data/sitemap-manifest.json'] },
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};
export default nextConfig;
