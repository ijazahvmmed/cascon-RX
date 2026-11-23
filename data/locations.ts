import type { PriceCurrency } from '@/components/PricingTiers';

export interface CityPage {
  slug: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  title: string;
  description: string;
  intro: string;
  /** Office key in LOCATIONS, when Cascon has a staffed office in this city. */
  office?: 'bangalore' | 'coventry';
  officeNote?: string;
  marketTitle: string;
  marketIntro: string;
  market: string[][];
  projects: string[];
  projectsIntro: string;
  workHeading: string;
  otherClients?: string;
  currencies: PriceCurrency[];
  pricingIntro: string;
  tiers: string[][];
  faqs: string[][];
  services: string[];
}

const AED_USD: PriceCurrency[] = [
  { code: 'AED', label: 'AED', note: 'Prices exclude 5% UAE VAT. Billed in UAE dirhams.' },
  { code: 'USD', label: '$ USD', note: 'Prices in US dollars, converted at about AED 3.67 to $1.' },
];
const INR_ONLY: PriceCurrency[] = [
  { code: 'INR', label: '₹ INR', note: 'Prices exclude GST. Billed in Indian rupees.' },
];

export const cityPages: CityPage[] = [
  {
    slug: 'dubai',
    city: 'Dubai',
    region: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    title: 'Shopify & Ecommerce Development in Dubai',
    description: 'Shopify and ecommerce website development in Dubai: Arabic and RTL stores, Tabby and Tamara, AED pricing. Cascon Digital, Tower Plaza, Sheikh Zayed Road.',
    intro: 'Cascon Digital builds Shopify stores for brands selling in the UAE and the wider GCC, from our office on Sheikh Zayed Road. We plan the store around how UAE customers actually buy: in Arabic and English, on mobile, with buy-now-pay-later and fast local delivery.',
    office: 'coventry',
    marketTitle: 'Built for how the UAE buys.',
    marketIntro: 'A UAE store needs more than a translated theme. These are the parts we plan for from the first workshop.',
    market: [
      ['Arabic and right-to-left storefronts', 'Arabic and English versions of the store with proper right-to-left layout: navigation, product pages, cart and forms that mirror correctly, not just translated text. We check that the chosen theme supports RTL before quoting.'],
      ['Tabby, Tamara and UAE payments', 'Buy-now-pay-later through Tabby or Tamara, cards through a UAE-eligible payment provider, and cash on delivery where it still makes sense. We confirm each provider’s eligibility for your business before launch.'],
      ['AED pricing, VAT and GCC markets', 'Prices in dirhams with 5% VAT shown the way UAE shoppers expect, plus Shopify Markets for Saudi Arabia, Qatar, Kuwait and other GCC countries if you sell beyond the UAE.'],
      ['Delivery that matches the promise', 'Same-day and next-day delivery options, delivery zones across the Emirates and courier integrations, with the delivery promise shown clearly on product and cart pages.'],
    ],
    projects: ['lumy-dates'],
    projectsIntro: 'Shopify development and creative work for brands selling in the UAE.',
    workHeading: 'Work for UAE brands.',
    otherClients: 'We also run performance marketing and content for UAE businesses including Clipston Elevators, Clipston Engineering, Benair HVAC and Pureline Fiberglass.',
    currencies: AED_USD,
    pricingIntro: 'Typical ranges for a Shopify store build. Shopify plan, theme and app subscriptions are billed separately. You get a fixed quote after a scoping call.',
    tiers: [
      ['Starter store', 'A configured Shopify theme in English and Arabic, up to about 100 products, Tabby or Tamara, delivery setup and launch checks. Typically 3 to 5 weeks.', 'AED 6,000 – 12,000', '$1,650 – $3,250'],
      ['Growth store', 'Custom sections, up to about 1,000 products, GCC markets, reviews, email flows and analytics. Typically 6 to 10 weeks.', 'AED 12,000 – 30,000', '$3,250 – $8,200'],
      ['Custom build', 'Custom Liquid development, integrations with ERP or delivery systems, B2B pricing or a Shopify Plus setup. Scoped after discovery.', 'From AED 30,000', 'From $8,200'],
    ],
    faqs: [
      ['How much does a Shopify website cost in Dubai?', 'Most UAE Shopify builds fall between AED 6,000 and AED 30,000, excluding VAT. Arabic RTL support, the number of products, GCC markets and custom integrations decide where a store sits in that range. Shopify, theme and app subscriptions are separate.'],
      ['Can my Shopify store be in Arabic?', 'Yes. Shopify supports Arabic, and we set up a right-to-left layout so the Arabic store reads naturally. We check theme support for RTL and test checkout in both languages before launch.'],
      ['Do you support Tabby and Tamara?', 'Yes, we integrate Tabby and Tamara buy-now-pay-later alongside card payments. Approval is decided by each provider, so we start the applications early in the project.'],
      ['Can we meet in person?', 'Yes. Our Dubai office is at Tower Plaza on Sheikh Zayed Road. Book a call first so the right person is there.'],
    ],
    services: ['shopify-development', 'shopify-cro', 'ai-product-photography', 'ai-video-production'],
  },
  {
    slug: 'bangalore',
    city: 'Bangalore',
    region: 'Karnataka',
    country: 'India',
    countryCode: 'IN',
    title: 'Shopify & Ecommerce Agency in Bangalore',
    description: 'Shopify and ecommerce website development in Bangalore: Razorpay, COD, GST and Shiprocket setup with rupee pricing. Visit Cascon Digital in HMT Layout.',
    intro: 'Cascon Digital designs and develops Shopify stores for Indian ecommerce brands from our Bangalore office in HMT Layout. We set the store up for how India buys: UPI and cash on delivery, GST invoices, pincode delivery checks and WhatsApp updates.',
    office: 'bangalore',
    marketTitle: 'Set up for selling in India.',
    marketIntro: 'Most of the work in an Indian store is in payments, delivery and returns. We plan these with you before the design is signed off.',
    market: [
      ['UPI, cards and cash on delivery', 'Razorpay, PayU or Cashfree for UPI, cards and wallets, plus cash on delivery with rules that reduce fake orders, such as COD limits, partial prepayment or OTP checks through an app.'],
      ['GST-ready invoices and pricing', 'Prices shown inclusive of GST, GST invoices for every order and your GSTIN on the store, set up with your accountant’s rules for each product category.'],
      ['Delivery and returns across India', 'Shiprocket or another aggregator for courier choice, pincode serviceability checks on the product page, and a returns and exchange flow your team can actually run.'],
      ['WhatsApp and SMS updates', 'Order confirmation, abandoned-cart and shipping updates on WhatsApp, which Indian shoppers check far more than email.'],
    ],
    projects: ['finewares', 'slept-club', 'bagus'],
    projectsIntro: 'Selected Shopify work for ecommerce brands in India.',
    workHeading: 'Work for Indian brands.',
    otherClients: 'Other Shopify and CRO work in India includes Mehndi Online and Jerso.',
    currencies: INR_ONLY,
    pricingIntro: 'Typical ranges for a Shopify store build. Shopify plan, theme and app subscriptions are billed separately. You get a fixed quote after a scoping call.',
    tiers: [
      ['Starter store', 'A configured Shopify theme, up to about 100 products, Razorpay and COD, Shiprocket and launch checks. Typically 3 to 5 weeks.', '₹60,000 – ₹1,50,000'],
      ['Growth store', 'Custom sections, up to about 1,000 products, reviews, WhatsApp flows, analytics and SEO setup. Typically 6 to 10 weeks.', '₹1,50,000 – ₹4,00,000'],
      ['Custom build', 'Custom Liquid development, ERP or inventory integrations, B2B pricing or Shopify Plus. Scoped after discovery.', 'From ₹4,00,000'],
    ],
    faqs: [
      ['How much does a Shopify website cost in Bangalore?', 'Most Shopify builds we quote fall between ₹60,000 and ₹4,00,000, excluding GST. The number of products, custom sections and integrations decide where a store sits. Shopify, theme and app subscriptions are separate.'],
      ['Can you set up cash on delivery and UPI?', 'Yes. We set up UPI, cards and wallets through Razorpay, PayU or Cashfree, and cash on delivery with rules to cut fake and returned orders.'],
      ['Can we visit your Bangalore office?', 'Yes. We are at HMT Layout, off CBI Road, Bangalore 560032. Book a call first so the right person is there.'],
      ['Do you work with brands outside Bangalore?', 'Yes. Most of our Indian clients work with us remotely, with workshops on video and visits when they help.'],
    ],
    services: ['shopify-development', 'woocommerce-to-shopify', 'shopify-cro', 'ai-product-photography'],
  },
  {
    slug: 'kerala',
    city: 'Kochi',
    region: 'Kerala',
    country: 'India',
    countryCode: 'IN',
    title: 'Shopify & Ecommerce Agency in Kochi, Kerala',
    description: 'Shopify and ecommerce websites for Kochi and Kerala businesses: export catalogues, selling to the Gulf and rupee pricing. Served from Bangalore and Dubai.',
    intro: 'Cascon Digital builds Shopify stores and websites for businesses in Kochi and across Kerala. We work remotely from our Bangalore office, with a Dubai office for brands that sell to Malayali customers in the Gulf.',
    officeNote: 'We don’t have an office in Kochi. Kerala projects are run from Bangalore, with video workshops and visits when the project needs them.',
    marketTitle: 'What Kerala sellers need from a store.',
    marketIntro: 'Kerala brands often sell to two audiences at once: customers in India and Malayali families in the Gulf and beyond. The store has to work for both.',
    market: [
      ['Export and international catalogues', 'Spices, tea, coffee, ayurveda, handloom and other Kerala products often sell abroad. We set up Shopify Markets for international pricing and shipping, and product pages that answer export questions such as weight, shelf life and duties.'],
      ['Selling to the Gulf', 'Many Kerala brands have a large customer base in the UAE and GCC. Our Dubai office means we can set up AED pricing, Gulf delivery partners and payments for those customers.'],
      ['UPI, COD and Indian delivery', 'Razorpay or Cashfree for UPI and cards, cash on delivery rules and Shiprocket for courier choice across India.'],
      ['Websites for property and services', 'Not every Kerala business sells online. For builders and service firms we build websites that turn visits into enquiries, with project pages, photography and clear contact routes.'],
    ],
    projects: ['citysky-builders'],
    projectsIntro: 'Website, content and AI photography work for a home builder in Kerala.',
    workHeading: 'Work for Kerala brands.',
    currencies: INR_ONLY,
    pricingIntro: 'Typical ranges for a Shopify store build. Shopify plan, theme and app subscriptions are billed separately. You get a fixed quote after a scoping call.',
    tiers: [
      ['Starter store', 'A configured Shopify theme, up to about 100 products, Razorpay and COD, Shiprocket and launch checks. Typically 3 to 5 weeks.', '₹60,000 – ₹1,50,000'],
      ['Export-ready store', 'International markets and pricing, Gulf delivery, export product information, reviews and analytics. Typically 6 to 10 weeks.', '₹1,50,000 – ₹4,00,000'],
      ['Custom build', 'Custom development, inventory or ERP integrations, B2B or wholesale pricing. Scoped after discovery.', 'From ₹4,00,000'],
    ],
    faqs: [
      ['Do you have an office in Kochi?', 'No. We work with Kerala businesses remotely from our Bangalore office, with video workshops and visits when the project needs them. Our Dubai office supports brands selling to the Gulf.'],
      ['Can my store sell to customers in the UAE and Gulf?', 'Yes. Shopify Markets lets one store show local prices and shipping for the UAE and other GCC countries. We set up the pricing, delivery and payment options for each market.'],
      ['How much does an ecommerce website cost in Kerala?', 'Most Shopify builds fall between ₹60,000 and ₹4,00,000, excluding GST. Export markets, product count and integrations decide where a store sits. Shopify, theme and app subscriptions are separate.'],
    ],
    services: ['shopify-development', 'ai-product-photography', 'shopify-redesign'],
  },
];
