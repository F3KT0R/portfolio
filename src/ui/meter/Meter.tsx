import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import type { Rarity } from '@/lib/rarity'
import styles from './Meter.module.css'

type Props = {
  value: number
  max: number
  /** Accessible name, e.g. "Experience to level 4". */
  label: string
  /** Read out instead of the raw numbers, e.g. "340 of 1000 XP". */
  valueText?: string
  segments?: number
  tone?: 'accent' | 'ok' | Rarity
  size?: 'sm' | 'md'
  className?: string
}

/** A segmented bar: XP, quest progress, achievement completion. */
export function Meter({
  value,
  max,
  label,
  valueText,
  segments = 10,
  tone = 'accent',
  size = 'md',
  className,
}: Props) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? (clamped / max) * 100 : 0
  const style = { '--fill': `${percent}%`, '--segments': segments } as CSSProperties

  return (
    <div
      className={cx(styles.meter, styles[size], className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      data-tone={tone}
      style={style}
    >
      <span className={styles.fill} />
    </div>
  )
}
