import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Stamp.module.css'

/** A rubber stamp across a panel's corner, e.g. "Classified". */
export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.stamp, className)}>{children}</span>
}
