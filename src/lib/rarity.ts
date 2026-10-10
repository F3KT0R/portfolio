// The rarity scale: shared vocabulary between content (a skill's tier) and the
// UI (the colour of a frame or a tag).
export const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'] as const
export type Rarity = (typeof rarities)[number]
