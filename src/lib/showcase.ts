import { siteConfig } from '@/site.config'
import type { GitHubRepo } from '@/lib/github'
import { fetchAuthenticatedRepos, fetchRepo, fetchRepoReadmeRaw, fetchUserRepos } from '@/lib/github'

function daysSince(dateIso: string) {
  const now = Date.now()
  const then = Date.parse(dateIso)
  const diff = Math.max(0, now - then)
  return diff / (1000 * 60 * 60 * 24)
}

function score(repo: GitHubRepo) {
  const recencyDays = daysSince(repo.pushed_at)
  const recency = Math.max(0, 120 - recencyDays) // 0..120

  const hasDescription = repo.description ? 10 : 0
  const hasHomepage = repo.homepage ? 6 : 0
  const stars = Math.min(80, repo.stargazers_count * 2)
  const forks = Math.min(30, repo.forks_count * 3)

  const languageBoost = ['TypeScript', 'JavaScript', 'CSS', 'SCSS'].includes(repo.language || '')
    ? 6
    : 0

  return recency + hasDescription + hasHomepage + stars + forks + languageBoost
}

function normalizeRepoList(repos: GitHubRepo[]) {
  const user = siteConfig.githubUser.toLowerCase()

  return repos
    .filter((r) => (r.owner?.login || '').toLowerCase() === user)
    .filter((r) => !r.archived)
    .filter((r) => !r.fork)
    .filter((r) => (siteConfig.includePrivate ? true : !r.private))
    .filter((r) => !siteConfig.showcaseDenylist.has(r.full_name) && !siteConfig.showcaseDenylist.has(r.name))
}

export async function getShowcaseRepos() {
  const repos = siteConfig.includePrivate
    ? await fetchAuthenticatedRepos()
    : await fetchUserRepos(siteConfig.githubUser)

  const normalized = normalizeRepoList(repos)

  async function fetchAllowlistedReposDirectly() {
    if (!siteConfig.showcaseAllowlist || siteConfig.showcaseAllowlist.length === 0) return []

    const parsed = siteConfig.showcaseAllowlist
      .map((full) => full.split('/'))
      .map(([owner, name]) => ({ owner, name }))
      .filter((x) => Boolean(x.owner) && Boolean(x.name))

    const fetched = await Promise.all(parsed.map((x) => fetchRepo(x.owner!, x.name!)))

    return fetched
      .filter((r): r is GitHubRepo => Boolean(r))
      .filter((r) => !r.archived)
      .filter((r) => !r.fork)
      .filter((r) => (siteConfig.includePrivate ? true : !r.private))
      .filter((r) => !siteConfig.showcaseDenylist.has(r.full_name) && !siteConfig.showcaseDenylist.has(r.name))
  }

  if (siteConfig.showcaseAllowlist && siteConfig.showcaseAllowlist.length > 0) {
    const allow = new Set(siteConfig.showcaseAllowlist)
    const base = normalized.length > 0 ? normalized : await fetchAllowlistedReposDirectly()
    const allowed = base.filter((r) => allow.has(r.full_name))

    // Prefer repos with README, but never return an empty list just because
    // README fetching failed (rate limits, API outages, etc.).
    const withReadme = await Promise.all(
      allowed.map(async (r) => {
        try {
          const readme = await fetchRepoReadmeRaw(r.owner.login, r.name)
          return { repo: r, hasReadme: Boolean(readme) }
        } catch {
          return { repo: r, hasReadme: false }
        }
      })
    )

    const preferred = withReadme
      .filter((x) => x.hasReadme)
      .map((x) => x.repo)
      .slice(0, siteConfig.maxShowcase)

    if (preferred.length >= Math.min(siteConfig.maxShowcase, allowed.length)) return preferred

    const fill = allowed
      .filter((r) => !preferred.some((p) => p.full_name === r.full_name))
      .slice(0, Math.max(0, siteConfig.maxShowcase - preferred.length))

    return preferred.concat(fill)
  }

  const sorted = normalized
    .slice()
    .sort((a, b) => score(b) - score(a))
    .slice(0, Math.max(siteConfig.maxShowcase * 2, 24))

  // Prefer repos with README so the case-study page has content, but fall back
  // to the top scored repos if README checks fail.
  const candidates = sorted.slice(0, 18)
  const checked = await Promise.all(
    candidates.map(async (r) => {
      try {
        const readme = await fetchRepoReadmeRaw(r.owner.login, r.name)
        return { repo: r, hasReadme: Boolean(readme) }
      } catch {
        return { repo: r, hasReadme: false }
      }
    })
  )

  const preferred = checked
    .filter((x) => x.hasReadme)
    .map((x) => x.repo)
    .slice(0, siteConfig.maxShowcase)

  if (preferred.length > 0) return preferred

  return sorted.slice(0, siteConfig.maxShowcase)
}

export async function getFeaturedRepos() {
  const repos = await getShowcaseRepos()
  return repos.slice(0, siteConfig.maxFeatured)
}
