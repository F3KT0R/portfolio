import { z } from 'zod'
import { iconNames } from '@/lib/icon-names'
import { rarities, type Rarity } from '@/lib/rarity'

// Content is data, validated when the module loads: a malformed entry fails
// `next build` and the unit tests with the entry's path in the message.

const isoMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected YYYY-MM')
const isoDay = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'expected YYYY-MM-DD')
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'expected kebab-case')
const sentence = z.string().trim().min(3)
const url = z.url({ protocol: /^https$/ })

export const raritySchema = z.enum(rarities)
export { rarities, type Rarity }

/** What each rarity means when it describes a skill. */
export const rarityMeaning: Record<Rarity, string> = {
  common: 'Familiar',
  uncommon: 'Working',
  rare: 'Proficient',
  epic: 'Expert',
  legendary: 'Signature',
}

// ── Skills ────────────────────────────────────────────────────────────────

export const skillBranches = ['frontend', 'backend', 'quality', 'delivery', 'craft'] as const
export const skillBranchSchema = z.enum(skillBranches)
export type SkillBranch = z.infer<typeof skillBranchSchema>

export const skillSchema = z.object({
  name: sentence,
  branch: skillBranchSchema,
  rarity: raritySchema,
  since: z.number().int().min(2015).max(2100),
  /** One line of what it covers, shown on the item card. */
  covers: sentence,
  /** Optional prerequisite in the tree (draws the connector). */
  requires: slug.optional(),
})
export type Skill = z.infer<typeof skillSchema>

// ── Character ─────────────────────────────────────────────────────────────

export const attributeSchema = z.object({
  key: z.string().regex(/^[A-Z]{3}$/, 'three capital letters, like STR'),
  name: sentence,
  score: z.number().int().min(1).max(20),
  evidence: z.array(sentence).min(1).max(4),
})
export type Attribute = z.infer<typeof attributeSchema>

export const loadoutSlots = [
  'main-hand',
  'off-hand',
  'helm',
  'armor',
  'boots',
  'ring',
  'amulet',
  'trinket',
] as const

export const characterSchema = z.object({
  name: sentence,
  handle: z.string().min(2),
  className: sentence,
  specialization: sentence,
  /** First day of professional software work; the level is counted from it. */
  careerStart: isoDay,
  origin: sentence,
  timezone: z.string().min(2),
  status: z.object({ available: z.boolean(), label: sentence }),
  /** What a recruiter screens on first, each answer in one line. */
  lookingFor: z.object({
    engagement: sentence,
    workplace: sentence,
    relocation: sentence,
    start: sentence,
  }),
  pitch: z.array(sentence).min(1).max(3),
  attributes: z.array(attributeSchema).length(6),
  loadout: z.array(
    z.object({
      slot: z.enum(loadoutSlots),
      skill: slug,
      flavor: sentence,
    }),
  ),
  languages: z.array(z.object({ name: sentence, level: sentence })).min(1),
  traits: z.array(z.object({ name: sentence, effect: sentence })).min(1),
})
export type Character = z.infer<typeof characterSchema>

// ── Quests ────────────────────────────────────────────────────────────────

/** A screenshot in public/media/quests/<quest>/. Dimensions are checked against the file. */
export const shotSchema = z.object({
  src: z
    .string()
    .regex(
      /^\/media\/quests\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/,
      'a .webp under /media/quests/<quest>/',
    ),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: sentence,
  caption: sentence.optional(),
})
export type Shot = z.infer<typeof shotSchema>

export const questKinds = ['main', 'side', 'archive'] as const
export const questStatuses = ['active', 'launching', 'live', 'completed'] as const

