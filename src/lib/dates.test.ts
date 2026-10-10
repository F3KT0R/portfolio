import { describe, expect, it } from 'vitest'
import { formatMonth, formatPeriod } from './dates'

describe('dates', () => {
  it('formats a month', () => {
    expect(formatMonth('2026-09')).toBe('Sept 2026')
  })

  it('formats open, closed and single-month periods', () => {
    expect(formatPeriod('2023-02')).toBe('Feb 2023 – present')
    expect(formatPeriod('2021-10', '2022-09')).toBe('Oct 2021 – Sept 2022')
    expect(formatPeriod('2026-09', '2026-09')).toBe('Sept 2026')
  })
})
