'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { companionLine, rollCompanion, type Companion as CompanionData } from '@/game'
import { companionStore } from './companion-store'
import { CompanionSprite } from './CompanionSprite'
import { pickWaypoint, standingSpot, type Box, type View } from './waypoints'
import styles from './Companion.module.css'

/** Wait for scrolling to settle before setting off. */
const SETTLE_MS = 160
/** Hovering a panel this long calls the companion over (fine pointers only). */
const HOVER_MS = 650
const BUBBLE_MS = 3200
/** Minimum quiet time between two lines. */
const CHATTER_GAP_MS = 9000

/** Greet once per visit, not on every page. */
let greeted = false

/**
 * The visitor's companion, mounted once in the layout. It is rolled on the
 * first visit and kept in this browser. Purely decorative: hidden from
 * assistive tech and from pointer events, so it never stands between the
 * visitor and a control. The Codex card and the command palette control it.
 */
export function Companion() {
  const state = useSyncExternalStore(
    companionStore.subscribe,
    companionStore.getSnapshot,
    companionStore.getServerSnapshot,
  )
  useEffect(() => companionStore.ensure(), [])

  const companion = useMemo(() => (state ? rollCompanion(state.seed) : null), [state])
  if (!companion || state?.hidden) return null
  // A new seed is a new character: remount so it drops in fresh.
  return <Walker key={companion.seed} companion={companion} />
}

type Point = { x: number; y: number }

