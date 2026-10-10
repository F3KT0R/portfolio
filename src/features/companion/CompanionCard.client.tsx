'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { rollCompanion } from '@/game'
import { emitGameEvent } from '@/lib/game-events'
import { Button } from '@/ui'
import { companionStore } from './companion-store'
import { CompanionSprite } from './CompanionSprite'
import styles from './CompanionCard.module.css'

/**
 * The companion up close, with the controls the walking sprite cannot offer
 * (it ignores the pointer and is hidden from assistive tech). The buttons go
 * through the game bus, like the command palette's.
 */
export function CompanionCard() {
  const state = useSyncExternalStore(
    companionStore.subscribe,
    companionStore.getSnapshot,
    companionStore.getServerSnapshot,
  )
  const companion = useMemo(() => (state ? rollCompanion(state.seed) : null), [state])

  if (!state || !companion) {
    return <p className={styles.text}>Your companion appears once the page has loaded.</p>
  }

  const label = `${companion.name} the ${companion.title}`
  return (
    <div className={styles.card}>
      <div className={styles.portrait}>
        <CompanionSprite companion={companion} scale={6} label={`Pixel portrait of ${label}`} />
      </div>
      <div className={styles.about}>
        <p className={styles.name}>{label}</p>
        <p className={styles.meta}>Seed #{companion.seed}</p>
        <p className={styles.text}>
          {state.hidden
            ? `${companion.name} is resting at home.`
            : `${companion.name} walks to whichever panel you are reading. Rolled at random for you, and kept only in this browser.`}
        </p>
        <div className={styles.actions}>
          <Button size="sm" onClick={() => emitGameEvent('companion:reroll')}>
            Roll a new companion
          </Button>
          <Button size="sm" variant="secondary" onClick={() => emitGameEvent('companion:toggle')}>
            {state.hidden ? `Call ${companion.name} back` : `Send ${companion.name} home`}
          </Button>
        </div>
      </div>
    </div>
  )
}
