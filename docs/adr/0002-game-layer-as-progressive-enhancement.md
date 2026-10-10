# 2. The game layer is a progressive enhancement

Date: 2026-10-10 · Status: accepted

## Context

The site is themed as an RPG to be memorable, but its main readers — recruiters and potential collaborators — often have less than a minute. A game that gates content would cost exactly those readers.

## Decision

- Every page is server-rendered and complete without JavaScript. `/tldr` presents the same content as a plain résumé.
- Game mechanics (achievements, the command palette, number-key travel, easter eggs) only observe and decorate. Features emit typed events on a window bus; the progress feature listens.
- Item cards use the native Popover API so they work without JavaScript.
- Visitor progress lives only in `localStorage`, is validated on load and can be reset from the codex. Nothing is sent anywhere.

## Consequences

- The e2e suite renders every route with JavaScript disabled and fails if content is missing.
- The game can be removed feature by feature without breaking pages.
- Achievements are per browser; there is no leaderboard, by design.
