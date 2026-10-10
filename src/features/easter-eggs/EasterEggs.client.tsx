'use client'

import { useEffect } from 'react'
import { character } from '@/content'
import { levelFromCareer } from '@/game'
import { emitGameEvent } from '@/lib/game-events'
import { palette } from '@/lib/palette'
import { site } from '@/lib/site'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

function banner() {
  const { level } = levelFromCareer(character.careerStart, new Date())
  const line = ` ${character.name.toUpperCase()} · LV ${level} ${character.className.toUpperCase()} `
  const rule = '─'.repeat(line.length)
  return `┌${rule}┐
│${line}│
└${rule}┘`
}

declare global {
  interface Window {
    hire?: () => string
  }
}

/** Secrets for the curious. Renders nothing; only listens. */
export function EasterEggs() {
  useEffect(() => {
    let position = 0
    function onKeyDown(event: KeyboardEvent) {
      const expected = KONAMI[position]
      position =
        event.key.toLowerCase() === expected?.toLowerCase()
          ? position + 1
          : event.key === 'ArrowUp'
            ? 1
            : 0
      if (position === KONAMI.length) {
        position = 0
        document.documentElement.dataset.konami = 'on'
        window.setTimeout(() => delete document.documentElement.dataset.konami, 1600)
        emitGameEvent('secret:konami')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (window.hire) return
    console.log(`%c${banner()}`, `color:${palette['gold-400']};font-family:monospace`)
    console.log(
      '%cReading the source? Good instinct. Type hire() and press Enter.',
      'font-weight:bold',
    )
    window.hire = () => {
      emitGameEvent('secret:console')
      return `Achievement unlocked. Now write to ${site.email} and mention the console.`
    }
  }, [])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 5) emitGameEvent('secret:night')
  }, [])

  return null
}
