import type { CSSProperties } from 'react'
import { splitRedactions } from '@/lib/redaction'
import styles from './RedactedText.module.css'

/** Text with `[[redacted:N]]` marks drawn as black bars, read out as "redacted". */
export function RedactedText({ children }: { children: string }) {
  return (
    <>
      {splitRedactions(children).map((segment, i) =>
        segment.kind === 'text' ? (
          segment.text
        ) : (
          <span
            key={i}
            className={styles.bar}
            style={{ '--chars': segment.width } as CSSProperties}
            role="img"
            aria-label="redacted"
            title="Classified — under NDA"
          />
        ),
      )}
    </>
  )
}
