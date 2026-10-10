import { newCompanionSeed, parseCompanionState, type CompanionState } from '@/game'
import { onGameEvent } from '@/lib/game-events'
import { readStorage, writeStorage } from '@/lib/storage'

// The visitor's companion as an external store for useSyncExternalStore. Only
// the seed and the hidden flag are stored; the sprite is redrawn from the seed.
// The server renders no companion, so hydration never mismatches. The store
// answers the game bus, so the palette and the Codex card can command it
// without importing it.

const STORAGE_KEY = 'portfolio.companion.v1'

let state: CompanionState | null | undefined
const listeners = new Set<() => void>()
let stopListening: (() => void) | null = null

function cryptoRandom() {
  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  return (buffer[0] ?? 0) / 2 ** 32
}

function current() {
  if (state === undefined) state = parseCompanionState(readStorage(STORAGE_KEY))
  return state
}

function save(next: CompanionState) {
  state = next
  writeStorage(STORAGE_KEY, JSON.stringify(next))
  for (const listener of listeners) listener()
}

function roll(): CompanionState {
  return { version: 1, seed: newCompanionSeed(cryptoRandom), hidden: false }
}

export const companionStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    stopListening ??= onGameEvent((name) => {
      if (name === 'companion:reroll') save(roll())
      if (name === 'companion:toggle') {
        const now = current() ?? roll()
        save({ ...now, hidden: !now.hidden })
      }
    })
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        stopListening?.()
        stopListening = null
      }
    }
  },
  getSnapshot: current,
  getServerSnapshot: (): CompanionState | null => null,

  /** First visit: roll a companion. Called after hydration. */
  ensure() {
    if (current() === null) save(roll())
  },
}
