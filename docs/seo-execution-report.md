# SEO execution report

Prepared 10 November 2026. Changes are local code changes; production deployment is not part of this execution.

## Audit and confirmed findings
- Framework: Next.js 15.5.29, React 18, App Router with server-rendered/static content; Geist, GSAP and Lenis. Content is maintained in typed local data files. No active blog CMS or detailed service/project route system existed.
- Baseline Git revision: 4f91737. The working tree was clean at the start of this request.
- A Vercel project link is present locally; no checked-in deploy pipeline was found. No production DNS or hosting configuration was changed.
- Direct HTTP reads of production home, services, work, about and robots returned 200. Their expected canonicals and server HTML were present. The non-www HTTPS URL resolved to www through a temporary 302. A trailing slash received 308; HTTP plus a trailing slash needed two redirects. Tracking-query URLs retained the clean canonical. The 302 should become permanent in the hosting domain configuration; application code cannot override a redirect applied before the request reaches it. The web-search fetcher could not open the domain, so direct HTTP was used; see seo-live-audit.json.
- Existing metadata, sitemap, real 404 page, careers redirect, original image assets, FAQ content, reduced-motion behaviour and basic pixel tracking were already implemented. These were not reported as newly fixed defects.
- Confirmed gaps: individual commercial intents shared one services page; portfolio cards linked externally or to fragments without their own detail pages; no insights system; no explicit preview indexing policy; Meta route categorisation excluded nested services/work paths; Plausible did not receive enquiry-intent events; next lint was deprecated although baseline lint passed.
- No Search Console, Bing Webmaster or private analytics reporting connector was available. No private environment values were read. Current rankings, search volume, conversions and field Core Web Vitals could not be established.

