import { describe, expect, it } from 'vitest'
import { getSkillsByBranch, skillBranches, type SkillWithId } from '@/content'
import { buildTree, type SkillNode } from './tree'

const skill = (id: string, requires?: string) =>
  ({
    id,
    name: id,
    branch: 'frontend',
    rarity: 'rare',
    since: 2020,
    covers: 'x',
    requires,
  }) as SkillWithId

const flatten = (nodes: SkillNode[]): string[] =>
  nodes.flatMap((n) => [n.id, ...flatten(n.children)])

describe('buildTree', () => {
  it('nests skills under their prerequisite', () => {
    const tree = buildTree([
      skill('ts'),
      skill('react', 'ts'),
      skill('next', 'react'),
      skill('css'),
    ])
    expect(tree.map((n) => n.id)).toEqual(['ts', 'css'])
    expect(tree[0]?.children[0]?.id).toBe('react')
    expect(tree[0]?.children[0]?.children[0]?.id).toBe('next')
  })

  it('treats a prerequisite outside the list as a root', () => {
    expect(buildTree([skill('docker', 'ci')]).map((n) => n.id)).toEqual(['docker'])
  })

  it.each(skillBranches)('places every %s skill exactly once', (branch) => {
    const skills = getSkillsByBranch(branch)
    const placed = flatten(buildTree(skills))
    expect(placed.sort()).toEqual(skills.map((s) => s.id).sort())
  })
})
