# Sitemap and indexing

Production sitemap: **https://www.cascondigital.com/sitemap.xml**
Production robots: **https://www.cascondigital.com/robots.txt**

## Automatically maintained generation

Use npm run build for a release. After Next.js compiles and prerenders, the npm postbuild hook runs scripts/build-sitemap.mjs. It discovers page routes from Next’s actual app-path and prerender manifests. There is no manually maintained static URL list.

New static pages are discovered automatically. New records returned by generateStaticParams for services, articles and project/case-study pages are discovered automatically as well. Route groups are handled. Private Next folders and non-page route handlers are not included. A new dynamic family without discoverable static parameters fails the build instead of silently dropping its URLs; provide generateStaticParams for its public records.

The build starts its own temporary production Next server on a free loopback port and inspects the real HTTP responses. Only public HTML pages returning 200, with exactly one self-referencing production canonical and no noindex directive, can enter the sitemap. Redirects, 404s, other non-200 responses, canonical aliases and noindex pages are excluded. Unexpected server errors or conflicting/missing canonicals fail the build. Private prefixes /api, /admin, /account and /preview are excluded independently; extend the policy when introducing another private namespace, and keep actual authentication and noindex controls in place.

The validated output is written to data/sitemap-manifest.json. The native app/sitemap.ts metadata route serializes it to XML. It uses a small server-side file read so the postbuild-validated artifact is served without rebuilding the application again. outputFileTracingIncludes packages the manifest for the sitemap route. It is not a public JSON endpoint and no source-history metadata is exposed in the XML.

All entries must be reachable from the homepage through ordinary HTML links. The release build fails for an orphaned indexable page, so the author must add a relevant contextual link rather than an indiscriminate generated footer link.

## Accurate lastmod policy

There is no current-time fallback, changefreq or priority field.

Each page has a persisted fingerprint of its rendered main content, links, informative image identities/bytes, title, canonical/social metadata and JSON-LD. Build scripts, markup-only differences and unrelated footer/copyright changes do not reset it. With unchanged content, the recorded lastmod is reused, including across a new checkout or production rebuild.

For new or changed content, the generator examines the actual page, imported editorial/data dependencies and referenced local assets. It uses Git’s last content commit when the working file matches HEAD, or the real source-file modification timestamp when the file is modified/untracked in the working tree. Analytics, scrolling and animation-only modules are excluded from editorial provenance. The exact source timestamp, file and basis are retained for audit in the manifest history. Lastmod is emitted as a calendar date in Asia/Kolkata, matching the business’s editorial timezone; it is not a fabricated build/publication time.

This source-based policy reflects the current repository-backed publishing system, not unknown historical authorship dates. It does not infer a specific record’s original publication date from a shared file. Subsequent edits that leave a page’s rendered fingerprint unchanged preserve that page’s date. If content moves to an external CMS, integrate that source’s verified modification timestamps before publishing CMS-driven routes.

Commit data/sitemap-manifest.json together with the content change after a successful build. That preserves the verified date history across deployments. A build without Git can reuse unchanged recorded fingerprints; if changed content lacks trusted history or a changed rendered page has no newer verified editorial source, it fails rather than substituting checkout time. Never manually set every date to today to clear a validation failure.

## Preview and private-route safeguards

Development, Vercel preview/development builds and SITE_INDEXABLE=false return an empty sitemap, restricted robots output and noindex headers/metadata. Other staging providers must set SITE_INDEXABLE=false before building. Public production robots references the exact production sitemap URL. A robots rule is not an access-control mechanism; private pages still need proper authentication.

## Validation commands

