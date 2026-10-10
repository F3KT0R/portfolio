import { describe, expect, it } from 'vitest'
import { chronicle } from '@/content'
import { cvEducation, cvExperience, cvProjects, cvSkills, cvStack } from './cv-data'

describe('CV content', () => {
  it('never lists a project twice', () => {
    const inExperience = new Set(chronicle.flatMap((entry) => entry.quests))
    for (const quest of cvProjects()) expect(inExperience.has(quest.slug), quest.slug).toBe(false)
  })

  it('keeps past roles shorter than current ones', () => {
    for (const entry of cvExperience()) {
      expect(entry.shown.length, entry.id).toBeLessThanOrEqual(entry.end ? 2 : 4)
      expect(entry.shown.length, entry.id).toBeGreaterThan(0)
    }
  })

  it('separates education from experience', () => {
    expect(cvEducation().every((e) => e.kind === 'education')).toBe(true)
    expect(cvExperience().some((e) => e.kind === 'education')).toBe(false)
  })

  it('has skills in every branch', () => {
    for (const group of cvSkills()) expect(group.names.length, group.branch).toBeGreaterThan(0)
  })
})

describe('CV stack lines', () => {
  it('list technology only', () => {
    for (const quest of cvProjects()) {
      expect(
        cvStack(quest).some((s) => s.branch === 'craft'),
        quest.slug,
      ).toBe(false)
    }
  })
})
