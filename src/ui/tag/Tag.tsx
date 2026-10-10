import Link from 'next/link'
import type { Route } from 'next'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { Rarity } from '@/lib/rarity'
import styles from './Tag.module.css'

type Props = {
  children: ReactNode
  rarity?: Rarity
  /** Makes the tag a link, e.g. to the skill it names. */
  href?: Route
  className?: string
}

export function Tag({ children, rarity, href, className }: Props) {
  const classes = cx(styles.tag, href && styles.link, className)
  return href ? (
    <Link href={href} className={classes} data-rarity={rarity}>
      {children}
    </Link>
  ) : (
    <span className={classes} data-rarity={rarity}>
      {children}
    </span>
  )
}

export function TagList({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ul className={styles.list} aria-label={label}>
      {children}
    </ul>
  )
}
