'use client'

import { useMemo, useState } from 'react'
import styles from './page.module.scss'

type Status = 'idle' | 'sending' | 'success' | 'error'

function encodeFormData(form: HTMLFormElement) {
  const formData = new FormData(form)
  return new URLSearchParams(formData as unknown as Record<string, string>).toString()
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorText, setErrorText] = useState<string>('')

  const disabled = useMemo(() => status === 'sending', [status])

  return (
    <>
      <form
        className={styles.form}
        name="contact"
        method="POST"
        action="/__forms.html"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={async (e) => {
          e.preventDefault()
          setStatus('sending')
          setErrorText('')

          const form = e.currentTarget

          try {
            const body = encodeFormData(form)
            const res = await fetch('/__forms.html', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body,
            })

            if (!res.ok) {
              throw new Error(`Form submit failed (${res.status})`)
            }

            form.reset()
            setStatus('success')
          } catch (err) {
            setStatus('error')
            setErrorText(err instanceof Error ? err.message : 'Something went wrong')
          }
        }}
      >
        <input type="hidden" name="form-name" value="contact" />
        <p style={{ display: 'none' }}>
          <label>
            Don’t fill this out: <input name="bot-field" />
          </label>
        </p>

        <label className={styles.label}>
          Name
          <input className={styles.input} name="name" required disabled={disabled} />
        </label>

        <label className={styles.label}>
          Email
          <input className={styles.input} name="email" type="email" required disabled={disabled} />
        </label>

        <label className={styles.label}>
          Message
          <textarea className={styles.textarea} name="message" required disabled={disabled} />
        </label>

        <button className={styles.button} type="submit" disabled={disabled}>
          {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent!' : 'Send'}
        </button>

        {status === 'success' ? (
          <p className={styles.notice} role="status">
            Message sent — I’ll reply as soon as I can.
          </p>
        ) : null}

        {status === 'error' ? (
          <p className={styles.notice} role="alert">
            Submission failed. {errorText ? `(${errorText})` : ''}
          </p>
        ) : null}
      </form>
    </>
  )
}
