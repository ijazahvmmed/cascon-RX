import { merchantFinding } from './merchant-copy';
import { shoppingChecks } from './shopping';
import { categories } from '../../../lib/cro/model';
import type { Category, Confidence, Coverage, Finding, PageKind, Principle, Priority, Sample, ScanReport } from '../../../lib/cro/model';
import { principles } from '../../../lib/cro/principles';
import type { DocumentEvidence } from './extract';

type State = 'pass' | 'fail' | 'unknown' | 'not-applicable';
type Decision = { state: State; evidence?: string; confidence?: Confidence };
type Condition = (page: DocumentEvidence) => Decision;
type Rule = [PageKind, Condition];
type Data = Record<string, unknown>;

const pass: Decision = { state: 'pass' };
const unknown: Decision = { state: 'unknown' };
const na: Decision = { state: 'not-applicable' };
const observed = (yes: boolean): Decision => yes ? pass : unknown;
const check = (valid: boolean, evidence: string, confidence: Confidence = 'High'): Decision =>
  valid ? pass : { state: 'fail', evidence, confidence };
const object = (value: unknown): Data | undefined => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Data : undefined;
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ||
  typeof value === 'string' && /^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ? Number(value) : null;
const validMoney = (value: unknown) => number(value) !== null && number(value)! >= 0;
const exists = (value: unknown) => value !== undefined && value !== null;
const condition = (values: unknown[], valid: (value: unknown) => boolean, evidence: string): Decision =>
  values.length ? check(values.every(valid), evidence) : na;
const knownCurrency = new Set(Intl.supportedValuesOf('currency'));
const checkLabels = (labels: number[], evidence: string): Decision => labels.length ?
  check(labels.every(bool => bool > 0), evidence, 'Moderate') : unknown;
const structured = (nodes: Data[], key: string) => nodes.map(node => node[key]).filter(exists);

function validDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value)) return false;
  const date = new Date(value.slice(0, 10) + 'T00:00:00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0,10) === value.slice(0,10) && Number.isFinite(Date.parse(value));
}

