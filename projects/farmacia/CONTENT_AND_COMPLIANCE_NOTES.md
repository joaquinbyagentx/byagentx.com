# Mereon demo — content and compliance notes

Last updated: 2026-07-22

## Identity and operating boundary

Mereon remains a fictional ByAgentX storefront demonstration. The above-the-fold banner states that it is not a pharmacy, active store, medical provider, prescriber, or payment processor. Prices, programs, packaging, support, profiles, and reviews are illustrative; no purchase, shipment, account, clinical intake, or payment exists.

## Catalog decisions

The catalog uses one JavaScript dataset as the source for all card, navigator, cart, and WhatsApp line-item names and prices. Its twelve fictional programs are organized around:

- three prominent weight and metabolic-wellbeing offers;
- two anti-aging/longevity education and routine concepts;
- two integral-wellness programs;
- two sleep/stress routine concepts;
- two recovery/movement programs; and
- one hair/skin self-care program.

Copy is limited to content, planning, habits, routines, and commercial navigation. It does not claim diagnosis, eligibility, treatment, medication, dosing, clinician/pharmacy relationships, certification, availability, guaranteed outcomes, or guaranteed weight loss. Product-specific notes reinforce the boundary where a category could otherwise imply a medical result.

## Cart and local data

The cart supports add, quantity change, removal, empty state, counts, totals, keyboard close/focus handling, and local persistence. `localStorage` stores only canonical product IDs and integer quantities under `mereon-demo-cart-v1`; it does not request or store identity, contact, payment, diagnosis, medication, or other health information. Dynamic catalog and cart text is created with DOM APIs and `textContent`, not untrusted HTML.

## WhatsApp configuration

The only destination setting is the empty `data-whatsapp-number` attribute on `<body>` in `index.html`, immediately preceded by a developer comment. Configure it only with an approved E.164 destination in digits-only form (country code plus number, without `+`, spaces, or punctuation).

Until that attribute contains 8–15 valid digits and does not begin with zero, checkout remains an honest “WhatsApp próximamente / número pendiente de configurar” state and opens nothing. With a valid destination, the page prepares an encoded `wa.me` message containing line items, quantities, unit prices, subtotal/total, and an explicit demo/no-payment note. It never collects payment or opens a shipping or health form.

## Navigator, profiles, and reviews

The local catalog navigator now recommends only the revised six commercial categories and remains non-prescriptive. Its privacy rejection, medical boundary, emergency stop, reset, focus management, and no-network behavior remain in place. Fictional profile cards and illustrative reviews retain their local honesty labels.

The 2026-07-22 image refresh uses five previously approved OpenAI Codex `gpt-image-2-high` masters for the hero, community/reviews scene, and three profile portraits. They remain fictional editorial imagery: the portraits do not represent real clinicians or credentials, and the community scene does not represent real reviewers, testimonials, clinical outcomes, or care relationships. Integration only converted the approved PNG masters to self-hosted RGB WebP at native dimensions (Pillow quality 90/method 6); it did not generate, upscale, crop, or stretch imagery.

## Before any real launch

A real service would require a separate approved operating entity, real WhatsApp destination ownership, and professional legal, regulatory, clinical, privacy, security, accessibility, advertising, fulfillment, and jurisdiction review. None of those capabilities or approvals should be inferred from this demo.
