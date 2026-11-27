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
  source?: string;
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
  score: { total:number; passed:number; issues:number; open:number; minimum:number; maximum:number; partial:boolean; label:string; value:string; detail:string };
  homepageResponseMs?: number;
  screenshotStatus?: 'captured' | 'capacity' | 'unavailable';
  viewports?: { width:number; headingInView:boolean|null; screenshot?:string; missingVisibleImages?:boolean }[];
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
export type ScanError = 'verification' | 'invalid' | 'blocked' | 'unavailable' | 'busy' | 'store-limited' | 'denied' | 'limited' | 'timeout' | 'unsampled' | 'unverified';

export type ScanUpdate = { reading: PageKind; path: string } | { report: ScanReport } | { error: ScanError };
