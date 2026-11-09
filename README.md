# Cascon

Next.js website for Cascon, a Shopify agency and AI media studio in Bangalore and Dubai.

## Local development

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production validation:

```sh
npm run build
npm start
node scripts/check-site.mjs
node scripts/check-pixel.cjs
```

The screenshot-led design decisions and supplied source tokens are in DESIGN.md. Typography uses the bundled variable Geist font. GSAP SplitText and ScrollTrigger share a frame loop with Lenis, with native reduced-motion and touch behavior.

The primary domain is https://www.cascondigital.com. NEXT_PUBLIC_SITE_URL can override it for an intentional domain change. NEXT_PUBLIC_META_PIXEL_ID overrides the existing pixel ID. Meta tracking is suppressed on localhost to keep development visits out of production measurement.

See docs/seo-and-tracking.md for crawler routes, measurement semantics and production verification steps.

The contact panel uses the existing India phone number and business email from lib/constants.ts. Client logos are stored locally; sources are recorded in docs/brand-assets.json. Fourteen identities use genuine logo assets; Pinoy Grocers, Mehndi Online and Clipston Engineering retain name labels because their exact identities could not be verified. Platform logos identify tools, without asserting certification or partnership.
