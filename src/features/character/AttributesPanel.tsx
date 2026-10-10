import { character } from '@/content'
import { attributeModifier as modifier } from '@/game'
import { gloss } from '@/lib/glossary'
import { Frame, ItemCard } from '@/ui'
import styles from './AttributesPanel.module.css'

export function AttributesPanel() {
  return (
    <Frame title="Attributes" gloss={gloss.attributes} titleId="attributes" meta="tap for proof">
      <ul className={styles.grid}>
        {character.attributes.map((attr) => (
          <li key={attr.key}>
            <ItemCard
              id={`attr-${attr.key}`}
              rarity="rare"
              title={`${attr.name} ${attr.score}`}
              typeLine={`Attribute · modifier ${modifier(attr.score)}`}
              triggerClassName={styles.stat}
              trigger={
                <>
                  <span className={styles.key}>{attr.key}</span>
                  <span className={styles.score}>{attr.score}</span>
                  <span className={styles.mod}>{modifier(attr.score)}</span>
                  <span className={styles.name}>{attr.name}</span>
                </>
              }
            >
              <ul className={styles.evidence}>
                {attr.evidence.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </ItemCard>
          </li>
        ))}
      </ul>
    </Frame>
  )
}
