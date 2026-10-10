import { emitGameEvent } from '@/lib/game-events'
import { writeStorage } from '@/lib/storage'

export const themes = ['dungeon', 'parchment'] as const
export type Theme = (typeof themes)[number]

export const THEME_STORAGE_KEY = 'portfolio.theme'

export const themeLabels: Record<Theme, string> = {
  dungeon: 'Dungeon',
  parchment: 'Parchment',
}

/**
 * Runs before first paint (inlined in <head>) so the page never flashes the
 * wrong theme. Stored choice wins; otherwise the system preference decides.
 */
export const themeBootScript = `(() => {
  try {
    const stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    const theme = stored === 'dungeon' || stored === 'parchment'
      ? stored
      : matchMedia('(prefers-color-scheme: light)').matches ? 'parchment' : 'dungeon';
    document.documentElement.dataset.theme = theme;
  } catch {}
})();`

/** Switches to the other theme and remembers the choice. Client-only. */
export function toggleTheme() {
  const next: Theme =
    document.documentElement.dataset.theme === 'parchment' ? 'dungeon' : 'parchment'
  document.documentElement.dataset.theme = next
  writeStorage(THEME_STORAGE_KEY, next)
  emitGameEvent('theme:toggle')
  return next
}
