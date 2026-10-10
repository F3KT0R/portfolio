import { z } from 'zod'
import { chronicleEntrySchema, type ChronicleEntry } from './schema'
import type { QuestSlug } from './quests'
import type { SkillId } from './skills'

type EntryInput = Omit<z.input<typeof chronicleEntrySchema>, 'skills' | 'quests'> & {
  skills?: SkillId[]
  quests?: QuestSlug[]
}

// Newest first. The chronicle is the career; quests are the work inside it.
const chronicleData = [
  {
    id: 'freelance-agency',
    kind: 'freelance',
    org: 'Dušan Selaković’s agency',
    role: 'Freelance developer',
    place: 'Remote',
    start: '2026-09',
    summary:
      'Client builds from agency designs, delivered ticket by ticket through reviewed pull requests.',
    highlights: [
      'Union-Medic: a bilingual Next.js site for a pharmaceutical company, from Figma to Docker.',
      '61 pull requests in the first engagement, each with tests and a written rationale.',
    ],
    skills: ['nextjs', 'i18n', 'playwright', 'docker', 'figma'],
    quests: ['union-medic'],
  },
  {
    id: 'kafe-za-vas',
    kind: 'venture',
    org: 'Kafe za Vas',
    url: 'https://kafeshop.netlify.app',
    role: 'Founder',
    place: 'Novi Bečej, Serbia',
    start: '2024-02',
    summary: 'My own online shop for coffee capsules, tea and syrups, built and run end to end.',
    highlights: [
      'Built the shop, the API and the admin myself: catalogue sync, pricing, orders, shipping.',
      'Run the business side too: purchasing from the UK supplier, customer contact, deliveries.',
    ],
    skills: ['react', 'node', 'sql', 'integrations'],
    quests: ['kafe-za-vas'],
  },
  {
    id: 'payspot',
    kind: 'work',
    org: 'PaySpot d.o.o.',
    url: 'https://www.payspot.rs/',
    role: 'Medior Software Developer',
    place: 'Novi Sad, Serbia',
    start: '2023-02',
    summary:
      'UI engineering and architecture on a production fintech app; internal tooling; mentoring.',
    highlights: [
      'Owned core features end to end and contributed to architecture decisions across the app.',
      'Helped start a greenfield company app from (almost) day one.',
      'Led a full UI refresh: layout, styling, reusable components and consistency.',
      'Built a Scrum reporting system used in day-to-day planning.',
      'Co-built an internal agile tracking web app (Angular + Node.js) with full workflow support.',
      'Mentored interns and juniors, onboarded teammates, triaged production incidents.',
      'Angular/TypeScript with C# ASP.NET MVC, integrating DB2 procedures, under PCI DSS.',
    ],
    skills: ['angular', 'typescript', 'csharp', 'sql', 'design-systems', 'scrum', 'mentoring'],
    quests: ['payspot'],
  },
  {
    id: 'zeto',
    kind: 'work',
    org: 'Zeto EU Kft.',
    url: 'https://zeto-inc.com/',
    role: 'Quality Assurance Engineer',
    place: 'Szeged, Hungary',
    start: '2021-10',
    end: '2022-09',
    summary: 'Started as a QA intern and stayed as an engineer: scripting, validation and audits.',
    highlights: [
      'Automated documentation with custom Google Apps Script functions, then tested and validated them.',
      'Built an electronic inventory system.',
      'Took part in an FDA audit and trained internal staff.',
      'Created and maintained the KPI system.',
    ],
    skills: ['qa', 'apps-script', 'writing'],
  },
  {
    id: 'ovation-bbdo',
    kind: 'work',
    org: 'Ovation BBDO',
    url: 'https://ovation.rs/en/',
    role: 'Translator & Social Media Manager',
    place: 'Belgrade, Serbia',
    start: '2020-07',
    end: '2022-06',
    summary: 'Language and community work alongside my studies.',
    highlights: [
      'Translated advertising from English to Hungarian.',
      'Managed communities and wrote monthly metric reports.',
      'Handled technical support.',
    ],
    skills: ['writing'],
  },
  {
    id: 'szeged',
    kind: 'education',
    org: 'University of Szeged',
    role: 'BSc Computer Science',
    place: 'Szeged, Hungary',
    start: '2018-09',
    end: '2022-06',
    summary: 'Computer Science with a web development focus.',
    highlights: ['Thesis: Watchflix, a React progressive web app on The Movie Database API.'],
    skills: ['react', 'css'],
    quests: ['watchflix'],
  },
] as const satisfies readonly EntryInput[]

export const chronicle: ChronicleEntry[] = z.array(chronicleEntrySchema).parse(chronicleData)
