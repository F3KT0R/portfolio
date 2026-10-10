import { z } from 'zod'
import type { GameEventName } from '@/lib/game-events'
import { routes } from '@/lib/routes'
import { achievementSchema, type Achievement, type Condition } from './schema'
import { quests } from './quests'

// The visitor's achievements. Conditions are data; src/game/achievements.ts
// evaluates them. Event names come from the typed bus in lib/game-events.

// Event conditions must name an event the bus can actually emit.
type ConditionInput =
  Exclude<Condition, { kind: 'event' }> | { kind: 'event'; event: GameEventName }
type AchievementInput = Omit<z.input<typeof achievementSchema>, 'condition'> & {
  condition: ConditionInput
}

const achievementData = [
  {
    id: 'press-start',
    title: 'Press Start',
    description: 'Opened the character sheet.',
    icon: 'shield',
    xp: 5,
    condition: { kind: 'visit', path: routes.sheet },
  },
  {
    id: 'lore-keeper',
    title: 'Lore Keeper',
    description: 'Opened three quests from the log.',
    icon: 'scroll',
    xp: 20,
    condition: { kind: 'visit-prefix', prefix: `${routes.quests}/`, count: 3 },
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Opened every quest in the log.',
    icon: 'chest',
    xp: 40,
    condition: { kind: 'visit-prefix', prefix: `${routes.quests}/`, count: quests.length },
  },
  {
    id: 'scholar',
    title: 'Scholar',
    description: 'Studied the skill tree.',
    icon: 'gem',
    xp: 10,
    condition: { kind: 'visit', path: routes.skills },
  },
  {
    id: 'historian',
    title: 'Historian',
    description: 'Read the chronicle.',
    icon: 'map',
    xp: 10,
    condition: { kind: 'visit', path: routes.chronicle },
  },
  {
    id: 'cartographer',
    title: 'Cartographer',
    description: 'Visited every region on the map.',
    icon: 'flag',
    xp: 30,
    condition: {
      kind: 'visit-all',
      paths: [
        routes.sheet,
        routes.quests,
        routes.skills,
        routes.chronicle,
        routes.codex,
        routes.recruit,
      ],
    },
  },
  {
    id: 'speedrunner',
    title: 'Speedrunner',
    description: 'Skipped straight to the TL;DR.',
    icon: 'bolt',
    xp: 10,
    condition: { kind: 'visit', path: routes.tldr },
  },
  {
    id: 'spellcaster',
    title: 'Spellcaster',
    description: 'Opened the command palette.',
    icon: 'quill',
    xp: 15,
    condition: { kind: 'event', event: 'palette:open' },
  },
  {
    id: 'shapeshifter',
    title: 'Shapeshifter',
    description: 'Switched between dungeon and parchment.',
    icon: 'potion',
    xp: 10,
    condition: { kind: 'event', event: 'theme:toggle' },
  },
  {
    id: 'loot',
    title: 'Loot Acquired',
    description: 'Downloaded the CV.',
    icon: 'key',
    xp: 20,
    condition: { kind: 'event', event: 'cv:download' },
  },
  {
    id: 'party-formed',
    title: 'Party Formed',
    description: 'Sent Tibor a message.',
    icon: 'heart',
    xp: 50,
    condition: { kind: 'event', event: 'party:recruited' },
  },
  {
    id: 'fresh-roll',
    title: 'Fresh Roll',
    description: 'Rolled a new companion.',
    icon: 'gem',
    xp: 5,
    condition: { kind: 'event', event: 'companion:reroll' },
  },
  {
    id: 'lone-wolf',
    title: 'Lone Wolf',
    description: 'Sent your companion home to rest.',
    hidden: true,
    icon: 'flag',
    xp: 5,
    condition: { kind: 'event', event: 'companion:toggle' },
  },
  {
    id: 'old-school',
    title: 'Old School',
    description: '↑ ↑ ↓ ↓ ← → ← → B A',
    hidden: true,
    icon: 'star',
    xp: 30,
    condition: { kind: 'event', event: 'secret:konami' },
  },
  {
    id: 'source-diver',
    title: 'Source Diver',
    description: 'Answered the call in the developer console.',
    hidden: true,
    icon: 'eye',
    xp: 30,
    condition: { kind: 'event', event: 'secret:console' },
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Visited between midnight and 5 a.m.',
    hidden: true,
    icon: 'skull',
    xp: 15,
    condition: { kind: 'event', event: 'secret:night' },
  },
] as const satisfies readonly AchievementInput[]

export const achievements: Achievement[] = z.array(achievementSchema).parse(achievementData)
