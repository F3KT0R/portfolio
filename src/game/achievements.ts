import { z } from 'zod'
import type { Achievement, Condition } from '@/content'
import type { GameEventName } from '@/lib/game-events'

// The achievement engine: a pure reducer over the visitor's progress. The UI
// layer persists the state and shows toasts; nothing here touches the DOM.

export const progressSchema = z.object({
  version: z.literal(1),
  visited: z.array(z.string()),
  events: z.array(z.string()),
  /** Achievement id → ISO time it unlocked. */
  unlocked: z.record(z.string(), z.iso.datetime()),
})
export type Progress = z.infer<typeof progressSchema>

export type ProgressAction =
  { type: 'visit'; path: string } | { type: 'event'; name: GameEventName }

export const emptyProgress: Progress = { version: 1, visited: [], events: [], unlocked: {} }

/** Trailing slashes and query strings do not make a page a different place. */
export function normalizePath(path: string) {
  const bare = path.split(/[?#]/)[0] ?? '/'
  return bare.length > 1 ? bare.replace(/\/+$/, '') : '/'
}

export function isMet(condition: Condition, progress: Progress) {
  switch (condition.kind) {
    case 'visit':
      return progress.visited.includes(condition.path)
    case 'visit-prefix':
      return (
        progress.visited.filter((p) => p.startsWith(condition.prefix)).length >= condition.count
      )
    case 'visit-all':
      return condition.paths.every((p) => progress.visited.includes(p))
    case 'event':
      return progress.events.includes(condition.event)
  }
}

function withAction(progress: Progress, action: ProgressAction): Progress {
  if (action.type === 'visit') {
    const path = normalizePath(action.path)
    return progress.visited.includes(path)
      ? progress
      : { ...progress, visited: [...progress.visited, path] }
  }
  return progress.events.includes(action.name)
    ? progress
    : { ...progress, events: [...progress.events, action.name] }
}

/**
 * Applies one action and unlocks every achievement whose condition is now met.
 * Returns the same `progress` object when nothing changed, so callers can skip
 * persisting and re-rendering.
 */
export function reduceProgress(
  progress: Progress,
  action: ProgressAction,
  achievements: readonly Achievement[],
  now: Date,
): { progress: Progress; unlocked: Achievement[] } {
  const next = withAction(progress, action)
  const unlocked = achievements.filter((a) => !(a.id in next.unlocked) && isMet(a.condition, next))
  if (next === progress && unlocked.length === 0) return { progress, unlocked }

  const stamp = now.toISOString()
  return {
    progress: {
      ...next,
      unlocked: { ...next.unlocked, ...Object.fromEntries(unlocked.map((a) => [a.id, stamp])) },
    },
    unlocked,
  }
}

/** Parses stored progress; anything unreadable or tampered with starts fresh. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress
  try {
    const parsed = progressSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : emptyProgress
  } catch {
    return emptyProgress
  }
}

export function totalXp(progress: Progress, achievements: readonly Achievement[]) {
  return achievements.reduce((sum, a) => (a.id in progress.unlocked ? sum + a.xp : sum), 0)
}
