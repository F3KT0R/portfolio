import { z } from 'zod'

// The contact form's contract. Field names match public/__forms.html, which is
// what Netlify Forms reads at deploy time; recruit-schema.test.ts keeps them equal.

export const FORM_NAME = 'contact'
export const HONEYPOT = 'bot-field'

export const intents = [
  { value: 'role', label: 'A full-time role', hint: 'You are hiring.' },
  { value: 'freelance', label: 'A freelance project', hint: 'You have a build in mind.' },
  { value: 'collab', label: 'A collaboration', hint: 'Let’s make something together.' },
] as const

export const recruitSchema = z.object({
  intent: z.enum(intents.map((i) => i.value) as ['role', 'freelance', 'collab'], {
    error: 'Choose what kind of quest this is.',
  }),
  name: z.string().trim().min(2, 'Tell me who you are.').max(100),
  email: z.email('That e-mail address does not look right.'),
  company: z.string().trim().max(120).optional(),
  message: z
    .string()
    .trim()
    .min(20, 'A sentence or two more, please — at least 20 characters.')
    .max(5000, 'Please keep it under 5,000 characters.'),
})

export type RecruitFields = z.infer<typeof recruitSchema>
export type FieldErrors = Partial<Record<keyof RecruitFields, string>>

export const fieldNames = ['intent', 'name', 'email', 'company', 'message'] as const

export function validateRecruit(data: Record<string, FormDataEntryValue | undefined>) {
  const result = recruitSchema.safeParse({
    ...data,
    company: data.company === '' ? undefined : data.company,
  })
  if (result.success) return { ok: true as const, data: result.data }

  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RecruitFields
    errors[field] ??= issue.message
  }
  return { ok: false as const, errors }
}
