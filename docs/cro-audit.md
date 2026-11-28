# Ecommerce CRO scanner

Private staging on the Cascon Workers Free account, November 28, 2026. The feature branch is `feat/cro-audit`.

## Validation

| Measurement | Result |
| --- | --- |
| Real visitor on the local staging frontend | Turnstile admitted the jerso.in scan. The merchant returned HTTP 429 for the homepage, so the scanner stopped. A regression test covers the Siteverify redirect mode that had caused a misleading busy message. |
| Hosted analysis of Cipher Skincare | All three pages read, five of seven shopping questions resolved, one free recommendation, 48 private rule outcomes. The cold analysis took 15.607 s. A repeat through the same report owner took 203 ms. Both viewport readings completed. These tests used an account-authorized private fixture. |
| Local benchmark on live merchant pages | 64 distinct stores including Finewares, Wearslept and Bagus. 62 returned reports, 61 resolved at least one question, one supplied all three pages and none resolved all seven questions. 26 reports included at least one recommendation. Product requests were rate-limited on 50 of the 62 reports. |
| Local scan time | Median 1.66 s, p95 2.68 s over all 64 attempts, excluding admission, cache, enrichment and presentation. |
| Local tests | 19 passing, including signed visitor quotas, refund on refusal, concurrent cold requests, caching, scoped headless product evidence, related items, partial documents and conservative scoring. |
| Two hosted models on three cases | Granite matched 3/3 expected follow-ups, median 664 ms. GPT-OSS 20B matched 2/3, median 1,161 ms. Granite handles optional follow-up selection. |

The 64-store run used local workerd with real merchant responses before the final conservative rule and custom-theme refinements. Only a single store has a timed successful hosted result on this revision. Human-labelled precision across merchants is still unknown. [Cohort results](../workers/cro/cohort-results.json) · [Model results](../workers/cro/model-benchmark.json) · [Rule evidence](cro-rule-evidence.md)

## Report evidence update

The score chart mounts only after a report arrives. Every shopping question distinguishes confirmed evidence, a verified issue and an unverified answer. Policy checks may follow up to two linked same-origin pages using the existing request budget. A policy link alone earns no points. Verified terms are quoted with their source. A readable product description can supply a short excerpt, and support can be found on any of the three sampled store pages.

Eligible reports can contain phone and desktop JPEG captures of the saved homepage. The offline browser uses bounded local copies of up to two store-linked stylesheets and one raster image when the remaining request budget permits. It runs no merchant scripts or remote browser requests. Some styling and images may be missing. The report explains when capacity or capture failure prevents a screenshot. Screenshots share the report’s existing expiry and do not influence scoring. Cloudflare returned both a 390 px and a 1440 px JPEG for the Cipher Skincare capture test. The historical benchmark table above predates these changes.

## Implementation and security

