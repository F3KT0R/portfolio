import Link from 'next/link'
import type { Route } from 'next'
import { playstyle } from '@/content'
import { cx } from '@/lib/cx'
import { gloss } from '@/lib/glossary'
import { routes } from '@/lib/routes'
import { Frame, PanelGrid, panelWide, spansRow } from '@/ui'
import styles from './Playstyle.module.css'

/** The sheet's summary: each principle in one line, linking to the full page. */
export function PlaystylePanel({ className }: { className?: string }) {
  return (
    <Frame
      title="Playstyle"
      gloss={gloss.playstyle}
      titleId="playstyle-panel"
      meta={<Link href={routes.playstyle}>read more →</Link>}
      className={className}
    >
      <ul className={styles.summary}>
        {playstyle.map((p) => (
          <li key={p.id}>
            <span className={styles.summaryTitle}>{p.title}.</span> {p.inMyWords}
          </li>
        ))}
      </ul>
    </Frame>
  )
}

/** The full page: each principle in Tibor's words, what it looks like, and where to see it. */
export function PlaystyleList() {
  return (
    <PanelGrid>
      {playstyle.map((p, index) => (
        <Frame
          key={p.id}
          as="article"
          title={p.title}
          titleAs="h2"
          titleId={p.id}
          className={cx(spansRow(index, playstyle.length) && panelWide)}
        >
          <blockquote className={styles.words}>
            <p>{p.inMyWords}</p>
          </blockquote>
          <p className={styles.practice}>{p.inPractice}</p>
          <p className={styles.evidence}>
            See it in:{' '}
            {p.evidence.map((e, i) => (
              <span key={e.href + e.label}>
                {i > 0 ? ' · ' : null}
                <Link href={e.href as Route}>{e.label}</Link>
              </span>
            ))}
          </p>
        </Frame>
      ))}
    </PanelGrid>
  )
}
