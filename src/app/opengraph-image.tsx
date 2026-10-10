import { character } from '@/content'
import { ogCard, ogSize } from '@/features/seo'

export const alt = `${character.name} — ${character.className}`
export const size = ogSize
export const contentType = 'image/png'

export default function Image() {
  return ogCard({
    eyebrow: 'Character sheet',
    title: character.name,
    subtitle: `${character.className} · ${character.specialization}`,
  })
}
