'use client'

import Image from 'next/image'
import { useId, useState, type CSSProperties } from 'react'
import styles from './BeforeAfter.module.css'

type Shot = { src: string; width: number; height: number; alt: string }

type Props = {
  before: Shot
  after: Shot
  beforeLabel: string
  afterLabel: string
}

/**
 * Two screenshots stacked; a range input wipes between them. The input is a
 * real slider (arrow keys, screen readers); without JavaScript the page shows
 * half of each.
 */
export function BeforeAfter({ before, after, beforeLabel, afterLabel }: Props) {
  const [position, setPosition] = useState(50)
  const labelId = useId()

  return (
    <figure className={styles.compare} style={{ '--position': `${position}%` } as CSSProperties}>
      <div className={styles.stage}>
        <Image
          className={styles.image}
          src={before.src}
          width={before.width}
          height={before.height}
          alt={before.alt}
          sizes="(width >= 72rem) 72rem, 100vw"
        />
        <Image
          className={`${styles.image} ${styles.after}`}
          src={after.src}
          width={after.width}
          height={after.height}
          alt={after.alt}
          sizes="(width >= 72rem) 72rem, 100vw"
        />
        <span className={styles.handle} aria-hidden />
        <input
          className={styles.range}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-labelledby={labelId}
          aria-valuetext={`${position}% ${afterLabel.toLowerCase()}`}
        />
      </div>
      <figcaption id={labelId} className={styles.caption}>
        <span>← {beforeLabel}</span>
        <span>{afterLabel} →</span>
      </figcaption>
    </figure>
  )
}
