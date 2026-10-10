import Image from 'next/image'
import type { ReactNode } from 'react'
import { character } from '@/content'
import { levelFromCareer, XP_PER_LEVEL } from '@/game'
import { routes } from '@/lib/routes'
import { ButtonLink, Frame, Meter } from '@/ui'
import styles from './IdentityCard.module.css'

const nextLevelFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** The top of the sheet: who, what class, what level, and whether recruitable. */
export function IdentityCard({ actions }: { actions?: ReactNode }) {
  const level = levelFromCareer(character.careerStart, new Date())

  return (
    <Frame as="header" className={styles.card}>
      <div className={styles.layout}>
        <div className={styles.portraitWrap}>
          <Image
            className={styles.portrait}
            src="/media/portrait.webp"
            alt={`Portrait of ${character.name}`}
            width={240}
            height={240}
            priority
          />
          <span className={styles.levelBadge} aria-hidden>
            LV {level.level}
          </span>
        </div>

        <div className={styles.identity}>
          <p className={styles.handle}>@{character.handle}</p>
          <h1 className={styles.name}>{character.name}</h1>
          <p className={styles.class}>
            <span className={styles.className}>{character.className}</span>
            <span className={styles.spec}>{character.specialization}</span>
          </p>

          <div className={styles.xp}>
            <div className={styles.xpLabel}>
              <span>
                Level {level.level} · {level.xp} / {XP_PER_LEVEL} XP
              </span>
              <span className={styles.xpNext}>
                LV {level.level + 1} on {nextLevelFormat.format(level.nextLevelOn)}
              </span>
            </div>
            <Meter
              value={level.xp}
              max={XP_PER_LEVEL}
              label={`Experience towards level ${level.level + 1}`}
              valueText={`${level.xp} of ${XP_PER_LEVEL} XP; one level per year of professional software work`}
            />
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Status</dt>
              <dd className={character.status.available ? styles.available : undefined}>
                {character.status.label}
              </dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>
                {character.origin} · {character.timezone}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={styles.pitch}>
        {character.pitch.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className={styles.actions}>
        <ButtonLink href={routes.recruit}>Recruit to your party</ButtonLink>
        <ButtonLink href={routes.quests} variant="secondary">
          Open the quest log
        </ButtonLink>
        {actions}
      </div>
    </Frame>
  )
}
