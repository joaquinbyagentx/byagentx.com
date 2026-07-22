# Mereon demo — content and compliance notes

Last updated: 2026-07-21

## Public identity and global disclosure

Mereon is a fictional ByAgentX demonstration of storefront design and conversational product navigation. It is not represented as a pharmacy, medical provider, prescriber, dispenser, clinician network, active store, or regulated service.

The page uses one prominent above-the-fold Spanish banner:

> DEMO BYAGENTX — Mereon es una demostración, no una farmacia, tienda activa ni proveedor médico. No vende, prescribe, almacena ni transmite datos.

This is the only large global disclaimer. Other honesty statements are compact metadata placed beside the content they qualify.

## Catalog and pricing boundary

- All twelve program names and SKUs are fictional.
- Monthly prices are illustrative and cannot be purchased.
- Programs are content, planning, routine, and navigation concepts—not real prescriptions, medications, peptide compounds, treatment protocols, eligibility offers, controlled substances, or medical devices.
- The page makes no diagnosis, prevention, cure, guaranteed-result, exact-outcome, jurisdiction, licensure, certification, approval, partnership, pharmacy, shipping, or provider-availability claim.
- Buttons open the local demo agent or navigate to local page sections. There is no cart, checkout, payment, registration, account, upload, intake form, transaction endpoint, or external purchase link.

## Sales-agent boundary

The JavaScript agent is a deterministic local catalog navigator. It asks only:

1. a general wellness-shopping goal;
2. preferred navigation style;
3. illustrative monthly budget.

It does not need or request identity, email, phone, address, diagnosis, symptoms, medication history, health history, payment, or other sensitive data. The text field exists only as an optional local interface for short non-sensitive replies; input is held in the current DOM, is never transmitted or persisted, and is removed when the panel closes or resets.

Safety behavior:

- Emergency/red-flag language is checked before commercial intent. The flow locks, removes recommendation controls, disables text input, and directs the visitor to local emergency/professional help.
- Contact-like input is not repeated in the transcript and receives a non-collection boundary.
- Medication, dose, diagnosis, treatment, contraindication, and eligibility questions are not answered or echoed; the agent redirects the visitor to a licensed professional and remains limited to catalog navigation.
- Recommendations are limited to one to three predefined local catalog items, with commercial reasons and a local “Ver opción recomendada” action.

No API, fetch/XHR, cookie, analytics event, localStorage, sessionStorage, database, secret, token, account, form submission, or external runtime dependency is used.

## Fictional team profiles

Amara Reed, Mateo Silva, and Lin Park are fictional editorial profiles. Every card visibly includes “perfil ficticio de demostración.” The cards deliberately omit degrees, license numbers, institutions, certifications, awards, provider identifiers, regulatory claims, years of practice, and real availability.

Generated portraits depict fictional adults and are not intended to impersonate real people.

## Illustrative reviews

The review section states once that the reviews are illustrative and are not real patient testimonials. Every quote carries the compact label “Reseña demo.” Names are shortened fictional attributions, and quotes avoid medical outcomes, exact weight changes, cures, timelines, or guarantees.

## Delivery, portal, and support presentation

Portal, packaging, delivery, and support components are visual concepts only. Copy avoids promising a real portal, shipment, support SLA, account, pharmacy fulfillment, privacy certification, or clinical operation.

## Generated visual assets

All production photography is self-hosted WebP documented in `assets/image-manifest.json`. Prompts and visual review exclude competitor trade dress, text/logos, medication, pills, needles, treatment procedures, before/after transformations, fake seals, certificates, and real-person impersonation.

The five flagship commerce assets were generated with the configured OpenAI GPT Image 2 High backend (`openai-codex` / `gpt-image-2-high`), visually reviewed, optimized, and self-hosted. Earlier FAL/FLUX commerce renders are not used in production.

## Requirements before converting this demo into a real service

A real launch would require a separate licensed operating entity and professional legal, regulatory, clinical, privacy, security, accessibility, advertising, pharmacy/fulfillment, jurisdiction, and vendor review. None of those capabilities or approvals should be inferred from this demonstration.
