import Link from 'next/link'
import {
  chronicle,
  getQuestsUsingSkill,
  getSkillsByBranch,
  rarities,
  rarityMeaning,
  skillBranches,
  skillBranchLabels,
  type SkillBranch,
} from '@/content'
import type { IconName } from '@/lib/icon-names'
import { routes } from '@/lib/routes'
import { Frame, ItemCard, PanelGrid, panelWide, PixelIcon, spansRow } from '@/ui'
import { buildTree, type SkillNode } from './tree'
import styles from './SkillTree.module.css'

const branchIcon: Record<SkillBranch, IconName> = {
  frontend: 'sword',
  backend: 'key',
  quality: 'shield',
  delivery: 'bolt',
  craft: 'quill',
}

export function RarityLegend() {
  return (
    <ul className={styles.legend} aria-label="What the colours mean">
      {[...rarities].reverse().map((rarity) => (
        <li key={rarity} data-rarity={rarity} className={styles.legendItem}>
          {rarityMeaning[rarity]}
        </li>
      ))}
    </ul>
  )
}

/**
 * The branches in the site's panel flow: rows of two, and an odd last branch
 * across the full row with its sub-trees side by side. Every skill is an item
 * card listing the quests that prove it.
 */
export function SkillTree() {
  return (
    <PanelGrid>
      {skillBranches.map((branch, index) => {
        const wide = spansRow(index, skillBranches.length)
        return (
          <Frame
            key={branch}
            waypoint="skills"
            className={wide ? panelWide : undefined}
            title={
              <span className={styles.branchTitle}>
                <PixelIcon name={branchIcon[branch]} size={16} />
                {skillBranchLabels[branch]}
              </span>
            }
            titleId={`branch-${branch}`}
          >
            <SkillList nodes={buildTree(getSkillsByBranch(branch))} spread={wide} />
          </Frame>
        )
      })}
    </PanelGrid>
  )
}

type ListProps = {
  nodes: SkillNode[]
  nested?: boolean
  /** Lay root sub-trees out side by side (a full-row branch). */
  spread?: boolean
}

function SkillList({ nodes, nested = false, spread = false }: ListProps) {
  return (
    <ul className={nested ? styles.children : spread ? styles.spread : styles.list}>
      {nodes.map((node) => (
        <li key={node.id} id={node.id} className={styles.node}>
          <SkillItem node={node} />
          {node.children.length > 0 ? <SkillList nodes={node.children} nested /> : null}
        </li>
      ))}
    </ul>
  )
}

function SkillItem({ node }: { node: SkillNode }) {
  const proofQuests = getQuestsUsingSkill(node.id)
  const proofJobs = chronicle.filter((entry) => entry.skills.includes(node.id))

  return (
    <ItemCard
      id={`skill-${node.id}`}
      rarity={node.rarity}
      title={node.name}
      typeLine={`${rarityMeaning[node.rarity]} · since ${node.since}`}
      triggerClassName={styles.skill}
      trigger={
        <>
          <span className={styles.gem} aria-hidden />
          <span className={styles.skillName}>{node.name}</span>
          <span className={styles.since}>{node.since}</span>
        </>
      }
    >
      <p>{node.covers}</p>
      {proofQuests.length > 0 ? (
        <>
          <p className={styles.proofLabel}>Proven in</p>
          <ul className={styles.proof}>
            {proofQuests.map((q) => (
              <li key={q.slug}>
                <Link href={routes.quest(q.slug)}>{q.title}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {proofJobs.length > 0 ? (
        <>
          <p className={styles.proofLabel}>Used at</p>
          <ul className={styles.proof}>
            {proofJobs.map((entry) => (
              <li key={entry.id}>{entry.org}</li>
            ))}
          </ul>
        </>
      ) : null}
    </ItemCard>
  )
}
