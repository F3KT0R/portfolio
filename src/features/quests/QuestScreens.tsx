import Image from 'next/image'
import type { Quest, Shot } from '@/content'
import { BeforeAfter, PanelGrid, panelWide, SectionHeading, spansRow } from '@/ui'
import styles from './QuestScreens.module.css'

/** The image a card shows: the "after" of a comparison, else the first screenshot. */
export function questCover(quest: Quest): Shot | undefined {
  return quest.compare?.after ?? quest.gallery[0]
}

/** Screenshots in the panel flow, with a before/after slider first when there is one. */
export function QuestScreens({ quest }: { quest: Quest }) {
  const { compare, gallery } = quest
  if (!compare && gallery.length === 0) return null

  return (
    <section aria-labelledby="screens" className={styles.screens}>
      <SectionHeading id="screens">Screens</SectionHeading>
      {compare ? <BeforeAfter {...compare} /> : null}
      {gallery.length > 0 ? (
        <PanelGrid as="ul">
          {gallery.map((shot, index) => (
            <li key={shot.src} className={spansRow(index, gallery.length) ? panelWide : undefined}>
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  <Image
                    className={styles.image}
                    src={shot.src}
                    width={shot.width}
                    height={shot.height}
                    alt={shot.alt}
                    sizes="(width >= 56rem) 36rem, 100vw"
                  />
                </div>
                {shot.caption ? (
                  <figcaption className={styles.caption}>{shot.caption}</figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </PanelGrid>
      ) : null}
    </section>
  )
}
