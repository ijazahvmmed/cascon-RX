'use client';
import { useEffect, useState } from 'react';

type Currency = 'INR' | 'USD';
const STORAGE_KEY = 'cascon-currency';

// Indian visitors see rupees; everyone else sees dollars. The server render is INR,
// so crawlers indexing the India-market page get rupee prices in the HTML.
function detectCurrency(): Currency {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'INR' || saved === 'USD') return saved;
  } catch {}
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  return zone === 'Asia/Kolkata' || zone === 'Asia/Calcutta' ? 'INR' : 'USD';
}

export default function PricingTiers({ tiers }: { tiers: string[][] }) {
  const [currency, setCurrency] = useState<Currency>('INR');
  useEffect(() => { setCurrency(detectCurrency()); }, []);
  const choose = (c: Currency) => {
    setCurrency(c);
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
  };
  return (
    <div className="pricing-tiers">
      <div className="currency-toggle" role="group" aria-label="Show prices in">
        {(['INR', 'USD'] as Currency[]).map(c => (
          <button key={c} type="button" aria-pressed={currency === c} onClick={() => choose(c)}>
            {c === 'INR' ? '₹ INR' : '$ USD'}
          </button>
        ))}
      </div>
      <div className="detail-grid">
        {tiers.map(([name, body, inr, usd]) => (
          <section key={name}>
            <h3>{name}</h3>
            <p className="tier-price">{currency === 'INR' ? inr : usd}</p>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <p className="tier-note">
        {currency === 'INR'
          ? 'Prices exclude GST. Billed in Indian rupees.'
          : 'Prices in US dollars for clients outside India, including the UAE.'}
      </p>
    </div>
  );
}
