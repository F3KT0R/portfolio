import { skillIds } from '@/content'
import { pageMetadata } from '@/features/seo'
import { RarityLegend, SkillTree } from '@/features/skills'
import { routes } from '@/lib/routes'
import { PageHeader } from '@/ui'

export const metadata = pageMetadata({
  title: 'Skill tree',
  description: 'Every skill with its tier, the year it was learned and the projects that prove it.',
  path: routes.skills,
})

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        icon="gem"
        eyebrow={`Skill tree · ${skillIds.length} skills · 5 branches`}
        title="Skill tree"
        lead="No self-rated bars. Each skill has a tier and opens a card listing the quests and jobs where it was used — the evidence, not the claim."
        aside={<RarityLegend />}
      />
      <SkillTree />
    </>
  )
}
