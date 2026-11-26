import { benchmarkInsight } from './benchmark-insight';

export interface InsightSection {
  id: string;
  title: string;
  paragraphs: string[];
  checks?: string[][];
  link?: string[];
  table?: { columns: string[]; rows: string[][] };
  image?: { src: string; width: number; height: number; alt: string; caption: string };
}

export interface Insight {
  slug: string;
  title: string;
  seoTitle?: string;
  published?: string;
  updated?: string;
  author?: { name: string; profile: string };
  reviewer?: { name: string; profile: string };
  image?: string;
  category?: string;
  description: string;
  summary: string;
  reader: string;
  relatedServices: string[];
  relatedProjects?: string[];
  relatedArticles?: string[];
  cta?: string;
  sections: InsightSection[];
  sources: string[][];
  research?: {
    methodology: string;
    sample: string;
    findings: string[];
    limitations: string;
    downloads: { label: string; url: string }[];
    versions: { date: string; changes: string }[];
  };
}

export const insights: Insight[] = [
  benchmarkInsight,
  {
    "slug": "shopify-website-development-cost-india",
    "title": "Shopify Website Development Cost in India",
    "seoTitle": "Shopify Website Development Cost in India",
    "summary": "A Shopify build quote depends on the theme, catalogue, custom features and integrations. Separate the build from subscription and operating costs before comparing proposals.",
    "description": "A Shopify build quote depends on the theme, catalogue, custom features and integrations. Separate the build from subscription and operating costs before comparing proposals.",
    "category": "Shopify budgets",
    "relatedServices": [
      "shopify-development"
    ],
    "relatedProjects": [
      "slept-club"
    ],
    "relatedArticles": [
      "how-long-to-build-shopify-store"
    ],
    "cta": "Discuss your Shopify project.",
    "published": "2026-11-26",
    "updated": "2026-11-26",
    "reader": "For ecommerce teams planning their next investment.",
    "sections": [
      {
        "id": "scope",
        "title": "What changes the development cost?",
        "paragraphs": [
          "Start with the work that has to be delivered. A configured theme can cover standard collections, product pages and cart layouts. Custom sections, account flows, wholesale rules or a design that departs from the theme need more design, engineering and testing.",
          "Catalogue effort depends on how clean the product data is, how variants are structured and how much imagery or copy is ready. A smaller catalogue with bundles, size guides and complex stock rules may take more work than a larger, uniform catalogue."
        ]
      },
      {
        "id": "ongoing",
        "title": "Separate the build from running costs",
        "paragraphs": [
          "Ask for one-time design, development and migration fees on separate lines from Shopify subscriptions, premium themes, paid apps and launch support. Include payment processing, fulfilment tools and ongoing maintenance in your operating budget. Check current plan and app terms for your country before signing."
        ],
        "table": {
          "columns": [
            "Cost item",
            "What to confirm"
          ],
          "rows": [
            [
              "Build",
              "Templates, custom sections, content entry, testing and launch"
            ],
            [
              "Recurring",
              "Platform plan, app tiers, support and maintenance"
            ],
            [
              "Variable",
              "Payment fees, shipping charges and extra markets"
            ]
          ]
        }
      },
      {
        "id": "quote",
        "title": "Compare a freelancer and an agency on the same brief",
        "paragraphs": [
          "A freelancer can suit a narrow build when your team owns content, integrations and launch decisions. A team covering design and development can suit a brief with several dependencies. Ask both who reviews scope changes, who tests payments and what is handed over after launch.",
          "For WearSlept, Cascon coordinated custom storefront work, product presentation and launch in under seven days. Use the case to understand what a focused launch can cover. Ask for a quote against your own catalogue and integrations."
        ],
        "link": ["Review Shopify development scope and deliverables", "/services/shopify-development"],
        "checks": [
          [
            "Bring a catalogue sample",
            "Include products with difficult variants and inventory rules."
          ],
          [
            "Name the launch requirements",
            "List payment, fulfilment, analytics and any migration needs."
          ],
          [
            "Ask what the quote includes",
            "Request exclusions, ownership, recurring costs and acceptance criteria."
          ]
        ]
      }
    ],
    "sources": [
      [
        "Shopify India plans and pricing",
        "https://www.shopify.com/in/pricing"
      ],
      [
        "Shopify product setup",
        "https://help.shopify.com/en/manual/products"
      ]
    ]
  },
  {
    "slug": "how-long-to-build-shopify-store",
    "title": "How Long Does It Take to Build a Shopify Store?",
    "seoTitle": "Shopify Store Build Timelines",
    "summary": "A Shopify launch takes as long as its critical dependencies. A configured theme with ready assets can move quickly. Custom templates, migration and integrations add review and testing time.",
    "description": "A Shopify launch takes as long as its critical dependencies. A configured theme with ready assets can move quickly. Custom templates, migration and integrations add review and testing time.",
    "category": "Shopify delivery",
    "relatedServices": [
      "shopify-development"
    ],
    "relatedProjects": [
      "slept-club"
    ],
    "relatedArticles": [
      "shopify-website-development-cost-india"
    ],
    "cta": "Plan your Shopify launch.",
    "published": "2026-11-26",
    "updated": "2026-11-26",
    "reader": "For ecommerce teams planning their next investment.",
    "sections": [
      {
        "id": "scope",
        "title": "Estimate against the type of build",
        "paragraphs": [
          "For a straightforward store, decide on a theme, prepare product content and agree payment and shipping early. For a custom storefront, allow time to agree the layouts, build reusable sections and review the mobile experience. Complex builds add dependencies such as catalogue migration, multi-market configuration or fulfilment integrations."
        ]
      },
      {
        "id": "parallel",
        "title": "Work in parallel where decisions are settled",
        "paragraphs": [
          "Design can define the buying journey while catalogue preparation, account access and integration discovery move ahead. Developers can build agreed sections while remaining content is produced. Assign one person to approve each dependency, and set a cutoff for features that can wait until after launch.",
          "WearSlept launched in under seven days with custom storefront components, product and variant setup and a functional purchase journey. Treat it as a documented rapid delivery example. Your estimate should account for the assets, decisions and integrations your store requires."
        ]
      },
      {
        "id": "launch",
        "title": "Set a launch gate",
        "paragraphs": [
          "Use a quick review with someone who can approve publication. Walk through an order on mobile, then verify the resulting notification, fulfilment and tracking flows."
        ],
        "checks": [
          [
            "Catalogue ready",
            "Products, variant choices, prices and imagery are reviewed."
          ],
          [
            "Operations ready",
            "Test payment failures and shipping rules alongside successful orders."
          ],
          [
            "Launch ready",
            "Confirm domain, access, analytics, owner sign-off and post-launch support."
          ]
        ]
      }
    ],
    "sources": [
      [
        "Shopify store launch checklist",
        "https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/new-to-shopify-checklists/general-checklist"
      ]
    ]
  },
  {
    "slug": "shopify-redesign-vs-cro",
    "title": "Shopify Redesign vs CRO: Which Does Your Store Need?",
    "seoTitle": "Shopify Redesign vs CRO",
    "summary": "Choose focused CRO when you can isolate buying friction on a workable storefront. Consider a redesign when shared templates, navigation or theme constraints cause problems across the store.",
    "description": "Choose focused CRO when you can isolate buying friction on a workable storefront. Consider a redesign when shared templates, navigation or theme constraints cause problems across the store.",
    "category": "Conversion and redesign",
    "relatedServices": [
      "shopify-cro",
      "shopify-redesign"
    ],
    "relatedProjects": [],
    "relatedArticles": [
      "shopify-cro-audit-methodology"
    ],
    "cta": "Discuss your store’s conversion challenges.",
    "published": "2026-11-26",
    "updated": "2026-11-26",
    "reader": "For ecommerce teams planning their next investment.",
    "sections": [
      {
        "id": "decision",
        "title": "Diagnose the scope before you price it",
        "paragraphs": [
          "Review the mobile buying journey from entry to checkout. If shoppers struggle to find a delivery estimate or understand variant availability on one product template, scope that problem first. If product, collection and navigation patterns repeatedly cause confusion, look at the shared system that produces them."
        ],
        "table": {
          "columns": [
            "Signal",
            "Starting point"
          ],
          "rows": [
            [
              "Isolated friction with a measurable step",
              "Focused CRO change and validation plan"
            ],
            [
              "Recurring friction across shared templates",
              "Redesign brief with template and content inventory"
            ],
            [
              "Unreliable or sparse data",
              "Repair measurement and use task-based review before estimating impact"
            ]
          ]
        }
      },
      {
        "id": "measure",
        "title": "Choose evidence that fits your traffic",
        "paragraphs": [
          "Check whether analytics correctly report product, cart and purchase events. Use segmented funnel data to locate problems and task-based reviews to understand what shoppers encounter. Define what a successful change would look like and allow enough data before attributing a sales movement to it."
        ]
      },
      {
        "id": "budget",
        "title": "Compare implementation and operating cost",
        "paragraphs": [
          "A focused fix can have a small build scope but still require QA and measurement. A redesign changes more surfaces and usually calls for content mapping, redirect review, theme and app testing, and a launch plan. Ask what each proposal includes and which dependencies affect the price."
        ]
      }
    ],
    "sources": [
      [
        "Shopify reports and analytics",
        "https://help.shopify.com/en/manual/reports-and-analytics"
      ]
    ]
  },
  {
    "slug": "woocommerce-vs-shopify",
    "title": "WooCommerce vs Shopify for Growing Ecommerce Brands",
    "seoTitle": "WooCommerce vs Shopify",
    "summary": "Compare who will operate the store, which capabilities you need and what each setup costs over time. Shopify can reduce hosting work. WooCommerce can suit teams that need WordPress and control their hosting and extension stack.",
    "description": "Compare who will operate the store, which capabilities you need and what each setup costs over time. Shopify can reduce hosting work. WooCommerce can suit teams that need WordPress and control their hosting and extension stack.",
    "category": "Platform choice",
    "relatedServices": [
      "woocommerce-to-shopify",
      "shopify-development"
    ],
    "relatedProjects": [
      "bagus"
    ],
    "relatedArticles": [
      "woocommerce-to-shopify-migration-checklist"
    ],
    "cta": "Discuss your platform decision.",
    "published": "2026-11-26",
    "updated": "2026-11-26",
    "reader": "For ecommerce teams planning their next investment.",
    "sections": [
      {
        "id": "compare",
        "title": "Compare the operating model",
        "paragraphs": [
          "A hosted Shopify store moves core platform hosting and maintenance to Shopify. A WooCommerce store uses WordPress hosting, with maintenance responsibilities depending on your host and support agreement. Both can incur costs for integrations, extensions and specialist work."
        ],
        "table": {
          "columns": [
            "Decision",
            "Shopify",
            "WooCommerce"
          ],
          "rows": [
            [
              "Hosting",
              "Managed by Shopify",
              "Choose a host and maintenance model"
            ],
            [
              "Customisation",
              "Themes, supported APIs and apps",
              "WordPress themes, plugins and custom code"
            ],
            [
              "Cost to model",
              "Plan, apps, payment costs and support",
              "Hosting, extensions, payment costs and maintenance"
            ]
          ]
        }
      },
      {
        "id": "choose",
        "title": "When keeping WooCommerce makes sense",
        "paragraphs": [
          "Keep WooCommerce on the shortlist when the store relies on WordPress publishing workflows or custom integrations that already meet business needs. Price the work to maintain that setup and compare it with rebuilding its important capabilities elsewhere. Test the difficult requirements on both platforms, including payments, shipping, market rules and reporting."
        ]
      },
      {
        "id": "move",
        "title": "Treat migration as a separate decision",
        "paragraphs": [
          "Bagus Home Decor moved from WooCommerce to Shopify with Cascon Digital. That project combined the platform transition with organisation of the catalogue and a storefront that reflected the brand. For your own quote, list the data, integrations and landing pages the new setup must preserve. Compare the cost of migrating with the cost of improving your current store."
        ]
      }
    ],
    "sources": [
      [
        "Shopify India plans and pricing",
        "https://www.shopify.com/in/pricing"
      ],
      [
        "WooCommerce update and maintenance guidance",
        "https://woocommerce.com/document/how-to-update-woocommerce/"
      ],
      [
        "Shopify WooCommerce migration guide",
        "https://help.shopify.com/en/manual/migrating-to-shopify/migrating-from-woocommerce"
      ]
    ]
  },
  {
    "slug": "3d-virtual-showroom-shopify",
    "title": "3D Virtual Showrooms on Shopify: A Guide for Fashion Brands",
    "seoTitle": "3D Virtual Showrooms on Shopify",
    "summary": "A virtual showroom gives shoppers an optional way to explore products in context. Start with a discovery task, preserve ordinary shopping links and test loading and accessibility on real devices.",
    "description": "A virtual showroom gives shoppers an optional way to explore products in context. Start with a discovery task, preserve ordinary shopping links and test loading and accessibility on real devices.",
    "category": "Immersive commerce",
    "relatedServices": [
      "shopify-development"
    ],
    "relatedProjects": ["bekid"],
    "relatedArticles": [
      "how-long-to-build-shopify-store"
    ],
    "cta": "Discuss a virtual showroom for your store.",
    "published": "2026-11-26",
    "updated": "2026-11-26",
    "reader": "For ecommerce teams planning their next investment.",
    "sections": [
      {
        "id": "purpose",
        "title": "Choose a task the showroom should help with",
        "paragraphs": [
          "For fashion, a scene can group a collection by look, occasion or colour. A shopper might explore an outfit and then open the conventional product page for size, stock, delivery and purchase details. Decide how people would do the same task with a collection page before investing in an interactive scene."
        ]
      },
      {
        "id": "integration",
        "title": "Connect scene objects to the live catalogue",
        "link": ["See the Bekid showroom case study", "/work/bekid"],
        "paragraphs": [
          "Shopify supports 3D models as product media. A whole showroom needs a separate experience design and a clear mapping from scene hotspots to product or collection URLs. Assign ownership of that mapping so changes to products, availability and launches are reflected. Keep the normal catalogue, search and cart available."
        ]
      },
      {
        "id": "access",
        "title": "Set a mobile and accessibility acceptance test",
        "paragraphs": [
          "Load a poster or ordinary catalogue first and fetch the scene after a visitor chooses to enter. Test on mid-range phones and slower networks, measure loading and input response, and offer a reduced-motion experience. Key actions need keyboard access, clear labels and a conventional list with the same product destinations.",
          "Measure whether shoppers can complete the intended discovery task. Use the findings to decide whether the showroom is worth maintaining."
        ],
        "checks": [
          [
            "On a phone",
            "Can someone use the experience without precise dragging or pinching?"
          ],
          [
            "With a keyboard",
            "Can they reach each product and exit the scene?"
          ],
          [
            "With the scene unavailable",
            "Do ordinary links and buying controls still work?"
          ]
        ]
      }
    ],
    "sources": [
      [
        "Shopify product media",
        "https://help.shopify.com/en/manual/products/product-media/add-media"
      ],
      [
        "WCAG 2.2",
        "https://www.w3.org/TR/WCAG22/"
      ]
    ]
  },
  {
    "slug": "shopify-cro-audit-methodology",
    "updated": "2026-11-23",
    "title": "Shopify CRO audit: evidence before fixes",
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
    ],
    "category": "Conversion research",
    "relatedArticles": [
      "shopify-redesign-vs-cro"
    ],
    "cta": "Discuss your store’s conversion challenges."
  },
  {
    "slug": "woocommerce-to-shopify-migration-checklist",
    "updated": "2026-11-26",
    "title": "WooCommerce to Shopify migration checklist",
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
        ],
        "link": [
          "See how Cascon plans redirects and protects rankings in a WooCommerce to Shopify migration",
          "/services/woocommerce-to-shopify"
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
      },
      {
        "id": "first-week",
        "title": "Monitor the first week after launch",
        "paragraphs": [
          "Keep a list of priority landing pages and their expected destinations. Check response codes, canonical URLs and the new sitemap. In Search Console, inspect priority URLs and review indexing reports as data arrives. Compare product, cart and checkout events with a test order and confirm the order reaches fulfilment. Assign an owner to log and resolve issues."
        ],
        "checks": [
          [
            "Before launch",
            "Check representative products and variants against the source catalogue and verify a paid test order, shipping charges and order notifications."
          ],
          [
            "After launch",
            "Check redirects and priority pages from the old store. Record issues and compare results with the agreed pre-launch baseline."
          ]
        ],
        "link": [
          "Read the Bagus migration case study",
          "/work/bagus"
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
    ],
    "category": "Platform migration",
    "relatedProjects": [
      "bagus"
    ],
    "relatedArticles": [
      "woocommerce-vs-shopify"
    ],
    "cta": "Plan your WooCommerce to Shopify migration."
  }
];
