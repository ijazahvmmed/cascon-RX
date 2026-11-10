export interface InsightSection { id: string; title: string; paragraphs: string[]; checks?: string[][]; }
export interface Insight { slug: string; title: string; description: string; summary: string; reader: string; relatedServices: string[]; sections: InsightSection[]; sources: string[][]; }
export const insights: Insight[] = [
  {
    "slug": "shopify-cro-audit-methodology",
    "title": "A practical Shopify CRO audit: evidence before fixes",
    "description": "A Shopify CRO audit framework for ecommerce teams: check measurement, review the mobile buying journey and prioritise fixes with clear validation criteria.",
    "summary": "Turn a store review into a useful decision about what to fix next.",
    "reader": "For ecommerce founders and marketing teams deciding whether their store needs focused fixes, a redesign or better measurement.",
    "relatedServices": [
      "shopify-cro",
      "shopify-redesign",
      "ai-product-photography"
    ],
    "sections": [
      {
        "id": "start-with-a-decision",
        "title": "Start with a decision, not a score",
        "paragraphs": [
          "Choose the question the audit needs to answer. For example: are mobile visitors unable to choose a variant, or do they leave after discovering delivery costs? A useful audit links a specific observation to a proposed change and a way to check it.",
          "Use one issue record: affected page and device; evidence; likely customer obstacle; proposed change; owner; effort; acceptance check. This makes a backlog reviewable without pretending that every design preference is a conversion problem."
        ]
      },
      {
        "id": "measurement",
        "title": "Check that the funnel describes real behaviour",
        "paragraphs": [
          "Confirm how product views, add-to-cart, checkout starts and completed orders are measured. Check duplicate events and compare reported orders with the trading system before interpreting a drop-off. Use aggregated reports and access controls rather than exporting customer details into an audit document.",
          "Review mobile and desktop separately, then look at landing pages and traffic sources. A campaign sending visitors to the wrong product can look like a page problem. Note promotions, stock-outs and delivery changes alongside the measurement window."
        ]
      },
      {
        "id": "mobile-review",
        "title": "Walk the mobile journey with a real buying task",
        "paragraphs": [
          "Choose a product, select an available variant, find delivery and return information, add it to the cart and begin checkout. Check narrow screens, long product names, validation errors and slow loading. Test with realistic catalogue content rather than a perfect sample product."
        ],
        "checks": [
          [
            "Product choice",
            "Can a customer distinguish size, material, quantity and availability before adding the item?"
          ],
          [
            "Product confidence",
            "Do images and copy explain scale, included items and limitations accurately?"
          ],
          [
            "Delivery and payment",
            "Are relevant charges and delivery information available before the final commitment? Confirm payment methods against the configured provider."
          ],
          [
            "Cart continuity",
            "Do quantity changes, discounts and validation messages preserve the customer’s choices?"
          ]
        ]
      },
      {
        "id": "prioritise",
        "title": "Separate confirmed faults from hypotheses",
        "paragraphs": [
          "A selector that fails on a supported device is a reproducible fault. Moving a product image higher is a hypothesis unless evidence supports the diagnosis. Fix broken purchase paths first; then weigh likely commercial relevance, evidence strength, implementation effort and reversibility.",
          "Do not label an attractive redesign as a proven uplift. Keep the original observation and the final implementation together so the team can later assess whether it addressed the problem."
        ]
      },
      {
        "id": "validate",
        "title": "Choose a measurement method the traffic can support",
        "paragraphs": [
          "Use a controlled experiment when the available traffic, tooling and business constraints make it suitable. Agree the primary measure, guardrails and analysis window before starting. Avoid ending a test only because an early result looks favourable.",
          "For smaller stores, validate that the fault is gone and review subsequent trading carefully. A before-and-after comparison can inform the next decision, but promotions, audience changes and seasonality prevent it from proving that the website change caused the result."
        ]
      },
      {
        "id": "handover",
        "title": "What a useful audit handover contains",
        "paragraphs": [
          "Ask for a short diagnosis, supporting evidence, a prioritised backlog and acceptance criteria for each recommended change. The next step should be a clear implementation brief, a request for better data or a decision that a broader redesign is warranted.",
          "You do not need a large checklist to start a conversation. Share your store URL, the journey causing concern and the data you currently trust."
        ]
      }
    ],
    "sources": [
      [
        "Shopify behaviour reports and online-store conversion",
        "https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/behaviour-reports"
      ],
      [
        "Core Web Vitals definitions",
        "https://web.dev/articles/vitals"
      ]
    ]
  },
  {
    "slug": "woocommerce-to-shopify-migration-checklist",
    "title": "WooCommerce to Shopify: a migration readiness checklist",
    "description": "Plan a WooCommerce to Shopify move around data, URLs, integrations and launch checks. A practical readiness guide for ecommerce teams evaluating migration.",
    "summary": "Know what must transfer, what must change and who signs off before launch.",
    "reader": "For WooCommerce store owners and ecommerce managers evaluating a move to Shopify, before committing to a build or launch date.",
    "relatedServices": [
      "woocommerce-to-shopify",
      "shopify-development",
      "shopify-redesign"
    ],
    "sections": [
      {
        "id": "platform-fit",
        "title": "Confirm that the destination fits the business",
        "paragraphs": [
          "List the jobs the current store performs, including subscriptions, custom product options, customer pricing, fulfilment and reporting. For each one, identify a supported Shopify feature, an app, a scoped custom integration or a reason to reconsider the move.",
          "Compare the ongoing operating model as well as the initial build. Theme licences, app charges, payment-provider conditions and maintenance responsibilities belong in the decision; a generic migration price does not describe those dependencies."
        ]
      },
      {
        "id": "data-map",
        "title": "Build a data map before a full import",
        "paragraphs": [
          "Create a small representative sample: a product with variants, one with unusual media, a customer record and the order types your business actually uses. Check the chosen import method against the sample before treating a successful file upload as a successful migration."
        ],
        "checks": [
          [
            "Catalogue",
            "Check identifiers, variants, prices, inventory, images, descriptions and collection membership."
          ],
          [
            "Customers and accounts",
            "Confirm which fields transfer and how customers will sign in after launch. Customer passwords cannot migrate through Shopify’s documented WooCommerce process."
          ],
          [
            "Orders and operations",
            "Agree historical-order treatment, retention requirements, fulfilment and reporting. Inventory each app or plugin dependency."
          ],
          [
            "Content and reviews",
            "Assign owners for editorial pages, product information and review imports; check licensing and destination-tool support."
          ]
        ]
      },
      {
        "id": "url-map",
        "title": "Map valuable URLs to relevant destinations",
        "paragraphs": [
          "Collect existing product, collection and editorial URLs, alongside available search landing-page and backlink reports. Give important old pages a relevant destination and preserve useful content. Do not replace the mapping exercise with a blanket homepage redirect.",
          "Shopify redirects have reserved-path restrictions and generally apply to broken source URLs. Validate the final route behaviour in the destination store, including trailing slashes and any intermediate redirects, rather than assuming every imported mapping will work."
        ]
      },
      {
        "id": "rehearsal",
        "title": "Rehearse the operating journey",
        "paragraphs": [
          "Test realistic purchase scenarios with the merchant’s payment and shipping setup: different delivery areas, product combinations, discount conditions and failed payments where supported. Include the order-confirmation and fulfilment handoff. Tax decisions belong with the merchant and their advisers.",
          "Define who checks catalogue completeness, who approves product information, who validates reporting and who authorises the domain change. A checklist without owners does not establish launch readiness."
        ]
      },
      {
        "id": "launch",
        "title": "Agree the cutover and the decision to pause",
        "paragraphs": [
          "Record when the last data export occurs, how new orders or inventory changes are handled and what conditions would postpone launch. Keep a recovery plan and access to the previous system in line with the merchant’s retention and operational requirements.",
          "After launch, review broken URLs, redirected landing pages, purchase paths and event delivery. Compare search and trading data over a suitable window; monitoring is a way to find issues, not a guarantee that visibility cannot change."
        ]
      }
    ],
    "sources": [
      [
        "Shopify’s WooCommerce migration process and limitations",
        "https://help.shopify.com/en/manual/migrating-to-shopify/migrating-from-woocommerce"
      ],
      [
        "Shopify redirect considerations",
        "https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect"
      ]
    ]
  }
];
