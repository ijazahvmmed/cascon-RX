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
    imageAlt: 'Vibezon storefront',
    quote:
      '\u201cCascon rebuilt our Shopify store from scratch and the difference in conversion was immediate. Clean, fast, and built to sell.\u201d',
    name: 'Founder, Vibezon',
    title: "Men's fashion, India",
    cta: 'Book a call',
    ctaUrl: 'https://cal.com/cascon-haw2fz/15min',
  },
  {
    image: '/images/work/rewise.jpg',
    imageAlt: 'Rewise storefront',
    quote:
      '\u201cThe AI product photography Cascon produced for Rewise looked better than anything we\u2019d shot in a studio. Delivered in days, not weeks.\u201d',
    name: 'Founder, Rewise',
    title: 'Wellness, India',
    cta: 'Book a call',
    ctaUrl: 'https://cal.com/cascon-haw2fz/15min',
  },
  {
    image: '/images/work/carsupply.jpg',
    imageAlt: 'Car Supply storefront',
    quote:
      '\u201cFrom store build to SEO, Cascon handled everything and we started ranking within weeks. Exactly the partner we needed.\u201d',
    name: 'Founder, Car Supply',
    title: 'Automotive accessories, India',
    cta: 'Book a call',
    ctaUrl: 'https://cal.com/cascon-haw2fz/15min',
  },
];
