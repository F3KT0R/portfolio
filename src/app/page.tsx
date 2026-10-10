import {
  AttributesPanel,
  GuildPanel,
  IdentityCard,
  LanguagesPanel,
  LoadoutPanel,
  TraitsPanel,
} from '@/features/character'
import { testimonials } from '@/content'
import { NpcChatter } from '@/features/npc'
import { FeaturedQuests } from '@/features/quests'
import { CvLink } from '@/features/resume'
import { PersonJsonLd } from '@/features/seo'
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
        <AttributesPanel />
        <LoadoutPanel />
        <TraitsPanel />
        <GuildPanel />
        <LanguagesPanel className={panelWide} />
      </PanelGrid>

      <NpcChatter testimonials={testimonials} />

      <section aria-labelledby="featured-quests">
        <SectionHeading id="featured-quests">Main quests</SectionHeading>
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
