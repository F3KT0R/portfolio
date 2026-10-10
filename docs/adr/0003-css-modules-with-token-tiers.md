# 3. CSS Modules with token tiers instead of Tailwind

Date: 2026-10-10 · Status: accepted

## Context

Tailwind is the default in Tibor's recent projects, and it is good at speed. This site's value is a distinctive visual system — framed windows, pixel rivets, rarity colours, two themes — that should read as designed rather than assembled from utility defaults.

## Decision

CSS Modules per component, plain modern CSS (`:has()`, `color-mix()`, anchor positioning where supported) and three token tiers: primitives → semantic → component. Themes redefine the semantic tier only. Guards: Stylelint (no `!important`, no IDs, specificity cap, tokenised motion) and `scripts/check-color-tokens.mjs` (no raw colours or primitives in components, palette in sync with TypeScript).

## Consequences

- A theme or a palette change is a token edit.
- Each component's styles sit next to it and are owned by it.
- More CSS to write than with utilities; acceptable at this size.
