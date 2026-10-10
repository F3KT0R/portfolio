import Link from 'next/link'
import { getSkill, getTestimonialsForQuest, quests, rarityMeaning, type Quest } from '@/content'
import { NpcChatter } from '@/features/npc'
import { formatPeriod } from '@/lib/dates'
import { routes } from '@/lib/routes'
import { cx } from '@/lib/cx'
import {
  ButtonAnchor,
  Frame,
  PanelGrid,
  panelWide,
  PixelIcon,
  RedactedText,
  SectionHeading,
  spansRow,
  Stamp,
  Tag,
  TagList,
} from '@/ui'
import { BossFight } from './BossFight'
import { QuestScreens } from './QuestScreens'
import { Difficulty, QuestBanner, QuestStatus } from './QuestBits'
import { kindLabel } from './quest-meta'
import styles from './QuestJournal.module.css'

/** A quest's own page: the case study, told as objectives, rewards and a journal. */
export function QuestJournal({ quest }: { quest: Quest }) {
  const index = quests.findIndex((q) => q.slug === quest.slug)
  const previous = quests[index - 1]
  const next = quests[index + 1]
  const stack = quest.stack.flatMap((id) => getSkill(id) ?? [])

  return (
    <article className={styles.journal}>
      <header className={styles.header}>
        <QuestBanner quest={quest} size="lg" />
        <div className={styles.heading}>
          <p className={styles.kicker}>
            <Link href={routes.quests}>Quest log</Link> / {kindLabel[quest.kind]}
          </p>
          <h1 className={styles.title}>{quest.title}</h1>
          <p className={styles.epithet}>{quest.epithet}</p>
          <div className={styles.badges}>
            <QuestStatus status={quest.status} />
            {quest.classified ? <Stamp>Classified · under NDA</Stamp> : null}
            <Difficulty value={quest.difficulty} />
          </div>
        </div>
      </header>

      <p className={styles.summary}>
        <RedactedText>{quest.summary}</RedactedText>
      </p>

      {/* The facts first, in the panel flow; the story follows. */}
      <PanelGrid>
        <Frame title="Quest details" titleAs="h2" titleId="details">
          <dl className={styles.details}>
            <div>
              <dt>Quest giver</dt>
              <dd>
                <RedactedText>{quest.giver}</RedactedText>
              </dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>{quest.role}</dd>
            </div>
            <div>
              <dt>When</dt>
              <dd>{formatPeriod(quest.start, quest.end)}</dd>
            </div>
            <div>
              <dt>Party</dt>
              <dd>
                <ul className={styles.party}>
                  {quest.party.map((member) => (
                    <li key={member.name}>
                      {member.url ? <a href={member.url}>{member.name}</a> : member.name}
                      <span className={styles.partyRole}>
                        {' '}
                        — <RedactedText>{member.role}</RedactedText>
                      </span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <div className={styles.links}>
            {quest.links.live ? (
              <ButtonAnchor href={quest.links.live} target="_blank" rel="noreferrer" size="sm">
                Visit live
              </ButtonAnchor>
            ) : null}
            {quest.links.repo ? (
              <ButtonAnchor
                href={quest.links.repo}
                target="_blank"
                rel="noreferrer"
                size="sm"
                variant="secondary"
              >
                Read the code
              </ButtonAnchor>
            ) : null}
            {quest.links.repoNote ? <p className={styles.note}>{quest.links.repoNote}</p> : null}
          </div>
        </Frame>

        <Frame title="Skills used" titleAs="h2" titleId="skills-used">
          <TagList label="Skills used in this quest">
            {stack.map((skill) => (
              <li key={skill.id}>
                <Tag rarity={skill.rarity} href={routes.skill(skill.id)}>
                  {skill.name}
                  <span className={styles.tier}> · {rarityMeaning[skill.rarity]}</span>
                </Tag>
              </li>
            ))}
          </TagList>
        </Frame>
      </PanelGrid>

      <div className={styles.main}>
        <QuestScreens quest={quest} />

        <section aria-labelledby="objectives">
          <SectionHeading id="objectives">Objectives</SectionHeading>
          <ul className={styles.objectives}>
            {quest.objectives.map((line) => (
              <li key={line}>
                <RedactedText>{line}</RedactedText>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rewards">
          <SectionHeading id="rewards">Rewards</SectionHeading>
          <PanelGrid as="ul">
            {quest.rewards.map((line, index) => (
              <li
                key={line}
                className={cx(styles.reward, spansRow(index, quest.rewards.length) && panelWide)}
              >
                <PixelIcon name="chest" size={18} className={styles.rewardIcon} />
                <span>
                  <RedactedText>{line}</RedactedText>
                </span>
              </li>
            ))}
          </PanelGrid>
        </section>

        {quest.boss ? <BossFight boss={quest.boss} /> : null}

        <NpcChatter
          testimonials={getTestimonialsForQuest(quest.slug)}
          title="Said about this quest"
          showQuest={false}
        />

        {quest.journal.length > 0 ? (
          <section aria-labelledby="journal">
            <SectionHeading id="journal">Journal</SectionHeading>
            <div className={styles.prose}>
              {quest.journal.map((entry) => (
                <section key={entry.heading} className={styles.entry}>
                  <h3>{entry.heading}</h3>
                  {entry.paragraphs.map((p) => (
                    <p key={p}>
                      <RedactedText>{p}</RedactedText>
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <nav className={styles.pager} aria-label="Other quests">
        {previous ? (
          <Link href={routes.quest(previous.slug)} className={styles.pagerLink} rel="prev">
            <span className={styles.pagerLabel}>← Previous quest</span>
            {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={routes.quest(next.slug)}
            className={`${styles.pagerLink} ${styles.pagerNext}`}
            rel="next"
          >
            <span className={styles.pagerLabel}>Next quest →</span>
            {next.title}
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
