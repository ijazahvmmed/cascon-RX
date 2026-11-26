import type { Insight } from './insights';

export const benchmarkSlug = 'indian-shopify-storefronts-50-store-study';

export const benchmarkInsight: Insight = {
  slug: benchmarkSlug,
  title: 'Indian Shopify Storefronts: A 50-Store Observational Study',
  seoTitle: 'Indian Shopify Storefront Study (50 Stores)',
  summary: 'A mobile browser snapshot of 50 storefronts from an India-filtered directory, with recorded product-route responses and the limits of what they show.',
  description: 'Explore the sample, product-route responses and Shopify evidence from a one-day mobile browser study of 50 storefronts.',
  category: 'Storefront research',
  published: '2026-11-26',
  reader: 'For ecommerce teams evaluating what mobile storefront checks can establish.',
  relatedServices: ['shopify-development'],
  relatedArticles: ['shopify-website-development-cost-india'],
  sections: [
    {
      id: 'observed-routes',
      title: 'What the browser recorded',
      paragraphs: [
        'All 50 homepages and 49 on-store product routes returned HTTP 200 during the first pass. Product-route availability was part of screening.',
        'The separate product recheck recorded 43 HTTP 200 responses and one HTTP 429. Six product response statuses were not observed.',
        'For Global Beauty Secrets, the archive captured an editorial article. The correct product URL was linked from the archived homepage. We retained the store and recorded the product response and document title as unobserved for both passes.',
      ],
    },
    {
      id: 'platform-evidence',
      title: 'How we checked for Shopify',
      paragraphs: [
        'The saved homepage records showed a Shopify browser global and at least one Shopify CDN reference for every selected storefront. The archived cart endpoint responses were labeled non-JSON and were excluded from the platform check.',
      ],
    },
  ],
  sources: [
    ['ShopScan India Shopify directory, accessed 26 November 2026', 'https://www.shopscan.app/shopify-stores/in/india'],
    ['Global Beauty Secrets product page', 'https://discovergbs.com/products/greek-yogurt-and-lavender-body-moisturiser'],
    ['Version 0.4 dataset and report on Zenodo', 'https://doi.org/10.5281/zenodo.24564516'],
  ],
  research: {
    methodology: 'We reconciled saved captures from 26 November 2026. The browser was headless Playwright Chromium 119 with a 390 × 844 CSS-pixel mobile viewport and an Android Chrome 131 user-agent override. Each storefront used a fresh anonymous session.',
    sample: 'ShopScan’s India-filtered, popularity-ranked lists supplied the candidate frame. We screened 97 domains and retained 50, ten each in apparel, home and garden, personal care and beauty, food and drink, and accessories. A separate five-store pilot informed the method.',
    findings: [
      'The 49 valid first-pass product captures include HTML document titles. The 43 successful recheck titles match their first-pass titles. Seven recheck titles are recorded as “not observed”.',
    ],
    limitations: 'This single-day, non-probability sample used mobile emulation. The captures do not establish whether the product title was visible on screen. The release excludes UX scores and findings on cart, returns and performance. Cascon Digital conducted the study and sells Shopify services. Merchant relationships have yet to be confirmed. Independent peer review has not taken place.',
    downloads: [
      { label: 'Download the research report (PDF)', url: '/research/indian-shopify-storefronts/indian-shopify-storefronts-report.pdf' },
      { label: 'Download the 50-store observations (CSV)', url: '/research/indian-shopify-storefronts/indian-shopify-storefronts-observations.csv' },
      { label: 'Download the data dictionary', url: '/research/indian-shopify-storefronts/indian-shopify-storefronts-data-dictionary.md' },
      { label: 'Download the research methodology', url: '/research/indian-shopify-storefronts/indian-shopify-storefronts-methodology.md' },
    ],
    versions: [{ date: '2026-11-26', changes: 'Version 0.4. Corrects the Global Beauty Secrets product URL and reports the results as an observational study.' }],
    dataset: {
      doi: '10.5281/zenodo.24564516',
      version: '0.4',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      csv: '/research/indian-shopify-storefronts/indian-shopify-storefronts-observations.csv',
    },
  },
};
