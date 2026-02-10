'use client'

import { useEffect, useState } from 'react'
import styles from './AccentToggle.module.scss'

type Accent = 'lime' | 'cyan' | 'magenta'

const accents: Accent[] = ['lime', 'cyan', 'magenta']

function setAccent(accent: Accent) {
  document.documentElement.dataset.accent = accent
  localStorage.setItem('accent', accent)
}

export function AccentToggle() {
  const [value, setValue] = useState<Accent>('lime')

  useEffect(() => {
    const current = (document.documentElement.dataset.accent as Accent) || 'lime'
    setValue(current)
  }, [])

  return (
    <div className={styles.wrap} aria-label="Accent theme">
      {accents.map((accent) => (
        <button
          key={accent}
          type="button"
          className={styles.pill}
          onClick={() => {
            setValue(accent)
            setAccent(accent)
          }}
          aria-pressed={value === accent}
          title={`Accent: ${accent}`}
        >
          {accent}
        </button>
      ))}
    </div>
  )
}
