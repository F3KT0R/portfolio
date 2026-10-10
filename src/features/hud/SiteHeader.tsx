import Link from 'next/link'
import { character } from '@/content'
import { CommandPalette } from '@/features/command-palette'
import { ProgressMeter } from '@/features/progress'
import { ThemeToggle } from '@/features/theme'
import { levelFromCareer } from '@/game'
import { routes } from '@/lib/routes'
import { PixelIcon } from '@/ui'
import { NavHotbar } from './NavHotbar.client'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  const { level } = levelFromCareer(character.careerStart, new Date())

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href={routes.sheet}
          className={styles.brand}
          aria-label={`${character.name}, character sheet`}
        >
          <PixelIcon name="shield" size={24} className={styles.crest} />
          <span className={styles.brandName}>TIBOR.B</span>
          <span className={styles.level} aria-hidden>
            LV {level}
          </span>
        </Link>

        <NavHotbar />

        <div className={styles.actions}>
          <div className={styles.progress}>
            <ProgressMeter />
          </div>
          <CommandPalette />
          <ThemeToggle />
          <Link href={routes.tldr} className={styles.skip}>
            TL;DR
          </Link>
        </div>
      </div>
    </header>
  )
}
