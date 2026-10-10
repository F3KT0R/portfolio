import { describe, expect, it } from 'vitest'
import { iconNames } from '@/lib/icon-names'
import { ICON_SIZE, icons } from './icons'

describe('pixel icons', () => {
  it.each(iconNames)('%s is a 12×12 grid of #, o and .', (name) => {
    const grid = icons[name]
    expect(grid).toHaveLength(ICON_SIZE)
    for (const [row, line] of grid.entries()) {
      expect(line, `${name} row ${row}`).toMatch(new RegExp(`^[#o.]{${ICON_SIZE}}$`))
    }
  })
})
