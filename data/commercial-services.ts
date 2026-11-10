export interface CommercialService { slug: string; name: string; title: string; description: string; summary: string; intro: string; fit: string; image: string; imageAlt: string; tags: string[]; projects: string[]; deliverables: string[][]; steps: string[][]; inputs: string[]; faqs: string[][]; related: string[]; insights: string[]; sources: string[][]; }
export const commercialServices: CommercialService[] = [
  {
    "slug": "shopify-development",
    "name": "Shopify development",
    "title": "Shopify Development Agency in India",
    "description": "Shopify store development for Indian ecommerce brands. Plan a new build, theme customisation, integrations and launch with Cascon in Bangalore and Dubai.",
    "summary": "A Shopify store your customers can buy from. And your team can run.",
    "intro": "Cascon designs and develops Shopify stores for ecommerce brands in India, with collaboration available for UAE teams. We connect the catalogue, buying journey, content and operational integrations around a clearly agreed launch scope.",
    "fit": "For a new ecommerce store, a move beyond a basic theme, or a brand whose team needs more useful product and collection templates.",
    "image": "/images/work/finewares.png",
    "imageAlt": "Cookware imagery on the Finewares storefront, a Cascon Shopify project",
    "tags": [
      "shopify"
    ],
    "projects": [
      "finewares",
      "slept-club",
      "lumy-dates"
    ],
    "deliverables": [
      [
        "A store blueprint",
        "Map collections, product types, variants, navigation and the key customer journeys before choosing what to build."
      ],
      [
        "Theme and templates",
        "Configure a suitable theme or scope custom Liquid sections. Prioritise useful product information, variant selection and an editable layout for the brand team."
      ],
      [
        "Operational connections",
        "Agree payment, shipping, email and analytics requirements. Check provider eligibility and app compatibility before treating an integration as part of the build."
      ],
      [
        "Launch and handover",
        "Review mobile layouts, product data, payment and shipping scenarios, redirects where relevant and analytics. Document the editing workflow and agreed support."
      ]
    ],
    "steps": [
      [
        "Discover",
        "Review your products, audience, brand assets, catalogue and the way orders are fulfilled."
      ],
      [
        "Design and build",
        "Agree the buying journey and templates, then develop and review against the scoped requirements."
      ],
      [
        "Validate and launch",
        "Test key purchase paths, agree the launch checklist and hand over the store and editing notes."
      ]
    ],
    "inputs": [
      "Your product catalogue, variants and any existing store URL.",
      "Brand assets, available imagery and the content your team can supply.",
      "Payment, delivery, inventory and reporting requirements."
    ],
    "faqs": [
      [
        "How much does Shopify development cost in India?",
        "The quote depends on template complexity, catalogue structure, integrations and content readiness. We separate the build fee from Shopify subscriptions, paid themes, app charges and payment-provider fees so you can compare the full operating cost."
      ],
      [
        "Can you work with an existing theme?",
        "Yes. A theme can be a useful starting point when it supports the required catalogue and buying journey. We scope custom sections where they solve an identified need rather than replacing every working component."
      ],
      [
        "Do I need Shopify Plus?",
        "A standard Shopify plan may cover the store you need. We check the requirements against the current plan and app capabilities, particularly for checkout work, before recommending a platform or plan change."
      ]
    ],
    "related": [
      "shopify-cro",
      "shopify-redesign",
      "woocommerce-to-shopify"
    ],
    "insights": [
      "shopify-cro-audit-methodology"
    ],
    "sources": [
      [
        "Shopify theme architecture",
        "https://shopify.dev/docs/storefronts/themes/architecture"
      ],
      [
        "Shopify checkout capabilities",
        "https://shopify.dev/docs/apps/build/checkout"
      ]
    ]
  },
  {
    "slug": "shopify-cro",
    "name": "Shopify CRO",
    "title": "Shopify Conversion Rate Optimization Services",
    "description": "Find friction in your Shopify buying journey. Cascon reviews analytics, mobile product pages, cart and checkout to prioritise measurable improvements.",
    "summary": "Find the friction before choosing the fix.",
    "intro": "Shopify conversion rate optimization starts with a reliable picture of how visitors shop. Cascon reviews the store journey and available analytics, then prioritises changes that address specific obstacles to buying. The work can begin with an audit without committing to a full redesign.",
    "fit": "For a store with traffic but unclear drop-offs, difficult product choices, repeated customer questions or a cart journey that needs attention.",
    "image": "/images/work/rewise.jpg",
    "imageAlt": "Rewise wellness brand project in Cascon’s portfolio",
    "tags": [
      "cro"
    ],
    "projects": [
      "rewise",
      "vibezon"
    ],
    "deliverables": [
      [
        "A usable baseline",
        "Check event definitions and compare device, landing-page and acquisition segments. Distinguish completed orders from checkout starts and payment attempts."
      ],
      [
        "A journey review",
        "Walk through navigation, search, product selection, cart, delivery information and checkout on representative mobile devices."
      ],
      [
        "An evidence-led backlog",
        "Record each issue with the affected journey, observed evidence, proposed change, effort and a way to verify the result."
      ],
      [
        "Implementation and review",
        "Scope agreed fixes and define a measurement window. Use a controlled experiment when traffic and tooling support one; label observational comparisons clearly."
      ]
    ],
    "steps": [
      [
        "Establish the evidence",
        "Review analytics access, event quality, recent campaigns, catalogue changes and operational constraints."
      ],
      [
        "Prioritise friction",
        "Combine the data with a hands-on review. Separate technical faults from ideas that still need validation."
      ],
      [
        "Change and measure",
        "Implement a focused set of improvements and review the agreed metrics alongside commercial context."
      ]
    ],
    "inputs": [
      "Store access appropriate to the agreed review.",
      "Available analytics, order data and recent marketing context.",
      "Known customer objections, device issues and fulfilment constraints."
    ],
    "faqs": [
      [
        "Can you guarantee a conversion uplift?",
        "No. Traffic quality, product demand, pricing, availability and delivery all affect results. We agree the evidence and measurement approach before implementation and avoid attributing every subsequent change to the website."
      ],
      [
        "What if our traffic is too low for A/B testing?",
        "Start by fixing reproducible errors and improving decision-making information. A prioritised audit can still be useful. A before-and-after comparison is not the same as a controlled experiment and should be reported with that limitation."
      ],
      [
        "Does CRO require a redesign?",
        "No. A broken selector, unclear delivery terms or a confusing cart can often be addressed within the existing store. A redesign is justified when the underlying template or information structure prevents the needed changes."
      ]
    ],
    "related": [
      "shopify-redesign",
      "shopify-development"
    ],
    "insights": [
      "shopify-cro-audit-methodology"
    ],
    "sources": [
      [
        "Shopify conversion reports",
        "https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/behaviour-reports"
      ]
    ]
  },
  {
    "slug": "shopify-redesign",
    "name": "Shopify store redesign",
    "title": "Shopify Store Redesign Services",
    "description": "Redesign your Shopify store with a clear scope for mobile UX, product information, editable templates and launch checks. Work with Cascon in India.",
    "summary": "A considered next chapter for your store.",
    "intro": "A Shopify redesign should address a defined business problem: a difficult mobile journey, product information that no longer fits the catalogue, or a brand direction the current theme cannot express. Cascon plans the change around those requirements while protecting useful existing content and URLs.",
    "fit": "For an existing Shopify brand whose catalogue, identity or operations have outgrown the current storefront.",
    "image": "/images/work/bagus.jpg",
    "imageAlt": "Bagus home decor imagery from Cascon’s Shopify and creative portfolio",
    "tags": [
      "shopify"
    ],
    "projects": [],
    "deliverables": [
      [
        "A keep, change and retire map",
        "Review existing templates, content, navigation, app dependencies and valuable landing pages. Decide what is worth retaining before a rebuild."
      ],
      [
        "Mobile buying journeys",
        "Prioritise product comparison, image clarity, variant selection, delivery information and cart interactions at small screen sizes."
      ],
      [
        "Editable design implementation",
        "Translate the agreed design into theme templates and sections that the operating team can maintain. Include content migration in the scope when needed."
      ],
      [
        "A controlled release",
        "Plan URL mappings if addresses change, test purchase scenarios and analytics, and agree who approves launch and handles issues afterwards."
      ]
    ],
    "steps": [
      [
        "Audit the current store",
        "Identify the specific constraints and confirm whether a redesign is warranted."
      ],
      [
        "Prototype the important journeys",
        "Review the product and collection experiences before extending the system to supporting pages."
      ],
      [
        "Build, check and release",
        "Validate the theme with realistic content and order scenarios, then launch against an agreed checklist."
      ]
    ],
    "inputs": [
      "Current storefront, theme and app inventory.",
      "Brand direction and the customer journeys that are causing difficulty.",
      "Content ownership, approval process and launch constraints."
    ],
    "faqs": [
      [
        "Can we keep our existing Shopify store and data?",
        "A theme redesign can normally be developed within the existing Shopify store. Any changes to catalogue structure, apps, customer accounts or integrations need their own assessment and migration plan."
      ],
      [
        "Will changing the theme affect SEO?",
        "Changing a theme can alter content, internal links, structured data and loading behaviour even when URLs stay the same. We include those checks; redirects are needed for URLs that genuinely change. Rankings cannot be guaranteed through a redesign."
      ],
      [
        "Can we redesign only product pages?",
        "Yes. A focused template engagement may be more suitable than a complete rebuild when the main problems are concentrated in product information or purchase controls."
      ]
    ],
    "related": [
      "shopify-cro",
      "shopify-development",
      "ai-product-photography"
    ],
    "insights": [
      "shopify-cro-audit-methodology"
    ],
    "sources": [
      [
        "Shopify theme architecture",
        "https://shopify.dev/docs/storefronts/themes/architecture"
      ]
    ]
  },
  {
    "slug": "woocommerce-to-shopify",
    "name": "WooCommerce to Shopify migration",
    "title": "WooCommerce to Shopify Migration Services",
    "description": "Plan a WooCommerce to Shopify migration with catalogue mapping, redirects, integration checks and launch validation. Discuss your migration with Cascon.",
    "summary": "Move platforms with a plan for what must keep working.",
    "intro": "A WooCommerce migration is a change to data, URLs and operating workflows as well as the storefront. Cascon scopes the move by identifying what needs to transfer, what must be rebuilt and what should be retired, with acceptance checks before the domain switches.",
    "fit": "For a WooCommerce business evaluating Shopify, especially when plugins, maintenance or merchandising workflows have become difficult to manage.",
    "image": "/images/services/shopify-cro.webp",
    "imageAlt": "Shopify storefront development visual",
    "tags": [],
    "projects": [],
    "deliverables": [
      [
        "A migration inventory",
        "Map products, variants, customers, orders, content, reviews and integrations. Check export quality and what each chosen import route can actually support."
      ],
      [
        "A redirect and content map",
        "Record important old URLs and map them to relevant new destinations. Review pages with search traffic and backlinks instead of sending every old URL to the homepage."
      ],
      [
        "A store and operations plan",
        "Scope theme work, payments, shipping, tax configuration with your advisers, email flows and reporting. Test integrations with representative records."
      ],
      [
        "A launch rehearsal",
        "Reconcile sample data, test orders and refunds where appropriate, agree the final data cutover and rollback decision, and monitor errors after launch."
      ]
    ],
    "steps": [
      [
        "Assess before committing",
        "Compare the requirements with Shopify capabilities and identify platform, data or app limitations."
      ],
      [
        "Build and reconcile",
        "Prepare the storefront and migrate a sample. Review exceptions before the full transfer."
      ],
      [
        "Cut over and monitor",
        "Agree a final sync and launch window, verify destination URLs and purchase paths, and review outstanding issues."
      ]
    ],
    "inputs": [
      "WooCommerce exports and the plugin/integration inventory.",
      "Important URLs, available search reports and content owners.",
      "Data retention requirements, order handling and the intended launch window."
    ],
    "faqs": [
      [
        "Can existing customer passwords transfer?",
        "Shopify’s migration guidance says customer passwords cannot be migrated. The customer-account approach and customer communications should be planned before launch."
      ],
      [
        "Will every WooCommerce feature transfer automatically?",
        "No. Plugins, subscriptions, reviews and historical data can require separate import tools, replacements or a scoped rebuild. We confirm the treatment of each dependency before quoting."
      ],
      [
        "Can migration guarantee no SEO or revenue loss?",
        "No. Redirect planning, content preservation and launch validation reduce avoidable risks, but search visibility, trading interruptions and platform differences require an explicit risk and monitoring plan."
      ]
    ],
    "related": [
      "shopify-development",
      "shopify-redesign"
    ],
    "insights": [
      "woocommerce-to-shopify-migration-checklist"
    ],
    "sources": [
      [
        "Shopify’s WooCommerce migration guidance",
        "https://help.shopify.com/en/manual/migrating-to-shopify/migrating-from-woocommerce"
      ],
      [
        "Shopify URL redirect limitations",
        "https://help.shopify.com/en/manual/online-store/menus-and-links/url-redirect"
      ]
    ]
  },
  {
    "slug": "ai-product-photography",
    "name": "AI product photography",
    "title": "AI Product Photography for Ecommerce Brands",
    "description": "AI-assisted product imagery, lifestyle scenes and campaign visuals for ecommerce. Cascon works from product references, art direction and careful review.",
    "summary": "New scenes. The same product.",
    "intro": "Cascon creates AI-assisted product imagery for ecommerce teams that need lifestyle scenes, launch visuals and a consistent creative direction. The brief starts with accurate product references and the details that must remain unchanged, rather than a promise that generation alone can replace every shoot.",
    "fit": "For brands with reliable product references that need additional settings, creative variations or a coordinated set of campaign assets.",
    "image": "/images/work/lumy.png",
    "imageAlt": "Lumy Dates product and gifting imagery from Cascon’s portfolio",
    "tags": [
      "ai-photography"
    ],
    "projects": [
      "finewares",
      "lumy-dates",
      "bagus",
      "citysky-builders"
    ],
    "deliverables": [
      [
        "A reference and fidelity brief",
        "Collect product views, packaging, colours, proportions and mandatory label details. Agree which elements are fixed and what creative changes are permitted."
      ],
      [
        "Visual direction",
        "Define scenes, lighting, composition and intended placements. Review a sample direction before producing a larger asset set."
      ],
      [
        "Selected, reviewed images",
        "Review geometry, labels, materials and brand consistency against the references. Separate an attractive concept from a product representation suitable for the intended use."
      ],
      [
        "Placement-ready delivery",
        "Agree image counts, crops, formats and resolution before production. Include editable source files or additional retouching only when scoped."
      ]
    ],
    "steps": [
      [
        "Brief and reference review",
        "Check whether the available imagery is sufficient and identify where a physical shoot or better reference is needed."
      ],
      [
        "Direction and production",
        "Agree a sample, generate and refine the selected scenes, and review with the brand team."
      ],
      [
        "Approve and export",
        "Check final product details and prepare the agreed formats for the chosen channels."
      ]
    ],
    "inputs": [
      "Clear product photographs, packaging artwork and visual guidelines.",
      "The surfaces, colours, text and proportions that must remain accurate.",
      "Intended placements, asset quantities, approval owners and usage requirements."
    ],
    "faqs": [
      [
        "Can AI photography replace a traditional shoot?",
        "It depends on the product and use. Exact textures, fine jewellery, fit, transparent materials or regulated packaging can require physical photography or substantial manual work. We assess suitability from the references before agreeing the production approach."
      ],
      [
        "How do you keep the product accurate?",
        "The scope includes reference review and a client approval process. Outputs should be checked for altered labels, invented details, distorted geometry and colour changes. No generated image should be treated as automatically accurate."
      ],
      [
        "Can you make images for Shopify and paid campaigns?",
        "Yes. We can scope crops and exports for product pages, banners and campaign placements. Marketplace and advertising requirements differ, so final usage needs to be checked against the destination channel."
      ]
    ],
    "related": [
      "ai-video-production",
      "shopify-development"
    ],
    "insights": [
      "shopify-cro-audit-methodology"
    ],
    "sources": []
  },
  {
    "slug": "ai-video-production",
    "name": "AI video production",
    "title": "AI Product Video & Ecommerce Creative Production",
    "description": "AI-assisted product videos and ecommerce campaign assets from Cascon. Define references, storyboards, product fidelity, deliverables and review stages.",
    "summary": "Give your products a story worth watching.",
    "intro": "Cascon develops AI-assisted product videos and creative assets for ecommerce campaigns. We agree the story, source material, product details and delivery formats before production, with a review process for visual consistency and the intended advertising or storefront placement.",
    "fit": "For ecommerce teams planning a product launch, a campaign concept or motion variations built around available product imagery.",
    "image": "/images/work/vibezon.jpg",
    "imageAlt": "Vibezon fashion project from Cascon’s AI media portfolio",
    "tags": [
      "ai-media"
    ],
    "projects": [],
    "deliverables": [
      [
        "A defined creative brief",
        "Agree the audience, product proposition, placement and the action the creative should support."
      ],
      [
        "Storyboard and references",
        "Plan the sequence, framing and fixed product details. Identify shots that need existing footage, a physical shoot or a different production method."
      ],
      [
        "Motion production and review",
        "Create and refine the agreed scenes, checking continuity, product shape, labels and movement against the references."
      ],
      [
        "Agreed campaign exports",
        "Specify duration, aspect ratios, captions, sound usage and number of variations in the brief. Additional edits and source delivery need an explicit scope."
      ]
    ],
    "steps": [
      [
        "Plan the story",
        "Choose a concept that suits the product and available source material."
      ],
      [
        "Produce and refine",
        "Review sample scenes, then develop the approved sequence with staged feedback."
      ],
      [
        "Deliver and learn",
        "Export the agreed formats. If campaign data is available, separate creative observations from conclusions about advertising performance."
      ]
    ],
    "inputs": [
      "Product photos or footage and approved brand assets.",
      "Target channels, campaign objective and any mandatory claims or disclosures.",
      "Required lengths, aspect ratios, audio rights and review deadlines."
    ],
    "faqs": [
      [
        "Can you create videos from existing product photos?",
        "Often, but the suitability depends on reference quality and the motion required. We review the inputs and propose a feasible sequence rather than assuming every still image can support every camera movement."
      ],
      [
        "Are music and usage rights included?",
        "Usage requirements must be agreed in the brief. Ownership, licensed source assets, music, synthetic people and platform conditions need review for the intended territories and channels."
      ],
      [
        "Will AI video improve our ROAS?",
        "Creative performance depends on the offer, audience, media setup and wider buying journey. We do not guarantee advertising results from an asset delivery."
      ]
    ],
    "related": [
      "ai-product-photography",
      "shopify-cro"
    ],
    "insights": [],
    "sources": []
  }
];
