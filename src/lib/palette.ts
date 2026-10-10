// The primitive palette for places CSS custom properties cannot reach
// (Open Graph images, the web manifest). src/styles/tokens.css declares the
// same primitives; scripts/check-color-tokens.mjs fails when the two differ.

export const palette = {
  'ink-950': '#0d0c12',
  'ink-900': '#14131b',
  'ink-850': '#1a1923',
  'ink-800': '#211f2c',
  'ink-700': '#2e2b3c',
  'ink-600': '#433f55',
  'ink-400': '#8f89a6',
  'bone-50': '#f7f0e1',
  'bone-100': '#efe5cf',
  'bone-200': '#e4d6b6',
  'bone-300': '#cdb98f',
  'bone-500': '#6b5a3c',
  'bone-700': '#4a3c27',
  'bone-900': '#2a2118',
  'gold-300': '#f0c86a',
  'gold-400': '#e3b453',
  'gold-600': '#9c7016',
  'gold-800': '#6e4f0f',
  'ember-400': '#ef7d52',
  'ember-700': '#a63d15',
  'moss-400': '#6fcf6a',
  'moss-700': '#2c6e29',
  'tide-400': '#64a8ff',
  'tide-700': '#1f56b0',
  'arcane-400': '#bb8cf5',
  'arcane-700': '#6c34b3',
  'flame-400': '#f5a04a',
  'flame-700': '#96470a',
  'ash-400': '#a7a3b3',
  'ash-700': '#615c57',
} as const

export type PaletteKey = keyof typeof palette
