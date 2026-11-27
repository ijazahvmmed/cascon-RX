export const categories = {
  home: 'Homepage', collections: 'Collections', product: 'Product pages',
  navigation: 'Navigation', trust: 'Trust', pricing: 'Pricing', shipping: 'Shipping',
  returns: 'Returns', cart: 'Cart', checkout: 'Checkout', mobile: 'Mobile foundations',
  seasonal: 'Seasonal campaigns',
} as const;

export type Category = keyof typeof categories;
export type PageKind = 'homepage' | 'product' | 'collection';
export type Platform = 'Shopify' | 'WooCommerce' | 'BigCommerce' | 'Magento' | 'Wix' | 'Squarespace' | 'PrestaShop' | 'Other or undetected';
export type Priority = 'High' | 'Medium' | 'Low';
export type Effort = 'Small' | 'Moderate' | 'Larger';
export type Confidence = 'High' | 'Moderate';

export interface Principle {
  id: string;
  category: Category;
  title: string;
  why: string;
  change: string;
  priority: Priority;
  effort: Effort;
  mode: 'automated' | 'expert';
}

export interface Finding extends Principle {
  page: PageKind;
  path: string;
  evidence: string;
  confidence: Confidence;
}

export interface Coverage {
  assessed: number;
  applicable: number;
  passed: number;
  score: number | null;
}
export interface CategoryResult extends Coverage { category: Category }
export interface Sample { kind: PageKind; path?: string; status: 'read' | 'partial' | 'blocked' | 'unavailable' | 'not found' | 'unverified' | 'rate limited' | 'skipped' | 'outside scope' }
export const sampleLabels: Record<Sample['status'], string> = {
  read: 'Sampled', partial: 'HTML prefix sampled', blocked: 'Store declined request',
  'rate limited': 'Store rate limit', skipped: 'Not requested', 'outside scope': 'Outside scan scope',
  unavailable: 'Could not read', 'not found': 'Not discovered', unverified: 'Could not verify',
};

export interface ScanReport {
  version: 1;
  store: string;
  platform: Platform;
  capturedAt: string;
  overall: Coverage;
  homepage: Coverage;
  categories: CategoryResult[];
  samples: Sample[];
  recommendations: Finding[];
}
export type ScanError = 'invalid' | 'blocked' | 'unavailable' | 'busy' | 'store-limited' | 'denied' | 'limited' | 'timeout' | 'unsampled' | 'unverified';

export function assessment(report: ScanReport) {
  if (report.overall.score !== null) return { label: 'Storefront readiness', value: report.overall.score + ' / 100',
    detail: report.overall.passed + ' of ' + report.overall.assessed + ' assessed checks passed across the sampled storefront.' };
  const product = report.samples.find(sample => sample.kind === 'product');
  const reason = product?.status === 'rate limited' ? 'The store rate-limited the product page.' :
    product?.status === 'blocked' ? 'The store declined the product-page request.' :
    'Evidence for a storewide score is incomplete.';
  if (report.homepage?.score != null) return { label: 'Homepage readiness', value: report.homepage.score + ' / 100',
    detail: report.homepage.passed + ' of ' + report.homepage.assessed + ' assessed homepage checks passed. ' + reason };
  return { label: 'Verified checks', value: report.overall.assessed ? report.overall.passed + ' of ' + report.overall.assessed + ' passed' : 'No checks assessed',
    detail: 'The sample is too limited for a readiness score. See the page evidence below.' };
}

export type ScanUpdate = { reading: PageKind; path: string } | { report: ScanReport } | { error: ScanError };
