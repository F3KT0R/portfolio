import styles from './page.module.scss'
import { SectionHeader } from '@/components/SectionHeader'
import { ContactForm } from './ContactForm'

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <SectionHeader
        title="Contact"
        subtitle="Reach out via socials, or send a message (Netlify form)."
      />

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Find me</h3>
          <div className={styles.links}>
            <a className={styles.link} href="https://github.com/F3KT0R" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className={styles.link}
              href="https://www.linkedin.com/in/tibor-b%C3%A1lint-a30a11205/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className={styles.link} href="https://www.instagram.com/tibii_b/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>

          <p>
            Prefer email?{' '}
            <a className={styles.link} href="mailto:balinttibornb@gmail.com">
              balinttibornb@gmail.com
            </a>
          </p>
        </div>

        <div className={styles.card}>
          <h3>Send a message</h3>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
