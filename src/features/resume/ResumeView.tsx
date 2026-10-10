import Link from 'next/link'
import {
  character,
  chronicle,
  getQuestsByKind,
  getSkill,
  rarityMeaning,
  skillIds,
  skills,
} from '@/content'
import { formatPeriod } from '@/lib/dates'
import { plainText } from '@/lib/redaction'
import { routes } from '@/lib/routes'
import { site } from '@/lib/site'
import { CvLink } from './CvLink.client'
import styles from './ResumeView.module.css'

/**
 * The same content as the rest of the site, without the game: one scannable,
 * printable page for people who have thirty seconds.
 */
export function ResumeView() {
  const core = skillIds.filter((id) => ['legendary', 'epic'].includes(skills[id].rarity))
  const selected = [...getQuestsByKind('main'), ...getQuestsByKind('side')].slice(0, 5)
  const work = chronicle.filter((entry) => entry.kind !== 'education')
  const education = chronicle.filter((entry) => entry.kind === 'education')

  return (
    <article className={styles.resume}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.name}>{character.name}</h1>
          <p className={styles.role}>
            {character.className} — {character.specialization}
          </p>
          <p className={styles.meta}>
            {character.origin} · {character.timezone} · {character.status.label}
          </p>
        </div>
        <ul className={styles.contact}>
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={site.links.github}>github.com/F3KT0R</a>
          </li>
          <li>
            <a href={site.links.linkedin}>LinkedIn</a>
          </li>
        </ul>
      </header>

      <section className={styles.section} aria-labelledby="tldr-summary">
        <h2 id="tldr-summary">Summary</h2>
        {character.pitch.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="tldr-stack">
        <h2 id="tldr-stack">Core stack</h2>
        <p className={styles.inline}>
          {core.map((id, i) => (
            <span key={id}>
              {i > 0 ? ' · ' : null}
              <strong>{skills[id].name}</strong>{' '}
              <span className={styles.muted}>({rarityMeaning[skills[id].rarity]})</span>
            </span>
          ))}
        </p>
        <p className={styles.more}>
          Full, evidence-linked list in the <Link href={routes.skills}>skill tree</Link>.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="tldr-experience">
        <h2 id="tldr-experience">Experience</h2>
        <ul className={styles.entries}>
          {work.map((entry) => (
            <li key={entry.id}>
              <p className={styles.entryHead}>
                <strong>{entry.role}</strong> · {entry.org}
                <span className={styles.when}>{formatPeriod(entry.start, entry.end)}</span>
              </p>
              <ul className={styles.bullets}>
                {entry.highlights.slice(0, 4).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="tldr-work">
        <h2 id="tldr-work">Selected work</h2>
        <ul className={styles.entries}>
          {selected.map((quest) => (
            <li key={quest.slug}>
              <p className={styles.entryHead}>
                <Link href={routes.quest(quest.slug)}>
                  <strong>{quest.title}</strong>
                </Link>{' '}
                · {quest.role}
                <span className={styles.when}>{formatPeriod(quest.start, quest.end)}</span>
              </p>
              <p>{plainText(quest.summary)}</p>
              <p className={styles.stackLine}>
                {quest.stack
                  .slice(0, 6)
                  .flatMap((id) => getSkill(id)?.name ?? [])
                  .join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="tldr-education">
        <h2 id="tldr-education">Education</h2>
        {education.map((entry) => (
          <p key={entry.id} className={styles.entryHead}>
            <strong>{entry.role}</strong> · {entry.org}
            <span className={styles.when}>{formatPeriod(entry.start, entry.end)}</span>
          </p>
        ))}
      </section>

      <footer className={styles.footer}>
        <CvLink variant="primary">Download the PDF CV</CvLink>
        <Link href={routes.sheet}>← Back to the character sheet</Link>
      </footer>
    </article>
  )
}
