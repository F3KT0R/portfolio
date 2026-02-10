import styles from './page.module.scss'
import { SectionHeader } from '@/components/SectionHeader'
import experience from '@content/experience.json'

type ExperienceItem = {
  title: string
  year: string
  role: string
  address: string
  link: string
  summary?: string
  tags?: string[]
  impact?: string[]
  highlights: string[]
}

export default function ExperiencePage() {
  const items = experience as ExperienceItem[]

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Experience"
        subtitle="A timeline view — concise, scannable, and linkable."
      />

      <div className={styles.timeline}>
        {items.map((it) => (
          <section key={it.title} className={styles.item}>
            <div className={styles.top}>
              <h3 className={styles.title}>
                <a className={styles.company} href={it.link} target="_blank" rel="noreferrer">
                  {it.title}
                </a>
              </h3>
              <div className={styles.when}>{it.year}</div>
            </div>

            <div className={styles.subhead}>
              <span className={styles.role}>{it.role}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.meta}>{it.address}</span>
            </div>

            {it.summary ? <p className={styles.summary}>{it.summary}</p> : null}

            {it.tags && it.tags.length > 0 ? (
              <div className={styles.tags}>
                {it.tags.slice(0, 10).map((t) => (
                  <span key={t} className={styles.pill}>
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            {it.impact && it.impact.length > 0 ? (
              <div className={styles.impact}>
                <p className={styles.impactTitle}>Impact</p>
                <ul className={styles.impactList}>
                  {it.impact.slice(0, 4).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ul className={styles.list}>
              {it.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
