import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { Rarity } from '@/lib/rarity'
import styles from './Frame.module.css'

type Props<T extends ElementType> = {
  as?: T
  /** Label in the frame's title bar. */
  title?: ReactNode
  /** The plain-language meaning of a game term in the title, e.g. "strengths". */
  gloss?: string
  /** Small text at the right end of the title bar. */
  meta?: ReactNode
  /** Id for the title, so a <section> can be labelled by it. */
  titleId?: string
  titleAs?: 'h2' | 'h3' | 'p'
  /** Tints the rivets and title bar with a rarity colour. */
  rarity?: Rarity
  variant?: 'panel' | 'inset'
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'title' | 'children' | 'className'>

/**
 * The window every panel lives in: a hard double border, pixel rivets on the
 * corners and an optional title bar. It is the one visual signature of the
 * site, so nothing else draws borders like it.
 */
export function Frame<T extends ElementType = 'section'>({
  as,
  title,
  gloss,
  meta,
  titleId,
  titleAs: TitleTag = 'h2',
  rarity,
  variant = 'panel',
  className,
  children,
  ...rest
}: Props<T>) {
  const Tag: ElementType = as ?? 'section'
  return (
    <Tag
      className={cx(styles.frame, styles[variant], className)}
      data-rarity={rarity}
      aria-labelledby={title && titleId && Tag === 'section' ? titleId : undefined}
      {...rest}
    >
      {title ? (
        <div className={styles.bar}>
          <TitleTag id={titleId} className={styles.title}>
            {title}
            {gloss ? <span className={styles.gloss}> · {gloss}</span> : null}
          </TitleTag>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
        </div>
      ) : null}
      <div className={styles.body}>{children}</div>
    </Tag>
  )
}
