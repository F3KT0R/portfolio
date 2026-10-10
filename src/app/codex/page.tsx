import Link from 'next/link'
import { Codex } from '@/features/progress'
import { pageMetadata } from '@/features/seo'
import { gloss } from '@/lib/glossary'
import { routes } from '@/lib/routes'
import { Frame, Kbd, PageHeader, PanelGrid, panelWide } from '@/ui'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Codex',
  description: 'Your achievements on this site, and how the site itself is built.',
  path: routes.codex,
})

export default function CodexPage() {
  return (
    <>
      <PageHeader
        icon="star"
        eyebrow="Codex · your progress"
        title="Codex"
        gloss={gloss.codex}
        lead="You are playing too. Exploring the site unlocks achievements; they live only in this browser and never leave it."
      />
      <PanelGrid>
        <Frame title="Achievements" titleId="achievements" titleAs="h2" className={panelWide}>
          <Codex />
        </Frame>
        <Frame title="Controls" titleId="controls" titleAs="h2">
          <ul className={styles.howto}>
            <li>
              <Kbd>/</Kbd> or <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> opens the command palette.
            </li>
            <li>
              <Kbd>1</Kbd>–<Kbd>6</Kbd> travel between regions.
            </li>
            <li>Attributes, gear and skills open an item card when clicked.</li>
          </ul>
        </Frame>
        <Frame title="About this game" titleId="about-game" titleAs="h2">
          <ul className={styles.howto}>
            <li>Some achievements are hidden. The developer console is a good place to start.</li>
            <li>
              In a hurry? The <Link href={routes.tldr}>TL;DR</Link> has everything on one page.
            </li>
          </ul>
          <p className={styles.build}>
            Built with Next.js, TypeScript and CSS Modules; no game engine, no tracking. Read how in
            the <Link href={routes.quest('character-sheet')}>character sheet quest</Link>.
          </p>
        </Frame>
      </PanelGrid>
    </>
  )
}
