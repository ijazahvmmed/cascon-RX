import type { Policies, PolicyKind } from './policy';
import type { Sample, ShoppingCheck } from '../../../lib/cro/model';
import type { DocumentEvidence } from './extract';

export interface ItemSignals {
  description: boolean;
  excerpt?: string;
  placeholder: boolean;
  price: boolean;
  invalidPrice: boolean;
  buy: boolean;
  shipping: boolean;
  returns: boolean;
}

export const voidTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const money = /(?:\p{Sc}|\b(?:INR|USD|EUR|GBP|AED|CAD|AUD|JPY|CHF|SEK|Rs\.?))\s*\d|\d[\d.,\s]*\s*(?:\p{Sc}|INR|USD|EUR|GBP|AED|CAD|AUD|JPY|CHF|SEK)/iu;

export function hasSellingPrice(value: string) {
  const current = /\b(?:current price(?: is)?|sale price|now(?: only)?)\s*:?\s*/i.exec(value);
  const amount = current ? value.slice(current.index + current[0].length) : value;
  const candidate = amount.split(/\b(?:save|savings|compare[- ]at|original(?:ly)?|was)\b/i, 1)[0].trim();
  const match = money.exec(candidate);
  return /^free$/i.test(candidate) || Boolean(match && !/[-−]\s*$/.test(candidate.slice(0,match.index)));
}

export function hasDeliveryFee(value: string) {
  const fee = /^(?:flat[ -]rate )?(?:shipping|delivery)(?: (?:fee|rate|charge|cost))?\s*(?:is|costs|of)?\s*:?\s*/i.exec(value);
  if (!fee) return false;
  const rest = value.slice(fee[0].length);
  return money.exec(rest)?.index === 0;
}

function disabled(el: Element) {
  return el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || /(?:^|\s)disabled(?:\s|$)/i.test(el.getAttribute('class') || '');
}

export function readItemSignals(rewriter: HTMLRewriter, onEnd: (el: Element, finish: () => void) => void) {
  const signals: ItemSignals = { description:false, placeholder:false, price:false, invalidPrice:false, buy:false, shipping:false, returns:false };
  let excluded = 0, inItem = 0, outsideItem = 0, inTable = 0, disabledGroup = 0;
  function within(selector: string, enter: () => void, leave: () => void) {
    rewriter.on(selector, { element(el) {
      if (!voidTags.has(el.tagName)) { enter(); onEnd(el, leave); }
    } });
  }
  within('template, script, style, noscript, del, s, [hidden], [aria-hidden="true"], [style*="display:none"], [style*="display: none"], product-recommendations, .related, .upsells, [data-testid="product-card"], [data-testid="related-products"], .product-card, .card-wrapper',
    () => excluded++, () => excluded--);
  within('table', () => inTable++, () => inTable--);
  within('fieldset[disabled], [inert]', () => disabledGroup++, () => disabledGroup--);
  within('footer, aside', () => outsideItem++, () => outsideItem--);
  within('article.product.type-product, div.product.type-product, form.variations_form.cart, product-info, .product__info-container, .product__info-wrapper, .summary.entry-summary, .product-info-main, [itemtype*="schema.org/Product"], [data-product-information], main [data-testid="product-details"], main [data-product-details], form[action*="/cart/add"]',
    () => inItem++, () => inItem--);

  function inspect(selector: string, apply: (value: string) => void,
    { outsideProduct = false, outermostOnly = false } = {}) {
    const buffers: { text: string }[] = [];
    rewriter.on(selector, {
      element(el) {
        if (voidTags.has(el.tagName) || excluded || outsideItem || (!outsideProduct && !inItem) ||
          buffers.length >= 8 || (outermostOnly && buffers.length)) return;
        const buffer = { text:'' };
        buffers.push(buffer);
        // Copy attributes before the element callback returns.
        const unavailable = disabled(el);
        const label = el.getAttribute('aria-label') || '';
        onEnd(el, () => {
          buffers.pop();
          if (!unavailable) apply((label + ' ' + buffer.text).replace(/\s+/g,' ').trim());
        });
      },
      text(chunk) {
        const buffer = buffers[buffers.length - 1];
        if (buffer && !excluded && buffer.text.length < 800) buffer.text += chunk.text.slice(0,800 - buffer.text.length);
      },
    });
  }
  const describe = (value: string) => {
    if (/^(?:coming soon|description (?:goes here|coming soon)|lorem ipsum\b.*|tbd)[.!]?$/i.test(value)) signals.placeholder = true;
    else if (value.length >= 24 && /\p{L}/u.test(value)) {
      signals.description = true;
      signals.excerpt ??= value.length > 150 ? value.slice(0,147).replace(/\s+\S*$/, '') + '…' : value;
    }
  };
  inspect('[class$="__description"], .product-description, [data-testid="product-description"], [itemprop="description"]', describe);
  inspect('.product__description, .woocommerce-product-details__short-description, #tab-description, #product-description, #productDescription, .product-single__description, .product__text.description, [id^="ProductDescription-"], [data-product-description]', describe, { outsideProduct: true });
  inspect('.price, [itemprop="price"], .woocommerce-Price-amount, .price-item--sale, .price-item--regular, [data-product-price], [data-testid="product-price"]', value => {
    if (inTable) return;
    if (/^(?:tbd|nan|price coming soon)[.!]?$/i.test(value)) signals.invalidPrice = true;
    else if (hasSellingPrice(value)) signals.price = true;
  }, { outermostOnly: true });
  inspect('.screen-reader-text, .visually-hidden, .sr-only', value => {
    if (inTable) return;
    const current = /\bcurrent price(?: is)?\s*:\s*([^;.!?]+)/i.exec(value);
    if (current && money.test(current[1])) signals.price = true;
  });
  function buyButton(value: string) {
    if (!disabledGroup && /add to (?:my |your |the )?(cart|bag|basket)|buy now|ajouter au panier|in den warenkorb|añadir al carrito/i.test(value) && !/sold out|unavailable|notify me|coming soon/i.test(value)) signals.buy = true;
  }
  inspect('button[name="add"], button[name="add-to-cart"], button.single_add_to_cart_button, button.product-form__submit, button[data-testid="add-to-cart"], button[data-add-to-cart]', buyButton);
  rewriter.on('input[type="submit"][name="add"], input[type="submit"][name="add-to-cart"]', { element(el) {
    if (!inItem || excluded || outsideItem || disabled(el) || el.hasAttribute('hidden') || el.hasAttribute('inert') ||
      el.getAttribute('aria-hidden') === 'true' || /display\s*:\s*none/i.test(el.getAttribute('style') || '')) return;
    buyButton(el.getAttribute('aria-label') || el.getAttribute('value') || '');
  } });
  inspect('p, li, dd, details, .shipping, .returns', value => {
    const days = /\b\d+(?:\s*[-–]\s*\d+)?[ -]*(?:business |working |calendar )?(?:days?|weeks?|hours?)\b/i;
    for (const phrase of value.split(/[.!;\n]/)) {
      if (phrase.includes('?')) continue;
      if (/\b(?:delivery|delivered|ships?|shipping|dispatch)\b/i.test(phrase) &&
          (days.test(phrase) || hasDeliveryFee(phrase.trim()) || !/\b(?:not|no|never)\b/i.test(phrase) && /free (?:standard )?(shipping|delivery)|(?:shipping|delivery) (?:is )?free/i.test(phrase))) signals.shipping = true;
      if (/\b(?:returns?|refunds?)\b/i.test(phrase) &&
          (days.test(phrase) || /no returns|returns? (?:are )?not accepted|non[- ]returnable/i.test(phrase))) signals.returns = true;
    }
  });
  return signals;
}