const rules: Record<string, Rule> = {
  'home-title': ['homepage', p => check(Boolean(p.title), 'The sampled homepage has no readable HTML title.')],
  'home-heading': ['homepage', p => p.headings ? pass : p.main ? check(false, 'The server HTML has a main content landmark and no text-bearing H1.', 'Moderate') : unknown],
  'home-catalogue': ['homepage', p => observed(p.candidates.length > 0)],
  'home-description': ['homepage', p => check(p.description, 'No non-empty meta description was found in the homepage HTML.')],

  'collection-title': ['collection', p => check(Boolean(p.title), 'The validated collection has no readable HTML title.')],
  'collection-heading': ['collection', p => p.headings ? pass : p.main ? check(false, 'The sampled collection HTML has a main landmark and no text-bearing H1.', 'Moderate') : unknown],
  'collection-products': ['collection', p => observed(p.candidates.some(c => c.kind === 'product'))],
  'collection-sort': ['collection', p => p.candidates.filter(c => c.kind === 'product').length >= 8 ? observed(p.sort) : na],

  'product-heading': ['product', p => p.headings ? pass : p.main ? check(false, 'The verified product HTML has a main landmark and no text-bearing H1.', 'Moderate') : unknown],
  'product-image': ['product', p => observed(p.images)],
  'product-image-alt': ['product', p => p.productImage ? check(p.productImage.alt, 'The identified primary product image has empty or missing alt text.', 'Moderate') : unknown],
  'product-action': ['product', p => checkLabels(p.labels.purchase,'An identified add-to-cart control has no label in the sampled HTML. Check its rendered accessible name.')],

  'nav-landmark': ['homepage', p => p.nav ? pass : p.candidates.length > 2 ? check(false, 'Catalogue links were present, with no navigation landmark in the homepage HTML.', 'Moderate') : unknown],
  'nav-search': ['homepage', p => observed(p.search)],
  'nav-breadcrumb': ['product', p => observed(p.breadcrumbs)],
  'nav-main': ['homepage', p => p.main ? pass : p.headings ? check(false, 'The homepage has a primary heading and no main landmark in its HTML.', 'Moderate') : unknown],

  'trust-contact': ['homepage', p => observed(p.links.has('contact'))],
  'trust-about': ['homepage', p => observed(p.links.has('about'))],
  'trust-privacy': ['homepage', p => observed(p.links.has('privacy'))],
  'trust-https': ['homepage', p => check(p.url.protocol === 'https:', 'The storefront’s sampled entry response used HTTP.')],

  'price-present': ['product', p => observed(p.visiblePrice || p.offers.some(o => validMoney(o.price)))],
  'price-currency': ['product', p => condition(p.offers.filter(o => exists(o.price) || exists(o.priceCurrency)).map(o => o.priceCurrency),
    v => typeof v === 'string' && knownCurrency.has(v), 'A structured product offer has an absent or unrecognized priceCurrency value.')],
  'price-value': ['product', p => condition(structured(p.offers,'price'),validMoney,'A structured product price is not a non-negative numeric value.')],
  'price-discount': ['product', p => condition(p.comparisons, v => { const row = object(v)!; return Number(row.former) >= Number(row.current); },
    'An explicit same-element, same-currency comparison price is below the current price.')],

  'shipping-link': ['homepage', p => observed(p.links.has('shipping'))],
  'shipping-product': ['product', p => observed(p.detailLinks.has('shipping') || p.shipping.length > 0)],
  'shipping-amount': ['product', p => condition(p.shipping.flatMap(s => object(s.shippingRate)?.value ?? []).filter(exists),validMoney,
    'The identified JSON-LD monetary shipping rate is negative or malformed.')],
  'shipping-range': ['product', p => {
    const times = p.shipping.flatMap(s => {
      const transit = object(s.deliveryTime);
      return [object(transit?.handlingTime),object(transit?.transitTime)].filter((x): x is Data => Boolean(x));
    });
    const ranges = times.filter(r => number(r.minValue) !== null && number(r.maxValue) !== null);
    return condition(ranges, v => { const r = object(v)!; return number(r.minValue)! >= 0 && number(r.maxValue)! >= number(r.minValue)!; },
      'A structured delivery-time range has a negative minimum or a maximum below its minimum.');
  }],

  'returns-link': ['homepage', p => observed(p.links.has('returns'))],
  'returns-product': ['product', p => observed(p.detailLinks.has('returns') || p.returns.length > 0)],
  'returns-window': ['product', p => condition(p.returns.filter(r => typeof r.returnPolicyCategory === 'string' &&
    /(?:^|\/)MerchantReturnFiniteReturnWindow$/.test(r.returnPolicyCategory)).map(r => r.merchantReturnDays),
    v => number(v) !== null && Number.isInteger(number(v)) && number(v)! >= 0, 'A finite return policy is missing a valid merchantReturnDays value.')],
  'returns-category': ['product', p => condition(p.returns.filter(r => r['@type'] === 'MerchantReturnPolicy' && !r['@id']).map(r => r.returnPolicyCategory),
    v => typeof v === 'string' && /(?:^|\/)(?:MerchantReturnFiniteReturnWindow|MerchantReturnUnlimitedWindow|MerchantReturnNotPermitted|MerchantReturnUnspecified)$/.test(v),
    'An inline MerchantReturnPolicy object has no recognized return policy category.')],

  'cart-link': ['homepage', p => observed(p.links.has('cart'))],
  'cart-label': ['homepage', p => checkLabels(p.labels.cart,'A cart link has no text or name in the homepage HTML. Its rendered accessible name merits a check.')],
  'cart-submit': ['product', p => p.insecureCart ? check(false,'A same-merchant cart form has an explicit HTTP action.') : p.secureCartForm ? pass : unknown],
  'cart-quantity': ['product', p => observed(p.labels.quantity.length > 0)],

  'checkout-entry': ['homepage', p => p.links.has('checkout') ? checkLabels(p.labels.checkout, 'A checkout link has no text or name in the homepage HTML. Check its rendered label.') : na],
  'checkout-https': ['homepage', p => p.insecureCheckout ? check(false,'An identified same-merchant checkout link points to HTTP.') : p.labels.checkout.length ? pass : na],
  'checkout-methods': ['homepage', p => observed(p.payment)],
  'checkout-fast': ['product', p => p.express ? pass : na],

  'mobile-viewport': ['homepage', p => p.viewport === null ?
    check(false, 'The homepage HTML has no viewport meta element.') :
    check(/(?:^|[,;\s])width\s*=\s*device-width\b/i.test(p.viewport),
      'The declared viewport does not specify device-width. Check the resulting layout on mobile.', 'Moderate')],
  'mobile-zoom': ['homepage', p => p.viewport === null ? na :
    check(!/user-scalable\s*=\s*(?:no|0)\b/i.test(p.viewport) &&
      !(Number(p.viewport.match(/maximum-scale\s*=\s*(\d+(?:\.\d+)?)/i)?.[1] ?? '5') < 2),
      'The HTML viewport explicitly disables zoom or caps it below 2×. Device handling may differ.')],
  'mobile-lang': ['homepage', p => check(p.lang,'The homepage HTML element has no non-empty lang attribute.')],
  'mobile-image-size': ['product', p => observed(p.productImage?.sized ?? false)],

  'season-offer-validity': ['product', p => condition(structured(p.offers,'priceValidUntil'),validDate,
    'A structured offer has an invalid explicit priceValidUntil date.')],
  'season-window': ['product', p => condition(p.offers.filter(o => validDate(o.validFrom) && validDate(o.validThrough)),
    v => { const offer = object(v)!; return Date.parse(String(offer.validFrom)) <= Date.parse(String(offer.validThrough)); },
    'The explicit validity period on a structured offer ends before it starts.')],
  'season-time': ['homepage', p => condition(p.campaignDate,validDate,'A time element explicitly marked as part of a campaign contains an invalid datetime.')],
  'season-promo-target': ['homepage', p => p.campaignInsecure ?
    check(false,'A same-merchant link explicitly marked as a campaign destination uses HTTP.') : p.campaignSecure ? pass : na],
};

