export type GitHubRepo = {
  name: string
  full_name: string
  private: boolean
  fork: boolean
  archived: boolean
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
  homepage?: string | null
  owner: {
    login: string
    html_url: string
  }
}

function headers() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // Some environments/proxies are stricter when a UA is missing.
    'User-Agent': 'portfolio-v2',
  }
  const token = process.env.GITHUB_TOKEN
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

export async function fetchRepo(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: headers(),
    next: { revalidate: 60 * 60 * 24 },
  })

  if (!res.ok) return null
  return (await res.json()) as GitHubRepo
}

export async function fetchUserRepos(owner: string) {
  const res = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`, {
    headers: headers(),
    next: { revalidate: 60 * 60 * 24 },
  })
  if (!res.ok) return []
  return (await res.json()) as GitHubRepo[]
}

export async function fetchAuthenticatedRepos() {
  const res = await fetch(
    'https://api.github.com/user/repos?per_page=100&sort=updated&visibility=all&affiliation=owner',
    {
      headers: headers(),
      next: { revalidate: 60 * 60 * 24 },
    }
  )
  if (!res.ok) return []
  return (await res.json()) as GitHubRepo[]
}

export async function fetchRepoReadmeRaw(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    headers: {
      ...headers(),
      Accept: 'application/vnd.github.raw',
    },
    next: { revalidate: 60 * 60 * 24 },
  })

  if (!res.ok) return null
  return await res.text()
}
