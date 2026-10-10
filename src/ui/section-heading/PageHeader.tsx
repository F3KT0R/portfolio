import type { ReactNode } from 'react'
import type { IconName } from '@/lib/icon-names'
import { PixelIcon } from '../pixel-icon/PixelIcon'
import styles from './PageHeader.module.css'

type Props = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  icon?: IconName
  /** Extra content on the right on wide screens: a meter, a filter, actions. */
  aside?: ReactNode
}

/** The one <h1> on every page. */
export function PageHeader({ eyebrow, title, lead, icon, aside }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <p className={styles.eyebrow}>
          {icon ? <PixelIcon name={icon} size={18} /> : null}
          {eyebrow}
        </p>
        <h1 className={styles.title}>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  )
}

/** A heading for a section inside a page, with the same pixel ornament. */
export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={styles.section}>
      {children}
    </h2>
  )
}
