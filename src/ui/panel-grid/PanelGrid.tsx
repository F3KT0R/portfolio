import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './PanelGrid.module.css'

/**
 * The flow every group of panels follows: one column on phones; from 56rem,
 * rows of two panels that share one height. A panel with `panelWide` takes a
 * whole row. Children keep their source order on every screen size.
 */
export function PanelGrid({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  /** `ul` for a list of panels; its children are then <li>s. */
  as?: 'div' | 'ul'
}) {
  return <Tag className={cx(styles.grid, className)}>{children}</Tag>
}

/** Class for a panel that spans the full row of a PanelGrid. */
export const panelWide = styles.wide

/** The flow's rule for lists: an odd last panel takes the whole row instead of half of it. */
export function spansRow(index: number, count: number) {
  return count % 2 === 1 && index === count - 1
}
