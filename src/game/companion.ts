import { z } from 'zod'
import type { PaletteKey } from '@/lib/palette'

// The visitor's companion: a small pixel adventurer rolled from a seed. The
// same seed always draws the same character, so only the seed is stored.
// Everything here is data and pure functions; the companion feature draws the
// sprite and walks it around the page.

export const SPRITE_WIDTH = 12
export const SPRITE_HEIGHT = 16

/**
 * One letter per tone. `.` is transparent.
 *   o outline · f face shadow · e eyes · h headgear · b body · t trim
 *   l legs · p prop · g glow
 */
export const tones = ['o', 'f', 'e', 'h', 'b', 't', 'l', 'p', 'g'] as const
export type Tone = (typeof tones)[number]

/** Rows 0–6. Faces stay in shadow under the gear; only the eyes show. */
const heads = {
  hood: [
    '............',
    '....oooo....',
    '...ohhhho...',
    '..ohhhhhho..',
    '..ohffffho..',
    '..oheffeho..',
    '...ohhhho...',
  ],
  helmet: [
    '.....tt.....',
    '....otto....',
    '...ohhhho...',
    '..ohhhhhho..',
    '..otttttto..',
    '..ofeffefo..',
    '...ohhhho...',
  ],
  hat: [
    '......oo....',
    '.....ohho...',
    '....ohhho...',
    '...ohhhhho..',
    '.oottttttoo.',
    '..ofeffefo..',
    '...offffo...',
  ],
  cap: [
    '.........t..',
    '....oooot...',
    '...ohhhhto..',
    '..ohhhhhho..',
    '..otttttto..',
    '..ofeffefo..',
    '...offffo...',
  ],
} as const satisfies Record<string, readonly string[]>

/** Rows 7–12. */
const bodies = {
  tunic: [
    '..obbbbbbo..',
    '.obbbttbbbo.',
    '.obbbttbbbo.',
    '.obttttttbo.',
    '..obbbbbbo..',
    '..obbbbbbo..',
  ],
  robe: [
    '..obbbbbbo..',
    '.obbbttbbbo.',
    '.obbbttbbbo.',
    '.obbbttbbbo.',
    '.obbbttbbbo.',
    '.obbbbbbbbo.',
  ],
  armor: [
    '.otbbbbbbto.',
    '.otbbttbbto.',
    '..obbttbbo..',
    '..otttttto..',
    '..obbbbbbo..',
    '..obbbbbbo..',
  ],
} as const satisfies Record<string, readonly string[]>

/** Rows 13–15: standing, then mid-stride. Walking alternates the two. */
const legs = [
  ['...ol..lo...', '...ol..lo...', '..ooo..ooo..'],
  ['...ol..lo...', '..ol....lo..', '.ooo....ooo.'],
] as const

/** Props drawn over the figure; `.` leaves the pixel below untouched. */
type Overlay = { top: number; rows: readonly string[] }

const props = {
  sword: {
    top: 2,
    rows: [
      '..........g.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '.........ttt',
      '..........o.',
    ],
  },
  shield: {
    top: 8,
    rows: ['ttt.........', 'tgt.........', 'tgt.........', '.t..........'],
  },
  staff: {
    top: 1,
    rows: [
      '..........g.',
      '.........ggg',
      '..........t.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
      '..........p.',
    ],
  },
  bow: {
    top: 3,
    rows: [
      '.p..........',
      'p...........',
      'p...........',
      'p...........',
      'p...........',
      'p...........',
      'p...........',
      '.p..........',
    ],
  },
  lantern: {
    top: 9,
    rows: ['..........o.', '.........ttt', '.........tgt', '.........ttt'],
  },
} as const satisfies Record<string, Overlay>

type HeadName = keyof typeof heads
type BodyName = keyof typeof bodies
type PropName = keyof typeof props

type ClassDef = {
  title: string
  head: HeadName
  body: BodyName
  /** Each roll picks one loadout. */
  loadouts: readonly (readonly PropName[])[]
  gear: readonly PaletteKey[]
  trim: readonly PaletteKey[]
  prop: PaletteKey
  glow: readonly PaletteKey[]
}

export const companionClasses = {
  knight: {
    title: 'Knight',
    head: 'helmet',
    body: 'armor',
    loadouts: [['sword'], ['sword', 'shield']],
    gear: ['ash-700', 'ink-600', 'bone-500'],
    trim: ['gold-400', 'ember-400', 'tide-400'],
    prop: 'ash-400',
    glow: ['gold-300', 'bone-50'],
  },
  mage: {
    title: 'Mage',
    head: 'hat',
    body: 'robe',
    loadouts: [['staff']],
    gear: ['arcane-700', 'tide-700', 'moss-700', 'ember-700'],
    trim: ['gold-300', 'bone-200', 'arcane-400'],
    prop: 'bone-500',
    glow: ['arcane-400', 'tide-400', 'flame-400'],
  },
  rogue: {
    title: 'Rogue',
    head: 'hood',
    body: 'tunic',
    loadouts: [['lantern']],
    gear: ['ink-600', 'moss-700', 'bone-700', 'arcane-700'],
    trim: ['ember-400', 'gold-400', 'ash-400'],
    prop: 'ash-700',
    glow: ['gold-300', 'flame-400'],
  },
  ranger: {
    title: 'Ranger',
    head: 'cap',
    body: 'tunic',
    loadouts: [['bow']],
    gear: ['moss-700', 'bone-500', 'flame-700'],
    trim: ['moss-400', 'flame-400', 'bone-300'],
    prop: 'bone-500',
    glow: ['moss-400', 'gold-300'],
  },
} as const satisfies Record<string, ClassDef>