## Priority and implementation
Dedicated service coverage and crawlable project relationships were prioritised over more AI-specific files. Google states that normal search eligibility and useful content underpin AI feature inclusion; special AI markup is not required. See [Google guidance](https://developers.google.com/search/docs/appearance/ai-features).

### New content and routes
- /services/shopify-development
- /services/shopify-cro
- /services/shopify-redesign
- /services/woocommerce-to-shopify
- /services/ai-product-photography
- /services/ai-video-production
- /work/finewares, /work/slept-club, /work/lumy-dates, /work/citysky-builders, /work/bagus
- /insights and two guides: /insights/shopify-cro-audit-methodology and /insights/woocommerce-to-shopify-migration-checklist

Services have distinct buyer intent, fit, deliverables, proposed workflows, required inputs, useful objections, evidence links and contact CTAs. Guides provide an issue-record/decision framework and a migration readiness checklist. Shopify platform facts are linked to the relevant primary documentation. No package prices, case-study metrics, testimonials, certifications or named expert bylines were invented.

Project pages publish only supported brand context and owner-confirmed scope. They are project overviews, not complete outcome case studies. Optional documentedDetails/verifiedOutcomes sections are implemented but have no speculative entries. Missing historical problems, technical decisions, permissions and results are listed in content-evidence-requests.md.

### Architecture and internal links
New reusable ContentIntro, Breadcrumbs, ContentCta and ServiceDirectory components use the existing type, gradients, spacing and motion. The existing header, brand, FAQ/AI chooser, contact panel, outbound client links and original service/project fragments remain available. Service directory, contextual homepage links, client logos, related projects, profile links and insights connect the content. No city-name landing pages or hreflang variants were created.

### Metadata and schema
New routes have distinct titles, descriptions, canonicals and social metadata. Visible breadcrumbs match BreadcrumbList. Detailed services use Service with a shared organization identity; guides use Article with an Organization author; project overviews use CreativeWork describing the overview itself. WebPage identities relate content to the site and business. No review/rating/Person schema was introduced. Existing FAQs remain accurate; no expectation of commercial FAQ rich results is asserted.

### Technical work
- Sitemap generation now discovers the actual Next production routes, validates their HTTP responses and maintains source-based modification dates. The former hand-maintained registry was removed; see sitemap-and-indexing.md.
- Development, Vercel previews and SITE_INDEXABLE=false receive noindex metadata, an X-Robots-Tag header and restricted crawler/sitemap output. On other hosts, staging must set SITE_INDEXABLE=false. Canonicals remain on the business domain.
- Search-related OAI-SearchBot, PerplexityBot/Perplexity-User and Claude search/user agents remain allowed on public production content; training-agent policy is unchanged. Search crawling and training are separate controls, as documented by [OpenAI](https://developers.openai.com/api/docs/bots), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) and [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). No firewall, access control or private route was opened.
- Existing llms.txt now links to the real service and guide routes; no ranking-priority instructions were added.
- Lint command migrated to the supported ESLint CLI. No new runtime SEO library or dependency was added.
- Portfolio image sizes now distinguish the three-column layouts from the two-column work page, reducing unnecessary requested image widths. No measured LCP/INP/CLS improvement is claimed.
- Existing video sizes were inspected: vertical 4,224,261 bytes; horizontal 10,830,062 bytes. Existing reduced-motion/data-saver and offscreen/background playback handling is retained. Further compression requires a visual-quality comparison; no claimed video-byte reduction is made.

### Measurement
Existing Plausible pageviews and Meta PageView deduplication are preserved. New Plausible Contact intent and Booking intent events contain only channel, public content path, initial public landing path and a broad referral category. Campaign indicators are used for classification without storing their values. Session storage is optional; failures do not block the page. No email address, phone number, question text or query string is included in the custom payload. Meta ViewContent now covers detailed services and project pages.

These events measure intent. No click emits a confirmed Lead, Schedule or Purchase. Completed and qualified enquiries require calendar/CRM evidence or an approved server integration. The privacy page describes the added measurement.

## Main files
Content: data/commercial-services.ts, data/project-profiles.ts, data/insights.ts, new dynamic static routes and app/content.css. Discovery: data/sitemap-manifest.json, scripts/build-sitemap.mjs, lib/content.ts, app/services/page.tsx, components/CaseCard.tsx, ClientLogoGrid.tsx, RelatedProjects.tsx, homepage and footer links. Technical: lib/seo.ts, lib/indexing.ts, next.config.mjs, layout metadata, robots, sitemap and llms.txt. Measurement: lib/analytics.ts, EnquiryAnalytics.tsx, MetaPixel.tsx, privacy page. Validation: scripts/check-site.mjs, check-policy.cjs and check-pixel.cjs.

## Verification setup and measurement plan
1. Google Search Console: verify a domain property through an owner-authorised DNS change, or choose a URL-prefix property and set GOOGLE_SITE_VERIFICATION to the HTML verification token, then rebuild. This task does not change DNS. Inspect the production canonical and submit /sitemap.xml after deployment.
2. Bing Webmaster Tools: verify/import the site with owner access; BING_SITE_VERIFICATION supports the HTML tag token after rebuild. Submit the same sitemap and inspect key service URLs. Do not submit local preview URLs.
3. Plausible: create exact-name custom event goals Contact intent and Booking intent. Review channel, landing_path, content_path and source_type properties. Validate actual event delivery in the production dashboard; localhost measurement is suppressed. Custom events may count against the existing plan’s event allowance. See [Plausible custom-event documentation](https://plausible.io/docs/custom-event-goals).
4. Meta: use Test Events to verify nested route ViewContent and existing contact/booking behaviour. Confirm actual booking completion only through a separately approved integration.
5. Keep a lead register with date, source where known, enquiry category, qualified/unqualified, reason and commercial outcome. Use submitted information lawfully; do not push project briefs or personal details into web analytics.
6. Establish a 28-day baseline when enough data exists. Review non-branded queries, impressions, clicks, landing pages, device and country for India first, UAE second. Compare aligned windows and annotate releases/campaigns. Do not interpret every change as an SEO effect.
7. Track indexed canonical commercial pages with URL Inspection, errors/redirects with crawler checks, organic intent-to-qualified-enquiry progression with the lead register, and Core Web Vitals through field reports.
8. Maintain a small dated list of genuine buying questions for AI discovery. Record platform, question, answer, cited URLs and whether Cascon was mentioned. Repeat under comparable conditions; manual observations are not a market-share or universal-ranking metric.

## Known limitations and remaining actions
Production publishing and external verification/account setup require owner action. Hosting canonical redirects and CDN crawler access should be verified after release; application code cannot establish firewall behaviour. Protected previews are preferable to relying on robots alone, and previously indexed staging URLs may need search-console removal. No new location claims are made. Evidence collection, independently verifiable credibility and actual query/conversion data remain the highest-value next inputs. See organic-growth-backlog.md.

## Validation log
Completed locally on 10 November 2026:
- Baseline npm run lint: passed with the Next lint deprecation warning; the migrated ESLint CLI command subsequently passed with zero warnings.
- npm run typecheck: passed.
- npm run build: passed; all known detail pages prerendered through generateStaticParams.
- npm run test:site: passed all 22 canonical pages, unique titles/descriptions/H1s, JSON-LD identity/type checks, 82 internal destinations/anchors, sitemap completeness, home-to-page crawl reachability, robots, AI documents, careers redirect, missing-page and unknown-detail-route 404s, 43 image URLs and the social preview.
- npm run test:pixel: passed pageview deduplication, nested-service ViewContent, contact/booking intent semantics, FAQ/AI events and local/preview suppression.
- npm run test:policy: passed preview policy, restricted sitemap/robots, header configuration and source/intent classification, including paid versus organic signals.
- node scripts/check-preview.mjs against a real next dev server: passed noindex X-Robots-Tag headers, robots AND googlebot metadata, Disallow: /, empty sitemap and suppression of the production Plausible script. Vercel preview environment handling was tested at policy level, not on a deployed Vercel preview.
- npm audit --omit=dev --json: zero production vulnerabilities reported. This is not an audit of all development dependencies.
- git diff --check: passed; only Git’s Windows line-ending notices were emitted.
- Chrome: every one of the 14 new routes checked at a 320px viewport; document width matched the available viewport without horizontal overflow. Desktop service and project pages were visually inspected. Buyer FAQs, article anchors (target clear of navigation), mobile menu opening/Escape/scroll lock, and service-to-project navigation were exercised.
- Reduced motion: emulation on a new service page restored the original heading, removed split-word masks and disabled Lenis; the override was then reset. Desktop viewport restored after mobile checks.
- Fresh production-preview service tab reported no browser error entries. Screenshot evidence is saved in the task’s visualizations directory; route-width results are in seo-browser-validation.json.

Structured data validation here covers parseability, stable entity references, route agreement and expected types; an external rich-results validator was not run against the unpublished URLs. No field LCP, INP, CLS, keyword-ranking, indexation, AI-citation or conversion improvement is claimed. The browser’s read-only inspection surface did not expose Navigation Timing, and local navigation would not be a production field benchmark in any event.

Preview measurement safeguard: the layout also suppresses Plausible, Meta initialization and enquiry analytics for non-indexable builds, avoiding contamination of production reports. Pixel preview suppression is covered by the harness test.

## Mandatory sitemap follow-up
The native sitemap now serves a build-validated content manifest with 22 URLs and 22 verified source-based lastmod dates. Automatic discovery, exclusion/uniqueness checks, full-rebuild date stability and production file tracing passed. Exact URLs, lifecycle, date provenance and Search Console/Bing instructions are documented in sitemap-and-indexing.md. A live comparison confirmed that the deployed site still has the older eight-URL sitemap without dates and lacks the 14 new routes. That deployment difference is not reported as a passed production-site check. See sitemap-build-validation.json and sitemap-live-validation.json.
