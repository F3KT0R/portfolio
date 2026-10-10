import type { MetadataRoute } from 'next'
import { quests } from '@/content'
import { primaryNav, routes } from '@/lib/routes'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...primaryNav.map((n) => n.href),
    routes.tldr,
    ...quests.map((q) => routes.quest(q.slug)),
  ]
  return paths.map((path) => ({ url: new URL(path, site.url).toString() }))
}
