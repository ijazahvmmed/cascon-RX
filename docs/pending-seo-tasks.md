# Pending SEO tasks

From the OpenSEO audit and the city-search research of 23 November 2026. The code changes are done; these are what's left, in order of impact.

## 1. Indexing (main blocker — do first)

- [ ] **Vercel:** Settings → Domains → `cascondigital.com` → Edit → keep "Redirect to www.cascondigital.com" and set **308 Permanent** (it is a temporary 302 today).
- [ ] **Search Console:** URL Inspection → **Request indexing** for: home, `/shopify-agency/dubai`, `/shopify-agency/bangalore`, `/shopify-agency/kerala`, `/services/woocommerce-to-shopify`, `/services/shopify-development`, and the two guides.
- [ ] **Search Console:** after the Vercel change, open "Page with redirect" → **Validate fix**.

## 2. Google Business Profiles (biggest lever for city and map searches)

- [ ] **Bangalore profile** — name **Cascon Digital**, address `No. 33, 4th Floor, 1st Main, Ganganagar Gramatana, HMT Layout, CBI Road, Bangalore 560032`, phone `+91 82816 63376`, website `https://www.cascondigital.com/shopify-agency/bangalore`.
- [ ] **Dubai profile** — name **Cascon Digital**, address `Office #2220, 22nd Floor, Tower Plaza, Sheikh Zayed Road, Dubai`, phone `+971 54 747 5998`, website `https://www.cascondigital.com/shopify-agency/dubai`.
- [ ] For both: categories such as *E-commerce service* and *Website designer*, services, photos, opening hours. Name, address and phone must match the website exactly.
- [ ] **Start collecting Google reviews** from clients (slowest part — start now).
- [ ] **Kochi:** don't create a profile unless you have a real, staffed office there. Google suspends profiles at fake addresses.

## 3. Directories and lists (also fixes the backlink problem)

- [ ] **Shopify Partner Directory**: https://www.shopify.com/partners
- [ ] **Clutch, Sortlist, GoodFirms** profiles; ask clients for Clutch reviews.
- [ ] **businessfinder.ae** and **topdevelopers.co**.
- [ ] Pitch "top Shopify agencies" lists for **Bangalore, India, Dubai** and **South India / Kochi**.
- [ ] Use the same facts everywhere:
  - Name: **Cascon Digital** (not "Cascon", to avoid the CASCON conference)
  - Offices: Bangalore and Dubai (Kerala served remotely)
  - Services: Shopify development, CRO, AI media, SEO & AEO
  - Client work: Finewares, Slept Club, Lumy Dates (UAE), Citysky Builders (Kerala)

## 4. Brand consistency

- [ ] Make **LinkedIn, Instagram, Clutch and Crunchbase** all say "Cascon Digital" with the same description and offices.
- [ ] Send those profile URLs so they can be added to the site's `sameAs` schema (only Instagram is there today).

## 5. Confirm prices (all are estimated market rates)

- [ ] **Migration** (`/services/woocommerce-to-shopify`): Starter ₹40,000–₹80,000 / $500–$1,000 · Growth ₹80,000–₹2,00,000 / $1,000–$2,500 · Custom from ₹2,00,000 / $2,500. Edit in `data/commercial-services.ts`.
- [ ] **Dubai store builds**: AED 6,000–12,000 · AED 12,000–30,000 · from AED 30,000 (USD shown at about 3.67). Edit in `data/locations.ts`.
- [ ] **Bangalore and Kerala store builds**: ₹60,000–₹1,50,000 · ₹1,50,000–₹4,00,000 · from ₹4,00,000. Edit in `data/locations.ts`.
- [ ] **Dubai page claims** to confirm you deliver: Arabic/RTL stores, Tabby and Tamara, GCC markets, same-day delivery setup.

## 6. Proof (needs your content, then code)

- [ ] **One real WooCommerce → Shopify case study** for the migration page: client, what was migrated, timeline, how redirects/SEO were handled, results, permission to publish.
- [ ] **Case studies with real numbers per region** (conversion rate, speed, revenue) — at least one UAE and one India project.
- [ ] **Certifications / Shopify partner status** to show on the city pages once verified.
- [ ] **Shopify store work for a Dubai/UAE brand** beyond Lumy Dates, if you have it.

## Later

- [ ] **Re-test homepage speed** on https://pagespeed.web.dev after deploying (today's free API quota was used up). The hero and logo images were cut from ~530 KB to ~55 KB.
- [ ] **Publish a sample CRO audit** (anonymised, with consent) to strengthen the CRO guide.
- [ ] **Re-check backlinks around 23 December 2026.**
- [ ] **Sign in to OpenSEO** in Claude Code (`/mcp`) for future audits and tracking.

## What to expect

Indexed pages within weeks; map and directory presence in 1–3 months; page-one results for narrow city phrases in about 3–6 months. The top spot for broad searches like "shopify agency dubai" depends on links and reviews and takes longer.

## Done (for reference)

- City pages: `/shopify-agency/dubai` (AED + USD), `/shopify-agency/bangalore` (₹), `/shopify-agency/kerala` (₹, says no Kochi office) — each with local needs, local client work, prices, office details, FAQs and structured data. Linked from the footer and `llms.txt`.
- Organization schema: both offices, both phone numbers, links to each office page.
- Homepage speed: responsive hero images (49–78 KB instead of ~310 KB) and logo PNGs cut from 188 KB to 5 KB.
- Migration page: SEO-retention section, price/timeline tiers, FAQs, ₹/$ by visitor location.
- Migration checklist links to the migration page.
- Site renamed to "Cascon Digital"; all titles ≤ 60 characters; dates and sitemap refreshed.
