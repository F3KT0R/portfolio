import {
  AttributesPanel,
  GuildPanel,
  IdentityCard,
  LanguagesPanel,
  LoadoutPanel,
  LookingForPanel,
  TraitsPanel,
} from '@/features/character'
import { testimonials } from '@/content'
import { NpcChatter } from '@/features/npc'
import { PlaystylePanel } from '@/features/playstyle'
import { FeaturedQuests } from '@/features/quests'
import { CvLink } from '@/features/resume'
import { PersonJsonLd } from '@/features/seo'
import { gloss } from '@/lib/glossary'
import { routes } from '@/lib/routes'
import { ButtonLink, PanelGrid, panelWide, SectionHeading } from '@/ui'
import styles from './page.module.css'

// The XP bar fills day by day; rebuild the page once a day to move it.
export const revalidate = 86400

export default function CharacterSheetPage() {
  return (
    <div className={styles.sheet}>
      <PersonJsonLd />
      <IdentityCard actions={<CvLink />} />

      <PanelGrid>
        <LookingForPanel className={panelWide} />
        <AttributesPanel />
        <LoadoutPanel />
        <TraitsPanel />
        <GuildPanel />
        <PlaystylePanel />
        <LanguagesPanel />
      </PanelGrid>

      <NpcChatter testimonials={testimonials} />

      <section aria-labelledby="featured-quests">
        <SectionHeading id="featured-quests" gloss={gloss.mainQuests}>
          Main quests
        </SectionHeading>
        <FeaturedQuests />
        <div className={styles.more}>
          <ButtonLink href={routes.quests} variant="secondary">
            The full quest log
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