const weight: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
const effort = { Small: 3, Moderate: 2, Larger: 1 };
const confidence = { High: 2, Moderate: 1 };
const automatable = principles.filter(p => p.mode === 'automated');
if (automatable.length !== Object.keys(rules).length || automatable.some(p => !(p.id in rules))) throw new Error('CRO rule catalogue mismatch');

interface Outcome { principle: Principle; page: PageKind; path?: string; decision: Decision }
function coverage(outcomes: Outcome[]): Coverage {
  const applicable = outcomes.filter(o => o.decision.state !== 'not-applicable');
  const assessed = applicable.filter(o => o.decision.state === 'pass' || o.decision.state === 'fail');
  const passed = assessed.filter(o => o.decision.state === 'pass');
  return { assessed:assessed.length, applicable:applicable.length, passed:passed.length };
}

export function evaluate(home: DocumentEvidence, pages: Partial<Record<PageKind, DocumentEvidence>>, samples: Sample[], capturedAt: string): ScanReport {
  const absenceSensitive = new Set(['home-title','home-heading','home-description','collection-title','collection-heading','product-heading','product-action','nav-landmark','nav-main','cart-label','checkout-entry']);
  const outcomes: Outcome[] = automatable.map(principle => {
    const [page, observe] = rules[principle.id];
    const evidence = pages[page];
    const result = evidence ? observe(evidence) : unknown;
    const absenceUncertain = evidence && !evidence.complete && (absenceSensitive.has(principle.id) ||
      principle.id === 'mobile-viewport' && evidence.viewport === null);
    return { principle, page, path: evidence?.url.pathname, decision: absenceUncertain && result.state === 'fail' ? unknown : result };
  });
  const summary = (Object.keys(categories) as Category[]).map(category => ({
    category, ...coverage(outcomes.filter(o => o.principle.category === category)),
  }));
  const overall = coverage(outcomes);
  const candidates: Finding[] = outcomes.flatMap(({ principle, page, path, decision }) =>
    path && decision.state === 'fail' && decision.evidence && decision.confidence ?
      [{ ...principle, page, path, evidence: decision.evidence, confidence: decision.confidence }] : []);
  const rank = (f: Finding) => weight[f.priority] * 12 + confidence[f.confidence] * 4 + effort[f.effort];
  const signals = pages.product?.itemSignals;
  if (signals && pages.product) {
    const add = (id: string, category: Category, title: string, evidence: string, why: string, change: string) =>
      candidates.push({ id, category, title, evidence, why, change, priority:'High', effort:'Small',
        confidence:'High', mode:'automated', page:'product', path:pages.product!.url.pathname });
    if (signals.invalidPrice && !signals.price) add('unfinished-price','pricing','Finish the item price',
      'The price area contains an unfinished price.','People need to know the amount before buying.','Replace the temporary text with the item price and currency.');
    if (signals.placeholder && !signals.description) add('unfinished-description','product','Finish the item description',
      'The description still contains placeholder text.','People need something to base their choice on.','Describe the item and give a detail that helps someone choose it.');
  }
  candidates.sort((a,b) => rank(b) - rank(a) || a.id.localeCompare(b.id));
  const recommendations: Finding[] = [];
  for (const finding of candidates) {
    if (!recommendations.some(v => v.category === finding.category)) recommendations.push(finding);
    if (recommendations.length >= 3) break;
  }
  return { version: 2, shopping: shoppingChecks(home, pages.product), store: home.url.origin, platform: home.platform, capturedAt, overall, categories: summary, samples, recommendations:recommendations.map(merchantFinding) };
}
