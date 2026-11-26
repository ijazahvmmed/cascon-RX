export interface ProjectProfile {
  slug: string;
  name: string;
  industry: string;
  intro: string;
  context: string;
  scope: string[][];
  services: string[];
  source?: string;
  headline?: string;
  status?: string;
  seoTitle?: string;
  description?: string;
  heroAlt?: string;
  heroCaption?: string;
  highlights?: [string, string][];
  documentedDetails?: { title: string; body: string }[];
  outcomes?: string[];
  verifiedOutcomes?: { statement: string; evidenceUrl: string }[];
  timeline?: { milestone: string; duration: string }[];
  gallery?: { src: string; width: number; height: number; alt: string; caption: string }[];
  evidence?: { label: string; url: string }[];
  relatedArticles?: string[];
  relatedProjects?: string[];
  published?: string;
  updated?: string;
}

export const projectProfiles: ProjectProfile[] = [
  {
    "slug": "finewares",
    "name": "Finewares",
    "industry": "Cookware",
    "intro": "A cookware brand bringing product choice and everyday cooking together in an ecommerce storefront.",
    "context": "Cookware needs clear product presentation: the type of pan, its intended use and the way it appears in a kitchen all contribute to a buying decision.",
    "scope": [
      [
        "Shopify development",
        "The project scope includes the Shopify storefront."
      ],
      [
        "AI photography",
        "AI-assisted product imagery forms part of the creative scope."
      ],
      [
        "Content",
        "Content work supports the brand and product presentation."
      ],
      [
        "SEO & AEO",
        "Search and answer-engine foundations are included in the project scope."
      ]
    ],
    "services": [
      "shopify-development",
      "ai-product-photography"
    ],
    "source": "https://finewares.in/"
  },
  {
    "slug": "slept-club",
    "name": "WearSlept",
    "industry": "Sleep essentials",
    "intro": "Cascon Digital built and launched a custom Shopify storefront for WearSlept in under seven days. The launch gave the brand a store it could use to validate demand.",
    "context": "WearSlept sells satin pillowcases, bonnets, scrunchies, eye masks and coordinated sleep accessories. The brand needed a functioning store on a compressed schedule, with a visual identity that carried through from product discovery to checkout.",
    "scope": [
      [
        "Custom storefront",
        "Custom-coded components supported a brand-led, mobile-first storefront."
      ],
      [
        "Catalogue and variants",
        "The launch included setup for products and their variants, with imagery and content to help shoppers distinguish options."
      ],
      [
        "Purchase journey",
        "The team delivered a functional cart and checkout journey and prepared the store for launch."
      ]
    ],
    "services": [
      "shopify-development",
      "ai-product-photography"
    ],
    "source": "https://wearslept.com/",
    "headline": "From concept to commerce in under seven days.",
    "status": "Launched",
    "seoTitle": "WearSlept Shopify Store in Under 7 Days",
    "description": "How Cascon Digital built and launched WearSlept’s custom Shopify storefront in under seven days to support market validation.",
    "highlights": [
      [
        "Delivery",
        "Under seven days from concept to launch"
      ],
      [
        "Launch objective",
        "A functioning storefront for market validation"
      ]
    ],
    "documentedDetails": [
      {
        "title": "How the work fit into a short launch window",
        "body": "The brief brought product presentation, storefront design and Shopify development into one workstream. The launch scope covered the catalogue, custom storefront components and the mobile buying journey. Product imagery and content supported the same layouts the development work needed to deliver."
      }
    ],
    "outcomes": [
      "The storefront launched in under seven days. The delivery timeline comes from Cascon Digital’s project account. The storefront was built for market validation."
    ],
    "relatedArticles": [
      "how-long-to-build-shopify-store",
      "shopify-website-development-cost-india"
    ],
    "relatedProjects": [
      "finewares",
      "bagus"
    ],
    "updated": "2026-11-26",
    "heroAlt": "WearSlept sleep accessories shown in Cascon Digital’s portfolio"
  },
  {
    "slug": "lumy-dates",
    "name": "Lumy Dates",
    "industry": "Dates & gifting",
    "intro": "Shopify development and creative work for a dates and gifting brand serving the UAE.",
    "context": "A gifting store brings product presentation and purchase context together. Product imagery, packaging and the information around the selection help a visitor understand what they are considering.",
    "scope": [
      [
        "Shopify development",
        "The brand’s ecommerce storefront is part of the Shopify development scope."
      ],
      [
        "AI photography",
        "AI-assisted product imagery is included in the creative work."
      ],
      [
        "Content",
        "Brand and product content form part of the scope."
      ],
      [
        "SEO & AEO",
        "Search and answer-engine foundations support the website content."
      ]
    ],
    "services": [
      "shopify-development",
      "ai-product-photography"
    ],
    "source": "https://www.lumydates.com/"
  },
  {
    "slug": "citysky-builders",
    "name": "Citysky Builders",
    "industry": "Property & home building",
    "intro": "Website, content and AI photography work for a home builder in Kerala.",
    "context": "A property website has a different buying journey from a product catalogue. Its role is to help a visitor understand the business and available information before making an enquiry.",
    "scope": [
      [
        "Web design",
        "Website design is included in the project scope."
      ],
      [
        "AI photography",
        "The creative scope includes AI-assisted imagery."
      ],
      [
        "Content",
        "Content work supports the website presentation."
      ]
    ],
    "services": [
      "ai-product-photography"
    ],
    "source": "https://www.cityskyhomes.com/"
  },
  {
    "slug": "bagus",
    "name": "Bagus",
    "industry": "Home decor",
    "intro": "Cascon Digital helped Bagus Home Decor transition from WooCommerce to Shopify, with storefront development and catalogue organisation forming part of the move.",
    "context": "Bagus is an established home decor and lifestyle brand. It needed to move an existing commerce business while keeping its catalogue understandable, its presentation recognisable and its shopping journey workable on mobile.",
    "scope": [
      [
        "Platform transition",
        "Cascon coordinated the move from WooCommerce and built the Shopify storefront."
      ],
      [
        "Product and collection organisation",
        "The project covered how the existing range was organised and presented in the new store."
      ],
      [
        "Shopping and presentation",
        "The scope included the mobile shopping journey, brand-consistent presentation, imagery and content."
      ]
    ],
    "services": [
      "woocommerce-to-shopify",
      "shopify-development",
      "ai-product-photography"
    ],
    "source": "https://www.bagus.in/",
    "headline": "A new commerce platform. A seamless transition.",
    "status": "Launched",
    "seoTitle": "Bagus WooCommerce to Shopify Migration",
    "description": "How Cascon Digital helped Bagus Home Decor move from WooCommerce to Shopify while bringing its catalogue and brand into the new store.",
    "highlights": [
      [
        "Platform transition",
        "WooCommerce to Shopify"
      ],
      [
        "Delivery focus",
        "Catalogue organisation and a brand-consistent storefront"
      ]
    ],
    "documentedDetails": [
      {
        "title": "Designing for a store that already trades",
        "body": "An existing store brings a catalogue, a recognisable presentation and operating requirements into the brief. For Bagus, the platform move and storefront build were coordinated around those needs. In a migration brief, data transfer, redirects and operational cutover should each be scoped separately."
      }
    ],
    "outcomes": [
      "Bagus completed the move to Shopify and the new storefront is available at the brand’s website."
    ],
    "relatedArticles": [
      "woocommerce-to-shopify-migration-checklist",
      "woocommerce-vs-shopify"
    ],
    "relatedProjects": [
      "slept-club",
      "finewares"
    ],
    "updated": "2026-11-26",
    "heroAlt": "Artisan home decor imagery for the Bagus Shopify project"
  },
  {
    "slug": "bekid",
    "name": "Bekid",
    "headline": "Beyond the storefront. A new dimension of shopping.",
    "industry": "Kidswear and fashion retail",
    "intro": "Cascon Digital built an immersive 3D showroom within a custom Shopify storefront for Bekid. Shoppers can explore kidswear through displays in a branded space.",
    "context": "Bekid wanted online discovery to feel closer to walking through a showroom. The design gives shoppers room to explore the brand’s range, with familiar Shopify catalogue and cart routes available alongside the scene.",
    "seoTitle": "Bekid Immersive 3D Shopify Showroom",
    "description": "Explore how Cascon Digital built an interactive 3D showroom within Bekid’s custom Shopify storefront for kidswear and fashion retail.",
    "heroAlt": "Bekid’s virtual showroom with kidswear and footwear on illuminated product stands",
    "heroCaption": "Showroom poster from Bekid’s Shopify theme export.",
    "highlights": [
      [
        "Platform",
        "Shopify"
      ],
      [
        "Experience",
        "Interactive 3D showroom and product discovery"
      ]
    ],
    "documentedDetails": [
      {
        "title": "From a showroom display to a product",
        "body": "Shoppers can move between merchandise displays within the showroom. The Shopify theme includes controls for exploring products, opening the cart and exiting the scene. A collection link offers another route into the catalogue."
      },
      {
        "title": "The Kerala-first claim",
        "body": "Cascon Digital describes Bekid as Kerala’s first immersive 3D showroom integrated into a Shopify storefront. The claim has yet to be independently verified. The public rollout status of the showroom remains unconfirmed."
      }
    ],
    "scope": [
      [
        "Custom Shopify development",
        "Integrated the showroom within Bekid’s Shopify storefront."
      ],
      [
        "Interactive product discovery",
        "Built an immersive environment with product displays that shoppers can browse."
      ],
      [
        "Brand-focused design",
        "Carried Bekid’s visual identity into the showroom through signage, lighting and merchandising displays."
      ]
    ],
    "source": "https://www.bekid.store/",
    "services": [
      "shopify-development"
    ],
    "relatedArticles": [
      "3d-virtual-showroom-shopify"
    ],
    "relatedProjects": [
      "slept-club",
      "finewares"
    ],
    "updated": "2026-11-26"
  }
];
