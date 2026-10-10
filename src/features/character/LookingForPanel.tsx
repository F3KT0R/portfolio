import { character } from '@/content'
import { gloss } from '@/lib/glossary'
import type { IconName } from '@/lib/icon-names'
import { routes } from '@/lib/routes'
import { ButtonLink, Frame, PixelIcon } from '@/ui'
import styles from './LookingForPanel.module.css'

const rows: { key: keyof typeof character.lookingFor; label: string; icon: IconName }[] = [
  { key: 'engagement', label: 'Work', icon: 'sword' },
  { key: 'workplace', label: 'Where', icon: 'map' },
  { key: 'relocation', label: 'Relocation', icon: 'flag' },
  { key: 'start', label: 'Can start', icon: 'bolt' },
]

/** The first thing a recruiter screens on, answered before they have to ask. */
export function LookingForPanel({ className }: { className?: string }) {
  return (
    <Frame
      title="Looking for"
      gloss={gloss.lookingFor}
      titleId="looking-for"
      waypoint="looking-for"
      rarity="uncommon"
      className={className}
    >
      <dl className={styles.grid}>
        {rows.map((row) => (
          <div key={row.key} className={styles.row}>
            <dt className={styles.label}>
              <PixelIcon name={row.icon} size={16} />
              {row.label}
            </dt>
            <dd className={styles.value}>{character.lookingFor[row.key]}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.actions}>
        <ButtonLink href={`${routes.recruit}#call`} size="sm">
          Request a 15-minute call
        </ButtonLink>
      </div>
    </Frame>
  )
}
