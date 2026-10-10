import { z } from 'zod'
import { callDays, callWindows } from './call-times'

// The contact form's contract. Field names match public/__forms.html, which is
// what Netlify Forms reads at deploy time; recruit-schema.test.ts keeps them equal.

export const FORM_NAME = 'contact'
export const HONEYPOT = 'bot-field'

// Freelance first: it is what Tibor is mainly looking for.
export const intents = [
  { value: 'freelance', label: 'A freelance project', hint: 'You have a build in mind.' },
  { value: 'call', label: 'A quick call', hint: '15 minutes to see if we fit.' },
  { value: 'role', label: 'A long-term role', hint: 'You are hiring.' },
  { value: 'collab', label: 'A collaboration', hint: 'Let’s make something together.' },
] as const

export const recruitSchema = z
  .object({
    intent: z.enum(intents.map((i) => i.value) as ['freelance', 'call', 'role', 'collab'], {
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
    /** For a call: preferred weekdays, comma-separated ("Mon,Wed"). */
    callDays: z.string().optional(),
    callTime: z.enum(callWindows.map((w) => w.value) as ['morning', 'afternoon']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.intent !== 'call') return
    const days = (data.callDays ?? '')
      .split(',')
      .filter((d) => (callDays as readonly string[]).includes(d))
    if (days.length === 0)
      ctx.addIssue({
        code: 'custom',
        path: ['callDays'],
        message: 'Pick at least one day that suits you.',
      })
    if (!data.callTime)
      ctx.addIssue({ code: 'custom', path: ['callTime'], message: 'Pick a time of day.' })
  })

export type RecruitFields = z.infer<typeof recruitSchema>
export type FieldErrors = Partial<Record<keyof RecruitFields, string>>

export const fieldNames = [
  'intent',
  'name',
  'email',
  'company',
  'message',
  'callDays',
  'callTime',
] as const

export function validateRecruit(data: Record<string, FormDataEntryValue | undefined>) {
  const result = recruitSchema.safeParse({
    ...data,
    company: data.company === '' ? undefined : data.company,
    callDays: data.callDays === '' ? undefined : data.callDays,
    callTime: data.callTime === '' ? undefined : data.callTime,
  })
  if (result.success) return { ok: true as const, data: result.data }

  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof RecruitFields
    errors[field] ??= issue.message
  }
  return { ok: false as const, errors }
}