export type CompanionClass = keyof typeof companionClasses
const classIds = Object.keys(companionClasses) as CompanionClass[]

export const companionNames = [
  'Pip',
  'Bramble',
  'Wren',
  'Juniper',
  'Odo',
  'Fennick',
  'Mira',
  'Tamsin',
  'Rook',
  'Bix',
  'Nim',
  'Quill',
  'Sable',
  'Tilly',
  'Pike',
  'Rune',
  'Sprocket',
  'Lark',
  'Hollis',
  'Kip',
  'Dagny',
  'Morrow',
  'Elm',
  'Cosmo',
] as const

const eyes: readonly PaletteKey[] = ['gold-300', 'tide-400', 'moss-400', 'arcane-400', 'bone-50']
const legTones: readonly PaletteKey[] = ['ink-700', 'bone-700', 'ink-600']

export type Companion = {
  seed: number
  name: string
  classId: CompanionClass
  title: string
  /** Two frames of SPRITE_HEIGHT rows: standing and mid-stride. */
  frames: readonly [readonly string[], readonly string[]]
  colors: Record<Tone, PaletteKey>
}

/** mulberry32: a tiny, well-mixed PRNG. Deterministic for a given seed. */
export function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: () => number, list: readonly T[]): T {
  return list[Math.floor(random() * list.length)] as T
}

function overlay(rows: string[], { top, rows: layer }: Overlay) {
  layer.forEach((line, i) => {
    const y = top + i
    const base = rows[y]
    if (base === undefined) return
    rows[y] = [...base].map((pixel, x) => (line[x] && line[x] !== '.' ? line[x] : pixel)).join('')
  })
}

export function rollCompanion(seed: number): Companion {
  const random = seededRandom(seed)
  const classId = pick(random, classIds)
  const def: ClassDef = companionClasses[classId]
  const loadout = pick(random, def.loadouts)

  const frames = legs.map((legRows) => {
    const rows = [...heads[def.head], ...bodies[def.body], ...legRows]
    for (const prop of loadout) overlay(rows, props[prop])
    return rows
  }) as unknown as Companion['frames']

  return {
    seed,
    name: pick(random, companionNames),
    classId,
    title: def.title,
    frames,
    colors: {
      o: 'ink-950',
      f: 'ink-900',
      e: pick(random, eyes),
      h: pick(random, def.gear),
      b: pick(random, def.gear),
      t: pick(random, def.trim),
      l: pick(random, legTones),
      p: def.prop,
      g: pick(random, def.glow),
    },
  }
}

/** A fresh seed from any [0, 1) source; the store passes crypto-backed randomness. */
export function newCompanionSeed(random: () => number) {
  return Math.floor(random() * 2 ** 31)
}

// ── What the visitor's browser remembers ──

export const companionStateSchema = z.object({
  version: z.literal(1),
  seed: z.int().min(0),
  hidden: z.boolean(),
})
export type CompanionState = z.infer<typeof companionStateSchema>

/** Stored companion state; anything unreadable means "no companion yet". */
export function parseCompanionState(raw: string | null): CompanionState | null {
  if (!raw) return null
  try {
    const parsed = companionStateSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

// ── What the companion says ──

/**
 * Lines by waypoint (the `data-waypoint` of the panel it stands on). `{name}`
 * is replaced with the companion's name. Panels without their own lines use
 * `panel`, and only now and then, so it never chatters.
 */
export const companionLines = {
  greeting: ["Hi, I'm {name}. Lead the way!", '{name}, reporting for duty.'],
  boss: ["A boss fight! I'll stay behind you.", 'That was one big bug.'],
  classified: ["Classified? I didn't see a thing.", 'Even I am not cleared for this.'],
  achievements: ["Look at all we've done!", 'Shiny badges. I want one.'],
  recruit: ["Send a raven, I'll guard the door.", 'Recruiting? Count me in.'],
  'looking-for': ['Remote-first. Same as me.', 'Good to know the terms.'],
  skills: ['So many branches to climb.', 'I only know one skill: walking.'],
  quest: ['Ooh, a quest.', 'This one looks fun.'],
  panel: ['Taking notes…', 'Hmm, interesting.', 'Onward!', "I'm right behind you."],
} as const satisfies Record<string, readonly string[]>

export type LineTopic = keyof typeof companionLines

/** How likely the companion speaks on arriving at a plain panel. */
export const PANEL_CHATTER = 0.2

export function companionLine(topic: string, name: string, random: () => number) {
  const known = topic in companionLines ? (topic as LineTopic) : 'panel'
  if (known === 'panel' && random() > PANEL_CHATTER) return null
  return pick(random, companionLines[known]).replace('{name}', name)
}
