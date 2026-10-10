import { character, getQuestsByKind, quests } from '@/content'
import { levelFromCareer } from '@/game'
import styles from './SheetStats.module.css'

/**
 * The five-second read for someone who does not care about the game: big
 * numbers in plain words, all counted from content so they never go stale.
 */
export function SheetStats() {
  const { level } = levelFromCareer(character.careerStart, new Date())
  const stats = [
    { value: `${level}+`, label: 'years building software professionally' },
    { value: String(getQuestsByKind('main').length), label: 'client & business projects' },
    { value: String(quests.length), label: 'projects in the quest log' },
    { value: String(character.languages.length), label: 'languages spoken' },
  ]

  return (
    <dl className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <dt className={styles.label}>{stat.label}</dt>
          <dd className={styles.value}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