- npm run build — includes the production-response generation and XML validation gate.
- npm run test:sitemap — checks the running local production server at localhost:3000.
- npm run test:sitemap:logic — tests automatic static/dynamic discovery, private-route policy, malformed XML, redirect/noindex/canonical filtering and stable fingerprints.
- npm run test:sitemap:stability — regenerates against the same production artifact and checks that the manifest/dates remain identical.
- npm run test:sitemap:stability -- --full-build — performs a complete Next production rebuild and verifies unchanged dates/history.
- node scripts/validate-sitemap.mjs https://www.cascondigital.com --report docs/sitemap-live-validation.json — compares the actually deployed sitemap and routes with the locally validated release. Missing unpublished pages or older lastmod output are reported as differences, not hidden.
- npm run test:site — checks metadata, sitemap coverage, internal anchors, discovery, assets and route responses.
- node scripts/check-preview.mjs — run against next dev to check actual non-production HTTP safeguards.

The validator requires XML HTTP 200, a valid sitemap namespace, correct absolute production URLs, unique locations, real non-future lastmod dates, no priority/changefreq, exactly one matching page canonical, indexable HTTP 200 destinations and a robots reference. Its XML parser is a development/build-only dependency; production XML serialization remains native Next.js.

Reports: docs/sitemap-build-validation.json records the production-build checks; docs/sitemap-live-validation.json records the separate live-domain comparison. A successful local build does not mean these changes have been deployed or indexed.

## Submit to Google Search Console

After the approved production release:
1. Sign in with owner permissions and choose the verified cascondigital.com domain property or the https://www.cascondigital.com/ URL-prefix property.
2. Confirm the sitemap URL above is publicly accessible and rerun the live validator. Inspect a new service URL to confirm the expected canonical and crawl access.
3. Open Indexing → Sitemaps. In Add a new sitemap, enter the sitemap URL (or sitemap.xml when the property prefix is already supplied) and submit it.
4. Check that processing succeeds. Review discovered URLs, indexing exclusions and URL Inspection for representative service, guide and project pages.

[Google’s Sitemaps report instructions](https://support.google.com/webmasters/answer/7451001) explain owner permissions, submission and processing status. Submission does not confirm that every URL is indexed.

## Submit to Bing Webmaster Tools

1. Sign in and select the verified www.cascondigital.com site. Verify ownership or import the appropriate Google Search Console property if it has not been added.
2. Open Sitemaps → Submit sitemaps.
3. Submit https://www.cascondigital.com/sitemap.xml.
4. Review its processing status, discovered URL count and any errors; inspect representative new URLs after release.

[Bing’s Sitemaps documentation](https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed) describes submission and monitoring. The robots reference also supports automatic discovery. No deprecated anonymous ping endpoint is used, and no account submission was performed in this task.

## Executed validation

Validated on 10 November 2026:

- Full npm run build succeeded, including the automatic postbuild production-response gate.
- The production build exposes 22 canonical/indexable URLs and 22 source-based lastmod dates. The /careers redirect is excluded. Metadata routes, 404/private paths and non-page handlers are absent.
- Sitemap XML parsing, namespace, absolute domain, HTTP 200, canonical uniqueness, destinations and robots reference passed.
- All 22 public pages are discoverable from the homepage through the existing HTML-link graph; the general integration check covers 82 internal destinations/anchors.
- The lightweight regeneration test AND a complete new Next production rebuild preserved every manifest byte and lastmod value for unchanged content.
- Production file tracing was checked: the sitemap manifest is included in the route’s deployment file list.
- Lint, types, sitemap discovery/exclusion/fingerprint tests, preview policy tests, full site checks and pixel tests passed. Production dependency audit reported zero vulnerabilities.
- A separate real live-domain check returned HTTP 200 and syntactically valid XML with eight URLs, zero lastmod dates, and 14 expected new routes still returning 404. The current deployment therefore does not yet match the validated release. The live comparison intentionally returns a failing status until the release is deployed; its detailed findings are saved in sitemap-live-validation.json.

No release, DNS change, account verification or Google/Bing sitemap submission was performed. After the approved deployment, rerun the live validator and then submit the exact sitemap URL above. Do not submit localhost URLs.
