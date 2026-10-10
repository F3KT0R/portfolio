import { routes } from '@/lib/routes'
import { ButtonLink, PixelIcon } from '@/ui'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <PixelIcon name="skull" size={96} className={styles.icon} />
      <p className={styles.code}>404 · Off the map</p>
      <h1 className={styles.title}>You wandered into the fog.</h1>
      <p className={styles.text}>
        There is nothing at this address — no quest, no loot, not even a goblin.
      </p>
      <div className={styles.actions}>
        <ButtonLink href={routes.sheet}>Return to the sheet</ButtonLink>
        <ButtonLink href={routes.quests} variant="secondary">
          Open the quest log
        </ButtonLink>
      </div>
    </div>
  )
}
