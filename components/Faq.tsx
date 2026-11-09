import { faqs } from '@/data/faqs';
import JsonLd from './JsonLd';
import AskAI from './AskAI';
import Link from 'next/link';

export default function Faq() {
  return <section id="faq" className="faq-section shell section-space" aria-labelledby="faq-title">
    <div className="faq-heading"><h2 id="faq-title">Questions that help you choose.</h2><AskAI /></div>
    <div className="faq-list">{faqs.map(({ question, answer }) => <details className="faq-item" key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    <p className="faq-next">Still deciding? <Link href="/services">Explore our services</Link>, <Link href="/work">see our work</Link> or <Link href="/contact">tell us about your project</Link>.</p>
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) }} />
  </section>;
}
