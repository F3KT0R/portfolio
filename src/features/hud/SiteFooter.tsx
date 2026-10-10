import Link from 'next/link'
import { routes } from '@/lib/routes'
import { site } from '@/lib/site'
import { Kbd } from '@/ui'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>
          © {new Date().getFullYear()} {site.name} · Portfolio 3.0 ·{' '}
          <a href={`${site.links.github}/portfolio`}>source</a> ·{' '}
          <Link href={routes.playstyle}>how I work</Link>
        </p>
        <p className={styles.line}>
          <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.links.github}>GitHub</a>{' '}
          · <a href={site.links.linkedin}>LinkedIn</a>
        </p>
        <p className={styles.hint}>
          Press <Kbd>/</Kbd> for commands, <Kbd>1</Kbd>–<Kbd>6</Kbd> to travel.
        </p>
      </div>
    </footer>
  )
}
