import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import styles from './page.module.scss'

import { fetchRepo, fetchRepoReadmeRaw } from '@/lib/github'
import { getShowcaseRepos } from '@/lib/showcase'
import { getRepoCoverUrl } from '@/lib/repo-cover'

export const revalidate = 86400

export async function generateStaticParams() {
  const repos = await getShowcaseRepos()
  return repos.map((r) => ({ owner: r.owner.login, repo: r.name }))
}

export default async function ProjectReadmePage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>
}) {
  const { owner, repo } = await params

  const repoData = await fetchRepo(owner, repo)
  if (!repoData) notFound()

  const readme = await fetchRepoReadmeRaw(owner, repo)
  const cover = getRepoCoverUrl(owner, repo)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.back} href="/projects">
          ← All projects
        </Link>

        <h1 className={styles.title}>{repoData.full_name}</h1>
        {repoData.description ? <p className={styles.desc}>{repoData.description}</p> : null}

        <div className={styles.meta}>
          <span className={styles.pill}>★ {repoData.stargazers_count}</span>
          <span className={styles.pill}>⑂ {repoData.forks_count}</span>
          {repoData.language ? <span className={styles.pill}>{repoData.language}</span> : null}
          {repoData.private ? <span className={styles.pill}>Private</span> : null}
        </div>

        <div className={styles.actions}>
          <a className={styles.action} href={repoData.html_url} target="_blank" rel="noreferrer">
            Repo
          </a>
          {repoData.homepage ? (
            <a className={styles.action} href={repoData.homepage} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
        </div>
      </header>

      <div className={styles.cover}>
        <Image
          src={cover}
          alt={`${repoData.name} preview`}
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </div>

      <article className={styles.content}>
        {readme ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
        ) : (
          <p>
            No README found for this repository. View it on{' '}
            <a href={repoData.html_url} target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
        )}
      </article>
    </div>
  )
}
