import { character } from '@/content'
import { RecruitForm } from '@/features/recruit'
import { CvLink } from '@/features/resume'
import { pageMetadata } from '@/features/seo'
import { routes } from '@/lib/routes'
import { site } from '@/lib/site'
import { Frame, PageHeader, PanelGrid, panelWide } from '@/ui'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Recruit',
  description: 'Hiring, or have a project in mind? Send Tibor a message.',
  path: routes.recruit,
})

export default function RecruitPage() {
  return (
    <>
      <PageHeader
        icon="flag"
        eyebrow={character.status.available ? 'Recruit · available' : 'Recruit'}
        title="Recruit to your party"
        lead="A role, a freelance build or a collaboration: tell me what you are working on and where I could help."
      />
      <PanelGrid>
        <Frame title="Send a raven" titleId="send" titleAs="h2" className={panelWide}>
          <RecruitForm />
        </Frame>
        <Frame title="Other roads" titleId="other" titleAs="h2" className={panelWide}>
          <ul className={styles.roads}>
            <li>
              <span className={styles.roadLabel}>E-mail</span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <span className={styles.roadLabel}>LinkedIn</span>
              <a href={site.links.linkedin}>Tibor Bálint</a>
            </li>
            <li>
              <span className={styles.roadLabel}>GitHub</span>
              <a href={site.links.github}>F3KT0R</a>
            </li>
            <li>
              <span className={styles.roadLabel}>Based in</span>
              {character.origin} · {character.timezone}
            </li>
          </ul>
          <CvLink size="sm" />
        </Frame>
      </PanelGrid>
    </>
  )
}
