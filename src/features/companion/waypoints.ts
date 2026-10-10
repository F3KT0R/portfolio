// Where the companion goes, as plain geometry so it is unit-tested without a
// browser. Rects are viewport-relative, like getBoundingClientRect().

export type Box = { top: number; left: number; right: number; bottom: number }

export type View = {
  width: number
  height: number
  /** Covered by the sticky header. */
  topInset: number
  /** Covered by the fixed hotbar on phones. */
  bottomInset: number
}

/** Where on the screen the reader's eye rests: a third of the way down. */
const FOCUS = 0.3
/** A panel must beat the current one by this much to pull the companion away. */
const STICKINESS = 96
/** Room kept below a panel's top edge so the companion is not standing on the hotbar. */
const FLOOR_MARGIN = 48

/**
 * The panel the visitor is looking at: the one whose top edge is on screen
 * (the companion stands on it) and nearest the focus line. The current panel
 * wins close calls, so scrolling a little does not make the companion pace.
 *
 * When no top edge has full room (the first panel tucked under the header,
 * a tall cover pushing panels down), a looser pass accepts any top edge on
 * screen: the companion's head may slip behind the header, which reads as
 * walking under a ledge. Returns -1 when no panel's top edge is on screen.
 */
export function pickWaypoint(
  boxes: readonly Box[],
  view: View,
  spriteHeight: number,
  current = -1,
) {
  const focus = view.topInset + (view.height - view.topInset - view.bottomInset) * FOCUS
  const strict = {
    ceiling: view.topInset + spriteHeight,
    floor: view.height - view.bottomInset - FLOOR_MARGIN,
  }
  const loose = { ceiling: view.topInset, floor: view.height - view.bottomInset }
  return pick(boxes, focus, strict, current) ?? pick(boxes, focus, loose, current) ?? -1
}

function pick(
  boxes: readonly Box[],
  focus: number,
  band: { ceiling: number; floor: number },
  current: number,
) {
  const score = (box: Box) =>
    box.top >= band.ceiling && box.top <= band.floor && box.right > box.left
      ? Math.abs(box.top - focus)
      : Infinity

  let best = -1
  boxes.forEach((box, i) => {
    if (score(box) < (best === -1 ? Infinity : score(boxes[best] as Box))) best = i
  })
  if (best === -1) return null

  const currentBox = boxes[current]
  if (currentBox && score(currentBox) - score(boxes[best] as Box) < STICKINESS) return current
  return best
}

/** Clear of the rivet and the frame's corner. */
const EDGE = 20
/** Feet sink into the double border instead of floating above it. */
const SINK = 2

/**
 * The spot on a panel's top edge where the companion stands, in viewport
 * coordinates: near the right end, clear of the corner, never off screen.
 */
export function standingSpot(box: Box, sprite: { width: number; height: number }, view: View) {
  const x = Math.max(box.left + EDGE, box.right - EDGE - sprite.width)
  return {
    x: Math.round(Math.min(x, view.width - sprite.width - 4)),
    y: Math.round(box.top - sprite.height + SINK),
  }
}
