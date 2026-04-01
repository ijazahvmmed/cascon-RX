import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cascon.systems';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/work`, lastModified },
    { url: `${baseUrl}/services`, lastModified },
    { url: `${baseUrl}/clients`, lastModified },
    { url: `${baseUrl}/careers`, lastModified },
    { url: `${baseUrl}/cascon`, lastModified },
    { url: `${baseUrl}/contact`, lastModified },
    { url: `${baseUrl}/privacy-policy`, lastModified },
  ];
}