function Walker({ companion }: { companion: CompanionData }) {
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [walking, setWalking] = useState(false)
  const [facingLeft, setFacingLeft] = useState(false)
  const [bubble, setBubble] = useState<string | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const body = bodyRef.current
    if (!root || !body) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let target: HTMLElement | null = null
    /** Where it stands, in document coordinates. Null: not on the page yet. */
    let spot: Point | null = null
    let moves: Animation[] = []
    let settleTimer = 0
    let hoverTimer = 0
    let bubbleTimer = 0
    let lastLine = 0
    const spokenAt = new WeakSet<Element>()
    // A new page: off stage until it lands on one of this page's panels.
    root.style.opacity = '0'

    const place = (p: Point) => {
      root.style.transform = `translate(${p.x}px, ${p.y}px)`
    }

    const spriteSize = () => {
      const r = body.getBoundingClientRect()
      return { width: r.width, height: r.height }
    }

    const view = (): View => {
      const top = document.querySelector<HTMLElement>('[data-hud="top"]')
      const bottom = document.querySelector<HTMLElement>('[data-hud="bottom"]')
      const bottomTop = bottom?.getBoundingClientRect().top ?? Infinity
      return {
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
        topInset: Math.max(0, top?.getBoundingClientRect().bottom ?? 0),
        // On wide screens the hotbar sits in the header, not on the bottom edge.
        bottomInset: bottomTop > window.innerHeight / 2 ? window.innerHeight - bottomTop : 0,
      }
    }

    const spotOn = (el: HTMLElement): Point => {
      const box: Box = el.getBoundingClientRect()
      const local = standingSpot(box, spriteSize(), view())
      return { x: local.x + window.scrollX, y: local.y + window.scrollY }
    }

    /** Where it is right now, mid-walk included. */
    const whereNow = (): Point | null => {
      if (!spot) return null
      const r = root.getBoundingClientRect()
      return { x: r.left + window.scrollX, y: r.top + window.scrollY }
    }

    const stop = () => {
      for (const move of moves) move.cancel()
      moves = []
    }

    const say = (line: string | null) => {
      if (!line) return
      lastLine = Date.now()
      setBubble(line)
      window.clearTimeout(bubbleTimer)
      bubbleTimer = window.setTimeout(() => setBubble(null), BUBBLE_MS)
    }

    const arrive = (el: HTMLElement) => {
      setWalking(false)
      if (!greeted) {
        greeted = true
        spokenAt.add(el)
        say(companionLine('greeting', companion.name, Math.random))
        return
      }
      if (spokenAt.has(el) || Date.now() - lastLine < CHATTER_GAP_MS) return
      spokenAt.add(el)
      say(companionLine(el.dataset.waypoint ?? 'panel', companion.name, Math.random))
    }

    const dropIn = (to: Point, el: HTMLElement) => {
      place(to)
      root.style.opacity = '1'
      if (reduced.matches) return arrive(el)
      const fall = body.animate(
        [
          { transform: 'translateY(-48px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1, offset: 0.7 },
          { transform: 'translateY(-6px)', offset: 0.85 },
          { transform: 'translateY(0)' },
        ],
        { duration: 420, easing: 'ease-in' },
      )
      moves = [fall]
      fall.onfinish = () => arrive(el)
    }

    const walkTo = (el: HTMLElement) => {
      const to = spotOn(el)
      const from = whereNow()
      stop()
      target = el
      spot = to

      if (!from || reduced.matches) return dropIn(to, el)
      const dx = to.x - from.x
      const dy = to.y - from.y
      const distance = Math.hypot(dx, dy)
      if (distance < 2) return place(to)
      // Too far to walk: vanish and drop in at the new panel.
      if (distance > window.innerHeight * 1.5) return dropIn(to, el)

      if (Math.abs(dx) > 2) setFacingLeft(dx < 0)
      setWalking(true)
      const duration = Math.min(1400, 260 + distance * 0.9)
      place(to)
      const walk = root.animate(
        [
          { transform: `translate(${from.x}px, ${from.y}px)` },
          { transform: `translate(${to.x}px, ${to.y}px)` },
        ],
        { duration, easing: 'ease-in-out' },
      )
      moves = [walk]
      // Changing height is a jump: an arc on top of the straight path.
      if (Math.abs(dy) > 4) {
        const height = Math.min(56, 18 + Math.abs(dy) * 0.08)
        moves.push(
          body.animate(
            [
              { transform: 'translateY(0)' },
              { transform: `translateY(${-height}px)`, offset: 0.45 },
              { transform: 'translateY(0)' },
            ],
            { duration, easing: 'ease-out' },
          ),
        )
      }
      walk.onfinish = () => arrive(el)
    }

    const waypoints = () =>
      [...document.querySelectorAll<HTMLElement>('main [data-waypoint]')].filter(
        (el) => el.getClientRects().length > 0,
      )

    /** Go to the panel in view, if it changed. */
    const follow = () => {
      const els = waypoints()
      const index = pickWaypoint(
        els.map((el) => el.getBoundingClientRect()),
        view(),
        spriteSize().height,
        target ? els.indexOf(target) : -1,
      )
      const next = els[index]
      if (next && next !== target) return walkTo(next)
      if (!next && target && !target.isConnected) {
        // Its panel left with the old page: off stage until one comes into view.
        stop()
        target = null
        spot = null
        root.style.opacity = '0'
      }
    }

    /** The page reflowed: stay on the same panel, at its new position. */
    const reflow = () => {
      if (!target?.isConnected || moves.some((m) => m.playState === 'running')) return
      spot = spotOn(target)
      place(spot)
    }

    const onScroll = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(follow, SETTLE_MS)
    }

    const onPointerOver = (event: PointerEvent) => {
      if (!finePointer.matches) return
      const el = (event.target as Element | null)?.closest<HTMLElement>('main [data-waypoint]')
      window.clearTimeout(hoverTimer)
      if (!el || el === target) return
      hoverTimer = window.setTimeout(() => {
        const els = waypoints()
        const v = view()
        const top = el.getBoundingClientRect().top
        // Only to panels whose top edge it can stand on.
        if (els.includes(el) && top >= v.topInset + spriteSize().height && top < v.height)
          walkTo(el)
      }, HOVER_MS)
    }

    const resizes = new ResizeObserver(reflow)
    resizes.observe(document.body)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', reflow)
    document.addEventListener('pointerover', onPointerOver)
    // After the new page has painted.
    const frame = requestAnimationFrame(() => requestAnimationFrame(follow))

    return () => {
      cancelAnimationFrame(frame)
      resizes.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', reflow)
      document.removeEventListener('pointerover', onPointerOver)
      window.clearTimeout(settleTimer)
      window.clearTimeout(hoverTimer)
      window.clearTimeout(bubbleTimer)
      stop()
    }
  }, [companion, pathname])

  return (
    <div ref={rootRef} className={styles.companion} aria-hidden="true" data-companion>
      <div ref={bodyRef} className={styles.body} data-walking={walking || undefined}>
        <div className={styles.facing} data-facing={facingLeft ? 'left' : 'right'}>
          <CompanionSprite companion={companion} className={styles.sprite} />
        </div>
      </div>
      {bubble ? <p className={styles.bubble}>{bubble}</p> : null}
    </div>
  )
}
