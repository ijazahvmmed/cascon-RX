# Discoverability and measurement

Production canonical: https://www.cascondigital.com. NEXT_PUBLIC_SITE_URL can override the canonical for a domain migration; do not set this to a preview URL on production.

## Included
- Static HTML content, distinct page titles, descriptions, canonicals and social previews.
- Organization, WebSite, breadcrumbs and services structured data.
- Visible FAQs with matching FAQPage data on the home and services pages. FAQ markup does not promise Google FAQ rich results.
- Sitemap of active routes; careers permanently redirects to about.
- robots.txt permits public pages and named AI search crawlers.
- llms.txt and llms-full.txt are factual discovery aids generated from shared service/FAQ data. Neither is a ranking or priority directive.
- Native image sizing, responsive image variants, a single selected hero video, reduced-motion and data-saver handling.

## After deployment
1. Verify canonical URLs resolve on the production hostname and redirects converge on it.
2. Submit /sitemap.xml in Google Search Console and Bing Webmaster Tools.
3. Confirm CDN/firewall rules allow legitimate search crawlers, including OAI-SearchBot. robots.txt alone cannot override a firewall.
4. Use platform indexing and performance reports to measure results. Useful original content, relevant citations and demonstrable work matter more than repeating keywords.
5. Geist is self-hosted from the supplied variable font. GSAP text splitting runs after hydration; original headings remain present in server HTML and are restored when reduced motion is enabled.

## Meta Pixel
The existing pixel ID is retained; NEXT_PUBLIC_META_PIXEL_ID overrides it.
- PageView: once per pathname, after initialization. Query changes do not add page views.
- ViewContent: services/work visits and explicit service-anchor clicks.
- Contact: actual email, telephone or WhatsApp link clicks.
- ContactPanelOpen (custom): opens the floating contact chooser.
- BookingLinkClick (custom): opens the Cal.com scheduling flow.
- ProjectOutboundClick (custom): opens a named portfolio website.
- FAQExpand (custom): opens a FAQ.

No Lead, Purchase or Schedule event is sent for a click. A real confirmed conversion requires a scheduling callback/webhook and separate server integration. No contact details or enquiry content are added to custom event payloads. Validate delivery using Meta Events Manager Test Events after deployment and apply the business's consent requirements before enabling advertising tracking in a new market.

## Sources
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.openai.com/api/docs/bots
- https://github.com/darkroomengineering/lenis
- https://developers.facebook.com/docs/meta-pixel/reference/

Localhost visits are excluded from Meta Pixel initialization and measurement. Seven development-only dependency advisories remain in the ESLint toolchain; the production dependency audit is clean.

## AI question chooser
The FAQ control lets visitors copy a public, source-seeking question and open ChatGPT, Claude, Gemini, Grok or Perplexity. It does not send a message automatically or promise a recommendation. AIOutboundClick records the chosen provider; AIQuestionCopy records a successful copy action. Questions and answers remain server-rendered and feed the matching FAQPage and llms-full.txt.

## Portfolio and internal links
Finewares, Slept Club, Lumy Dates and Citysky Builders appear in the home, work and clients pages. Client logos link to stable project anchors; service tags, related projects and FAQ links connect relevant pages. Antigravity has been removed. The route checker verifies internal destinations and anchors alongside the original SEO checks. Actual client asset sources are recorded in brand-assets.json.
