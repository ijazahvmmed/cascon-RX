export const categories = {
  home: 'Homepage', collections: 'Collections', product: 'Product pages',
  navigation: 'Navigation', trust: 'Trust', pricing: 'Pricing', shipping: 'Shipping',
  returns: 'Returns', cart: 'Cart', checkout: 'Checkout', mobile: 'Shopping on a phone',
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
}
export interface CategoryResult extends Coverage { category: Category }
export interface Sample { kind: PageKind; path?: string; status: 'read' | 'partial' | 'blocked' | 'unavailable' | 'not found' | 'unverified' | 'rate limited' | 'skipped' | 'outside scope' }
export const sampleLabels: Record<Sample['status'], string> = {
  read: 'Checked', partial: 'Partly checked', blocked: 'Could not open',
  'rate limited': 'Store asked us to pause', skipped: 'Skipped', 'outside scope': 'Outside this store',
  unavailable: 'Could not read', 'not found': 'No page found', unverified: 'Could not identify the page',
};

export interface ShoppingCheck {
  title: string;
  result: 'Confirmed' | 'Needs attention' | 'Could not confirm';
  detail: string;
}

export function categoryResult(category: CategoryResult) {
  if (!category.applicable) return 'Does not apply here';
  const issues = category.assessed - category.passed;
  const open = category.applicable - category.assessed;
  return [category.passed + ' confirmed', issues && issues + ' to fix', open && open + ' open']
    .filter(Boolean).join(' · ');
}

export interface ScanReport {
  shopping: ShoppingCheck[];
  version: 2;
  store: string;
  platform: Platform;
  capturedAt: string;
  overall: Coverage;
  categories: CategoryResult[];
  samples: Sample[];
  recommendations: Finding[];
}
export type ScanError = 'invalid' | 'blocked' | 'unavailable' | 'busy' | 'store-limited' | 'denied' | 'limited' | 'timeout' | 'unsampled' | 'unverified';

export function assessment(report: Pick<ScanReport, 'shopping'>) {
  const total = report.shopping.length;
  const passed = report.shopping.filter(item => item.result === 'Confirmed').length;
  const issues = report.shopping.filter(item => item.result === 'Needs attention').length;
  const open = total - passed - issues;
  const minimum = total ? Math.round(100 * passed / total) : 0;
  const maximum = total ? Math.round(100 * (passed + open) / total) : 100;
  const partial = open > 0 || !total;
  return {
    total, passed, issues, open, minimum, maximum, partial,
    label: !passed && !issues ? 'Confirmed points' : partial ? 'Shopping score so far' : 'Shopping score',
    value: minimum + '/100',
    detail: partial
      ? (maximum - minimum) + ' points still open. Possible score ' + minimum + '–' + maximum + '.'
      : passed + ' of ' + total + ' shopping questions confirmed.',
  };
}

export type ScanUpdate = { reading: PageKind; path: string } | { report: ScanReport } | { error: ScanError };
