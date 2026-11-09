import Link from 'next/link';
import Icon, { type IconName } from './Icon';
import { formatTag } from '@/lib/tags';
import { serviceHref } from '@/lib/links';

const icons: Record<string, IconName> = {
  shopify: 'shopify', 'ai-photography': 'camera', 'ai-media': 'sparkles', content: 'content',
  cro: 'chart', 'seo-aeo': 'search', 'performance-marketing': 'megaphone',
  automation: 'workflow', 'web-design': 'layout',
};
export default function ServiceTag({ tag }: { tag: string }) {
  return <Link href={serviceHref(tag)} className="service-tag"><Icon name={icons[tag] || 'sparkles'} /><span>{formatTag(tag)}</span></Link>;
}
