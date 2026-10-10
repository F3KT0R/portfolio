import type { SkillWithId } from '@/content'

export type SkillNode = SkillWithId & { children: SkillNode[] }

/**
 * Arranges a branch's skills by their `requires` links: roots first, each
 * followed by what it unlocks. Order within a level follows the input order.
 * A skill whose prerequisite is outside the list becomes a root.
 */
export function buildTree(skills: readonly SkillWithId[]): SkillNode[] {
  const ids = new Set<string>(skills.map((s) => s.id))
  const childrenOf = (parent: string | undefined): SkillNode[] =>
    skills
      .filter((s) =>
        parent === undefined ? !s.requires || !ids.has(s.requires) : s.requires === parent,
      )
      .map((s) => ({ ...s, children: childrenOf(s.id) }))
  return childrenOf(undefined)
}
