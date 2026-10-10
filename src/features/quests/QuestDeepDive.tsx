import type { Quest } from '@/content'
import { cx } from '@/lib/cx'
import { gloss } from '@/lib/glossary'
import { Frame, PanelGrid, panelWide, PixelIcon, SectionHeading, spansRow } from '@/ui'
import styles from './QuestDeepDive.module.css'

// The sections written for engineers: how the system fits together, what was
// traded for what, and where to start reading the code.

/** The system as tiers joined by arrows: across on wide screens, down on phones. */
export function ArchitectureMap({
  architecture,
}: {
  architecture: NonNullable<Quest['architecture']>
}) {
  return (
    <Frame title="Map" gloss={gloss.map} titleId="map">
      <ol className={styles.tiers}>
        {architecture.tiers.map((tier) => (
          <li key={tier.label} className={styles.tier}>
            <p className={styles.tierLabel}>{tier.label}</p>
            <ul className={styles.items}>
              {tier.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Frame>
  )
}

/** Each decision with the alternative it beat — and, honestly, what it costs. */
export function Tradeoffs({ tradeoffs }: { tradeoffs: Quest['tradeoffs'] }) {
  return (
    <section aria-labelledby="tradeoffs">
      <SectionHeading id="tradeoffs" gloss={gloss.tradeoffs}>
        Trade-offs
      </SectionHeading>
      <PanelGrid as="ul">
        {tradeoffs.map((t, index) => (
          <li
            key={t.chose}
            className={cx(styles.tradeoff, spansRow(index, tradeoffs.length) && panelWide)}
          >
            <p className={styles.chose}>{t.chose}</p>
            <dl className={styles.reasons}>
              <div>
                <dt>Instead of</dt>
                <dd>{t.over}</dd>
              </div>
              <div>
                <dt>Because</dt>
                <dd>{t.because}</dd>
              </div>
              <div>
                <dt>The cost</dt>
                <dd>{t.cost}</dd>
              </div>
            </dl>
          </li>
        ))}
      </PanelGrid>
    </section>
  )
}

/** Two to four files that say the most, linked at a fixed commit. */
export function CodeTour({ stops }: { stops: Quest['codeTour'] }) {
  return (
    <Frame title="Code tour" gloss={gloss.codeTour} titleId="code-tour">
      <ol className={styles.stops}>
        {stops.map((stop) => (
          <li key={stop.url} className={styles.stop}>
            <PixelIcon name="scroll" size={18} className={styles.stopIcon} />
            <div>
              <a href={stop.url} target="_blank" rel="noreferrer" className={styles.file}>
                {stop.label}
              </a>
              <p className={styles.why}>{stop.why}</p>
            </div>
          </li>
        ))}
      </ol>
    </Frame>
  )
}
