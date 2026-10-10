import type { Route } from 'next'
import { gloss } from './glossary'
import type { IconName } from './icon-names'

// Every internal address is built here, so a renamed route is a one-line change
// and typedRoutes checks the result at compile time.
export const routes = {
  sheet: '/',
  quests: '/quests',
  quest: (slug: string) => `/quests/${slug}` as Route,
  skills: '/skills',
  skill: (id: string) => `/skills#${id}` as Route,
  chronicle: '/chronicle',
  codex: '/codex',
  recruit: '/recruit',
  tldr: '/tldr',
} as const satisfies Record<string, Route | ((arg: string) => Route)>

export type StaticRouteKey = {
  [K in keyof typeof routes]: (typeof routes)[K] extends Route ? K : never
}[keyof typeof routes]

/** The primary navigation, in hotbar order. Keys 1–6 jump to these. */
export const primaryNav = [
  { key: 'sheet', label: 'Sheet', plain: gloss.sheet, href: routes.sheet, icon: 'shield' },
  { key: 'quests', label: 'Quests', plain: gloss.quests, href: routes.quests, icon: 'scroll' },
  { key: 'skills', label: 'Skills', plain: 'skills', href: routes.skills, icon: 'gem' },
  {
    key: 'chronicle',
    label: 'Chronicle',
    plain: gloss.chronicle,
    href: routes.chronicle,
    icon: 'map',
  },
  { key: 'codex', label: 'Codex', plain: gloss.codex, href: routes.codex, icon: 'star' },
  { key: 'recruit', label: 'Recruit', plain: gloss.recruit, href: routes.recruit, icon: 'flag' },
] as const satisfies readonly {
  key: StaticRouteKey
  label: string
  /** The page in plain words, for tooltips and search. */
  plain: string
  href: Route
  icon: IconName
}[]

/** True when `pathname` is `href` or one of its sub-pages (the sheet only matches itself). */
export function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}
