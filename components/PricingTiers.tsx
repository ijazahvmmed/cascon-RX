'use client';
import { useEffect, useState } from 'react';

export interface PriceCurrency { code: string; label: string; note: string; }

const STORAGE_KEY = 'cascon-currency';
const INR_USD: PriceCurrency[] = [
  { code: 'INR', label: '₹ INR', note: 'Prices exclude GST. Billed in Indian rupees.' },
  { code: 'USD', label: '$ USD', note: 'Prices in US dollars for clients outside India, including the UAE.' },
];

// tiers: [name, body, price for currencies[0], price for currencies[1], ...]
// The server render uses currencies[0], so crawlers see the page's market currency.
// With autoDetect, Indian time zones keep INR and everyone else switches to USD.
export default function PricingTiers({ tiers, currencies = INR_USD, autoDetect = true }: { tiers: string[][]; currencies?: PriceCurrency[]; autoDetect?: boolean }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (currencies.length < 2) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const i = currencies.findIndex(c => c.code === saved);
      if (i >= 0) { setIndex(i); return; }
    } catch {}
    if (!autoDetect) return;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const inIndia = zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta';
    const usd = currencies.findIndex(c => c.code === 'USD');
    if (!inIndia && currencies[0].code === 'INR' && usd >= 0) setIndex(usd);
  }, [currencies, autoDetect]);
  const choose = (i: number) => {
    setIndex(i);
    try { localStorage.setItem(STORAGE_KEY, currencies[i].code); } catch {}
  };
  return (
    <div className="pricing-tiers">
      {currencies.length > 1 && (
        <div className="currency-toggle" role="group" aria-label="Show prices in">
          {currencies.map((c, i) => (
            <button key={c.code} type="button" aria-pressed={index === i} onClick={() => choose(i)}>{c.label}</button>
          ))}
        </div>
      )}
      <div className="detail-grid">
        {tiers.map(([name, body, ...prices]) => (
          <section key={name}>
            <h3>{name}</h3>
            <p className="tier-price">{prices[index] ?? prices[0]}</p>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <p className="tier-note">{currencies[index].note}</p>
    </div>
  );
}
