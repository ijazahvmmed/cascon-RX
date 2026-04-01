export interface Testimonial {
  image: string;
  imageAlt: string;
  quote: string;
  name: string;
  title: string;
  cta: string;
  ctaUrl: string;
}

export const testimonials: Testimonial[] = [
  {
    image: '/images/work/vibezon.jpg',
    imageAlt: "Vibezon — Men's Fashion",
    quote:
      '\u201cCascon rebuilt our Shopify store from scratch and the difference in conversion was immediate. Clean, fast, and built to sell.\u201d',
    name: 'FOUNDER,',
    title: "VIBEZON \u2014 MEN'S FASHION, INDIA",
    cta: 'Book a call',
    ctaUrl: 'https://cal.com/cascon-haw2fz/15min',
  },
  {
    image: '/images/work/rewise.jpg',
    imageAlt: 'Rewise — Wellness',
    quote:
      '\u201cThe AI product photography Cascon produced for Rewise looked better than anything we\u2019d shot in a studio. Delivered in days, not weeks.\u201d',
    name: 'FOUNDER,',
    title: 'REWISE \u2014 WELLNESS, INDIA',
    cta: 'Book a call',
    ctaUrl: 'https://cal.com/cascon-haw2fz/15min',
  },
  {
    image: '/images/work/carsupply.jpg',
    imageAlt: 'Car Supply — Automotive',
    quote:
      '\u201cFrom store build to SEO \u2014 Cascon handled everything and we started ranking within weeks. Exactly the partner we needed.\u201d',
    name: 'FOUNDER,',
    title: 'CAR SUPPLY \u2014 AUTOMOTIVE ACCESSORIES, INDIA',
    cta: 'Book a call',
    ctaUrl: 'https://cal.com/cascon-haw2fz/15min',
  },
];
