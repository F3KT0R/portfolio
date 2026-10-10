import { z } from 'zod'
import type { QuestSlug } from './quests'
import { testimonialSchema, type Testimonial } from './schema'

// What other people say, shown as NPC dialogue on the sheet and on the quest
// it is about. Only real quotes, verbatim, with the person's permission and
// the date they gave it. While the list is empty, nothing renders.
//
// Template:
// {
//   id: 'dusan-union-medic',
//   speaker: 'Dušan Selaković',
//   role: 'Agency lead, Union-Medic',
//   quote: '…their exact words…',
//   quest: 'union-medic',
//   approvedOn: '2026-10-12',
// },

type TestimonialInput = Omit<z.input<typeof testimonialSchema>, 'quest'> & { quest?: QuestSlug }

const testimonialData = [] as const satisfies readonly TestimonialInput[]

export const testimonials: Testimonial[] = z.array(testimonialSchema).parse(testimonialData)
