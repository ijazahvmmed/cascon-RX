# Cascon Digital SEO and authority upgrade

Review branch is codex/seo-aeo-authority, based on GitHub main at 4184ca8.

## Before the upgrade

Production served indexable homepage, case study and Insights HTML. The public sitemap listed 25 URLs and both indexing endpoints returned 200. The 25 production routes returned 200 with matching canonical URLs and main HTML after retrying transient fetch errors. The bare domain redirects permanently to www, trailing slash variants redirect permanently and /careers sends a 301 to /about. Keep the host redirect at Vercel. Neither Google nor Bing verification markup appeared on the homepage. Account or DNS ownership must be confirmed separately.

The repository already had search crawler rules, a preview indexing policy, a build-time sitemap and discovery gate, IndexNow, footer links to Work and Insights, JSON-LD helpers and privacy-conscious analytics. The existing crawler rules permit public content to Googlebot and Bingbot through the wildcard group and explicitly name the relevant answer-engine agents. They exclude /api/. This upgrade leaves the training-crawler policy as configured. See [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots), [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) and [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

## Content and code

- Project profiles and stable WorkCard slugs power the existing /work routes. WearSlept keeps /work/slept-club. Bagus keeps /work/bagus and leads the migration service’s project examples. Service pages render projects in configured order.
- Case studies support optional milestones, sourced outcomes, evidence, captioned galleries and related content. Present portfolio images as brand imagery. Add storefront screenshots after approval.
- Five new guides live under /insights at shopify-website-development-cost-india, how-long-to-build-shopify-store, shopify-redesign-vs-cro, woocommerce-vs-shopify and 3d-virtual-showroom-shopify. The migration checklist expands at its existing URL. Headings, tables and content render as HTML. Existing CRO audit guidance stays available and connects to the redesign decision guide.
- Insights supports named contributors and reviewers when approved. Cascon Digital is the current organisation byline, with a visible editorial profile on About. The research extension supports methodology, sample, findings, limitations, downloads and version history. Publish research only after review and evidence are available.
- Shared metadata supports page-specific social imagery and Article dates. Project social previews use each project’s image. Service pages and guides use relevant portfolio or service imagery. CreativeWork and Article connect to WebPage and the organisation. The sitemap generation and preview rules continue to use the existing framework configuration.
- llms.txt and llms-full.txt draw from the same public service, project and article data. They are reference files for readers and machines.
- Existing analytics measure page visits and contact/booking intent. Editorial service clicks add a Plausible event with public content and service paths. Existing Meta Pixel project outbound events remain in place. The site’s external contact links provide intent data. A completed enquiry event needs a verified submission callback from the destination.

## Editorial workflow and evidence

Use an explicit stable slug on project cards and in public profiles. Add sources and dates for evidence and omit missing sections. Record publication dates only when known and update modification dates after substantive edits. For an article add an Insights entry, check its sources, link a service and relevant evidence, and rebuild to verify canonical and sitemap discovery.

The Bekid case study is prepared at /work/bekid using the original showroom poster. The showroom rollout remains unconfirmed and the Kerala-first positioning is attributed to Cascon Digital. Additional evidence needed includes branded storefront screenshots, release artefacts for WearSlept timing and Bagus migration details, approved price figures, individual contributor names and company profile ownership. The site’s Instagram link resolves. Confirm control of that account and the official LinkedIn URL before expanding sameAs. Review any legal entity naming against approved corporate records.

The new guides use evergreen titles and URLs. Add a year to the display title after a dated review supports it. Existing price estimates are identified for confirmation in pending-seo-tasks.md, so the new pricing guide uses quote inputs and links to provider plan pricing.

## Review and release

Use the local production build to review the case studies, five new articles and updated checklist on desktop and mobile. Review project wording and links, run the repository checks, then review the branch with the site owner. After approved deployment verify robots.txt, sitemap.xml and canonical URLs on www. Submit the sitemap in verified Search Console and Bing Webmaster properties. The sitemap address and submission steps are in sitemap-and-indexing.md. Coordinate IndexNow and external distribution after release.

Use the editorial-distribution.md manifest for external publishing and attribution. Monitor qualified enquiries, search visibility and link clicks with the existing dashboard. Field LCP, INP and CLS require deployed data or a representative baseline. For rollback, revert the branch changes, rebuild and regenerate the sitemap from the restored routes. If new guide URLs have already been distributed, review their replacement destinations before removing them.

## Verification results

The production build and lint and TypeScript checks passed. Site checks covered 30 canonical routes, 116 internal destinations and anchors, 43 responsive image variants, server-rendered content, structured data, redirects and missing routes. Sitemap logic, XML validation and repeat-build stability passed. Pixel, indexing policy and assistant checks passed. Browser spot checks confirmed the WearSlept page, mobile-width comparison layout, reciprocal Bagus and guide links, and the contact panel. The mobile PageSpeed Insights request for the live homepage returned HTTP 429, so field Core Web Vitals remain unverified. The production build reports 120 kB for home and 112 kB for editorial routes as first-load JavaScript.
