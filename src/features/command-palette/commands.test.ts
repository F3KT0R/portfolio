import { describe, expect, it } from 'vitest'
import { buildCommands, filterCommands } from './commands'

const commands = buildCommands()
const labels = (query: string) => filterCommands(commands, query).map((c) => c.label)

describe('filterCommands', () => {
  it('returns everything for an empty query', () => {
    expect(filterCommands(commands, '   ')).toHaveLength(commands.length)
  })

  it('matches subsequences, case-insensitively', () => {
    expect(labels('QSTS')).toContain('Quests')
  })

  it('ranks label matches above keyword matches', () => {
    const results = labels('cv')
    expect(results[0]).toBe('Download CV (PDF)')
    expect(results).toContain('TL;DR — the one-page résumé')
  })

  it('finds quests by their stack', () => {
    expect(labels('playwright')).toContain('Union-Medic')
  })

  it('returns nothing when no command matches', () => {
    expect(labels('zzzz')).toEqual([])
  })

  it('has unique ids', () => {
    const ids = commands.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
