import type { MetadataRoute } from 'next'
import { getShowcaseRepos } from '@/lib/showcase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://tibor-balint.netlify.app'

  const staticRoutes = ['', '/projects', '/experience', '/about', '/uses', '/now', '/contact']

  const repos = await getShowcaseRepos()
  const projectRoutes = repos.map((r) => `/projects/${r.owner.login}/${r.name}`)

  return [...staticRoutes, ...projectRoutes].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }))
}
