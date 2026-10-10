import Link from 'next/link'
import { chronicle, getQuest, getSkill, type ChronicleEntry } from '@/content'
import { formatPeriod } from '@/lib/dates'
import type { IconName } from '@/lib/icon-names'
import { routes } from '@/lib/routes'
import { PixelIcon, Tag, TagList } from '@/ui'
import styles from './Timeline.module.css'

const kindMeta: Record<ChronicleEntry['kind'], { label: string; icon: IconName }> = {
  work: { label: 'Guild', icon: 'shield' },
  freelance: { label: 'Mercenary contract', icon: 'sword' },
  venture: { label: 'Own stronghold', icon: 'chest' },
  education: { label: 'Academy', icon: 'scroll' },
}

/** The career as chapters, newest first. Each chapter links the quests it produced. */
export function Timeline() {
  return (
    <ol className={styles.timeline}>
      {chronicle.map((entry, index) => {
        const meta = kindMeta[entry.kind]
        const chapter = chronicle.length - index
        return (
          <li key={entry.id} className={styles.entry} data-kind={entry.kind}>
            <div className={styles.marker} aria-hidden>
              <PixelIcon name={meta.icon} size={24} />
            </div>
            <article className={styles.body}>
              <p className={styles.kicker}>
                Chapter {chapter} · {meta.label} · {formatPeriod(entry.start, entry.end)}
              </p>
              <h2 className={styles.org}>
                {entry.url ? (
                  <a href={entry.url} target="_blank" rel="noreferrer">
                    {entry.org}
                  </a>
                ) : (
                  entry.org
                )}
              </h2>
              <p className={styles.role}>
                {entry.role} · {entry.place}
              </p>
              <p className={styles.summary}>{entry.summary}</p>
              <ul className={styles.highlights}>
                {entry.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              {entry.quests.length > 0 ? (
                <p className={styles.quests}>
                  Quests:{' '}
                  {entry.quests
                    .flatMap((slug) => getQuest(slug) ?? [])
                    .map((q, i) => (
                      <span key={q.slug}>
                        {i > 0 ? ', ' : null}
                        <Link href={routes.quest(q.slug)}>{q.title}</Link>
                      </span>
                    ))}
                </p>
              ) : null}
              {entry.skills.length > 0 ? (
                <TagList label="Skills">
                  {entry.skills
                    .flatMap((id) => getSkill(id) ?? [])
                    .map((skill) => (
                      <li key={skill.id}>
                        <Tag rarity={skill.rarity} href={routes.skill(skill.id)}>
                          {skill.name}
                        </Tag>
                      </li>
                    ))}
                </TagList>
              ) : null}
            </article>
          </li>
        )
      })}
    </ol>
  )
}
