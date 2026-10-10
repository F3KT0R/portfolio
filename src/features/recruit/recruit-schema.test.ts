import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { FORM_NAME, HONEYPOT, fieldNames, validateRecruit } from './recruit-schema'

const valid = {
  intent: 'freelance',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: '',
  message: 'We need a bilingual marketing site by spring.',
}

describe('validateRecruit', () => {
  it('accepts a complete message and drops an empty company', () => {
    const result = validateRecruit(valid)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data.company).toBeUndefined()
  })

  it('reports one message per invalid field', () => {
    const result = validateRecruit({ ...valid, intent: 'x', email: 'nope', message: 'hi' })
    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'intent', 'message'])
  })
})

describe('Netlify form stub', () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'public', '__forms.html'), 'utf8')

  it('declares the same form name, honeypot and fields as the component', () => {
    expect(html).toContain(`name="${FORM_NAME}"`)
    expect(html).toContain(`netlify-honeypot="${HONEYPOT}"`)
    for (const field of [...fieldNames, HONEYPOT]) expect(html, field).toContain(`name="${field}"`)
  })
})
