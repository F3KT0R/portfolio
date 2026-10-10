import { quests } from '../../src/content'
import { primaryNav, routes } from '../../src/lib/routes'

/** Every public page, with the heading it must render. Shared by all specs. */
export const pages = [
  ...primaryNav.map((n) => ({ path: n.href as string, label: n.label })),
  { path: routes.tldr as string, label: 'TL;DR' },
  { path: routes.playstyle as string, label: 'Playstyle' },
  ...quests.map((q) => ({ path: routes.quest(q.slug) as string, label: q.title })),
]
