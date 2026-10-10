import type { Quest } from '@/content'
import { cx } from '@/lib/cx'
import { PixelIcon, VisuallyHidden } from '@/ui'
import { difficultyLabel, statusLabel } from './quest-meta'
import styles from './QuestBits.module.css'

/** The pennant with the quest's sigil. Decorative: the title carries the meaning. */
export function QuestBanner({ quest, size = 'md' }: { quest: Quest; size?: 'md' | 'lg' }) {
  return (
    <div className={cx(styles.banner, styles[size])} data-kind={quest.kind} aria-hidden>
      <PixelIcon name={quest.sigil} size={size === 'lg' ? 48 : 36} />
    </div>
  )
}

export function QuestStatus({ status }: { status: Quest['status'] }) {
  return (
    <span className={styles.status} data-status={status}>
      {statusLabel[status]}
    </span>
  )
}

export function Difficulty({ value }: { value: number }) {
  return (
    <span className={styles.difficulty} title={`Difficulty: ${difficultyLabel[value]}`}>
      <VisuallyHidden>
        Difficulty {value} of 5, {difficultyLabel[value]}
      </VisuallyHidden>
      {Array.from({ length: 5 }, (_, i) => (
        <PixelIcon key={i} name="skull" size={14} className={i < value ? styles.on : styles.off} />
      ))}
    </span>
  )
}
