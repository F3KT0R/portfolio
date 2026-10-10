import Image from 'next/image'
import Link from 'next/link'
import { getSkill, type Quest } from '@/content'
import { formatPeriod } from '@/lib/dates'
import { routes } from '@/lib/routes'
import { Frame, PixelIcon, RedactedText, Stamp, Tag, TagList } from '@/ui'
import { Difficulty, QuestBanner, QuestStatus } from './QuestBits'
import { questCover } from './QuestScreens'
import styles from './QuestCard.module.css'

const STACK_PREVIEW = 5

/** A quest in the log. The whole card is one link target (the title). */
export function QuestCard({
  quest,
  headingLevel = 'h3',
}: {
  quest: Quest
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  const stack = quest.stack.slice(0, STACK_PREVIEW).flatMap((id) => getSkill(id) ?? [])
  const more = quest.stack.length - stack.length
  const cover = questCover(quest)

  return (
    <Frame as="article" className={styles.card}>
      {cover ? (
        // Decorative here: the quest page carries the described screenshots.
        <Image
          className={styles.cover}
          src={cover.src}
          width={cover.width}
          height={cover.height}
          alt=""
          sizes="(width >= 56rem) 36rem, 100vw"
        />
      ) : null}
      <div className={styles.layout}>
        <QuestBanner quest={quest} />
        <div className={styles.main}>
          <div className={styles.top}>
            <QuestStatus status={quest.status} />
            {quest.classified ? <Stamp>Classified</Stamp> : null}
            {quest.boss ? (
              <span className={styles.boss}>
                <PixelIcon name="skull" size={14} /> Boss defeated
              </span>
            ) : null}
            <Difficulty value={quest.difficulty} />
          </div>
          <Heading className={styles.title}>
            <Link href={routes.quest(quest.slug)} className={styles.link}>
              {quest.title}
            </Link>
          </Heading>
          <p className={styles.epithet}>{quest.epithet}</p>
          <p className={styles.meta}>
            <RedactedText>{quest.giver}</RedactedText> · {formatPeriod(quest.start, quest.end)}
          </p>
          <p className={styles.summary}>
            <RedactedText>{quest.plain}</RedactedText>
          </p>
          <TagList label="Stack">
            {stack.map((skill) => (
              <li key={skill.id}>
                <Tag rarity={skill.rarity}>{skill.name}</Tag>
              </li>
            ))}
            {more > 0 ? (
              <li>
                <Tag>+{more}</Tag>
              </li>
            ) : null}
          </TagList>
        </div>
      </div>
    </Frame>
  )
}
