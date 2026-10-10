import Link from 'next/link'
import type { ReactNode } from 'react'
import { character, getQuest, playstyle } from '@/content'
import { formatPeriod } from '@/lib/dates'
import { plainText } from '@/lib/redaction'
import { routes } from '@/lib/routes'
import { site } from '@/lib/site'
import { CvLink } from './CvLink.client'
import { cvEducation, cvExperience, cvProjects, cvSkills, cvStack } from './cv-data'
import styles from './ResumeView.module.css'

/**
 * The résumé — on screen at /tldr and, printed, the PDF CV. A two-column A4
 * layout: the story (profile, experience, projects) in the main column, the
 * facts (availability, skills, languages, education) in the sidebar. The
 * source order is header → main → sidebar, so text extraction and screen
 * readers get the story first.
 */
export function ResumeView() {
  const host = new URL(site.url).host

  return (
    <article className={styles.cv}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <h1 className={styles.name}>{character.name}</h1>
          <p className={styles.role}>
            {character.className} · {character.specialization}
          </p>
        </div>
        <ul className={styles.contact} aria-label="Contact">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a href={site.url}>{host}</a>
          </li>
          <li>
            <a href={site.links.github}>github.com/{character.handle}</a>
          </li>
          <li>
            <a href={site.links.linkedin}>LinkedIn</a>
          </li>
          <li>{character.origin}</li>
        </ul>
      </header>

      <div className={styles.columns}>
        <div className={styles.main}>
          <Section id="cv-profile" title="Profile">
            {character.pitch.map((line) => (
              <p key={line} className={styles.profile}>
                {line}
              </p>
            ))}
          </Section>

          <Section id="cv-experience" title="Experience">
            <ol className={styles.entries}>
              {cvExperience().map((entry) => (
                <li key={entry.id} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <h3 className={styles.entryTitle}>{entry.role}</h3>
                    <span className={styles.when}>{formatPeriod(entry.start, entry.end)}</span>
                  </div>
                  <p className={styles.org}>
                    {entry.org} · {entry.place}
                  </p>
                  <ul className={styles.bullets}>
                    {entry.shown.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {entry.quests.length > 0 ? (
                    <p className={styles.projectsLine}>
                      Case study:{' '}
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
                </li>
              ))}
            </ol>
          </Section>

          <Section id="cv-projects" title="Selected projects">
            <ol className={styles.entries}>
              {cvProjects().map((quest) => (
                <li key={quest.slug} className={styles.entry}>
                  <div className={styles.entryHead}>
                    <h3 className={styles.entryTitle}>
                      <Link href={routes.quest(quest.slug)}>{quest.title}</Link>
                    </h3>
                    <span className={styles.when}>{formatPeriod(quest.start, quest.end)}</span>
                  </div>
                  <p className={styles.org}>{quest.role}</p>
                  <p className={styles.plain}>{plainText(quest.plain)}</p>
                  <p className={styles.stack}>
                    {cvStack(quest)
                      .map((skill) => skill.name)
                      // A no-break space keeps each dot with the name before it.
                      .join(' · ')}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <aside className={styles.side} aria-label="Details">
          <Section id="cv-looking" title="Looking for">
            <dl className={styles.facts}>
              <dt>Work</dt>
              <dd>{character.lookingFor.engagement}</dd>
              <dt>Where</dt>
              <dd>{character.lookingFor.workplace}</dd>
              <dt>Relocation</dt>
              <dd>{character.lookingFor.relocation}</dd>
              <dt>Can start</dt>
              <dd>{character.lookingFor.start}</dd>
            </dl>
          </Section>

          <Section id="cv-skills" title="Skills">
            <dl className={styles.facts}>
              {cvSkills().map((group) => (
                <div key={group.branch} className={styles.skillGroup}>
                  <dt>{group.label}</dt>
                  <dd>{group.names.join(', ')}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="cv-languages" title="Languages">
            <ul className={styles.plainList}>
              {character.languages.map((lang) => (
                <li key={lang.name}>
                  {lang.name} <span className={styles.muted}>— {lang.level}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="cv-education" title="Education">
            {cvEducation().map((entry) => (
              <div key={entry.id} className={styles.education}>
                <p className={styles.entryTitle}>{entry.role}</p>
                <p className={styles.org}>{entry.org}</p>
                <p className={styles.when}>{formatPeriod(entry.start, entry.end)}</p>
              </div>
            ))}
          </Section>

          <Section id="cv-how" title="How I work">
            <ul className={styles.plainList}>
              {playstyle.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          </Section>
        </aside>
      </div>

      <footer className={styles.footer}>
        <CvLink variant="primary">Download the PDF CV</CvLink>
        <Link href={routes.playstyle}>How I work, in full</Link>
        <Link href={routes.sheet}>← Back to the character sheet</Link>
      </footer>
    </article>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <h2 id={id} className={styles.sectionTitle}>
        {title}
      </h2>
      {children}
    </section>
  )
}
