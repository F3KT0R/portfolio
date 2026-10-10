import Link from 'next/link'
import { getQuest, type Testimonial } from '@/content'
import { cx } from '@/lib/cx'
import { routes } from '@/lib/routes'
import { PanelGrid, panelWide, SectionHeading, spansRow } from '@/ui'
import styles from './NpcDialogue.module.css'

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

/** One quote, as an RPG dialogue box: who speaks, what they said, verbatim. */
export function NpcDialogue({
  testimonial,
  showQuest = true,
  className,
}: {
  testimonial: Testimonial
  showQuest?: boolean
  className?: string
}) {
  const quest = testimonial.quest ? getQuest(testimonial.quest) : undefined

  return (
    <figure className={cx(styles.box, className)}>
      <div className={styles.portrait} aria-hidden>
        {initials(testimonial.speaker)}
      </div>
      <div className={styles.body}>
        <figcaption className={styles.speaker}>
          <span className={styles.name}>{testimonial.speaker}</span>
          <span className={styles.role}>{testimonial.role}</span>
        </figcaption>
        <blockquote className={styles.quote}>
          <p>{testimonial.quote}</p>
        </blockquote>
        {showQuest && quest ? (
          <p className={styles.quest}>
            On <Link href={routes.quest(quest.slug)}>{quest.title}</Link>
          </p>
        ) : null}
      </div>
      <span className={styles.next} aria-hidden>
        ▼
      </span>
    </figure>
  )
}

/** A titled group of dialogues in the panel flow. Renders nothing when empty. */
export function NpcChatter({
  testimonials,
  title = 'What the party says',
  showQuest = true,
}: {
  testimonials: Testimonial[]
  title?: string
  showQuest?: boolean
}) {
  if (testimonials.length === 0) return null
  return (
    <section aria-labelledby="npc-chatter">
      <SectionHeading id="npc-chatter">{title}</SectionHeading>
      <PanelGrid>
        {testimonials.map((t, index) => (
          <NpcDialogue
            key={t.id}
            testimonial={t}
            showQuest={showQuest}
            className={spansRow(index, testimonials.length) ? panelWide : undefined}
          />
        ))}
      </PanelGrid>
    </section>
  )
}
