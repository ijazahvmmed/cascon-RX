import Image from 'next/image';
import { aiProviders } from '@/data/ai';
import Icon from './Icon';

export default function AIProviderLinks() {
  return <div className="assistant-providers" aria-label="Choose an AI service">{aiProviders.map(provider => <a key={provider.name} href={provider.href} rel="external noreferrer" data-ai-provider={provider.name} aria-label={'Ask ' + provider.name + ' about Cascon with the prepared question'}><span className="assistant-provider__mark"><Image src={provider.logo} alt="" width={22} height={22} /></span><span>{provider.name}</span><Icon name="arrow-up-right" /></a>)}</div>;
}
