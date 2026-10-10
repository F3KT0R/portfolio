import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { gameEventNames } from '@/lib/game-events'
import { malformedRedactions } from '@/lib/redaction'
import { primaryNav, routes } from '@/lib/routes'
import { iconNames } from '@/lib/icon-names'
import {
  achievements,
  character,
  chronicle,
  getQuestsUsingSkill,
  quests,
  skillIds,
  skills,
  testimonials,
} from './index'

// Cross-references that a schema cannot see on its own. A failure here names
// the entry to fix.

const skillSet = new Set<string>(skillIds)
const questSlugs = new Set(quests.map((q) => q.slug))
const icons = new Set<string>(iconNames)

function duplicates(values: string[]) {
  return values.filter((v, i) => values.indexOf(v) !== i)
}

describe('skills', () => {
  it('only require skills that exist, in the same branch', () => {
    for (const id of skillIds) {
      const { requires, branch } = skills[id]
      if (!requires) continue
      expect(skillSet.has(requires), `${id} requires unknown ${requires}`).toBe(true)
      expect(skills[requires as typeof id].branch, `${id} → ${requires} crosses branches`).toBe(
        branch,
      )
    }
  })

  it('are proven by at least one quest or chronicle entry', () => {
    const fromChronicle = new Set(chronicle.flatMap((c) => c.skills))
    const unproven = skillIds.filter(
      (id) => getQuestsUsingSkill(id).length === 0 && !fromChronicle.has(id),
    )
    expect(unproven).toEqual([])
  })
})

describe('quests', () => {
  it('have unique slugs', () => {
    expect(duplicates(quests.map((q) => q.slug))).toEqual([])
  })

  it('reference existing skills, without repeats', () => {
    for (const q of quests) {
      expect(
        q.stack.filter((s) => !skillSet.has(s)),
        q.slug,
      ).toEqual([])
      expect(duplicates(q.stack), q.slug).toEqual([])
    }
  })

  it('use redaction marks only when classified, and only well-formed ones', () => {
    for (const q of quests) {
      const text = JSON.stringify(q)
      expect(malformedRedactions(text), q.slug).toEqual([])
      if (!q.classified) expect(text.includes('[[redacted:'), q.slug).toBe(false)
    }
  })

  it('use a sigil that exists', () => {
    for (const q of quests) expect(icons.has(q.sigil), `${q.slug}: ${q.sigil}`).toBe(true)
  })

  it('end after they start', () => {
    for (const q of quests) if (q.end) expect(q.end >= q.start, q.slug).toBe(true)
  })

  it('link code or explain why not', () => {
    for (const q of quests) expect(Boolean(q.links.repo || q.links.repoNote), q.slug).toBe(true)
  })

  it('are completed exactly when they have an end date', () => {
    for (const q of quests) expect(q.status === 'completed', q.slug).toBe(Boolean(q.end))
  })
})

describe('character', () => {
  it('equips existing skills in distinct slots', () => {
    for (const item of character.loadout) expect(skillSet.has(item.skill), item.skill).toBe(true)
    expect(duplicates(character.loadout.map((i) => i.slot))).toEqual([])
  })

  it('has distinct attribute keys', () => {
    expect(duplicates(character.attributes.map((a) => a.key))).toEqual([])
  })
})

describe('chronicle', () => {
  it('is newest first', () => {
    const starts = chronicle.map((c) => c.start)
    expect(starts).toEqual([...starts].sort().reverse())
  })

  it('references existing skills and quests', () => {
    for (const c of chronicle) {
      expect(
        c.skills.filter((s) => !skillSet.has(s)),
        c.id,
      ).toEqual([])
      expect(
        c.quests.filter((s) => !questSlugs.has(s)),
        c.id,
      ).toEqual([])
    }
  })
})

describe('achievements', () => {
  const staticPaths = new Set<string>([...primaryNav.map((n) => n.href), routes.tldr])

  it('have unique ids and existing icons', () => {
    expect(duplicates(achievements.map((a) => a.id))).toEqual([])
    for (const a of achievements) expect(icons.has(a.icon), `${a.id}: ${a.icon}`).toBe(true)
  })

  it('point at real pages and real events', () => {
    for (const { id, condition: c } of achievements) {
      if (c.kind === 'visit') expect(staticPaths.has(c.path), id).toBe(true)
      if (c.kind === 'visit-all')
        for (const p of c.paths) expect(staticPaths.has(p), `${id}: ${p}`).toBe(true)
      if (c.kind === 'visit-prefix') expect(c.count, id).toBeLessThanOrEqual(quests.length)
      if (c.kind === 'event') expect(gameEventNames as readonly string[], id).toContain(c.event)
    }
  })

  it('can all be earned: every event on the bus has an achievement', () => {
    const listened = new Set(
      achievements.flatMap((a) => (a.condition.kind === 'event' ? [a.condition.event] : [])),
    )
    expect(gameEventNames.filter((e) => !listened.has(e))).toEqual([])
  })
})

describe('testimonials', () => {
  it('have unique ids and point at existing quests', () => {
    expect(duplicates(testimonials.map((t) => t.id))).toEqual([])
    for (const t of testimonials) if (t.quest) expect(questSlugs.has(t.quest), t.id).toBe(true)
  })

  it('were approved on a real date, not in the future', () => {
    for (const t of testimonials) {
      const approved = new Date(`${t.approvedOn}T00:00:00Z`)
      expect(Number.isNaN(approved.getTime()), t.id).toBe(false)
      expect(approved.getTime(), t.id).toBeLessThanOrEqual(Date.now())
    }
  })
})

describe('screenshots', () => {
  const shots = quests.flatMap((q) => [
    ...q.gallery.map((shot) => ({ quest: q.slug, shot })),
    ...(q.compare
      ? [q.compare.before, q.compare.after].map((shot) => ({ quest: q.slug, shot }))
      : []),
  ])

  it.each(shots)(
    '$shot.src exists in its quest folder with the declared size',
    async ({ quest, shot }) => {
      expect(shot.src.startsWith(`/media/quests/${quest}/`), shot.src).toBe(true)
      const file = path.join(process.cwd(), 'public', shot.src)
      expect(fs.existsSync(file), shot.src).toBe(true)
      const { width, height } = await sharp(file).metadata()
      expect({ width, height }).toEqual({ width: shot.width, height: shot.height })
    },
  )
})