export const questSchema = z.object({
  slug,
  kind: z.enum(questKinds),
  status: z.enum(questStatuses),
  /** Under NDA: stamped, and may contain [[redacted:N]] marks (lib/redaction.ts). */
  classified: z.boolean().default(false),
  title: sentence,
  epithet: sentence,
  /** The quest giver: client, employer or "Personal". */
  giver: sentence,
  role: sentence,
  party: z.array(z.object({ name: sentence, role: sentence, url: url.optional() })).min(1),
  start: isoMonth,
  end: isoMonth.optional(),
  difficulty: z.number().int().min(1).max(5),
  /** Sigil drawn on the quest banner; an icon name from ui/icons. */
  sigil: z.enum(iconNames),
  /** One sentence for non-technical readers: the outcome, no jargon. */
  plain: z.string().trim().min(20).max(180),
  /** The technical summary. */
  summary: sentence,
  stack: z.array(slug).min(1),
  objectives: z.array(sentence).min(1),
  rewards: z.array(sentence).min(1),
  gallery: z.array(shotSchema).default([]),
  /** A before/after pair, e.g. an old site and its rebuild. */
  compare: z
    .object({ before: shotSchema, after: shotSchema, beforeLabel: sentence, afterLabel: sentence })
    .optional(),
  /** The hardest bug of the quest, told as a fight: what broke, the hunt, the fix. */
  boss: z
    .object({
      name: sentence,
      symptom: sentence,
      hunt: sentence,
      fix: sentence,
      lesson: sentence,
    })
    .optional(),
  /** The system as tiers, read left to right (top to bottom on phones). */
  architecture: z
    .object({
      tiers: z.array(z.object({ label: sentence, items: z.array(sentence).min(1) })).min(2),
    })
    .optional(),
  /** The few files that say the most, linked at a fixed commit (or main for this repo). */
  codeTour: z
    .array(
      z.object({
        label: sentence,
        url: z
          .string()
          .regex(
            /^https:\/\/github\.com\/F3KT0R\/[\w.-]+\/blob\/([0-9a-f]{40}|main)\/[^\s#]+(#L\d+)?$/,
            'a GitHub blob link pinned to a commit',
          ),
        why: sentence,
      }),
    )
    .default([]),
  /** Decisions with the road not taken — and what the choice costs. */
  tradeoffs: z
    .array(z.object({ chose: sentence, over: sentence, because: sentence, cost: sentence }))
    .default([]),
  journal: z
    .array(z.object({ heading: sentence, paragraphs: z.array(sentence).min(1) }))
    .default([]),
  links: z
    .object({
      live: url.optional(),
      repo: url.optional(),
      /** Why the code cannot be linked, shown instead of a repo button. */
      repoNote: sentence.optional(),
    })
    .default({}),
})
export type Quest = z.infer<typeof questSchema>
export type QuestKind = Quest['kind']
export type QuestStatus = Quest['status']

// ── Chronicle ─────────────────────────────────────────────────────────────

export const chronicleEntrySchema = z.object({
  id: slug,
  kind: z.enum(['work', 'freelance', 'venture', 'education']),
  org: sentence,
  url: url.optional(),
  role: sentence,
  place: sentence,
  start: isoMonth,
  end: isoMonth.optional(),
  summary: sentence,
  highlights: z.array(sentence).min(1),
  skills: z.array(slug).default([]),
  quests: z.array(slug).default([]),
})
export type ChronicleEntry = z.infer<typeof chronicleEntrySchema>

// ── Playstyle (how Tibor works) ───────────────────────────────────────────

export const playstyleSchema = z.object({
  id: slug,
  title: sentence,
  /** The principle in Tibor's own words. */
  inMyWords: sentence,
  /** What it looks like in real work — facts, not adjectives. */
  inPractice: sentence,
  /** Where to see it: site routes or public URLs. */
  evidence: z.array(z.object({ label: sentence, href: z.string().startsWith('/') })).min(1),
})
export type Playstyle = z.infer<typeof playstyleSchema>

// ── Testimonials (NPC dialogue) ───────────────────────────────────────────

export const testimonialSchema = z.object({
  id: slug,
  /** Real name, as the person agreed to be credited. */
  speaker: sentence,
  /** Their role and how they know Tibor, e.g. "Agency lead, Union-Medic". */
  role: sentence,
  /** Their words, verbatim. Never paraphrased or written for them. */
  quote: z.string().trim().min(20).max(400),
  /** The quest the quote is about; it is shown on that quest's page too. */
  quest: slug.optional(),
  /** When they gave permission to publish it (YYYY-MM-DD). */
  approvedOn: isoDay,
})
export type Testimonial = z.infer<typeof testimonialSchema>

// ── Achievements (the visitor's, not Tibor's) ─────────────────────────────

export const conditionSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('visit'), path: z.string().startsWith('/') }),
  z.object({
    kind: z.literal('visit-prefix'),
    prefix: z.string().startsWith('/'),
    count: z.number().int().min(1),
  }),
  z.object({ kind: z.literal('visit-all'), paths: z.array(z.string().startsWith('/')).min(2) }),
  z.object({ kind: z.literal('event'), event: z.string().min(3) }),
])
export type Condition = z.infer<typeof conditionSchema>

export const achievementSchema = z.object({
  id: slug,
  title: sentence,
  description: sentence,
  /** Hidden achievements show as "???" until unlocked. */
  hidden: z.boolean().default(false),
  icon: z.enum(iconNames),
  xp: z.number().int().min(5).max(100),
  condition: conditionSchema,
})
export type Achievement = z.infer<typeof achievementSchema>

export { isoDay, isoMonth, slug }
