// A tiny typed event bus on `window`. Features announce what the visitor did
// ("the palette opened", "the theme changed") without importing the progress
// feature, so any feature can be removed without breaking the others.

export const gameEventNames = [
  'palette:open',
  'theme:toggle',
  'cv:download',
  'party:recruited',
  'secret:konami',
  'secret:console',
  'secret:night',
] as const

export type GameEventName = (typeof gameEventNames)[number]

const CHANNEL = 'portfolio:game-event'

export function emitGameEvent(name: GameEventName) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<GameEventName>(CHANNEL, { detail: name }))
}

export function onGameEvent(listener: (name: GameEventName) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<GameEventName>).detail)
  window.addEventListener(CHANNEL, handler)
  return () => window.removeEventListener(CHANNEL, handler)
}
