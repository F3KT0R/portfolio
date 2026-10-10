// Names of the pixel icons drawn in src/ui/icons.ts. Content refers to icons by
// these names (quest sigils, achievement badges), so the list lives in lib/ and
// the schema can reject an icon that does not exist.

export const iconNames = [
  'shield',
  'scroll',
  'gem',
  'map',
  'star',
  'flag',
  'quill',
  'key',
  'heart',
  'bolt',
  'potion',
  'chest',
  'skull',
  'eye',
  'sword',
] as const

export type IconName = (typeof iconNames)[number]
