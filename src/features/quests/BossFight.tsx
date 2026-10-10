import type { Quest } from '@/content'
import { gloss } from '@/lib/glossary'
import { Frame, Meter, PanelGrid, PixelIcon } from '@/ui'
import styles from './BossFight.module.css'

type Boss = NonNullable<Quest['boss']>

const rounds: { key: keyof Omit<Boss, 'name'>; label: string }[] = [
  { key: 'symptom', label: 'It appears' },
  { key: 'hunt', label: 'The hunt' },
  { key: 'fix', label: 'The final blow' },
  { key: 'lesson', label: 'Loot' },
]

/** The quest's hardest bug, told as an encounter. The HP bar is empty: it was beaten. */
export function BossFight({ boss }: { boss: Boss }) {
  return (
    <Frame title="Boss fight" gloss={gloss.boss} titleId="boss" rarity="legendary" meta="defeated">
      <div className={styles.head}>
        <PixelIcon name="skull" size={48} className={styles.skull} />
        <div className={styles.nameplate}>
          <p className={styles.name}>{boss.name}</p>
          <Meter
            value={0}
            max={100}
            segments={20}
            tone="legendary"
            size="sm"
            label={`${boss.name} health`}
            valueText="0 HP — defeated"
          />
          <p className={styles.hp} aria-hidden>
            HP 0 / 100 · defeated
          </p>
        </div>
      </div>
      <PanelGrid as="ul">
        {rounds.map((round, index) => (
          <li key={round.key} className={styles.round}>
            <p className={styles.label}>
              Round {index + 1} · {round.label}
            </p>
            <p>{boss[round.key]}</p>
          </li>
        ))}
      </PanelGrid>
    </Frame>
  )
}
