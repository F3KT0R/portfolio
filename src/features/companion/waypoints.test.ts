import { describe, expect, it } from 'vitest'
import { pickWaypoint, standingSpot, type Box, type View } from './waypoints'

const view: View = { width: 1000, height: 800, topInset: 60, bottomInset: 0 }
const sprite = 48
const at = (top: number, left = 100, right = 500): Box => ({
  top,
  left,
  right,
  bottom: top + 300,
})

describe('pickWaypoint', () => {
  it('picks the panel nearest the reading line', () => {
    // Focus line: 60 + 740 × 0.3 = 282.
    expect(pickWaypoint([at(120), at(300), at(700)], view, sprite)).toBe(1)
  })

  it('ignores panels whose top edge is under the header or off screen', () => {
    expect(pickWaypoint([at(40), at(-200), at(900)], view, sprite)).toBe(-1)
  })

  it('prefers a top edge with full room for the companion', () => {
    expect(pickWaypoint([at(80), at(500)], view, sprite)).toBe(1)
  })

  it('falls back to a cramped top edge rather than vanishing', () => {
    // Under the header by less than the sprite's height: the first panel on a page.
    expect(pickWaypoint([at(80), at(1200)], view, sprite)).toBe(0)
  })

  it('keeps the current panel on close calls', () => {
    expect(pickWaypoint([at(200), at(282)], view, sprite, 0)).toBe(0)
    expect(pickWaypoint([at(120), at(282)], view, sprite, 0)).toBe(1)
  })

  it('leaves a panel that scrolled away', () => {
    expect(pickWaypoint([at(-100), at(400)], view, sprite, 0)).toBe(1)
  })

  it('keeps clear of the hotbar on phones', () => {
    const phone = { ...view, height: 700, bottomInset: 70 }
    expect(pickWaypoint([at(600), at(400)], phone, sprite)).toBe(1)
    expect(pickWaypoint([at(660)], phone, sprite)).toBe(-1)
  })

  it('skips collapsed panels', () => {
    expect(pickWaypoint([at(280, 0, 0)], view, sprite)).toBe(-1)
  })
})

describe('standingSpot', () => {
  const size = { width: 36, height: 48 }

  it('stands on the top edge, near the right corner', () => {
    expect(standingSpot(at(300), size, view)).toEqual({ x: 444, y: 254 })
  })

  it('stays on a narrow panel and on the screen', () => {
    expect(standingSpot(at(300, 100, 130), size, view).x).toBe(120)
    expect(standingSpot(at(300, 900, 1200), size, view).x).toBe(960)
  })
})
