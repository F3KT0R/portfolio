import type { ReactNode } from 'react'
import type { IconName } from '@/lib/icon-names'
import { PixelIcon } from '../pixel-icon/PixelIcon'
import styles from './PageHeader.module.css'

type Props = {
  eyebrow: string
  title: ReactNode
  /** The plain-language meaning of the title's game term, e.g. "projects". */
  gloss?: string
  lead?: ReactNode
  icon?: IconName
  /** Extra content on the right on wide screens: a meter, a filter, actions. */
  aside?: ReactNode
}

/** The one <h1> on every page. */
export function PageHeader({ eyebrow, title, gloss, lead, icon, aside }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <p className={styles.eyebrow}>
          {icon ? <PixelIcon name={icon} size={18} /> : null}
          {eyebrow}
        </p>
        <h1 className={styles.title}>
          {title}
          {gloss ? <span className={styles.gloss}> · {gloss}</span> : null}
        </h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
      </div>
      {aside ? <div className={styles.aside}>{aside}</div> : null}
    </header>
  )
}

/** A heading for a section inside a page, with the same pixel ornament. */
export function SectionHeading({
  id,
  gloss,
  children,
}: {
  id?: string
  /** The plain-language meaning of the heading's game term. */
  gloss?: string
  children: ReactNode
}) {
  return (
    <h2 id={id} className={styles.section}>
      <span>
        {children}
        {gloss ? <span className={styles.gloss}> · {gloss}</span> : null}
      </span>
    </h2>
  )
}
