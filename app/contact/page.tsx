import styles from './page.module.scss'
import { SectionHeader } from '@/components/SectionHeader'

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
          <form
            className={styles.form}
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p style={{ display: 'none' }}>
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>

            <label className={styles.label}>
              Name
              <input className={styles.input} name="name" required />
            </label>

            <label className={styles.label}>
              Email
              <input className={styles.input} name="email" type="email" required />
            </label>

            <label className={styles.label}>
              Message
              <textarea className={styles.textarea} name="message" required />
            </label>

            <button className={styles.button} type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
