// Canonicals stay on the business domain; previews must not enter search indexes.
export function isIndexable(env: { SITE_INDEXABLE?: string; NODE_ENV?: string; VERCEL_ENV?: string }) {
  return env.SITE_INDEXABLE !== 'false' && env.NODE_ENV !== 'development' && (!env.VERCEL_ENV || env.VERCEL_ENV === 'production');
}
export const INDEXABLE = isIndexable(process.env);
