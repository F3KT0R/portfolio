import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { Rarity } from '@/lib/rarity'
import styles from './ItemCard.module.css'

type Props = {
  /** Unique on the page; ties the trigger to its card. */
  id: string
  /** What the visitor clicks: an icon, a slot, a skill name. */
  trigger: ReactNode
  /** Accessible name of the trigger when it has no visible text. */
  triggerLabel?: string
  title: string
  rarity: Rarity
  /** The muted line under the title, e.g. "Epic · Frontend · since 2023". */
  typeLine: string
  children?: ReactNode
  /** Italic line at the bottom, in the tradition of item tooltips. */
  flavor?: string
  triggerClassName?: string
}

/**
 * An RPG item tooltip built on the Popover API: it opens on click or tap, is
 * keyboard and screen-reader accessible, and needs no JavaScript. Browsers
 * with CSS anchor positioning place it next to its trigger; others centre it.
 */
export function ItemCard({
  id,
  trigger,
  triggerLabel,
  title,
  rarity,
  typeLine,
  children,
  flavor,
  triggerClassName,
}: Props) {
  const popoverId = `item-${id}`
  const anchor = { '--anchor': `--${popoverId}` } as CSSProperties

  return (
    <>
      <button
        type="button"
        className={cx(styles.trigger, triggerClassName)}
        popoverTarget={popoverId}
        aria-label={triggerLabel}
        data-rarity={rarity}
        style={anchor}
      >
        {trigger}
      </button>
      <div
        id={popoverId}
        popover="auto"
        className={styles.card}
        data-rarity={rarity}
        style={anchor}
      >
        <p className={styles.title}>{title}</p>
        <p className={styles.type}>{typeLine}</p>
        {children ? <div className={styles.body}>{children}</div> : null}
        {flavor ? <p className={styles.flavor}>“{flavor}”</p> : null}
      </div>
    </>
  )
}
