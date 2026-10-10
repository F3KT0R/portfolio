import { describe, expect, it } from 'vitest'
import { malformedRedactions, plainText, splitRedactions } from './redaction'

describe('redactions', () => {
  it('splits text around redaction marks', () => {
    expect(splitRedactions('A [[redacted:8]] app, [[redacted:3]].')).toEqual([
      { kind: 'text', text: 'A ' },
      { kind: 'redacted', width: 8 },
      { kind: 'text', text: ' app, ' },
      { kind: 'redacted', width: 3 },
      { kind: 'text', text: '.' },
    ])
  })

  it('leaves text without marks alone', () => {
    expect(splitRedactions('Plain.')).toEqual([{ kind: 'text', text: 'Plain.' }])
  })

  it('renders plain text for meta descriptions', () => {
    expect(plainText('The [[redacted:10]] app')).toBe('The [redacted] app')
  })

  it('finds malformed marks', () => {
    expect(malformedRedactions('[[redacted]] [[redacted:4]] [[secret:2]]')).toEqual([
      '[[redacted]]',
      '[[secret:2]]',
    ])
  })
})