export function shoppingChecks(home: DocumentEvidence, product?: DocumentEvidence, attemptedPath?: string,
  policies: Policies = {}, collection?: DocumentEvidence, productStatus?: Sample['status']): ShoppingCheck[] {
  const signals = product?.itemSignals;
  const front = home.homeShopping;
  const path = product?.url.pathname ?? attemptedPath;
  const listedPrice = !signals?.invalidPrice && (path ? front?.pricedItems.has(path) : Boolean(front?.pricedItems.size));
  const homePath = home.url.pathname;
  const support = [home, product, collection].find(page => page?.homeShopping?.contact);
  const unavailable = productStatus === 'rate limited' || productStatus === 'blocked'
    ? 'The store stopped the visit to the product page.'
    : 'The scan did not reach a verified product page.';
  function check(title:string, verified:boolean | undefined, evidence:string, unknown:string, source?:string, issue?:string): ShoppingCheck {
    return {title, result:verified ? 'Confirmed' : issue ? 'Needs attention' : 'Could not confirm',
      detail:verified ? evidence : issue || unknown, source};
  }
  function terms(kind:PolicyKind): ShoppingCheck {
    const shipping = kind === 'shipping';
    const title = shipping ? 'Find delivery terms' : 'Find return terms';
    if (signals?.[kind]) return check(title,true,shipping ? 'The item details give a delivery time or shipping cost.'
      : 'The item details state a return period or whether returns are accepted.','',path);
    if (front?.[kind]) {
      const delivery = {free:'The homepage advertises a free-shipping offer.', time:'The homepage gives a dispatch or delivery time.', fee:'The homepage lists a delivery charge.'};
      const message = shipping ? delivery[front.shipping!] : typeof front.returns === 'number'
        ? 'The homepage lists a ' + front.returns + '-day return period.' : 'The homepage says returns are unavailable.';
      return check(title,true,message,'',homePath);
    }
    const policy = policies[kind];
    const sought = shipping ? 'a delivery estimate or shipping cost' : 'a return window or an explicit final-sale policy';
    const detail = policy ? policy.checked ? 'The linked policy was checked for ' + sought + '. No clear statement was verified.'
      : 'The store links to a policy. Its terms could not be checked during this visit.'
      : 'The pages checked did not establish ' + sought + '.';
    return check(title,Boolean(policy?.quote), 'The linked policy says “' + policy?.quote + '”',detail,policy?.path);
  }
  return [
    check('Find an item',Boolean(product || front?.itemLink),product ? 'We followed a store link and opened a product.'
      : 'The homepage shows a named link to an item.',unavailable,product?.url.pathname ?? homePath),
    check('Read about the item',signals?.description,signals?.excerpt ? 'From the item description: “' + signals.excerpt + '”'
      : 'The product has its own written description.',product ? 'The item page opened, but its description could not be identified separately from the rest of the page.' : unavailable,
      path,signals?.placeholder ? 'The description still contains placeholder text.' : undefined),
    check('See the item price',signals?.price || listedPrice,signals?.price ? 'The item details show a current selling price.'
      : 'The homepage shows a selling price beside the item link.','No current selling price could be tied to the sampled item.',
      signals?.price ? path : homePath,signals?.invalidPrice ? 'The price area contains an unfinished price.' : undefined),
    check('Start buying the item',signals?.buy,'The item has an available button to add it to the cart or buy it.',
      product ? 'The item page opened, but an enabled purchase button could not be verified.' : unavailable,path),
    terms('shipping'), terms('returns'),
    check('Reach customer support',Boolean(support),'This page contains contact details or a named customer support link.',
      'The pages checked did not show a named contact link, phone link or email link that the scan could verify.',support?.url.pathname),
  ];
}
