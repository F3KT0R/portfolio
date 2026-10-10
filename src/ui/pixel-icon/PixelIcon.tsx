import type { IconName } from '@/lib/icon-names'
import { cx } from '@/lib/cx'
import { ICON_SIZE, icons } from '../icons'
import styles from './PixelIcon.module.css'

type Props = {
  name: IconName
  /** Rendered size in CSS pixels; multiples of 12 stay crisp. */
  size?: number
  /** Accessible name. Without one the icon is decorative and hidden from assistive tech. */
  label?: string
  className?: string
}

/** One <path> per tone keeps the SVG tiny: every pixel is an `h1v1h-1z` run. */
function toPath(grid: readonly string[], tone: '#' | 'o') {
  let d = ''
  grid.forEach((row, y) => {
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

export function PixelIcon({ name, size = 24, label, className }: Props) {
  const grid = icons[name]
  return (
    <svg
      className={cx(styles.icon, className)}
      viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path className={styles.shade} d={toPath(grid, 'o')} />
      <path d={toPath(grid, '#')} />
    </svg>
  )
}
