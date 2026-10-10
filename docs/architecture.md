# Architecture

## Layers

```
app ──▶ features ──▶ ui ──────────────┐
 │         │  └────▶ game ──▶ content ──▶ lib
 └─────────┴─────────────────────────────▶ lib
```

| Layer      | May import                               | Must not                                        |
| ---------- | ---------------------------------------- | ----------------------------------------------- |
| `lib`      | nothing in `src/`                        | import React or Next.js at runtime              |
| `content`  | `lib`                                    | import React, Next.js, `ui`, `game`, `features` |
| `game`     | `lib`, `content`                         | import React, Next.js or touch the DOM          |
| `ui`       | `lib`                                    | know about quests, skills or any domain concept |
| `features` | `lib`, `content`, `game`, `ui`, features | reach into another feature past its `index.ts`  |
| `app`      | everything above, plus `styles`          | contain client components                       |

## Guards

Rules a reviewer would otherwise have to remember are checked by tools, in `npm run lint` and `npm test`:

| Guard                            | Catches                                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/check-architecture.mjs` | Layer violations, framework imports in pure layers, deep feature imports, client-boundary naming (`'use client'` ⇔ `*.client.tsx`), features without an index |
| `scripts/check-color-tokens.mjs` | Raw colours outside the primitive tier, primitives used in components, `tokens.css` and `palette.ts` drifting apart                                           |
| Stylelint                        | `!important`, IDs, deep selectors, hard-coded transition durations, hex colours                                                                               |
| ESLint                           | Next.js core web vitals, typescript-eslint, import cycles, default exports outside `app/`, type-only imports                                                  |
| Zod schemas in `content/`        | Malformed content — fails `next build` with the entry's path                                                                                                  |
| `src/content/content.test.ts`    | Cross-references: unknown skills, sigils, events; unproven skills; chronology                                                                                 |
| `typedRoutes`                    | Links to routes that do not exist                                                                                                                             |
| Playwright + axe                 | Accessibility in both themes, pages that need JavaScript to show content, overflow                                                                            |

## Rendering

Every page is a server component and prerendered at build time; the sheet revalidates daily so the XP bar moves. Client code is limited to _islands_ named `*.client.tsx`: the navigation hotbar, the command palette, the theme toggle, the progress tracker and codex, the contact form, the CV link and the easter eggs. With JavaScript off, every page still shows its full content; item cards still open (they use the Popover API, not JavaScript).

## The game layer

The game observes; it never gates content.

```
feature (palette, theme, CV link, form, easter eggs)
   │  emitGameEvent('palette:open')            ← lib/game-events.ts, typed names
   ▼
window CustomEvent ──▶ ProgressTracker (features/progress)
                         │  + a 'visit' action on every route change
                         ▼
                   reduceProgress(state, action, achievements)   ← game/, pure, unit-tested
                         │
                         ├─▶ localStorage (parsed with Zod on load; tampered data resets)
                         └─▶ toast queue ──▶ AchievementToasts (aria-live)
```

Because features announce events instead of calling the progress feature, removing `features/progress` leaves every other feature working.

Tibor's own level is not part of this loop: `game/level.ts` derives it from `character.careerStart` — one level per year of professional work, XP filling towards the next anniversary.

## Styling

CSS Modules with three token tiers in `src/styles/tokens.css`: primitives (raw colours), semantic tokens (surface, text, line, accent, rarity — redefined per theme) and component styles that only read semantic tokens. Two themes: _dungeon_ (dark, default) and _parchment_ (light), chosen before first paint by an inline script. Motion durations are tokens that collapse to zero under `prefers-reduced-motion`.
