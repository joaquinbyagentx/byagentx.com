# Farmacia demo storefront progress

Last updated: 2026-07-21

## Audit / information architecture — COMPLETE

- Confirmed the isolated worktree starts at required commit `34347ef7db5f86a5afc27c5d3ef262548d580334` and is scoped to `projects/farmacia/`.
- Reframed the page as a Spanish Decide/Learn storefront with a secondary Explore catalog surface: offer, benefits, filters, twelve priced demo programs, comparison, agent, journey, portal/delivery/support, fictional team, illustrative reviews, FAQ, and closing conversion.
- Reduced large disclaimer treatment to one concise global banner. Retained compact local honesty metadata for every fictional team card and review.
- Defined compliance boundaries: no prescriptions, dosing, treatment protocols, eligibility decisions, medical claims, checkout, accounts, contact capture, PHI/PII, or live service promises.

## Image generation — COMPLETE

- Generated five new original commerce assets through `image_generate`: one flagship hero and four catalog still lifes.
- Rejected one initial hero generation because visual review found pseudo-labels and a device logo; it was not downloaded into production.
- Visually reviewed accepted assets for text, logos, medication, needles, medical devices, before/after framing, anatomy, and obvious rendering defects.
- Optimized accepted masters to self-hosted WebP at quality 84. Raw PNG masters remain outside production under `/tmp/farmacia-commerce-masters`.
- Updated `assets/image-manifest.json` for all 16 referenced generated assets. The active tool reported FAL.ai FLUX 2 Klein 9B rather than the requested GPT Image 2 and exposes no model selector; the mismatch remains recorded.

## Storefront implementation — COMPLETE

- Rebuilt `index.html` and `styles.css` as a polished, responsive full-funnel demo storefront with one H1, semantic sections, clear illustrative monthly pricing, seven required categories, catalog filters, comparison table, journey, portal, delivery, support, team, reviews, FAQ, and strong non-transactional CTAs.
- Kept production runtime self-contained: local HTML, CSS, JavaScript, SVG, and WebP only; no remote assets, frameworks, fonts, forms, transaction links, or unrelated route changes.
- Added keyboard-visible focus, skip navigation, 44px targets, responsive 320px behavior, lazy loading, and reduced-motion handling.

## Sales agent integration — COMPLETE

- Added an offline deterministic Spanish sales agent reachable from hero, navigation, catalog, comparison, support, and closing CTAs.
- The agent asks only goal, preferred guidance style, and illustrative monthly budget, then ranks one to three catalog options and explains the match.
- Hardened after adversarial review: raw free text is never echoed; only canonical local choice labels enter the transcript. Identity, address, social-handle and broad health-condition language is rejected without storage or repetition.
- Expanded fail-closed Spanish crisis coverage for self-harm, suicide, cardiac, neurologic, breathing, poisoning, overdose, and common first-person ingestion/intoxication language. Compositional checks combine ingestion verbs with toxic substances or medication-overdose signals instead of relying only on exact phrases; recognized emergencies lock sales controls and focus an alert.
- Added free-text clarification, contact-data rejection, medical-decision boundary routing, reset, close/reopen cleanup, dynamic-step focus reassignment, focus trap/return, mobile full-screen layout, and direct recommended-card highlighting.
- No API, secret, network request, persistence, contact action, payment, account, or fake checkout is present.

## QA — COMPLETE

- Served the exact route at `http://127.0.0.1:8877/projects/farmacia/`, received HTTP 200, and byte-compared the response with the worktree `index.html`.
- Automated browser QA passed at 1440×1000, 390×844, 320×700, and 1440×1000 with reduced motion: zero console/page/HTTP errors, zero horizontal overflow, zero external runtime resources, zero broken images/anchors, one global banner, one H1, and all controls at least 44×44px.
- Exercised 98 agent/safety scenarios covering metabolic, longevity, recovery, capped low/mid budgets, ambiguous input, identity/address/social/medical boundaries, multiple emergency and compositional ingestion/poisoning variants (including regional household/industrial toxic substances, written quantities, container-only medication wording, complete containers, third-person/reflexive verb morphology, and reversed word order), five routine 1–5 quantity controls that remain on the medical boundary, reset, close/reopen, product CTA, catalog linkage, mobile agent, keyboard navigation, focus return, destination-card focus after its scheduled animation frame, and reduced motion.
- Axe WCAG 2/2.1 A/AA QA passed with zero violations at desktop and 320px mobile (27 and 28 passing rule groups respectively); `color-contrast` remained the sole automated-incomplete rule at both viewports and the prior visual review found no contrast blocker.
- JavaScript syntax passed for production and both external QA scripts. Static/compliance checks passed with 41 unique IDs, 14 in-page anchors, 18 non-empty-alt image elements, 16 local image references, 16 matching manifest entries, zero forms, zero remote runtime references, and zero forbidden network/storage/dynamic-HTML patterns.
- All 16 manifest production images are local, tracked or staged for tracking, non-empty, decodable WebP files. Both staged and unstaged diff whitespace checks passed.
- Desktop and mobile screenshots plus machine-readable QA reports are outside production at `/tmp/farmacia-commerce-qa/`; QA source remains outside Git at `/tmp/farmacia-qa/`.
- Full-page narrow screenshots can repeat painted tiles in Chromium's very-tall-page capture renderer; ordinary viewport evidence plus DOM assertions confirm one hero, one main, one footer, no duplicated page content, and zero horizontal overflow.
- Visual slop diagnostic: 0/10. No tech gradient, generic tech hue, equal-weight feature-tile composition, accent rail, unearned blur, monument stat, icon topper, center-stack dependence, default type, or surface mismatch fired.

## Final — COMPLETE

- Initial independent adversarial audits correctly blocked commit on free-text echo, missed crisis phrases, dynamic focus loss, budget-label semantics, and banner prominence; those findings were fixed before this finalization pass.
- Final regression QA preserved complete-container emergency detection while preventing routine one-digit medication quantities from being misclassified as emergencies; medication wording continues to route fail-closed to the medical boundary.
- Production changes are scoped to `projects/farmacia/`; the supplied backup, unrelated `.gitignore` change, QA scripts, screenshots, raw generations, caches, and logs remain outside the production commit.
- No verification blocker remains; the production tree is complete and ready for the verified local commit.
