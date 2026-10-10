import { getQuest, quests } from '@/content'
import { kindLabel } from '@/features/quests'
import { ogCard, ogSize } from '@/features/seo'

export const alt = 'Quest journal'
export const size = ogSize
export const contentType = 'image/png'

export function generateStaticParams() {
  return quests.map((quest) => ({ slug: quest.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const quest = getQuest((await params).slug)
  return ogCard({
    eyebrow: quest ? kindLabel[quest.kind] : 'Quest',
    title: quest?.title ?? 'Quest journal',
    subtitle: quest?.epithet ?? '',
  })
}
