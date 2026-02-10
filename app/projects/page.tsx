import { SectionHeader } from '@/components/SectionHeader'
import { ProjectCard } from '@/components/ProjectCard'
import { getShowcaseRepos } from '@/lib/showcase'
import styles from './page.module.scss'

export default async function ProjectsPage() {
  const repos = await getShowcaseRepos()

  return (
    <div className={styles.page}>
      <SectionHeader
        title="Projects"
        subtitle="Dynamic list pulled from GitHub. Each project page renders the repo README as a case study."
      />

      {repos.length === 0 ? (
        <div className={styles.empty}>
          <h3 className={styles.emptyTitle}>Projects unavailable right now</h3>
          <p className={styles.emptyText}>
            GitHub API requests can be rate-limited (especially without a token). Add{' '}
            <strong>GITHUB_TOKEN</strong> for higher limits, or set <strong>SHOWCASE_REPOS</strong>{' '}
            to a curated list like <strong>F3KT0R/watchflix,F3KT0R/portfolio</strong>.
          </p>
        </div>
      ) : null}

      <div className={styles.grid}>
        {repos.map((repo) => (
          <ProjectCard
            key={repo.full_name}
            repo={repo}
          />
        ))}
      </div>
    </div>
  )
}
