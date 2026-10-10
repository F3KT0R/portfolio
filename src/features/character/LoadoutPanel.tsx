import Link from 'next/link'
import { character, getSkill, rarityMeaning } from '@/content'
import type { IconName } from '@/lib/icon-names'
import { routes } from '@/lib/routes'
import { Frame, ItemCard, PixelIcon } from '@/ui'
import styles from './LoadoutPanel.module.css'

const slotLabel: Record<
  (typeof character.loadout)[number]['slot'],
  { label: string; icon: IconName }
> = {
  'main-hand': { label: 'Main hand', icon: 'sword' },
  'off-hand': { label: 'Off hand', icon: 'shield' },
  helm: { label: 'Helm', icon: 'skull' },
  armor: { label: 'Armor', icon: 'shield' },
  boots: { label: 'Boots', icon: 'bolt' },
  ring: { label: 'Ring', icon: 'gem' },
  amulet: { label: 'Amulet', icon: 'heart' },
  trinket: { label: 'Trinket', icon: 'potion' },
}

/** The equipped stack, as gear. Each item opens a tooltip with the real skill behind it. */
export function LoadoutPanel() {
  return (
    <Frame title="Loadout" titleId="loadout" meta="equipped">
      <ul className={styles.grid}>
        {character.loadout.map((item) => {
          const skill = getSkill(item.skill)
          if (!skill) return null
          const slot = slotLabel[item.slot]
          return (
            <li key={item.slot}>
              <ItemCard
                id={`gear-${item.slot}`}
                rarity={skill.rarity}
                title={skill.name}
                typeLine={`${rarityMeaning[skill.rarity]} · ${slot.label} · since ${skill.since}`}
                flavor={item.flavor}
                triggerClassName={styles.slot}
                trigger={
                  <>
                    <PixelIcon name={slot.icon} size={24} className={styles.icon} />
                    <span className={styles.slotName}>{slot.label}</span>
                    <span className={styles.item}>{skill.name}</span>
                  </>
                }
              >
                <p>{skill.covers}</p>
                <p className={styles.more}>
                  <Link href={routes.skill(skill.id)}>See it in the skill tree →</Link>
                </p>
              </ItemCard>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}
