import Link from 'next/link'
import { character, chronicle } from '@/content'
import { formatMonth } from '@/lib/dates'
import { routes } from '@/lib/routes'
import { Frame } from '@/ui'
import styles from './ProfilePanels.module.css'

/** Current and freelance allegiances, newest first, from the chronicle. */
export function GuildPanel() {
  const active = chronicle.filter((entry) => !entry.end && entry.kind !== 'education')

  return (
    <Frame title="Guilds" titleId="guilds" meta={<Link href={routes.chronicle}>chronicle →</Link>}>
      <ul className={styles.list}>
        {active.map((entry) => (
          <li key={entry.id} className={styles.guild}>
            <p className={styles.guildName}>{entry.org}</p>
            <p className={styles.guildRole}>
              {entry.role} · since {formatMonth(entry.start)}
            </p>
            <p className={styles.note}>{entry.summary}</p>
          </li>
        ))}
      </ul>
    </Frame>
  )
}

export function LanguagesPanel({ className }: { className?: string }) {
  return (
    <Frame title="Languages" titleId="languages" className={className}>
      <dl className={styles.pairs}>
        {character.languages.map((lang) => (
          <div key={lang.name}>
            <dt>{lang.name}</dt>
            <dd>{lang.level}</dd>
          </div>
        ))}
      </dl>
    </Frame>
  )
}

export function TraitsPanel() {
  return (
    <Frame title="Traits" titleId="traits" meta="passive">
      <ul className={styles.list}>
        {character.traits.map((trait) => (
          <li key={trait.name}>
            <p className={styles.traitName}>{trait.name}</p>
            <p className={styles.note}>{trait.effect}</p>
          </li>
        ))}
      </ul>
    </Frame>
  )
}
