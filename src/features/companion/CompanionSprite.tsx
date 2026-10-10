import { SPRITE_HEIGHT, SPRITE_WIDTH, tones, type Companion, type Tone } from '@/game'
import { cx } from '@/lib/cx'
import { palette } from '@/lib/palette'
import styles from './CompanionSprite.module.css'

/** Same run-length trick as PixelIcon: one <path> per tone. */
function toPath(rows: readonly string[], tone: Tone) {
  let d = ''
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== tone) continue
      let run = 1
      while (row[x + run] === tone) run++
      d += `M${x} ${y}h${run}v1h-${run}z`
      x += run - 1
    }
  })
  return d
}

type Props = {
  companion: Companion
  /** CSS pixels per sprite pixel. Integers stay crisp. */
  scale?: number
  /** Accessible name; without one the sprite is decorative. */
  label?: string
  className?: string
}

/**
 * The companion's two frames, stacked. The standing frame shows by default;
 * `data-walking` on any ancestor alternates them (see the CSS).
 */
export function CompanionSprite({ companion, scale, label, className }: Props) {
  return (
    <svg
      className={cx(styles.sprite, className)}
      viewBox={`0 0 ${SPRITE_WIDTH} ${SPRITE_HEIGHT}`}
      width={scale ? SPRITE_WIDTH * scale : undefined}
      height={scale ? SPRITE_HEIGHT * scale : undefined}
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {companion.frames.map((rows, i) => (
        <g key={i} className={i === 0 ? styles.stand : styles.stride}>
          {tones.map((tone) => {
            const d = toPath(rows, tone)
            return d ? <path key={tone} d={d} fill={palette[companion.colors[tone]]} /> : null
          })}
        </g>
      ))}
    </svg>
  )
}
