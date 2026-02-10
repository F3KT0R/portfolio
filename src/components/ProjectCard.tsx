import Image from 'next/image'
import Link from 'next/link'
import styles from './ProjectCard.module.scss'
import type { GitHubRepo } from '@/lib/github'
import { getRepoCoverUrlFor } from '@/lib/repo-cover'

export function ProjectCard({
  repo,
}: {
  repo: GitHubRepo & {
    // Optional precomputed card fields
    coverImage?: string | null
    tags?: string[]
  }
}) {
  const cover = repo.coverImage || getRepoCoverUrlFor(repo)

  return (
    <article className={styles.card}>
      <div className={styles.cover}>
        <Image
          src={cover}
          alt={`${repo.name} preview`}
          fill
          sizes="(max-width: 900px) 100vw, 520px"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{repo.name}</h3>
        </div>

        {repo.description ? <p className={styles.desc}>{repo.description}</p> : null}

        <div className={styles.meta}>
          <span className={styles.pill}>★ {repo.stargazers_count}</span>
          <span className={styles.pill}>⑂ {repo.forks_count}</span>
          {repo.language ? <span className={styles.pill}>{repo.language}</span> : null}
          {repo.private ? <span className={styles.pill}>Private</span> : null}
        </div>

        <div className={styles.actions}>
          <Link className={styles.action} href={`/projects/${repo.owner.login}/${repo.name}`}>
            README case study
          </Link>
          <a className={styles.action} href={repo.html_url} target="_blank" rel="noreferrer">
            Repo
          </a>
          {repo.homepage ? (
            <a className={styles.action} href={repo.homepage} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
