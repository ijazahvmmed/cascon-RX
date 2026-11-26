# Indian Shopify Storefronts: A 50-Store Observational Study

**Methodology v0.4 · Observation date 26 November 2026 · Draft for approval**

## Study design

This exploratory study documents what the saved browser captures establish about the selected storefront and product routes. Cascon Digital conducted the work and sells Shopify services. Client relationships within the sample have yet to be confirmed, and independent peer review has not taken place.

The five-store convenience pilot tested route selection, browser capture and potential UX checks. The pilot remains a separate method-development exercise. Its preliminary scores are outside this release and are not pooled with the 50-store observations.

## Sample selection

ShopScan's India-filtered, popularity-ranked category listings supplied the discovery frame, accessed on 26 November 2026. The archived initial draw used seed `20261126` and selected ten candidates from the first 50 listed entries in each category. Same-category replacements were drawn from the remaining candidates using the recorded rule `20261127 + len(stratum)`. The saved frame and screening log contain 50 initial candidates and 47 replacements. The final set retained 36 initial candidates and 14 replacements.

The final sample contains 50 unique domains, ten per category across Apparel, Home & garden, Personal care / beauty, Food & drink, and Accessories. The screening objective was a public, consumer-facing merchant-operated storefront with a category-matched product route. That definition includes curated retailers as well as brand-owned stores. Country, ownership, category assignment and direct-to-consumer status have not been independently audited. The popularity-ranked frame and availability-based screening limit inference to the selected storefronts.

## Browser observations

The original collection opened a fresh anonymous context for each merchant using Playwright Chromium 119.0.6045.9 in headless mode. It used a 390 × 844 CSS-pixel viewport, device scale factor 1, touch enabled, `en-IN` locale and an Android Chrome 131 user-agent override. The selected initial or replacement records started between 11:54 and 12:27 UTC. The product-route rechecks started between 12:39 and 13:02 UTC. Both windows are on 26 November 2026, with times shown to the minute. Browser logs store observation start timestamps at full precision.

The retained homepage status is the captured navigation response, which may follow a redirect from the listed starting URL. The product status corresponds to the selected product URL. A document title is the captured HTML page title. Its presence does not establish that the product name was visible in the initial viewport.

## Evidence reconciliation

The review joined the archived initial and replacement captures, selection frames, screening log, final-sample CSV and JSON, and product task records by domain. It verified membership and strata and checked successful recheck titles against the first-pass titles. A same-store product-path check flagged Global Beauty Secrets. The original collector and recheck opened the same external article. The replacement product URL is an on-store product link in the archived homepage. Its historic product status, document title and recheck fields are missing. The separate recheck keeps the recorded status even when it is non-200. A title from a non-200 or unrecorded response is omitted.

For platform corroboration the release uses the recorded truthy `window.Shopify` global and one or more `cdn.shopify.com` references in the homepage DOM. Every selected row recorded both. The archived `/cart.js` probe recorded 49 HTTP 200 responses and one HTTP 404, all labeled non-JSON by the collector's content-type check. That probe contributes no platform evidence here. The two retained signals support Shopify association without establishing how the entire storefront is implemented.

The release uses the literal `not observed` where qualifying evidence or a response is missing. It excludes the old ordinal scores and the navigation, search, variants, product-information, delivery, returns, cart, checkout and performance results. The original task and score files remain in the private archive. The prior methods relied in part on text heuristics, and the saved evidence does not support reliable cross-store comparisons of those dimensions. There was no controlled performance measurement. No personal information was entered and no orders were submitted.

## Reproducibility and limits

Run `python docs/authority/benchmark-evidence/build_observation_dataset.py` from the repository root to rebuild the release CSV using local files. The accompanying `indian-shopify-storefronts-data-dictionary.md` maps each field to its capture source. The procedure uses no network access. The repository’s private evidence index identifies the saved inputs.

The sample covers one day in a headless emulator. Shopper location, browser settings, inventory, overlays, rate limits and client-side rendering can change what a shopper experiences. The 49 recorded HTTP 200 product responses describe a sample selected partly for route availability. It cannot estimate national availability, UX quality or conversion. The archived screenshots contain third-party content and are outside the release package.
