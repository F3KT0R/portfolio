import { describe, expect, it } from 'vitest'
import { levelFromCareer, XP_PER_LEVEL } from './level'

const start = '2023-02-20'

describe('levelFromCareer', () => {
  it('is level 0 with no XP on the first day', () => {
    const info = levelFromCareer(start, new Date('2023-02-20T00:00:00Z'))
    expect(info).toMatchObject({ level: 0, xp: 0, xpToNext: XP_PER_LEVEL })
  })

  it('levels up exactly on the work anniversary, not before', () => {
    expect(levelFromCareer(start, new Date('2026-02-19T23:59:59Z')).level).toBe(2)
    expect(levelFromCareer(start, new Date('2026-02-20T00:00:00Z')).level).toBe(3)
  })

  it('fills the bar in proportion to the year', () => {
    const info = levelFromCareer(start, new Date('2026-08-21T12:00:00Z'))
    expect(info.level).toBe(3)
    expect(info.progress).toBeGreaterThan(0.49)
    expect(info.progress).toBeLessThan(0.51)
    expect(info.xp + info.xpToNext).toBe(XP_PER_LEVEL)
    expect(info.nextLevelOn.toISOString()).toBe('2027-02-20T00:00:00.000Z')
  })

  it('does not go negative before the career starts', () => {
    expect(levelFromCareer(start, new Date('2020-01-01T00:00:00Z')).level).toBe(0)
  })

  it('handles a 29 February start', () => {
    expect(levelFromCareer('2024-02-29', new Date('2025-03-01T00:00:00Z')).level).toBe(1)
  })
})
