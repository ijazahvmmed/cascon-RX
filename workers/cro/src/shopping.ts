import type { ShoppingCheck } from '../../../lib/cro/model';
import type { DocumentEvidence } from './extract';

export interface ItemSignals {
  contact: boolean;
  description: boolean;
  placeholder: boolean;
  price: boolean;
  invalidPrice: boolean;
  buy: boolean;
  shipping: boolean;
  returns: boolean;
}

const emptyTags = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));

export function readItemSignals(rewriter: HTMLRewriter, page: URL) {
  const signals: ItemSignals = { contact:false, description:false, placeholder:false, price:false, invalidPrice:false, buy:false, shipping:false, returns:false };
  let excluded = 0, inItem = 0, outsideItem = 0, inTable = 0;
  function within(selector: string, enter: () => void, leave: () => void) {
    rewriter.on(selector, { element(el) {
      if (!emptyTags.has(el.tagName)) { enter(); el.onEndTag(leave); }
    } });
  }
  within('template, script, style, noscript, del, s, [hidden], [aria-hidden="true"], [style*="display:none"], [style*="display: none"], product-recommendations, .related, .upsells, .product-card, .card-wrapper',
    () => excluded++, () => excluded--);
  within('table', () => inTable++, () => inTable--);
  within('footer, aside', () => outsideItem++, () => outsideItem--);
  let contactText = '';
  let contactLink = false;
  rewriter.on('a[href]', {
    element(el) {
      contactLink = false;
      if (excluded) return;
      let url: URL;
      try { url = new URL(el.getAttribute('href') || '', page); } catch { return; }
      contactLink = url.origin === page.origin && /(?:^|\/)(?:contact(?:-us)?|customer-service|support)\/?$/i.test(url.pathname) ||
        url.protocol === 'mailto:' && url.pathname.includes('@') || url.protocol === 'tel:' && /\d{3}/.test(url.pathname);
      if (!contactLink) return;
      contactText = el.getAttribute('aria-label') || el.getAttribute('title') || '';
      el.onEndTag(() => { if (contactText.trim()) signals.contact = true; contactLink = false; });
    },
    text(chunk) { if (contactLink && !excluded && contactText.length < 100) contactText += chunk.text.slice(0,100); },
  });
  within('article.product.type-product, div.product.type-product, form.variations_form.cart, product-info, .product__info-container, .product__info-wrapper, .summary.entry-summary, .product-info-main, [itemtype*="schema.org/Product"], [data-product-information], form[action*="/cart/add"]',
    () => inItem++, () => inItem--);

  function inspect(selector: string, apply: (value: string) => void, scoped = true) {
    const buffers: { text: string }[] = [];
    rewriter.on(selector, {
      element(el) {
        if (emptyTags.has(el.tagName) || excluded || outsideItem || (scoped && !inItem) || buffers.length >= 8) return;
        const buffer = { text:'' };
        buffers.push(buffer);
        // Copy attributes before the element callback returns.
        const unavailable = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || /(?:^|\s)disabled(?:\s|$)/i.test(el.getAttribute('class') || '');
        const label = el.getAttribute('aria-label') || '';
        el.onEndTag(() => {
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
  inspect('[class$="__description"], [class$="__summary"], .product-description', describe);
  inspect('.product__description, .woocommerce-product-details__short-description, #tab-description, [data-product-description], [itemprop="description"]', describe, false);
  const money = /(?:\p{Sc}|\b(?:INR|USD|EUR|GBP|AED|CAD|AUD|JPY|CHF|SEK|Rs\.?))\s*\d|\d[\d.,\s]*\s*(?:\p{Sc}|INR|USD|EUR|GBP|AED|CAD|AUD|JPY|CHF|SEK)/iu;
  inspect('.price, [itemprop="price"], .woocommerce-Price-amount, .price-item--sale, .price-item--regular, [data-product-price]', value => {
    if (inTable) return;
    if (/^(?:tbd|nan|price coming soon)[.!]?$/i.test(value)) signals.invalidPrice = true;
    else if (money.test(value) || /^free$/i.test(value)) signals.price = true;
  });
  inspect('.screen-reader-text, .visually-hidden, .sr-only', value => {
    if (inTable) return;
    const current = /\bcurrent price(?: is)?\s*:\s*([^;.!?]+)/i.exec(value);
    if (current && money.test(current[1])) signals.price = true;
  });
  inspect('button[name="add"], button[name="add-to-cart"], button.single_add_to_cart_button, button.product-form__submit', value => {
    if (/add to (?:my |your |the )?(cart|bag|basket)|buy now|ajouter au panier|in den warenkorb|añadir al carrito/i.test(value) && !/sold out|unavailable|notify me|coming soon/i.test(value)) signals.buy = true;
  });
  inspect('p, li, dd, details, .shipping, .returns', value => {
    const days = /\b\d+(?:\s*[-–]\s*\d+)?[ -]*(?:business |working |calendar )?(?:days?|weeks?|hours?)\b/i;
    for (const phrase of value.split(/[.!;\n]/)) {
      if (phrase.includes('?')) continue;
      if (/\b(?:delivery|delivered|ships?|shipping|dispatch)\b/i.test(phrase) &&
          (days.test(phrase) || !/\b(?:not|no|never)\b/i.test(phrase) && /free (?:standard )?(shipping|delivery)|(?:shipping|delivery) (?:is )?free/i.test(phrase))) signals.shipping = true;
      if (/\b(?:returns?|refunds?)\b/i.test(phrase) &&
          (days.test(phrase) || /no returns|returns? (?:are )?not accepted|non[- ]returnable/i.test(phrase))) signals.returns = true;
    }
  });
  return signals;
}

export function shoppingChecks(home: DocumentEvidence, product?: DocumentEvidence): ShoppingCheck[] {
  const signals = product?.itemSignals;
  const confirmed = (title: string, yes: boolean | undefined, good: string, bad?: string): ShoppingCheck => ({
    title, result: yes ? 'Confirmed' : bad ? 'Needs attention' : 'Could not confirm',
    detail: yes ? good : bad || (!product && title !== 'Reach customer support' ? 'We could not check a product page.' : 'We could not confirm this on the pages we checked.'),
  });
  return [
    confirmed('Reach a product', Boolean(product), 'We followed a store link and opened a product.'),
    confirmed('Read about the item', signals?.description, 'The product has its own written description.',
      signals?.placeholder ? 'The description still contains placeholder text.' : undefined),
    confirmed('See the item price', signals?.price, 'We found the current price in the item details.',
      signals?.invalidPrice ? 'The price area contains an unfinished price.' : undefined),
    confirmed('Choose to add the item', signals?.buy, 'We found a named, enabled add-to-cart button in the item details.'),
    confirmed('Find delivery terms', signals?.shipping, 'The item details mention a delivery time or free delivery.'),
    confirmed('Find return terms', signals?.returns, 'The item details give a return period or say that returns are unavailable.'),
    confirmed('Reach customer support', home.itemSignals?.contact, 'The homepage has contact details or a customer support link.'),
  ];
}
