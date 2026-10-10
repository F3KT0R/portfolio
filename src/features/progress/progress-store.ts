import { achievements, type Achievement } from '@/content'
import {
  emptyProgress,
  parseProgress,
  reduceProgress,
  type Progress,
  type ProgressAction,
} from '@/game'
import { readStorage, removeStorage, writeStorage } from '@/lib/storage'

// The visitor's progress as an external store for useSyncExternalStore. It is
// read lazily on the client; the server always renders the empty state, so
// hydration never mismatches and the real progress appears right after.

const STORAGE_KEY = 'portfolio.progress.v1'

let progress: Progress | null = null
let toasts: readonly Achievement[] = []
const listeners = new Set<() => void>()

function current() {
  progress ??= parseProgress(readStorage(STORAGE_KEY))
  return progress
}

function notify() {
  for (const listener of listeners) listener()
}

export const progressStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: current,
  getServerSnapshot: () => emptyProgress,
  getToasts: () => toasts,
  getServerToasts: () => toasts,

  dispatch(action: ProgressAction) {
    const result = reduceProgress(current(), action, achievements, new Date())
    if (result.progress === progress) return
    progress = result.progress
    writeStorage(STORAGE_KEY, JSON.stringify(progress))
    if (result.unlocked.length > 0) toasts = [...toasts, ...result.unlocked]
    notify()
  },

  dismissToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  },

  reset() {
    progress = emptyProgress
    toasts = []
    removeStorage(STORAGE_KEY)
    notify()
  },
}
