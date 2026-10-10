'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'
import { onGameEvent } from '@/lib/game-events'
import { PixelIcon } from '@/ui'
import { progressStore } from './progress-store'
import styles from './ProgressTracker.module.css'

const TOAST_MS = 4500

/**
 * Turns what the visitor does into achievements: every page view and every
 * event on the game bus goes through the engine. Mounted once, in the layout.
 */
export function ProgressTracker() {
  const pathname = usePathname()

  useEffect(() => {
    progressStore.dispatch({ type: 'visit', path: pathname })
  }, [pathname])

  useEffect(() => onGameEvent((name) => progressStore.dispatch({ type: 'event', name })), [])

  return <AchievementToasts />
}

function AchievementToasts() {
  const toasts = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getToasts,
    progressStore.getServerToasts,
  )
  const first = toasts[0]

  useEffect(() => {
    if (!first) return
    const timer = window.setTimeout(() => progressStore.dismissToast(first.id), TOAST_MS)
    return () => window.clearTimeout(timer)
  }, [first])

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {first ? (
        <div key={first.id} className={styles.toast}>
          <PixelIcon name={first.icon} size={36} className={styles.icon} />
          <div>
            <p className={styles.kicker}>Achievement unlocked · +{first.xp} XP</p>
            <p className={styles.title}>{first.title}</p>
            <p className={styles.text}>{first.description}</p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={() => progressStore.dismissToast(first.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  )
}
