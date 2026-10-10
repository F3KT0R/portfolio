import type { QuestKind, QuestStatus } from '@/content'

export const kindLabel: Record<QuestKind, string> = {
  main: 'Main quest',
  side: 'Side quest',
  archive: 'Archived quest',
}

export const kindHeading: Record<QuestKind, { title: string; lead: string }> = {
  main: {
    title: 'Main quests',
    lead: 'Client and business work: real users, real money, real deadlines.',
  },
  side: {
    title: 'Side quests',
    lead: 'Tools and experiments built for myself — held to the same standard.',
  },
  archive: { title: 'Archive', lead: 'Where it started.' },
}

export const statusLabel: Record<QuestStatus, string> = {
  active: 'In progress',
  launching: 'Awaiting launch',
  live: 'Live & maintained',
  completed: 'Completed',
}

export const difficultyLabel = ['', 'Trivial', 'Easy', 'Moderate', 'Hard', 'Legendary'] as const
