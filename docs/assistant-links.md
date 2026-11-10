# Assistant and AI handoff links

WhatsApp is the primary contact CTA in both dialog views. The floating sparkle icon opens contact options; the FAQ button opens the same native dialog directly in its AI view. All five provider links carry the same visible, reviewable public question in q. No clipboard access, automatic message sending, model API or personal enquiry data is used.

The provider anchors intentionally use ordinary HTTPS links in the same browsing context. This preserves direct user activation for Universal Links / Android App Links and provides a web fallback. The website cannot detect installation or override a phone's browser/app-link preferences. A real iOS/Android device with each app installed is required to certify every native handoff; desktop viewport emulation cannot certify it. In particular Gemini's advertised iOS app association does not currently include the general /app?q route, so that route must retain a browser fallback rather than claim a guaranteed native launch.

Formats verified against first-party sources on 2026-11-10:

- ChatGPT: https://chatgpt.com/?q=... . https://chatgpt.com/.well-known/apple-app-site-association explicitly associates root q and prompt query links with its iOS apps.
- Claude: https://claude.ai/new?q=... . /new is an allowed path in https://claude.ai/.well-known/apple-app-site-association . The q prefill format is also documented at https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link (the custom scheme in that article is desktop-specific; this website does not force it).
- Gemini: https://gemini.google.com/app?q=... . This is Chromium's built-in Gemini search URL in https://github.com/chromium/chromium/blob/main/components/search_engines/template_url_starter_pack_data.cc . https://support.google.com/gemini/answer/14886647 documents the corresponding Chrome shortcut. Mobile association: https://gemini.google.com/.well-known/apple-app-site-association .
- Grok: https://grok.com/?q=... . Grok's public web client reads new URLSearchParams(location.search).get('q') (observed in https://cdn.grok.com/_next/static/chunks/1uj2cberzxsz1.js). https://grok.com/.well-known/apple-app-site-association associates its permitted web paths with the iOS app.
- Perplexity: https://www.perplexity.ai/search?q=... . https://www.perplexity.ai/opensearch.xml defines the q search template, and https://www.perplexity.ai/.well-known/apple-app-site-association includes /search.

The prepared question can be inspected before opening a provider. An external provider may prefill its composer or begin a query, depending on that provider; this site does not simulate pressing Send. Meta Pixel retains existing AIOutboundClick events (provider name only) and WhatsApp contact-intent events. No completed lead is inferred from an outbound click.

The FAQ trigger uses a shared request store so a request made before the dialog finishes hydrating is retained. The store exposes a stable snapshot to useSyncExternalStore; repeat activations receive a new request ID. The modal preserves heading focus during its GSAP view transition. Regression checks: npm run test:assistant. Browser checks: assistant-validation.json.
