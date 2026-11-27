import { hasDeliveryFee, hasSellingPrice, voidTags } from './shopping';

export interface HomeShopping {
  itemLink: boolean;
  pricedItems: Set<string>;
  shipping?: 'free' | 'time' | 'fee';
  returns?: number | 'unavailable';
  contact: boolean;
}

// A price belongs to a listing only when the card identifies one product.
export function readHomeShopping(rewriter: HTMLRewriter, page: URL, productPath: (url: URL, hint: string) => string | null) {
  const result: HomeShopping = { itemLink:false, pricedItems:new Set(), contact:false };
  let hidden = 0;
  rewriter.on('template, script, style, noscript, del, s, blockquote, q, .testimonial, .review, [itemprop="review"], [hidden], [inert], [aria-hidden="true"], [style*="display:none"], [style*="display: none"], .price--compare, .compare-at-price, .price__savings', {
    element(el) {
      if (voidTags.has(el.tagName)) return;
      hidden++;
      el.onEndTag(() => { hidden--; });
    },
  });
  let card: { path: string; ambiguous: boolean; named: boolean; price: boolean } | undefined;
  rewriter.on('product-item, product-card, .product-item, .product-card, .card-wrapper, .grid-product, li.product, .wc-block-product, [data-product-card]', {
    element(el) {
      if (hidden || card || voidTags.has(el.tagName) || result.pricedItems.size >= 40) return;
      const listing = { path:'', ambiguous:false, named:false, price:false };
      card = listing;
      el.onEndTag(() => {
        if (listing.named && listing.price && !listing.ambiguous) result.pricedItems.add(listing.path);
        card = undefined;
      });
    },
  });
  const base = page.hostname.replace(/^www\./, '');
  const helpHosts = new Set(['help.', 'support.', 'contact.'].map(prefix => prefix + base));
  let link: { text: string } | undefined;
  let visited = 0;
  rewriter.on('a[href]', {
    element(el) {
      link = undefined;
      const href = el.getAttribute('href') ?? '';
      if (hidden || visited++ >= 650 || !href || href.length > 2048) return;
      let url: URL;
      try { url = new URL(href,page); } catch { return; }
      const path = url.origin === page.origin ? productPath(url,el.getAttribute('class') ?? '') : null;
      const contact = url.origin === page.origin && /(?:^|\/)(?:contact(?:-us)?|customer-service|customer-care|customer-support|support|get-in-touch)\/?$/i.test(url.pathname) ||
        url.protocol === 'mailto:' && url.pathname.includes('@') || url.protocol === 'tel:' && /\d{3}/.test(url.pathname);
      const helpHost = url.protocol === 'https:' && !url.port && !url.username && !url.password && helpHosts.has(url.hostname);
      if (!path && !contact && !helpHost) return;
      const listing = card;
      if (path && listing) {
        if (listing.path && listing.path !== path) listing.ambiguous = true;
        listing.path = path;
      }
      const anchor = { text: (el.getAttribute('aria-label') || el.getAttribute('title') || '').slice(0,120) };
      link = anchor;
      el.onEndTag(() => {
        const name = anchor.text.trim();
        if (name && path) { result.itemLink = true; if (listing) listing.named = true; }
        if (name && (contact || helpHost && /\b(contact|help cent(?:er|re)|customer (?:care|support|service)|get in touch)\b/i.test(name))) result.contact = true;
        link = undefined;
      });
    },
    text(chunk) { if (!hidden && link && link.text.length < 120) link.text += chunk.text.slice(0,120 - link.text.length); },
  });
  rewriter.on('a img[alt]', { element(el) {
    if (link && !hidden && !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true' && !link.text.trim()) {
      link.text = (el.getAttribute('alt') ?? '').slice(0,120);
    }
  } });

  function capture(selector: string, enabled: () => boolean, receive: (value: string) => void) {
    let current: { text: string } | undefined;
    rewriter.on(selector, {
      element(el) {
        if (current || hidden || voidTags.has(el.tagName) || !enabled()) return;
        const entry = { text:'' };
        current = entry;
        el.onEndTag(() => {
          if (entry.text.length <= 180) receive(entry.text.replace(/\s+/g,' ').trim());
          current = undefined;
        });
      },
      text(chunk) { if (current && !hidden && current.text.length <= 180) current.text += chunk.text.slice(0,181-current.text.length); },
    });
  }
  capture('.price, .price-item--sale, .woocommerce-Price-amount, [data-product-price]', () => Boolean(card), value => {
    if (card && hasSellingPrice(value)) card.price = true;
  });
  capture('p, li, .announcement-bar__message, [data-announcement], .service-title', () => !card && (!result.shipping || !result.returns), value => {
    if (value.includes('?')) return;
    if (!/\b(?:not|no|never)\b/i.test(value)) {
      if (/^free (?:standard |domestic |worldwide )?(?:shipping|delivery)(?: (?:today|on|for|over|within|in|to)\b[^.!?]*)?[.!]?$/i.test(value)) result.shipping = 'free';
      else if (/^(?:we )?(?:ships?|delivers?|dispatch(?:es)?) (?:in|within) \d+(?:[-–]\d+)? (?:business |working )?(?:days?|weeks?)[.!]?$/i.test(value)) result.shipping = 'time';
      else if (hasDeliveryFee(value)) result.shipping = 'fee';
    }
    if (/^(?:no returns(?: accepted)?|returns are not accepted)[.!]?$/i.test(value)) result.returns = 'unavailable';
    const window = /^(?:(?:free |easy )?(\d{1,4})[ -]days?[ -](?:returns?|refunds?)|(?:returns?|refunds?) (?:accepted )?within (\d{1,4})[ -](?:calendar )?days?)[.!]?$/i.exec(value);
    const days = window && Number(window[1] ?? window[2]);
    if (days) result.returns = days;
  });
  return result;
}
