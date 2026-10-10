import { getQuestsByKind, questKinds, type Quest } from '@/content'
import { PanelGrid, panelWide, SectionHeading, spansRow } from '@/ui'
import { QuestCard } from './QuestCard'
import { kindHeading } from './quest-meta'
import styles from './QuestLog.module.css'

/** Every quest, grouped by kind. Fully static: no filters to break without JavaScript. */
export function QuestLog() {
  return (
    <div className={styles.log}>
      {questKinds.map((kind) => {
        const list = getQuestsByKind(kind)
        if (list.length === 0) return null
        const heading = kindHeading[kind]
        return (
          <section key={kind} aria-labelledby={`quests-${kind}`} className={styles.section}>
            <SectionHeading id={`quests-${kind}`} gloss={heading.gloss}>
              {heading.title} <span className={styles.count}>({list.length})</span>
            </SectionHeading>
            <p className={styles.lead}>{heading.lead}</p>
            <QuestGrid quests={list} />
          </section>
        )
      })}
    </div>
  )
}

/** The first main quests, for the character sheet. */
export function FeaturedQuests({ limit = 3 }: { limit?: number }) {
  return <QuestGrid quests={getQuestsByKind('main').slice(0, limit)} />
}

/** Quest cards in the panel flow: pairs, with an odd last quest across the row. */
function QuestGrid({ quests }: { quests: Quest[] }) {
  return (
    <PanelGrid as="ul">
      {quests.map((quest, index) => (
        <li key={quest.slug} className={spansRow(index, quests.length) ? panelWide : undefined}>
          <QuestCard quest={quest} />
        </li>
      ))}
    </PanelGrid>
  )
}
