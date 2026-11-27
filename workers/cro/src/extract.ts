import { readItemSignals, type ItemSignals } from './shopping';
import { readHomeShopping, type HomeShopping } from './home-shopping';
import type { PageKind, Platform } from '../../../lib/cro/model';
import { sampleUrl } from './target';

type Data = Record<string, unknown>;
type Hit = { path: string; kind: Exclude<PageKind,'homepage'>; quality: number };
type LinkSignal = 'contact' | 'about' | 'privacy' | 'shipping' | 'returns' | 'cart' | 'checkout';

export interface DocumentEvidence {
  itemSignals?: ItemSignals;
  homeShopping?: HomeShopping;
  url: URL;
  platform: Platform;
  visible: boolean;
  complete: boolean;
  blocked: boolean;
  title: string;
  description: boolean;
  headings: number;
  lang: boolean;
  viewport: string | null;
  nav: boolean;
  main: boolean;
  search: boolean;
  sort: boolean;
  breadcrumbs: boolean;
  candidates: Hit[];
  links: Set<LinkSignal>;
  detailLinks: Set<LinkSignal>;
  labels: { cart: number[]; checkout: number[]; purchase: number[]; quantity: number[] };
  secureCartForm?: boolean;
  insecureCart: boolean;
  insecureCheckout: boolean;
  payment: boolean;
  express: boolean;
  images: boolean;
  productImage: { alt: boolean; sized: boolean } | null;
  productSchema: boolean;
  productTemplate: boolean;
  collectionSchema: boolean;
  collectionTemplate: boolean;
  purchase: boolean;
  visiblePrice: boolean;
  offers: Data[];
  shipping: Data[];
  returns: Data[];
  comparisons: Array<{ current: number; former: number }>;
  campaignDate: string[];
  campaignInsecure: boolean;
  campaignSecure: boolean;
}

const linkPatterns: Record<LinkSignal, RegExp> = {
  contact: /(?:^|\/)(?:contact(?:-us)?|customer-service|support)(?:\/|$)/i,
  about: /(?:^|\/)about(?:-us)?(?:\/|$)/i,
  privacy: /(?:^|\/)privacy(?:-policy|-notice)?(?:\/|$)/i,
  shipping: /(?:^|\/)(?:shipping|delivery)(?:-and-delivery|-policy|-information|-info)?(?:\/|$)/i,
  returns: /(?:^|\/)(?:refund(?:-policy)?|returns?(?:-policy|-and-refunds)?|refunds-and-returns)(?:\/|$)/i,
  cart: /(?:^|\/)(?:cart|basket|shopping-cart)(?:\/|\.php|$)/i,
  checkout: /(?:^|\/)checkout(?:\/|\.php|$)/i,
};
const productPath = /\/(?:products?|p|items?|product-detail)\/[a-z0-9._~-]+\/?$/i;
const collectionPath = /\/(?:collections?|product-category|collections-all|category|c|shop)\/[a-z0-9._~-]+\/?$/i;
const productsIndex = /\/(?:collections|shop|products|catalog|catalogue|all-products)\/?$/i;
const signals: LinkSignal[] = ['contact','about','privacy','shipping','returns','cart','checkout'];

