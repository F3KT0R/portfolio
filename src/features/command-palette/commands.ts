import type { Route } from 'next'
import { quests } from '@/content'
import { primaryNav, routes } from '@/lib/routes'
import { site } from '@/lib/site'

// The palette's command list is data built from content and routes; running a
// command is the component's job. Pure, so the matching is unit-tested.

export type CommandAction =
  | { kind: 'navigate'; href: Route }
  | { kind: 'external'; href: string }
  | { kind: 'download'; href: string }
  | { kind: 'copy'; text: string; done: string }
  | { kind: 'theme' }

export type Command = {
  id: string
  group: 'Go to' | 'Quests' | 'Actions'
  label: string
  /** Extra words that should find this command. */
  keywords?: string
  action: CommandAction
}

export function buildCommands(): Command[] {
  return [
    ...primaryNav.map((n) => ({
      id: `nav-${n.key}`,
      group: 'Go to' as const,
      label: n.label,
      keywords: n.plain,
      action: { kind: 'navigate' as const, href: n.href },
    })),
    {
      id: 'nav-playstyle',
      group: 'Go to',
      label: 'Playstyle — how I work',
      keywords: 'principles process review testing ai working style',
      action: { kind: 'navigate', href: routes.playstyle },
    },
    {
      id: 'nav-tldr',
      group: 'Go to',
      label: 'TL;DR — the one-page résumé',
      keywords: 'resume cv summary recruiter skip',
      action: { kind: 'navigate', href: routes.tldr },
    },
    ...quests.map((q) => ({
      id: `quest-${q.slug}`,
      group: 'Quests' as const,
      label: q.title,
      keywords: `${q.epithet} ${q.stack.join(' ')}`,
      action: { kind: 'navigate' as const, href: routes.quest(q.slug) },
    })),
    {
      id: 'copy-email',
      group: 'Actions',
      label: 'Copy e-mail address',
      keywords: 'contact mail hire',
      action: { kind: 'copy', text: site.email, done: 'E-mail copied' },
    },
    {
      id: 'download-cv',
      group: 'Actions',
      label: 'Download CV (PDF)',
      keywords: 'resume curriculum vitae',
      action: { kind: 'download', href: site.cvPath },
    },
    {
      id: 'toggle-theme',
      group: 'Actions',
      label: 'Switch theme: dungeon ↔ parchment',
      keywords: 'dark light mode colour',
      action: { kind: 'theme' },
    },
    {
      id: 'open-github',
      group: 'Actions',
      label: 'Open GitHub',
      keywords: 'code repositories',
      action: { kind: 'external', href: site.links.github },
    },
    {
      id: 'open-linkedin',
      group: 'Actions',
      label: 'Open LinkedIn',
      action: { kind: 'external', href: site.links.linkedin },
    },
  ]
}

/**
 * Case-insensitive match: every word of the query must appear, in order, as a
 * subsequence of the label or keywords. Label matches rank first, then the
 * original order is kept.
 */
export function filterCommands(commands: readonly Command[], query: string): Command[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return [...commands]

  const matches = (text: string) => words.every((w) => isSubsequence(w, text))
  const scored = commands.flatMap((command, index) => {
    const label = command.label.toLowerCase()
    if (matches(label)) return [{ command, index, rank: 0 }]
    if (matches(`${label} ${command.keywords ?? ''}`.toLowerCase()))
      return [{ command, index, rank: 1 }]
    return []
  })
  return scored.sort((a, b) => a.rank - b.rank || a.index - b.index).map((s) => s.command)
}

function isSubsequence(needle: string, haystack: string) {
  let i = 0
  for (const char of haystack) if (char === needle[i]) i++
  return i === needle.length
}
