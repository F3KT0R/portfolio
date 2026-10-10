import { notFound } from 'next/navigation'
import { getQuest, quests } from '@/content'
import { QuestJournal } from '@/features/quests'
import { pageMetadata } from '@/features/seo'
import { plainText } from '@/lib/redaction'
import { routes } from '@/lib/routes'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return quests.map((quest) => ({ slug: quest.slug }))
}

export async function generateMetadata({ params }: Props) {
  const quest = getQuest((await params).slug)
  if (!quest) return {}
  return pageMetadata({
    title: `${quest.title} — ${quest.epithet}`,
    description: plainText(quest.summary),
    path: routes.quest(quest.slug),
  })
}

export default async function QuestPage({ params }: Props) {
  const quest = getQuest((await params).slug)
  if (!quest) notFound()
  return <QuestJournal quest={quest} />
}
