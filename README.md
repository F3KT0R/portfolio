# Portfolio 3.0 — the character sheet

Tibor Bálint's portfolio, built as an RPG character sheet: a profile with attributes and gear, a quest log of case studies, an evidence-linked skill tree, a career chronicle and achievements for the visitor. Recruiters can skip all of it at [`/tldr`](src/app/tldr/page.tsx).

Live: <https://tibor-balint.netlify.app>

## Run it

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:3000
```

| Script             | What it does                                                                   |
| ------------------ | ------------------------------------------------------------------------------ |
| `npm run check`    | Everything fast: format, lint, typecheck, unit tests. Run before every commit. |
| `npm run lint`     | ESLint, Stylelint, the architecture guard and the colour-token guard           |
| `npm test`         | Vitest: game engine, content integrity, palette search, form contract          |
| `npm run test:e2e` | Playwright: every route on desktop and mobile, axe in both themes, no-JS, game |
| `npm run build`    | Production build; invalid content fails here                                   |
| `npm run format`   | Prettier                                                                       |
| `npm run cv`       | Builds, then prints `/tldr` to the PDF CV (max. 2 pages)                       |

CI ([quality.yml](.github/workflows/quality.yml)) runs all of them on every push and pull request.

## How it is built

Five layers, one direction of dependency, enforced by [`scripts/check-architecture.mjs`](scripts/check-architecture.mjs):

```
src/
  lib/        Constants, routes, the typed event bus, storage, the palette. Imports nothing.
  content/    All data (character, skills, quests, chronicle, achievements), validated by Zod.
  game/       Pure engine: level/XP maths, the achievement reducer. No React, no DOM.
  ui/         Design-system primitives (Frame, Meter, ItemCard, PixelIcon…). No domain.
  features/   Vertical slices with a public index.ts: character, quests, skills, progress…
  app/        Thin Next.js routes that compose features. No client components.
```

Read [docs/architecture.md](docs/architecture.md) for the rules, the guards and the game layer's data flow, and [docs/adr](docs/adr) for the decisions behind them.

## Common changes

- **Add a quest:** append to [`src/content/quests.ts`](src/content/quests.ts). The page, the card, the sitemap, the Open Graph image, the command palette entry and the "Completionist" count follow automatically. `npm test` fails if it names an unknown skill or sigil.
- **Add a skill:** add it to [`src/content/skills.ts`](src/content/skills.ts) and reference it from a quest or chronicle entry — an unproven skill fails the tests.
- **Add an achievement:** add it to [`src/content/achievements.ts`](src/content/achievements.ts). New events go into `gameEventNames` in [`src/lib/game-events.ts`](src/lib/game-events.ts); the tests require every event to unlock something.
- **Add a testimonial:** add the person's exact words to [`src/content/testimonials.ts`](src/content/testimonials.ts) with the date they approved it. It appears as NPC dialogue on the sheet and on its quest; nothing renders while the list is empty.
- **Add a boss fight:** give a quest a `boss` (symptom, hunt, fix, lesson) — the hardest bug, told as an encounter.
- **Add screenshots:** put `.webp` files in `public/media/quests/<quest>/` and list them in the quest's `gallery` (or `compare` for a before/after pair) with their real width and height; a test checks both.
- **Classified work:** set `classified: true` and write `[[redacted:N]]` where a detail is under NDA. Nothing goes under the bar, so nothing can leak.
- **Regenerate the CV:** `npm run cv` prints `/tldr` to `public/cv/Tibor_Balint_CV.pdf`. A test fails when content changed but the CV did not.
- **Change a colour:** primitives live in [`tokens.css`](src/styles/tokens.css) and [`palette.ts`](src/lib/palette.ts) (kept equal by `check:tokens`); components use semantic tokens only.
- **Add a feature:** create `src/features/<name>/index.ts`, export its public components, and import it only through that index.

## Deploy

Netlify builds `main` with the Next.js runtime ([netlify.toml](netlify.toml)). The contact form uses Netlify Forms through the static stub [`public/__forms.html`](public/__forms.html); its fields are checked against the form schema in a unit test. Set `NEXT_PUBLIC_SITE_URL` if the site moves to its own domain.
