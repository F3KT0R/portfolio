import { PlaystyleList } from '@/features/playstyle'
import { pageMetadata } from '@/features/seo'
import { gloss } from '@/lib/glossary'
import { routes } from '@/lib/routes'
import { PageHeader } from '@/ui'

export const metadata = pageMetadata({
  title: 'Playstyle — how I work',
  description:
    'How Tibor works: quality first in review, done means tested and verified, requirements confirmed, ideas explained at every level, AI as a tool.',
  path: routes.playstyle,
})

export default function PlaystylePage() {
  return (
    <>
      <PageHeader
        icon="sword"
        eyebrow="Playstyle · in my own words"
        title="Playstyle"
        gloss={gloss.playstyle}
        lead="Five habits, each in my words, with what it looks like in real work and where you can check it."
      />
      <PlaystyleList />
    </>
  )
}
