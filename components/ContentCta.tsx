import MorphButton from './MorphButton';
export default function ContentCta({ title = 'Let’s talk about your next step.' }: { title?: string }) {
  return <section className="content-cta"><div><span className="eyebrow">A clear brief is a good beginning</span><h2>{title}</h2><p>Share your website, the problem you want to solve and the scope you have in mind. We’ll discuss what a useful next step looks like.</p></div><MorphButton href="/contact" label="Discuss your project" /></section>;
}
