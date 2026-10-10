'use client'

import Link from 'next/link'
import { useSyncExternalStore } from 'react'
import { achievements } from '@/content'
import { routes } from '@/lib/routes'
import { Meter } from '@/ui'
import { progressStore } from './progress-store'
import styles from './ProgressMeter.module.css'

/** The HUD counter: how many achievements the visitor has, linking to the codex. */
export function ProgressMeter() {
  const progress = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  )
  const unlocked = Object.keys(progress.unlocked).length
  const total = achievements.length

  return (
    <Link
      href={routes.codex}
      className={styles.link}
      aria-label={`Achievements: ${unlocked} of ${total}`}
    >
      <span className={styles.count} aria-hidden>
        {unlocked}/{total}
      </span>
      <Meter
        className={styles.meter}
        value={unlocked}
        max={total}
        segments={total}
        size="sm"
        label="Achievements unlocked"
        valueText={`${unlocked} of ${total}`}
      />
    </Link>
  )
}
