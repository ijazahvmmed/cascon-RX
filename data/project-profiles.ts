export interface ProjectProfile { slug: string; name: string; industry: string; intro: string; context: string; scope: string[][]; services: string[]; source: string; documentedDetails?: { title: string; body: string }[]; verifiedOutcomes?: { statement: string; evidenceUrl: string }[]; }
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
    "name": "Slept Club",
    "industry": "Sleep essentials",
    "intro": "An ecommerce home for sleep essentials, with store development and product media in one brief.",
    "context": "For sleep products, imagery needs to communicate the product and its setting while the store makes product information easy to find. The storefront and creative work are connected parts of this project scope.",
    "scope": [
      [
        "Shopify development",
        "Store development on Shopify."
      ],
      [
        "AI photography",
        "AI-assisted imagery for the brand’s product presentation."
      ],
      [
        "Content",
        "Content work alongside the storefront and creative."
      ],
      [
        "SEO & AEO",
        "Search and answer-engine foundations for the website."
      ]
    ],
    "services": [
      "shopify-development",
      "ai-product-photography"
    ],
    "source": "https://wearslept.com/"
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
    "intro": "A Shopify and creative project for an artisan home decor brand.",
    "context": "Home decor benefits from a view of the product as an object and as part of a room. This project connects the store with product imagery, content and search foundations.",
    "scope": [
      [
        "Shopify development",
        "Custom Shopify build work is recorded in the project scope."
      ],
      [
        "AI photography",
        "AI-assisted product photography is part of the creative work."
      ],
      [
        "Content",
        "Content work accompanies the storefront and imagery."
      ],
      [
        "SEO & AEO",
        "Search foundations form part of the website scope."
      ]
    ],
    "services": [
      "shopify-development",
      "ai-product-photography"
    ],
    "source": "https://www.bagus.in/"
  }
];
