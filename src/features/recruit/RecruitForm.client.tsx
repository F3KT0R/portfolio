'use client'

import { useState, useSyncExternalStore, type FormEvent } from 'react'
import { emitGameEvent } from '@/lib/game-events'
import { site } from '@/lib/site'
import { Button, PixelIcon } from '@/ui'
import { callDays, callWindows, HOME_TIME_ZONE, windowIn } from './call-times'
import { FORM_NAME, HONEYPOT, intents, validateRecruit, type FieldErrors } from './recruit-schema'
import styles from './RecruitForm.module.css'

const ENDPOINT = '/__forms.html'

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}
const readHash = () => window.location.hash

type Status =
  { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'failed'; reason: string }

/**
 * Posts to Netlify Forms. Without JavaScript it is a plain form POST to the
 * same endpoint; with it, the fields are validated first and the result is
 * shown in place.
 */
export function RecruitForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [errors, setErrors] = useState<FieldErrors>({})
  // /recruit#call (the sheet's "Request a call" button) preselects the call option;
  // the browser scrolls to the form, whose id is "call".
  const hash = useSyncExternalStore(subscribeToHash, readHash, () => '')
  const [chosen, setIntent] = useState<string | null>(null)
  const intent = chosen ?? (hash === '#call' ? 'call' : intents[0].value)
  const [days, setDays] = useState<string[]>([])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const result = validateRecruit(Object.fromEntries(data))
    if (!result.ok) {
      setErrors(result.errors)
      const first = Object.keys(result.errors)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setErrors({})
    setStatus({ kind: 'sending' })
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        // The day checkboxes are UI only; their joined value travels as callDays.
        body: new URLSearchParams(
          [...data].filter(([k]) => k !== 'day').map(([k, v]) => [k, String(v)]),
        ).toString(),
      })
      if (!response.ok) throw new Error(`The server answered ${response.status}.`)
      form.reset()
      setDays([])
      setStatus({ kind: 'sent' })
      emitGameEvent('party:recruited')
    } catch (error) {
      setStatus({
        kind: 'failed',
        reason: error instanceof Error ? error.message : 'Unknown error.',
      })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className={styles.sent} role="status">
        <PixelIcon name="heart" size={48} className={styles.sentIcon} />
        <p className={styles.sentTitle}>Party formed.</p>
        <p>Your message is on its way. I will get back to you personally.</p>
      </div>
    )
  }

  const busy = status.kind === 'sending'
  const describe = (field: keyof FieldErrors) => (errors[field] ? `${field}-error` : undefined)

  return (
    <form
      id="call"
      className={styles.form}
      name={FORM_NAME}
      method="POST"
      action={ENDPOINT}
      data-netlify="true"
      netlify-honeypot={HONEYPOT}
      noValidate
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className={styles.honeypot} aria-hidden>
        <label>
          Leave this empty: <input name={HONEYPOT} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <fieldset
        className={styles.intents}
        aria-invalid={errors.intent ? true : undefined}
        aria-describedby={describe('intent')}
      >
        <legend className={styles.label}>What brings you here?</legend>
        {intents.map((option) => (
          <label key={option.value} className={styles.intent}>
            <input
              type="radio"
              name="intent"
              value={option.value}
              required
              checked={intent === option.value}
              onChange={() => setIntent(option.value)}
            />
            <span className={styles.intentText}>
              <span className={styles.intentLabel}>{option.label}</span>
              <span className={styles.intentHint}>{option.hint}</span>
            </span>
          </label>
        ))}
        <FieldError field="intent" errors={errors} />
      </fieldset>

      {intent === 'call' ? (
        <CallPreferences days={days} onDays={setDays} errors={errors} describe={describe} />
      ) : null}

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            className={styles.input}
            name="name"
            autoComplete="name"
            required
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe('name')}
          />
          <FieldError field="name" errors={errors} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>E-mail</span>
          <input
            className={styles.input}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe('email')}
          />
          <FieldError field="email" errors={errors} />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>
          Company or guild <span className={styles.optional}>(optional)</span>
        </span>
        <input className={styles.input} name="company" autoComplete="organization" />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          {intent === 'call' ? 'What would you like to talk about?' : 'The quest'}
        </span>
        <textarea
          className={styles.textarea}
          name="message"
          rows={6}
          required
          placeholder="What are you building, and where could I help?"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe('message')}
        />
        <FieldError field="message" errors={errors} />
      </label>

      <div className={styles.actions}>
        <Button type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Send the raven'}
        </Button>
        {status.kind === 'failed' ? (
          <p className={styles.failed} role="alert">
            It did not go through. {status.reason} Write to{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> instead.
          </p>
        ) : null}
      </div>
    </form>
  )
}

function FieldError({ field, errors }: { field: keyof FieldErrors; errors: FieldErrors }) {
  const message = errors[field]
  return message ? (
    <span id={`${field}-error`} className={styles.error}>
      {message}
    </span>
  ) : null
}

/** Weekdays and a time window in Tibor's zone, shown in the visitor's own time too. */
function CallPreferences({
  days,
  onDays,
  errors,
  describe,
}: {
  days: string[]
  onDays: (days: string[]) => void
  errors: FieldErrors
  describe: (field: keyof FieldErrors) => string | undefined
}) {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const now = new Date()

  return (
    <div className={styles.call}>
      <input type="hidden" name="callDays" value={days.join(',')} />
      <fieldset
        className={styles.choices}
        aria-invalid={errors.callDays ? true : undefined}
        aria-describedby={describe('callDays')}
      >
        <legend className={styles.label}>Which days suit you?</legend>
        <div className={styles.chips}>
          {callDays.map((day) => (
            <label key={day} className={styles.chip}>
              <input
                type="checkbox"
                name="day"
                value={day}
                checked={days.includes(day)}
                onChange={(event) =>
                  onDays(
                    event.target.checked
                      ? callDays.filter((d) => d === day || days.includes(d))
                      : days.filter((d) => d !== day),
                  )
                }
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
        <FieldError field="callDays" errors={errors} />
      </fieldset>

      <fieldset
        className={styles.choices}
        aria-invalid={errors.callTime ? true : undefined}
        aria-describedby={describe('callTime')}
      >
        <legend className={styles.label}>What time of day?</legend>
        <div className={styles.chips}>
          {callWindows.map((window) => {
            const local = windowIn(zone, window.from, window.to, now)
            return (
              <label key={window.value} className={styles.chip}>
                <input type="radio" name="callTime" value={window.value} />
                <span>
                  {window.label} · {String(window.from).padStart(2, '0')}:00–{window.to}:00 CET
                  {local ? <span className={styles.local}> ({local} your time)</span> : null}
                </span>
              </label>
            )
          })}
        </div>
        <FieldError field="callTime" errors={errors} />
      </fieldset>
      <p className={styles.callNote}>
        I’ll reply by e-mail with a time and a call link. Times are in{' '}
        {HOME_TIME_ZONE.split('/')[1]} (Central European Time).
      </p>
    </div>
  )
}
