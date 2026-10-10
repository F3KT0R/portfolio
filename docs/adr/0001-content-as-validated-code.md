# 1. Content as validated TypeScript, not a CMS or the GitHub API

Date: 2026-10-10 · Status: accepted

## Context

v2 built its project list from the GitHub API at build time. Rate limits emptied the projects page and the sitemap, private client work could not appear at all, and the ranking favoured recently pushed repositories over the best work. Its MDX case studies were never rendered.

## Decision

All content lives in `src/content/*.ts` as typed data, parsed by Zod schemas when the module loads. Cross-references (quest → skill, achievement → event) are typed with literal unions where possible and checked by unit tests where not. Pages read content only through `src/content/index.ts`.

## Consequences

- A typo in content fails the build, not the page.
- Private and client work can be described without linking code.
- Moving to MDX or a CMS later changes the files behind `content/index.ts`, not the components.
- Editing content needs a commit; acceptable for a single-author site.
