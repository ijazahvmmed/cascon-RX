export type PolicyKind = 'shipping' | 'returns';
export interface PolicyReading { path:string; quote?:string; checked:boolean }
export type Policies = Partial<Record<PolicyKind,PolicyReading>>;

const deliveryTime = /\b(?:dispatch(?:ed)?|deliver(?:y|ed)?|ships?|shipped|shipping|arriv(?:es?|al))\b[^.!?]{0,60}?\b\d{1,3}(?:\s*(?:-|–|to)\s*\d{1,3})?[ -]*(?:(?:business|working|calendar)\s+)?(?:days?|weeks?|hours?)\b/i;
const returnWindow = /\b(?:\d{1,3}[ -]day (?:return policy|returns?)|return(?:s|ing)?\b[^.!?]{0,65}?\bwithin\s+\d{1,3}[ -](?:calendar )?days?|within\s+\d{1,3}[ -]days?[^.!?]{0,50}?\b(?:request a return|return the item))\b/i;

export async function readPolicy(document: Response, kind: PolicyKind) {
  const visible = new HTMLRewriter().on('script,style,template,noscript,nav,footer,header,aside,blockquote,[hidden],[inert],[aria-hidden="true"],[style*="display:none"],[style*="display: none"]',
    {element(el) { el.remove(); }}).transform(document);
  let quote: string | undefined;
  let current: {text:string} | undefined;
  let blocked = false;
  let title = '';
  const reviewed = new HTMLRewriter().on('title', {text(chunk) { title += chunk.text.slice(0,120-title.length); }})
    .on('#challenge-form, form[action="/password"]', {element() { blocked = true; }})
    .on('p,li,dd,td', {
      element(el) {
        if (current || quote) return;
        const entry = {text:''};
        current = entry;
        el.onEndTag(() => {
          if (entry.text.length >= 1000) { current = undefined; return; }
          for (const part of entry.text.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/)) {
            const sentence = part.trim();
            if (!sentence || sentence.length > 260 || sentence.includes('?')) continue;
            const match = kind === 'returns' ? returnWindow.test(sentence) || /\b(?:we do not accept returns|all sales are final|returns are not accepted)\b/i.test(sentence)
              : deliveryTime.test(sentence) || !/\b(?:not|never|no)\b/i.test(sentence) && /\b(?:free (?:standard )?shipping|shipping (?:is free|costs [₹$£€]\s*\d))\b/i.test(sentence);
            if (match) { quote = sentence; break; }
          }
          current = undefined;
        });
      },
      text(chunk) { if (current && current.text.length < 1000) current.text += chunk.text.slice(0,1000-current.text.length); },
    }).transform(visible);
  await reviewed.arrayBuffer();
  return blocked || /just a moment|verify you are human|access denied/i.test(title) ? undefined : quote;
}
