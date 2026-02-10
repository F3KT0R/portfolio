import styles from './SiteFooter.module.scss'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.small}>
          © {year} Tibor Bálint · Built with Next.js 15
        </div>
        <div className={styles.links}>
          <a className={styles.link} href="https://github.com/F3KT0R" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className={styles.link} href="/api/download-cv">
            Download CV
          </a>
        </div>
      </div>
    </footer>
  )
}
