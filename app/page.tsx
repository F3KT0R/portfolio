import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.scss'

import { SectionHeader } from '@/components/SectionHeader'
import { ProjectCard } from '@/components/ProjectCard'
import { getFeaturedRepos } from '@/lib/showcase'
import experience from '@content/experience.json'

type ExperienceItem = {
  title: string
  year: string
  role: string
  address: string
  link: string
  summary?: string
  tags?: string[]
  impact?: string[]
  highlights: string[]
}

export default async function HomePage() {
  const featured = await getFeaturedRepos()
  const items = experience as ExperienceItem[]
  const current = items[0]

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div>
            <span className={styles.kicker}>Frontend · Angular / React · UI Engineering</span>
            <h1 className={styles.h1}>I build fast, polished web experiences.</h1>
            <p className={styles.lead}>
              I’m Tibor — a frontend developer focused on scalable UI architecture, high-performance
              Next.js apps, and design-forward interfaces. This v2 portfolio is built to showcase
              case studies, not just screenshots.
            </p>

            <div className={styles.ctaRow}>
              <Link className={styles.primary} href="/projects">
                View case studies
              </Link>
              <Link className={styles.secondary} href="/contact">
                Contact
              </Link>
              <a className={styles.secondary} href="/api/download-cv">
                Download CV
              </a>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.profile}>
              <Image
                className={styles.avatar}
                src="/OPT_3084.png"
                alt="Portrait"
                width={168}
                height={168}
                priority
              />
              <div>
                <p className={styles.profileName}>Tibor Balint</p>
                <p className={styles.profileRole}>Frontend Developer · UI Engineering</p>
              </div>
            </div>

            <div className={styles.signal}>
              <div className={styles.metric}>
                <p className={styles.metricTitle}>UI architecture</p>
                <p className={styles.metricText}>Reusable components, scalable patterns</p>
              </div>
              <div className={styles.metric}>
                <p className={styles.metricTitle}>Performance</p>
                <p className={styles.metricText}>Images, LCP, CLS, caching</p>
              </div>
              <div className={styles.metric}>
                <p className={styles.metricTitle}>Shipping</p>
                <p className={styles.metricText}>Netlify + Next builds</p>
              </div>
              <div className={styles.metric}>
                <p className={styles.metricTitle}>Craft</p>
                <p className={styles.metricText}>Design systems + motion with restraint</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {current ? (
        <section className={styles.section}>
          <SectionHeader
            title="Currently"
            subtitle="What I’m doing day-to-day (and the skills I lean on)."
          />

          <div className={styles.currentGrid}>
            <div className={styles.currentCard}>
              <div className={styles.currentTop}>
                <div>
                  <p className={styles.currentRole}>{current.role}</p>
                  <p className={styles.currentCompany}>
                    <a href={current.link} target="_blank" rel="noreferrer">
                      {current.title}
                    </a>
                    <span className={styles.currentMeta}> · {current.year}</span>
                  </p>
                </div>
                <Link className={styles.currentLink} href="/experience">
                  View timeline
                </Link>
              </div>

              {current.summary ? <p className={styles.currentSummary}>{current.summary}</p> : null}

              {current.tags && current.tags.length > 0 ? (
                <div className={styles.currentTags}>
                  {current.tags.slice(0, 8).map((t) => (
                    <span key={t} className={styles.currentPill}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {current.impact && current.impact.length > 0 ? (
                <div className={styles.currentImpact}>
                  <p className={styles.currentImpactTitle}>Impact</p>
                  <ul className={styles.currentImpactList}>
                    {current.impact.slice(0, 3).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <ul className={styles.currentList}>
                {current.highlights.slice(0, 4).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>

            <div className={styles.currentSide}>
              <div className={styles.card}>
                <h3>What I optimize for</h3>
                <p className={styles.currentSideText}>
                  Maintainable UI systems, thoughtful architecture, and shipping reliably under real constraints.
                </p>
              </div>
              <div className={styles.card}>
                <h3>Signals</h3>
                <p className={styles.currentSideText}>
                  Recent GitHub activity + READMEs power the project pages — so the portfolio stays fresh.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <SectionHeader
          title="Featured"
          subtitle="A few projects with real decisions, tradeoffs, and results."
        />

        <div className={styles.cards}>
          {featured.length === 0 ? (
            <div className={styles.featuredEmpty}>
              <p className={styles.featuredEmptyText}>
                Featured repos are temporarily unavailable (GitHub API rate limit). Add{' '}
                <strong>GITHUB_TOKEN</strong> or configure <strong>SHOWCASE_REPOS</strong>.
              </p>
            </div>
          ) : (
            featured.map((repo) => <ProjectCard key={repo.full_name} repo={repo} />)
          )}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader
          title="What you’ll find"
          subtitle="A portfolio that reads like engineering work, not a gallery."
        />

        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Case studies</h3>
            <p>Problem → constraints → approach → results.</p>
          </div>
          <div className={styles.card}>
            <h3>GitHub signals</h3>
            <p>Stars, languages, and recent activity are pulled server-side.</p>
          </div>
          <div className={styles.card}>
            <h3>Clean IA</h3>
            <p>Projects, experience, about, uses, now, and contact pages.</p>
          </div>
        </div>
      </section>
    </>
  )
}
