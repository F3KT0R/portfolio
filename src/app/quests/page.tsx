import { quests } from '@/content'
import { QuestLog } from '@/features/quests'
import { pageMetadata } from '@/features/seo'
import { gloss } from '@/lib/glossary'
import { routes } from '@/lib/routes'
import { PageHeader } from '@/ui'

export const metadata = pageMetadata({
  title: 'Quest log',
  description: 'Client builds, small-business shops and side projects — each told as a case study.',
  path: routes.quests,
})

export default function QuestsPage() {
  const completed = quests.filter((q) => q.status === 'completed').length

  return (
    <>
      <PageHeader
        icon="scroll"
        eyebrow={`Quest log · ${quests.length} quests · ${completed} completed`}
        title="Quest log"
        gloss={gloss.quests}
        lead="Projects as quests: who gave them, who was in the party, what had to be done and what it earned. Open one for the full journal."
      />
      <QuestLog />
    </>
  )
}
