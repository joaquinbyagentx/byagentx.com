# Farmacia demo storefront progress

Last updated: 2026-07-22

## Final implementation checkpoint

- Kept all source changes inside `projects/farmacia/` on `codex/farmacia-cart-20260722`; no deployment or push was performed.
- Reoriented the twelve-item fictional catalog around weight/metabolic wellbeing as the primary offer, followed by anti-aging/longevity, integral wellness, sleep/stress, recovery/movement, and hair/skin.
- Made `script.js` the canonical catalog source for cards, navigator recommendations, cart prices, and WhatsApp line items; all twelve cards expose an “Añadir al carrito” action.
- Added a responsive, accessible cart drawer with duplicate-item quantities, increase/decrease, remove, empty state, count badges, totals, local persistence, Escape/overlay close, focus trap/return, and safe DOM rendering.
- Added an inactive-by-default WhatsApp bridge. The sole destination setting is `<body data-whatsapp-number="">` in `index.html`; blank/invalid configuration opens nothing, while a valid digits-only E.164 destination prepares an encoded demo order summary.
- Preserved the premium visual system, top demo disclosure, reduced-motion behavior, local non-prescriptive navigator, emergency/medical/privacy boundaries, and fictional profile/review labels.

## Verification checkpoint

- Production JavaScript and the external browser QA harness pass syntax checks; route HTTP response is byte-identical to `index.html`.
- Automated real-Chrome QA passed at exact 1440×1000, 390×844, 320×700, and reduced-motion desktop viewports.
- Exercised duplicate add, several products, increase/decrease, remove, empty/reload persistence, all twelve add actions, count/total arithmetic, Escape/focus return, blank WhatsApp no-navigation behavior, and an in-memory-only valid destination with decoded message assertions.
- Verified 18 images decode, no horizontal overflow, no broken local anchors, no external runtime resources, and no page/console/network/HTTP errors.
- QA evidence remains outside Git under `/tmp/farmacia-cart-qa/`; no screenshots or generated reports are production files.
