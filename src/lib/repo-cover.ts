import type { GitHubRepo } from '@/lib/github'

const LOCAL_COVERS: Record<string, string> = {
  // Keep this small and explicit; everything else falls back to GitHub OG.
  watchflix: '/images/watchflix.png',
  portfolio: '/images/portfolio.png',
  'tax-calculator': '/images/tax-calculator.png',
  'income-tax-calculator': '/images/tax-calculator.png',
  'watchflix-2.0': '/images/watchflix2.0.png',
  'medieval-fort': '/images/medieval_fort.png',
}

export function getRepoCoverUrl(owner: string, repo: string) {
  const local = LOCAL_COVERS[repo]
  if (local) return local

  // GitHub OpenGraph preview image (works without extra API calls).
  // The "token" segment can be any string; changing it busts caches.
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`
}

export function getRepoCoverUrlFor(repo: Pick<GitHubRepo, 'name' | 'owner'>) {
  return getRepoCoverUrl(repo.owner.login, repo.name)
}
