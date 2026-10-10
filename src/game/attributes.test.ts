import { describe, expect, it } from 'vitest'
import { attributeModifier } from './attributes'

describe('attributeModifier', () => {
  it.each([
    [8, '-1'],
    [10, '+0'],
    [11, '+0'],
    [13, '+1'],
    [16, '+3'],
    [17, '+3'],
    [20, '+5'],
  ])('score %i → %s', (score, expected) => expect(attributeModifier(score)).toBe(expected))
})
