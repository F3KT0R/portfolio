import { type z } from 'zod'
import { characterSchema, type Character } from './schema'
import type { SkillId } from './skills'

type CharacterInput = Omit<z.input<typeof characterSchema>, 'loadout'> & {
  loadout: (z.input<typeof characterSchema>['loadout'][number] & { skill: SkillId })[]
}

const characterData = {
  name: 'Tibor Bálint',
  handle: 'F3KT0R',
  className: 'Software Engineer',
  specialization: 'Frontend-leaning · full-stack capable',
  careerStart: '2023-02-20',
  origin: 'Novi Bečej, Serbia',
  timezone: 'CET (UTC+1)',
  status: { available: true, label: 'Open to roles and project invitations' },
  pitch: [
    'I build web products that hold up: Angular and React on the front, Node and C# behind it, and tests that say what “done” means.',
    'By day I work on a production fintech app at PaySpot. On the side I ship small businesses’ shops and sites end to end — from Figma to Docker.',
  ],
  attributes: [
    {
      key: 'ARC',
      name: 'Architecture',
      score: 16,
      evidence: [
        'Set up the frontend architecture of a greenfield fintech app at PaySpot.',
        'Pure domain package shared by API and web in Kafe za Vas.',
        'Server-first pages with client islands in Union-Medic.',
      ],
    },
    {
      key: 'CRF',
      name: 'Craft',
      score: 17,
      evidence: [
        'Led a full UI refresh at PaySpot: layout, styling, reusable components.',
        'Figma built faithfully at 12 widths, from 320 to 1920 px.',
      ],
    },
    {
      key: 'QUA',
      name: 'Quality',
      score: 17,
      evidence: [
        'Started in QA: test plans, validation, an FDA audit.',
        'Visual baselines, axe and measured contrast in CI.',
        'Fail-safe syncs that keep yesterday’s data rather than guess.',
      ],
    },
    {
      key: 'DEL',
      name: 'Delivery',
      score: 14,
      evidence: [
        'Ships to Netlify, Vercel, Render and Docker/Coolify.',
        'Ticket-per-PR workflow with CI on every push.',
      ],
    },
    {
      key: 'DAT',
      name: 'Data',
      score: 13,
      evidence: [
        'Postgres with Prisma; DB2 procedures in production.',
        'Catalogue sync over Magento GraphQL; Gmail → Sheets pipelines.',
      ],
    },
    {
      key: 'CHA',
      name: 'Charisma',
      score: 15,
      evidence: [
        'Mentors interns and juniors at PaySpot.',
        'Former translator and community manager.',
        'Writes the README before someone has to ask.',
      ],
    },
  ],
  loadout: [
    {
      slot: 'main-hand',
      skill: 'typescript',
      flavor: 'Never leaves its sheath without strict mode.',
    },
    {
      slot: 'off-hand',
      skill: 'angular',
      flavor: 'Heavy, dependable, carried into production daily.',
    },
    { slot: 'helm', skill: 'nextjs', flavor: 'Renders on the server before the enemy can blink.' },
    { slot: 'armor', skill: 'playwright', flavor: 'Absorbs regressions at 12 viewport widths.' },
    { slot: 'boots', skill: 'node', flavor: 'Fastify-forged. Light, quick, idempotent.' },
    { slot: 'ring', skill: 'csharp', flavor: 'Bound to ASP.NET MVC at the PaySpot guild.' },
    { slot: 'amulet', skill: 'css', flavor: 'Every colour a token. Every class one owner.' },
    {
      slot: 'trinket',
      skill: 'python',
      flavor: 'Hums near exchange APIs. Handle with stop-losses.',
    },
  ],
  languages: [
    { name: 'Hungarian', level: 'Native' },
    { name: 'Serbian', level: 'Fluent' },
    { name: 'English', level: 'Fluent' },
  ],
  traits: [
    { name: 'Pianist', effect: 'Rhythm and pacing carry over into motion and flow.' },
    { name: 'Photographer', effect: 'An eye for composition, light and crop.' },
    {
      name: 'Market tinkerer',
      effect: 'Builds trading automation for fun — risk limits first, profits second.',
    },
    { name: 'Translator', effect: 'Words are chosen, not filled in.' },
  ],
} as const satisfies CharacterInput

export const character: Character = characterSchema.parse(characterData)
