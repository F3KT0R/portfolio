import { describe, expect, it } from 'vitest'
import { windowIn, zoneOffsetMinutes } from './call-times'

const winter = new Date('2026-01-15T12:00:00Z')
const summer = new Date('2026-07-15T12:00:00Z')

describe('zoneOffsetMinutes', () => {
  it('follows daylight saving', () => {
    expect(zoneOffsetMinutes('Europe/Belgrade', winter)).toBe(60)
    expect(zoneOffsetMinutes('Europe/Belgrade', summer)).toBe(120)
  })
})

describe('windowIn', () => {
  it('returns null in the home zone', () => {
    expect(windowIn('Europe/Belgrade', 9, 12, winter)).toBeNull()
  })

  it('shifts to London and New York', () => {
    expect(windowIn('Europe/London', 9, 12, winter)).toBe('08:00–11:00')
    expect(windowIn('America/New_York', 9, 12, winter)).toBe('03:00–06:00')
  })

  it('handles half-hour zones and crossing midnight', () => {
    expect(windowIn('Asia/Kolkata', 9, 12, winter)).toBe('13:30–16:30')
    expect(windowIn('Pacific/Auckland', 13, 17, winter)).toBe('01:00–05:00')
  })
})
