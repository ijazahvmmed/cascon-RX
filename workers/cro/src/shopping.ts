import type { ShoppingCheck } from '../../../lib/cro/model';
import type { DocumentEvidence } from './extract';

export interface ItemSignals {
  description: boolean;
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
    else if (value.length >= 24 && /\p{L}/u.test(value)) signals.description = true;
  };
  inspect('[class$="__description"], .product-description, [data-testid="product-description"], [itemprop="description"]', describe);
  inspect('.product__description, .woocommerce-product-details__short-description, #tab-description, [data-product-description]', describe, { outsideProduct: true });
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

export function shoppingChecks(home: DocumentEvidence, product?: DocumentEvidence, attemptedPath?: string): ShoppingCheck[] {
  const signals = product?.itemSignals;
  const front = home.homeShopping;
  const path = product?.url.pathname ?? attemptedPath;
  const listedPrice = !signals?.invalidPrice && (path ? front?.pricedItems.has(path) : Boolean(front?.pricedItems.size));
  const delivery = { free:'The homepage advertises a free-shipping offer.', time:'The homepage gives a dispatch or delivery time.', fee:'The homepage lists a delivery charge.' };
  const confirmed = (title: string, yes: boolean | undefined, good: string, bad?: string): ShoppingCheck => ({
    title, result: yes ? 'Confirmed' : bad ? 'Needs attention' : 'Could not confirm',
    detail: yes ? good : bad || (!product && title !== 'Reach customer support' ? 'We could not check a product page.' : 'We could not confirm this on the pages we checked.'),
  });
  return [
    confirmed('Find an item', Boolean(product || front?.itemLink), product
      ? 'We followed a store link and opened a product.' : 'The homepage shows a link to an item.'),
    confirmed('Read about the item', signals?.description, 'The product has its own written description.',
      signals?.placeholder ? 'The description still contains placeholder text.' : undefined),
    confirmed('See the item price', signals?.price || listedPrice, signals?.price
      ? 'We found the current price in the item details.' : 'The homepage shows a selling price beside the link to the item.',
      signals?.invalidPrice ? 'The price area contains an unfinished price.' : undefined),
    confirmed('Start buying the item', signals?.buy, 'The item has an available button to add it to the cart or buy it.'),
    confirmed('Find delivery terms', signals?.shipping || Boolean(front?.shipping), front?.shipping && !signals?.shipping
      ? delivery[front.shipping] : 'The item details give a delivery time or say what shipping costs.'),
    confirmed('Find return terms', signals?.returns || Boolean(front?.returns), signals?.returns
      ? 'The item details give a return period or say that returns are unavailable.' : typeof front?.returns === 'number'
        ? 'The homepage lists a ' + front.returns + '-day return period.' : 'The homepage says returns are unavailable.'),
    confirmed('Reach customer support', front?.contact, 'The homepage has contact details or a customer support link.'),
  ];
}
