# Ecommerce CRO scanner

Branch preview only. The existing website and the Cloudflare account have not been deployed or changed.

## Local setup

Install root and Worker dependencies with `npm ci` and `npm --prefix workers/cro ci`. Run the Worker with `npm --prefix workers/cro run dev`. In another terminal, run `npm run dev` and open `http://localhost:3000/tools/cro-audit`. The development default is the Worker at port 8787. Match the origin exactly when using a different port or hostname.

Run the Worker tests with `npm --prefix workers/cro test`. Its `check` command type-checks and bundles with Wrangler dry-run. The Next.js build includes both public tool pages in its existing sitemap gate.

## Security and free capacity

- Only `POST /scan` accepts work. Browser origins are matched exactly. The public API returns a typed summary with no raw merchant HTML, assets or response headers.
- Submitted paths and queries are removed. Hosts must be public DNS names on default HTTP(S) ports. The scanner resolves A and AAAA through a fixed public resolver for each request hop and rejects any non-public answer. Same-merchant redirects are revalidated. Product and collection requests remain on the final storefront origin and use discovered URLs. Cart, checkout and other transactional paths are excluded.
- DNS preflight is an early rejection layer. It does not pin DNS. The production connection safeguard relies on Cloudflare public egress and `global_fetch_strictly_public`. The Worker config uses no origin or private network bindings. Workerd local, unit tests and hosted Workers are separate environments.
- Limits include a 2,300-byte request body, up to eight merchant HTTP requests including redirects, at most 768 KiB per decompressed HTML document, an aborting 17-second scan deadline and two redirects per page. Storefront requests are spaced. A 403, 429 or challenge stops further merchant requests. Large documents can yield prefix evidence, with absence-sensitive results withheld.
- The SQLite Durable Object enforces a shared quota of 3,000 allowed requests and 1,200 uncached scans per UTC day, plus six requests per visitor per ten-minute window and 20 uncached attempts per merchant per day. Visitor keys are date-scoped hashes. Expired counters are removed on subsequent requests. Successful summaries may remain in the edge cache for up to 20 minutes. Failed budget operations deny new work.
- Use the Workers Free account and its hard limits. This build does not use browser rendering, a paid API, an API key or a new Next.js server function. The Worker needs only its SQLite Durable Object and the Workers Cache API. [Worker limits](https://developers.cloudflare.com/workers/platform/limits/), [Durable Object Free limits](https://developers.cloudflare.com/durable-objects/platform/pricing/), [public-fetch behavior](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#global-fetch-strictly-public).

## Lead and privacy behavior

The downloadable PDF contains the free summary. No result has a permalink and the API uses noindex and no-store. Submitted URLs are excluded from analytics payloads and the tool view is masked for Clarity. The existing opt-in analytics pipeline receives scan completion, recommendation engagement and a single tool-attributed enquiry intent per assessment. The consultation uses the existing Cal.com booking link and passes the normalized store URL and short evidence context. Confirmed bookings can be attributed in Cal.com through its UTM booking record. A browser booking click is recorded as intent. [Cal.com booking attribution](https://cal.com/help/bookings/utm-tracking).

## Local validation

The paced local Wrangler run covered 16 distinct storefronts. 13 returned a report, 7 returned at least one verified recommendation, 1 supplied all three validated samples, and 1 met the overall scoring threshold. Three of the inputs were Cascon-built stores. This is a small observed sample and does not validate the 90% target.

| Cohort | Store | Homepage | Product | Collection |
| --- | --- | --- | --- | --- |
| Cascon | https://finewares.in | read | blocked | blocked |
| Cascon | https://wearslept.com | read | blocked | blocked |
| Cascon | https://bagus.in | partial | blocked | blocked |
| International Shopify | https://www.allbirds.com | partial | blocked | blocked |
| International Shopify | https://ridge.com | partial | blocked | blocked |
| International Shopify | https://www.brooklinen.com | unverified | — | — |
| International Shopify | https://www.pangaia.com | read | blocked | blocked |
| International WooCommerce | https://bonsoy.com | read | unverified | read |
| International WooCommerce | https://landyachtz.com | unverified | — | — |
| International WooCommerce | https://www.nutribullet.com | read | not found | unverified |
| International WooCommerce | https://cipherskincare.com | read | read | read |
| Additional storefront | https://www.vans.com | blocked | — | — |
| International Shopify | https://partakefoods.com | read | blocked | blocked |
| International Shopify | https://www.pipsnacks.com | read | blocked | blocked |
| International Shopify | https://drinkolipop.com | partial | blocked | blocked |
| Additional storefront | https://www.thebattery.com | read | not found | not found |

The same rules and thresholds ran for every cohort. Early validation found two problems. Large responses could terminate extraction, and simultaneous storefront reads could trigger upstream rates on secondary pages. The current implementation uses bounded prefixes and serialized requests. The local run still encountered rate restrictions on Shopify deep pages, so only the available homepage evidence was used for those reports.

Browser tests exercised the scanner at desktop and mobile widths, invalid URL feedback, real report disclosure, PDF file download and existing booking-link context. Confirmed bookings were not created during QA.

## Before public release

The hosted edge run remains a release gate. Validate the actual Workers Free account, production-like CPU limits, deployed public-only egress and private-address rejection in an isolated environment. Compare results with the local cohort before enabling the public frontend. Set `NEXT_PUBLIC_CRO_WORKER_URL` to the verified Worker origin only after these checks. The production frontend shows a temporary-unavailable message when it has no configured Worker.
