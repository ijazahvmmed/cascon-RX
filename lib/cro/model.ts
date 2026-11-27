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
  categories: CategoryResult[];
  samples: Sample[];
  recommendations: Finding[];
}
export type ScanError = 'invalid' | 'blocked' | 'unavailable' | 'busy' | 'store-limited' | 'denied' | 'limited' | 'timeout' | 'unsampled' | 'unverified';
