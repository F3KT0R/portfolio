import { z } from 'zod'
import { playstyleSchema, type Playstyle } from './schema'

// How Tibor works. "inMyWords" is his own phrasing (October 2026); "inPractice"
// points at things a reader can check on this site or in the code.

const playstyleData = [
  {
    id: 'quality-first',
    title: 'Quality first',
    inMyWords: 'In a review, I look for quality issues first.',
    inPractice:
      'The same bar applies to my own work: each of the 61 Union-Medic pull requests was tied to a ticket and explained in its description, and on this site lint scripts reject layer violations before a reviewer ever sees them.',
    evidence: [
      { label: 'Union-Medic', href: '/quests/union-medic' },
      { label: 'This site’s guard scripts', href: '/quests/character-sheet' },
    ],
  },
  {
    id: 'done-means-verified',
    title: 'Done means verified',
    inMyWords: 'Done is when all the tests pass and I have verified it by hand.',
    inPractice:
      'Tests prove the code does what was intended; checking it myself proves the intention was right. A flaky test counts as a bug report, not something to retry — that is how the Union-Medic menu bug was found.',
    evidence: [
      { label: 'The Phantom Menu', href: '/quests/union-medic' },
      { label: 'This site’s test suite', href: '/quests/character-sheet' },
    ],
  },
  {
    id: 'confirm-before-building',
    title: 'Confirm before building',
    inMyWords: 'When a requirement is unclear, I ask for it to be confirmed again.',
    inPractice:
      'Decisions are written down where the team can see them. On Union-Medic, the move from a language prefix in the path to one domain per language was settled with the client and recorded in the ticket before the code changed.',
    evidence: [{ label: 'Language by domain', href: '/quests/union-medic' }],
  },
  {
    id: 'explain-at-every-level',
    title: 'Explain at every level',
    inMyWords:
      'I explain my ideas to everyone at their own level — from the bare basics if that is what helps.',
    inPractice:
      'At PaySpot that means mentoring interns and juniors and onboarding new teammates. On this site it means every project has a plain-language line beside the technical one.',
    evidence: [
      { label: 'Chronicle', href: '/chronicle' },
      { label: 'Quest log', href: '/quests' },
    ],
  },
  {
    id: 'ai-as-a-tool',
    title: 'AI as a power tool',
    inMyWords:
      'I use AI to assist my work and speed up development, and to check my thinking and my tests.',
    inPractice:
      'It speeds up the work; the checks stay the same. Everything still has to pass the tests, the guard scripts and a manual check before it counts as done — and commits made with an assistant say so in their history.',
    evidence: [{ label: 'How this site is built', href: '/quests/character-sheet' }],
  },
] as const satisfies readonly z.input<typeof playstyleSchema>[]

export const playstyle: Playstyle[] = z.array(playstyleSchema).parse(playstyleData)
