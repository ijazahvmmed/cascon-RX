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
node scripts/check-policy.cjs
```

The screenshot-led design decisions and supplied source tokens are in DESIGN.md. Typography uses the bundled variable Geist font. GSAP SplitText and ScrollTrigger share a frame loop with Lenis, with native reduced-motion and touch behavior.

The primary domain is https://www.cascondigital.com. NEXT_PUBLIC_SITE_URL can override it for an intentional domain change. NEXT_PUBLIC_META_PIXEL_ID overrides the existing pixel ID. Meta tracking is suppressed on localhost to keep development visits out of production measurement.

See docs/seo-and-tracking.md for crawler routes, measurement semantics and production verification steps.

The contact panel uses the existing India phone number and business email from lib/constants.ts. Client logos are stored locally; sources are recorded in docs/brand-assets.json. Fourteen identities use genuine logo assets; Pinoy Grocers, Mehndi Online and Clipston Engineering retain name labels because their exact identities could not be verified. Platform logos identify tools, without asserting certification or partnership.

Commercial service pages, project overviews and guides are maintained in data/commercial-services.ts, data/project-profiles.ts and data/insights.ts. See docs/seo-execution-report.md for implementation and measurement, docs/organic-growth-backlog.md for next priorities and docs/content-evidence-requests.md before adding detailed case-study claims. Development and Vercel previews are noindex; other staging builds must set SITE_INDEXABLE=false before building. Optional verification tokens are described in .env.example.

For HTTP validation of development noindex safeguards, run npm run dev and then node scripts/check-preview.mjs in a second terminal. This check intentionally expects non-indexable responses and should not be run against the indexable production preview.

Sitemap generation is automatic in npm run build’s postbuild hook. Commit the generated data/sitemap-manifest.json with content changes. See docs/sitemap-and-indexing.md for modification-date provenance, production validation and Google/Bing submission steps. Do not bypass the release hook with a bare next build.
