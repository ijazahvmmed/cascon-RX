import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { SITE_URL } from './constants';
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
 const manifest = JSON.parse(await readFile(path.join(process.cwd(),'data/sitemap-manifest.json'),'utf8')) as { version: number; origin: string; entries: {path:string;lastModified:string}[] };
 if(manifest.version!==1 || manifest.origin!==SITE_URL) throw new Error('Sitemap manifest domain/version mismatch; run npm run build.');
 return manifest.entries.map(entry=>({url:SITE_URL+entry.path,lastModified:entry.lastModified}));
}