- Only the widget site key and Worker origin are public. The server validates the one-time Turnstile token, hostname and action. A signed, Secure, HttpOnly visitor cookie holds an anonymous identifier. Network and merchant limits continue to apply when visitors clear cookies.
- Three completed reports per visitor per UTC day, including cache hits. Failed analyses release the visitor reservation. The other counters still count attempts. The ceiling is six attempts per network per ten minutes, 20 per merchant per day and 600 admissions per day. Network hashes change daily.
- A Durable Object per normalized URL and rule version coalesces concurrent scans. Public summaries are cached in KV for 24 hours with an expiring copy in the report owner. The private rule outcomes are stored separately for 24 hours. A named service-binding entrypoint supports authorized staff-service retrieval. A staff dashboard has yet to be connected.
- Inputs are capped at 4,600 bytes. Only HTTP(S) on default ports, allowed paths and same-merchant redirects qualify. Each destination is checked immediately before the request. The crawler makes at most eight merchant requests, permits two redirects per page, reads at most 768 KiB per document and has a 17-second static analysis deadline. A merchant refusal stops subsequent merchant requests. A homepage rate limit also pauses repeat analysis of that target for the supplied retry interval, with a one-minute minimum. A regression test checks that a repeat attempt during the pause makes no new merchant request.
- Production sends merchant requests through an authenticated Vercel endpoint. The endpoint verifies all returned IP addresses, pins the connection to a validated public address, preserves the original hostname for TLS verification and returns each redirect to the Worker for scope validation. The isolated staging Worker uses DNS preflight and Cloudflare public fetch. [Worker fetch behavior](https://developers.cloudflare.com/workers/runtime-apis/fetch/)
- Browser Run renders a bounded, cleaned copy of the homepage at 390 and 1440 px. Scripts, embedded documents and external stylesheets are removed, JavaScript is disabled and remote requests are rejected. The measurement concerns the saved homepage as rendered with the available styles. Hydrated visual UX requires an expert inspection.
- Scoring and ranking remain deterministic and server-side. AI receives rule IDs, page types, categories and permitted follow-up keys. Only reviewed wording can be appended to an existing finding. Missing or invalid output falls back to the original recommendation. Browser observations and AI output have no scoring weight.
- The free report contains up to three findings. Its PDF and booking notes use the same server score. Unknown answers retain their open points. Consent-aware analytics record engagement and consultation intent without submitted URLs. The existing Cal.com flow carries the normalized store address, summary and attribution tags. [Cal.com attribution](https://cal.com/help/bookings/utm-tracking)

## Capacity and release gates

900–1,350 audits in a 30-day month average 30–45 per day. Expected incremental spend is ₹0 on Workers Free. Browser Run is limited by the application to 24 viewport pairs per day, at most 720 enriched scans per 30 days under the shared Browser Run limits. AI is capped at 60 calls per day. Both features fall back when unavailable. Core quota exhaustion can decline a scan. The tool has no billing activation or automatic upgrade path. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) · [Browser Run limits](https://developers.cloudflare.com/browser-run/limits/) · [AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) · [KV pricing](https://developers.cloudflare.com/kv/platform/pricing/) · [Durable Object pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)

Engineering readiness estimate is 8/10 equally weighted areas. Six have implemented and tested behavior: server scoring, free report and consultation handoff, private evidence separation, anonymous admission, caching and deduplication, and constrained AI. Four receive half credit each: representative coverage and precision, connection-time egress assurance, fidelity of isolated rendering, and hosted release validation.

Production scans enter through the same-origin Vercel route and use a production-only Turnstile widget. The Worker and Vercel require a shared relay secret, and the production Worker uses a separate report namespace. The hosted smoke check covers the production flow. A representative hosted cohort and human-labelled precision study are still needed to characterize coverage and accuracy, so the report retains its scope disclosure and treats unverified answers as unknown.

## Development

Run `npm ci`, `npm --prefix workers/cro ci`, `npm --prefix workers/cro run dev` and `npm run dev`. Open `http://localhost:3000/tools/cro-audit` for the isolated loopback preview. The separate frontend on port 3012 uses an actual Turnstile widget and a staging bridge on port 8792. Set the public Worker origin and widget site key at frontend build time. Install TURNSTILE_SECRET and VISITOR_SECRET only as Worker secrets.

Run `npm --prefix workers/cro test`, `npm --prefix workers/cro run check`, `npm run lint`, `npm run typecheck` and the Next production build. From the Worker directory, `node benchmark.mjs cohort.json results.json` runs the same rules across the specified cohort. Record the version, runtime, location, quota state and optional enrichments with each comparison. Respect merchant rate limits.

## Earlier 16-store validation

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

The table records the original validation run. The preview now distinguishes merchant rate limits, explicit denials and pages skipped after a denial. A passive detection script on a readable storefront does not itself indicate a challenge.

The same rules and thresholds ran for every cohort. Early validation found two problems. Large responses could terminate extraction, and simultaneous storefront reads could trigger upstream rates on secondary pages. The current implementation uses bounded prefixes and serialized requests. The local run still encountered rate restrictions on Shopify deep pages, so only the available homepage evidence was used for those reports.

Browser tests exercised the scanner at desktop and mobile widths, invalid URL feedback, real report disclosure, PDF file download and existing booking-link context. Confirmed bookings were not created during QA.

The revised checklist was tested on hidden and crossed-out prices, delivery fees shown in a table, a disabled buy button, an unfinished product listing and complete shopping information. Finewares confirmed one answer from its homepage after the store limited the product request. Cipher Skincare confirmed six of seven, including its current sale price. Return terms were unconfirmed. Those figures describe these scans only.

On November 28, the Bleame preview confirmed five of seven shopping answers from its homepage, earning 71 points with 29 open. The product request was rate-limited. The homepage contained a named item link, a selling price in that item's listing, an advertised shipping offer, a return period and a customer support destination. The description and purchase button stayed open. Fixtures also cover unrelated or hidden prices, comparison amounts, mixed-item listings, paid shipping and disabled purchase controls.
