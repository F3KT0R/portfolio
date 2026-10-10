import { describe, expect, it } from 'vitest'
import {
  companionClasses,
  companionLine,
  companionLines,
  newCompanionSeed,
  parseCompanionState,
  rollCompanion,
  seededRandom,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  tones,
} from './companion'

const seeds = Array.from({ length: 200 }, (_, i) => i * 7919)

describe('rollCompanion', () => {
  it('draws the same companion for the same seed', () => {
    expect(rollCompanion(42)).toEqual(rollCompanion(42))
  })

  it('draws every frame on the full grid, in known tones only', () => {
    const allowed = new Set<string>(['.', ...tones])
    for (const seed of seeds) {
      for (const frame of rollCompanion(seed).frames) {
        expect(frame).toHaveLength(SPRITE_HEIGHT)
        for (const row of frame) {
          expect(row).toHaveLength(SPRITE_WIDTH)
          for (const pixel of row) expect(allowed.has(pixel), `${seed}: ${row}`).toBe(true)
        }
      }
    }
  })

  it('walks: the two frames differ only in the legs', () => {
    const [stand, stride] = rollCompanion(1).frames
    expect(stand.slice(0, 13)).toEqual(stride.slice(0, 13))
    expect(stand.slice(13)).not.toEqual(stride.slice(13))
  })

  it('can roll every class', () => {
    const rolled = new Set(seeds.map((seed) => rollCompanion(seed).classId))
    expect([...rolled].sort()).toEqual(Object.keys(companionClasses).sort())
  })
})

describe('newCompanionSeed', () => {
  it('stays a non-negative 31-bit integer', () => {
    expect(newCompanionSeed(() => 0)).toBe(0)
    const top = newCompanionSeed(() => 0.999999999)
    expect(Number.isInteger(top) && top < 2 ** 31).toBe(true)
  })
})

describe('parseCompanionState', () => {
  it('reads what the store writes', () => {
    const state = { version: 1, seed: 7, hidden: false }
    expect(parseCompanionState(JSON.stringify(state))).toEqual(state)
  })

  it('treats anything else as no companion yet', () => {
    expect(parseCompanionState(null)).toBeNull()
    expect(parseCompanionState('{')).toBeNull()
    expect(parseCompanionState('{"version":1,"seed":-1,"hidden":false}')).toBeNull()
    expect(parseCompanionState('{"version":2,"seed":1,"hidden":false}')).toBeNull()
  })
})

describe('companionLine', () => {
  it('names the companion', () => {
    const line = companionLine('greeting', 'Pip', seededRandom(1))
    expect(line).toContain('Pip')
    expect(line).not.toContain('{name}')
  })

  it('always speaks on a known topic', () => {
    for (const seed of seeds)
      expect(companionLine('boss', 'Pip', seededRandom(seed))).not.toBe(null)
  })

  it('is quiet on most plain panels', () => {
    const spoken = seeds.filter((seed) => companionLine('panel', 'Pip', seededRandom(seed)))
    expect(spoken.length).toBeGreaterThan(0)
    expect(spoken.length).toBeLessThan(seeds.length / 2)
  })

  it('treats an unknown waypoint as a plain panel', () => {
    const quiet = companionLine('nowhere', 'Pip', () => 0.99)
    expect(quiet).toBeNull()
    expect(companionLines.panel).toContain(companionLine('nowhere', 'Pip', () => 0))
  })
})
