import { ImageResponse } from 'next/og';
export const alt = 'Cascon — Shopify agency and AI media studio. Bangalore and Dubai.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(115deg, #dcf6d3, #bfe4ec 60%, #e1f7d6)', padding: '56px 64px', color: '#0a0a0a', fontFamily: 'sans-serif' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-3px' }}>cascon.</span><span style={{ fontSize: 18 }}>Bangalore · Dubai</span></div>
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, lineHeight: 1.02, letterSpacing: '-4px' }}><span>Good stores.</span><span>Great creative.</span><span>Made to work together.</span></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}><span>Shopify · AI media · Ecommerce growth</span><span>www.cascondigital.com ↗</span></div>
  </div>, size);
}
