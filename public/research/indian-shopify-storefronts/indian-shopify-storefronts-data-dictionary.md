# Indian Shopify Storefronts: A 50-Store Observational Study

Data dictionary

**Version 0.4 · Observation date 26 November 2026**

`indian-shopify-storefronts-observations.csv` is a UTF-8 comma-delimited file with a header and one record per selected storefront domain. There are 50 records. The primary key is `domain`. The literal `not observed` means the relevant value was missing or lacked qualifying evidence. Import HTTP status columns as nullable integers by mapping that literal to null. In the recheck, a recorded HTTP 429 is retained as an observed response.

| Field | Type | Definition and provenance |
|---|---|---|
| `stratum` | Category | Assigned category in the final sample and screened capture. One of Apparel, Home & garden, Personal care / beauty, Food & drink, or Accessories. |
| `brand` | Text | Storefront label in the archived sample frame and capture. |
| `domain` | Hostname | Selected domain and join key across capture, screening and recheck files. |
| `candidate_wave` | Category | `initial` or `replacement`, according to the candidate frame containing the domain. |
| `homepage_url` | URL | Listed starting URL from `store_url`. A navigation may redirect before the response is recorded. |
| `homepage_http_status` | HTTP status or missing | First-pass browser navigation response from `homepageHttp`. |
| `product_url` | URL | Same-store product route, drawn from the product capture or the archived homepage link. |
| `product_url_source` | Category | `product capture` for the recorded product visit, or `archived homepage link` for the corrected Global Beauty Secrets route. |
| `product_http_status` | HTTP status or missing | First-pass product response from `productHttp`. |
| `product_document_title` | Text or missing | Document title from `productTitle` in the first-pass capture. It is HTML metadata. |
| `capture_started_at_utc` | ISO 8601 timestamp | First-pass observation start, from `observedAtUtc` in the initial or replacement capture. |
| `shopify_global_detected` | `yes` or missing | `yes` when the collector recorded a truthy `window.Shopify` on the homepage. |
| `shopify_cdn_reference_detected` | `yes` or missing | `yes` when the collector counted at least one matching `cdn.shopify.com` DOM reference on the homepage. |
| `product_recheck_started_at_utc` | ISO 8601 timestamp | Separate task-pass start, from that record’s `observedAtUtc`. A start timestamp can exist without a recorded response. The corrected Global Beauty Secrets product has no recheck timestamp. |
| `product_recheck_http_status` | HTTP status or missing | Response from `productStatus` in the separate task record. |
| `product_recheck_document_title` | Text or missing | Document title from the separate task record when the product response was HTTP 200 and the title matched the first pass. |

First-pass source files in the private archive are `rendered-50-store-observations.json` and `rendered-replacement-observations.json`. The task-pass source is `benchmark-task-scores.json`; only matching keys, capture timestamps, product status and captured document titles are used. The archived final-sample CSV and JSON and the candidate screening log verify selection. These inputs and the rebuild script remain in the repository’s evidence archive.

The 50 domains are the fixed study sample. Product route availability was part of screening. The dataset describes recorded browser observations and cannot be used to estimate availability or UX across the wider market.