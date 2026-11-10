import Home from './HomeClient';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, webPageSchema } from '@/lib/seo';
export const metadata = pageMetadata('', 'Shopify Agency in India & AI Media Studio', 'Cascon builds Shopify stores and creates AI media for ecommerce brands in India and the UAE. Explore development, CRO, performance marketing, SEO and AEO.');
export default function HomePage() { return <><Home /><JsonLd data={webPageSchema('', 'Cascon — Shopify agency and AI media studio', 'Shopify development, conversion rate optimization and AI product media for ecommerce brands in India and the UAE.')} /></>; }
