'use client'

import { useSyncExternalStore } from 'react'
import { achievements } from '@/content'
import { totalXp } from '@/game'
import { cx } from '@/lib/cx'
import { Button, Meter, PixelIcon } from '@/ui'
import { progressStore } from './progress-store'
import styles from './Codex.module.css'

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
const maxXp = achievements.reduce((sum, a) => sum + a.xp, 0)

/** Every achievement, locked or not. Hidden ones keep their secret until earned. */
export function Codex() {
  const progress = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  )
  const xp = totalXp(progress, achievements)
  const unlockedCount = Object.keys(progress.unlocked).length

  return (
    <div className={styles.codex}>
      <div className={styles.summary}>
        <p className={styles.score}>
          <span className={styles.big}>{xp}</span> / {maxXp} XP · {unlockedCount} of{' '}
          {achievements.length} achievements
        </p>
        <Meter
          value={xp}
          max={maxXp}
          segments={20}
          label="Visitor experience"
          valueText={`${xp} of ${maxXp} XP`}
        />
      </div>

      <ul className={styles.grid}>
        {achievements.map((a) => {
          const unlockedAt = progress.unlocked[a.id]
          const secret = a.hidden && !unlockedAt
          return (
            <li
              key={a.id}
              className={cx(styles.item, unlockedAt ? styles.unlocked : styles.locked)}
            >
              <PixelIcon name={secret ? 'key' : a.icon} size={36} className={styles.icon} />
              <div>
                <p className={styles.title}>{secret ? 'Hidden achievement' : a.title}</p>
                <p className={styles.text}>
                  {secret ? 'Keep exploring. Some doors have no handle.' : a.description}
                </p>
                <p className={styles.meta}>
                  {unlockedAt ? `Unlocked ${dateFormat.format(new Date(unlockedAt))}` : 'Locked'} ·{' '}
                  {a.xp} XP
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => progressStore.reset()}
        className={styles.reset}
      >
        Reset progress
      </Button>
    </div>
  )
}
