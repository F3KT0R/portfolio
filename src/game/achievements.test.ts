import { describe, expect, it } from 'vitest'
import type { Achievement } from '@/content'
import {
  emptyProgress,
  normalizePath,
  parseProgress,
  reduceProgress,
  totalXp,
} from './achievements'

const now = new Date('2026-10-10T12:00:00Z')

const fixtures: Achievement[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Visit home',
    hidden: false,
    icon: 'star',
    xp: 5,
    condition: { kind: 'visit', path: '/' },
  },
  {
    id: 'two-quests',
    title: 'Two quests',
    description: 'Open two quests',
    hidden: false,
    icon: 'star',
    xp: 10,
    condition: { kind: 'visit-prefix', prefix: '/quests/', count: 2 },
  },
  {
    id: 'tour',
    title: 'Tour',
    description: 'Visit home and skills',
    hidden: false,
    icon: 'star',
    xp: 20,
    condition: { kind: 'visit-all', paths: ['/', '/skills'] },
  },
  {
    id: 'palette',
    title: 'Palette',
    description: 'Open the palette',
    hidden: true,
    icon: 'star',
    xp: 15,
    condition: { kind: 'event', event: 'palette:open' },
  },
]

describe('reduceProgress', () => {
  it('unlocks a visit achievement once', () => {
    const first = reduceProgress(emptyProgress, { type: 'visit', path: '/' }, fixtures, now)
    expect(first.unlocked.map((a) => a.id)).toEqual(['home'])
    expect(first.progress.unlocked.home).toBe(now.toISOString())

    const again = reduceProgress(first.progress, { type: 'visit', path: '/' }, fixtures, now)
    expect(again.unlocked).toEqual([])
    expect(again.progress).toBe(first.progress)
  })

  it('counts distinct pages under a prefix', () => {
    let state = emptyProgress
    state = reduceProgress(state, { type: 'visit', path: '/quests/a' }, fixtures, now).progress
    state = reduceProgress(state, { type: 'visit', path: '/quests/a/' }, fixtures, now).progress
    expect(state.unlocked['two-quests']).toBeUndefined()

    const result = reduceProgress(state, { type: 'visit', path: '/quests/b' }, fixtures, now)
    expect(result.unlocked.map((a) => a.id)).toEqual(['two-quests'])
  })

  it('unlocks visit-all only when every page is seen', () => {
    let state = reduceProgress(
      emptyProgress,
      { type: 'visit', path: '/skills' },
      fixtures,
      now,
    ).progress
    expect(state.unlocked.tour).toBeUndefined()
    state = reduceProgress(state, { type: 'visit', path: '/' }, fixtures, now).progress
    expect(Object.keys(state.unlocked).sort()).toEqual(['home', 'tour'])
  })

  it('unlocks event achievements', () => {
    const result = reduceProgress(
      emptyProgress,
      { type: 'event', name: 'palette:open' },
      fixtures,
      now,
    )
    expect(result.unlocked.map((a) => a.id)).toEqual(['palette'])
  })

  it('sums XP of unlocked achievements only', () => {
    const state = reduceProgress(
      emptyProgress,
      { type: 'visit', path: '/' },
      fixtures,
      now,
    ).progress
    expect(totalXp(state, fixtures)).toBe(5)
  })
})

describe('normalizePath', () => {
  it.each([
    ['/', '/'],
    ['/quests/', '/quests'],
    ['/quests?tab=side', '/quests'],
    ['/skills#typescript', '/skills'],
  ])('%s → %s', (input, expected) => expect(normalizePath(input)).toBe(expected))
})

describe('parseProgress', () => {
  it('starts fresh on missing, broken or tampered storage', () => {
    expect(parseProgress(null)).toBe(emptyProgress)
    expect(parseProgress('{not json')).toBe(emptyProgress)
    expect(parseProgress(JSON.stringify({ version: 2 }))).toBe(emptyProgress)
    // An unlock time that is not a date would crash date formatting in the codex.
    const badDate = { version: 1, visited: [], events: [], unlocked: { home: 'x' } }
    expect(parseProgress(JSON.stringify(badDate))).toBe(emptyProgress)
  })

  it('reads valid stored progress', () => {
    const stored = { version: 1, visited: ['/'], events: [], unlocked: { home: now.toISOString() } }
    expect(parseProgress(JSON.stringify(stored))).toEqual(stored)
  })
})
