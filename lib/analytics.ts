export type SourceType = 'organic-search' | 'ai-referral' | 'other-referral' | 'direct' | 'paid-campaign' | 'campaign';

const AI_REFERRER_HOST = /^(?:[a-z0-9-]+\.)*(?:chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|grok\.com|copilot\.microsoft\.com|copilot\.com)$/i;

export function sourceType(referrer: string, search = ''): SourceType {
  const params = new URLSearchParams(search);
  if (['gclid','gbraid','wbraid','msclkid'].some(key => params.has(key))) return 'paid-campaign';
  const medium = params.get('utm_medium')?.toLowerCase();
  if (medium && /^(cpc|ppc|paid|paid_social|display|paidsearch)$/.test(medium)) return 'paid-campaign';
  if (AI_REFERRER_HOST.test(params.get('utm_source') ?? '')) return 'ai-referral';
  if (medium && !['organic','referral'].includes(medium)) return 'campaign';
  if (!referrer) return 'direct';
  try { const host = new URL(referrer).hostname.toLowerCase();
    if (AI_REFERRER_HOST.test(host)) return 'ai-referral';
    if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host)) return 'organic-search';
    return 'other-referral';
  } catch { return 'other-referral'; }
}
export function contactIntent(href: string, bookingUrl: string) {
  if (href.startsWith('https://wa.me/')) return { event: 'Contact intent', channel: 'whatsapp' };
  if (href.startsWith('mailto:')) return { event: 'Contact intent', channel: 'email' };
  if (href.startsWith('tel:')) return { event: 'Contact intent', channel: 'phone' };
  if (href === bookingUrl || href.startsWith(bookingUrl + '?')) return { event: 'Booking intent', channel: 'calendar' };
  return null;
}