function object(value: unknown): Data | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Data : null;
}
function list(value: unknown): unknown[] { return Array.isArray(value) ? value.slice(0, 20) : value === undefined ? [] : [value]; }
function nodes(value: unknown): Data[] { return list(value).map(object).filter((entry): entry is Data => entry !== null); }
function typeIs(node: Data, type: string) {
  return list(node['@type']).some(x => typeof x === 'string' && (x === type || x.endsWith('/' + type)));
}
function numeric(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) || typeof value === 'string' && /^[0-9]+(?:\.[0-9]+)?$/.test(value);
}
function assetPath(value: unknown, base: URL): string {
  if (typeof value !== 'string' || !value || value.length > 2048) return '';
  try {
    const url = new URL(value, base);
    return (url.pathname.replace(/^\/cdn\/shop\//, '/').replace(/^\/s\/files\/.*?\/(files|products)\//, '/$1/')).toLowerCase();
  } catch { return ''; }
}
function candidateKind(path: string, hint: string): Hit['kind'] | null {
  if (productPath.test(path) || /\b(?:woocommerce-loop-product__link|card-title-link|product-item-link|js-product-link|product-card__link|product-card-link|wc-block-components-product-name)\b/i.test(hint)) return 'product';
  if (collectionPath.test(path) || productsIndex.test(path)) return 'collection';
  return null;
}

/** Only parsed evidence leaves this module. Merchant text and scripts are never rendered. */
export async function extract(document: Response, url: URL, kind?: PageKind): Promise<DocumentEvidence> {
  const proof = {
    url, platform: 'Other or undetected' as Platform,
    visible: false, complete: true, blocked: false, title: '', description: false, headings: 0, lang: false,
    viewport: null as string | null, nav: false, main: false, search: false, sort: false, breadcrumbs: false,
    candidates: [] as Hit[], links: new Set<LinkSignal>(), detailLinks: new Set<LinkSignal>(),
    labels: { cart: [] as number[], checkout: [] as number[], purchase: [] as number[], quantity: [] as number[] },
    insecureCart: false, insecureCheckout: false, payment: false, express: false, images: false,
    productImage: null as DocumentEvidence['productImage'], productSchema: false,
    productTemplate: false, collectionSchema: false, collectionTemplate: false, purchase: false,
    visiblePrice: false, offers: [] as Data[], shipping: [] as Data[], returns: [] as Data[],
    comparisons: [] as DocumentEvidence['comparisons'], campaignDate: [] as string[],
    campaignInsecure: false, campaignSecure: false,
  };
  let sawBody = false, title = '', heading = '', json = '', bodyClass = '', openProduct = 0, activeAnchor: { group: 'cart' | 'checkout'; label: number } | null = null;
  let anchorCaptured = 0, h1s = 0;
  const schemas: Data[] = [];
  const media: Array<{ paths: string[]; alt: boolean; sized: boolean; primary: boolean }> = [];
  const detected = new Set<Platform>();
  const formIds = new Set<string>(), labelIds = new Set<string>();
  const quantity: Array<{ id: string; name: boolean }> = [];
  const seenCandidates = new Set<string>();
  const markAsset = (link: string) => {
    try {
      const asset=new URL(link,url);
      if (asset.hostname === 'cdn.shopify.com' || asset.origin === url.origin && asset.pathname.startsWith('/cdn/shop/')) detected.add('Shopify');
    } catch { /* Unrecognized asset. */ }
    if (/\/(?:plugins\/woocommerce|woocommerce\/assets|wc-blocks)[/.-]/i.test(link)) detected.add('WooCommerce');
    if (/cdn\d*\.bigcommerce\.com|stencil-utils/i.test(link)) detected.add('BigCommerce');
    if (/Magento_(?:Catalog|Theme|Checkout)|\/mage\/(?:requirejs|cookies)/i.test(link)) detected.add('Magento');
    if (/wixstatic\.com|wix-code|wix-thunderbolt/i.test(link)) detected.add('Wix');
    if (/static[1-9]?\.squarespace\.com|squarespace-cdn\.com/i.test(link)) detected.add('Squarespace');
    if (/prestashop/i.test(link)) detected.add('PrestaShop');
  };
  const named = (el: Element) => Boolean(el.getAttribute('aria-label')?.trim() || el.getAttribute('aria-labelledby')?.trim() ||
    el.getAttribute('title')?.trim() || el.tagName === 'input' && el.getAttribute('value')?.trim());
  let activeBuy: number | null = null;
  const addControl = /(?:^|[\s_-])(?:add.to.cart|single_add_to_cart_button|add-to-basket|product-submit)(?:$|[\s_-])/i;
  // A node can match several selectors. The runtime retains one native end-tag
  // handler per element, so share it across all evidence collectors.
  let callbacks: (() => void)[] | undefined;
  function onEnd(el: Element, callback: () => void) {
    if (callbacks) {
      callbacks.push(callback);
      return;
    }
    const closing = [callback];
    callbacks = closing;
    el.onEndTag(() => { for (const finish of closing) finish(); });
  }
  const rewriter = new HTMLRewriter()
    .on('*', { element() { callbacks = undefined; } })
    .on('html', { element(el) { proof.lang ||= Boolean(el.getAttribute('lang')?.trim()); } })
    .on('body', { element(el) {
      sawBody = true;
      bodyClass = el.getAttribute('class') ?? '';
      proof.productTemplate ||= /(?:^|\s)(?:single-product|catalog-product-view|template-product|page-product)(?:\s|$)/i.test(bodyClass);
      proof.collectionTemplate ||= /(?:^|\s)(?:tax-product_cat|post-type-archive-product|catalog-category-view|template-collection|page-category)(?:\s|$)/i.test(bodyClass);
      if (/\bwoocommerce\b|tax-product_cat|post-type-archive-product/i.test(bodyClass)) detected.add('WooCommerce');
      if (/\btemplate-(product|collection|index)\b/i.test(bodyClass)) detected.add('Shopify');
    } })
    .on('head title', { text(chunk) { if (title.length < 320) title += chunk.text.slice(0,320); } })
    .on('meta[name], meta[property]', { element(el) {
      const key = (el.getAttribute('name') ?? el.getAttribute('property') ?? '').toLowerCase();
      const value = el.getAttribute('content')?.trim().slice(0,600) ?? '';
      if (key === 'description') proof.description ||= Boolean(value);
      if (key === 'viewport') proof.viewport = value;
      if (key === 'generator') {
        if (/woocommerce/i.test(value)) detected.add('WooCommerce');
        if (/shopify/i.test(value)) detected.add('Shopify');
        if (/prestashop/i.test(value)) detected.add('PrestaShop');
        if (/wix/i.test(value)) detected.add('Wix');
        if (/squarespace/i.test(value)) detected.add('Squarespace');
      }
      if (key === 'og:type' && value.toLowerCase() === 'product') proof.productTemplate = true;
    } })
    .on('link[href], script[src]', { element(el) { markAsset(el.getAttribute('href') ?? el.getAttribute('src') ?? ''); } })
    .on('script[type="application/ld+json"]', {
      element(el) { json = ''; onEnd(el, () => {
        if (!json || json.length >= 18000 || schemas.length >= 30) return;
        try {
          for (const data of nodes(JSON.parse(json))) {
            schemas.push(data, ...nodes(data['@graph']));
          }
        } catch { /* Invalid data remains unknown. */ }
      }); },
      text(chunk) { if (json.length < 18000) json += chunk.text.slice(0,18000); },
    })
    .on('h1', {
      element(el) {
        if (h1s++ > 12 || el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return;
        heading = '';
        onEnd(el, () => { if (heading.trim()) proof.headings++; });
      },
      text(chunk) { if (heading.length < 240) heading += chunk.text.slice(0,240); },
    })
    .on('nav, [role="navigation"]', { element() { proof.nav = true; } })
    .on('main, [role="main"]', { element() { proof.main = true; } })
    .on('input[type="search"], form[role="search"], [role="search"]', { element() { proof.search = true; } })
    .on('select[name="sort_by"], select[name="orderby"], select[name="sort"]', { element() { proof.sort = true; } })
    .on('[itemtype*="schema.org/BreadcrumbList"], .woocommerce-breadcrumb, [aria-label="Breadcrumb"]', { element() { proof.breadcrumbs = true; } })
    .on('a[href]', {
      element(el) {
        if (anchorCaptured++ >= 650) return;
        const raw = el.getAttribute('href') ?? '';
        if (raw.length > 2048 || !raw) return;
        const hint = (el.getAttribute('class') ?? '').slice(0,180);
        let link: URL;
        try { link = new URL(raw, url); } catch { return; }
        const path = link.pathname.replace(/\/$/, '') || '/';
        if (!path || !['http:', 'https:'].includes(link.protocol)) {
          if (link.protocol === 'mailto:' || link.protocol === 'tel:') proof.links.add('contact');
          return;
        }
        if (link.origin === url.origin && !seenCandidates.has(path) && proof.candidates.length < 70) {
          const kind = candidateKind(path, hint);
          const eligible = kind && sampleUrl(raw, url);
          if (kind && eligible) {
            proof.candidates.push({ path: eligible.pathname, kind, quality: productsIndex.test(eligible.pathname) ? 1 : 2 });
            seenCandidates.add(path);
          }
        }
        const sameMerchant = link.hostname === url.hostname;
        for (const signal of signals) {
          if (!linkPatterns[signal].test(path) || !sameMerchant && signal !== 'checkout') continue;
          proof.links.add(signal);
          if (openProduct) proof.detailLinks.add(signal);
          if (signal === 'checkout' && sameMerchant && link.protocol === 'http:') proof.insecureCheckout = true;
          if (signal === 'cart' || signal === 'checkout') {
            if (!sameMerchant) continue;
            const initial = { group: signal, label: named(el) ? 1 : 0 };
            activeAnchor = initial;
            onEnd(el, () => { proof.labels[initial.group].push(initial.label); activeAnchor = null; });
          }
        }
        if (/(?:^|[\s_-])(?:campaign|seasonal)-link(?:$|[\s_-])/i.test(hint) && sameMerchant) {
          if (link.protocol === 'http:') proof.campaignInsecure = true;
          else proof.campaignSecure = true;
        }
      },
      text(chunk) { if (activeAnchor && chunk.text.trim()) activeAnchor.label = 1; },
    })
    .on('main a img[alt], header a img[alt], nav a img[alt], footer a img[alt]', {
      element(el) { if (activeAnchor && el.getAttribute('alt')?.trim()) activeAnchor.label = 1; },
    })
    .on('form[action]', { element(el) {
      const raw = el.getAttribute('action');
      if (!raw || raw.length > 2048) return;
      let link: URL;
      try { link = new URL(raw, url); } catch { return; }
      if (link.hostname === url.hostname && /\/(?:cart(?:\/add)?|basket)(?:\/|$)/i.test(link.pathname)) {
        proof.purchase = true;
        if (link.protocol === 'http:') proof.insecureCart = true;
        else if (link.protocol === 'https:') formIds.add(el.getAttribute('id') || 'cart');
      }
    } })
    .on('button, input[name="add-to-cart"], input[name="add"], input[name="quantity"]', {
      element(el) {
        const name = el.getAttribute('name') ?? '';
        if (name === 'quantity' && quantity.length < 8) {
          quantity.push({ id: el.getAttribute('id') ?? '', name: named(el) && el.getAttribute('value') === null ||
            Boolean(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')) });
        }
        if (name !== 'add' && name !== 'add-to-cart' && !addControl.test(el.getAttribute('class') ?? '')) return;
        proof.purchase = true;
        if (el.tagName === 'input') { proof.labels.purchase.push(named(el) ? 1 : 0); return; }
        activeBuy = named(el) ? 1 : 0;
        onEnd(el, () => { if (activeBuy !== null) proof.labels.purchase.push(activeBuy); activeBuy = null; });
      },
      text(chunk) { if (activeBuy !== null && chunk.text.trim()) activeBuy = 1; },
    })
    .on('label[for]', { element(el) { if (labelIds.size < 140) labelIds.add(el.getAttribute('for') ?? ''); } })
    .on('main, [itemtype*="schema.org/Product"], .product__info-wrapper, .summary.entry-summary', {
      element(el) { openProduct++; onEnd(el, () => { openProduct--; }); },
    })
    .on('img', { element(el) {
      const src = el.getAttribute('src') ?? el.getAttribute('data-src');
      if (activeAnchor && el.getAttribute('alt')?.trim()) activeAnchor.label = 1;
      if (activeBuy !== null && el.getAttribute('alt')?.trim()) activeBuy = 1;
      if (src && !src.startsWith('data:')) proof.images = true;
      if (media.length >= 130) return;
      const hint = (el.getAttribute('class') ?? '') + ' ' + (el.getAttribute('itemprop') ?? '');
      const primary = /wp-post-image|product.featured.image|product-single__photo|product__media-image|\bimage\b(?=$)/i.test(hint.trim());
      const paths = [src, el.getAttribute('data-src'), el.getAttribute('data-large_image')].map(value => assetPath(value,url)).filter(Boolean);
      if (paths.length) media.push({ paths, primary, alt: Boolean(el.getAttribute('alt')?.trim()),
        sized: Number(el.getAttribute('width')) > 0 && Number(el.getAttribute('height')) > 0 ||
          /aspect-ratio\s*:/i.test(el.getAttribute('style') ?? '') });
    } })
    .on('[itemprop="price"], .woocommerce-Price-amount, .price-item--regular, .price-item--sale, [data-product-price]', {
      element(el) { proof.visiblePrice ||= Boolean(el.getAttribute('content') || el.getAttribute('data-product-price')); },
      text(chunk) { if (/[0-9]/.test(chunk.text)) proof.visiblePrice = true; },
    })
    .on('[data-current-price][data-compare-at-price][data-currency]', { element(el) {
      const currency = el.getAttribute('data-currency') ?? '';
      const current = el.getAttribute('data-current-price'), former = el.getAttribute('data-compare-at-price');
      if (/^[A-Z]{3}$/.test(currency) && numeric(current) && numeric(former) && Number(former) > 0 && proof.comparisons.length < 12) {
        proof.comparisons.push({ current: Number(current), former: Number(former) });
      }
    } })
    .on('.payment-icons, .payment-methods, [data-payment-methods]', { element() { proof.payment = true; } })
    .on('shopify-accelerated-checkout, .shopify-payment-button, [data-express-checkout]', { element() { proof.express = true; } })
    .on('[data-campaign] time[datetime], time[data-campaign][datetime]', {
      element(el) { if (proof.campaignDate.length < 20) proof.campaignDate.push((el.getAttribute('datetime') ?? '').slice(0,80)); },
    })
    .on('script[src*="/challenge-platform/"][src*="/orchestrate/"], #challenge-form, #shopify-section-main-password, form[action="/password"]', {
      element() { proof.blocked = true; },
    });

  const isHome = kind ? kind === 'homepage' : url.pathname === '/';
  const homeShopping = isHome ? readHomeShopping(rewriter, onEnd, url, (link, hint) => {
    if (candidateKind(link.pathname,hint) !== 'product') return null;
    return sampleUrl(link.href,url)?.pathname ?? null;
  }) : undefined;
  const itemSignals = !isHome && kind !== 'collection' ? readItemSignals(rewriter, onEnd) : undefined;
  const reader = rewriter.transform(document).body!.getReader();
  try { while (!(await reader.read()).done) { /* Drain to complete extraction. */ } }
  finally { reader.releaseLock(); }
  proof.title = title.trim().slice(0,280);
  proof.blocked ||= /^(just a moment|attention required|access denied|request blocked|verify you are human|security check|are you a robot|opening soon|password protected)\b/i.test(proof.title);
  proof.visible = sawBody && (proof.headings > 0 || proof.main || proof.candidates.length > 0 || proof.title.length > 0);
  proof.platform = (['Shopify','WooCommerce','BigCommerce','Magento','Wix','Squarespace','PrestaShop'] as Platform[])
    .find(platform => detected.has(platform)) ?? proof.platform;
  proof.labels.quantity.push(...quantity.filter(q => q.name || q.id && labelIds.has(q.id)).map(() => 1));
  const products = schemas.filter(node => typeIs(node,'Product') || typeIs(node,'ProductGroup'));
  proof.productSchema = products.length === 1;
  proof.collectionSchema = schemas.some(node => typeIs(node,'CollectionPage') || typeIs(node,'ItemList') &&
    nodes(node.itemListElement).length > 1);
  proof.breadcrumbs ||= schemas.some(node => typeIs(node,'BreadcrumbList'));
  if (proof.productSchema) {
    const product = products[0];
    proof.offers.push(...nodes(product.offers).flatMap(node => typeIs(node,'AggregateOffer') ? nodes(node.offers) : [node]));
    proof.offers = proof.offers.slice(0,20);
    for (const offer of proof.offers) proof.shipping.push(...nodes(offer.shippingDetails));
    for (const node of [...proof.offers, product]) proof.returns.push(...nodes(node.hasMerchantReturnPolicy));
    const references = list(product.image).map(src => assetPath(typeof src === 'string' ? src : object(src)?.url ?? object(src)?.contentUrl,url)).filter(Boolean);
    const match = media.find(image => image.paths.some(path => references.includes(path))) ?? media.find(image => image.primary);
    if (match) proof.productImage = { alt: match.alt, sized: match.sized };
    proof.images = Boolean(match || references.length);
  } else if (proof.productTemplate) {
    const match = media.find(image => image.primary);
    if (match) proof.productImage = { alt: match.alt, sized: match.sized };
    proof.images = Boolean(match);
  }
  proof.purchase ||= formIds.size > 0;
  return { ...proof, itemSignals, homeShopping, secureCartForm:formIds.size > 0 };
}

export function verifies(evidence: DocumentEvidence, kind: PageKind, routeHint = false) {
  if (!evidence.visible || evidence.blocked) return false;
  const productCount = evidence.candidates.filter(x => x.kind === 'product').length;
  if (kind === 'product') {
    if (routeHint && evidence.headings && evidence.itemSignals?.price && evidence.itemSignals.buy && evidence.itemSignals.description) return true;
    return (evidence.productSchema && (evidence.purchase || evidence.visiblePrice || evidence.offers.length > 0 || evidence.productTemplate) ||
      evidence.productTemplate && evidence.purchase) && (routeHint || evidence.productTemplate);
  }
  if (kind === 'collection') return !evidence.productTemplate &&
    (evidence.collectionTemplate && productCount > 0 || productCount >= 2 && (evidence.collectionSchema || routeHint));
  const storePlatform = evidence.platform !== 'Other or undetected';
  const catalogue = evidence.candidates.length > 0;
  return (catalogue && (evidence.links.has('cart') || evidence.purchase || storePlatform)) ||
    (productCount > 1 && (evidence.visiblePrice || evidence.collectionSchema)) ||
    (evidence.productSchema && evidence.purchase);
}
