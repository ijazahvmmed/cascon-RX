import Link from 'next/link';
import { commercialServices } from '@/data/commercial-services';
import Icon from './Icon';
export default function ServiceDirectory() {
  return <section className="service-directory" aria-labelledby="service-directory-title"><span className="eyebrow">Find the right scope</span><h2 id="service-directory-title">What does your store need next?</h2><div className="directory-grid">{commercialServices.map(s => <Link href={'/services/' + s.slug} key={s.slug}><h3>{s.name}</h3><p>{s.summary}</p><Icon name="arrow-up-right" /></Link>)}</div></section>;
}
